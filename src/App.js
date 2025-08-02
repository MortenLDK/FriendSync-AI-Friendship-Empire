import React, { useState, useEffect } from 'react';
import './App.css';
import ContactImporter from './components/ContactImporter';
import ContactList from './components/ContactList';
import UserProfile from './components/UserProfile';
import MastermindGroups from './components/MastermindGroups';

function App() {
  const [contacts, setContacts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    // Check if user profile exists
    const savedProfile = localStorage.getItem('friendsync_user_profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      if (!profile.setupCompleted) {
        setShowUserProfile(true);
      }
    } else {
      setShowUserProfile(true);
    }
  }, []);

  const handleContactsImported = (importedContacts) => {
    setContacts(importedContacts);
  };

  const handleProfileUpdate = (profile) => {
    setUserProfile(profile);
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
          {userProfile && userProfile.setupCompleted && (
            <button 
              onClick={() => setShowUserProfile(!showUserProfile)}
              className="profile-toggle"
            >
              {showUserProfile ? 'Hide Profile' : 'Show Profile'}
            </button>
          )}
        </div>
      </header>
      
      <main className="container">
        <div className="main-content">
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
        </div>
      </main>
    </div>
  );
}

export default App;