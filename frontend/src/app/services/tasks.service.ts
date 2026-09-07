import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private url = 'http://localhost:3000/tasks';

  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  obtenerPorProyecto(projectId: string): Observable<Task[]> {
    this.loading.set(true);
    return this.http.get<Task[]>(`${this.url}/proyecto/${projectId}`).pipe(
      tap(data => {
        this.tasks.set(data);
        this.loading.set(false);
      })
    );
  }

  obtenerUna(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.url}/${id}`);
  }

  crear(payload: CreateTaskPayload): Observable<Task> {
    return this.http.post<Task>(this.url, payload).pipe(
      tap(newTask => {
        this.tasks.update(current => [newTask, ...current]);
      })
    );
  }

  actualizar(id: string, payload: UpdateTaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, payload).pipe(
      tap(updated => {
        this.tasks.update(current =>
          current.map(t => (t._id === id ? { ...t, ...updated } : t))
        );
      })
    );
  }

  cambiarEstado(id: string, nuevoEstado: TaskStatus): Observable<Task> {
    return this.actualizar(id, { status: nuevoEstado });
  }

  eliminar(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.tasks.update(current => current.filter(t => t._id !== id));
      })
    );
  }
}
