import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
   private apiUrl = `${environment.apiUrl}/departments`;
  constructor(private http:HttpClient) { }
  // Add Department (Admin only)
addDepartment(departmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, departmentData);
}

  // Get all departments
  getDepartments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  updateDepartment(id: string, departmentData: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, departmentData);
  }
  deleteDepartment(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
