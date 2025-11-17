import {Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  imports: [],
  templateUrl: './countdown-timer.html',
  styleUrl: './countdown-timer.scss',
})
export class CountdownTimer implements OnInit, OnDestroy {
  // Terima 'targetDate' dari komponen induk (NetflixTheme)
  @Input() targetDate: string | Date = '';

  private intervalId: any;
  public days: number = 0;
  public hours: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;

  constructor() { }

  ngOnInit(): void {
    // Mulai timer saat komponen di-load
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  // Ini penting untuk CLEAN CODE: Hentikan interval saat komponen dihancurkan
  // (misal: pindah halaman) agar tidak ada 'memory leak'.
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateCountdown(): void {
    const target = new Date(this.targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      // Jika waktu sudah lewat
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      clearInterval(this.intervalId);
    } else {
      // Hitung sisa waktu
      this.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((difference % (1000 * 60)) / 1000);
    }
  }
}
