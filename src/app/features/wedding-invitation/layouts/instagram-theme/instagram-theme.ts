import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Invitation } from '../../../../core/models/invitation.model';
import { environment } from '../../../../../environment/environment';
import { DigitalAngpao } from '../../components/digital-angpao/digital-angpao';
import { Guestbook } from '../../components/guestbook/guestbook';
import { RsvpForm } from '../../components/rsvp-form/rsvp-form';
import { CountdownTimer } from "../../components/countdown-timer/countdown-timer";

@Component({
  selector: 'app-instagram-theme',
  standalone: true,
  imports: [CommonModule, Guestbook, RsvpForm, DigitalAngpao, CountdownTimer],
  templateUrl: './instagram-theme.html',
  styleUrls: ['./instagram-theme.scss']
})
export class InstagramTheme implements OnInit, OnChanges, OnDestroy {
  private sanitizer = inject(DomSanitizer);

  @Input() data!: Invitation;
  @Input() guest: string | null = null; // Nama tamu dari parent
  @Output() playMusic = new EventEmitter<void>();

  // State
  isStoryActive = true;     // Mode Cover (Story)
  isMusicPlaying = false;
  storyProgress = 0;        // Progress bar di Story
  activeGalleryIndex = 0;   // Indikator slide gallery

  private storyInterval: any;
  youtubeEmbedUrl: SafeResourceUrl | null = null;
  baseUrl = environment.BASE_API;

  ngOnInit() {
    this.startStoryProgress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data?.background_music_url) {
      this.generateYoutubeEmbed(this.data.background_music_url);
    }
  }

  ngOnDestroy() {
    this.stopStoryProgress();
  }

  // --- Getters ---
  get invitation() {
    return this.data;
  }

  get formattedGuestName(): string {
    return this.guest || 'Tamu Undangan';
  }

  // --- Story / Cover Logic ---
  startStoryProgress() {
    this.stopStoryProgress();
    this.storyProgress = 0;

    // Animasi loading bar 5 detik
    this.storyInterval = setInterval(() => {
      this.storyProgress += 1; // nambah 1% tiap 50ms (total 5000ms)
      if (this.storyProgress >= 100) {
        this.openInvitation(); // Auto open jika habis waktu (opsional)
      }
    }, 50);
  }

  stopStoryProgress() {
    if (this.storyInterval) {
      clearInterval(this.storyInterval);
      this.storyInterval = null;
    }
  }

  openInvitation() {
    this.stopStoryProgress();
    this.isStoryActive = false;
    this.toggleMusic();

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  // --- Gallery Logic ---
  onGalleryScroll(event: any) {
    const element = event.target;
    const scrollLeft = element.scrollLeft;
    const width = element.offsetWidth;
    // Hitung index berdasarkan posisi scroll
    this.activeGalleryIndex = Math.round(scrollLeft / width);
  }

  // --- Helpers ---
  getImageUrl(filename: string | undefined): string {
    if (!filename) return 'assets/images/default.jpg';
    const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    return `${base}/uploads/${filename}`;
  }

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      // Offset untuk navbar
      const y = element.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  // --- Music Logic ---
  toggleMusic() {
    this.isMusicPlaying = !this.isMusicPlaying;
    this.playMusic.emit();
  }

  private generateYoutubeEmbed(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      const rawUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&enablejsapi=1`;
      this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    }
  }
}
