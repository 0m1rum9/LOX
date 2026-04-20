import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://172.20.10.4:8000'
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register/`, { username, email, password })
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login/`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem('access', res.access)
        localStorage.setItem('refresh', res.refresh)
        this.isAuthenticatedSubject.next(true);
      }))
  }

  logout() {
    const refresh = localStorage.getItem('refresh')
    return this.http.post(`${this.apiUrl}/auth/logout/`, { refresh })
      .pipe(tap(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        this.isAuthenticatedSubject.next(false);
      }))
  }

  refresh() {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) return null;
    
    return this.http.post<any>(`${this.apiUrl}/auth/refresh/`, { refresh })
      .pipe(tap(res => {
        localStorage.setItem('access', res.access)
      }))
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access');
  }

  getToken(): string | null {
    return localStorage.getItem('access')
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const decoded = atob(parts[1]);
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  getCurrentUserId(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.user_id : null;
  }
}