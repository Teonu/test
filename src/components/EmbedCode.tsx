import React, { useState, useEffect } from 'react';
import { Copy, Code, ExternalLink, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface ChatbotConfig {
  id: string;
  assistantId: string;
  title: string;
  primaryColor: string;
  position: string;
  welcomeMessage: string;
}

const EmbedCode: React.FC = () => {
  const [copied, setCopied] = useState('');
  const [backendUrl, setBackendUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [chatbots, setChatbots] = useState<ChatbotConfig[]>([
    {
      id: '1',
      assistantId: '',
      title: 'Customer Support',
      primaryColor: '#3B82F6',
      position: 'bottom-right',
      welcomeMessage: 'Hello! How can I help you today?'
    }
  ]);

  useEffect(() => {
    // Extract base URL from API_BASE_URL
    const baseUrl = API_BASE_URL.replace('/api', '');
    setBackendUrl(baseUrl);
    setIsValidUrl(true);
  }, []);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      setIsValidUrl(true);
    } catch {
      setIsValidUrl(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setBackendUrl(url);
    validateUrl(url);
  };

  const addChatbot = () => {
    const newChatbot: ChatbotConfig = {
      id: Date.now().toString(),
      assistantId: '',
      title: 'New Chatbot',
      primaryColor: '#3B82F6',
      position: 'bottom-right',
      welcomeMessage: 'Hello! How can I help you today?'
    };
    setChatbots([...chatbots, newChatbot]);
  };

  const removeChatbot = (id: string) => {
    setChatbots(chatbots.filter(bot => bot.id !== id));
  };

  const updateChatbot = (id: string, updates: Partial<ChatbotConfig>) => {
    setChatbots(chatbots.map(bot => 
      bot.id === id ? { ...bot, ...updates } : bot
    ));
  };

  const generateEmbedCode = (chatbot: ChatbotConfig) => {
    return `<!-- Chatbot Widget: ${chatbot.title} -->
<script 
  src="${backendUrl}/widget.js"
  data-assistant-id="${chatbot.assistantId}"
  data-title="${chatbot.title}"
  data-color="${chatbot.primaryColor}"
  data-position="${chatbot.position}"
  data-welcome="${chatbot.welcomeMessage}"
  async>
</script>`;
  };

  const generateAdvancedEmbedCode = (chatbot: ChatbotConfig) => {
    return `<!-- Advanced Chatbot Widget: ${chatbot.title} -->
<script>
  // Optional: Custom configuration for ${chatbot.title}
  window.ChatbotWidgetConfig_${chatbot.assistantId.replace(/[^a-zA-Z0-9]/g, '_')} = {
    onOpen: function() {
      console.log('${chatbot.title} chatbot opened');
      // Add your analytics tracking here
      // gtag('event', 'chatbot_open', { assistant_id: '${chatbot.assistantId}' });
    },
    onClose: function() {
      console.log('${chatbot.title} chatbot closed');
    },
    onMessage: function(message, isUser) {
      console.log('${chatbot.title} message:', message, 'From user:', isUser);
    }
  };
</script>
<script 
  src="${backendUrl}/widget.js"
  data-assistant-id="${chatbot.assistantId}"
  data-title="${chatbot.title}"
  data-color="${chatbot.primaryColor}"
  data-position="${chatbot.position}"
  data-welcome="${chatbot.welcomeMessage}"
  async>
</script>

<!-- Control the widget programmatically -->
<script>
  // Access this specific widget instance:
  // window.ChatbotWidget_${chatbot.assistantId.replace(/[^a-zA-Z0-9]/g, '_')}.open()
  // window.ChatbotWidget_${chatbot.assistantId.replace(/[^a-zA-Z0-9]/g, '_')}.close()
  // window.ChatbotWidget_${chatbot.assistantId.replace(/[^a-zA-Z0-9]/g, '_')}.toggle()
</script>`;
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const testWidget = () => {
    if (isValidUrl) {
      window.open(`${backendUrl}/widget.js`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Backend URL Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backend Configuration</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backend URL
          </label>
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={backendUrl}
                onChange={handleUrlChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isValidUrl ? 'border-gray-300' : 'border-red-300'
                }`}
                placeholder="https://your-backend-domain.com"
              />
              <div className="flex items-center mt-2">
                {isValidUrl ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Valid URL</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Invalid URL format</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={testWidget}
              disabled={!isValidUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Test Script
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This URL will be used in the embed code. Only the OpenAI API key needs to be configured on the server.
          </p>
        </div>
      </div>

      {/* Multi-Assistant Benefits */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 rounded-lg p-2">
            <Code className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-900 mb-2">Multi-Assistant System</h3>
            <div className="text-sm text-green-800 space-y-2">
              <p>✅ <strong>One server, multiple chatbots</strong> - Use different Assistant IDs for different purposes</p>
              <p>✅ <strong>Secure API key</strong> - Only stored on the server, never exposed to frontend</p>
              <p>✅ <strong>Individual customization</strong> - Each chatbot can have unique colors, titles, and messages</p>
              <p>✅ <strong>Easy deployment</strong> - Configure once on Render.com, use everywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Configurations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Chatbot Configurations</h3>
          <button
            onClick={addChatbot}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Chatbot</span>
          </button>
        </div>

        <div className="space-y-6">
          {chatbots.map((chatbot, index) => (
            <div key={chatbot.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Chatbot #{index + 1}</h4>
                {chatbots.length > 1 && (
                  <button
                    onClick={() => removeChatbot(chatbot.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assistant ID *
                  </label>
                  <input
                    type="text"
                    value={chatbot.assistantId}
                    onChange={(e) => updateChatbot(chatbot.id, { assistantId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="asst_..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={chatbot.title}
                    onChange={(e) => updateChatbot(chatbot.id, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Customer Support"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={chatbot.primaryColor}
                      onChange={(e) => updateChatbot(chatbot.id, { primaryColor: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={chatbot.primaryColor}
                      onChange={(e) => updateChatbot(chatbot.id, { primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    value={chatbot.position}
                    onChange={(e) => updateChatbot(chatbot.id, { position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Welcome Message
                </label>
                <textarea
                  value={chatbot.welcomeMessage}
                  onChange={(e) => updateChatbot(chatbot.id, { welcomeMessage: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Hello! How can I help you today?"
                />
              </div>

              {/* Simple Embed Code */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">Simple Embed Code</h5>
                    <button
                      onClick={() => handleCopy(generateEmbedCode(chatbot), `simple-${chatbot.id}`)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copied === `simple-${chatbot.id}` ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                    <code>{generateEmbedCode(chatbot)}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">Advanced Embed Code</h5>
                    <button
                      onClick={() => handleCopy(generateAdvancedEmbedCode(chatbot), `advanced-${chatbot.id}`)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copied === `advanced-${chatbot.id}` ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                    <code>{generateAdvancedEmbedCode(chatbot)}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multiple Widgets Example */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Multiple Widgets Example</h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Example Use Cases</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p>• <strong>Customer Support:</strong> General help and questions (bottom-right, blue)</p>
              <p>• <strong>Sales Assistant:</strong> Product information and pricing (bottom-left, green)</p>
              <p>• <strong>Technical Support:</strong> Technical issues and troubleshooting (custom position)</p>
              <p>• <strong>HR Assistant:</strong> Employee questions and policies (different page)</p>
              <p>• <strong>Product Guide:</strong> Feature explanations and tutorials (specific pages)</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">Best Practices</h4>
                <div className="mt-2 text-sm text-yellow-700 space-y-1">
                  <p>• Use different Assistant IDs for different purposes/knowledge bases</p>
                  <p>• Avoid placing multiple widgets on the same page (use different positions if needed)</p>
                  <p>• Use descriptive titles to help users understand each chatbot's purpose</p>
                  <p>• Test each Assistant ID in OpenAI Playground before deploying</p>
                  <p>• Consider using different colors to distinguish between chatbot types</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render.com Setup */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Render.com Setup</h3>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Environment Variables Required</h4>
                <div className="mt-2 text-sm text-green-700">
                  <p>Only configure these on your Render.com server:</p>
                  <div className="bg-green-100 p-3 rounded mt-2 font-mono text-xs">
                    OPENAI_API_KEY=your_openai_api_key_here<br/>
                    JWT_SECRET=your-random-secret-key-here<br/>
                    ALLOWED_ORIGINS=*
                  </div>
                  <p className="mt-2"><strong>Note:</strong> Assistant IDs are now configured in the embed code, not on the server!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">✅ Server Configuration</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• One OpenAI API key for all chatbots</li>
                <li>• Secure environment variables</li>
                <li>• CORS enabled for all domains</li>
                <li>• Dynamic widget script generation</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">🎯 Frontend Configuration</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Assistant ID in embed code</li>
                <li>• Custom colors and titles</li>
                <li>• Position and welcome messages</li>
                <li>• No server restart needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedCode;