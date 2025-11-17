import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

interface GuestMessage {
  id?: string; // ID dari backend
  name: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-guestbook',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './guestbook.html',
  styleUrl: './guestbook.scss',
})
export class Guestbook implements OnInit {

  public guestbookForm!: FormGroup;
  public messages: GuestMessage[] = []; // Array untuk menampung pesan
  public isLoading = true; // Status loading saat ambil data
  public isSubmitting = false;
  private profileColors = [
    '#e50914', // Merah
    '#00a8e1', // Biru
    '#f9c500', // Kuning
    '#34a853', // Hijau
    '#7a00c4', // Ungu
    '#e87c03', // Oranye
    '#b909f0'  // Pink
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // 1. Inisialisasi form untuk pesan baru
    this.guestbookForm = this.fb.group({
      name: ['', Validators.required],
      message: ['', Validators.required]
    });

    // 2. Ambil data pesan yang sudah ada (Simulasi)
    this.fetchMessages();
  }

  fetchMessages(): void {
    this.isLoading = true;

    // --- SIMULASI AMBIL DATA DARI BACKEND ---
    // GANTI INI DENGAN HTTP CALL KE FIREBASE
    setTimeout(() => {
      // Data dummy
      this.messages = [
        { name: 'Bapak Dito', message: 'Selamat ya Rizki & Pearly!', timestamp: new Date() },
        { name: 'Susi', message: 'Semoga lancar sampai hari H.', timestamp: new Date() }
      ];
      this.isLoading = false;
    }, 1500); // Simulasi delay 1.5 detik
  }

  onSubmit(): void {
    if (this.guestbookForm.invalid) {
      this.guestbookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const newPost: GuestMessage = {
      name: this.guestbookForm.value.name,
      message: this.guestbookForm.value.message,
      timestamp: new Date()
    };

    console.log('Kirim pesan baru:', newPost);

    // --- SIMULASI KIRIM DATA KE BACKEND ---
    setTimeout(() => {
      // Tambahkan pesan baru ke array (di awal)
      this.messages.unshift(newPost);

      this.isSubmitting = false;
      this.guestbookForm.reset();
    }, 1000);
  }

  // Getter untuk validasi di HTML
  get name() { return this.guestbookForm.get('name'); }
  get message() { return this.guestbookForm.get('message'); }

  getProfileColor(name: string): string {
    if (!name) return this.profileColors[0];

    // Buat 'hash' sederhana dari nama
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Modulo untuk mendapatkan index warna yang konsisten
    const index = Math.abs(hash % this.profileColors.length);
    return this.profileColors[index];
  }

  // -- FUNGSI BARU: Mendapatkan 1 atau 2 inisial dari nama --
  getInitials(name: string): string {
    if (!name) return '?';

    const words = name.split(' ').filter(Boolean); // Pisah nama & hapus spasi ganda

    if (words.length === 0) return '?';

    if (words.length === 1) {
      // Satu kata: ambil 1 huruf pertama
      return words[0][0].toUpperCase();
    } else {
      // Banyak kata: ambil huruf pertama dari 2 kata pertama
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  }

}
