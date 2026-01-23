export interface GalleryItem {
  id: string;
  invitation_id: string;
  filename: string;
  created_at?: string;
}

// Model Baru: Guestbook
export interface Guestbook {
  id?: string;
  name: string;
  message: string;
  created_at?: string;
}

export interface Invitation {
  id?: string;
  slug: string;
  theme: 'netflix' | 'instagram' | string;
  couple_name: string;

  // Data Mempelai
  groom_name: string;
  groom_photo?: string;
  bride_name: string;
  bride_photo?: string;

  // Detail Acara
  wedding_date: string;
  akad_location: string;
  akad_map_url: string;
  reception_location: string;
  reception_map_url: string;

  // Multimedia
  youtube_url?: string;
  background_music_url: string;

  // Relasi
  gallery: GalleryItem[];
  guestbooks: Guestbook[]; // Field Baru
}
