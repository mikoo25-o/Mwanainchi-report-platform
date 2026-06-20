-- ═══════════════════════════════════════════════
-- MWANAINCHI REPORT — Full Database Schema
-- Run this in Supabase → SQL Editor
-- ═══════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES (extends auth.users) ──
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  county TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_lawyer BOOLEAN DEFAULT FALSE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── CASES ──
CREATE TABLE cases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  incident_type TEXT,
  incident_date DATE,
  incident_time TIME,
  location TEXT,
  description TEXT NOT NULL,
  involved_description TEXT,
  victim_self BOOLEAN DEFAULT TRUE,
  has_witnesses BOOLEAN DEFAULT FALSE,
  police_reported TEXT,
  legal_representation TEXT,
  preferred_language TEXT DEFAULT 'English',
  additional_context TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted','evidence_uploaded','under_review','investigation','referred','in_court','resolved','closed')),
  is_anonymous BOOLEAN DEFAULT FALSE,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate case number
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.case_number := 'MWR-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(nextval('case_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE case_number_seq START 1;

CREATE TRIGGER set_case_number
  BEFORE INSERT ON cases
  FOR EACH ROW EXECUTE FUNCTION generate_case_number();

-- ── EVIDENCE ──
CREATE TABLE evidence (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_hash TEXT,
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONVERSATIONS ──
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  support_type TEXT DEFAULT 'platform' CHECK (support_type IN ('platform','legal','ai')),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONVERSATION MESSAGES ──
CREATE TABLE conversation_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT DEFAULT 'user' CHECK (sender_type IN ('user','support','ai')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TRUSTED CONTACTS ──
CREATE TABLE trusted_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── LAWYERS ──
CREATE TABLE lawyers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bar_number TEXT UNIQUE NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  counties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  offers_pro_bono BOOLEAN DEFAULT FALSE,
  hourly_rate NUMERIC(10,2),
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ ROW LEVEL SECURITY ═══

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cases: users see only their own cases
CREATE POLICY "Users can view own cases" ON cases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create cases" ON cases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cases" ON cases FOR UPDATE USING (auth.uid() = user_id);

-- Evidence: users see only their own
CREATE POLICY "Users can view own evidence" ON evidence FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own evidence" ON evidence FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Conversations: users see their own
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages: users in the conversation
CREATE POLICY "Users can view own messages" ON conversation_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid()));
CREATE POLICY "Users can send messages" ON conversation_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Trusted contacts
CREATE POLICY "Users can manage own contacts" ON trusted_contacts FOR ALL USING (auth.uid() = user_id);

-- Lawyers: anyone can view verified lawyers
CREATE POLICY "Anyone can view verified lawyers" ON lawyers FOR SELECT USING (verified = TRUE);
CREATE POLICY "Lawyers can manage own profile" ON lawyers FOR ALL USING (auth.uid() = user_id);

-- ═══ STORAGE BUCKETS ═══
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', FALSE);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', TRUE);

-- Evidence bucket: only owner can access
CREATE POLICY "Users can upload own evidence" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidence' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own evidence" ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- Avatars: public read, own write
CREATE POLICY "Public avatar read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- ═══ REALTIME ═══
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE cases;
