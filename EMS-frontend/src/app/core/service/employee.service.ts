import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../model/Employee';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 private apiUrl = `${environment.apiUrl}/employees`;
  constructor(private http: HttpClient,private authService:AuthService) { }
   getEmployees(): Observable<Employee[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEmployeesByDepartment(deptId: string) {
  return this.http.get<any>(`${this.apiUrl}/department/${deptId}`);
}
getEmployeeById(id: string) {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}
// Employee fetch own profile
  getMyProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }



  addEmployee(formData: FormData): Observable<Employee> {
    return this.http.post<any>(`${this.apiUrl}/add`, formData);
  }

  updateEmployee(id: string, formData: FormData): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, formData);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
