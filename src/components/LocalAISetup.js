import { useState, useEffect } from 'react'
import './LocalAISetup.css'
import localAIService from '../services/localAIService'

const LocalAISetup = ({ onClose }) => {
  const [installationStatus, setInstallationStatus] = useState('checking')
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    checkInstallationStatus()
  }, [])

  const checkInstallationStatus = async () => {
    await localAIService.checkAvailability()
    setInstallationStatus(localAIService.isAvailable ? 'installed' : 'not-installed')
  }

  const instructions = localAIService.getInstallationInstructions()

  return (
    <div className="local-ai-setup-overlay" onClick={onClose}>
      <div className="local-ai-setup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="setup-header">
          <h2>🤖 Local AI Setup - OpenAI GPT-OSS</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="setup-content">
          {installationStatus === 'checking' && (
            <div className="status-checking">
              <div className="loading-spinner"></div>
              <p>Checking for local AI installation...</p>
            </div>
          )}

          {installationStatus === 'installed' && (
            <div className="status-installed">
              <div className="success-icon">✅</div>
              <h3>Local AI is Ready!</h3>
              <p>OpenAI GPT-OSS is installed and running. Your friendship data will be processed completely privately on your device.</p>
              
              <div className="ai-benefits">
                <h4>Active Benefits:</h4>
                <ul>
                  <li>🔒 <strong>Complete Privacy:</strong> Data never leaves your device</li>
                  <li>💰 <strong>Zero Costs:</strong> Unlimited AI conversations</li>
                  <li>⚡ <strong>Faster Responses:</strong> No internet latency</li>
                  <li>🌐 <strong>Works Offline:</strong> AI available anywhere</li>
                </ul>
              </div>

              <div className="model-info">
                <p><strong>Model:</strong> {localAIService.model}</p>
                <p><strong>Source:</strong> OpenAI GPT-OSS (Apache 2.0 License)</p>
                <p><strong>Performance:</strong> Matches GPT-4 mini quality</p>
              </div>

              <button onClick={onClose} className="continue-button">
                Continue with Private AI
              </button>
            </div>
          )}

          {installationStatus === 'not-installed' && (
            <div className="status-not-installed">
              <div className="info-icon">ℹ️</div>
              <h3>{instructions.title}</h3>
              
              <div className="benefits-section">
                <h4>Why Install Local AI?</h4>
                <ul>
                  {instructions.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="requirements-section">
                <h4>System Requirements:</h4>
                <p>{instructions.requirements}</p>
              </div>

              <div className="installation-steps">
                <h4>Quick Installation:</h4>
                {!showInstructions ? (
                  <button 
                    onClick={() => setShowInstructions(true)}
                    className="show-instructions-btn"
                  >
                    Show Installation Steps
                  </button>
                ) : (
                  <div className="steps-list">
                    {instructions.steps.map((step, index) => (
                      <div key={index} className="installation-step">
                        <span className="step-number">{index + 1}</span>
                        <span className="step-text">{step}</span>
                      </div>
                    ))}
                    
                    <div className="installation-links">
                      <a 
                        href="https://ollama.ai/download" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="download-link"
                      >
                        📥 Download Ollama
                      </a>
                      <a 
                        href="https://github.com/openai/gpt-oss" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="github-link"
                      >
                        📚 OpenAI GPT-OSS Docs
                      </a>
                    </div>

                    <button 
                      onClick={checkInstallationStatus}
                      className="recheck-button"
                    >
                      🔄 Recheck Installation
                    </button>
                  </div>
                )}
              </div>

              <div className="fallback-notice">
                <h4>No Problem if You Skip This!</h4>
                <p>FriendSync works great with cloud AI or offline responses. You can always install local AI later for enhanced privacy.</p>
                
                <button onClick={onClose} className="continue-without-button">
                  Continue with Cloud AI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LocalAISetup