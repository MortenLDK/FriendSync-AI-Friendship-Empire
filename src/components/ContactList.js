import { useState } from 'react'
import AISuggestions from './AISuggestions'
import FriendChat from './FriendChat'
import FriendInvitation from './FriendInvitation'
import RelationshipDesires from './RelationshipDesires'
import './ContactList.css'

const ContactList = ({ contacts, userProfile }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  const categories = ['All', 'Inner Circle', 'Regular Friends', 'Network']

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)

    const matchesCategory = filterCategory === 'All' || contact.category === filterCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="contact-list">
      <div className="contact-list-header">
        <h2 className="contact-list-title">Your Network ({contacts.length})</h2>
        <p className="contact-list-subtitle">Strategic relationship intelligence</p>

        <div className="controls">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search your network..."
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
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="contacts-grid">
        {filteredContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} userProfile={userProfile} />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="no-contacts">
          <div className="no-contacts-icon">👥</div>
          <h3 className="no-contacts-title">
            {searchTerm || filterCategory !== 'All'
              ? 'No matches found'
              : 'Your network awaits'}
          </h3>
          <p className="no-contacts-description">
            {searchTerm || filterCategory !== 'All'
              ? 'Try adjusting your search criteria or filters'
              : 'Start building your relationship intelligence by adding friends'}
          </p>
        </div>
      )}
    </div>
  )
}

const ContactCard = ({ contact, userProfile }) => {
  const [showAI, setShowAI] = useState(false)
  const [expandedProfile, setExpandedProfile] = useState(false)
  const [showRelationshipGoals, setShowRelationshipGoals] = useState(false)
  const [showFriendChat, setShowFriendChat] = useState(false)

  // Removed getCategoryColor function - using CSS variables instead

  const handleSuggestionComplete = (_contactId, suggestion, _category) => {
    // Track completed suggestions
    console.log(`Completed suggestion for ${contact.name}:`, suggestion)
  }

  return (
    <div className="contact-card">
      <div className="contact-header">
        <div className="contact-info">
          <div className="contact-avatar">{contact.name.charAt(0).toUpperCase()}</div>
          <div className="contact-details">
            <h3 className="contact-name">{contact.name}</h3>
            <div className="contact-badges">
              <span className="contact-category">
                {contact.category}
              </span>
              {contact.tier === 'premium' && <span className="premium-badge">✨ Premium</span>}
            </div>
            {contact.loveLanguage && (
              <div className="contact-meta">
                💝 {contact.loveLanguage}
              </div>
            )}
          </div>
        </div>
        <div className="card-actions">
          <button
            onClick={() => setShowFriendChat(true)}
            className="action-button chat-button"
            title="AI Strategic Advisor"
          >
            🤖
          </button>
          <button
            onClick={() => setShowRelationshipGoals(!showRelationshipGoals)}
            className={`action-button relationship-button ${showRelationshipGoals ? 'active' : ''}`}
            title="Relationship Goals"
          >
            🎯
          </button>
          <button
            onClick={() => setShowAI(!showAI)}
            className={`action-button expand-button ${showAI ? 'active' : ''}`}
            title="Smart Suggestions"
          >
            💡
          </button>
          {userProfile?.setupCompleted && (
            <button
              onClick={() => {
                // Show invitation modal directly
                const event = new CustomEvent('showInvitation', {
                  detail: { contact, userProfile },
                })
                document.dispatchEvent(event)
              }}
              className="action-button invite-button"
              title="Invite to FriendSync"
            >
              📨
            </button>
          )}
          <button
            onClick={() => setExpandedProfile(!expandedProfile)}
            className={`action-button expand-button ${expandedProfile ? 'active' : ''}`}
            title="Full Profile"
          >
            {expandedProfile ? '📋' : '👤'}
          </button>
        </div>
      </div>

      {expandedProfile && (
        <div className="expanded-profile">
          <div className="profile-grid">
            <div className="profile-section">
              <h4 className="profile-section-title">Contact Info</h4>
              {contact.email && (
                <div className="contact-detail">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{contact.email}</div>
                </div>
              )}
              {contact.phone && (
                <div className="contact-detail">
                  <div className="detail-label">Phone</div>
                  <div className="detail-value">{contact.phone}</div>
                </div>
              )}
              {contact.preferredContactMethod && (
                <div className="contact-detail">
                  <div className="detail-label">Preferred Contact</div>
                  <div className="detail-value">{contact.preferredContactMethod}</div>
                </div>
              )}
            </div>

            <div className="profile-section">
              <h4 className="profile-section-title">Personality</h4>
              {contact.personalityType && (
                <div className="contact-detail">
                  <div className="detail-label">Type</div>
                  <div className="detail-value">{contact.personalityType}</div>
                </div>
              )}
              {contact.communicationStyle && (
                <div className="contact-detail">
                  <div className="detail-label">Communication</div>
                  <div className="detail-value">{contact.communicationStyle}</div>
                </div>
              )}
              {contact.loveLanguageSecondary && (
                <div className="contact-detail">
                  <div className="detail-label">Secondary Love Language</div>
                  <div className="detail-value">{contact.loveLanguageSecondary}</div>
                </div>
              )}
            </div>

            <div className="profile-section">
              <h4 className="profile-section-title">Goals & Interests</h4>
              {contact.personalGoals && (
                <div className="contact-detail">
                  <div className="detail-label">Personal Goals</div>
                  <div className="detail-value">{contact.personalGoals}</div>
                </div>
              )}
              {contact.professionalGoals && (
                <div className="contact-detail">
                  <div className="detail-label">Professional Goals</div>
                  <div className="detail-value">{contact.professionalGoals}</div>
                </div>
              )}
              {contact.hobbies && (
                <div className="contact-detail">
                  <div className="detail-label">Hobbies</div>
                  <div className="detail-value">{contact.hobbies}</div>
                </div>
              )}
            </div>

            {contact.notes && (
              <div className="profile-section">
                <h4 className="profile-section-title">Notes</h4>
                <div className="contact-detail">
                  <div className="detail-value">{contact.notes}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showRelationshipGoals && (
        <RelationshipDesires
          contact={contact}
          onUpdate={(_contactId, desires) => {
            console.log(`Updated relationship goals for ${contact.name}:`, desires)
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

      {userProfile?.setupCompleted && (
        <FriendInvitation
          contact={contact}
          userProfile={userProfile}
          onInviteSent={(inviteData) => {
            console.log(`Invite sent to ${contact.name}:`, inviteData)
          }}
        />
      )}

      {showFriendChat && <FriendChat friend={contact} onClose={() => setShowFriendChat(false)} />}
    </div>
  )
}

export default ContactList
