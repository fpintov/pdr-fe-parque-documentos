import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  rememberMe = true;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verificar si hay credenciales guardadas
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail });
      this.rememberMe = true;
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      // Guardar email si "Remember me" está marcado
      if (this.rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Realizar login
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response && response.token) {
            this.router.navigate(['/adm-fuentes']);
          } else {
            console.error('Error: No se recibió token en la respuesta');
            alert('Error: No se pudo completar el login. Por favor, intente nuevamente.');
          }
        },
        error: (error) => {
          console.error('Error en el login:', error);
          
          let errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
          
          if (error.status === 401 || error.status === 403) {
            errorMessage = 'Credenciales inválidas. Por favor, verifique su usuario y contraseña.';
          } else if (error.status === 500) {
            errorMessage = 'Error del servidor. Por favor, contacte al administrador o intente más tarde.';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifique su conexión a internet.';
          } else if (error.status) {
            errorMessage = `Error ${error.status}: ${error.statusText || 'Error en la petición'}`;
          }
          
          alert(errorMessage);
        }
      });
    }
  }

  onRememberMeChange(event: any): void {
    this.rememberMe = event.checked;
  }

  onForgotPassword(): void {
    // Implementar lógica de recuperación de contraseña
    console.log('Forgot password clicked');
  }
}

