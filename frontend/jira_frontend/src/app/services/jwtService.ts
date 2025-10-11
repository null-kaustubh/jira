import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  username: string ;
  sub: string;
  role: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor() {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (err) {
      console.error('Invalid token:', err);
      return false;
    }
  }

  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        return decodedToken;
      } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
      }
    }
    return null;
  }

  getUserRole(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.role : null;
  }

  getUsername(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.username : null;
  }

  getUserEmail(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.sub : null;
  }

  getUserId(): number | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.id : null;
  }
}
