import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.dev';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

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
      return next.handle(clonedRequest);
    }

    // Si no hay token, continuar con la petición original
    return next.handle(request);
  }
}

