import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';

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
  constructor(private router: Router) {}

  goToSignUp() {
    this.router.navigate(['/register']);
  }

  submitForm() {
    console.log('username: ', this.email);
    console.log('Password: ', this.password);
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  get isValid(): boolean {
    return this.email.trim().length > 0 && this.password.trim().length > 0;
  }
}
