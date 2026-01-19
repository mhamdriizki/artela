import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Invitation } from '../../../../core/models/invitation.model';
import { environment } from '../../../../../environments/environment';
import { CountdownTimer } from '../../components/countdown-timer/countdown-timer';
import { Guestbook } from '../../components/guestbook/guestbook';
import { RsvpForm } from '../../components/rsvp-form/rsvp-form';

@Component({
  selector: 'app-netflix-theme',
  standalone: true,
  imports: [CommonModule, CountdownTimer, Guestbook, RsvpForm],
  templateUrl: './netflix-theme.html',
  styleUrls: ['./netflix-theme.scss']
})
export class NetflixTheme implements OnChanges {
  private sanitizer = inject(DomSanitizer);

  @Input() data!: Invitation; // Data utama dari parent
  @Input() guest: string | null = null; // Nama tamu (jika ada)

  @Output() playMusic = new EventEmitter<void>();

  // State UI
  isCoverActive = true;
  isContentActive = false;
  isMusicPlaying = false;
  currentBgIndex = 0;

  // Property untuk Iframe Youtube
  youtubeEmbedUrl: SafeResourceUrl | null = null;

  baseUrl = environment.BASE_API;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      // Generate Youtube URL saat data masuk
      if (this.data.background_music_url) {
        this.generateYoutubeEmbed(this.data.background_music_url);
      }
    }
  }

  // --- Getters untuk mempermudah akses di HTML ---
  // Alias 'invitation' agar sesuai dengan HTML kamu
  get invitation() {
    return this.data;
  }

  get formattedGuestName(): string {
    return this.guest || 'Tamu Undangan';
  }

  // --- Helpers ---
  getImageUrl(filename: string | undefined): string {
    if (!filename) return 'assets/images/default-cover.jpg';
    // Hapus trailing slash dari baseUrl jika ada
    const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    return `${base}/uploads/${filename}`;
  }

  // Helper untuk mendapatkan ID Youtube dan sanitize URL
  private generateYoutubeEmbed(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      // Autoplay, Loop, No Controls, Hidden
      const rawUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&enablejsapi=1`;
      this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    }
  }

  // --- Actions ---

  openInvitation() {
    this.isCoverActive = false;   // Sembunyikan cover
    this.isContentActive = true;  // Tampilkan konten utama

    // Trigger musik di parent (atau lokal)
    this.toggleMusic();

    // Scroll halus ke atas
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  toggleMusic() {
    this.isMusicPlaying = !this.isMusicPlaying;

    // Jika menggunakan logic di parent:
    this.playMusic.emit();

    // Logic iframe lokal dikendalikan via *ngIf di HTML atau postMessage (advanced),
    // tapi untuk sekarang kita andalkan *ngIf youtubeEmbedUrl di HTML
  }

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
