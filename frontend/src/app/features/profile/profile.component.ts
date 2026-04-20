import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

interface User {
  username: string
  email: string
  phone?: string
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null
  isLoading = true
  error: string | null = null

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'])
      return
    }
    this.loadUserProfile()
  }

  loadUserProfile() {
    this.isLoading = true
    console.log('Loading profile...')
    this.http.get<any>('http://172.20.10.4:8000/me').subscribe({
      next: (data) => {
        console.log('Raw response:', data)
        console.log('Response type:', typeof data)
        console.log('Response keys:', Object.keys(data))
        
        // Handle different response structures
        let userData = data
        if (data.user) {
          userData = data.user
        }
        
        console.log('Parsed user:', userData)
        
        // Type assert to User interface
        this.user = {
          username: userData.username || userData.name || 'Unknown',
          email: userData.email || 'No email'
        }
        
        console.log('User set:', this.user)
        this.isLoading = false
      },
      error: (err) => {
        console.error('Failed to load profile:', err)
        console.error('Error details:', err.error)
        this.error = `Ошибка загрузки: ${err.error?.detail || err.message || 'Неизвестная ошибка'}`
        this.isLoading = false
        // Don't logout - just show the error
        if (err.status === 401) {
          this.router.navigate(['/login'])
        }
      }
    })
  }

  onLogout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        this.router.navigate(['/login'])
      }
    })
  }
}