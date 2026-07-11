-- Profiles / Players Table
CREATE TABLE IF NOT EXISTS public.players (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  avatar TEXT NOT NULL,
  class TEXT NOT NULL,
  level INT DEFAULT 1,
  hp INT DEFAULT 100,
  max_hp INT DEFAULT 100,
  energy INT DEFAULT 100,
  max_energy INT DEFAULT 100,
  gold INT DEFAULT 100,
  diamonds INT DEFAULT 10,
  xp INT DEFAULT 0,
  max_xp INT DEFAULT 100,
  stat_points INT DEFAULT 0,
  strength INT DEFAULT 10,
  defense INT DEFAULT 10,
  speed INT DEFAULT 10,
  vitality INT DEFAULT 10,
  mining_lv INT DEFAULT 1,
  mining_xp INT DEFAULT 0,
  blacksmithing_lv INT DEFAULT 1,
  blacksmithing_xp INT DEFAULT 0,
  herbalism_lv INT DEFAULT 1,
  herbalism_xp INT DEFAULT 0,
  fishing_lv INT DEFAULT 1,
  fishing_xp INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to players" ON public.players
  FOR SELECT USING (true);

CREATE POLICY "Allow individuals to update their own player record" ON public.players
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow individuals to insert their own player record" ON public.players
  FOR INSERT WITH CHECK (auth.uid() = id);


-- Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rarity TEXT NOT NULL,
  value INT NOT NULL,
  equipped BOOLEAN DEFAULT FALSE,
  quantity INT DEFAULT 1,
  stats JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individuals to view their own inventory" ON public.inventory
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Allow individuals to modify their own inventory" ON public.inventory
  FOR ALL USING (auth.uid() = player_id);


-- Active Quests Table
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  name TEXT NOT NULL,
  progress INT DEFAULT 0,
  target INT NOT NULL,
  reward_xp INT NOT NULL,
  reward_gold INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individuals to view their own quests" ON public.quests
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Allow individuals to modify their own quests" ON public.quests
  FOR ALL USING (auth.uid() = player_id);


-- Global Chat Table
CREATE TABLE IF NOT EXISTS public.global_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.global_chat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to read global chat" ON public.global_chat
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated players to post in chat" ON public.global_chat
  FOR INSERT WITH CHECK (true); -- Enabled for general simulation


-- Marketplace Table
CREATE TABLE IF NOT EXISTS public.market_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_rarity TEXT NOT NULL,
  item_value INT NOT NULL,
  price INT NOT NULL,
  quantity INT DEFAULT 1,
  stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to browse the marketplace" ON public.market_listings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated players to manage listings" ON public.market_listings
  FOR ALL USING (true); -- Enabled for simulation/easy sync


-- World Boss Table
CREATE TABLE IF NOT EXISTS public.world_bosses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  current_hp INT NOT NULL,
  max_hp INT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.world_bosses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to browse world_bosses" ON public.world_bosses
  FOR SELECT USING (true);

CREATE POLICY "Allow anyone to manage world_bosses" ON public.world_bosses
  FOR ALL USING (true);


-- Add party reference to players
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS party_id UUID;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS party_ready BOOLEAN DEFAULT FALSE;

-- Parties Table
CREATE TABLE IF NOT EXISTS public.parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  leader_name TEXT NOT NULL,
  status TEXT DEFAULT 'lobby',
  current_event JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to browse parties" ON public.parties
  FOR SELECT USING (true);

CREATE POLICY "Allow anyone to manage parties" ON public.parties
  FOR ALL USING (true);

-- Party Invitations Table
CREATE TABLE IF NOT EXISTS public.party_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  receiver_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  party_id UUID REFERENCES public.parties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.party_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to browse party_invites" ON public.party_invites
  FOR SELECT USING (true);

CREATE POLICY "Allow anyone to manage party_invites" ON public.party_invites
  FOR ALL USING (true);

-- Active region and locked group dungeons tracking columns
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS active_region TEXT DEFAULT 'Greenwood Forest';
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS group_dungeon_finish_time BIGINT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS group_dungeon_region TEXT;

-- New gathering professions columns
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS woodcutting_lv integer DEFAULT 1;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS woodcutting_xp integer DEFAULT 0;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS skinning_lv integer DEFAULT 1;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS skinning_xp integer DEFAULT 0;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS foraging_lv integer DEFAULT 1;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS foraging_xp integer DEFAULT 0;
