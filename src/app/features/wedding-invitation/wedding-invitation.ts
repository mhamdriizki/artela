import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Layouts
import { NetflixTheme } from './layouts/netflix-theme/netflix-theme';
import { InstagramTheme } from './layouts/instagram-theme/instagram-theme';
import { SafeUrlPipe } from '../../shared/pipes/safe-url-pipe';
import { InvitationService } from '../../core/services/invitation-service';
import { Invitation } from '../../core/models/invitation.model';

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

  invitationData: Invitation | null = null;
  isLoading = true;

  // Logic Musik YouTube
  isPlaying = false;
  youtubeEmbedUrl: string | null = null;

  ngOnInit() {
    // Gunakan paramMap subscription agar jika ganti slug tanpa refresh, data tetap update
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

          // Siapkan URL YouTube
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

  // Helper: Ubah link youtube biasa jadi Embed Autoplay
  generateYoutubeEmbed(url: string) {
    // Regex untuk ambil ID Video (support youtu.be dan youtube.com)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      // Autoplay=1 & Loop=1 & Playlist=VideoID (Loop butuh playlist ID sama)
      this.youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0`;
    }
  }

  toggleMusic() {
    this.isPlaying = !this.isPlaying;
  }
}
