import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/auth';

  currentUser = signal<User | null>(this.getStoredUser());
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.url}/register`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
        this.isLoggedIn.set(true);
      })
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.url}/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getUser(): User {
    return this.currentUser() || this.getStoredUser();
  }

  private getStoredUser(): User {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return { name: '', email: '' };
    }
  }
}

