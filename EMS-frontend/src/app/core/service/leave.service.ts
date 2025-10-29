import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
private apiUrl = 'http://localhost:5000/api';

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
