import React, { useState } from 'react'
import './FriendInvitation.css'

const FriendInvitation = ({ contact, userProfile, onInviteSent }) => {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteMessage, setInviteMessage] = useState('')
  const [inviteType, setInviteType] = useState('relationship_optimization')
  const [includeMyGoals, setIncludeMyGoals] = useState(true)

  const generateInviteMessage = () => {
    const userName = userProfile?.name || 'Your friend'

    const messages = {
      relationship_optimization: `Hey ${contact.name}! 👋

I've been using this amazing app called FriendSync to optimize my relationships and become a better friend. 

I'd love to invite you to join so we can both:
• Set clear goals for what we want from our friendship
• Get AI suggestions on how to support each other better
• Track how we're helping each other grow

It's all about creating mutual value and being intentional about our relationships!

Would you be interested in optimizing our friendship together? 🚀

Join here: [FriendSync Invitation Link]

- ${userName}`,

      mastermind_partner: `${contact.name}, I have an exciting opportunity! 🔥

I'm using FriendSync to systematically optimize my business relationships and masterminds. After thinking about our connection, I believe we have massive potential to support each other's growth.

I'd love to invite you to join the platform where we can:
• Define what we want from our business relationship
• Get AI-powered suggestions for mutual support
• Track our collaboration and wins together
• Potentially form a high-performance mastermind

You bring ${contact.interests?.slice(0, 2).join(' and ')} expertise, and I can contribute ${userProfile?.businessExpertise?.slice(0, 2).join(' and ')}.

Let's systematically unlock our potential together!

Join: [FriendSync Invitation Link]

- ${userName}`,

      business_networking: `Hi ${contact.name}!

I'm part of an exclusive network using FriendSync to optimize business relationships and create systematic value for each other.

Given your background in ${contact.interests?.slice(0, 2).join(' and ')}, I think you'd be a perfect fit for our optimization-focused community.

The platform helps us:
• Clearly define what value we can exchange
• Get AI suggestions for introductions and opportunities  
• Build stronger business relationships systematically
• Form high-performance business partnerships

Would you be interested in joining our network and exploring how we can support each other's businesses?

Join here: [FriendSync Invitation Link]

- ${userName}`,
    }

    return messages[inviteType] || messages.relationship_optimization
  }

  const sendInvitation = async () => {
    const invitationData = {
      to: contact,
      from: userProfile,
      message: inviteMessage,
      type: inviteType,
      includeMyGoals,
      timestamp: new Date().toISOString(),
      inviteId: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    // In a real app, this would send email/SMS
    console.log('Sending invitation:', invitationData)

    // For demo, we'll simulate sending
    navigator.clipboard
      .writeText(inviteMessage)
      .then(() => {
        alert(`Invitation copied to clipboard! Share with ${contact.name}`)
      })
      .catch(() => {
        alert(`Invitation ready to send to ${contact.name}`)
      })

    if (onInviteSent) {
      onInviteSent(invitationData)
    }

    setShowInviteModal(false)
  }

  React.useEffect(() => {
    if (showInviteModal) {
      setInviteMessage(generateInviteMessage())
    }
  }, [showInviteModal, generateInviteMessage])

  return (
    <>
      <button
        onClick={() => setShowInviteModal(true)}
        className="invite-friend-button"
        title="Invite to FriendSync"
      >
        📨 Invite to Optimize Our Relationship
      </button>

      {showInviteModal && (
        <div className="invite-modal-overlay">
          <div className="invite-modal">
            <div className="modal-header">
              <h3>🚀 Invite {contact.name} to FriendSync</h3>
              <button onClick={() => setShowInviteModal(false)} className="close-button">
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="invite-type-selector">
                <label>Invitation Type:</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="inviteType"
                      value="relationship_optimization"
                      checked={inviteType === 'relationship_optimization'}
                      onChange={(e) => setInviteType(e.target.value)}
                    />
                    <div className="radio-content">
                      <strong>🎯 Relationship Optimization</strong>
                      <span>Casual friend who wants to deepen the relationship</span>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="inviteType"
                      value="mastermind_partner"
                      checked={inviteType === 'mastermind_partner'}
                      onChange={(e) => setInviteType(e.target.value)}
                    />
                    <div className="radio-content">
                      <strong>🔥 Mastermind Partner</strong>
                      <span>High-potential business relationship</span>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="inviteType"
                      value="business_networking"
                      checked={inviteType === 'business_networking'}
                      onChange={(e) => setInviteType(e.target.value)}
                    />
                    <div className="radio-content">
                      <strong>💼 Business Network</strong>
                      <span>Professional connection for mutual opportunities</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="message-editor">
                <label>Invitation Message:</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows="12"
                  className="message-textarea"
                />
              </div>

              <div className="invite-options">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={includeMyGoals}
                    onChange={(e) => setIncludeMyGoals(e.target.checked)}
                  />
                  Share my relationship goals with them when they join
                </label>
              </div>

              <div className="viral-potential">
                <div className="viral-info">
                  <h4>🌟 Viral Growth Potential</h4>
                  <p>
                    When {contact.name} joins and invites their network, you'll get access to
                    optimize relationships with their connections too!
                  </p>
                  <div className="viral-stats">
                    <div className="stat">
                      <strong>Network Expansion</strong>
                      <span>2-3x relationship optimization opportunities</span>
                    </div>
                    <div className="stat">
                      <strong>Mutual Value</strong>
                      <span>Both of you become better energy-givers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowInviteModal(false)} className="secondary-button">
                Cancel
              </button>
              <button onClick={sendInvitation} className="primary-button">
                🚀 Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FriendInvitation
