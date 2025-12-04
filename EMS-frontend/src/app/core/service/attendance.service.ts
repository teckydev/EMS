import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

 private baseUrl = `${environment.apiUrl}/attendance`;
constructor(private http: HttpClient) {}


// 👉 Employee: Check-In
  checkIn(): Observable<any> {
    return this.http.post(`${this.baseUrl}/check-in`, {});
  }

  // 👉 Employee: Check-Out
  checkOut(): Observable<any> {
    return this.http.post(`${this.baseUrl}/check-out`, {});
  }

  // 👉 Employee: Get Own Attendance
  getMyAttendance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  // 👉 Admin/HR: Get All Attendance
  getAllAttendance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

   /** ✅ Get specific employee attendance record */
  getEmployeeAttendance(employeeId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${employeeId}`, {
    });
  }


  // 👉 Admin/HR: Mark Absent
  markAbsent(employeeId: string, date: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/mark-absent`, {
      employeeId,
      date
    });
  }
}
