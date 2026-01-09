import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
private apiUrl = 'http://localhost:5000/api/tasks';

 constructor(private http: HttpClient) {}
  getAllTasks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTaskById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getEmployeeTasks(): Observable<any> {
  return this.http.get(`${this.apiUrl}/my-tasks`);
}

updateTaskProgress(taskId: string, payload: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${taskId}/progress`, payload);
}

}
