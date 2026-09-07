import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { ProjectsService } from '../../services/projects.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Task, TaskStatus } from '../../models/task.model';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './tasks.html',
})
export class TasksComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  tasksService = inject(TasksService);
  projectsService = inject(ProjectsService);
  private toast = inject(ToastService);

  projectId = '';
  project = signal<Project | null>(null);
  loadingProject = signal<boolean>(true);

  // Modo de visualización: 'kanban' | 'list'
  viewMode: 'kanban' | 'list' = 'kanban';

  // Drag & Drop Nativo
  draggedTask = signal<Task | null>(null);
  dragOverColumn = signal<TaskStatus | null>(null);

  // Modales
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Estado del formulario de creación
  newTaskTitle = '';
  newTaskDesc = '';
  newTaskStatus: TaskStatus = 'pendiente';

  // Estado de edición y eliminación
  editingTask: Task | null = null;
  deletingTask: Task | null = null;
  saving = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('projectId');
      if (id) {
        this.projectId = id;
        this.cargarDatos(id);
      } else {
        this.router.navigate(['/projects']);
      }
    });
  }

  cargarDatos(projectId: string) {
    this.loadingProject.set(true);
    
    // Cargar información del proyecto
    this.projectsService.obtenerUno(projectId).subscribe({
      next: (proj) => {
        this.project.set(proj);
        this.loadingProject.set(false);
      },
      error: () => {
        this.toast.error('No se pudo encontrar el proyecto', 'Error');
        this.router.navigate(['/projects']);
      }
    });

    // Cargar tareas del proyecto
    this.tasksService.obtenerPorProyecto(projectId).subscribe({
      error: () => {
        this.toast.error('No se pudieron cargar las tareas', 'Error');
      }
    });
  }

  // Columnas Kanban
  get pendingTasks(): Task[] {
    return this.tasksService.tasks().filter(t => t.status === 'pendiente');
  }

  get inProgressTasks(): Task[] {
    return this.tasksService.tasks().filter(t => t.status === 'en_progreso');
  }

  get completedTasks(): Task[] {
    return this.tasksService.tasks().filter(t => t.status === 'completada');
  }

  get progressPercentage(): number {
    const total = this.tasksService.tasks().length;
    if (total === 0) return 0;
    const done = this.completedTasks.length;
    return Math.round((done / total) * 100);
  }

  // Native Drag & Drop Handlers
  onDragStart(task: Task, event: DragEvent) {
    this.draggedTask.set(task);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', task._id);
    }
  }

  onDragOver(status: TaskStatus, event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverColumn.set(status);
  }

  onDragLeave() {
    this.dragOverColumn.set(null);
  }

  onDrop(targetStatus: TaskStatus, event: DragEvent) {
    event.preventDefault();
    this.dragOverColumn.set(null);
    const task = this.draggedTask();

    if (task && task.status !== targetStatus) {
      this.tasksService.cambiarEstado(task._id, targetStatus).subscribe({
        next: () => {
          this.toast.success(`Tarea movida a "${this.getStatusLabel(targetStatus)}"`, 'Estado Actualizado');
          this.draggedTask.set(null);
        },
        error: () => {
          this.toast.error('Error al mover la tarea', 'Error');
          this.draggedTask.set(null);
        }
      });
    } else {
      this.draggedTask.set(null);
    }
  }

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case 'pendiente': return 'Por Hacer';
      case 'en_progreso': return 'En Progreso';
      case 'completada': return 'Completada';
    }
  }

  // Modales
  openCreateModal(initialStatus: TaskStatus = 'pendiente') {
    this.newTaskTitle = '';
    this.newTaskDesc = '';
    this.newTaskStatus = initialStatus;
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  crearTarea() {
    if (!this.newTaskTitle.trim()) {
      this.toast.warning('Ingresa un título para la tarea', 'Campo requerido');
      return;
    }

    this.saving = true;
    this.tasksService.crear({
      title: this.newTaskTitle.trim(),
      description: this.newTaskDesc.trim() || undefined,
      status: this.newTaskStatus,
      project: this.projectId,
    }).subscribe({
      next: (created) => {
        this.toast.success(`Tarea "${created.title}" creada`, 'Tarea Creada');
        this.closeCreateModal();
        this.saving = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al crear la tarea', 'Error');
        this.saving = false;
      }
    });
  }

  openEditModal(task: Task) {
    this.editingTask = { ...task };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingTask = null;
  }

  guardarEdicion() {
    if (!this.editingTask || !this.editingTask.title.trim()) {
      this.toast.warning('El título de la tarea es obligatorio', 'Campo requerido');
      return;
    }

    this.saving = true;
    this.tasksService.actualizar(this.editingTask._id, {
      title: this.editingTask.title.trim(),
      description: this.editingTask.description?.trim() || undefined,
      status: this.editingTask.status,
    }).subscribe({
      next: (updated) => {
        this.toast.success(`Tarea "${updated.title}" actualizada`, 'Guardado');
        this.closeEditModal();
        this.saving = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al actualizar la tarea', 'Error');
        this.saving = false;
      }
    });
  }

  openDeleteModal(task: Task) {
    this.deletingTask = task;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingTask = null;
  }

  confirmarEliminacion() {
    if (!this.deletingTask) return;

    this.saving = true;
    this.tasksService.eliminar(this.deletingTask._id).subscribe({
      next: () => {
        this.toast.success(`Tarea "${this.deletingTask?.title}" eliminada`, 'Eliminada');
        this.closeDeleteModal();
        this.saving = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al eliminar la tarea', 'Error');
        this.saving = false;
      }
    });
  }

  cambiarEstadoRapido(task: Task, nextStatus: TaskStatus) {
    this.tasksService.cambiarEstado(task._id, nextStatus).subscribe({
      next: () => {
        this.toast.info(`Tarea movida a ${this.getStatusLabel(nextStatus)}`, 'Actualizado');
      },
      error: () => this.toast.error('No se pudo actualizar el estado', 'Error')
    });
  }
}

