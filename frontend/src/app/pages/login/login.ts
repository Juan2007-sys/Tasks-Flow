import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  email = '';
  password = '';
  error = '';
  loading = false;

  login() {
    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.toast.success(`¡Bienvenido de nuevo, ${res.user.name}!`, 'Inicio de Sesión');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Credenciales incorrectas o usuario no encontrado';
        this.toast.error(this.error, 'Error de Autenticación');
        this.loading = false;
      }
    });
  }
}