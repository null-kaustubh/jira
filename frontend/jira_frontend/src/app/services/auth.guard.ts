import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwtService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // ✅ Check if the token is valid
    if (!this.jwtService.isTokenValid()) {
      return this.router.createUrlTree(['/login']);
    }

    const role = this.jwtService.getUserRole(); // e.g., 'admin', 'user', etc.
    const url = state.url; // current route path

    // ✅ Access control rules
    if (url.startsWith('/users') && role !== 'ADMIN') {
      // only admin can view users
      return this.router.createUrlTree(['/']);
    }

    if (url.startsWith('/register') && role !== 'ADMIN') {
      // only admin can access register
      return this.router.createUrlTree(['/']);
    }

    if (url.startsWith('/projects')) {
      // projects route is open to all roles (user, admin, etc.)
      return true;
    }

    // default → allow for authenticated users
    return true;
  }
}
