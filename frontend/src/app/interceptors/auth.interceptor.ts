import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  const token = localStorage.getItem('token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.warning('Tu sesión ha expirado. Por favor inicia sesión de nuevo.', 'Sesión Expirada');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
