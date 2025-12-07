import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdmFuentesMainComponent } from './modules/adm-fuentes/adm-fuentes-main/adm-fuentes-main.component';
import { AdmFuentesCrearEditarComponent } from './modules/adm-fuentes/adm-fuentes-crear-editar/adm-fuentes-crear-editar.component';
import { TipoSepulturaMainComponent } from './modules/tipo-sepultura/tipo-sepultura-main/tipo-sepultura-main.component';
import { TipoSepulturaCrearEditarComponent } from './modules/tipo-sepultura/tipo-sepultura-crear-editar/tipo-sepultura-crear-editar.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'adm-fuentes', component: AdmFuentesMainComponent },
  { path: 'adm-fuentes/nuevo', component: AdmFuentesCrearEditarComponent },
  { path: 'adm-fuentes/editar/:id', component: AdmFuentesCrearEditarComponent },
  { path: 'adm-fuentes/regularizar', component: AdmFuentesCrearEditarComponent },
  { path: 'tipo-sepultura', component: TipoSepulturaMainComponent },
  { path: 'tipo-sepultura/nuevo', component: TipoSepulturaCrearEditarComponent },
  { path: 'tipo-sepultura/editar/:id', component: TipoSepulturaCrearEditarComponent },
  { path: 'tipo-sepultura/regularizar', component: TipoSepulturaCrearEditarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
