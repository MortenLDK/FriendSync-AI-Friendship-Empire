-- FriendSync Supabase Database Schema
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGSERIAL PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  profile_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy for user profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only access their own profile
CREATE POLICY "Users can access own profile" ON user_profiles
  FOR ALL USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  contact_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clerk_user_id, contact_id)
);

-- Add RLS policy for contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Users can only access their own contacts
CREATE POLICY "Users can access own contacts" ON contacts
  FOR ALL USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- CALENDAR EVENTS TABLE
CREATE TABLE IF NOT EXISTS calendar_events (
  id BIGSERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clerk_user_id, event_id)
);

-- Add RLS policy for calendar events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Users can only access their own calendar events
CREATE POLICY "Users can access own events" ON calendar_events
  FOR ALL USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_contacts_clerk_user_id ON contacts(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_clerk_user_id ON calendar_events(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_user_id ON user_profiles(clerk_user_id);

-- UPDATE TRIGGERS FOR TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- COMMENTS FOR DOCUMENTATION
COMMENT ON TABLE user_profiles IS 'Stores user profile data including personality, goals, and preferences';
COMMENT ON TABLE contacts IS 'Stores detailed friend/contact profiles with relationship data';
COMMENT ON TABLE calendar_events IS 'Stores scheduled relationship actions and events';

COMMENT ON COLUMN user_profiles.clerk_user_id IS 'Clerk authentication user ID for data isolation';
COMMENT ON COLUMN user_profiles.profile_data IS 'Complete user profile as JSON including all form fields';

COMMENT ON COLUMN contacts.clerk_user_id IS 'Owner of this contact (Clerk user ID)';
COMMENT ON COLUMN contacts.contact_id IS 'Unique contact identifier within user scope';
COMMENT ON COLUMN contacts.contact_data IS 'Complete contact profile as JSON (50+ fields)';

COMMENT ON COLUMN calendar_events.clerk_user_id IS 'Owner of this event (Clerk user ID)';
COMMENT ON COLUMN calendar_events.event_id IS 'Unique event identifier within user scope';
COMMENT ON COLUMN calendar_events.event_data IS 'Complete event data as JSON including scheduling info';