import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sidenavContainer') sidenavContainer!: MatSidenavContainer;
  
  title = 'Aplicación Angular';
  opened = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Asegurar que el contenedor se inicialice correctamente
    if (this.sidenavContainer) {
      this.sidenavContainer.updateContentMargins();
    }
  }

  toggleSidenav() {
    this.opened = !this.opened;
    // Forzar detección de cambios y actualización del layout
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.sidenavContainer) {
        this.sidenavContainer.updateContentMargins();
      }
    }, 350); // Esperar a que termine la transición CSS (300ms + margen)
  }

  menuItems = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard', hasSubmenu: false },
    { 
      name: 'Usuarios', 
      icon: 'people', 
      route: '/usuarios', 
      hasSubmenu: true,
      submenu: [
        { name: 'Lista de Usuarios', icon: 'list', route: '/usuarios/lista' },
        { name: 'Permisos', icon: 'security', route: '/usuarios/permisos' }
      ]
    },
    { name: 'Productos', icon: 'inventory', route: '/productos', hasSubmenu: false },
    { name: 'Ventas', icon: 'point_of_sale', route: '/ventas', hasSubmenu: false },
    { name: 'Reportes', icon: 'assessment', route: '/reportes', hasSubmenu: false },
    { name: 'Configuración', icon: 'settings', route: '/configuracion', hasSubmenu: false }
  ];

  expandedPanels: { [key: string]: boolean } = {};
}
