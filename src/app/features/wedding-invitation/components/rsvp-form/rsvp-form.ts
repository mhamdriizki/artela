import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InvitationService } from '../../../../core/services/invitation-service';

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
  @Input() slug: string | null = null;

  public rsvpForm!: FormGroup;
  public isSubmitting = false;
  public submitSuccess = false;
  public submitError = false;

  constructor(
    private fb: FormBuilder,
    private invService: InvitationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Inisialisasi form saat komponen di-load
    this.rsvpForm = this.fb.group({
      name: ['', Validators.required],
      attendance: ['hadir', Validators.required], 
      guestCount: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
    
    // Auto-fill name from parent if needed (optional)
  }

  get name() { return this.rsvpForm.get('name'); }
  get attendance() { return this.rsvpForm.get('attendance'); }
  get guestCount() { return this.rsvpForm.get('guestCount'); }


  onSubmit(): void {
    this.rsvpForm.markAllAsTouched();

    if (this.rsvpForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const formData = this.rsvpForm.value;
    
    // Get Slug from Input OR Route to ensure fallback
    let slug = this.slug;

    if (!slug) {
        // Fallback to Route
        slug = this.route.snapshot.paramMap.get('slug');
        if (!slug && this.route.parent) {
             slug = this.route.parent.snapshot.paramMap.get('slug');
        }
    }
    
    // Fallback if still empty (should not happen)
    if (!slug) {
        console.error("Slug not found!");
        this.isSubmitting = false;
        return;
    }

    this.invService.createRSVP(slug, formData.name, formData.attendance, formData.guestCount).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.rsvpForm.reset({
          attendance: 'hadir',
          guestCount: 1
        });
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        this.submitError = true;
      }
    });
  }
}
