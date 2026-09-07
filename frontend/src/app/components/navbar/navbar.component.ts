import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <!-- Logo & Nav Links -->
          <div class="flex items-center gap-8">
            <a routerLink="/dashboard" class="flex items-center gap-2.5 group cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span class="text-xl font-extrabold bg-gradient-to-r from-slate-900 via-violet-950 to-indigo-900 bg-clip-text text-transparent">TaskFlow</span>
                <span class="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 rounded-full">Pro</span>
              </div>
            </a>

            <div class="hidden md:flex items-center gap-1">
              <a
                routerLink="/dashboard"
                routerLinkActive="bg-violet-50 text-violet-700 font-semibold"
                [routerLinkActiveOptions]="{ exact: true }"
                class="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
              >
                Dashboard
              </a>
              <a
                routerLink="/projects"
                routerLinkActive="bg-violet-50 text-violet-700 font-semibold"
                class="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
              >
                Proyectos
              </a>
            </div>
          </div>

          <!-- User Profile & Actions -->
          <div class="flex items-center gap-3">
            <div class="hidden sm:flex items-center gap-3 pr-3 border-r border-slate-200">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {{ (authService.currentUser()?.name || 'U').charAt(0).toUpperCase() }}
              </div>
              <div class="text-left">
                <p class="text-xs font-semibold text-slate-800 leading-tight">{{ authService.currentUser()?.name || 'Usuario' }}</p>
                <p class="text-[11px] text-slate-400 leading-tight truncate max-w-[120px]">{{ authService.currentUser()?.email }}</p>
              </div>
            </div>

            <button
              (click)="authService.logout()"
              title="Cerrar Sesión"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden sm:inline">Salir</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
}
