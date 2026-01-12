import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { InvitationData } from '../models/invitation.model';
import {
  mapBeResponseToInvitation,
  isApiSuccess,
  BeApiResponse,
  MappedInvitationData,
} from '../utils/response-mapper';

/**
 * WeddingData Service
 * Responsible for fetching invitation data from BE API
 * Follows SOLID: Single Responsibility Principle - only handles data fetching
 * Clean Code: Clear method names, proper error handling
 */
@Injectable({
  providedIn: 'root',
})
export class WeddingData {
  private apiUrl = `${environment.BASE_API}/api/invitation`;

  constructor(private httpClient: HttpClient) {}

  /**
   * Fetch invitation data by couple slug from BE API
   * @param slug - Couple slug (e.g., 'rizki-pearly')
   * @returns Observable of InvitationData or null if not found
   */
  getInvitationByCouple(slug: string): Observable<InvitationData | null> {
    if (!slug || slug.trim().length === 0) {
      return of(null);
    }

    const url = `${this.apiUrl}/${slug}`;

    return this.httpClient.get<BeApiResponse>(url).pipe(
      map((response) => {
        // Validate API response
        if (!isApiSuccess(response)) {
          console.warn('API returned non-success response:', response);
          return null;
        }

        // Map BE response to FE model
        const mappedData = mapBeResponseToInvitation(response);
        return mappedData as InvitationData;
      }),
      catchError((error) => {
        console.error('Error fetching invitation data:', error);
        return of(null); // Return null on error for graceful fallback
      })
    );
  }
}
