import React, { useState } from 'react';
import AISuggestions from './AISuggestions';
import RelationshipDesires from './RelationshipDesires';
import FriendInvitation from './FriendInvitation';
import './ContactList.css';

const ContactList = ({ contacts, userProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Inner Circle', 'Regular Friends', 'Network'];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    
    const matchesCategory = filterCategory === 'All' || contact.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="contact-list card">
      <div className="contact-list-header">
        <h2>Your Contacts ({contacts.length})</h2>
        
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="contacts-grid">
        {filteredContacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} userProfile={userProfile} />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="no-contacts">
          {searchTerm || filterCategory !== 'All' 
            ? 'No contacts match your search criteria.' 
            : 'No contacts imported yet.'}
        </div>
      )}
    </div>
  );
};

const ContactCard = ({ contact, userProfile }) => {
  const [showAI, setShowAI] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState(false);
  const [showRelationshipGoals, setShowRelationshipGoals] = useState(false);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Inner Circle': return '#e74c3c';
      case 'Regular Friends': return '#3498db';
      case 'Network': return '#95a5a6';
      default: return '#6c757d';
    }
  };

  const handleSuggestionComplete = (contactId, suggestion, category) => {
    // Track completed suggestions
    console.log(`Completed suggestion for ${contact.name}:`, suggestion);
  };

  return (
    <div className="contact-card">
      <div className="contact-header">
        <div className="contact-avatar">
          {contact.name.charAt(0).toUpperCase()}
        </div>
        <div className="contact-info">
          <h3 className="contact-name">{contact.name}</h3>
          <div className="contact-badges">
            <span 
              className="contact-category"
              style={{ backgroundColor: getCategoryColor(contact.category) }}
            >
              {contact.category}
            </span>
            {contact.tier === 'premium' && (
              <span className="premium-badge">Premium</span>
            )}
          </div>
        </div>
        <div className="card-actions">
          <button
            onClick={() => setShowRelationshipGoals(!showRelationshipGoals)}
            className={`relationship-button ${showRelationshipGoals ? 'active' : ''}`}
            title="Relationship Goals"
          >
            🎯
          </button>
          <button
            onClick={() => setShowAI(!showAI)}
            className={`ai-button ${showAI ? 'active' : ''}`}
            title="AI Suggestions"
          >
            🤖
          </button>
          {userProfile && userProfile.setupCompleted && (
            <button
              onClick={() => {
                // Show invitation modal directly
                const event = new CustomEvent('showInvitation', { detail: { contact, userProfile } });
                document.dispatchEvent(event);
              }}
              className="invite-button"
              title="Invite to FriendSync"
            >
              📨
            </button>
          )}
          <button
            onClick={() => setExpandedProfile(!expandedProfile)}
            className={`expand-button ${expandedProfile ? 'active' : ''}`}
            title="View Full Profile"
          >
            {expandedProfile ? '📕' : '📖'}
          </button>
        </div>
      </div>
      
      <div className="contact-details">
        {/* Basic Contact Info */}
        {contact.email && (
          <div className="contact-detail">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="contact-detail">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{contact.phone}</span>
          </div>
        )}

        {/* Enhanced Profile Info */}
        {contact.loveLanguage && (
          <div className="contact-detail">
            <span className="detail-label">Love Language:</span>
            <span className="detail-value">{contact.loveLanguage}</span>
          </div>
        )}
        
        {expandedProfile && (
          <div className="expanded-profile">
            {contact.personalityType && (
              <div className="contact-detail">
                <span className="detail-label">Personality:</span>
                <span className="detail-value">{contact.personalityType} {contact.energyStyle}</span>
              </div>
            )}
            
            {contact.communicationStyle && (
              <div className="contact-detail">
                <span className="detail-label">Communication Style:</span>
                <span className="detail-value">{contact.communicationStyle}</span>
              </div>
            )}
            
            {contact.currentGoals?.length > 0 && (
              <div className="contact-detail">
                <span className="detail-label">Current Goals:</span>
                <span className="detail-value">{contact.currentGoals.join(', ')}</span>
              </div>
            )}
            
            {contact.challenges?.length > 0 && (
              <div className="contact-detail">
                <span className="detail-label">Challenges:</span>
                <span className="detail-value">{contact.challenges.join(', ')}</span>
              </div>
            )}
            
            {contact.interests?.length > 0 && (
              <div className="contact-detail">
                <span className="detail-label">Interests:</span>
                <span className="detail-value">{contact.interests.join(', ')}</span>
              </div>
            )}
            
            {contact.preferredContactMethod && (
              <div className="contact-detail">
                <span className="detail-label">Preferred Contact:</span>
                <span className="detail-value">{contact.preferredContactMethod}</span>
              </div>
            )}
            
            {contact.bestTimeToConnect && (
              <div className="contact-detail">
                <span className="detail-label">Best Time:</span>
                <span className="detail-value">{contact.bestTimeToConnect}</span>
              </div>
            )}
            
            <div className="contact-detail">
              <span className="detail-label">Relationship Depth:</span>
              <span className="detail-value">{contact.relationshipDepth}</span>
            </div>
          </div>
        )}

        {contact.notes && (
          <div className="contact-detail">
            <span className="detail-label">Notes:</span>
            <span className="detail-value">{contact.notes}</span>
          </div>
        )}
      </div>

      {showRelationshipGoals && (
        <RelationshipDesires
          contact={contact}
          onUpdate={(contactId, desires) => {
            console.log(`Updated relationship goals for ${contact.name}:`, desires);
          }}
        />
      )}

      {showAI && userProfile && (
        <AISuggestions
          friend={contact}
          userProfile={userProfile}
          onSuggestionComplete={handleSuggestionComplete}
        />
      )}

      {userProfile && userProfile.setupCompleted && (
        <FriendInvitation
          contact={contact}
          userProfile={userProfile}
          onInviteSent={(inviteData) => {
            console.log(`Invite sent to ${contact.name}:`, inviteData);
          }}
        />
      )}
    </div>
  );
};

export default ContactList;