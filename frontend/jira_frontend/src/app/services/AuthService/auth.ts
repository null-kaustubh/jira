import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUser, User } from './authInterface';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  loginUser(login: LoginUser): Observable<LoginUser> {
    return this.http.post<LoginUser>(`${this.apiUrl}/login`, login);
  }

  // updateUser(id: number, user: User): Observable<User> {
  //   return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  // }

  // deleteUser(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  // }
}
