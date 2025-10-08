import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUser, User } from './authInterface';
import { JwtService } from '../JWT/jwtService';
import { NewUser } from 'src/app/types/User';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  registerUser(user: NewUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  loginUser(login: LoginUser): Observable<LoginUser> {
    return this.http.post<LoginUser>(`${this.apiUrl}/login`, login);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
