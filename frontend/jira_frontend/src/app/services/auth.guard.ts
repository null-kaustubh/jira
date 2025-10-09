import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { JwtService } from './jwtService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.jwtService.isTokenValid()) {
      return true; // ✅ allow navigation
    }
    // 🚫 if not logged in, redirect to login
    return this.router.createUrlTree(['/login']);
  }
}
