import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginPayload, RegisterPayload } from '../model/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private baseUrl = `${environment.apiUrl}/admin`; // From environment.ts
  constructor(private http: HttpClient) { }
  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }
getUserId(): string | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user)._id : null;
}

  logout(): void {
    localStorage.clear();
  }
}
