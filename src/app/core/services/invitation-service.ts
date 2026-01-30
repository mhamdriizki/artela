import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Invitation, Guestbook } from '../models/invitation.model';

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
  private apiUrl = environment.BASE_API;

  getInvitationBySlug(slug: string): Observable<BaseResponse<Invitation>> {
    return this.http.get<BaseResponse<Invitation>>(
      `${this.apiUrl}/api/invitation/${slug}`
    );
  }

  // METHOD BARU: Kirim Komentar
  createGuestbook(slug: string, name: string, message: string): Observable<BaseResponse<Guestbook>> {
    const payload = { name, message };
    return this.http.post<BaseResponse<Guestbook>>(
      `${this.apiUrl}/api/invitation/${slug}/guestbook`,
      payload
    );
  }

  createRSVP(slug: string, name: string, status: string, pax: number): Observable<BaseResponse<any>> {
    const payload = { name, status, pax };
    return this.http.post<BaseResponse<any>>(
      `${this.apiUrl}/api/invitation/${slug}/rsvp`,
      payload
    );
  }
}
