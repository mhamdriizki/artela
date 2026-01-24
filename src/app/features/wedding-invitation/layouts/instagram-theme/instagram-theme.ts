import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Invitation } from '../../../../core/models/invitation.model';
import { environment } from '../../../../../environments/environment';
import { GuestbookComponent } from '../../components/guestbook/guestbook';
import { CountdownTimer } from '../../components/countdown-timer/countdown-timer';
import { DigitalAngpao } from '../../components/digital-angpao/digital-angpao';
import { RsvpForm } from '../../components/rsvp-form/rsvp-form';



type StoryType = 'cover' | 'couple' | 'event' | 'gallery' | 'rsvp' | null;

@Component({
  selector: 'app-instagram-theme',
  standalone: true,
  imports: [CommonModule, RsvpForm, DigitalAngpao, CountdownTimer, GuestbookComponent],
  templateUrl: './instagram-theme.html',
  styleUrls: ['./instagram-theme.scss']
})
export class InstagramTheme implements OnInit, OnChanges, OnDestroy {
  private sanitizer = inject(DomSanitizer);

  @Input() data!: Invitation;
  @Input() guest: string | null = null;
  @Output() playMusic = new EventEmitter<void>();

  activeStory: StoryType = 'cover';
  isMusicPlaying = false;
  storyProgress = 0;
  activeGalleryIndex = 0;

  private storyInterval: any;
  youtubeEmbedUrl: SafeResourceUrl | null = null;
  baseUrl = environment.BASE_API;

  ngOnInit() {
    if (this.activeStory === 'cover') {
      this.startStoryProgress();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data?.background_music_url) {
      this.generateYoutubeEmbed(this.data.background_music_url);
    }
  }

  ngOnDestroy() {
    this.stopStoryProgress();
  }

  get invitation() { return this.data; }
  get formattedGuestName(): string { return this.guest || 'Tamu Undangan'; }

  // --- STORY LOGIC ---
  openSpecificStory(type: StoryType) {
    this.stopStoryProgress();
    this.activeStory = type;
    window.scrollTo({ top: 0 });
  }

  closeStory() {
    this.stopStoryProgress();
    if (this.activeStory === 'cover') {
        setTimeout(() => { this.toggleMusic(); }, 300);
    }
    this.activeStory = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getStoryBackgroundImage(type: StoryType): string {
    let filename: string | undefined;
    switch (type) {
      case 'cover':
      case 'gallery': filename = this.invitation.gallery?.[0]?.filename; break;
      case 'couple': filename = this.invitation.bride_photo; break;
      case 'event': filename = this.invitation.groom_photo; break;
      case 'rsvp': filename = this.invitation.gallery?.[1]?.filename || this.invitation.gallery?.[0]?.filename; break;
    }
    return `url('${this.getImageUrl(filename) || 'assets/images/default-cover.jpg'}')`;
  }

  startStoryProgress() {
    this.stopStoryProgress();
    this.storyProgress = 0;
    this.storyInterval = setInterval(() => {
      this.storyProgress += 1;
      if (this.storyProgress >= 100) this.closeStory();
    }, 50);
  }

  stopStoryProgress() {
    if (this.storyInterval) {
      clearInterval(this.storyInterval);
      this.storyInterval = null;
    }
  }

  onGalleryScroll(event: any) {
    const element = event.target;
    this.activeGalleryIndex = Math.round(element.scrollLeft / element.offsetWidth);
  }

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  getImageUrl(filename: string | undefined | null): string | null {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    return `${base}/uploads/${filename}`;
  }

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
