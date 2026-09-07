import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  register() {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.toast.success(`¡Cuenta creada con éxito! Bienvenido, ${res.user.name}.`, 'Registro Exitoso');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrarse. Verifica los datos.';
        this.toast.error(this.error, 'Error de Registro');
        this.loading = false;
      }
    });
  }
}