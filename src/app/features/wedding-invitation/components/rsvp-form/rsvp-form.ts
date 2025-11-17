import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-rsvp-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './rsvp-form.html',
  styleUrl: './rsvp-form.scss',
})
export class RsvpForm implements OnInit {
  // Terima ID undangan untuk dikirim ke backend
  @Input() invitationId: string = '';

  public rsvpForm!: FormGroup;
  public isSubmitting = false;
  public submitSuccess = false;
  public submitError = false;

  // 'FormBuilder' adalah 'helper' untuk membuat form
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Inisialisasi form saat komponen di-load
    this.rsvpForm = this.fb.group({
      // [defaultValue, [Validator(s)]]
      name: ['', Validators.required],
      attendance: ['hadir', Validators.required], // 'hadir', 'tidak_hadir', 'ragu'
      guestCount: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  // Buat 'getter' agar lebih mudah diakses di HTML (Clean Code)
  get name() { return this.rsvpForm.get('name'); }
  get attendance() { return this.rsvpForm.get('attendance'); }
  get guestCount() { return this.rsvpForm.get('guestCount'); }


  onSubmit(): void {
    // Tandai form sebagai 'touched' untuk menampilkan semua error
    this.rsvpForm.markAllAsTouched();

    // Hentikan jika form tidak valid
    if (this.rsvpForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    // Kumpulkan data
    const formData = this.rsvpForm.value;
    console.log('Data yang akan dikirim:', formData);
    console.log('Untuk undangan ID:', this.invitationId);

    // --- SIMULASI PENGIRIMAN KE BACKEND ---
    // GANTI INI DENGAN HTTP CALL KE FIREBASE/API ANDA
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;

      // Reset form setelah berhasil
      this.rsvpForm.reset({
        attendance: 'hadir',
        guestCount: 1
      });
    }, 2000); // Simulasi delay 2 detik

    // Jika GAGAL:
    // this.isSubmitting = false;
    // this.submitError = true;
  }
}
