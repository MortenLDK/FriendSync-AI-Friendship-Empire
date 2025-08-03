import React, { useState, useEffect } from 'react';
import './App.css';
import ContactImporter from './components/ContactImporter';
import ContactList from './components/ContactList';
import UserProfile from './components/UserProfile';
import MastermindGroups from './components/MastermindGroups';
import AddContactForm from './components/AddContactForm';
import StrategicInsights from './components/StrategicInsights';
import RelationshipActionScheduler from './components/RelationshipActionScheduler';
import { SignedIn, SignedOut, UserButton, SignIn, SignUp, useUser } from '@clerk/clerk-react';

function App() {
  const [contacts, setContacts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAuth, setShowAuth] = useState('signin'); // 'signin' or 'signup'
  const [showAddContact, setShowAddContact] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Migration function to handle data from previous deployments
      const migrateUserData = () => {
        const userEmail = user.emailAddresses[0]?.emailAddress;
        
        // Try to find user data with different possible keys
        const possibleKeys = [
          `friendsync_user_profile_${user.id}`,
          `user_profile_${user.id}`,
          `profile_${user.id}`,
          // Try email-based backup keys
          userEmail ? `friendsync_backup_profile_${userEmail}` : null
        ].filter(Boolean);
        
        let foundProfile = null;
        for (const key of possibleKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              foundProfile = JSON.parse(data);
              // Standardize the key
              if (key !== `friendsync_user_profile_${user.id}`) {
                localStorage.setItem(`friendsync_user_profile_${user.id}`, data);
                // Don't remove backup keys, keep them for redundancy
                if (!key.includes('backup')) {
                  localStorage.removeItem(key); // Clean up old non-backup keys
                }
              }
              break;
            } catch (e) {
              console.log('Failed to parse profile data:', e);
            }
          }
        }
        
        // Try to find contacts with different possible keys
        const contactKeys = [
          `friendsync_contacts_${user.id}`,
          `contacts_${user.id}`,
          `user_contacts_${user.id}`,
          // Try email-based backup keys
          userEmail ? `friendsync_backup_contacts_${userEmail}` : null
        ].filter(Boolean);
        
        let foundContacts = null;
        for (const key of contactKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              foundContacts = JSON.parse(data);
              // Standardize the key
              if (key !== `friendsync_contacts_${user.id}`) {
                localStorage.setItem(`friendsync_contacts_${user.id}`, data);
                // Don't remove backup keys, keep them for redundancy
                if (!key.includes('backup')) {
                  localStorage.removeItem(key); // Clean up old non-backup keys
                }
              }
              break;
            } catch (e) {
              console.log('Failed to parse contacts data:', e);
            }
          }
        }
        
        return { profile: foundProfile, contacts: foundContacts };
      };

      // Attempt data migration
      const { profile: savedProfile, contacts: savedContacts } = migrateUserData();
      
      // Check if user profile exists for this Clerk user
      if (savedProfile) {
        setUserProfile(savedProfile);
        if (!savedProfile.setupCompleted) {
          setShowUserProfile(true);
        }
      } else {
        // Create initial profile from Clerk user data
        const initialProfile = {
          clerkUserId: user.id,
          name: user.fullName || user.firstName || 'User',
          email: user.emailAddresses[0]?.emailAddress || '',
          setupCompleted: false,
          dateCreated: new Date().toISOString()
        };
        setUserProfile(initialProfile);
        setShowUserProfile(true);
      }

      // Load saved contacts for this user
      if (savedContacts && Array.isArray(savedContacts)) {
        setContacts(savedContacts);
      }
    }
  }, [user, isLoaded]);

  const handleContactsImported = (importedContacts) => {
    setContacts(importedContacts);
    // Save contacts to user-specific localStorage with backup
    if (user) {
      const contactsData = JSON.stringify(importedContacts);
      localStorage.setItem(`friendsync_contacts_${user.id}`, contactsData);
      // Backup with email as well
      if (userProfile?.email) {
        localStorage.setItem(`friendsync_backup_contacts_${userProfile.email}`, contactsData);
      }
    }
  };

  const handleContactAdded = async (newContact) => {
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    // Save to user-specific localStorage with backup
    if (user) {
      const contactsData = JSON.stringify(updatedContacts);
      localStorage.setItem(`friendsync_contacts_${user.id}`, contactsData);
      // Backup with email as well
      if (userProfile?.email) {
        localStorage.setItem(`friendsync_backup_contacts_${userProfile.email}`, contactsData);
      }
    }
  };

  const handleProfileUpdate = (profile) => {
    const updatedProfile = {
      ...profile,
      clerkUserId: user?.id,
      email: user?.emailAddresses[0]?.emailAddress || profile.email,
      lastUpdated: new Date().toISOString()
    };
    setUserProfile(updatedProfile);
    // Save to multiple keys for redundancy
    if (user) {
      const profileData = JSON.stringify(updatedProfile);
      localStorage.setItem(`friendsync_user_profile_${user.id}`, profileData);
      // Backup with email as well (in case user ID changes)
      if (updatedProfile.email) {
        localStorage.setItem(`friendsync_backup_profile_${updatedProfile.email}`, profileData);
      }
    }
    if (profile.setupCompleted) {
      setShowUserProfile(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
      <header style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              color: '#0f172a', 
              margin: 0 
            }}>FriendSync</h1>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b', 
              margin: 0,
              display: window.innerWidth > 640 ? 'block' : 'none'
            }}>AI-powered friendship management</p>
          </div>
          
          <SignedIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {userProfile && userProfile.setupCompleted && (
                <button 
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  style={{
                    background: 'transparent',
                    color: '#64748b',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#0f172a'}
                  onMouseOut={(e) => e.target.style.color = '#64748b'}
                >
                  {showUserProfile ? 'Hide Profile' : 'Show Profile'}
                </button>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          
          <SignedOut>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => setShowAuth('signup')}
                style={{
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#1e293b';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#0f172a';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Sign Up
              </button>
              <button 
                onClick={() => setShowAuth('signin')}
                style={{
                  background: 'transparent',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f8fafc';
                  e.target.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                Sign In
              </button>
            </div>
          </SignedOut>
        </div>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SignedOut>
            <div className="auth-container">
              {showAuth === 'signup' ? (
                <div className="auth-modal">
                  <SignUp />
                  <p className="auth-switch">
                    Already have an account? 
                    <button onClick={() => setShowAuth('signin')} className="link-button">
                      Sign In
                    </button>
                  </p>
                </div>
              ) : (
                <div className="auth-modal">
                  <SignIn />
                  <p className="auth-switch">
                    Don't have an account? 
                    <button onClick={() => setShowAuth('signup')} className="link-button">
                      Sign Up
                    </button>
                  </p>
                </div>
              )}
            </div>
          </SignedOut>

          <SignedIn>
            {showUserProfile && (
              <UserProfile onProfileUpdate={handleProfileUpdate} />
            )}
            
            {(!showUserProfile || (userProfile && userProfile.setupCompleted)) && (
              <>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
                  <ContactImporter onContactsImported={handleContactsImported} />
                  <button
                    onClick={() => setShowAddContact(true)}
                    style={{
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#5a6fd8';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = '#667eea';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🧠 Add Friend Profile
                  </button>
                  {contacts.length >= 2 && (
                    <button
                      onClick={() => setShowScheduler(true)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📅 Schedule Actions
                    </button>
                  )}
                </div>
                
                {contacts.length >= 3 && userProfile && userProfile.setupCompleted && (
                  <StrategicInsights contacts={contacts} userProfile={userProfile} />
                )}
                
                {contacts.length > 0 && <ContactList contacts={contacts} userProfile={userProfile} />}
                {contacts.length > 2 && userProfile && userProfile.setupCompleted && (
                  <MastermindGroups contacts={contacts} userProfile={userProfile} />
                )}
                
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
              </>
            )}
          </SignedIn>
        </div>
      </main>
    </div>
  );
}

export default App;