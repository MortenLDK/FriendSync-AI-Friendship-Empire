import React, { useState, useEffect } from 'react';
import chatgptService from '../services/chatgptService';
import './AISuggestions.css';

const AISuggestions = ({ friend, userProfile, onSuggestionComplete }) => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    const savedKey = chatgptService.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      chatgptService.setApiKey(apiKey);
      setShowApiKeyInput(false);
      generateSuggestions();
    }
  };

  const generateSuggestions = async () => {
    if (!userProfile) {
      setError('Please set up your profile first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let suggestionData;
      
      if (chatgptService.getApiKey()) {
        // Use ChatGPT for premium suggestions
        suggestionData = await chatgptService.generateFriendshipSuggestions(friend, userProfile);
      } else {
        // Use offline suggestions for free tier
        suggestionData = chatgptService.getOfflineSuggestions(friend, userProfile);
      }
      
      setSuggestions(suggestionData);
    } catch (err) {
      setError('Error generating suggestions: ' + err.message);
      // Fallback to offline suggestions
      const fallbackSuggestions = chatgptService.getOfflineSuggestions(friend, userProfile);
      setSuggestions(fallbackSuggestions);
    } finally {
      setLoading(false);
    }
  };

  const completeSuggestion = (suggestion, category) => {
    if (onSuggestionComplete) {
      onSuggestionComplete(friend.id, suggestion, category);
    }
    
    // Remove from current suggestions
    setSuggestions(prev => ({
      ...prev,
      [category]: prev[category]?.filter(s => s !== suggestion) || []
    }));
  };

  if (showApiKeyInput) {
    return (
      <div className="ai-suggestions card">
        <h3>🚀 Unlock AI-Powered Suggestions (Premium)</h3>
        <p>Get personalized ChatGPT suggestions for being the ultimate energy-giver to {friend.name}</p>
        
        <div className="api-key-setup">
          <input
            type="password"
            placeholder="Enter your OpenAI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="api-key-input"
          />
          <button onClick={handleApiKeySubmit} className="primary-button">
            Enable AI Suggestions
          </button>
        </div>
        
        <div className="api-key-help">
          <p><strong>How to get your API key:</strong></p>
          <ol>
            <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a></li>
            <li>Create a new API key</li>
            <li>Copy and paste it above</li>
          </ol>
          <p className="note">Your key is stored locally and never shared. You pay OpenAI directly (~$0.01-0.10 per suggestion).</p>
        </div>
        
        <button 
          onClick={() => {
            setShowApiKeyInput(false);
            generateSuggestions();
          }}
          className="secondary-button"
        >
          Use Free Suggestions Instead
        </button>
      </div>
    );
  }

  return (
    <div className="ai-suggestions card">
      <div className="suggestions-header">
        <h3>🤖 AI Friendship Suggestions for {friend.name}</h3>
        <div className="suggestion-controls">
          <button 
            onClick={generateSuggestions}
            disabled={loading}
            className="refresh-button"
          >
            {loading ? '🔄 Generating...' : '🔄 Refresh'}
          </button>
          
          {chatgptService.getApiKey() && (
            <span className="premium-badge">Premium AI</span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {suggestions && (
        <div className="suggestions-content">
          <SuggestionSection
            title="🎯 Immediate Actions"
            suggestions={suggestions.immediateActions}
            onComplete={(suggestion) => completeSuggestion(suggestion, 'immediateActions')}
            color="#e74c3c"
          />
          
          <SuggestionSection
            title="📅 Weekly Touchpoints"
            suggestions={suggestions.weeklyTouchpoints}
            onComplete={(suggestion) => completeSuggestion(suggestion, 'weeklyTouchpoints')}
            color="#3498db"
          />
          
          <SuggestionSection
            title="💬 Conversation Starters"
            suggestions={suggestions.conversationStarters}
            onComplete={(suggestion) => completeSuggestion(suggestion, 'conversationStarters')}
            color="#2ecc71"
          />
          
          {chatgptService.getApiKey() && suggestions.monthlyDeepening && (
            <SuggestionSection
              title="🌱 Monthly Relationship Deepening"
              suggestions={suggestions.monthlyDeepening}
              onComplete={(suggestion) => completeSuggestion(suggestion, 'monthlyDeepening')}
              color="#9b59b6"
            />
          )}
          
          {chatgptService.getApiKey() && suggestions.giftIdeas && (
            <SuggestionSection
              title="🎁 Thoughtful Gestures"
              suggestions={suggestions.giftIdeas}
              onComplete={(suggestion) => completeSuggestion(suggestion, 'giftIdeas')}
              color="#f39c12"
            />
          )}
          
          {chatgptService.getApiKey() && suggestions.supportOpportunities && (
            <SuggestionSection
              title="🤝 Support Opportunities"
              suggestions={suggestions.supportOpportunities}
              onComplete={(suggestion) => completeSuggestion(suggestion, 'supportOpportunities')}
              color="#1abc9c"
            />
          )}
        </div>
      )}
      
      {!suggestions && !loading && (
        <div className="no-suggestions">
          <p>Click "Refresh" to generate personalized suggestions for {friend.name}</p>
        </div>
      )}
    </div>
  );
};

const SuggestionSection = ({ title, suggestions, onComplete, color }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="suggestion-section">
      <h4 style={{ color }}>{title}</h4>
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            <span className="suggestion-text">{suggestion}</span>
            <button
              onClick={() => onComplete(suggestion)}
              className="complete-button"
              title="Mark as completed"
            >
              ✓
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestions;