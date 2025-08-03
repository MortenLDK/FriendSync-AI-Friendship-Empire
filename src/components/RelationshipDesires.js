import { useEffect, useState } from 'react'
import './RelationshipDesires.css'

const RelationshipDesires = ({ contact, isMyProfile = false, onUpdate }) => {
  const [desires, setDesires] = useState({
    // What I want to RECEIVE from this person
    whatIWant: {
      businessSupport: [],
      personalSupport: [],
      specificRequests: '',
      energyNeeds: '',
      frequencyPreference: 'weekly',
    },

    // What I want to GIVE to this person (if editing their profile in my app)
    whatICanGive: {
      myStrengths: [],
      resourcesICanShare: [],
      connectionsICanMake: [],
      specificOffers: '',
      givingCapacity: 'high',
    },

    // Mutual goals for this relationship
    relationshipGoals: {
      shortTerm: [],
      longTerm: [],
      mutualProjects: '',
      mastermindPotential: false,
    },
  })

  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    // Load existing relationship desires
    const savedDesires = localStorage.getItem(`relationship_desires_${contact.id}`)
    if (savedDesires) {
      setDesires(JSON.parse(savedDesires))
    }
  }, [contact.id])

  const updateDesires = (newDesires) => {
    setDesires(newDesires)
    localStorage.setItem(`relationship_desires_${contact.id}`, JSON.stringify(newDesires))
    if (onUpdate) onUpdate(contact.id, newDesires)
  }

  const handleArrayUpdate = (section, field, value) => {
    const currentArray = desires[section][field] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    updateDesires({
      ...desires,
      [section]: {
        ...desires[section],
        [field]: newArray,
      },
    })
  }

  const handleFieldUpdate = (section, field, value) => {
    updateDesires({
      ...desires,
      [section]: {
        ...desires[section],
        [field]: value,
      },
    })
  }

  // Business support options
  const businessSupports = [
    'Strategic Advice',
    'Business Connections',
    'Investment Opportunities',
    'Partnership Introductions',
    'Market Insights',
    'Problem Solving',
    'Accountability',
    'Brainstorming',
    'Industry Knowledge',
    'Skill Development',
  ]

  // Personal support options
  const personalSupports = [
    'Clarity & Perspective',
    'Fun & Humor',
    'Emotional Support',
    'Motivation',
    'Honest Feedback',
    'Creative Inspiration',
    'Life Balance',
    'Adventure Planning',
    'Deep Conversations',
    'Celebration Partner',
  ]

  // My strengths (what I can give)
  const myStrengths = [
    'Business Strategy',
    'Real Estate Expertise',
    'Coaching Skills',
    'Tourism Knowledge',
    'App Development',
    'Networking',
    'Leadership',
    'Investment Advice',
    'Marketing',
    'Operations',
    'Team Building',
    'Innovation',
  ]

  // Resources I can share
  const resources = [
    'Business Contacts',
    'Investment Opportunities',
    'Industry Reports',
    'Tools & Software',
    'Event Invitations',
    'Learning Resources',
    'Vendor Recommendations',
    'Office Space',
    'Equipment Access',
    'Travel Connections',
  ]

  // Short-term relationship goals
  const shortTermGoals = [
    'Monthly Strategy Sessions',
    'Weekly Check-ins',
    'Quarterly Adventures',
    'Business Collaboration',
    'Skill Exchange',
    'Project Partnership',
    'Investment Together',
    'Travel Together',
    'Learn Together',
  ]

  // Long-term relationship goals
  const longTermGoals = [
    'Lifelong Business Partners',
    'Investment Partners',
    'Family Friends',
    'Mastermind Co-founders',
    'Board Members',
    'Mentorship Relationship',
    'Legacy Building Together',
    'Retirement Planning Buddies',
  ]

  if (!editMode) {
    return (
      <div className="relationship-desires card">
        <div className="desires-header">
          <h3>🎯 Relationship Optimization with {contact.name}</h3>
          <button onClick={() => setEditMode(true)} className="edit-desires-button">
            {Object.keys(desires.whatIWant.businessSupport || {}).length > 0 ? 'Edit' : 'Set Up'}{' '}
            Relationship Goals
          </button>
        </div>

        {desires.whatIWant.businessSupport?.length > 0 ||
        desires.whatIWant.personalSupport?.length > 0
          ? <div className="desires-summary">
              <div className="desire-section">
                <h4>💼 What I Want from {contact.name}:</h4>
                <div className="desire-tags">
                  {desires.whatIWant.businessSupport?.map((item) => (
                    <span key={item} className="desire-tag business">
                      {item}
                    </span>
                  ))}
                  {desires.whatIWant.personalSupport?.map((item) => (
                    <span key={item} className="desire-tag personal">
                      {item}
                    </span>
                  ))}
                </div>
                {desires.whatIWant.specificRequests && (
                  <p className="specific-request">"{desires.whatIWant.specificRequests}"</p>
                )}
              </div>

              {desires.whatICanGive.myStrengths?.length > 0 && (
                <div className="desire-section">
                  <h4>🎁 What I Can Give to {contact.name}:</h4>
                  <div className="desire-tags">
                    {desires.whatICanGive.myStrengths?.map((item) => (
                      <span key={item} className="desire-tag giving">
                        {item}
                      </span>
                    ))}
                  </div>
                  {desires.whatICanGive.specificOffers && (
                    <p className="specific-request">"{desires.whatICanGive.specificOffers}"</p>
                  )}
                </div>
              )}

              {desires.relationshipGoals.shortTerm?.length > 0 && (
                <div className="desire-section">
                  <h4>🚀 Our Relationship Goals:</h4>
                  <div className="desire-tags">
                    {desires.relationshipGoals.shortTerm?.map((item) => (
                      <span key={item} className="desire-tag goals">
                        {item}
                      </span>
                    ))}
                  </div>
                  {desires.relationshipGoals.mastermindPotential && (
                    <div className="mastermind-indicator">⭐ Mastermind Potential: High</div>
                  )}
                </div>
              )}
            </div>
          : <div className="empty-desires">
              <p>
                🎯 Set up what you want from this relationship to unlock AI-powered optimization
                suggestions!
              </p>
              <p>💡 This creates bi-directional value where both of you win!</p>
            </div>}
      </div>
    )
  }

  return (
    <div className="relationship-desires-editor card">
      <div className="editor-header">
        <h3>🎯 Optimize Your Relationship with {contact.name}</h3>
        <p>Define what you want and what you can give to create mutual value</p>
      </div>

      <div className="editor-sections">
        {/* What I Want Section */}
        <div className="editor-section">
          <h4>💼 What I Want from {contact.name}:</h4>

          <div className="subsection">
            <label>Business Support</label>
            <div className="checkbox-grid">
              {businessSupports.map((support) => (
                <label key={support} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={desires.whatIWant.businessSupport?.includes(support)}
                    onChange={() => handleArrayUpdate('whatIWant', 'businessSupport', support)}
                  />
                  {support}
                </label>
              ))}
            </div>
          </div>

          <div className="subsection">
            <label>Personal Support</label>
            <div className="checkbox-grid">
              {personalSupports.map((support) => (
                <label key={support} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={desires.whatIWant.personalSupport?.includes(support)}
                    onChange={() => handleArrayUpdate('whatIWant', 'personalSupport', support)}
                  />
                  {support}
                </label>
              ))}
            </div>
          </div>

          <div className="subsection">
            <label>Specific Request</label>
            <textarea
              value={desires.whatIWant.specificRequests}
              onChange={(e) => handleFieldUpdate('whatIWant', 'specificRequests', e.target.value)}
              placeholder="Specific things you'd love from this relationship..."
              rows="2"
            />
          </div>
        </div>

        {/* What I Can Give Section */}
        <div className="editor-section">
          <h4>🎁 What I Can Give to {contact.name}:</h4>

          <div className="subsection">
            <label>My Strengths I Can Share</label>
            <div className="checkbox-grid">
              {myStrengths.map((strength) => (
                <label key={strength} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={desires.whatICanGive.myStrengths?.includes(strength)}
                    onChange={() => handleArrayUpdate('whatICanGive', 'myStrengths', strength)}
                  />
                  {strength}
                </label>
              ))}
            </div>
          </div>

          <div className="subsection">
            <label>Resources I Can Share</label>
            <div className="checkbox-grid">
              {resources.map((resource) => (
                <label key={resource} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={desires.whatICanGive.resourcesICanShare?.includes(resource)}
                    onChange={() =>
                      handleArrayUpdate('whatICanGive', 'resourcesICanShare', resource)
                    }
                  />
                  {resource}
                </label>
              ))}
            </div>
          </div>

          <div className="subsection">
            <label>Specific Offers</label>
            <textarea
              value={desires.whatICanGive.specificOffers}
              onChange={(e) => handleFieldUpdate('whatICanGive', 'specificOffers', e.target.value)}
              placeholder="Specific ways you can support them..."
              rows="2"
            />
          </div>
        </div>

        {/* Relationship Goals Section */}
        <div className="editor-section">
          <h4>🚀 Our Relationship Goals:</h4>

          <div className="subsection">
            <label>Short-term Goals (Next 6 months)</label>
            <div className="checkbox-grid">
              {shortTermGoals.map((goal) => (
                <label key={goal} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={desires.relationshipGoals.shortTerm?.includes(goal)}
                    onChange={() => handleArrayUpdate('relationshipGoals', 'shortTerm', goal)}
                  />
                  {goal}
                </label>
              ))}
            </div>
          </div>

          <div className="subsection">
            <label>Long-term Vision (1-5 years)</label>
            <div className="checkbox-grid">
              {longTermGoals.map((goal) => (
                <label key={goal} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={desires.relationshipGoals.longTerm?.includes(goal)}
                    onChange={() => handleArrayUpdate('relationshipGoals', 'longTerm', goal)}
                  />
                  {goal}
                </label>
              ))}
            </div>
          </div>

          <div className="subsection">
            <label>
              <input
                type="checkbox"
                checked={desires.relationshipGoals.mastermindPotential}
                onChange={(e) =>
                  handleFieldUpdate('relationshipGoals', 'mastermindPotential', e.target.checked)
                }
              />
              High Mastermind/Business Partner Potential
            </label>
          </div>

          <div className="subsection">
            <label>Mutual Projects or Collaborations</label>
            <textarea
              value={desires.relationshipGoals.mutualProjects}
              onChange={(e) =>
                handleFieldUpdate('relationshipGoals', 'mutualProjects', e.target.value)
              }
              placeholder="Business ventures, investments, projects we could do together..."
              rows="2"
            />
          </div>
        </div>
      </div>

      <div className="editor-buttons">
        <button onClick={() => setEditMode(false)} className="secondary-button">
          Cancel
        </button>
        <button onClick={() => setEditMode(false)} className="primary-button">
          Save Relationship Goals
        </button>
      </div>
    </div>
  )
}

export default RelationshipDesires
