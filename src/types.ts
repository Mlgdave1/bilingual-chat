export interface Profile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  location: string | null;
  languages: string[] | null;
  share_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  is_public: boolean;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string | null;
  sender_name: string | null;
  text: string;
  translation: string;
  created_at: string;
}