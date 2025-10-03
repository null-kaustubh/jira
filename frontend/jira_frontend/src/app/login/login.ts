import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';
import { UserService } from '../services/User/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ZardDropdownModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  showPass = true;

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  constructor(private router: Router, private userService : UserService) {}

  goToSignUp() {
    this.router.navigate(['/register']);
  }

  submitForm() {
    this.userService.loginUser({ email : this.email, password : this.password}).subscribe({
      next: (response) => {
        localStorage.setItem("token", response.token);
        this.router.navigate(['/projects/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  get isValid(): boolean {
    return this.email.trim().length > 0 && this.password.trim().length > 0;
  }
}
