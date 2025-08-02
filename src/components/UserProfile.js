import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    // Personal Identity
    name: '',
    role: 'Business Mogul', // Default for Morten
    
    // Personality & Style
    personalityType: '',
    energyStyle: '', // How you recharge
    givingStyle: '', // How you naturally support others
    communicationStyle: '',
    
    // Your Strengths (for AI to leverage)
    coreStrengths: [],
    businessExpertise: [],
    personalInterests: [],
    
    // Energy Management
    peakEnergyTimes: '', // When you're most effective
    preferredInteractionTypes: [], // calls, messages, in-person, etc.
    
    // Giving Preferences
    naturalGivingMethods: [], // advice, connections, resources, time, etc.
    relationshipGoals: '', // What you want from friendships
    
    // AI Optimization Settings
    suggestionFrequency: 'weekly', // daily, weekly, monthly
    focusAreas: [], // relationship_depth, energy_optimization, goal_support
    premiumFeatures: false,
    
    // Metadata
    setupCompleted: false,
    lastUpdated: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    // Load existing profile from localStorage
    const savedProfile = localStorage.getItem('friendsync_user_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const updateProfile = (updates) => {
    const updatedProfile = {
      ...profile,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    setProfile(updatedProfile);
    localStorage.setItem('friendsync_user_profile', JSON.stringify(updatedProfile));
    if (onProfileUpdate) onProfileUpdate(updatedProfile);
  };

  const handleArrayUpdate = (field, value, action = 'toggle') => {
    const currentArray = profile[field] || [];
    let newArray;
    
    if (action === 'toggle') {
      newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
    }
    
    updateProfile({ [field]: newArray });
  };

  const completeSetup = () => {
    updateProfile({ 
      setupCompleted: true,
      lastUpdated: new Date().toISOString()
    });
  };

  const personalityTypes = ['ENTJ', 'ENFJ', 'ENTP', 'ENFP', 'ESTJ', 'ESFJ', 'ESTP', 'ESFP',
                           'INTJ', 'INFJ', 'INTP', 'INFP', 'ISTJ', 'ISFJ', 'ISTP', 'ISFP'];
  
  const energyStyles = ['Extrovert', 'Introvert', 'Ambivert'];
  const givingStyles = ['Mentor', 'Connector', 'Resource Provider', 'Emotional Support', 'Strategic Advisor'];
  const communicationStyles = ['Direct', 'Supportive', 'Analytical', 'Expressive'];
  
  const strengths = ['Leadership', 'Strategic Thinking', 'Networking', 'Problem Solving', 'Creativity',
                    'Empathy', 'Communication', 'Business Development', 'Coaching', 'Innovation'];
  
  const businessAreas = ['Real Estate', 'Coaching', 'Tourism', 'App Development', 'Investment',
                        'Marketing', 'Sales', 'Operations', 'Strategy', 'Leadership Development'];
  
  const interests = ['Business', 'Technology', 'Travel', 'Fitness', 'Reading', 'Networking',
                    'Entrepreneurship', 'Investing', 'Coaching', 'Innovation'];
  
  const givingMethods = ['Strategic Advice', 'Business Connections', 'Resource Sharing', 'Mentoring',
                        'Investment Opportunities', 'Partnership Introductions', 'Skill Development',
                        'Emotional Support', 'Problem Solving', 'Opportunity Creation'];
  
  const interactionTypes = ['Phone Calls', 'Video Calls', 'Text Messages', 'In-Person Meetings',
                           'Business Dinners', 'Coffee Chats', 'Event Invitations', 'Email'];

  const focusAreaOptions = ['Relationship Depth', 'Energy Optimization', 'Goal Support',
                           'Network Expansion', 'Business Connections', 'Personal Growth'];

  if (profile.setupCompleted) {
    return (
      <div className="user-profile card">
        <div className="profile-header">
          <h2>Your Profile</h2>
          <p>AI uses this to personalize friendship suggestions</p>
        </div>
        
        <div className="profile-summary">
          <div className="profile-item">
            <span className="label">Name:</span>
            <span className="value">{profile.name}</span>
          </div>
          <div className="profile-item">
            <span className="label">Role:</span>
            <span className="value">{profile.role}</span>
          </div>
          <div className="profile-item">
            <span className="label">Personality:</span>
            <span className="value">{profile.personalityType} {profile.energyStyle}</span>
          </div>
          <div className="profile-item">
            <span className="label">Giving Style:</span>
            <span className="value">{profile.givingStyle}</span>
          </div>
        </div>
        
        <button onClick={() => updateProfile({ setupCompleted: false })} className="edit-button">
          Edit Profile
        </button>
      </div>
    );
  }

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="setup-step">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="form-group">
              <label>Your Role/Title</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => updateProfile({ role: e.target.value })}
                placeholder="e.g., Business Mogul, CEO, Entrepreneur"
              />
            </div>
            
            <div className="form-group">
              <label>Personality Type (Optional)</label>
              <select
                value={profile.personalityType}
                onChange={(e) => updateProfile({ personalityType: e.target.value })}
              >
                <option value="">Select personality type</option>
                {personalityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Energy Style</label>
              <div className="radio-group">
                {energyStyles.map(style => (
                  <label key={style} className="radio-label">
                    <input
                      type="radio"
                      name="energyStyle"
                      value={style}
                      checked={profile.energyStyle === style}
                      onChange={(e) => updateProfile({ energyStyle: e.target.value })}
                    />
                    {style}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="setup-step">
            <h3>Your Strengths & Expertise</h3>
            <div className="form-group">
              <label>Core Strengths (Select all that apply)</label>
              <div className="checkbox-grid">
                {strengths.map(strength => (
                  <label key={strength} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profile.coreStrengths?.includes(strength)}
                      onChange={() => handleArrayUpdate('coreStrengths', strength)}
                    />
                    {strength}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Business Expertise</label>
              <div className="checkbox-grid">
                {businessAreas.map(area => (
                  <label key={area} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profile.businessExpertise?.includes(area)}
                      onChange={() => handleArrayUpdate('businessExpertise', area)}
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="setup-step">
            <h3>How You Give & Connect</h3>
            <div className="form-group">
              <label>Your Natural Giving Style</label>
              <div className="radio-group">
                {givingStyles.map(style => (
                  <label key={style} className="radio-label">
                    <input
                      type="radio"
                      name="givingStyle"
                      value={style}
                      checked={profile.givingStyle === style}
                      onChange={(e) => updateProfile({ givingStyle: e.target.value })}
                    />
                    {style}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>How You Naturally Help Others</label>
              <div className="checkbox-grid">
                {givingMethods.map(method => (
                  <label key={method} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profile.naturalGivingMethods?.includes(method)}
                      onChange={() => handleArrayUpdate('naturalGivingMethods', method)}
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Preferred Interaction Types</label>
              <div className="checkbox-grid">
                {interactionTypes.map(type => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profile.preferredInteractionTypes?.includes(type)}
                      onChange={() => handleArrayUpdate('preferredInteractionTypes', type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="setup-step">
            <h3>AI Optimization Settings</h3>
            <div className="form-group">
              <label>Suggestion Frequency</label>
              <div className="radio-group">
                {['Daily', 'Weekly', 'Monthly'].map(freq => (
                  <label key={freq} className="radio-label">
                    <input
                      type="radio"
                      name="suggestionFrequency"
                      value={freq.toLowerCase()}
                      checked={profile.suggestionFrequency === freq.toLowerCase()}
                      onChange={(e) => updateProfile({ suggestionFrequency: e.target.value })}
                    />
                    {freq}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Focus Areas (What should AI optimize for?)</label>
              <div className="checkbox-grid">
                {focusAreaOptions.map(area => (
                  <label key={area} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profile.focusAreas?.includes(area)}
                      onChange={() => handleArrayUpdate('focusAreas', area)}
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Relationship Goals</label>
              <textarea
                value={profile.relationshipGoals}
                onChange={(e) => updateProfile({ relationshipGoals: e.target.value })}
                placeholder="What do you want to achieve through your friendships? How do you want to support others?"
                rows="3"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="user-profile-setup card">
      <div className="setup-header">
        <h2>Set Up Your Profile</h2>
        <p>Help AI personalize suggestions for becoming the ultimate energy-giver</p>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <span className="step-indicator">Step {currentStep} of {totalSteps}</span>
      </div>
      
      {renderStep()}
      
      <div className="setup-buttons">
        {currentStep > 1 && (
          <button 
            onClick={() => setCurrentStep(currentStep - 1)}
            className="secondary-button"
          >
            Previous
          </button>
        )}
        
        {currentStep < totalSteps ? (
          <button 
            onClick={() => setCurrentStep(currentStep + 1)}
            className="primary-button"
            disabled={!profile.name && currentStep === 1}
          >
            Next
          </button>
        ) : (
          <button 
            onClick={completeSetup}
            className="primary-button"
            disabled={!profile.name}
          >
            Complete Setup
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;