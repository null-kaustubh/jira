import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectFull, UpdateProject } from 'src/app/types/project';
import { JwtService } from './jwtService';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api/projects';
  role = null;

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getAllProjects(): Observable<ProjectFull[]> {
    return this.http.get<ProjectFull[]>(`${this.apiUrl}`);
  }

  getProjectById(projectId: number): Observable<ProjectFull> {
    return this.http.get<ProjectFull>(`${this.apiUrl}/${projectId}`);
  }

  getStatus(projectId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${projectId}/status`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}`, project);
  }

  updateProject(updateProject: UpdateProject, projectId: number): Observable<UpdateProject> {
    return this.http.put<UpdateProject>(`${this.apiUrl}/${projectId}`, updateProject);
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
  }
}
