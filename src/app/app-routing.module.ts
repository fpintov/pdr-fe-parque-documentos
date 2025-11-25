import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { GeneracionComponent } from './modules/generacion/generacion.component';
import { DistribucionComponent } from './modules/distribucion/distribucion.component';
import { AsignacionComponent } from './modules/asignacion/asignacion.component';
import { CambioEstadoComponent } from './modules/cambio-estado/cambio-estado.component';
import { ConsultaComponent } from './modules/consulta/consulta.component';
import { MantenedorUnidadesComponent } from './modules/mantenedor-unidades/mantenedor-unidades.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'generacion', component: GeneracionComponent },
  { path: 'distribucion', component: DistribucionComponent },
  { path: 'asignacion', component: AsignacionComponent },
  { path: 'cambio-estado', component: CambioEstadoComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'mantenedor-unidades', component: MantenedorUnidadesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
