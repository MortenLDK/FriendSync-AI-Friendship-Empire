import React, { useState, useEffect } from 'react';
import './App.css';
import ContactImporter from './components/ContactImporter';
import ContactList from './components/ContactList';
import UserProfile from './components/UserProfile';
import MastermindGroups from './components/MastermindGroups';
import { SignedIn, SignedOut, UserButton, SignIn, SignUp, useUser } from '@clerk/clerk-react';

function App() {
  const [contacts, setContacts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAuth, setShowAuth] = useState('signin'); // 'signin' or 'signup'
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
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>FriendSync</h1>
          <p>AI-powered friendship management system</p>
          
          <SignedIn>
            <div className="header-user-section">
              {userProfile && userProfile.setupCompleted && (
                <button 
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  className="profile-toggle"
                >
                  {showUserProfile ? 'Hide Profile' : 'Show Profile'}
                </button>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="auth-buttons">
              <button 
                onClick={() => setShowAuth('signup')}
                className="auth-button signup-button"
              >
                Sign Up
              </button>
              <button 
                onClick={() => setShowAuth('signin')}
                className="auth-button signin-button"
              >
                Sign In
              </button>
            </div>
          </SignedOut>
        </div>
      </header>
      
      <main className="container">
        <div className="main-content">
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
                <ContactImporter onContactsImported={handleContactsImported} />
                {contacts.length > 0 && <ContactList contacts={contacts} userProfile={userProfile} />}
                {contacts.length > 2 && userProfile && userProfile.setupCompleted && (
                  <MastermindGroups contacts={contacts} userProfile={userProfile} />
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