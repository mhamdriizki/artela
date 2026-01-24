import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Invitation } from '../../core/models/invitation.model';
import { environment } from '../../../environments/environment';
import { NetflixTheme } from './layouts/netflix-theme/netflix-theme';
import { InvitationService } from '../../core/services/invitation-service';
import { SafeUrlPipe } from '../../shared/pipes/safe-url-pipe';
import { InstagramTheme } from './layouts/instagram-theme/instagram-theme';

@Component({
  selector: 'app-wedding-invitation',
  standalone: true,
  imports: [CommonModule, NetflixTheme, InstagramTheme, SafeUrlPipe],
  templateUrl: './wedding-invitation.html',
  styleUrls: ['./wedding-invitation.scss']
})
export class WeddingInvitation implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invService = inject(InvitationService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  invitationData: Invitation | null = null;
  isLoading = true;
  guestName: string | null = null; // Variable untuk nama tamu

  isPlaying = false;
  youtubeEmbedUrl: string | null = null;
  private apiUrl = environment.BASE_API;

  ngOnInit() {
    // 1. Ambil Query Param 'to'
    this.route.queryParams.subscribe(params => {
      const to = params['to'];
      if (to) {
        // Ganti tanda strip (-) atau plus (+) dengan spasi
        this.guestName = to.replace(/[-+]/g, ' ');
      }
    });

    // 2. Ambil Slug & Data
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchData(slug);
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  fetchData(slug: string) {
    this.isLoading = true;
    this.invService.getInvitationBySlug(slug).subscribe({
      next: (res) => {
        if (res && res.output_schema) {
          this.invitationData = res.output_schema;
          this.updateMetaData(this.invitationData);

          if (this.invitationData.background_music_url) {
            this.generateYoutubeEmbed(this.invitationData.background_music_url);
          }
        } else {
          this.router.navigate(['/404']);
        }
        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/404']);
      }
    });
  }

  updateMetaData(data: Invitation) {
    const pageTitle = `${data.couple_name} - Artela - Invitation Digital`;
    this.titleService.setTitle(pageTitle);

    const weddingDate = new Date(data.wedding_date).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Jika ada tamu spesifik, tambahkan di deskripsi share
    const guestText = this.guestName ? `Spesial untuk ${this.guestName}` : '';

    const description = `Undangan Pernikahan ${data.groom_name} & ${data.bride_name}. \n📅 ${weddingDate}. ${guestText}`;

    let imageUrl = 'assets/images/default-og.jpg';
    let filename = data.gallery?.[0]?.filename || data.bride_photo || data.groom_photo;

    if (filename) {
       if (!filename.startsWith('http')) {
          const baseUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
          imageUrl = `${baseUrl}/uploads/${filename}`;
       } else {
          imageUrl = filename;
       }
    }

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: pageTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ name: 'twitter:title', content: pageTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  generateYoutubeEmbed(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      this.youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0`;
    }
  }

  toggleMusic() {
    this.isPlaying = !this.isPlaying;
  }
}
