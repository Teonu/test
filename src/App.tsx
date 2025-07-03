import React, { useState } from 'react';
import { MessageCircle, Settings, Code, Monitor } from 'lucide-react';
import ChatbotWidget from './components/ChatbotWidget';
import AdminPanel from './components/AdminPanel';
import EmbedCode from './components/EmbedCode';

function App() {
  const [activeTab, setActiveTab] = useState('demo');

  const tabs = [
    { id: 'demo', label: 'Live Demo', icon: Monitor },
    { id: 'admin', label: 'Admin Panel', icon: Settings },
    { id: 'embed', label: 'Embed Code', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chatbot Widget</h1>
                <p className="text-sm text-gray-600">OpenAI Assistant Integration</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'demo' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Demo</h2>
              <p className="text-gray-600 mb-6">
                This is a live demonstration of the chatbot widget. The widget appears in the bottom-right corner.
                Try clicking on it to start a conversation!
              </p>
              <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] relative">
                <div className="text-center text-gray-500">
                  <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>This represents your website content</p>
                  <p className="text-sm mt-2">The chatbot widget will appear in the corner</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && <AdminPanel />}
        {activeTab === 'embed' && <EmbedCode />}
      </main>

      {/* Chatbot Widget - Always visible in demo mode */}
      {activeTab === 'demo' && <ChatbotWidget />}
    </div>
  );
}

export default App;