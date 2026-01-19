import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Invitation } from '../models/invitation.model';

// Interface untuk Response Wrapper dari Backend Go Fiber
// (Sesuai dengan struktur: error_schema, output_schema)
export interface BaseResponse<T> {
  error_schema: {
    error_code: string;
    error_message: {
      english: string;
      indonesian: string;
    };
  };
  output_schema: T;
}

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private http = inject(HttpClient);

  // Mengambil URL API dari environment (misal: https://api.artela.id)
  private apiUrl = environment.BASE_API;

  /**
   * Mengambil detail undangan publik berdasarkan slug URL.
   * Contoh: /api/invitation/rizki-pearly
   */
  getInvitationBySlug(slug: string): Observable<BaseResponse<Invitation>> {
    return this.http.get<BaseResponse<Invitation>>(
      `${this.apiUrl}/api/invitation/${slug}`
    );
  }
}
