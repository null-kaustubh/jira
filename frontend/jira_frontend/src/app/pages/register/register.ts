import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/services/AuthService/auth';
import { NewUser } from 'src/app/types/User';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  username = '';
  password = '';
  role = 'user';
  showPass = false;

  validations = {
    hasMixedCase: false,
    hasDigit: false,
    hasSymbol: false,
    isMinLength: false,
  };

  constructor(private router: Router, private authService: Auth) {}

  goToSignIn() {
    this.router.navigate(['/']);
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  handlePasswordChange(value: string) {
    this.password = value;
    this.validations = {
      hasMixedCase: /[a-z]/.test(value) && /[A-Z]/.test(value),
      hasDigit: /\d/.test(value),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      isMinLength: value.length >= 8,
    };
  }

  get isValid(): boolean {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    return (
      isEmailValid &&
      this.username.trim().length > 0 &&
      this.validations.hasMixedCase &&
      this.validations.hasDigit &&
      this.validations.hasSymbol &&
      this.validations.isMinLength
    );
  }

  submitForm() {
    if (!this.isValid) return;

    const newUser: NewUser = {
      email: this.email,
      password: this.password,
      username: this.username,
      role: this.role,
    };

    this.authService.registerUser(newUser).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        this.router.navigate(['/projects/dashboard']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
      },
    });
  }
}