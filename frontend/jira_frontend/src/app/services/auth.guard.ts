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
  
    if (url === '/login' && !tokenValid) {
      return true;
    }
  
    if (url === '/login' && tokenValid) {
      return this.router.createUrlTree(['/']);
    }
  
    if (!tokenValid) {
      return this.router.createUrlTree(['/login']);
    }
  
    if (url.startsWith('/users') && role !== 'ADMIN') {
      return this.router.createUrlTree(['/']);
    }
  
    if (url.startsWith('/register') && role !== 'ADMIN') {
      return this.router.createUrlTree(['/']);
    }
    return true;
  }
  
}
