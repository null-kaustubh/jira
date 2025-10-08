import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './AuthService/authInterface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

<<<<<<< HEAD
  loginUser(user: User): Observable<{ token: string; message: string }> {
    return this.http.post<{ token: string; message: string }>(this.apiUrl + '/login', user);
=======
  loginUser(user: { email: string, password: string } ): Observable<{token : string, message : string}> {
    return this.http.post<{token : string, message : string}>(this.apiUrl+'/login', user );
>>>>>>> 9e8a2675bb3d080fe10bc63100f4629937dc8d72
  }

  getAllUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(`${this.apiUrl}`);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // updateUser(id: number, user: User): Observable<User> {
  //   return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  // }

  // deleteUser(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  // }
}
