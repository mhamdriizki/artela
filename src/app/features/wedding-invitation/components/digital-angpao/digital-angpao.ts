import { Component } from '@angular/core';

@Component({
  selector: 'app-digital-angpao',
  imports: [],
  templateUrl: './digital-angpao.html',
  styleUrl: './digital-angpao.scss',
})
export class DigitalAngpao {
  public copiedAccount: string | null = null;

  // Daftar rekening (bisa juga di-@Input dari induk)
  public accounts = [
    { name: 'Bank BCA', number: '1234567890', owner: 'Rizki' },
    { name: 'Bank Mandiri', number: '0987654321', owner: 'Pearly' },
    { name: 'GoPay / OVO', number: '08123456789', owner: 'Rizki' }
  ];

  constructor() { }

  copyToClipboard(accountNumber: string): void {
    // Menggunakan API browser modern untuk copy
    navigator.clipboard.writeText(accountNumber).then(() => {
      // Beri feedback ke user
      this.copiedAccount = accountNumber;

      // Hilangkan feedback setelah 2 detik
      setTimeout(() => {
        this.copiedAccount = null;
      }, 2000);

    }).catch(err => {
      console.error('Gagal menyalin: ', err);
    });
  }
}
