import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{
  private titleService = inject(Title);
  private metaService = inject(Meta);

  isMenuOpen = false;

  ngOnInit(): void {
    this.updateMetaData();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  updateMetaData() {
    // 1. Set Browser Title
    const pageTitle = 'Artela - Undangan Pernikahan Digital Tema Netflix & Instagram';
    this.titleService.setTitle(pageTitle);

    // 2. Deskripsi & Keywords
    const description = 'Platform pembuatan undangan pernikahan digital dengan tema unik seperti Netflix dan Instagram. Buat momen bahagiamu lebih berkesan, hemat biaya, dan mudah dibagikan.';
    const keywords = 'undangan digital, wedding invitation, undangan online, tema netflix, tema instagram, undangan pernikahan murah, artela';

    // Construct Image URL (Menggunakan logo dari assets)
    // window.location.origin memastikan URL menjadi absolut (https://artela.id/...) agar valid di crawler
    const imageUrl = `${window.location.origin}/assets/images/logo.png`;

    // 3. Update Standard Meta
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    this.metaService.updateTag({ name: 'author', content: 'Artela Team' });

    // 4. Open Graph (Facebook/WhatsApp)
    this.metaService.updateTag({ property: 'og:title', content: pageTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ property: 'og:url', content: window.location.href });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Artela' });

    // 5. Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: pageTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  // Data Paket Harga (Updated: Market ID 2025)
  packages = [
    {
      id: 1,
      name: 'Basic',
      price: '99K',
      period: '/ event',
      desc: 'Cukup untuk acara sederhana.',
      features: [
        '1 Tema Pilihan (Standard)',
        'Masa Aktif 3 Bulan',
        'Musik Background (Default)',
        'Kuota 300 Tamu',
        'Tidak Ada RSVP'
      ],
      isPopular: false,
      buttonText: 'Pilih Basic',
      waLink: 'https://wa.me/6285156922553?text=Halo%2C%20aku%20mau%20tanya-tanya%20Paket%20Basic%20dong%2C%20Ka'
    },
    {
      id: 2,
      name: 'Premium',
      price: '199K',
      period: '/ event',
      desc: 'Paling diminati pasangan.',
      features: [
        'Semua Tema (Netflix/IG)',
        'Masa Aktif 1 Tahun',
        'Custom Musik (YouTube)',
        'RSVP & Ucapan Realtime',
        'Kuota Tamu Unlimited',
        'Peta Lokasi Interaktif'
      ],
      isPopular: true, // Highlight card ini
      buttonText: 'Pilih Premium',
      waLink: 'https://wa.me/6285156922553?text=Halo%2C%20aku%20mau%20tanya-tanya%20Paket%20Premium%20dong%2C%20Ka'
    },
    {
      id: 3,
      name: 'Exclusive',
      price: '349K',
      period: '/ event',
      desc: 'Fitur lengkap + Domain sendiri.',
      features: [
        'Semua Fitur Premium',
        'Custom Domain (.com)',
        'Masa Aktif Selamanya',
        'Galeri Video',
        'Prioritas Support 24/7',
        'Revisi Sepuasnya'
      ],
      isPopular: false,
      buttonText: 'Hubungi Kami',
      waLink: 'https://wa.me/6285156922553?text=Halo%2C%20aku%20mau%20tanya-tanya%20dong%20Paket%20Exclusive%2C%20Ka'
    },
  ];

  scrollToPricing() {
    this.scrollToSection('pricing');
  }

  scrollToSection(sectionId: string) {
    this.closeMenu();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }


}
