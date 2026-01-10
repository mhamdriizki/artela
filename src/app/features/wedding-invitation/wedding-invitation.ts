import { Component, OnInit, OnDestroy } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { InvitationData } from '../../core/models/invitation.model';
import { WeddingData } from '../../core/services/wedding-data';
import { ActivatedRoute, Router } from '@angular/router';
import { NetflixTheme } from './layouts/netflix-theme/netflix-theme';
import { InstagramTheme } from './layouts/instagram-theme/instagram-theme';
import { CommonModule } from '@angular/common';

/**
 * WeddingInvitation Component
 * Displays wedding invitation based on couple slug
 * Implements SOLID: Single Responsibility (data fetching & display delegation)
 * Clean Code: Clear variable names, proper error handling
 */
@Component({
  selector: 'app-wedding-invitation',
  imports: [CommonModule, NetflixTheme, InstagramTheme],
  templateUrl: './wedding-invitation.html',
  styleUrl: './wedding-invitation.scss',
})
export class WeddingInvitation implements OnInit, OnDestroy {
  // State Management
  public isLoading: boolean = true;
  public isNotFound: boolean = false;

  // Data
  public invitationData: InvitationData | null = null;
  public guestName: string | null = null;
  public themeName: string = 'instagram'; // Default theme

  // Unsubscribe management
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weddingService: WeddingData
  ) {}

  ngOnInit(): void {
    // Get guest name from query params
    this.guestName = this.route.snapshot.queryParamMap.get('to');

    // Fetch invitation data by slug from route params
    // Theme will come from API response
    this.fetchInvitationData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Fetch invitation data based on route slug parameter
   */
  private fetchInvitationData(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('slug');

          if (!slug) {
            this.handleNotFound();
            return [];
          }

          return this.weddingService.getInvitationByCouple(slug);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err),
      });
  }

  /**
   * Handle successful data fetch
   */
  private handleSuccess(data: InvitationData | null): void {
    if (data) {
      this.invitationData = data;
      // Use theme from BE API response
      this.themeName = data.theme?.toLowerCase() || 'instagram'; // Normalize to lowercase
      this.isNotFound = false;
    } else {
      this.isNotFound = true;
    }
    this.isLoading = false;
  }

  /**
   * Handle error during fetch
   */
  private handleError(error: any): void {
    console.error('Error fetching invitation data:', error);
    this.isLoading = false;
    this.isNotFound = true;
  }

  /**
   * Handle case when slug is missing
   */
  private handleNotFound(): void {
    this.isLoading = false;
    this.isNotFound = true;
    this.router.navigate(['/']);
  }
}
