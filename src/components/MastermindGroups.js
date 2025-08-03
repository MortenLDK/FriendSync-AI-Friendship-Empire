import { useState } from 'react'
import './MastermindGroups.css'

const MastermindGroups = ({ contacts, userProfile }) => {
  const [selectedContacts, setSelectedContacts] = useState([])
  const [groupName, setGroupName] = useState('')
  const [groupPurpose, setGroupPurpose] = useState('')
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  // Identify potential mastermind members based on relationship goals
  const mastermindPotentials = contacts.filter((contact) => {
    const savedDesires = localStorage.getItem(`relationship_desires_${contact.id}`)
    if (savedDesires) {
      const desires = JSON.parse(savedDesires)
      return (
        desires.relationshipGoals?.mastermindPotential ||
        contact.category === 'Inner Circle' ||
        desires.relationshipGoals?.longTerm?.some(
          (goal) =>
            goal.includes('Business') || goal.includes('Investment') || goal.includes('Mastermind'),
        )
      )
    }
    return contact.category === 'Inner Circle'
  })

  const handleContactToggle = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const createMastermindGroup = () => {
    const group = {
      id: `mastermind_${Date.now()}`,
      name: groupName,
      purpose: groupPurpose,
      members: selectedContacts.map((id) => contacts.find((c) => c.id === id)),
      creator: userProfile,
      created: new Date().toISOString(),
      status: 'forming',
    }

    // Save group
    const existingGroups = JSON.parse(localStorage.getItem('mastermind_groups') || '[]')
    existingGroups.push(group)
    localStorage.setItem('mastermind_groups', JSON.stringify(existingGroups))

    console.log('Created mastermind group:', group)
    setShowCreateGroup(false)
    setSelectedContacts([])
    setGroupName('')
    setGroupPurpose('')
  }

  const generateGroupSuggestions = () => {
    const businessTypes = {}
    const skillSets = new Set()

    selectedContacts.forEach((id) => {
      const contact = contacts.find((c) => c.id === id)
      if (contact.interests) {
        contact.interests.forEach((interest) => {
          businessTypes[interest] = (businessTypes[interest] || 0) + 1
          skillSets.add(interest)
        })
      }
    })

    const suggestions = []

    if (skillSets.has('Real Estate') && skillSets.has('Investment')) {
      suggestions.push('Real Estate Investment Mastermind')
    }
    if (skillSets.has('Technology') && skillSets.has('Entrepreneurship')) {
      suggestions.push('Tech Entrepreneur Collective')
    }
    if (skillSets.has('Coaching') && skillSets.has('Business')) {
      suggestions.push('Business Coaching Alliance')
    }
    if (selectedContacts.length >= 3) {
      suggestions.push('High-Performance Business Mastermind')
      suggestions.push('Wealth Building Circle')
    }

    return suggestions
  }

  return (
    <div className="mastermind-groups card">
      <div className="mastermind-header">
        <h2>🔥 Mastermind Groups</h2>
        <p>Create high-performance circles for systematic growth</p>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="create-group-button"
          disabled={mastermindPotentials.length < 2}
        >
          Create New Mastermind
        </button>
      </div>

      <div className="mastermind-stats">
        <div className="stat-card">
          <div className="stat-number">{mastermindPotentials.length}</div>
          <div className="stat-label">Mastermind Potentials</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {contacts.filter((c) => c.category === 'Inner Circle').length}
          </div>
          <div className="stat-label">Inner Circle</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{contacts.filter((c) => c.tier === 'premium').length}</div>
          <div className="stat-label">Premium Connections</div>
        </div>
      </div>

      <div className="potential-members">
        <h3>🎯 High-Potential Members</h3>
        <div className="members-grid">
          {mastermindPotentials.map((contact) => (
            <div key={contact.id} className="potential-member-card">
              <div className="member-info">
                <div className="member-avatar">{contact.name.charAt(0).toUpperCase()}</div>
                <div className="member-details">
                  <h4>{contact.name}</h4>
                  <div className="member-tags">
                    {contact.interests?.slice(0, 2).map((interest) => (
                      <span key={interest} className="interest-tag">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="member-potential">Category: {contact.category}</div>
                </div>
              </div>
              <div className="member-value">
                <div className="value-points">
                  {contact.currentGoals?.length > 0 && (
                    <div className="value-point">🎯 {contact.currentGoals.length} active goals</div>
                  )}
                  {contact.strengths?.length > 0 && (
                    <div className="value-point">💪 {contact.strengths.length} key strengths</div>
                  )}
                  {contact.businessExpertise?.length > 0 && (
                    <div className="value-point">💼 Business expertise</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateGroup && (
        <div className="create-group-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🚀 Create Mastermind Group</h3>
              <button onClick={() => setShowCreateGroup(false)} className="close-button">
                ✕
              </button>
            </div>

            <div className="group-setup">
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Elite Business Builders"
                />
              </div>

              <div className="form-group">
                <label>Group Purpose</label>
                <textarea
                  value={groupPurpose}
                  onChange={(e) => setGroupPurpose(e.target.value)}
                  placeholder="What will this mastermind achieve together?"
                  rows="3"
                />
              </div>

              <div className="member-selection">
                <label>Select Members ({selectedContacts.length} selected)</label>
                <div className="selectable-members">
                  {mastermindPotentials.map((contact) => (
                    <label key={contact.id} className="member-selector">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleContactToggle(contact.id)}
                      />
                      <div className="selector-content">
                        <span className="member-name">{contact.name}</span>
                        <span className="member-expertise">
                          {contact.interests?.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {selectedContacts.length > 0 && (
                <div className="group-suggestions">
                  <label>Suggested Group Names</label>
                  <div className="suggestion-buttons">
                    {generateGroupSuggestions().map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setGroupName(suggestion)}
                        className="suggestion-button"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="viral-multiplier">
                <h4>🌟 Viral Growth Potential</h4>
                <p>When these {selectedContacts.length} members join and invite their networks:</p>
                <div className="growth-stats">
                  <div className="growth-stat">
                    <strong>{selectedContacts.length * 15}</strong>
                    <span>Potential new connections</span>
                  </div>
                  <div className="growth-stat">
                    <strong>{selectedContacts.length * 3}</strong>
                    <span>New mastermind opportunities</span>
                  </div>
                  <div className="growth-stat">
                    <strong>10x</strong>
                    <span>Network value multiplier</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowCreateGroup(false)} className="secondary-button">
                Cancel
              </button>
              <button
                onClick={createMastermindGroup}
                className="primary-button"
                disabled={selectedContacts.length < 2 || !groupName}
              >
                🔥 Create Mastermind
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MastermindGroups
