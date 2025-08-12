// Local OpenAI GPT-OSS Integration Service
// Provides privacy-first, cost-free AI for FriendSync

class LocalAIService {
  constructor() {
    this.apiUrl = 'http://localhost:11434' // Ollama default port
    this.model = 'gpt-oss-20b' // Start with lighter model
    this.isAvailable = false
    this.checkAvailability()
  }

  async checkAvailability() {
    try {
      const response = await fetch(`${this.apiUrl}/api/tags`)
      if (response.ok) {
        const data = await response.json()
        const hasGPTOSS = data.models?.some(m => m.name.includes('gpt-oss'))
        this.isAvailable = hasGPTOSS
        console.log('🤖 Local GPT-OSS available:', this.isAvailable)
      }
    } catch (error) {
      console.log('🔌 Local AI not available, falling back to cloud')
      this.isAvailable = false
    }
  }

  async generateFriendshipAdvice(friendProfile, userQuery) {
    if (!this.isAvailable) {
      return this.fallbackToCloud(friendProfile, userQuery)
    }

    const systemPrompt = `You are an expert relationship advisor with deep knowledge of psychology, love languages, and friendship dynamics. 

Friend Profile:
- Name: ${friendProfile.name}
- Love Language: ${friendProfile.loveLanguage || 'Unknown'}
- Personality: ${friendProfile.personalityType || 'Unknown'}  
- Communication Style: ${friendProfile.communicationStyle || 'Unknown'}
- Goals: ${friendProfile.currentGoals || 'None specified'}
- Interests: ${friendProfile.interests || 'Unknown'}
- Relationship Category: ${friendProfile.category || 'Regular Friends'}

Provide specific, actionable advice based on their psychological profile and love language preferences.`

    const payload = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ],
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 500
      }
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Local AI request failed')
      }

      const data = await response.json()
      return {
        success: true,
        content: data.message?.content || 'No response generated',
        source: 'local-gpt-oss',
        model: this.model,
        privacy: 'fully-private'
      }
    } catch (error) {
      console.error('Local AI error:', error)
      return this.fallbackToCloud(friendProfile, userQuery)
    }
  }

  async generateStrategicInsights(contactsArray, userProfile) {
    if (!this.isAvailable) {
      return { success: false, error: 'Local AI not available' }
    }

    const networkSummary = contactsArray.map(c => ({
      name: c.name,
      category: c.category,
      loveLanguage: c.loveLanguage,
      expertise: c.theirExpertise,
      goals: c.currentGoals
    }))

    const systemPrompt = `You are a network analysis expert specializing in relationship portfolio optimization.

Analyze this social network and provide strategic insights:
- Network size: ${contactsArray.length} contacts
- User goals: ${userProfile?.personalGoals || 'Not specified'}
- Network composition: ${JSON.stringify(networkSummary, null, 2)}

Provide 3-5 strategic insights about network optimization, collaboration opportunities, and relationship development priorities.`

    const payload = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Analyze my relationship network and provide strategic insights.' }
      ],
      stream: false,
      options: {
        temperature: 0.8,
        max_tokens: 800
      }
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Local AI insights request failed')
      }

      const data = await response.json()
      return {
        success: true,
        insights: data.message?.content || 'No insights generated',
        source: 'local-gpt-oss',
        privacy: 'fully-private',
        model: this.model
      }
    } catch (error) {
      console.error('Local AI insights error:', error)
      return { success: false, error: error.message }
    }
  }

  async fallbackToCloud(friendProfile, userQuery) {
    // Fallback to existing cloud service if local AI unavailable
    console.log('☁️ Falling back to cloud AI service')
    
    // Import existing service dynamically to avoid circular dependencies
    const { generateAISuggestion } = await import('./chatgptService.js')
    
    try {
      const cloudResponse = await generateAISuggestion(friendProfile, userQuery)
      return {
        success: true,
        content: cloudResponse,
        source: 'cloud-fallback',
        privacy: 'cloud-processed'
      }
    } catch (error) {
      return {
        success: false,
        content: 'AI services temporarily unavailable. Please try again later.',
        source: 'error',
        privacy: 'no-data-sent'
      }
    }
  }

  // Installation helper
  getInstallationInstructions() {
    return {
      title: '🚀 Enable Local AI (Privacy + Zero Cost)',
      steps: [
        '1. Install Ollama: https://ollama.ai/download',
        '2. Run: ollama pull gpt-oss-20b',
        '3. Start Ollama service',
        '4. Refresh FriendSync → Enjoy private AI!'
      ],
      benefits: [
        '✅ Complete privacy - data never leaves your device',
        '✅ Zero API costs - unlimited AI conversations',
        '✅ Faster responses - no internet latency',
        '✅ Works offline - perfect for sensitive data'
      ],
      requirements: 'Minimum 16GB RAM, CUDA-compatible GPU recommended'
    }
  }
}

export default new LocalAIService()