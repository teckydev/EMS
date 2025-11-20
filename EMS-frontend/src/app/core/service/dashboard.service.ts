import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
private baseUrl = 'http://localhost:5000/api/dashboard';
  constructor(private http: HttpClient) { }
   getAdminStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }
  getRecentActivity(): Observable<any> {
  return this.http.get(`${this.baseUrl}/recent-activity`);
}
}
