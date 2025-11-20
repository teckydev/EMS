import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangePasswordRequest, UserProfile } from '../model/User-model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
private apiUrl = environment.apiUrl; 
 private settingUrl = 'http://localhost:5000/api/settings';
  constructor(private http: HttpClient) { }
  /**
   * Gets the current user's profile data
   */
  getProfile(): Observable<UserProfile> {
    // We assume the API returns the profile for the authenticated user
    return this.http.get<UserProfile>(`${this.apiUrl}/employees/me`);
  }

  /**
   * Updates the user's profile
   */
  updateProfile(profileData: UserProfile): Observable<UserProfile> {
    // We use PUT to update the entire resource.
    // Use PATCH if your API supports partial updates.
    return this.http.put<UserProfile>(
      `${this.apiUrl}/employees/self`,
      profileData
    );
  }

  /**
   * Sends the password change request
   */
  changePassword(passwordData: ChangePasswordRequest): Observable<any> {
    // We don't expect any specific data back, just a 200 OK
    return this.http.put(`${this.apiUrl}/admin/change-password`, passwordData);
  }

  // Organization
  getOrganization() { return this.http.get(`${this.settingUrl}/org`); }
  updateOrganization(data: any) { return this.http.put(`${this.settingUrl}/org`, data); }

  // Leave
  getLeave() { return this.http.get(`${this.settingUrl}/leave`); }
  updateLeave(data: any) { return this.http.put(`${this.settingUrl}/leave`, data); }

  // Attendance
  getAttendance() { return this.http.get(`${this.settingUrl}/attendance`); }
  updateAttendance(data: any) { return this.http.put(`${this.settingUrl}/attendance`, data); }
}
