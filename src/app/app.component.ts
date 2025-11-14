import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Aplicación Angular';
  opened = true;

  toggleSidenav() {
    this.opened = !this.opened;
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
