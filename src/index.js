import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'

// Get your publishable key from Clerk
const clerkPubKey =
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY ||
  'pk_test_bGVnaWJsZS1wb3NzdW0tOTkuY2xlcmsuYWNjb3VudHMuZGV2JA'

// Debug: Check which key is being used
console.log('Clerk Key Being Used:', clerkPubKey)
console.log('Environment Variable:', process.env.REACT_APP_CLERK_PUBLISHABLE_KEY)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
