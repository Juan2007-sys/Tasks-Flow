import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProjectsService } from '../../services/projects.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  projectsService = inject(ProjectsService);
  private toast = inject(ToastService);

  showCreateModal = false;
  newProjectName = '';
  newProjectDesc = '';
  creatingProject = false;

  stats = {
    total: 0,
    active: 0,
    completed: 0,
    completionRate: 0,
  };

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectsService.obtenerTodos().subscribe({
      next: (projects) => {
        this.calculateStats(projects);
      },
      error: () => {
        this.toast.error('No se pudieron cargar los proyectos', 'Error');
      }
    });
  }

  calculateStats(projects: Project[]) {
    this.stats.total = projects.length;
    this.stats.active = projects.filter(p => p.status === 'active').length;
    this.stats.completed = projects.filter(p => p.status === 'completed').length;
    this.stats.completionRate = this.stats.total > 0
      ? Math.round((this.stats.completed / this.stats.total) * 100)
      : 0;
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

    this.creatingProject = true;
    this.projectsService.crear({
      name: this.newProjectName.trim(),
      description: this.newProjectDesc.trim() || undefined,
    }).subscribe({
      next: (created) => {
        this.toast.success(`Proyecto "${created.name}" creado con éxito`, 'Proyecto Creado');
        this.closeCreateModal();
        this.creatingProject = false;
        this.calculateStats(this.projectsService.projects());
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al crear el proyecto', 'Error');
        this.creatingProject = false;
      }
    });
  }
}