import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser'; // 1. Import Service SEO
import { Invitation } from '../../core/models/invitation.model';
import { environment } from '../../../environments/environment'; // Pastikan path environment benar
import { InvitationService } from '../../core/services/invitation-service';
import { SafeUrlPipe } from '../../shared/pipes/safe-url-pipe';
import { InstagramTheme } from './layouts/instagram-theme/instagram-theme';
import { NetflixTheme } from './layouts/netflix-theme/netflix-theme';


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
  private titleService = inject(Title); // 2. Inject Title Service
  private metaService = inject(Meta);   // 3. Inject Meta Service

  invitationData: Invitation | null = null;
  isLoading = true;

  // Logic Musik YouTube
  isPlaying = false;
  youtubeEmbedUrl: string | null = null;

  // Base API untuk construct image URL meta tag
  private apiUrl = environment.BASE_API;

  ngOnInit() {
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

          // 4. Update SEO & Title saat data diterima
          this.updateMetaData(this.invitationData);

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

  // --- LOGIC BARU: UPDATE METADATA ---
  updateMetaData(data: Invitation) {
    // A. Set Browser Title
    // Format: "Rizki & Pearly - Artela - Invitation Digital"
    const pageTitle = `${data.couple_name} - Artela - Invitation Digital`;
    this.titleService.setTitle(pageTitle);

    // B. Siapkan Data Deskripsi & Gambar
    // Format Date: "Sabtu, 17 Agustus 2025"
    const weddingDate = new Date(data.wedding_date).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const description = `Undangan Pernikahan ${data.groom_name} & ${data.bride_name}. \n📅 ${weddingDate} \n📍 ${data.reception_location || 'Lokasi Acara'}. \nMohon doa restu Anda.`;

    // Construct Image URL (Gunakan foto gallery pertama atau bride/groom photo sebagai thumbnail share)
    let imageUrl = 'assets/images/default-og.jpg'; // Gambar default jika tidak ada foto

    // Prioritas: Gallery[0] -> Bride -> Groom
    let filename = data.gallery?.[0]?.filename || data.bride_photo || data.groom_photo;

    if (filename) {
       // Pastikan URL valid (gabung dengan Base API jika hanya filename)
       if (!filename.startsWith('http')) {
          const baseUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
          imageUrl = `${baseUrl}/uploads/${filename}`;
       } else {
          imageUrl = filename;
       }
    }

    // C. Update Meta Tags
    // 1. Standard Meta
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'author', content: 'Artela Invitation' });
    this.metaService.updateTag({ name: 'keywords', content: `undangan digital, pernikahan, ${data.couple_name}, artela` });

    // 2. Open Graph (Facebook, WhatsApp, LinkedIn)
    this.metaService.updateTag({ property: 'og:title', content: pageTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ property: 'og:url', content: window.location.href });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Artela' });

    // 3. Twitter Card (X)
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: pageTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  // Helper: Ubah link youtube biasa jadi Embed Autoplay
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
