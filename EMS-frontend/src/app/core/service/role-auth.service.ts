import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleAuthService {

  constructor() { }
  // Dummy login check
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get current user role (admin or user)
  getUserRole(): string {
    return localStorage.getItem('role') || 'guest';
  }

  // For demo login
  login(role: string) {
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('role', role);
  }

  logout() {
    localStorage.clear();
  }
}
