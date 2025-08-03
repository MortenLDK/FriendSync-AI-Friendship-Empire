import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// NOTE: You need to replace these with your actual Supabase project credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url-here'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key-here'

let supabase = null

// Initialize Supabase client
const initializeSupabase = () => {
  if (!supabase && supabaseUrl !== 'your-supabase-url-here' && supabaseAnonKey !== 'your-supabase-anon-key-here') {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabase
}

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return supabaseUrl !== 'your-supabase-url-here' && supabaseAnonKey !== 'your-supabase-anon-key-here'
}

// USER PROFILES OPERATIONS
export const saveUserProfile = async (userProfile, clerkUserId) => {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, falling back to localStorage')
      return { success: false, error: 'Supabase not configured' }
    }

    const client = initializeSupabase()
    if (!client) {
      throw new Error('Failed to initialize Supabase client')
    }

    const profileData = {
      clerk_user_id: clerkUserId,
      profile_data: userProfile,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await client
      .from('user_profiles')
      .upsert(profileData, { 
        onConflict: 'clerk_user_id',
        returning: 'minimal'
      })

    if (error) {
      console.error('Supabase save profile error:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Profile saved to Supabase successfully')
    return { success: true, data }
  } catch (error) {
    console.error('Failed to save profile to Supabase:', error)
    return { success: false, error: error.message }
  }
}

export const getUserProfile = async (clerkUserId) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' }
    }

    const client = initializeSupabase()
    if (!client) {
      throw new Error('Failed to initialize Supabase client')
    }

    const { data, error } = await client
      .from('user_profiles')
      .select('profile_data')
      .eq('clerk_user_id', clerkUserId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Supabase get profile error:', error)
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: true, data: null } // No profile found
    }

    console.log('✅ Profile loaded from Supabase successfully')
    return { success: true, data: data.profile_data }
  } catch (error) {
    console.error('Failed to get profile from Supabase:', error)
    return { success: false, error: error.message }
  }
}

// CONTACTS OPERATIONS
export const saveContacts = async (contacts, clerkUserId) => {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, falling back to localStorage')
      return { success: false, error: 'Supabase not configured' }
    }

    const client = initializeSupabase()
    if (!client) {
      throw new Error('Failed to initialize Supabase client')
    }

    // First, delete existing contacts for this user
    await client
      .from('contacts')
      .delete()
      .eq('clerk_user_id', clerkUserId)

    // Then insert all current contacts
    const contactsData = contacts.map(contact => ({
      clerk_user_id: clerkUserId,
      contact_id: contact.id,
      contact_data: contact,
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await client
      .from('contacts')
      .insert(contactsData)

    if (error) {
      console.error('Supabase save contacts error:', error)
      return { success: false, error: error.message }
    }

    console.log(`✅ ${contacts.length} contacts saved to Supabase successfully`)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to save contacts to Supabase:', error)
    return { success: false, error: error.message }
  }
}

export const getContacts = async (clerkUserId) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' }
    }

    const client = initializeSupabase()
    if (!client) {
      throw new Error('Failed to initialize Supabase client')
    }

    const { data, error } = await client
      .from('contacts')
      .select('contact_data')
      .eq('clerk_user_id', clerkUserId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Supabase get contacts error:', error)
      return { success: false, error: error.message }
    }

    const contacts = data ? data.map(row => row.contact_data) : []
    console.log(`✅ ${contacts.length} contacts loaded from Supabase successfully`)
    return { success: true, data: contacts }
  } catch (error) {
    console.error('Failed to get contacts from Supabase:', error)
    return { success: false, error: error.message }
  }
}

// CALENDAR EVENTS OPERATIONS
export const saveCalendarEvents = async (events, clerkUserId) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' }
    }

    const client = initializeSupabase()
    if (!client) {
      throw new Error('Failed to initialize Supabase client')
    }

    // First, delete existing events for this user
    await client
      .from('calendar_events')
      .delete()
      .eq('clerk_user_id', clerkUserId)

    // Then insert all current events
    const eventsData = events.map(event => ({
      clerk_user_id: clerkUserId,
      event_id: event.id,
      event_data: event,
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await client
      .from('calendar_events')
      .insert(eventsData)

    if (error) {
      console.error('Supabase save events error:', error)
      return { success: false, error: error.message }
    }

    console.log(`✅ ${events.length} calendar events saved to Supabase successfully`)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to save calendar events to Supabase:', error)
    return { success: false, error: error.message }
  }
}

export const getCalendarEvents = async (clerkUserId) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' }
    }

    const client = initializeSupabase()
    if (!client) {
      throw new Error('Failed to initialize Supabase client')
    }

    const { data, error } = await client
      .from('calendar_events')
      .select('event_data')
      .eq('clerk_user_id', clerkUserId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Supabase get events error:', error)
      return { success: false, error: error.message }
    }

    const events = data ? data.map(row => row.event_data) : []
    console.log(`✅ ${events.length} calendar events loaded from Supabase successfully`)
    return { success: true, data: events }
  } catch (error) {
    console.error('Failed to get calendar events from Supabase:', error)
    return { success: false, error: error.message }
  }
}

// HYBRID STORAGE - Use Supabase with localStorage fallback
export const hybridSaveProfile = async (userProfile, clerkUserId) => {
  // Always save to localStorage as backup
  const profileData = JSON.stringify(userProfile)
  localStorage.setItem(`friendsync_user_profile_${clerkUserId}`, profileData)
  
  if (userProfile.email) {
    localStorage.setItem(`friendsync_backup_profile_${userProfile.email}`, profileData)
    localStorage.setItem(`friendsync_profile_permanent_${userProfile.email}`, profileData)
  }
  
  // Try to save to Supabase
  const supabaseResult = await saveUserProfile(userProfile, clerkUserId)
  
  return {
    localStorage: true,
    supabase: supabaseResult.success,
    error: supabaseResult.error
  }
}

export const hybridGetProfile = async (clerkUserId, userEmail) => {
  // Try Supabase first
  const supabaseResult = await getUserProfile(clerkUserId)
  
  if (supabaseResult.success && supabaseResult.data) {
    console.log('✅ Profile loaded from Supabase')
    return supabaseResult.data
  }
  
  // Fallback to localStorage
  const possibleKeys = [
    `friendsync_user_profile_${clerkUserId}`,
    userEmail ? `friendsync_backup_profile_${userEmail}` : null,
    userEmail ? `friendsync_profile_permanent_${userEmail}` : null,
  ].filter(Boolean)

  for (const key of possibleKeys) {
    const data = localStorage.getItem(key)
    if (data) {
      try {
        console.log('✅ Profile loaded from localStorage fallback')
        return JSON.parse(data)
      } catch (e) {
        console.log('Failed to parse profile data:', e)
      }
    }
  }
  
  return null
}

export const hybridSaveContacts = async (contacts, clerkUserId, userEmail) => {
  // Always save to localStorage as backup
  const contactsData = JSON.stringify(contacts)
  localStorage.setItem(`friendsync_contacts_${clerkUserId}`, contactsData)
  
  if (userEmail) {
    localStorage.setItem(`friendsync_backup_contacts_${userEmail}`, contactsData)
  }
  localStorage.setItem(`friendsync_emergency_contacts_${Date.now()}`, contactsData)
  
  // Try to save to Supabase
  const supabaseResult = await saveContacts(contacts, clerkUserId)
  
  return {
    localStorage: true,
    supabase: supabaseResult.success,
    error: supabaseResult.error
  }
}

export const hybridGetContacts = async (clerkUserId, userEmail) => {
  // Try Supabase first
  const supabaseResult = await getContacts(clerkUserId)
  
  if (supabaseResult.success && supabaseResult.data && supabaseResult.data.length > 0) {
    console.log('✅ Contacts loaded from Supabase')
    return supabaseResult.data
  }
  
  // Fallback to localStorage
  const contactKeys = [
    `friendsync_contacts_${clerkUserId}`,
    userEmail ? `friendsync_backup_contacts_${userEmail}` : null,
    ...Object.keys(localStorage).filter(key => key.startsWith('friendsync_emergency_contacts_')),
  ].filter(Boolean)

  for (const key of contactKeys) {
    const data = localStorage.getItem(key)
    if (data) {
      try {
        const contacts = JSON.parse(data)
        if (Array.isArray(contacts) && contacts.length > 0) {
          console.log('✅ Contacts loaded from localStorage fallback')
          return contacts
        }
      } catch (e) {
        console.log('Failed to parse contacts data:', e)
      }
    }
  }
  
  return []
}

// Export configuration status
export { isSupabaseConfigured }