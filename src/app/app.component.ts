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
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Usuarios', icon: 'people', route: '/usuarios' },
    { name: 'Productos', icon: 'inventory', route: '/productos' },
    { name: 'Ventas', icon: 'point_of_sale', route: '/ventas' },
    { name: 'Reportes', icon: 'assessment', route: '/reportes' },
    { name: 'Configuración', icon: 'settings', route: '/configuracion' }
  ];
}
