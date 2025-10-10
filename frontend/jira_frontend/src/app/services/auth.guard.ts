import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwtService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const tokenValid = this.jwtService.isTokenValid();
    const url = state.url;
    const role = this.jwtService.getUserRole();
  
    // ✅ 1) Allow unauthenticated users to access /login
    if (url === '/login' && !tokenValid) {
      return true;
    }
  
    // ✅ 2) Prevent logged-in users from visiting /login
    if (url === '/login' && tokenValid) {
      return this.router.createUrlTree(['/']);
    }
  
    // ✅ 3) If not authenticated, block all other routes
    if (!tokenValid) {
      return this.router.createUrlTree(['/login']);
    }
  
    // ✅ 4) Role-based access
    if (url.startsWith('/users') && role !== 'ADMIN') {
      return this.router.createUrlTree(['/']);
    }
  
    if (url.startsWith('/register') && role !== 'ADMIN') {
      return this.router.createUrlTree(['/']);
    }
  
    // ✅ 5) Allow projects for all roles
    return true;
  }
  
}
