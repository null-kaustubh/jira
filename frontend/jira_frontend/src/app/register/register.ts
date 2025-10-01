import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupForm } from '../components/signup-form/signup-form';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, SignupForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  emailForm = false;

  constructor(private router: Router) {}

  goToSignIn() {
    this.router.navigate(['/login']);
  }
}
