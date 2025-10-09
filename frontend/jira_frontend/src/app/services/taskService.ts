import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from './jwtService';
import { CreateTaskPayload, Task } from 'src/app/types/task'; 

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/project';

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${projectId}/tasks`);
  }

  getTaskById(projectId: number, taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${projectId}/tasks/${taskId}`);
  }

  createTask(projectId: number, task: CreateTaskPayload): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${projectId}/tasks`, task, );
  }

  updateTask(projectId: number, taskId: number, updatedTask: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${projectId}/tasks/${taskId}`, updatedTask, );
  }

  deleteTask(projectId: number, taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/tasks/${taskId}`);
  }
}
