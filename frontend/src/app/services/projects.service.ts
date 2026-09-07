import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Project, CreateProjectPayload, UpdateProjectPayload } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private url = 'http://localhost:3000/projects';
  
  projects = signal<Project[]>([]);
  activeProject = signal<Project | null>(null);
  loading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Project[]> {
    this.loading.set(true);
    return this.http.get<Project[]>(this.url).pipe(
      tap(data => {
        this.projects.set(data);
        this.loading.set(false);
      })
    );
  }

  obtenerUno(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.url}/${id}`).pipe(
      tap(project => this.activeProject.set(project))
    );
  }

  crear(payload: CreateProjectPayload): Observable<Project> {
    return this.http.post<Project>(this.url, payload).pipe(
      tap(newProject => {
        this.projects.update(current => [newProject, ...current]);
      })
    );
  }

  actualizar(id: string, payload: UpdateProjectPayload): Observable<Project> {
    return this.http.put<Project>(`${this.url}/${id}`, payload).pipe(
      tap(updated => {
        this.projects.update(current =>
          current.map(p => (p._id === id ? { ...p, ...updated } : p))
        );
        if (this.activeProject()?._id === id) {
          this.activeProject.set(updated);
        }
      })
    );
  }

  eliminar(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.projects.update(current => current.filter(p => p._id !== id));
        if (this.activeProject()?._id === id) {
          this.activeProject.set(null);
        }
      })
    );
  }
}
