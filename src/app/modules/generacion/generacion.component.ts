import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneracionService, EmpresaDto, UnidadDto, TipoDocumentoDto } from './generacion.service';
import { SISTEMA_DOCUMENTO, APLICACION_GENERACION_DOCUMENTOS, PARAMETRO_DOC_UNID_TIPO_MAYOR } from '../../utils/constants';

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

  constructor(
    private fb: FormBuilder,
    private generacionService: GeneracionService
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
              const unidCod = unidades[0].UNID_COD;
              
              // Cargar el tipo de documento con el unidCod
              this.generacionService.getTiposDocumentos(emprCod, unidCod).subscribe({ 
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
    this.generacionForm.reset();
    this.updateButtonStates();
  }

  generar(): void {
    if (this.generacionForm.valid) {
      console.log('Generar documento:', this.generacionForm.value);
      // Lógica para generar documento
    }
  }

  crearSerie(): void {
    if (this.generacionForm.valid) {
      console.log('Crear serie:', this.generacionForm.value);
      // Lógica para crear serie
    }
  }
}
