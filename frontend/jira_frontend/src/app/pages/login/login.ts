import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // LucideAngularModule removed
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  showPass = false;

  constructor(private router: Router, private userService: UserService) {}

  goToSignUp() {
    this.router.navigate(['/register']);
  }

  submitForm() {
    if (!this.isValid) return;

    this.userService.loginUser({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  get isValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email) && this.password.trim().length > 5;
  }
}