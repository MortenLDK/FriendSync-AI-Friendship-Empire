import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

// Get your publishable key from Clerk
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || 'pk_test_aGFwcHktbWlubm93LTUwLmNsZXJrLmFjY291bnRzLmRldiQ';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);