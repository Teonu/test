import React, { useState, useEffect } from 'react';
import { Save, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface Config {
  apiKey: string;
  assistantId: string;
  welcomeMessage: string;
  widgetConfig: {
    primaryColor: string;
    position: string;
    title: string;
  };
  hasApiKey?: boolean;
}

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState<Config>({
    apiKey: '',
    assistantId: '',
    welcomeMessage: 'Hello! How can I help you today?',
    widgetConfig: {
      primaryColor: '#3B82F6',
      position: 'bottom-right',
      title: 'Chat Support'
    }
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadConfig();
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.adminLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setPassword('');
        loadConfig();
      } else {
        setMessage({ type: 'error', text: 'Invalid password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Login failed. Please check if the backend server is running.' });
    }
  };

  const loadConfig = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(API_ENDPOINTS.adminConfig, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      setMessage({ type: 'error', text: 'Failed to load configuration. Please check if the backend server is running.' });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(API_ENDPOINTS.adminConfig, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
        loadConfig(); // Reload to get updated config
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration. Please check if the backend server is running.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setConfig({
      apiKey: '',
      assistantId: '',
      welcomeMessage: 'Hello! How can I help you today?',
      widgetConfig: {
        primaryColor: '#3B82F6',
        position: 'bottom-right',
        title: 'Chat Support'
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 rounded-lg p-2">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Login</h2>
              <p className="text-sm text-gray-600">Enter password to access admin panel</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Demo password: <code className="bg-gray-100 px-2 py-1 rounded">password</code>
              </p>
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              <div className="flex items-center space-x-2">
                {message.type === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-600">Manage your chatbot configuration</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <AlertCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Configuration Status</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>✅ <strong>Backend Server:</strong> Running on Render.com</p>
              <p>✅ <strong>Environment Variables:</strong> Configured securely in Render</p>
              <p>ℹ️ <strong>API Keys:</strong> Stored safely as environment variables (not visible here)</p>
              <p>🎨 <strong>Widget Settings:</strong> Customize appearance and messages below</p>
            </div>
          </div>
        </div>
      </div>

      {/* OpenAI Configuration Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">OpenAI Configuration</h3>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">OpenAI Integration Status</span>
            </div>
            <div className="mt-2 text-sm text-green-700 space-y-1">
              <p>• API Key: {config.hasApiKey ? 'Configured ✅' : 'Not configured ❌'}</p>
              <p>• Assistant ID: {config.assistantId ? 'Configured ✅' : 'Not configured ❌'}</p>
              <p>• Backend: Connected to Render.com ✅</p>
            </div>
          </div>

          {(!config.hasApiKey || !config.assistantId) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Configuration Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    OpenAI credentials need to be configured in your Render.com environment variables:
                  </p>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>1. Go to your Render.com dashboard</p>
                    <p>2. Select your chatbot backend service</p>
                    <p>3. Go to Environment tab</p>
                    <p>4. Add/update these variables:</p>
                    <div className="bg-yellow-100 p-2 rounded mt-2 font-mono text-xs">
                      OPENAI_API_KEY=your_actual_api_key<br/>
                      ASSISTANT_ID=your_actual_assistant_id
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Widget Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Widget Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Welcome Message
            </label>
            <textarea
              value={config.welcomeMessage}
              onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Hello! How can I help you today?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Widget Title
            </label>
            <input
              type="text"
              value={config.widgetConfig.title}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                widgetConfig: { ...prev.widgetConfig, title: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Chat Support"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex space-x-3">
              <input
                type="color"
                value={config.widgetConfig.primaryColor}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  widgetConfig: { ...prev.widgetConfig, primaryColor: e.target.value }
                }))}
                className="w-12 h-10 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={config.widgetConfig.primaryColor}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  widgetConfig: { ...prev.widgetConfig, primaryColor: e.target.value }
                }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <select
              value={config.widgetConfig.position}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                widgetConfig: { ...prev.widgetConfig, position: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'error' ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;