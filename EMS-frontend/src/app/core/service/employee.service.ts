import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../model/Employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 private apiUrl = 'http://localhost:5000/api/employees';
  constructor(private http: HttpClient) { }
   getEmployees(): Observable<Employee[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEmployeesByDepartment(deptId: string) {
  return this.http.get<any>(`${this.apiUrl}/department/${deptId}`);
}
getEmployeeById(id: string) {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
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
