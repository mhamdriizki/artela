export interface GalleryItem {
  id: string;
  invitation_id: string;
  filename: string;
  created_at?: string;
}

export interface Invitation {
  id?: string;
  slug: string;
  theme: 'netflix' | 'instagram' | string; // Bisa ditambah tema lain
  couple_name: string;

  // Data Mempelai
  groom_name: string;
  bride_name: string;
  groom_photo_url?: string; // Jika ada di backend
  bride_photo_url?: string; // Jika ada di backend

  // Detail Acara & Lokasi
  wedding_date: string;     // Format: "2025-08-17T00:00:00Z"
  akad_location: string;
  akad_map_url: string;
  reception_location: string;
  reception_map_url: string;

  // Multimedia
  youtube_url?: string;         // Video utama (opsional)
  background_music_url: string; // Link Youtube untuk backsound

  // Relasi
  gallery: GalleryItem[];
}
