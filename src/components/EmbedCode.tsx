import React, { useState, useEffect } from 'react';
import { Copy, Code, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const EmbedCode: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [backendUrl, setBackendUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

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

  // Simple embed code that just loads the dynamic script
  const embedCode = `<!-- Chatbot Widget - Simple Integration -->
<script src="${backendUrl}/widget.js" async></script>`;

  // Advanced embed code with customization options
  const advancedEmbedCode = `<!-- Chatbot Widget - Advanced Integration -->
<script>
  // Optional: Customize widget before loading
  window.ChatbotWidgetConfig = {
    // Override default position (optional)
    // position: 'bottom-left', // or 'bottom-right'
    
    // Override default colors (optional)
    // primaryColor: '#3B82F6',
    
    // Custom event handlers (optional)
    onOpen: function() {
      console.log('Chatbot opened');
      // Add your analytics tracking here
    },
    onClose: function() {
      console.log('Chatbot closed');
    },
    onMessage: function(message, isUser) {
      console.log('Message:', message, 'From user:', isUser);
    }
  };
</script>
<script src="${backendUrl}/widget.js" async></script>

<!-- Optional: Control the widget programmatically -->
<script>
  // Wait for widget to load, then you can use:
  // ChatbotWidget.open()     - Open the chat
  // ChatbotWidget.close()    - Close the chat
  // ChatbotWidget.toggle()   - Toggle open/close
  // ChatbotWidget.isOpen()   - Check if open
  // ChatbotWidget.sendMessage('Hello') - Send a message
</script>`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            This URL will be used in the embed code. The script will automatically load from this server.
          </p>
        </div>
      </div>

      {/* Dynamic Script Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <Code className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Dynamic Script System</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>✅ <strong>No code changes needed</strong> - Update widget settings from admin panel</p>
              <p>✅ <strong>Automatic updates</strong> - Widget always loads latest configuration</p>
              <p>✅ <strong>Real-time changes</strong> - Colors, messages, and settings update instantly</p>
              <p>✅ <strong>One-time setup</strong> - Embed once, manage forever</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Embed Code */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Simple Integration</h3>
          <button
            onClick={() => handleCopy(embedCode)}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{embedCode}</code>
          </pre>
        </div>
        
        <p className="text-sm text-gray-600 mt-3">
          This is all you need! The script automatically loads your widget with current settings.
        </p>
      </div>

      {/* Advanced Embed Code */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Advanced Integration</h3>
          <button
            onClick={() => handleCopy(advancedEmbedCode)}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Advanced</span>
          </button>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{advancedEmbedCode}</code>
          </pre>
        </div>
        
        <p className="text-sm text-gray-600 mt-3">
          Use this version for custom event tracking, programmatic control, or to override default settings.
        </p>
      </div>

      {/* Render.com Deployment Guide */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Render.com Deployment Guide</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-1 mt-0.5">
              <span className="text-blue-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Push to GitHub</h4>
              <p className="text-sm text-gray-600 mt-1">
                Push your project to a GitHub repository. Make sure the <code className="bg-gray-100 px-1 rounded">server/</code> folder is in the root.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-1 mt-0.5">
              <span className="text-blue-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Create Render Service</h4>
              <p className="text-sm text-gray-600 mt-1">
                Go to <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">render.com</a>, 
                create a new Web Service, and connect your GitHub repository.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-1 mt-0.5">
              <span className="text-blue-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Configure Service</h4>
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                <p>• <strong>Root Directory:</strong> <code className="bg-gray-100 px-1 rounded">server</code></p>
                <p>• <strong>Build Command:</strong> <code className="bg-gray-100 px-1 rounded">npm install</code></p>
                <p>• <strong>Start Command:</strong> <code className="bg-gray-100 px-1 rounded">npm start</code></p>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-1 mt-0.5">
              <span className="text-blue-600 font-semibold text-sm">4</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Set Environment Variables</h4>
              <div className="text-sm text-gray-600 mt-1">
                <p>Add these environment variables in Render dashboard:</p>
                <div className="bg-gray-50 p-3 rounded mt-2 font-mono text-xs">
                  OPENAI_API_KEY=your_openai_api_key_here<br/>
                  ASSISTANT_ID=your_assistant_id_here<br/>
                  JWT_SECRET=your-random-secret-key-here<br/>
                  ALLOWED_ORIGINS=*
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-1 mt-0.5">
              <span className="text-blue-600 font-semibold text-sm">5</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Deploy & Test</h4>
              <p className="text-sm text-gray-600 mt-1">
                Click "Create Web Service" and wait for deployment. Test your widget script at: 
                <code className="bg-gray-100 px-1 rounded ml-1">https://your-app.onrender.com/widget.js</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Instructions</h3>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">Important Notes</h4>
                <div className="mt-2 text-sm text-yellow-700 space-y-1">
                  <p>• The widget script is dynamically generated and always reflects your current settings</p>
                  <p>• Changes in the admin panel update the widget immediately on all websites</p>
                  <p>• No need to update embed code when you change colors, messages, or settings</p>
                  <p>• The script is cached for performance but updates when you modify configuration</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">✅ What Updates Automatically</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Widget colors and styling</li>
                <li>• Welcome messages</li>
                <li>• Widget title and position</li>
                <li>• OpenAI assistant responses</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">🔧 What Requires Code Update</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Backend server URL changes</li>
                <li>• Major widget functionality changes</li>
                <li>• Custom event handlers</li>
                <li>• Advanced customizations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Server Requirements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Server Requirements</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">Node.js backend deployed and running</span>
          </div>
          <div className="flex items-center space-x-3">
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">OpenAI API key configured as environment variable</span>
          </div>
          <div className="flex items-center space-x-3">
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">OpenAI Assistant ID configured as environment variable</span>
          </div>
          <div className="flex items-center space-x-3">
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">CORS enabled for your website domains</span>
          </div>
          <div className="flex items-center space-x-3">
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">Widget script endpoint: <code className="bg-gray-100 px-1 rounded">/widget.js</code></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedCode;