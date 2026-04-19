import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = ''
  email = ''
  password = ''
  error = ''

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    if (!this.username || !this.email || !this.password) {
      this.error = 'Заполните все поля'
      return
    }
    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error = 'Ошибка регистрации. Попробуйте другой email'
    })
  }
}