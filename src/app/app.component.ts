import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('sidenavContainer') sidenavContainer?: MatSidenavContainer;
  
  title = 'PDR Documentos Parque';
  opened = true;
  isAuthenticated = false;
  showLogin = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar estado de autenticación inicial
    this.checkAuthentication();
    
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuthentication();
    });
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    const currentRoute = this.router.url || '';
    this.showLogin = !this.isAuthenticated || currentRoute === '/login';
  }

  ngAfterViewInit() {
    // Asegurar que el contenedor se inicialice correctamente
    if (this.sidenavContainer && !this.showLogin) {
      this.sidenavContainer.updateContentMargins();
    }
  }

  toggleSidenav() {
    this.opened = !this.opened;
    // Forzar detección de cambios y actualización del layout
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.sidenavContainer && !this.showLogin) {
        this.sidenavContainer.updateContentMargins();
      }
    }, 350); // Esperar a que termine la transición CSS (300ms + margen)
  }

  menuItems = [
    { name: 'Administración de Fuentes', icon: 'source', route: '/adm-fuentes' },
    { name: 'Tipo de Sepultura', icon: 'account_box', route: '/tipo-sepultura' }
  ];
}
