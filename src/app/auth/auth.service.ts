import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.dev';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  fullName: string;
  token: string;
  isMfa: boolean;
  qrCodeImage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor(private http: HttpClient) {
    // Verificar si hay un token guardado
    const token = localStorage.getItem(environment.token_key);
    this.isAuthenticated = !!token;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = {
      username: username,
      password: password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(environment.url_endp_login, loginRequest, { headers }).pipe(
      map((response: LoginResponse) => {
        // Guardar el token
        if (response.token) {
          localStorage.setItem(environment.token_key, response.token);
          this.isAuthenticated = true;
        }
        return response;
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        this.isAuthenticated = false;
        // Re-lanzar el error para que el componente pueda manejarlo
        return throwError(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(environment.token_key);
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getToken(): string | null {
    return localStorage.getItem(environment.token_key);
  }
}

