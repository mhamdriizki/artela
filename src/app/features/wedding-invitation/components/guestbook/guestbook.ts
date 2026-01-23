import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Guestbook } from '../../../../core/models/invitation.model';
import { InvitationService } from '../../../../core/services/invitation-service';

@Component({
  selector: 'app-guestbook',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './guestbook.html',
  styleUrls: ['./guestbook.scss']
})
export class GuestbookComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private invService = inject(InvitationService);

  @Input() slug: string = ''; // Butuh slug untuk API call
  @Input() comments: Guestbook[] = []; // Data awal dari parent

  isSubmitting = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    // Pastikan comments terurut dari yang terbaru (jika backend belum sort)
    if (changes['comments'] && this.comments) {
      this.sortComments();
    }
  }

  sortComments() {
    // Sort descending by created_at (asumsi string ISO)
    this.comments.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.slug) return;

    this.isSubmitting = true;
    const { name, message } = this.form.value;

    this.invService.createGuestbook(this.slug, name!, message!).subscribe({
      next: (res) => {
        // Tambahkan komentar baru ke list paling atas (Realtime feel)
        const newComment = res.output_schema;
        // Backend Go return created_at, jika belum ada kita pakai waktu sekarang untuk display
        if (!newComment.created_at) newComment.created_at = new Date().toISOString();

        this.comments.unshift(newComment);

        this.form.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Gagal kirim komentar', err);
        alert('Maaf, gagal mengirim pesan. Silakan coba lagi.');
        this.isSubmitting = false;
      }
    });
  }
}
