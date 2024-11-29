-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Chat rooms are viewable by owner or if public" ON public.chat_rooms;
DROP POLICY IF EXISTS "Chat rooms are insertable by authenticated users" ON public.chat_rooms;
DROP POLICY IF EXISTS "Chat rooms are updatable by owner" ON public.chat_rooms;
DROP POLICY IF EXISTS "Chat rooms are deletable by owner" ON public.chat_rooms;
DROP POLICY IF EXISTS "Messages are viewable in accessible rooms" ON public.messages;
DROP POLICY IF EXISTS "Messages are insertable in accessible rooms" ON public.messages;
DROP POLICY IF EXISTS "Presence is viewable by everyone" ON public.presence;
DROP POLICY IF EXISTS "Users can insert own presence" ON public.presence;
DROP POLICY IF EXISTS "Users can update own presence" ON public.presence;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_chat_rooms_updated_at ON public.chat_rooms;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user;
DROP FUNCTION IF EXISTS update_updated_at_column;
DROP FUNCTION IF EXISTS generate_share_link;
DROP FUNCTION IF EXISTS update_presence;
DROP FUNCTION IF EXISTS cleanup_stale_presence;

-- Drop existing tables (in correct order due to dependencies)
DROP TABLE IF EXISTS public.presence;
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.chat_rooms;
DROP TABLE IF EXISTS public.profiles;