// ChatGPT Integration Service for FriendSync AI Suggestions

class ChatGPTService {
  constructor() {
    this.apiKey = null // Will be set by user in settings
    this.baseURL = 'https://api.openai.com/v1/chat/completions'
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey
    localStorage.setItem('friendsync_openai_key', apiKey)
  }

  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('friendsync_openai_key')
    }
    return this.apiKey
  }

  async generateFriendshipSuggestions(friend, userProfile, context = {}) {
    if (!this.getApiKey()) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = this.buildSuggestionPrompt(friend, userProfile, context)

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getApiKey()}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert friendship coach helping ${userProfile.name} become the ultimate energy-giver. 
                       You understand personality types, love languages, and optimal relationship dynamics.
                       Provide specific, actionable suggestions based on the friend's profile and ${userProfile.name}'s strengths.
                       Format responses as JSON with specific suggestions.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return this.parseSuggestionResponse(data.choices[0].message.content)
    } catch (error) {
      console.error('ChatGPT API Error:', error)
      throw error
    }
  }

  buildSuggestionPrompt(friend, userProfile, _context) {
    return `
FRIENDSHIP OPTIMIZATION REQUEST

USER PROFILE (${userProfile.name}):
- Role: ${userProfile.role}
- Personality: ${userProfile.personalityType} ${userProfile.energyStyle}
- Giving Style: ${userProfile.givingStyle}
- Core Strengths: ${userProfile.coreStrengths?.join(', ')}
- Business Expertise: ${userProfile.businessExpertise?.join(', ')}
- Natural Giving Methods: ${userProfile.naturalGivingMethods?.join(', ')}
- Preferred Interactions: ${userProfile.preferredInteractionTypes?.join(', ')}

FRIEND PROFILE (${friend.name}):
- Category: ${friend.category}
- Love Language: ${friend.loveLanguage}
- Personality: ${friend.personalityType} ${friend.energyStyle}
- Communication Style: ${friend.communicationStyle}
- Current Goals: ${friend.currentGoals?.join(', ')}
- Challenges: ${friend.challenges?.join(', ')}
- Interests: ${friend.interests?.join(', ')}
- Strengths: ${friend.strengths?.join(', ')}
- Preferred Contact: ${friend.preferredContactMethod}
- Best Time to Connect: ${friend.bestTimeToConnect}
- Relationship Depth: ${friend.relationshipDepth}
- Notes: ${friend.notes}

CONTEXT:
- Last Interaction: ${friend.lastInteraction || 'No recent interaction'}
- Focus Areas: ${userProfile.focusAreas?.join(', ')}
- Relationship Goals: ${userProfile.relationshipGoals}

Please provide specific, actionable suggestions for how ${userProfile.name} can be an amazing energy-giver to ${friend.name}.

Return JSON format:
{
  "immediateActions": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "weeklyTouchpoints": ["Weekly suggestion 1", "Weekly suggestion 2"],
  "monthlyDeepening": ["Monthly relationship building activity"],
  "giftIdeas": ["Thoughtful gift/gesture based on their profile"],
  "conversationStarters": ["Question 1 based on their goals", "Question 2 based on interests"],
  "supportOpportunities": ["How to help with their challenges"],
  "connectionOpportunities": ["People/opportunities to introduce them to"],
  "personalGrowth": ["How this friendship can help ${userProfile.name} grow"],
  "energyOptimization": ["Best ways to interact based on both personalities"]
}`
  }

  parseSuggestionResponse(response) {
    try {
      // Try to parse as JSON first
      return JSON.parse(response)
    } catch (_error) {
      // If not valid JSON, parse manually and structure
      return {
        immediateActions: [
          'Connect with them this week',
          'Send a thoughtful message',
          'Share something relevant to their interests',
        ],
        weeklyTouchpoints: ['Regular check-in based on their preferred method'],
        monthlyDeepening: ['Plan a deeper conversation or activity'],
        giftIdeas: ['Something personalized based on their profile'],
        conversationStarters: ['Ask about their current goals', 'Discuss their interests'],
        supportOpportunities: ['Offer help with their mentioned challenges'],
        connectionOpportunities: ['Introduce relevant contacts'],
        personalGrowth: ['Reflect on what you can learn from them'],
        energyOptimization: ['Match their communication style and energy'],
      }
    }
  }

  async generateGoalSupportSuggestions(friend, userProfile) {
    if (!friend.currentGoals?.length) {
      return { suggestions: ['Ask them about their current goals and how you can support'] }
    }

    const context = {
      focus: 'goal_support',
      goals: friend.currentGoals,
    }

    return this.generateFriendshipSuggestions(friend, userProfile, context)
  }

  async generateChallengeSupport(friend, userProfile) {
    if (!friend.challenges?.length) {
      return { suggestions: ["Ask if they're facing any challenges you could help with"] }
    }

    const context = {
      focus: 'challenge_support',
      challenges: friend.challenges,
    }

    return this.generateFriendshipSuggestions(friend, userProfile, context)
  }

  async generateNetworkingOpportunities(friend, userProfile) {
    const context = {
      focus: 'networking',
      userBusiness: userProfile.businessExpertise,
      friendInterests: friend.interests,
    }

    return this.generateFriendshipSuggestions(friend, userProfile, context)
  }

  // Quick suggestions without API call for offline mode
  getOfflineSuggestions(friend, _userProfile) {
    const suggestions = {
      immediateActions: [],
      weeklyTouchpoints: [],
      conversationStarters: [],
      giftIdeas: [],
      supportOpportunities: [],
    }

    // Love language based suggestions
    switch (friend.loveLanguage) {
      case 'Quality Time':
        suggestions.immediateActions.push('Schedule dedicated one-on-one time with them')
        suggestions.weeklyTouchpoints.push('Regular coffee/call sessions')
        suggestions.giftIdeas.push('Plan an experience together rather than buying something')
        break
      case 'Words of Affirmation':
        suggestions.immediateActions.push('Send encouraging message about their strengths')
        suggestions.weeklyTouchpoints.push('Share positive feedback or recognition')
        suggestions.giftIdeas.push('Write a heartfelt note or letter')
        break
      case 'Acts of Service':
        suggestions.immediateActions.push('Offer to help with a specific task')
        suggestions.weeklyTouchpoints.push('Look for ways to make their life easier')
        suggestions.giftIdeas.push('Do something helpful for them instead of buying gifts')
        break
      case 'Physical Touch':
        suggestions.immediateActions.push('Plan in-person meeting with warm greeting')
        suggestions.weeklyTouchpoints.push('Make sure to include appropriate physical connection')
        break
      case 'Receiving Gifts':
        suggestions.immediateActions.push('Send thoughtful gift related to their interests')
        suggestions.weeklyTouchpoints.push('Small thoughtful gestures or tokens')
        suggestions.giftIdeas.push('Something personalized based on their hobbies')
        break
      default:
        suggestions.immediateActions.push("Reach out and check how they're doing")
        suggestions.weeklyTouchpoints.push('Send regular friendly messages')
    }

    // Goal-based conversation starters
    if (friend.currentGoals?.length) {
      friend.currentGoals.forEach((goal) => {
        suggestions.conversationStarters.push(`How is your progress on ${goal}?`)
        suggestions.supportOpportunities.push(`Offer support or resources for ${goal}`)
      })
    } else {
      suggestions.conversationStarters.push('What are you most excited about right now?')
      suggestions.conversationStarters.push('What goals are you working toward?')
    }

    // Interest-based suggestions
    if (friend.interests?.length) {
      friend.interests.slice(0, 3).forEach((interest) => {
        suggestions.conversationStarters.push(`What's new in ${interest} that excites you?`)
        suggestions.giftIdeas.push(`Something related to their ${interest} interest`)
      })
    } else {
      suggestions.conversationStarters.push('What hobbies have you been enjoying lately?')
    }

    // Challenge-based support
    if (friend.challenges?.length) {
      friend.challenges.slice(0, 2).forEach((challenge) => {
        suggestions.supportOpportunities.push(`Ask how you can help with ${challenge}`)
      })
    }

    // Always add these universal suggestions
    suggestions.immediateActions.push('Send them something that made you think of them')
    suggestions.weeklyTouchpoints.push('Regular check-ins at their preferred time')
    suggestions.conversationStarters.push('Ask about their biggest win this week')
    suggestions.conversationStarters.push('Share something you appreciate about them')

    return suggestions
  }
}

export default new ChatGPTService()
