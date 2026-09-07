import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="pointer-events-auto transform transition-all duration-300 animate-spring-pop p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md"
        [ngClass]="{
          'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10': toast.type === 'success',
          'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/10': toast.type === 'error',
          'bg-indigo-50/95 border-indigo-200 text-indigo-900 shadow-indigo-500/10': toast.type === 'info',
          'bg-amber-50/95 border-amber-200 text-amber-900 shadow-amber-500/10': toast.type === 'warning'
        }"
      >
        <!-- Iconos SVG limpios -->
        <div class="p-1 rounded-lg shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div class="flex-1">
          <p *ngIf="toast.title" class="font-bold text-xs uppercase tracking-wider mb-0.5">{{ toast.title }}</p>
          <p class="text-sm font-medium leading-snug">{{ toast.message }}</p>
        </div>

        <button
          (click)="toastService.remove(toast.id)"
          class="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors text-gray-400 hover:text-gray-700"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
