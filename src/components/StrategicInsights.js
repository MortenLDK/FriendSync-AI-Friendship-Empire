import { useEffect, useState } from 'react'
import './StrategicInsights.css'

const StrategicInsights = ({ contacts, userProfile }) => {
  const [insights, setInsights] = useState([])
  const [selectedInsight, setSelectedInsight] = useState(null)
  const [networkAnalysis, setNetworkAnalysis] = useState(null)

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      generateStrategicInsights()
      analyzeNetwork()
    }
  }, [contacts, analyzeNetwork, generateStrategicInsights])

  const generateStrategicInsights = () => {
    const generatedInsights = []

    // 1. RELATIONSHIP BALANCE ANALYSIS
    const categoryBreakdown = analyzeCategoryBalance()
    if (categoryBreakdown.recommendation) {
      generatedInsights.push({
        id: 'relationship-balance',
        type: 'balance',
        title: 'Relationship Portfolio Balance',
        priority: 'high',
        insight: categoryBreakdown.insight,
        recommendation: categoryBreakdown.recommendation,
        actions: categoryBreakdown.actions,
        metrics: categoryBreakdown.metrics,
      })
    }

    // 2. COMMUNICATION OPTIMIZATION
    const commInsights = analyzeCommunicationPatterns()
    if (commInsights.length > 0) {
      commInsights.forEach((insight) => generatedInsights.push(insight))
    }

    // 3. LOVE LANGUAGE DISTRIBUTION
    const loveLanguageInsights = analyzeLoveLanguages()
    if (loveLanguageInsights) {
      generatedInsights.push(loveLanguageInsights)
    }

    // 4. GOAL ALIGNMENT OPPORTUNITIES
    const goalInsights = analyzeGoalAlignment()
    if (goalInsights.length > 0) {
      goalInsights.forEach((insight) => generatedInsights.push(insight))
    }

    // 5. NETWORKING OPPORTUNITIES
    const networkingInsights = analyzeNetworkingOpportunities()
    if (networkingInsights.length > 0) {
      networkingInsights.forEach((insight) => generatedInsights.push(insight))
    }

    // 6. RELATIONSHIP HEALTH ALERTS
    const healthInsights = analyzeRelationshipHealth()
    if (healthInsights.length > 0) {
      healthInsights.forEach((insight) => generatedInsights.push(insight))
    }

    setInsights(generatedInsights)
  }

  const analyzeCategoryBalance = () => {
    const categories = {}
    contacts.forEach((contact) => {
      const cat = contact.category || 'Regular Friends'
      categories[cat] = (categories[cat] || 0) + 1
    })

    const total = contacts.length
    const innerCircle = categories['Inner Circle'] || 0
    const business = categories.Business || 0
    const network = categories.Network || 0

    const innerCirclePercent = (innerCircle / total) * 100
    const businessPercent = (business / total) * 100

    let insight = ''
    let recommendation = ''
    let actions = []

    if (innerCirclePercent < 10 && total > 5) {
      insight = `Your Inner Circle represents only ${innerCirclePercent.toFixed(1)}% of your network. Research shows the most successful people have 8-12 deep relationships.`
      recommendation =
        'Prioritize deepening relationships with your closest friends. Quality over quantity creates the strongest network ROI.'
      actions = [
        'Identify 3-5 Regular Friends to promote to Inner Circle',
        'Schedule deeper one-on-one time with potential Inner Circle friends',
        'Share more personal goals and challenges to build deeper trust',
      ]
    } else if (businessPercent < 20 && total > 10) {
      insight = `Business relationships represent only ${businessPercent.toFixed(1)}% of your network. Professional relationships often generate the highest career and financial opportunities.`
      recommendation =
        'Expand your professional network strategically. Target industry leaders, mentors, and potential collaborators.'
      actions = [
        'Attend 2-3 industry networking events this month',
        'Reach out to 5 professionals in your field or target industries',
        'Convert some Network connections to Business relationships',
      ]
    }

    return {
      insight,
      recommendation,
      actions,
      metrics: {
        'Inner Circle': `${innerCircle} (${innerCirclePercent.toFixed(1)}%)`,
        Business: `${business} (${businessPercent.toFixed(1)}%)`,
        Network: `${network} (${((network / total) * 100).toFixed(1)}%)`,
        'Regular Friends': `${categories['Regular Friends'] || 0} (${(((categories['Regular Friends'] || 0) / total) * 100).toFixed(1)}%)`,
      },
    }
  }

  const analyzeCommunicationPatterns = () => {
    const insights = []
    const commStyles = {}
    const frequencies = {}

    contacts.forEach((contact) => {
      if (contact.communicationStyle) {
        commStyles[contact.communicationStyle] = (commStyles[contact.communicationStyle] || 0) + 1
      }
      if (contact.communicationFreq) {
        frequencies[contact.communicationFreq] = (frequencies[contact.communicationFreq] || 0) + 1
      }
    })

    // Analyze communication style distribution
    const totalWithStyles = Object.values(commStyles).reduce((a, b) => a + b, 0)
    if (totalWithStyles > 3) {
      const dominant = Object.entries(commStyles).reduce((a, b) =>
        commStyles[a[0]] > commStyles[b[0]] ? a : b,
      )
      const dominantPercent = (dominant[1] / totalWithStyles) * 100

      if (dominantPercent > 60) {
        insights.push({
          id: 'communication-diversity',
          type: 'communication',
          title: 'Communication Style Diversity',
          priority: 'medium',
          insight: `${dominantPercent.toFixed(1)}% of your network shares the same communication style (${dominant[0]}). This creates an echo chamber effect.`,
          recommendation:
            'Diversify your network with people who have different communication styles to expand your perspective and influence.',
          actions: [
            'Actively seek friendships with people who communicate differently',
            'Practice adapting your communication style to match others',
            'Join groups that attract diverse communication styles',
          ],
        })
      }
    }

    return insights
  }

  const analyzeLoveLanguages = () => {
    const loveLanguages = {}
    contacts.forEach((contact) => {
      if (contact.loveLanguage) {
        loveLanguages[contact.loveLanguage] = (loveLanguages[contact.loveLanguage] || 0) + 1
      }
    })

    const totalWithLanguages = Object.values(loveLanguages).reduce((a, b) => a + b, 0)
    if (totalWithLanguages < contacts.length * 0.3) {
      return {
        id: 'love-language-data',
        type: 'optimization',
        title: 'Love Language Intelligence Gap',
        priority: 'high',
        insight: `Only ${totalWithLanguages} of ${contacts.length} friends have love language data. This represents a massive optimization opportunity.`,
        recommendation:
          'Love languages are the key to relationship optimization. Gathering this data will 5x your relationship effectiveness.',
        actions: [
          'Ask friends to take the love language quiz during casual conversations',
          'Share your own love language first to create reciprocity',
          'Use the 5 Love Languages book as a conversation starter',
        ],
        metrics: {
          Profiled: totalWithLanguages,
          Missing: contacts.length - totalWithLanguages,
          'Completion Rate': `${((totalWithLanguages / contacts.length) * 100).toFixed(1)}%`,
        },
      }
    }

    return null
  }

  const analyzeGoalAlignment = () => {
    const insights = []
    const personalGoals = []
    const professionalGoals = []

    contacts.forEach((contact) => {
      if (contact.personalGoals) {
        personalGoals.push({ name: contact.name, goals: contact.personalGoals })
      }
      if (contact.professionalGoals) {
        professionalGoals.push({ name: contact.name, goals: contact.professionalGoals })
      }
    })

    // Look for collaboration opportunities
    if (professionalGoals.length >= 2) {
      insights.push({
        id: 'collaboration-opportunities',
        type: 'opportunity',
        title: 'Hidden Collaboration Opportunities',
        priority: 'high',
        insight: `${professionalGoals.length} friends have shared their professional goals. There are likely hidden synergies and collaboration opportunities.`,
        recommendation:
          'Analyze goal overlaps to facilitate introductions and create mutual value for your network.',
        actions: [
          'Map out complementary skills and goals between friends',
          'Facilitate strategic introductions between friends with aligned goals',
          'Organize group activities around shared professional interests',
        ],
        data: professionalGoals.slice(0, 5), // Show first 5 for preview
      })
    }

    return insights
  }

  const analyzeNetworkingOpportunities = () => {
    const insights = []
    const expertise = []
    const helpNeeded = []

    contacts.forEach((contact) => {
      if (contact.theirExpertise) {
        expertise.push({ name: contact.name, expertise: contact.theirExpertise })
      }
      if (contact.howTheyCanHelp) {
        helpNeeded.push({ name: contact.name, help: contact.howTheyCanHelp })
      }
    })

    if (expertise.length >= 3) {
      insights.push({
        id: 'expertise-network',
        type: 'opportunity',
        title: 'Expertise Network Goldmine',
        priority: 'high',
        insight: `Your network contains ${expertise.length} documented areas of expertise. This represents massive untapped value.`,
        recommendation:
          'Become the connector in your network. Facilitate introductions and create value by matching expertise with needs.',
        actions: [
          'Create a private expertise directory of your network',
          'Proactively make introductions when you spot synergies',
          "Host networking events that showcase your friends' expertise",
        ],
        data: expertise.slice(0, 5),
      })
    }

    return insights
  }

  const analyzeRelationshipHealth = () => {
    const insights = []
    const incomplete = contacts.filter(
      (contact) => !contact.loveLanguage || !contact.personalGoals || !contact.howICanHelp,
    )

    if (incomplete.length > contacts.length * 0.5) {
      insights.push({
        id: 'incomplete-profiles',
        type: 'health',
        title: 'Relationship Profile Completion',
        priority: 'medium',
        insight: `${incomplete.length} of ${contacts.length} friend profiles are incomplete. Missing data limits relationship optimization potential.`,
        recommendation:
          'Gradually complete friend profiles through natural conversations. Each data point unlocks better strategic insights.',
        actions: [
          'Set a goal to complete 1-2 profiles per week through casual conversations',
          'Use the AI chat feature to get suggestions for gathering missing data',
          'Focus on completing Inner Circle profiles first for maximum impact',
        ],
      })
    }

    return insights
  }

  const analyzeNetwork = () => {
    const analysis = {
      totalFriends: contacts.length,
      categories: {},
      loveLanguageDistribution: {},
      topExpertise: [],
      networkValue: calculateNetworkValue(),
    }

    // Category breakdown
    contacts.forEach((contact) => {
      const cat = contact.category || 'Regular Friends'
      analysis.categories[cat] = (analysis.categories[cat] || 0) + 1
    })

    // Love language distribution
    contacts.forEach((contact) => {
      if (contact.loveLanguage) {
        analysis.loveLanguageDistribution[contact.loveLanguage] =
          (analysis.loveLanguageDistribution[contact.loveLanguage] || 0) + 1
      }
    })

    setNetworkAnalysis(analysis)
  }

  const calculateNetworkValue = () => {
    let score = 0

    contacts.forEach((contact) => {
      // Base points for each friend
      score += 10

      // Bonus for complete profiles
      if (contact.loveLanguage) score += 15
      if (contact.personalGoals) score += 10
      if (contact.theirExpertise) score += 20
      if (contact.howICanHelp) score += 15

      // Category multipliers
      if (contact.category === 'Inner Circle') score += 30
      if (contact.category === 'Business') score += 25
    })

    return score
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'balance':
        return '⚖️'
      case 'communication':
        return '💬'
      case 'optimization':
        return '🚀'
      case 'opportunity':
        return '💎'
      case 'health':
        return '🩺'
      default:
        return '🧠'
    }
  }

  return (
    <div className="strategic-insights">
      <div className="insights-header">
        <h2>🧠 Strategic Network Insights</h2>
        <p>AI-powered analysis of your relationship portfolio</p>
      </div>

      {networkAnalysis && (
        <div className="network-overview">
          <div className="overview-cards">
            <div className="overview-card">
              <div className="card-value">{networkAnalysis.totalFriends}</div>
              <div className="card-label">Total Friends</div>
            </div>
            <div className="overview-card">
              <div className="card-value">{networkAnalysis.networkValue}</div>
              <div className="card-label">Network Value Score</div>
            </div>
            <div className="overview-card">
              <div className="card-value">
                {Object.keys(networkAnalysis.loveLanguageDistribution).length}
              </div>
              <div className="card-label">Love Languages Mapped</div>
            </div>
            <div className="overview-card">
              <div className="card-value">{networkAnalysis.categories['Inner Circle'] || 0}</div>
              <div className="card-label">Inner Circle</div>
            </div>
          </div>
        </div>
      )}

      <div className="insights-grid">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="insight-card"
            onClick={() => setSelectedInsight(insight)}
          >
            <div className="insight-header">
              <div className="insight-icon">{getTypeIcon(insight.type)}</div>
              <div className="insight-title-section">
                <h3>{insight.title}</h3>
                <span
                  className="insight-priority"
                  style={{ backgroundColor: getPriorityColor(insight.priority) }}
                >
                  {insight.priority.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="insight-preview">{insight.insight}</p>
            <div className="insight-meta">
              <span>Click for detailed recommendations</span>
              <span className="arrow">→</span>
            </div>
          </div>
        ))}
      </div>

      {insights.length === 0 && (
        <div className="no-insights">
          <h3>🎯 Building Insights...</h3>
          <p>Add more friend profiles to unlock strategic insights about your network.</p>
          <ul>
            <li>Complete friend profiles with love languages and goals</li>
            <li>Add at least 5 friends for meaningful analysis</li>
            <li>Categorize relationships (Inner Circle, Business, etc.)</li>
          </ul>
        </div>
      )}

      {selectedInsight && (
        <div className="insight-modal-overlay" onClick={() => setSelectedInsight(null)}>
          <div className="insight-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {getTypeIcon(selectedInsight.type)} {selectedInsight.title}
              </h2>
              <button onClick={() => setSelectedInsight(null)} className="close-button">
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="insight-section">
                <h3>📊 Analysis</h3>
                <p>{selectedInsight.insight}</p>
              </div>

              <div className="insight-section">
                <h3>💡 Strategic Recommendation</h3>
                <p>{selectedInsight.recommendation}</p>
              </div>

              <div className="insight-section">
                <h3>🎯 Action Steps</h3>
                <ul>
                  {selectedInsight.actions?.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>

              {selectedInsight.metrics && (
                <div className="insight-section">
                  <h3>📈 Metrics</h3>
                  <div className="metrics-grid">
                    {Object.entries(selectedInsight.metrics).map(([key, value]) => (
                      <div key={key} className="metric-item">
                        <span className="metric-label">{key}:</span>
                        <span className="metric-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedInsight.data && (
                <div className="insight-section">
                  <h3>📋 Data Preview</h3>
                  <div className="data-preview">
                    {selectedInsight.data.map((item, index) => (
                      <div key={index} className="data-item">
                        <strong>{item.name}:</strong> {item.goals || item.expertise || item.help}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StrategicInsights
