-- Create Posts Table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  tag TEXT,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Tournaments Table
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  teams TEXT NOT NULL,
  event_date TEXT NOT NULL,
  live BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Clans Table
CREATE TABLE clans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rank INT NOT NULL,
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  members INT NOT NULL,
  rating INT NOT NULL,
  region TEXT NOT NULL
);

-- Create Loadouts Table
CREATE TABLE loadouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gun TEXT NOT NULL,
  type TEXT NOT NULL,
  author TEXT NOT NULL,
  playstyle TEXT,
  attachments JSONB NOT NULL,
  likes INT DEFAULT 0
);

-- Set up Storage for Admin Media Uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
