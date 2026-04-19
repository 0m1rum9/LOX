import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000'

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register/`, { username, email, password })
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login/`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem('access', res.access)
        localStorage.setItem('refresh', res.refresh)
      }))
  }

  logout() {
    const refresh = localStorage.getItem('refresh')
    return this.http.post(`${this.apiUrl}/auth/logout/`, { refresh })
      .pipe(tap(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      }))
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access')
  }

  getToken(): string | null {
    return localStorage.getItem('access')
  }
}