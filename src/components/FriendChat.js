import { useEffect, useRef, useState } from 'react'
import './FriendChat.css'

const FriendChat = ({ friend, onClose }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  useEffect(() => {
    // Add welcome message when chat opens
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: `Hi! I'm your strategic advisor for your friendship with ${friend.name}. I know all about their personality, goals, and interests. Ask me anything about how to strengthen your relationship with them!

Some things you could ask:
• "What would be a good birthday gift for ${friend.name}?"
• "How should I support ${friend.name} with their current goals?"
• "What's the best way to communicate with ${friend.name}?"
• "When should I reach out to ${friend.name} next?"`,
    }
    setMessages([welcomeMessage])
  }, [friend])

  const createFriendContext = () => {
    const context = []

    context.push(
      `You are a strategic relationship advisor for ${friend.name}. Here's everything I know about them:`,
    )

    if (friend.name) context.push(`Name: ${friend.name}`)
    if (friend.category) context.push(`Relationship Category: ${friend.category}`)
    if (friend.loveLanguage) context.push(`Primary Love Language: ${friend.loveLanguage}`)
    if (friend.loveLanguageSecondary)
      context.push(`Secondary Love Language: ${friend.loveLanguageSecondary}`)
    if (friend.communicationStyle) context.push(`Communication Style: ${friend.communicationStyle}`)
    if (friend.personalityType) context.push(`Personality Type: ${friend.personalityType}`)
    if (friend.energyPattern) context.push(`Energy Pattern: ${friend.energyPattern}`)
    if (friend.currentLifePhase) context.push(`Current Life Phase: ${friend.currentLifePhase}`)
    if (friend.personalGoals) context.push(`Personal Goals: ${friend.personalGoals}`)
    if (friend.professionalGoals) context.push(`Professional Goals: ${friend.professionalGoals}`)
    if (friend.familySituation) context.push(`Family Situation: ${friend.familySituation}`)
    if (friend.hobbies) context.push(`Hobbies: ${friend.hobbies}`)
    if (friend.professionalInterests)
      context.push(`Professional Interests: ${friend.professionalInterests}`)
    if (friend.learningGoals) context.push(`Learning Goals: ${friend.learningGoals}`)
    if (friend.entertainmentPrefs)
      context.push(`Entertainment Preferences: ${friend.entertainmentPrefs}`)
    if (friend.howWeMet) context.push(`How We Met: ${friend.howWeMet}`)
    if (friend.communicationFreq)
      context.push(`Preferred Communication Frequency: ${friend.communicationFreq}`)
    if (friend.bestSupportMethods)
      context.push(`Best Ways to Support Them: ${friend.bestSupportMethods}`)
    if (friend.theirExpertise) context.push(`Their Expertise: ${friend.theirExpertise}`)
    if (friend.howTheyCanHelp) context.push(`How They Can Help Me: ${friend.howTheyCanHelp}`)
    if (friend.howICanHelp) context.push(`How I Can Help Them: ${friend.howICanHelp}`)
    if (friend.collaborationOpps)
      context.push(`Collaboration Opportunities: ${friend.collaborationOpps}`)
    if (friend.notes) context.push(`Additional Notes: ${friend.notes}`)

    context.push(
      `\nBased on this information, provide strategic advice for strengthening and optimizing this friendship. Focus on actionable suggestions that consider their personality, love language, goals, and our relationship dynamics.`,
    )

    return context.join('\n')
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Create the full context for this friend
      const friendContext = createFriendContext()
      const _fullPrompt = `${friendContext}\n\nUser Question: ${inputMessage}\n\nProvide a helpful, strategic response about optimizing this friendship:`

      // Use offline AI suggestion logic for now (we'll upgrade to ChatGPT later)
      const response = generateOfflineResponse(inputMessage, friend)

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (_error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateOfflineResponse = (question, friend) => {
    const lowerQuestion = question.toLowerCase()

    // Gift suggestions
    if (
      lowerQuestion.includes('gift') ||
      lowerQuestion.includes('birthday') ||
      lowerQuestion.includes('present')
    ) {
      const suggestions = []
      if (friend.loveLanguage === 'Receiving Gifts') {
        suggestions.push(
          "Since their love language is Receiving Gifts, they'll especially appreciate thoughtful presents!",
        )
      }
      if (friend.hobbies) {
        suggestions.push(
          `Based on their hobbies (${friend.hobbies}), consider gifts related to these interests.`,
        )
      }
      if (friend.learningGoals) {
        suggestions.push(
          `They're learning: ${friend.learningGoals} - educational gifts in these areas would be perfect.`,
        )
      }
      return suggestions.length > 0
        ? suggestions.join(' ')
        : 'Consider something personal that shows you remember their interests and goals.'
    }

    // Communication advice
    if (
      lowerQuestion.includes('communicate') ||
      lowerQuestion.includes('talk') ||
      lowerQuestion.includes('reach out')
    ) {
      const advice = []
      if (friend.communicationStyle) {
        advice.push(
          `Their communication style is ${friend.communicationStyle}, so adjust your approach accordingly.`,
        )
      }
      if (friend.loveLanguage === 'Words of Affirmation') {
        advice.push(
          'Since their love language is Words of Affirmation, be generous with genuine compliments and encouragement.',
        )
      }
      if (friend.communicationFreq) {
        advice.push(`They prefer ${friend.communicationFreq} communication frequency.`)
      }
      return advice.length > 0
        ? advice.join(' ')
        : 'Be authentic and consider their personality when reaching out.'
    }

    // Support advice
    if (lowerQuestion.includes('support') || lowerQuestion.includes('help')) {
      const support = []
      if (friend.bestSupportMethods) {
        support.push(`Best ways to support them: ${friend.bestSupportMethods}`)
      }
      if (friend.loveLanguage === 'Acts of Service') {
        support.push(
          'Their love language is Acts of Service - offer practical help with tasks or projects.',
        )
      }
      if (friend.personalGoals) {
        support.push(`Support their personal goals: ${friend.personalGoals}`)
      }
      if (friend.professionalGoals) {
        support.push(`Help with their professional goals: ${friend.professionalGoals}`)
      }
      return support.length > 0
        ? support.join(' ')
        : 'Listen actively and offer help that matches their current needs.'
    }

    // Collaboration opportunities
    if (
      lowerQuestion.includes('collaborate') ||
      lowerQuestion.includes('work together') ||
      lowerQuestion.includes('partnership')
    ) {
      if (friend.collaborationOpps) {
        return `Collaboration opportunities: ${friend.collaborationOpps}`
      }
      const collab = []
      if (friend.theirExpertise && friend.howICanHelp) {
        collab.push(
          `Combine their expertise (${friend.theirExpertise}) with how you can help (${friend.howICanHelp}).`,
        )
      }
      return collab.length > 0
        ? collab.join(' ')
        : 'Look for projects where your skills complement each other.'
    }

    // Default strategic response
    return `Based on ${friend.name}'s profile, I'd recommend focusing on their ${friend.loveLanguage || 'primary love language'} and supporting their current goals. ${friend.personalGoals ? `They're working on: ${friend.personalGoals}` : 'Ask them about their current priorities to find ways to add value to their life.'}`
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="friend-chat-overlay" onClick={onClose}>
      <div className="friend-chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <div className="chat-header-info">
            <h2>🤖 Chat about {friend.name}</h2>
            <p>Strategic relationship advisor</p>
          </div>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask me anything about ${friend.name}...`}
            disabled={isLoading}
            rows="2"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default FriendChat
