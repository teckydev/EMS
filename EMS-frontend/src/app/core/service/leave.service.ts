import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
private apiUrl = `${environment.apiUrl}`;

  constructor(private http:HttpClient) { }
  requestLeave(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leaves`, data);
  }

  getUserLeaves(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaves`);
  }
  getLeaveById(id: string) {
  return this.http.get(`${this.apiUrl}/leaves/${id}`);
}

cancelLeave(id: string) {
  return this.http.delete(`${this.apiUrl}/leaves/${id}`);
}

}
