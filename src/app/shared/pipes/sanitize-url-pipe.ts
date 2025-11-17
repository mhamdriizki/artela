import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeUrl'
})
export class SanitizeUrlPipe implements PipeTransform {

  // 2. "Inject" (masukkan) DomSanitizer ke dalam constructor
  constructor(private sanitizer: DomSanitizer) {}

  // 3. Ini adalah fungsi utama pipe-nya
  transform(value: string): SafeResourceUrl {
    if (!value) {
      return ''; // Kembalikan string kosong jika URL tidak ada
    }

    // Ubah URL string biasa menjadi "SafeResourceUrl"
    // Ini adalah cara kita memberitahu Angular bahwa URL ini aman.
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
