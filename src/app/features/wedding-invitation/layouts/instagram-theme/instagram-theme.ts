import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Invitation } from '../../../../core/models/invitation.model';
import { environment } from '../../../../../environments/environment';
import { GuestbookComponent } from '../../components/guestbook/guestbook';
import { CountdownTimer } from '../../components/countdown-timer/countdown-timer';
import { DigitalAngpao } from '../../components/digital-angpao/digital-angpao';
import { RsvpForm } from '../../components/rsvp-form/rsvp-form';

type StoryType = 'cover' | 'gallery' | 'event' | null;

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
  private storyInterval: any;

  currentStoryImageIndex = 0;
  activeEventSlideIndex = 0;
  activeGalleryIndex = 0;

  baseUrl = environment.BASE_API;

  ngOnInit() {
    if (this.activeStory === 'cover') {
      this.startStoryProgress();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Logic on changes if needed
  }

  ngOnDestroy() {
    this.stopStoryProgress();
  }

  get invitation() { return this.data; }
  get formattedGuestName(): string { return this.guest || 'Tamu Undangan'; }

  // --- STORY LOGIC UTAMA (CLICK HANDLER) ---
  onOverlayClick(event: MouseEvent) {
    if (this.activeStory === 'gallery') {
      // Logic Tap to Next di Gallery
      this.nextStoryImage();
    } else {
      // Logic Tap to Close di Cover/Event
      this.closeStory();
    }
  }

  openSpecificStory(type: StoryType) {
    this.stopStoryProgress();
    this.activeStory = type;
    this.storyProgress = 0;
    this.currentStoryImageIndex = 0;

    // Auto progress cepat hanya untuk cover/event, gallery manual tap (atau sangat lambat)
    const speed = type === 'gallery' ? 100 : 50;
    this.startStoryProgress(speed);

    window.scrollTo({ top: 0 });
  }

  closeStory() {
    this.stopStoryProgress();
    if (this.activeStory === 'cover' && !this.isMusicPlaying) {
        setTimeout(() => { this.toggleMusic(); }, 300);
    }
    this.activeStory = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextStoryImage() {
    if (this.invitation.gallery && this.invitation.gallery.length > 0) {
        if (this.currentStoryImageIndex < this.invitation.gallery.length - 1) {
            this.currentStoryImageIndex++;
            this.storyProgress = 0; // Reset progress bar per slide
        } else {
            this.closeStory(); // Habis foto -> Tutup
        }
    } else {
        this.closeStory();
    }
  }

  getStoryBackgroundImage(type: StoryType): string {
    let filename: string | undefined;
    switch (type) {
      case 'cover':
        filename = this.invitation.gallery?.[0]?.filename;
        break;
      case 'event':
        filename = this.invitation.groom_photo;
        break;
      case 'gallery':
        if (this.invitation.gallery && this.invitation.gallery.length > 0) {
            filename = this.invitation.gallery[this.currentStoryImageIndex]?.filename;
        }
        break;
    }
    return `url('${this.getImageUrl(filename) || 'assets/images/default-cover.jpg'}')`;
  }

  startStoryProgress(speedMs: number = 50) {
    this.stopStoryProgress();
    this.storyProgress = 0;
    this.storyInterval = setInterval(() => {
      this.storyProgress += 1;
      if (this.storyProgress >= 100) {
        if (this.activeStory === 'gallery') {
            this.nextStoryImage();
        } else {
            this.closeStory();
        }
      }
    }, speedMs);
  }

  stopStoryProgress() {
    if (this.storyInterval) {
      clearInterval(this.storyInterval);
      this.storyInterval = null;
    }
  }

  // --- OTHERS ---
  onGalleryScroll(event: any) {
    const el = event.target;
    this.activeGalleryIndex = Math.round(el.scrollLeft / el.offsetWidth);
  }

  onEventScroll(event: any) {
    const el = event.target;
    this.activeEventSlideIndex = Math.round(el.scrollLeft / el.offsetWidth);
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

}
