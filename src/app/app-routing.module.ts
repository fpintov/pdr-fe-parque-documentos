import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ProductosComponent } from './components/productos/productos.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { ListaUsuariosComponent } from './components/usuarios/lista-usuarios/lista-usuarios.component';
import { PermisosUsuariosComponent } from './components/usuarios/permisos-usuarios/permisos-usuarios.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'usuarios/lista', component: ListaUsuariosComponent },
  { path: 'usuarios/permisos', component: PermisosUsuariosComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'configuracion', component: ConfiguracionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
