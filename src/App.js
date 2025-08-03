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
      // Check if user profile exists for this Clerk user
      const savedProfile = localStorage.getItem(`friendsync_user_profile_${user.id}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        if (!profile.setupCompleted) {
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
      const savedContacts = localStorage.getItem(`friendsync_contacts_${user.id}`);
      if (savedContacts) {
        const contactsData = JSON.parse(savedContacts);
        setContacts(contactsData);
      }
    }
  }, [user, isLoaded]);

  const handleContactsImported = (importedContacts) => {
    setContacts(importedContacts);
    // Save contacts to user-specific localStorage
    if (user) {
      localStorage.setItem(`friendsync_contacts_${user.id}`, JSON.stringify(importedContacts));
    }
  };

  const handleContactAdded = async (newContact) => {
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    // Save to user-specific localStorage
    if (user) {
      localStorage.setItem(`friendsync_contacts_${user.id}`, JSON.stringify(updatedContacts));
    }
  };

  const handleProfileUpdate = (profile) => {
    const updatedProfile = {
      ...profile,
      clerkUserId: user?.id,
      email: user?.emailAddresses[0]?.emailAddress || profile.email
    };
    setUserProfile(updatedProfile);
    // Save to user-specific localStorage
    if (user) {
      localStorage.setItem(`friendsync_user_profile_${user.id}`, JSON.stringify(updatedProfile));
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