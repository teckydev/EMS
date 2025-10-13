import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
 private apiUrl = 'http://localhost:5000/api/salaries';
  constructor(private http: HttpClient) {

   }
   addSalary(salaryData: any): Observable<any> {
    return this.http.post(this.apiUrl, salaryData);
  }
  // Get salary history for an employee
  getSalaryByEmployee(employeeId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/salary-history/${employeeId}`);
  }
 // Get salary by ID (for edit view)
  getSalaryById(salaryId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${salaryId}`);
  }
   // Update existing salary
  updateSalary(salaryId: string, salaryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${salaryId}`, salaryData);
  }
  deleteSalary(salaryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${salaryId}`);
  }
}
