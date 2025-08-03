import { useEffect, useState } from 'react'
import './RelationshipActionScheduler.css'

const RelationshipActionScheduler = ({ contacts, userProfile, onClose }) => {
  const [suggestedActions, setSuggestedActions] = useState([])
  const [selectedActions, setSelectedActions] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const [activeTab, setActiveTab] = useState('suggestions') // 'suggestions' or 'calendar'

  useEffect(() => {
    generateActionSuggestions()
    loadScheduledEvents()
  }, [generateActionSuggestions, loadScheduledEvents])

  const generateActionSuggestions = () => {
    const actions = []
    const today = new Date()

    contacts.forEach((contact) => {
      // 1. COMMUNICATION MAINTENANCE
      const commFreq = getRecommendedFrequency(contact)
      const daysSinceLastContact = getDaysSinceLastContact(contact)

      if (daysSinceLastContact >= commFreq.days) {
        actions.push({
          id: `contact-${contact.id}`,
          type: 'communication',
          priority: commFreq.priority,
          friend: contact.name,
          friendId: contact.id,
          title: `Reach out to ${contact.name}`,
          description: `It's been ${daysSinceLastContact} days since your last contact. ${getContactSuggestion(contact)}`,
          estimatedDuration: 30,
          suggestedDate: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
          category: 'Relationship Maintenance',
          icon: '💬',
          actionType: 'contact',
        })
      }

      // 2. BIRTHDAY & SPECIAL EVENTS
      if (contact.dateAdded) {
        const friendshipAnniversary = new Date(contact.dateAdded)
        friendshipAnniversary.setFullYear(today.getFullYear())
        if (
          friendshipAnniversary > today &&
          friendshipAnniversary <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        ) {
          actions.push({
            id: `anniversary-${contact.id}`,
            type: 'celebration',
            priority: 'medium',
            friend: contact.name,
            friendId: contact.id,
            title: `Friendship anniversary with ${contact.name}`,
            description: `Celebrate your friendship! Consider a thoughtful message or gift based on their love language: ${contact.loveLanguage || 'Unknown'}`,
            estimatedDuration: 60,
            suggestedDate: friendshipAnniversary,
            category: 'Special Occasions',
            icon: '🎉',
            actionType: 'celebrate',
          })
        }
      }

      // 3. GOAL SUPPORT ACTIONS
      if (contact.personalGoals) {
        actions.push({
          id: `support-${contact.id}`,
          type: 'support',
          priority: 'high',
          friend: contact.name,
          friendId: contact.id,
          title: `Support ${contact.name}'s goals`,
          description: `Check in on their progress: ${contact.personalGoals}. ${getSupportSuggestion(contact)}`,
          estimatedDuration: 45,
          suggestedDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
          category: 'Goal Support',
          icon: '🎯',
          actionType: 'support',
        })
      }

      // 4. COLLABORATION OPPORTUNITIES
      if (contact.collaborationOpps) {
        actions.push({
          id: `collab-${contact.id}`,
          type: 'collaboration',
          priority: 'high',
          friend: contact.name,
          friendId: contact.id,
          title: `Explore collaboration with ${contact.name}`,
          description: `Discuss potential opportunities: ${contact.collaborationOpps}`,
          estimatedDuration: 90,
          suggestedDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // Two weeks
          category: 'Business Development',
          icon: '🤝',
          actionType: 'collaborate',
        })
      }

      // 5. LOVE LANGUAGE ACTIONS
      if (contact.loveLanguage) {
        const loveLanguageAction = generateLoveLanguageAction(contact)
        if (loveLanguageAction) {
          actions.push(loveLanguageAction)
        }
      }
    })

    // 6. NETWORK-WIDE STRATEGIC ACTIONS
    const networkActions = generateNetworkActions()
    actions.push(...networkActions)

    // Sort by priority and date
    const sortedActions = actions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return new Date(a.suggestedDate) - new Date(b.suggestedDate)
    })

    setSuggestedActions(sortedActions)
  }

  const getRecommendedFrequency = (contact) => {
    switch (contact.category) {
      case 'Inner Circle':
        return { days: 7, priority: 'high' }
      case 'Business':
        return { days: 14, priority: 'high' }
      case 'Regular Friends':
        return { days: 21, priority: 'medium' }
      case 'Network':
        return { days: 60, priority: 'low' }
      default:
        return { days: 30, priority: 'medium' }
    }
  }

  const getDaysSinceLastContact = (contact) => {
    if (!contact.lastContactDate) return 30 // Default if no data
    const lastContact = new Date(contact.lastContactDate)
    const today = new Date()
    return Math.floor((today - lastContact) / (1000 * 60 * 60 * 24))
  }

  const getContactSuggestion = (contact) => {
    if (contact.communicationStyle?.includes('Direct')) {
      return `Send a direct message about something specific.`
    }
    if (contact.loveLanguage === 'Quality Time') {
      return `Suggest meeting in person or having a video call.`
    }
    if (contact.loveLanguage === 'Words of Affirmation') {
      return `Send an encouraging message about their recent achievements.`
    }
    return `Choose a communication method that matches their style.`
  }

  const getSupportSuggestion = (contact) => {
    if (contact.loveLanguage === 'Acts of Service') {
      return `Offer practical help with their goals.`
    }
    if (contact.theirExpertise) {
      return `Ask thoughtful questions about their area of expertise.`
    }
    return `Show genuine interest in their progress and offer encouragement.`
  }

  const generateLoveLanguageAction = (contact) => {
    const today = new Date()
    const suggestions = {
      'Quality Time': {
        title: `Quality time with ${contact.name}`,
        description: `Plan focused one-on-one time. Their love language is Quality Time - they value undivided attention.`,
        duration: 120,
        icon: '⏰',
      },
      'Words of Affirmation': {
        title: `Send encouragement to ${contact.name}`,
        description: `Write a thoughtful message highlighting their strengths. Their love language is Words of Affirmation.`,
        duration: 15,
        icon: '💬',
      },
      'Acts of Service': {
        title: `Help ${contact.name} with something`,
        description: `Offer practical assistance. Their love language is Acts of Service - they feel loved through helpful actions.`,
        duration: 60,
        icon: '🛠️',
      },
      'Physical Touch': {
        title: `In-person meetup with ${contact.name}`,
        description: `Plan to meet in person. Their love language is Physical Touch - they value physical presence and hugs.`,
        duration: 90,
        icon: '🤗',
      },
      'Receiving Gifts': {
        title: `Thoughtful gift for ${contact.name}`,
        description: `Plan a meaningful gift based on their interests: ${contact.hobbies || contact.interests || 'their personal interests'}.`,
        duration: 45,
        icon: '🎁',
      },
    }

    const suggestion = suggestions[contact.loveLanguage]
    if (!suggestion) return null

    return {
      id: `love-${contact.id}`,
      type: 'love-language',
      priority: 'medium',
      friend: contact.name,
      friendId: contact.id,
      title: suggestion.title,
      description: suggestion.description,
      estimatedDuration: suggestion.duration,
      suggestedDate: new Date(today.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000), // Random within 2 weeks
      category: 'Love Language',
      icon: suggestion.icon,
      actionType: 'love-language',
    }
  }

  const generateNetworkActions = () => {
    const actions = []
    const today = new Date()

    // Network analysis action
    if (contacts.length >= 5) {
      actions.push({
        id: 'network-analysis',
        type: 'strategy',
        priority: 'medium',
        friend: 'Network Analysis',
        friendId: 'network',
        title: 'Monthly network strategy review',
        description:
          'Review your relationship portfolio balance and identify optimization opportunities.',
        estimatedDuration: 30,
        suggestedDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // Monthly
        category: 'Strategic Planning',
        icon: '📊',
        actionType: 'analysis',
      })
    }

    // Introduction facilitation
    const potentialIntros = findIntroductionOpportunities()
    if (potentialIntros.length > 0) {
      actions.push({
        id: 'facilitate-intros',
        type: 'networking',
        priority: 'high',
        friend: 'Multiple Friends',
        friendId: 'multiple',
        title: 'Facilitate strategic introductions',
        description: `You have ${potentialIntros.length} potential introduction opportunities that could create mutual value.`,
        estimatedDuration: 60,
        suggestedDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
        category: 'Network Building',
        icon: '🌐',
        actionType: 'introduce',
      })
    }

    return actions
  }

  const findIntroductionOpportunities = () => {
    const opportunities = []

    for (let i = 0; i < contacts.length; i++) {
      for (let j = i + 1; j < contacts.length; j++) {
        const contact1 = contacts[i]
        const contact2 = contacts[j]

        // Check for professional synergies
        if (contact1.professionalInterests && contact2.theirExpertise) {
          if (
            contact1.professionalInterests
              .toLowerCase()
              .includes(contact2.theirExpertise.toLowerCase().split(' ')[0])
          ) {
            opportunities.push({
              person1: contact1.name,
              person2: contact2.name,
              reason: 'professional synergy',
            })
          }
        }

        // Check for goal alignment
        if (contact1.personalGoals && contact2.personalGoals) {
          const goals1 = contact1.personalGoals.toLowerCase()
          const goals2 = contact2.personalGoals.toLowerCase()
          if (goals1.includes('business') && goals2.includes('business')) {
            opportunities.push({
              person1: contact1.name,
              person2: contact2.name,
              reason: 'similar goals',
            })
          }
        }
      }
    }

    return opportunities
  }

  const loadScheduledEvents = () => {
    // Load from localStorage
    const saved = localStorage.getItem(`friendsync_calendar_${userProfile?.clerkUserId}`)
    if (saved) {
      setCalendarEvents(JSON.parse(saved))
    }
  }

  const scheduleAction = (action, customDate = null, customTime = null) => {
    const scheduledDate = customDate || action.suggestedDate
    const time = customTime || '10:00'

    const event = {
      id: `event-${Date.now()}`,
      actionId: action.id,
      title: action.title,
      description: action.description,
      date: scheduledDate,
      time: time,
      duration: action.estimatedDuration,
      friend: action.friend,
      friendId: action.friendId,
      category: action.category,
      icon: action.icon,
      actionType: action.actionType,
      status: 'scheduled',
    }

    const updatedEvents = [...calendarEvents, event]
    setCalendarEvents(updatedEvents)

    // Save to localStorage
    if (userProfile?.clerkUserId) {
      localStorage.setItem(
        `friendsync_calendar_${userProfile.clerkUserId}`,
        JSON.stringify(updatedEvents),
      )
    }

    // Remove from suggestions
    setSuggestedActions((prev) => prev.filter((a) => a.id !== action.id))
    setSelectedActions((prev) => prev.filter((id) => id !== action.id))

    // Generate calendar event for external calendars
    generateCalendarFile(event)
  }

  const generateCalendarFile = (event) => {
    const startDate = new Date(`${event.date.toDateString()} ${event.time}`)
    const endDate = new Date(startDate.getTime() + event.duration * 60000)

    const formatDate = (date) => {
      return `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FriendSync//Relationship Action//EN
BEGIN:VEVENT
UID:${event.id}@friendsync.app
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}\\n\\nGenerated by FriendSync - AI-powered friendship optimization
CATEGORIES:${event.category}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  const toggleActionSelection = (actionId) => {
    setSelectedActions((prev) =>
      prev.includes(actionId) ? prev.filter((id) => id !== actionId) : [...prev, actionId],
    )
  }

  const scheduleSelectedActions = () => {
    selectedActions.forEach((actionId) => {
      const action = suggestedActions.find((a) => a.id === actionId)
      if (action) {
        scheduleAction(action)
      }
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#e74c3c'
      case 'medium':
        return '#f39c12'
      case 'low':
        return '#27ae60'
      default:
        return '#3498db'
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="scheduler-overlay" onClick={onClose}>
      <div className="scheduler-modal" onClick={(e) => e.stopPropagation()}>
        <div className="scheduler-header">
          <h2>📅 Relationship Action Scheduler</h2>
          <p>Turn insights into scheduled actions</p>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <div className="scheduler-tabs">
          <button
            className={`tab ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            💡 Suggested Actions ({suggestedActions.length})
          </button>
          <button
            className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            📅 Scheduled Events ({calendarEvents.length})
          </button>
        </div>

        <div className="scheduler-content">
          {activeTab === 'suggestions' && (
            <div className="suggestions-tab">
              {selectedActions.length > 0 && (
                <div className="bulk-actions">
                  <button onClick={scheduleSelectedActions} className="schedule-selected-btn">
                    Schedule {selectedActions.length} Selected Actions
                  </button>
                </div>
              )}

              <div className="actions-list">
                {suggestedActions.map((action) => (
                  <div key={action.id} className="action-card">
                    <div className="action-header">
                      <div className="action-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedActions.includes(action.id)}
                          onChange={() => toggleActionSelection(action.id)}
                        />
                      </div>
                      <div className="action-icon">{action.icon}</div>
                      <div className="action-info">
                        <h3>{action.title}</h3>
                        <p>{action.description}</p>
                        <div className="action-meta">
                          <span className="action-category">{action.category}</span>
                          <span className="action-duration">{action.estimatedDuration} min</span>
                          <span
                            className="action-priority"
                            style={{ backgroundColor: getPriorityColor(action.priority) }}
                          >
                            {action.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="action-scheduling">
                      <div className="suggested-date">
                        Suggested: {formatDate(action.suggestedDate)}
                      </div>
                      <button onClick={() => scheduleAction(action)} className="schedule-btn">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {suggestedActions.length === 0 && (
                <div className="no-suggestions">
                  <h3>🎉 You're all caught up!</h3>
                  <p>
                    No urgent relationship actions needed right now. Check back later for new
                    suggestions.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="calendar-tab">
              <div className="events-list">
                {calendarEvents.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-icon">{event.icon}</div>
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      <div className="event-details">
                        <span>
                          {formatDate(event.date)} at {event.time}
                        </span>
                        <span>{event.duration} minutes</span>
                        <span>{event.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {calendarEvents.length === 0 && (
                <div className="no-events">
                  <h3>📅 No scheduled events</h3>
                  <p>Schedule some relationship actions to see them here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RelationshipActionScheduler
