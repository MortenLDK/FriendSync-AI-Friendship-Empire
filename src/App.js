import { useEffect, useState } from 'react'
import './App.css'
import { SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react'
import AddContactForm from './components/AddContactForm'
import ContactImporter from './components/ContactImporter'
import ContactList from './components/ContactList'
import MastermindGroups from './components/MastermindGroups'
import RelationshipActionScheduler from './components/RelationshipActionScheduler'
import StrategicInsights from './components/StrategicInsights'
import UserProfile from './components/UserProfile'
import LocalAISetup from './components/LocalAISetup'
import { hybridSaveProfile, hybridGetProfile, hybridSaveContacts, hybridGetContacts, isSupabaseConfigured } from './services/supabaseService'

function App() {
  const [contacts, setContacts] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showAuth, setShowAuth] = useState('signin') // 'signin' or 'signup'
  const [showAddContact, setShowAddContact] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)
  const [showDataRecovery, setShowDataRecovery] = useState(false)
  const [showLocalAISetup, setShowLocalAISetup] = useState(false)
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      const loadUserData = async () => {
        const userEmail = user.emailAddresses[0]?.emailAddress
        
        console.log(`🚀 Loading data for user: ${user.id}`)
        console.log(`📧 Email: ${userEmail}`)
        console.log(`🏢 Supabase configured: ${isSupabaseConfigured()}`)

        try {
          // Load user profile (Supabase first, localStorage fallback)
          const savedProfile = await hybridGetProfile(user.id, userEmail)
          
          if (savedProfile) {
            setUserProfile(savedProfile)
            if (!savedProfile.setupCompleted) {
              setShowUserProfile(true)
            }
            console.log('✅ User profile loaded successfully')
          } else {
            // Create initial profile from Clerk user data
            const initialProfile = {
              clerkUserId: user.id,
              name: user.fullName || user.firstName || 'User',
              email: userEmail || '',
              setupCompleted: false,
              dateCreated: new Date().toISOString(),
            }
            setUserProfile(initialProfile)
            setShowUserProfile(true)
            console.log('🆕 Created new user profile')
          }

          // Load contacts (Supabase first, localStorage fallback)
          const savedContacts = await hybridGetContacts(user.id, userEmail)
          
          if (savedContacts && Array.isArray(savedContacts) && savedContacts.length > 0) {
            setContacts(savedContacts)
            console.log(`✅ ${savedContacts.length} contacts loaded successfully`)
          } else {
            console.log('📭 No contacts found')
          }

        } catch (error) {
          console.error('❌ Error loading user data:', error)
          // Fallback to localStorage-only mode
          console.log('🔄 Falling back to localStorage-only mode')
        }
      }

      loadUserData()
    }
  }, [user, isLoaded])

  const handleContactsImported = async (importedContacts) => {
    setContacts(importedContacts)
    
    if (user) {
      try {
        const result = await hybridSaveContacts(importedContacts, user.id, userProfile?.email)
        console.log('✅ Contacts imported with hybrid storage:', {
          localStorage: result.localStorage,
          supabase: result.supabase,
          error: result.error
        })
      } catch (error) {
        console.error('❌ Error saving imported contacts:', error)
      }
    }
  }

  const handleContactAdded = async (newContact) => {
    const updatedContacts = [...contacts, newContact]
    setContacts(updatedContacts)
    
    if (user) {
      try {
        const result = await hybridSaveContacts(updatedContacts, user.id, userProfile?.email)
        console.log('✅ Contact added with hybrid storage:', {
          localStorage: result.localStorage,
          supabase: result.supabase,
          error: result.error
        })
        
        // Auto-backup reminder
        if (updatedContacts.length % 5 === 0) {
          console.log('📤 Auto-backup reminder: Consider exporting your data')
        }
      } catch (error) {
        console.error('❌ Error saving new contact:', error)
      }
    }
  }

  const handleProfileUpdate = async (profile) => {
    const updatedProfile = {
      ...profile,
      clerkUserId: user?.id,
      email: user?.emailAddresses[0]?.emailAddress || profile.email,
      lastUpdated: new Date().toISOString(),
    }
    setUserProfile(updatedProfile)
    
    if (user) {
      try {
        const result = await hybridSaveProfile(updatedProfile, user.id)
        console.log('✅ Profile updated with hybrid storage:', {
          localStorage: result.localStorage,
          supabase: result.supabase,
          error: result.error
        })
      } catch (error) {
        console.error('❌ Error saving profile update:', error)
      }
    }
    
    if (profile.setupCompleted) {
      setShowUserProfile(false)
    }
  }

  return (
    <div className="App">
      <header className="modern-header">
        <div className="header-container">
          <div className="header-brand">
            <h1 className="header-title">
              FriendSync
            </h1>
            <p className="header-subtitle">
              AI-powered relationship intelligence
            </p>
          </div>

          <SignedIn>
            <div className="header-actions">
              {userProfile?.setupCompleted && (
                <>
                  <button
                    onClick={() => setShowLocalAISetup(true)}
                    className="btn btn-ghost btn-sm"
                  >
                    🤖 AI Setup
                  </button>
                  <button
                    onClick={() => setShowUserProfile(!showUserProfile)}
                    className="btn btn-ghost btn-sm"
                  >
                    {showUserProfile ? 'Hide Profile' : 'Show Profile'}
                  </button>
                </>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="header-actions">
              <button
                onClick={() => setShowAuth('signup')}
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </button>
              <button
                onClick={() => setShowAuth('signin')}
                className="btn btn-secondary btn-sm"
              >
                Sign In
              </button>
            </div>
          </SignedOut>
        </div>
      </header>

      <main className="main-content">
        <div className="content-grid">
          <SignedOut>
            <div className="auth-container">
              {showAuth === 'signup'
                ? <div className="auth-modal">
                    <SignUp />
                    <p className="auth-switch">
                      Already have an account?
                      <button onClick={() => setShowAuth('signin')} className="link-button">
                        Sign In
                      </button>
                    </p>
                  </div>
                : <div className="auth-modal">
                    <SignIn />
                    <p className="auth-switch">
                      Don't have an account?
                      <button onClick={() => setShowAuth('signup')} className="link-button">
                        Sign Up
                      </button>
                    </p>
                  </div>}
            </div>
          </SignedOut>

          <SignedIn>
            {showUserProfile && <UserProfile onProfileUpdate={handleProfileUpdate} />}

            {(!showUserProfile || userProfile?.setupCompleted) && (
              <>
                <div className="primary-actions">
                  <button
                    onClick={() => setShowAddContact(true)}
                    className="primary-action-btn"
                  >
                    🧠 Add Friend Profile
                  </button>
                  {contacts.length >= 2 && (
                    <button
                      onClick={() => setShowScheduler(true)}
                      className="secondary-action-btn"
                    >
                      📅 Schedule Actions
                    </button>
                  )}
                </div>

                {contacts.length >= 3 && userProfile && userProfile.setupCompleted && (
                  <StrategicInsights contacts={contacts} userProfile={userProfile} />
                )}

                {contacts.length > 0 && (
                  <ContactList contacts={contacts} userProfile={userProfile} />
                )}
                {contacts.length > 2 && userProfile && userProfile.setupCompleted && (
                  <MastermindGroups contacts={contacts} userProfile={userProfile} />
                )}

                {/* Data Recovery for deployment changes */}
                {contacts.length === 0 && userProfile && userProfile.setupCompleted && (
                  <div className="data-recovery-notice">
                    <h3 className="recovery-title">
                      🔄 Missing Your Friends Data?
                    </h3>
                    <p className="recovery-description">
                      If you had Louie, Numan, and other friends on the previous version, you can
                      recover them using the data recovery tool.
                    </p>
                    <button
                      onClick={() => setShowDataRecovery(true)}
                      className="recovery-btn"
                    >
                      🔧 Recover My Data
                    </button>
                  </div>
                )}

                {/* Import function moved to bottom for better UX flow */}
                <div className="advanced-section">
                  <div className="advanced-header">
                    <h3 className="advanced-title">
                      Advanced
                    </h3>
                    <p className="advanced-description">
                      Import contacts from CSV file
                    </p>
                  </div>
                  <ContactImporter 
                    onContactsImported={handleContactsImported} 
                    currentContacts={contacts}
                    userProfile={userProfile}
                  />
                </div>

                {showAddContact && (
                  <AddContactForm
                    onContactAdded={handleContactAdded}
                    onClose={() => setShowAddContact(false)}
                  />
                )}

                {showScheduler && (
                  <RelationshipActionScheduler
                    contacts={contacts}
                    userProfile={userProfile}
                    onClose={() => setShowScheduler(false)}
                  />
                )}

                {showLocalAISetup && (
                  <LocalAISetup onClose={() => setShowLocalAISetup(false)} />
                )}

                {showDataRecovery && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                      padding: '1rem',
                    }}
                    onClick={() => setShowDataRecovery(false)}
                  >
                    <div
                      style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '500px',
                        width: '100%',
                        padding: '2rem',
                        position: 'relative',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setShowDataRecovery(false)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'none',
                          border: 'none',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          color: '#64748b',
                        }}
                      >
                        ×
                      </button>

                      <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>
                        🔄 Data Recovery Instructions
                      </h2>

                      <div style={{ marginBottom: '1.5rem', color: '#374151', lineHeight: 1.6 }}>
                        <p>
                          <strong>Quick Fix:</strong> Go back to the previous URL and export your
                          data, then import it here.
                        </p>

                        <p>
                          <strong>Previous URL:</strong>
                          <br />
                          <a
                            href="https://friendsync-89ra4fipx-mortenldks-projects.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#667eea', textDecoration: 'underline' }}
                          >
                            https://friendsync-89ra4fipx-mortenldks-projects.vercel.app
                          </a>
                        </p>

                        <p>
                          <strong>Steps:</strong>
                        </p>
                        <ol style={{ paddingLeft: '1.5rem' }}>
                          <li>Open the previous URL in a new tab</li>
                          <li>Sign in with the same account</li>
                          <li>Your Louie and Numan profiles should be there</li>
                          <li>Use the CSV import/export feature to transfer data</li>
                          <li>Come back to this new URL and import the data</li>
                        </ol>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <button
                          onClick={() =>
                            window.open(
                              'https://friendsync-89ra4fipx-mortenldks-projects.vercel.app',
                              '_blank',
                            )
                          }
                          style={{
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginRight: '1rem',
                          }}
                        >
                          🔗 Open Previous Version
                        </button>
                        <button
                          onClick={() => setShowDataRecovery(false)}
                          style={{
                            background: '#e5e7eb',
                            color: '#374151',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </SignedIn>
        </div>
      </main>
    </div>
  )
}

export default App
