import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/types/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';
  
  constructor(private http: HttpClient) {}

  loginUser(user: User ): Observable<{token : string, message : string}> {
    return this.http.post<{token : string, message : string}>(this.apiUrl+'/login', user );
  }

}
