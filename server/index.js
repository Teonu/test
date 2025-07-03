import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['*'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins if ALLOWED_ORIGINS is "*"
    if (allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Configuration storage
let config = {
  apiKey: process.env.OPENAI_API_KEY || '',
  assistantId: process.env.ASSISTANT_ID || '',
  welcomeMessage: 'Hello! How can I help you today?',
  widgetConfig: {
    primaryColor: '#3B82F6',
    position: 'bottom-right',
    title: 'Chat Support'
  }
};

// Admin password hash (default: 'password')
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the dynamic widget script
app.get('/widget.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  const widgetScript = `
(function() {
  // Prevent multiple widget instances
  if (window.ChatbotWidget) {
    return;
  }

  // Get configuration from script tag
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  // Extract configuration from script tag attributes or URL parameters
  const scriptSrc = currentScript ? currentScript.src : '';
  const urlParams = new URLSearchParams(scriptSrc.split('?')[1] || '');
  
  // Widget configuration with defaults
  const config = {
    apiEndpoint: '${req.protocol}://${req.get('host')}/api',
    assistantId: currentScript?.getAttribute('data-assistant-id') || urlParams.get('assistant') || '',
    primaryColor: currentScript?.getAttribute('data-color') || urlParams.get('color') || '#3B82F6',
    position: currentScript?.getAttribute('data-position') || urlParams.get('position') || 'bottom-right',
    title: currentScript?.getAttribute('data-title') || urlParams.get('title') || 'Chat Support',
    welcomeMessage: currentScript?.getAttribute('data-welcome') || urlParams.get('welcome') || 'Hello! How can I help you today?'
  };

  // Validate required configuration
  if (!config.assistantId) {
    console.error('ChatbotWidget: Assistant ID is required. Please add data-assistant-id attribute to the script tag.');
    return;
  }

  // Widget state
  let isOpen = false;
  let messages = [];
  let threadId = null;
  let isLoading = false;

  function createWidgetHTML() {
    const container = document.createElement('div');
    container.id = 'chatbot-widget-container-' + config.assistantId;
    
    const positionClass = config.position === 'bottom-left' ? 'bottom: 20px; left: 20px;' : 'bottom: 20px; right: 20px;';
    
    container.innerHTML = \`
      <div id="chatbot-container-\${config.assistantId}" style="position: fixed; \${positionClass} z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Chat Window -->
        <div id="chat-window-\${config.assistantId}" style="display: none; margin-bottom: 16px; background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid #e5e7eb; width: 320px; height: 400px; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out;">
          <!-- Header -->
          <div id="chat-header-\${config.assistantId}" style="padding: 16px; border-radius: 12px 12px 0 0; color: white; display: flex; align-items: center; justify-content: space-between; background: \${config.primaryColor};">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span style="font-weight: 500;">\${config.title}</span>
            </div>
            <button id="close-chat-\${config.assistantId}" style="padding: 4px; background: rgba(255,255,255,0.2); border: none; border-radius: 4px; color: white; cursor: pointer; transition: background 0.2s;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <!-- Messages -->
          <div id="chat-messages-\${config.assistantId}" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            <!-- Messages will be added here -->
          </div>
          
          <!-- Input -->
          <div style="padding: 16px; border-top: 1px solid #e5e7eb;">
            <div style="display: flex; gap: 8px;">
              <input id="chat-input-\${config.assistantId}" type="text" placeholder="Type your message..." style="flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; outline: none; font-size: 14px; transition: border-color 0.2s;" />
              <button id="send-message-\${config.assistantId}" style="padding: 10px; background: \${config.primaryColor}; color: white; border: none; border-radius: 8px; cursor: pointer; transition: opacity 0.2s; min-width: 44px; display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Chat Button -->
        <button id="chat-button-\${config.assistantId}" style="width: 60px; height: 60px; background: \${config.primaryColor}; color: white; border: none; border-radius: 50%; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; position: relative;">
          <svg id="chat-icon-\${config.assistantId}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <svg id="close-icon-\${config.assistantId}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    \`;
    
    document.body.appendChild(container);
    attachEventListeners();
  }

  function attachEventListeners() {
    const chatButton = document.getElementById('chat-button-' + config.assistantId);
    const closeChat = document.getElementById('close-chat-' + config.assistantId);
    const chatInput = document.getElementById('chat-input-' + config.assistantId);
    const sendButton = document.getElementById('send-message-' + config.assistantId);

    chatButton?.addEventListener('click', toggleChat);
    closeChat?.addEventListener('click', () => toggleChat(false));
    chatInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    sendButton?.addEventListener('click', sendMessage);

    // Hover effects
    chatButton?.addEventListener('mouseenter', () => {
      chatButton.style.transform = 'scale(1.05)';
      chatButton.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
    });
    
    chatButton?.addEventListener('mouseleave', () => {
      chatButton.style.transform = 'scale(1)';
      chatButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    closeChat?.addEventListener('mouseenter', () => {
      closeChat.style.background = 'rgba(255,255,255,0.3)';
    });
    
    closeChat?.addEventListener('mouseleave', () => {
      closeChat.style.background = 'rgba(255,255,255,0.2)';
    });
  }

  function toggleChat(forceState = null) {
    isOpen = forceState !== null ? forceState : !isOpen;
    const chatWindow = document.getElementById('chat-window-' + config.assistantId);
    const chatIcon = document.getElementById('chat-icon-' + config.assistantId);
    const closeIcon = document.getElementById('close-icon-' + config.assistantId);
    
    if (isOpen) {
      chatWindow.style.display = 'flex';
      chatIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      
      if (messages.length === 0) {
        addMessage(config.welcomeMessage, false);
      }
      
      // Focus input
      setTimeout(() => {
        document.getElementById('chat-input-' + config.assistantId)?.focus();
      }, 100);
    } else {
      chatWindow.style.display = 'none';
      chatIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
  }

  function addMessage(text, isUser) {
    const messagesContainer = document.getElementById('chat-messages-' + config.assistantId);
    const messageElement = document.createElement('div');
    
    messageElement.style.display = 'flex';
    messageElement.style.justifyContent = isUser ? 'flex-end' : 'flex-start';
    messageElement.style.animation = 'fadeIn 0.3s ease-out';
    
    const messageContent = document.createElement('div');
    messageContent.style.maxWidth = '240px';
    messageContent.style.padding = '12px 16px';
    messageContent.style.borderRadius = '18px';
    messageContent.style.fontSize = '14px';
    messageContent.style.lineHeight = '1.4';
    messageContent.style.wordWrap = 'break-word';
    
    if (isUser) {
      messageContent.style.background = config.primaryColor;
      messageContent.style.color = 'white';
      messageContent.style.marginLeft = '40px';
      messageContent.style.borderBottomRightRadius = '4px';
    } else {
      messageContent.style.background = '#f1f5f9';
      messageContent.style.color = '#1e293b';
      messageContent.style.marginRight = '40px';
      messageContent.style.borderBottomLeftRadius = '4px';
    }
    
    messageContent.textContent = text;
    messageElement.appendChild(messageContent);
    messagesContainer.appendChild(messageElement);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    messages.push({ text, isUser, timestamp: new Date() });
  }

  function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages-' + config.assistantId);
    const typingElement = document.createElement('div');
    typingElement.id = 'typing-indicator-' + config.assistantId;
    typingElement.style.display = 'flex';
    typingElement.style.justifyContent = 'flex-start';
    typingElement.style.animation = 'fadeIn 0.3s ease-out';
    
    typingElement.innerHTML = \`
      <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 18px; margin-right: 40px; border-bottom-left-radius: 4px;">
        <div style="display: flex; gap: 4px; align-items: center;">
          <div style="width: 8px; height: 8px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
          <div style="width: 8px; height: 8px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.2s;"></div>
          <div style="width: 8px; height: 8px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.4s;"></div>
        </div>
      </div>
    \`;
    
    messagesContainer.appendChild(typingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator-' + config.assistantId);
    if (typingElement) {
      typingElement.remove();
    }
  }

  function sendMessage() {
    const input = document.getElementById('chat-input-' + config.assistantId);
    const sendButton = document.getElementById('send-message-' + config.assistantId);
    const message = input.value.trim();
    
    if (!message || isLoading) return;
    
    isLoading = true;
    addMessage(message, true);
    input.value = '';
    sendButton.disabled = true;
    sendButton.style.opacity = '0.6';
    
    showTypingIndicator();
    
    // Send to API with assistant ID
    fetch(config.apiEndpoint + '/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        threadId: threadId,
        assistantId: config.assistantId
      }),
    })
    .then(response => response.json())
    .then(data => {
      hideTypingIndicator();
      if (data.message) {
        addMessage(data.message, false);
        if (data.threadId) {
          threadId = data.threadId;
        }
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', false);
      }
    })
    .catch(error => {
      hideTypingIndicator();
      console.error('Chat error:', error);
      addMessage('Sorry, I encountered an error. Please try again.', false);
    })
    .finally(() => {
      isLoading = false;
      sendButton.disabled = false;
      sendButton.style.opacity = '1';
      input.focus();
    });
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = \`
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-10px); opacity: 1; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    #chat-input-\${config.assistantId}:focus {
      border-color: \${config.primaryColor} !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
  \`;
  document.head.appendChild(style);

  // Initialize widget
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidgetHTML);
  } else {
    createWidgetHTML();
  }

  // Expose widget API with unique namespace
  const widgetId = 'ChatbotWidget_' + config.assistantId.replace(/[^a-zA-Z0-9]/g, '_');
  window[widgetId] = {
    open: () => toggleChat(true),
    close: () => toggleChat(false),
    toggle: () => toggleChat(),
    isOpen: () => isOpen,
    sendMessage: (text) => {
      if (text) {
        document.getElementById('chat-input-' + config.assistantId).value = text;
        sendMessage();
      }
    },
    config: config
  };

  // Also expose as generic ChatbotWidget if it doesn't exist
  if (!window.ChatbotWidget) {
    window.ChatbotWidget = window[widgetId];
  }
})();
`;

  res.send(widgetScript);
});

// Routes
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;
  
  try {
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { admin: true },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/config', authenticateToken, (req, res) => {
  // Don't send the actual API key, just indicate if it's set
  res.json({
    ...config,
    apiKey: config.apiKey ? '***HIDDEN***' : '',
    hasApiKey: !!config.apiKey
  });
});

app.post('/api/admin/config', authenticateToken, (req, res) => {
  const { apiKey, assistantId, welcomeMessage, widgetConfig } = req.body;
  
  // Update configuration
  if (apiKey && apiKey !== '***HIDDEN***') {
    config.apiKey = apiKey;
  }
  if (assistantId) {
    config.assistantId = assistantId;
  }
  if (welcomeMessage) {
    config.welcomeMessage = welcomeMessage;
  }
  if (widgetConfig) {
    config.widgetConfig = { ...config.widgetConfig, ...widgetConfig };
  }

  res.json({ message: 'Configuration saved successfully' });
});

app.get('/api/widget/config', (req, res) => {
  // Only send public configuration data
  res.json({
    welcomeMessage: config.welcomeMessage,
    widgetConfig: config.widgetConfig
  });
});

app.post('/api/chat', async (req, res) => {
  const { message, threadId, assistantId } = req.body;
  
  if (!config.apiKey) {
    return res.status(400).json({ error: 'OpenAI API key not configured. Please contact the administrator.' });
  }

  if (!assistantId) {
    return res.status(400).json({ error: 'Assistant ID is required.' });
  }

  try {
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });

    let thread;
    if (threadId) {
      try {
        thread = await openai.beta.threads.retrieve(threadId);
      } catch (error) {
        // If thread doesn't exist, create a new one
        thread = await openai.beta.threads.create();
      }
    } else {
      thread = await openai.beta.threads.create();
    }

    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    });

    // Run the assistant with the provided assistant ID
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    // Wait for completion with timeout
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    
    while ((runStatus.status === 'queued' || runStatus.status === 'in_progress') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      attempts++;
    }

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      res.json({
        message: lastMessage.content[0].text.value,
        threadId: thread.id
      });
    } else if (runStatus.status === 'failed') {
      console.error('Assistant run failed:', runStatus.last_error);
      res.status(500).json({ error: 'Assistant failed to process the message' });
    } else {
      console.error('Assistant run timed out or incomplete:', runStatus.status);
      res.status(500).json({ error: 'Request timed out. Please try again.' });
    }
  } catch (error) {
    console.error('Chat error:', error);
    if (error.message.includes('No assistant found')) {
      res.status(400).json({ error: 'Invalid Assistant ID. Please check your configuration.' });
    } else {
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Widget script: http://localhost:${PORT}/widget.js`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});