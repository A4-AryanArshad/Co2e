import React, { useState, useEffect } from 'react';
import { User, MessageCircle, X } from 'lucide-react';

// Mock backend service - replace with real API in production
const mockBackendService = {
  getUserSession: async (userId) => {
    const mockSessions = {
      'user1': { lastAction: 'browsing the pricing page', lastVisit: new Date(Date.now() - 3600000) },
      'user2': { lastAction: 'reading sustainability guides', lastVisit: new Date(Date.now() - 86400000) },
      'user3': { lastAction: 'exploring impact metrics', lastVisit: new Date(Date.now() - 172800000) }
    };
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSessions[userId] || { lastAction: 'browsing the site', lastVisit: new Date() };
  },
  generateAIGreeting: async (userId, name, sessionData) => {
    const greetings = [
      `Hey ${name}! 🌟 I noticed you were ${sessionData.lastAction} last time. Ready to dive deeper into making an impact? Remember to subscribe to one of our plans to unlock your full impact potential!`,
      `Welcome back, ${name}! 👋 Since you were ${sessionData.lastAction}, I thought you might want to explore our new sustainability playbook. Remember to subscribe to one of our plans to unlock your full impact potential!`,
      `Hi ${name}! ✨ Great to see you again after ${sessionData.lastAction}. How about checking out our impact calculator next? Remember to subscribe to one of our plans to unlock your full impact potential!`
    ];
    await new Promise(resolve => setTimeout(resolve, 800));
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
};

const LoginPopup = ({ userId, name, isVisible, onClose }) => {
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && userId && name) {
      setLoading(true);
      const loadGreeting = async () => {
        try {
          const sessionData = await mockBackendService.getUserSession(userId);
          const aiGreeting = await mockBackendService.generateAIGreeting(userId, name, sessionData);
          setGreeting(aiGreeting);
        } catch (error) {
          setGreeting(`Welcome back, ${name}! Remember to subscribe to one of our plans to unlock your full impact potential!`);
        } finally {
          setLoading(false);
        }
      };
      loadGreeting();
    }
  }, [isVisible, userId, name]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back, {name}! 👋
            </h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 min-h-[100px] flex items-center">
            {loading ? (
              <div className="flex items-center justify-center w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Generating personalized message...</span>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <MessageCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <p className="text-gray-700 leading-relaxed">{greeting}</p>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold"
            >
              Start Free / Upgrade Now / Go Premium
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;