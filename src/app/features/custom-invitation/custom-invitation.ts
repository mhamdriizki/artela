import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Theme = 'netflix' | 'instagram';
type GalleryOption = 'none' | 'photo' | 'photo-video';
type QuotaOption = 'none' | '250' | '300' | '500' | 'unlimited';
type MapOption = 'standard' | 'interactive';
type DomainOption = 'standard' | 'custom';

@Component({
  selector: 'app-custom-invitation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-invitation.html',
  styleUrl: './custom-invitation.scss',
})
export class CustomInvitation implements OnInit {
  // State
  selectedTheme = signal<Theme | null>(null);
  selectedGallery = signal<GalleryOption>('none');
  selectedQuota = signal<QuotaOption>('none');
  selectedMap = signal<MapOption>('standard');
  selectedDomain = signal<DomainOption>('standard');

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Pricing Configuration
  readonly PRICES = {
    theme: {
      netflix: 75000,
      instagram: 85000,
    },
    gallery: {
      none: 0,
      photo: 15000,
      'photo-video': 25000,
    },
    quota: {
      none: 0,
      '250': 15000,
      '300': 20000,
      '500': 25000,
      unlimited: 35000,
    },
    map: {
      standard: 0,
      interactive: 20000,
    },
    domain: {
      standard: 0,
      custom: 35000,
    },
  };

  // Computed Values
  totalPrice = computed(() => {
    let total = 0;

    // Theme
    const theme = this.selectedTheme();
    if (theme) {
      total += this.PRICES.theme[theme];
    }

    // Add-ons
    total += this.PRICES.gallery[this.selectedGallery()];
    total += this.PRICES.quota[this.selectedQuota()];
    total += this.PRICES.map[this.selectedMap()];
    total += this.PRICES.domain[this.selectedDomain()];

    return total;
  });

  whatsappLink = computed(() => {
    const theme = this.selectedTheme()
      ? this.selectedTheme() === 'netflix'
        ? 'Netflix'
        : 'Instagram'
      : 'Belum pilih';

    const galleryMap = {
      none: '-',
      photo: 'Foto Only',
      'photo-video': 'Foto + Video',
    };
    const quotaMap = {
      none: 'Belum pilih',
      '250': '250 Tamu',
      '300': '300 Tamu',
      '500': '500 Tamu',
      unlimited: 'Unlimited',
    };
    const mapMap = { standard: 'Biasa (Gratis)', interactive: 'Interaktif' };
    const domainMap = { standard: 'Biasa (Gratis)', custom: 'Custom Domain' };

    const message =
      `Halo ka, saya mau konsultasi dengan custom wedding invitation saya yang ada fitur:
- Tema: ${theme}
- Gallery: ${galleryMap[this.selectedGallery()]}
- Quota: ${quotaMap[this.selectedQuota()]}
- Map: ${mapMap[this.selectedMap()]}
- Domain: ${domainMap[this.selectedDomain()]}

Estimasi Harga: Rp ${this.totalPrice().toLocaleString('id-ID')}
    `.trim();

    return `https://wa.me/6285156922553?text=${encodeURIComponent(message)}`;
    // Note: Replace phone number with actual one if known, using placeholder for now.
  });

  // Actions
  selectTheme(theme: Theme) {
    this.selectedTheme.set(theme);
  }

  selectGallery(option: GalleryOption) {
    this.selectedGallery.set(option);
  }

  selectQuota(option: QuotaOption) {
    this.selectedQuota.set(option);
  }

  toggleMap() {
    this.selectedMap.update((v) =>
      v === 'standard' ? 'interactive' : 'standard',
    );
  }

  toggleDomain() {
    this.selectedDomain.update((v) =>
      v === 'standard' ? 'custom' : 'standard',
    );
  }
}
