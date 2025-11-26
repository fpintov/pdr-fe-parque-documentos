import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.dev';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No añadir token a la petición de login
    if (request.url.includes('login')) {
      return next.handle(request);
    }

    // Obtener el token del localStorage
    const token = localStorage.getItem(environment.token_key);

    // Si hay token, añadirlo al header Authorization
    if (token) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // Si el error es 401 (Unauthorized), el token expiró
          if (error.status === 401) {
            // Cerrar sesión
            this.authService.logout();
            // Redirigir al login
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
    }

    // Si no hay token, continuar con la petición original
    return next.handle(request);
  }
}

