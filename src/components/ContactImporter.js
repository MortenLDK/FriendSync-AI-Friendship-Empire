import { useState } from 'react'
import './ContactImporter.css'

const ContactImporter = ({ onContactsImported, currentContacts = [], userProfile }) => {
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const [isSupported, _setIsSupported] = useState('contacts' in navigator)

  const importContacts = async () => {
    if (!('contacts' in navigator)) {
      setImportStatus('Contact Picker API is not supported in this browser')
      return
    }

    setIsImporting(true)
    setImportStatus('')

    try {
      const properties = ['name', 'email', 'tel']
      const opts = { multiple: true }

      const contacts = await navigator.contacts.select(properties, opts)

      const processedContacts = contacts.map((contact, index) => ({
        id: `contact-${Date.now()}-${index}`,
        name: contact.name?.[0] || 'Unknown',
        email: contact.email?.[0] || '',
        phone: contact.tel?.[0] || '',

        // Core categorization
        category: 'Regular Friends',
        tier: 'free', // free/premium

        // AI-optimized friend profile
        loveLanguage: '',
        personalityType: '',
        energyStyle: '', // introvert/extrovert/ambivert

        // Goals & Challenges (for AI suggestions)
        currentGoals: [],
        challenges: [],
        interests: [],
        strengths: [],

        // Interaction optimization
        preferredContactMethod: '', // call/text/email/social
        bestTimeToConnect: '',
        communicationStyle: '', // direct/supportive/analytical/expressive

        // Relationship data
        notes: '',
        lastInteraction: null,
        interactionHistory: [],
        relationshipDepth: 'surface', // surface/growing/deep

        // AI suggestion tracking
        suggestedActions: [],
        completedSuggestions: [],

        // Metadata
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }))

      onContactsImported(processedContacts)
      setImportStatus(`Successfully imported ${processedContacts.length} contacts`)
    } catch (error) {
      if (error.name === 'AbortError') {
        setImportStatus('Contact import was cancelled')
      } else {
        setImportStatus(`Error importing contacts: ${error.message}`)
      }
    } finally {
      setIsImporting(false)
    }
  }

  const importFromFile = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsImporting(true)
    setImportStatus('')

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target.result
        let contacts = []

        if (file.type === 'application/json') {
          const jsonData = JSON.parse(content)
          
          // Handle FriendSync export format
          if (jsonData.contacts && jsonData.userProfile) {
            contacts = jsonData.contacts
          } else {
            contacts = jsonData
          }
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          contacts = parseCSV(content)
        } else {
          throw new Error('Unsupported file format')
        }

        const processedContacts = contacts.map((contact, index) => ({
          id: contact.id || `contact-${Date.now()}-${index}`,
          name: contact.name || 'Unknown',
          email: contact.email || '',
          phone: contact.phone || contact.tel || '',

          // Core categorization
          category: contact.category || 'Regular Friends',
          tier: contact.tier || 'free',

          // AI-optimized friend profile
          loveLanguage: contact.loveLanguage || '',
          personalityType: contact.personalityType || '',
          energyStyle: contact.energyStyle || '',

          // Goals & Challenges
          currentGoals: contact.currentGoals || [],
          challenges: contact.challenges || [],
          interests: contact.interests || [],
          strengths: contact.strengths || [],

          // Interaction optimization
          preferredContactMethod: contact.preferredContactMethod || '',
          bestTimeToConnect: contact.bestTimeToConnect || '',
          communicationStyle: contact.communicationStyle || '',

          // Relationship data
          notes: contact.notes || '',
          lastInteraction: contact.lastInteraction || null,
          interactionHistory: contact.interactionHistory || [],
          relationshipDepth: contact.relationshipDepth || 'surface',

          // AI suggestion tracking
          suggestedActions: contact.suggestedActions || [],
          completedSuggestions: contact.completedSuggestions || [],

          // Metadata
          dateAdded: contact.dateAdded || new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        }))

        onContactsImported(processedContacts)
        setImportStatus(`Successfully imported ${processedContacts.length} contacts from file`)
      } catch (error) {
        setImportStatus(`Error reading file: ${error.message}`)
      } finally {
        setIsImporting(false)
      }
    }

    reader.readAsText(file)
  }

  const exportData = () => {
    if (!currentContacts || currentContacts.length === 0) {
      setImportStatus('No contacts to export')
      return
    }

    const exportData = {
      userProfile: userProfile,
      contacts: currentContacts,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `friendsync-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    setImportStatus(`Successfully exported ${currentContacts.length} contacts and profile data`)
  }

  const parseCSV = (csvContent) => {
    const lines = csvContent.split('\n')
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(',').map((v) => v.trim())
        const contact = {}

        headers.forEach((header, index) => {
          if (header === 'name') contact.name = values[index]
          else if (header === 'email') contact.email = values[index]
          else if (header === 'phone' || header === 'tel') contact.phone = values[index]
        })

        return contact
      })
  }

  return (
    <div className="contact-importer card">
      <h2>Import Contacts</h2>
      <p>Get started by importing your contacts to enhance your friend profiles.</p>

      <div className="import-options">
        {isSupported
          ? <div className="import-option">
              <h3>Import from Device</h3>
              <p>Use your browser's contact picker to select contacts</p>
              <button onClick={importContacts} disabled={isImporting} className="primary-button">
                {isImporting ? 'Importing...' : 'Select Contacts'}
              </button>
            </div>
          : <div className="import-option">
              <h3>Device Import Not Available</h3>
              <p>
                Contact Picker API is not supported in this browser. Try Chrome on Android or use
                file import.
              </p>
            </div>}

        <div className="import-option">
          <h3>Import from File</h3>
          <p>Upload a CSV or JSON file with your contacts</p>
          <input
            type="file"
            accept=".csv,.json"
            onChange={importFromFile}
            disabled={isImporting}
            id="file-input"
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            Choose File
          </label>
        </div>

        {currentContacts.length > 0 && (
          <div className="import-option export-option">
            <h3>Export Data</h3>
            <p>Export your contacts and profile for backup or transfer to another deployment</p>
            <button onClick={exportData} className="secondary-button" type="button">
              📥 Export {currentContacts.length} Contacts
            </button>
          </div>
        )}
      </div>

      {importStatus && (
        <div className={`import-status ${importStatus.includes('Error') ? 'error' : 'success'}`}>
          {importStatus}
        </div>
      )}

      <div className="help-text">
        <h4>Supported Formats:</h4>
        <ul>
          <li>
            <strong>CSV:</strong> Include columns for name, email, phone
          </li>
          <li>
            <strong>JSON:</strong> Array of contact objects with name, email, phone fields
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ContactImporter
