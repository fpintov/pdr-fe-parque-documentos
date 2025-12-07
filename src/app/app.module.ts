import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// Interceptors
import { AuthInterceptor } from './auth/auth.interceptor';

// Components
import { LoginComponent } from './auth/login/login.component';
import { AdmFuentesMainComponent } from './modules/adm-fuentes/adm-fuentes-main/adm-fuentes-main.component';
import { AdmFuentesCrearEditarComponent } from './modules/adm-fuentes/adm-fuentes-crear-editar/adm-fuentes-crear-editar.component';
import { TipoSepulturaMainComponent } from './modules/tipo-sepultura/tipo-sepultura-main/tipo-sepultura-main.component';
import { TipoSepulturaCrearEditarComponent } from './modules/tipo-sepultura/tipo-sepultura-crear-editar/tipo-sepultura-crear-editar.component';
import { MessageModalComponent } from './shared/modals/message-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdmFuentesMainComponent,
    AdmFuentesCrearEditarComponent,
    TipoSepulturaMainComponent,
    TipoSepulturaCrearEditarComponent,
    MessageModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
