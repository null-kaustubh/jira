import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { ZardSelectComponent } from '@shared/components/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/select/select-item.component';
import { User } from 'src/app/services/AuthService/authInterface';
import { Auth } from 'src/app/services/AuthService/auth';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ZardSelectComponent,
    ZardSelectItemComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm implements OnInit {
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  email = '';
  password = '';
  username = '';
  role = 'user';
  showPass = false;

  validations = {
    hasMixedCase: false,
    hasDigit: false,
    hasSymbol: false,
    isMinLength: false,
  };

  constructor(private router: Router, private userService: Auth) {}

  ngOnInit(): void {}

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
    try {
      const newUser: User = {
        email: this.email,
        password: this.password,
        username: this.username,
        role: this.role,
      };

      this.userService.registerUser(newUser).subscribe({
        next: (response: any) => {
          const token = response.token;
          if (token) {
            localStorage.setItem('jwtToken', token);
          }
          this.router.navigate(['/home']);
        },
        error: (err) => console.error(err),
      });
    } catch (e) {
      console.log(e);
    }
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  setRole(selectedRole: string) {
    this.role = selectedRole;
    console.log(this.role);
  }
}
