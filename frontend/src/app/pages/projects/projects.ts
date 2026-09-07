import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './projects.html',
})
export class ProjectsComponent implements OnInit {
  projectsService = inject(ProjectsService);
  private toast = inject(ToastService);

  // Filtros
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'completed' = 'all';

  // Modales
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Estados de formularios
  newProjectName = '';
  newProjectDesc = '';
  editingProject: Project | null = null;
  deletingProject: Project | null = null;
  saving = false;

  ngOnInit() {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.projectsService.obtenerTodos().subscribe({
      error: () => {
        this.toast.error('No se pudieron cargar los proyectos', 'Error');
      }
    });
  }

  get filteredProjects(): Project[] {
    return this.projectsService.projects().filter(project => {
      const matchesSearch =
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (project.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);

      const matchesStatus =
        this.statusFilter === 'all' || project.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  openCreateModal() {
    this.newProjectName = '';
    this.newProjectDesc = '';
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  crearProyecto() {
    if (!this.newProjectName.trim()) {
      this.toast.warning('Ingresa el nombre del proyecto', 'Campo requerido');
      return;
    }

    this.saving = true;
    this.projectsService.crear({
      name: this.newProjectName.trim(),
      description: this.newProjectDesc.trim() || undefined,
    }).subscribe({
      next: (created) => {
        this.toast.success(`Proyecto "${created.name}" creado correctamente`, 'Proyecto Creado');
        this.closeCreateModal();
        this.saving = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al crear el proyecto', 'Error');
        this.saving = false;
      }
    });
  }

  openEditModal(project: Project) {
    this.editingProject = { ...project };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingProject = null;
  }

  guardarEdicion() {
    if (!this.editingProject || !this.editingProject.name.trim()) {
      this.toast.warning('El nombre del proyecto es obligatorio', 'Campo requerido');
      return;
    }

    this.saving = true;
    this.projectsService.actualizar(this.editingProject._id, {
      name: this.editingProject.name.trim(),
      description: this.editingProject.description?.trim() || undefined,
      status: this.editingProject.status,
    }).subscribe({
      next: (updated) => {
        this.toast.success(`Proyecto "${updated.name}" actualizado`, 'Cambios Guardados');
        this.closeEditModal();
        this.saving = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al actualizar el proyecto', 'Error');
        this.saving = false;
      }
    });
  }

  openDeleteModal(project: Project) {
    this.deletingProject = project;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingProject = null;
  }

  confirmarEliminacion() {
    if (!this.deletingProject) return;

    this.saving = true;
    this.projectsService.eliminar(this.deletingProject._id).subscribe({
      next: () => {
        this.toast.success(`Proyecto "${this.deletingProject?.name}" y sus tareas fueron eliminados`, 'Eliminado');
        this.closeDeleteModal();
        this.saving = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al eliminar el proyecto', 'Error');
        this.saving = false;
      }
    });
  }

  toggleStatus(project: Project) {
    const nextStatus = project.status === 'active' ? 'completed' : 'active';
    this.projectsService.actualizar(project._id, { status: nextStatus }).subscribe({
      next: (updated) => {
        const msg = updated.status === 'completed' ? 'Proyecto marcado como completado' : 'Proyecto reactivado';
        this.toast.info(msg, 'Estado Actualizado');
      },
      error: () => this.toast.error('No se pudo actualizar el estado', 'Error')
    });
  }
}

