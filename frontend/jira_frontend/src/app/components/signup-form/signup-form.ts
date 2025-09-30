import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';
import { ZardButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ZardDropdownModule,
    ZardButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  email = '';
  password = '';
  username = '';
  role = '';
  showPass = false;

  validations = {
    hasMixedCase: false,
    hasDigit: false,
    hasSymbol: false,
    isMinLength: false,
  };

  constructor(private router: Router) {}

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
    return (
      this.validations.hasMixedCase &&
      this.validations.hasDigit &&
      this.validations.hasSymbol &&
      this.validations.isMinLength &&
      this.email.trim().length > 0 &&
      this.username.trim().length > 0
    );
  }

  submitForm() {
    if (!this.isValid) return;

    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Username: ', this.username);
    console.log('Role: ', this.role);

    // Later: connect to backend for signup
    this.router.navigate(['/home']);
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  setRole(selectedRole: string) {
    this.role = selectedRole;
    console.log(this.role);
  }
}
