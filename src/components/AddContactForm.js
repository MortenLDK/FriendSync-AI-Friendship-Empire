import { useState } from 'react'
import './AddContactForm.css'

const AddContactForm = ({ onContactAdded, onClose }) => {
  const [contact, setContact] = useState({
    // Basic Identity
    name: '',
    email: '',
    phone: '',
    preferredChannel: 'text',
    timeZone: '',
    location: '',

    // Personality & Psychology
    loveLanguage: '',
    loveLanguageSecondary: '',
    communicationStyle: '',
    personalityType: '',
    energyPattern: '',

    // Life Context & Goals
    currentLifePhase: '',
    personalGoals: '',
    professionalGoals: '',
    familySituation: '',

    // Interests & Passions
    hobbies: '',
    professionalInterests: '',
    learningGoals: '',
    entertainmentPrefs: '',

    // Relationship Dynamics
    category: 'Regular Friends',
    howWeMet: '',
    relationshipOrigin: '',
    communicationFreq: 'weekly',
    bestSupportMethods: '',

    // Strategic Intelligence
    mutualConnections: '',
    theirExpertise: '',
    howTheyCanHelp: '',
    howICanHelp: '',
    collaborationOpps: '',

    // Legacy fields
    currentGoals: '',
    interests: '',
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = ['Inner Circle', 'Regular Friends', 'Network', 'Business']
  const loveLanguages = [
    'Quality Time',
    'Words of Affirmation',
    'Acts of Service',
    'Physical Touch',
    'Receiving Gifts',
  ]
  const communicationChannels = ['text', 'call', 'email', 'video', 'in-person']
  const communicationStyles = [
    'Direct & Analytical',
    'Direct & Emotional',
    'Indirect & Analytical',
    'Indirect & Emotional',
  ]
  const energyPatterns = [
    'Morning Person',
    'Evening Person',
    'Flexible',
    'High Energy',
    'Low Energy',
    'Introvert',
    'Extrovert',
    'Ambivert',
  ]
  const lifePhases = [
    'Student',
    'Early Career',
    'Career Growth',
    'Leadership Role',
    'Career Transition',
    'Entrepreneur',
    'New Parent',
    'Empty Nester',
    'Retired',
  ]
  const communicationFreqs = [
    'daily',
    'few-times-week',
    'weekly',
    'bi-weekly',
    'monthly',
    'quarterly',
    'special-occasions',
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!contact.name.trim()) {
      alert('Name is required')
      return
    }

    setIsSubmitting(true)

    // Create contact with unique ID and additional fields
    const newContact = {
      id: Date.now().toString(),
      name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      category: contact.category,
      loveLanguage: contact.loveLanguage,
      personalityType: contact.personalityType,
      relationshipDepth: 'Surface', // Default depth
      currentGoals: contact.currentGoals
        ? contact.currentGoals.split(',').map((g) => g.trim())
        : [],
      interests: contact.interests ? contact.interests.split(',').map((i) => i.trim()) : [],
      notes: contact.notes,
      dateAdded: new Date().toISOString(),
      lastContactDate: new Date().toISOString(),
    }

    try {
      await onContactAdded(newContact)

      // Reset form
      setContact({
        // Basic Identity
        name: '',
        email: '',
        phone: '',
        preferredChannel: 'text',
        timeZone: '',
        location: '',

        // Personality & Psychology
        loveLanguage: '',
        loveLanguageSecondary: '',
        communicationStyle: '',
        personalityType: '',
        energyPattern: '',

        // Life Context & Goals
        currentLifePhase: '',
        personalGoals: '',
        professionalGoals: '',
        familySituation: '',

        // Interests & Passions
        hobbies: '',
        professionalInterests: '',
        learningGoals: '',
        entertainmentPrefs: '',

        // Relationship Dynamics
        category: 'Regular Friends',
        howWeMet: '',
        relationshipOrigin: '',
        communicationFreq: 'weekly',
        bestSupportMethods: '',

        // Strategic Intelligence
        mutualConnections: '',
        theirExpertise: '',
        howTheyCanHelp: '',
        howICanHelp: '',
        collaborationOpps: '',

        // Legacy fields
        currentGoals: '',
        interests: '',
        notes: '',
      })

      onClose()
    } catch (error) {
      alert(`Error adding contact: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-contact-overlay" onClick={onClose}>
      <div className="add-contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🧠 Deep Friend Profile</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          {/* Basic Identity Section */}
          <div className="form-section">
            <h3>🆔 Basic Identity</h3>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder="Enter their full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preferredChannel">Preferred Contact Method</label>
                <select
                  id="preferredChannel"
                  value={contact.preferredChannel}
                  onChange={(e) => setContact({ ...contact, preferredChannel: e.target.value })}
                >
                  {communicationChannels.map((channel) => (
                    <option key={channel} value={channel}>
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location/City</label>
                <input
                  id="location"
                  type="text"
                  value={contact.location}
                  onChange={(e) => setContact({ ...contact, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          {/* Personality & Psychology Section */}
          <div className="form-section">
            <h3>🧠 Personality & Psychology</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="loveLanguage">Primary Love Language</label>
                <select
                  id="loveLanguage"
                  value={contact.loveLanguage}
                  onChange={(e) => setContact({ ...contact, loveLanguage: e.target.value })}
                >
                  <option value="">Select primary love language</option>
                  {loveLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="loveLanguageSecondary">Secondary Love Language</label>
                <select
                  id="loveLanguageSecondary"
                  value={contact.loveLanguageSecondary}
                  onChange={(e) =>
                    setContact({ ...contact, loveLanguageSecondary: e.target.value })
                  }
                >
                  <option value="">Select secondary love language</option>
                  {loveLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="communicationStyle">Communication Style</label>
                <select
                  id="communicationStyle"
                  value={contact.communicationStyle}
                  onChange={(e) => setContact({ ...contact, communicationStyle: e.target.value })}
                >
                  <option value="">Select communication style</option>
                  {communicationStyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="energyPattern">Energy Pattern</label>
                <select
                  id="energyPattern"
                  value={contact.energyPattern}
                  onChange={(e) => setContact({ ...contact, energyPattern: e.target.value })}
                >
                  <option value="">Select energy pattern</option>
                  {energyPatterns.map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {pattern}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="personalityType">Personality Type</label>
              <input
                id="personalityType"
                type="text"
                value={contact.personalityType}
                onChange={(e) => setContact({ ...contact, personalityType: e.target.value })}
                placeholder="e.g., INTJ, Type A, Creative, Analytical"
              />
            </div>
          </div>

          {/* Life Context & Goals Section */}
          <div className="form-section">
            <h3>🎯 Life Context & Goals</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="currentLifePhase">Current Life Phase</label>
                <select
                  id="currentLifePhase"
                  value={contact.currentLifePhase}
                  onChange={(e) => setContact({ ...contact, currentLifePhase: e.target.value })}
                >
                  <option value="">Select life phase</option>
                  {lifePhases.map((phase) => (
                    <option key={phase} value={phase}>
                      {phase}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="familySituation">Family Situation</label>
                <input
                  id="familySituation"
                  type="text"
                  value={contact.familySituation}
                  onChange={(e) => setContact({ ...contact, familySituation: e.target.value })}
                  placeholder="e.g., Single, Married, 2 kids, etc."
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="personalGoals">Personal Goals</label>
              <textarea
                id="personalGoals"
                value={contact.personalGoals}
                onChange={(e) => setContact({ ...contact, personalGoals: e.target.value })}
                placeholder="What are their personal aspirations and goals?"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="professionalGoals">Professional Goals</label>
              <textarea
                id="professionalGoals"
                value={contact.professionalGoals}
                onChange={(e) => setContact({ ...contact, professionalGoals: e.target.value })}
                placeholder="What are their career and professional aspirations?"
                rows="2"
              />
            </div>
          </div>

          {/* Interests & Passions Section */}
          <div className="form-section">
            <h3>🎨 Interests & Passions</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hobbies">Hobbies & Recreation</label>
                <input
                  id="hobbies"
                  type="text"
                  value={contact.hobbies}
                  onChange={(e) => setContact({ ...contact, hobbies: e.target.value })}
                  placeholder="e.g., Photography, Hiking, Gaming, Cooking"
                />
              </div>

              <div className="form-group">
                <label htmlFor="professionalInterests">Professional Interests</label>
                <input
                  id="professionalInterests"
                  type="text"
                  value={contact.professionalInterests}
                  onChange={(e) =>
                    setContact({ ...contact, professionalInterests: e.target.value })
                  }
                  placeholder="e.g., AI, Marketing, Finance, Design"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="learningGoals">Learning Goals</label>
                <input
                  id="learningGoals"
                  type="text"
                  value={contact.learningGoals}
                  onChange={(e) => setContact({ ...contact, learningGoals: e.target.value })}
                  placeholder="e.g., Learn Spanish, Master Python, Public Speaking"
                />
              </div>

              <div className="form-group">
                <label htmlFor="entertainmentPrefs">Entertainment Preferences</label>
                <input
                  id="entertainmentPrefs"
                  type="text"
                  value={contact.entertainmentPrefs}
                  onChange={(e) => setContact({ ...contact, entertainmentPrefs: e.target.value })}
                  placeholder="e.g., Sci-fi movies, Jazz music, Business books"
                />
              </div>
            </div>
          </div>

          {/* Relationship Dynamics Section */}
          <div className="form-section">
            <h3>🤝 Relationship Dynamics</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Relationship Category</label>
                <select
                  id="category"
                  value={contact.category}
                  onChange={(e) => setContact({ ...contact, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="communicationFreq">Communication Frequency</label>
                <select
                  id="communicationFreq"
                  value={contact.communicationFreq}
                  onChange={(e) => setContact({ ...contact, communicationFreq: e.target.value })}
                >
                  {communicationFreqs.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="howWeMet">How We Met</label>
              <input
                id="howWeMet"
                type="text"
                value={contact.howWeMet}
                onChange={(e) => setContact({ ...contact, howWeMet: e.target.value })}
                placeholder="e.g., College, Work conference, Mutual friend"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bestSupportMethods">Best Ways to Support Them</label>
              <textarea
                id="bestSupportMethods"
                value={contact.bestSupportMethods}
                onChange={(e) => setContact({ ...contact, bestSupportMethods: e.target.value })}
                placeholder="How do they like to receive support? What makes them feel valued?"
                rows="2"
              />
            </div>
          </div>

          {/* Strategic Intelligence Section */}
          <div className="form-section">
            <h3>🧭 Strategic Intelligence</h3>

            <div className="form-group">
              <label htmlFor="theirExpertise">Their Expertise & Strengths</label>
              <textarea
                id="theirExpertise"
                value={contact.theirExpertise}
                onChange={(e) => setContact({ ...contact, theirExpertise: e.target.value })}
                placeholder="What are they really good at? What could they teach others?"
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="howTheyCanHelp">How They Can Help Me</label>
                <textarea
                  id="howTheyCanHelp"
                  value={contact.howTheyCanHelp}
                  onChange={(e) => setContact({ ...contact, howTheyCanHelp: e.target.value })}
                  placeholder="Expertise, connections, resources they could share"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="howICanHelp">How I Can Help Them</label>
                <textarea
                  id="howICanHelp"
                  value={contact.howICanHelp}
                  onChange={(e) => setContact({ ...contact, howICanHelp: e.target.value })}
                  placeholder="Ways I can add value to their life or goals"
                  rows="2"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="collaborationOpps">Collaboration Opportunities</label>
              <textarea
                id="collaborationOpps"
                value={contact.collaborationOpps}
                onChange={(e) => setContact({ ...contact, collaborationOpps: e.target.value })}
                placeholder="Potential projects, business opportunities, or mutual goals"
                rows="2"
              />
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="form-section">
            <h3>📝 Additional Notes</h3>

            <div className="form-group">
              <label htmlFor="notes">General Notes</label>
              <textarea
                id="notes"
                value={contact.notes}
                onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                placeholder="Any additional observations, memories, or important details..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddContactForm
