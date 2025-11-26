import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneracionService, EmpresaDto, UnidadDto, TipoDocumentoDto } from './generacion.service';
import { SISTEMA_DOCUMENTO, APLICACION_GENERACION_DOCUMENTOS, PARAMETRO_DOC_UNID_TIPO_MAYOR } from '../../utils/constants';
import { MessageModalService } from '../../shared/modals/message-modal.service';

@Component({
  selector: 'app-generacion',
  templateUrl: './generacion.component.html',
  styleUrls: ['./generacion.component.css']
})
export class GeneracionComponent implements OnInit {
  generacionForm: FormGroup;
  empresas: EmpresaDto[] = [];
  loadingEmpresas = false;
  parametroValor: string = '';
  stockMayor: string = 'No hay datos';
  tiposDocumento: TipoDocumentoDto[] = [];
  unidCod: string = '';
  loadingCrearSerie = false;
  loadingGenerar = false;
  loadingEliminar = false;

  constructor(
    private fb: FormBuilder,
    private generacionService: GeneracionService,
    private messageModalService: MessageModalService
  ) {
    this.generacionForm = this.fb.group({
      empresa: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      folioFinal: ['', Validators.required],
      serie: ['', Validators.required],
      folioInicial: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Deshabilitar botones inicialmente
    this.updateButtonStates();
    
    // Escuchar cambios en el formulario para habilitar/deshabilitar botones
    this.generacionForm.valueChanges.subscribe(() => {
      this.updateButtonStates();
    });

    // Cargar empresas
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.loadingEmpresas = true;
    this.generacionService.getEmprUser(SISTEMA_DOCUMENTO, APLICACION_GENERACION_DOCUMENTOS).subscribe({
      next: (empresas) => {
        this.empresas = empresas;
        this.loadingEmpresas = false;
      },
      error: (error) => {
        console.error('Error al cargar empresas:', error);
        this.loadingEmpresas = false;
        // Opcional: mostrar mensaje de error al usuario
      }
    });
  }

  updateButtonStates(): void {
    // Los botones se habilitarán cuando el formulario sea válido
    // Esta lógica se puede ajustar según los requisitos
  }

  isCrearSerieValid(): boolean {
    const empresa = this.generacionForm.get('empresa')?.value;
    const tipoDocumento = this.generacionForm.get('tipoDocumento')?.value;
    const serie = this.generacionForm.get('serie')?.value;
    
    // Verificar que empresa, tipoDocumento y serie estén disponibles
    // y que stockMayor (unidCod) también esté disponible
    return !!(empresa && tipoDocumento && serie && this.unidCod);
  }

  onEmpresaChange(): void {
    // Lógica cuando cambia la empresa
    const emprCod = this.generacionForm.get('empresa')?.value;
    
    if (!emprCod) {
      return;
    }

    this.generacionService.getParametros(PARAMETRO_DOC_UNID_TIPO_MAYOR).subscribe({
      next: (parametro) => {
        this.parametroValor = parametro.valor;
        
        // Llamar a getLstUnidades después de obtener el parámetro
        this.generacionService.getLstUnidades(
          emprCod,
          this.parametroValor,
          'SI'
        ).subscribe({
          next: (unidades) => {
            console.log('Unidades obtenidas:', unidades);
            // Obtener el UNID_DESC del primer elemento (o el que corresponda)
            if (unidades && unidades.length > 0) {
              this.stockMayor = unidades[0].UNID_DESC;
              this.unidCod = unidades[0].UNID_COD;
              
              // Cargar el tipo de documento con el unidCod
              this.generacionService.getTiposDocumentos(emprCod, this.unidCod).subscribe({ 
                next: (tiposDocumento) => {
                  this.tiposDocumento = tiposDocumento;
                  console.log('Tipos documento:', tiposDocumento);
                }, 
                error: (error) => {
                  console.error('Error al cargar tipo documento:', error);
                  this.tiposDocumento = [];
                }
              });
            } else {
              this.stockMayor = 'No hay datos';
              this.tiposDocumento = [];
            }
          },
          error: (error) => {
            console.error('Error al cargar unidades:', error);
            this.stockMayor = 'No hay datos';
            this.tiposDocumento = [];
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar parametro:', error);
      }
    });
  }

  eliminar(): void {
    if (this.generacionForm.valid) {
      this.loadingEliminar = true;
      
      const formValue = this.generacionForm.value;
      
      // Construir el DTO para eliminar documentos
      const eliminarDocumentosDto = {
        emprCod: formValue.empresa,
        unidCod: this.unidCod,
        subFamiCod: formValue.tipoDocumento,
        serieCod: formValue.serie,
        folioInicial: parseInt(formValue.folioInicial, 10),
        folioFinal: parseInt(formValue.folioFinal, 10)
      };

      this.generacionService.eliminarDocumentos(eliminarDocumentosDto).subscribe({
        next: (response) => {
          this.loadingEliminar = false;
          // Usar message como título y desErr como mensaje del cuerpo
          const title = response.message || 'Documentos eliminados exitosamente';
          const message = response.desErr || 'Los documentos se han eliminado correctamente';
          this.messageModalService.showSuccess(message, title);
          // Limpiar el formulario después de eliminar exitosamente
          this.generacionForm.reset();
          this.stockMayor = 'No hay datos';
          this.unidCod = '';
          this.tiposDocumento = [];
          this.updateButtonStates();
        },
        error: (error) => {
          this.loadingEliminar = false;
          
          let errorMessage = 'Error al eliminar los documentos. Por favor, intente nuevamente.';
          
          if (error.status === 400) {
            // Verificar si hay un código de error específico
            if (error.error?.codErr === 1) {
              errorMessage = error.error.desErr;
            } else if (error.error?.desErr) {
              errorMessage = error.error.desErr;
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Datos inválidos. Por favor, verifique la información ingresada.';
            }
          } else if (error.status === 500) {
            errorMessage = error.error?.desErr || error.error?.message || 'Error del servidor. Por favor, contacte al administrador.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.desErr) {
            errorMessage = error.error.desErr;
          }
          
          this.messageModalService.showError(errorMessage);
        }
      });
    }
  }

  generar(): void {
    if (this.generacionForm.valid) {
      this.loadingGenerar = true;
      
      const formValue = this.generacionForm.value;
      
      // Construir el DTO para generar documentos
      const generarDocumentosDto = {
        emprCod: formValue.empresa,
        unidCod: this.unidCod,
        subFamiCod: formValue.tipoDocumento,
        serieCod: formValue.serie,
        folioInicial: parseInt(formValue.folioInicial, 10),
        folioFinal: parseInt(formValue.folioFinal, 10)
      };

      this.generacionService.generarDocumentos(generarDocumentosDto).subscribe({
        next: (response) => {
          this.loadingGenerar = false;
          // Usar message como título y desErr como mensaje del cuerpo
          const title = response.message || 'Documentos generados exitosamente';
          const message = response.desErr || 'Los documentos se han generado correctamente';
          this.messageModalService.showSuccess(message, title);
          // Opcional: limpiar el formulario o recargar datos
          // this.generacionForm.reset();
        },
        error: (error) => {
          this.loadingGenerar = false;
          
          let errorMessage = 'Error al generar los documentos. Por favor, intente nuevamente.';
          
          if (error.status === 400) {
            // Verificar si hay un código de error específico
            if (error.error?.codErr === 1) {
              errorMessage = error.error.desErr;
            } 
          } else if (error.status === 500) {
            errorMessage = error.error?.desErr || error.error?.message || 'Error del servidor. Por favor, contacte al administrador.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.desErr) {
            errorMessage = error.error.desErr;
          }
          
          this.messageModalService.showError(errorMessage);
        }
      });
    }
  }

  crearSerie(): void {
    if (this.isCrearSerieValid()) {
      this.loadingCrearSerie = true;
      
      const formValue = this.generacionForm.value;
      
      // Construir el DTO para crear la serie
      const crearSerieDto = {
        emprCod: formValue.empresa,
        serieCod: formValue.serie,
        subFamiCod: formValue.tipoDocumento
      };

      this.generacionService.crearSerie(crearSerieDto).subscribe({
        next: (response) => {
          this.loadingCrearSerie = false;
          this.messageModalService.showSuccess('Serie creada exitosamente');
          // Opcional: limpiar el formulario o recargar datos
          // this.generacionForm.reset();
        },
        error: (error) => {
          this.loadingCrearSerie = false;
          
          let errorMessage = 'Error al crear la serie. Por favor, intente nuevamente.';
          
          if (error.status === 400) {
            // Verificar si hay un código de error específico
            if (error.error?.codErr === 1) {
              errorMessage = 'La serie ya existe. Por favor, ingrese una serie diferente.';
            } else if (error.error?.desErr) {
              errorMessage = error.error.desErr;
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Datos inválidos. Por favor, verifique la información ingresada.';
            }
          } else if (error.status === 500) {
            errorMessage = error.error?.desErr || error.error?.message || 'Error del servidor. Por favor, contacte al administrador.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.desErr) {
            errorMessage = error.error.desErr;
          }
          
          this.messageModalService.showError(errorMessage);
        }
      });
    }
  }
}
