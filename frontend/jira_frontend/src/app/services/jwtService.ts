import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
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

  // ✅ Added
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Added
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now; // valid if not expired
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

  getUserEmail(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.sub : null;
  }

  getUserId(): number | null {
    const decodedToken = this.decodeToken();
    console.log(decodedToken);
    return decodedToken ? decodedToken.id : null;
  }
}
