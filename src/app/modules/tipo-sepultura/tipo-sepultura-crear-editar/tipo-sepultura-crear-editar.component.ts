import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TipoSepulturaService } from '../tipo-sepultura.service';
import { MessageModalService } from '../../../shared/modals/message-modal.service';
import { Estado, TipoSepultura, UnidadNegocio } from '../tipo-sepultura.interfaces';
import { CommonService } from 'src/app/shared/service/common.service';
import { 
  DOMINIO_ESTADOS_COD, 
  DOMINIO_CARACTERISTICAS_SEPULTURA, 
  DOMINIO_SI_NO, 
  DOMINIO_TEMPORALIDAD, 
  DOMINIO_TIPO_LAPIDA,
  PARAMETRO_SI 
} from '../../../utils/constants';

@Component({
  selector: 'app-tipo-sepultura-crear-editar',
  templateUrl: './tipo-sepultura-crear-editar.component.html'
})
export class TipoSepulturaCrearEditarComponent implements OnInit {
  tipoSepulturaForm: FormGroup;
  isEditMode: boolean = false;
  isRegularizarMode: boolean = false;
  tipoSepulturaId: string | null = null;
  // Tipo de sepultura recibida desde el estado del router
  tipoSepulturaFromState: TipoSepultura | null = null; 
  // Versión del tipo de sepultura para actualizaciones
  tipoSepulturaVersion: number | null = null;
  // Control de readonly en modo regularizar
  readOnly: boolean = true;

  // Opciones para los dropdowns
  parques: UnidadNegocio[] = [];
  estados: Estado[] = [];
  caracteristicas: Estado[] = [];
  comunitarias: Estado[] = [];
  opcionesTercios: Estado[] = [];
  opcionesNumeroTercios: string[] = ['1', '2'];
  opcionesTemporalidad: Estado[] = [];
  tipoLapidas: Estado[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tipoSepulturaService: TipoSepulturaService,
    private commonService: CommonService,
    private messageModalService: MessageModalService
  ) {
    this.tipoSepulturaForm = this.fb.group({
      parque: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      descripcionLarga: ['', [Validators.required]],
      caracteristica: ['', [Validators.required]],
      compartimentos: ['', [Validators.required]],
      reducciones: ['', [Validators.required]],
      capacidadFinal: ['', [Validators.required]],
      comunitaria: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      tercios: ['', [Validators.required]],
      numeroTercios: ['1'],
      temporalidad: ['', [Validators.required]],
      tipoLapida: ['', [Validators.required]],
      nivelTotal: ['', [Validators.required]],
      numeroOsario: ['', [Validators.required]],
      aceptaCuerpoEntero: ['', [Validators.required]],
      aceptaCofre: ['', [Validators.required]],
      largo: ['', [Validators.required]],
      ancho: ['', [Validators.required]],
      nivelPropio: ['', [Validators.required]],
      aceptaReduccionExt: ['', [Validators.required]],
      aceptaParvulo: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verificar si estamos en modo regularizar
    const url = this.router.url;
    this.isRegularizarMode = url.includes('/regularizar');
    
    // Verificar si estamos en modo edición
    this.tipoSepulturaId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.tipoSepulturaId || this.isRegularizarMode;

    // Verificar si hay un tipo de sepultura en el estado del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['tipoSepultura']) {
      this.tipoSepulturaFromState = navigation.extras.state['tipoSepultura'] as TipoSepultura;
      this.isEditMode = true;
    } else if (history.state && history.state['tipoSepultura']) {
      this.tipoSepulturaFromState = history.state['tipoSepultura'] as TipoSepultura;
      this.isEditMode = true;
    }

    // Cargar opciones para los dropdowns
    this.loadOptions();
  }

  loadOptions(): void {
    // Cargar todos los dropdowns en paralelo
    forkJoin({
      parques: this.commonService.getLstUnegUsuarios('VTA', 'VtaMantTpoSepul'),
      estados: this.tipoSepulturaService.getLstDominio(DOMINIO_ESTADOS_COD, '2'),
      caracteristicas: this.tipoSepulturaService.getLstDominio(DOMINIO_CARACTERISTICAS_SEPULTURA, '2'),
      comunitarias: this.tipoSepulturaService.getLstDominio(DOMINIO_SI_NO, '2'),
      tercios: this.tipoSepulturaService.getLstDominio(DOMINIO_SI_NO, '2'),
      temporalidades: this.tipoSepulturaService.getLstDominio(DOMINIO_TEMPORALIDAD, '2'),
      tipoLapidas: this.tipoSepulturaService.getLstDominio(DOMINIO_TIPO_LAPIDA, '2')
    }).subscribe({
      next: (responses) => {
        // Mapear parques
        if (responses.parques?.rows && Array.isArray(responses.parques.rows)) {
          this.parques = responses.parques.rows;
        }

        // Mapear estados
        if (responses.estados?.rows && Array.isArray(responses.estados.rows)) {
          this.estados = responses.estados.rows.map((row: any) => ({
            codigo: row.REF_LOW_VAL,
            descripcion: row.REF_MNG
          }));
        }

        // Mapear características
        if (responses.caracteristicas?.rows && Array.isArray(responses.caracteristicas.rows)) {
          this.caracteristicas = responses.caracteristicas.rows.map((row: any) => ({
            codigo: row.REF_LOW_VAL,
            descripcion: row.REF_MNG
          }));
        }

        // Mapear comunitarias
        if (responses.comunitarias?.rows && Array.isArray(responses.comunitarias.rows)) {
          this.comunitarias = responses.comunitarias.rows.map((row: any) => ({
            codigo: row.REF_LOW_VAL,
            descripcion: row.REF_MNG
          }));
        }

        // Mapear tercios
        if (responses.tercios?.rows && Array.isArray(responses.tercios.rows)) {
          this.opcionesTercios = responses.tercios.rows.map((row: any) => ({
            codigo: row.REF_LOW_VAL,
            descripcion: row.REF_MNG
          }));
        }

        // Mapear temporalidades
        if (responses.temporalidades?.rows && Array.isArray(responses.temporalidades.rows)) {
          this.opcionesTemporalidad = responses.temporalidades.rows.map((row: any) => ({
            codigo: row.REF_LOW_VAL,
            descripcion: row.REF_MNG
          }));
        }

        // Mapear tipo lápida
        if (responses.tipoLapidas?.rows && Array.isArray(responses.tipoLapidas.rows)) {
          this.tipoLapidas = responses.tipoLapidas.rows.map((row: any) => ({
            codigo: row.REF_LOW_VAL,
            descripcion: row.REF_MNG
          }));
        }

        // Una vez que los listados están cargados, cargar los datos del tipo de sepultura
        if (this.tipoSepulturaFromState) {
          if (this.isRegularizarMode) {
            this.validaTipoSepultura();
          } else {
            this.loadTipoSepulturaFromState();
          }
        } else if (this.isEditMode && this.tipoSepulturaId) {
          this.loadTipoSepulturaData();
        }
        
        // Deshabilitar el campo código si está en modo edición
        if (this.isEditMode || this.tipoSepulturaFromState) {
          this.tipoSepulturaForm.get('codigo')?.disable();
        }

        // Suscribirse a cambios en el campo tercios
        this.tipoSepulturaForm.get('tercios')?.valueChanges.subscribe(() => {
          this.onTerciosChange();
        });
      },
      error: (error) => {
        console.error('Error al cargar opciones:', error);
        this.messageModalService.showError('Error al cargar las opciones del formulario. Por favor, intente nuevamente.');
      }
    });
  }

  validaTipoSepultura(): void {
    if (this.tipoSepulturaFromState?.codigo) {
      this.tipoSepulturaService.validaTipoSepulturaModif(this.tipoSepulturaFromState.codigo).subscribe({
        next: (response: any) => {
          // Si la validación retorna "SI", se puede modificar (readOnly = false)
          // Si retorna "NO", todos los campos quedan readonly (readOnly = true)
          // La respuesta puede venir como string directo o en un objeto
          const resultado = response?.result || response?.valor || response;
          if (resultado === PARAMETRO_SI || resultado === 'SI' || resultado === 'S') {
            this.readOnly = false;
          } else {
            this.readOnly = true;
          }
          // Cargar los datos después de la validación
          this.loadTipoSepulturaFromState();
        },
        error: (error) => {
          console.error('Error al validar tipo de sepultura:', error);
          // Por defecto, mantener readonly
          this.readOnly = true;
          this.loadTipoSepulturaFromState();
        }
      });
    } else {
      this.loadTipoSepulturaFromState();
    }
  }

  loadTipoSepulturaData(): void {
    // Implementar carga de datos si es necesario
    // Por ahora, dejar vacío
  }

  loadTipoSepulturaFromState(): void {
    // Cargar los datos del tipo de sepultura recibida desde el estado del router
    if (this.tipoSepulturaFromState) {
      this.tipoSepulturaForm.patchValue({
        parque: this.tipoSepulturaFromState.emprCod || '',
        codigo: this.tipoSepulturaFromState.codigo,
        descripcion: this.tipoSepulturaFromState.descripcionCorta || this.tipoSepulturaFromState.descripcion || '',
        descripcionLarga: this.tipoSepulturaFromState.descripcionLarga || this.tipoSepulturaFromState.descripcion || '',
        caracteristica: this.tipoSepulturaFromState.caracteristica || '',
        compartimentos: this.tipoSepulturaFromState.compartimentos || '',
        reducciones: this.tipoSepulturaFromState.reducciones || '',
        capacidadFinal: this.tipoSepulturaFromState.capacidadFinal || '',
        comunitaria: this.tipoSepulturaFromState.comunitaria || '',
        estado: this.tipoSepulturaFromState.estado?.codigo || '',
        tercios: this.tipoSepulturaFromState.tercios || '',
        numeroTercios: this.tipoSepulturaFromState.numeroTercios?.toString() || '1',
        temporalidad: this.tipoSepulturaFromState.temporalidad || '',
        tipoLapida: this.tipoSepulturaFromState.tipoLapida || '',
        nivelTotal: this.tipoSepulturaFromState.nivelTotal || '',
        numeroOsario: this.tipoSepulturaFromState.numeroOsario || '',
        aceptaCuerpoEntero: this.tipoSepulturaFromState.aceptaCuerpoEntero || '',
        aceptaCofre: this.tipoSepulturaFromState.aceptaCofre || '',
        largo: this.tipoSepulturaFromState.largo || '',
        ancho: this.tipoSepulturaFromState.ancho || '',
        nivelPropio: this.tipoSepulturaFromState.nivelPropio || '',
        aceptaReduccionExt: this.tipoSepulturaFromState.aceptaReduccionExt || '',
        aceptaParvulo: this.tipoSepulturaFromState.aceptaParvulo || ''
      });
      // Guardar la versión del tipo de sepultura para actualizaciones
      this.tipoSepulturaVersion = this.tipoSepulturaFromState.version || 1;
      
      // Aplicar readonly según el modo
      this.applyReadOnlyFields();
      
      // Ejecutar lógica de tercios después de cargar los datos
      setTimeout(() => {
        this.onTerciosChange();
      }, 0);
    }
  }

  applyReadOnlyFields(): void {
    if (this.isRegularizarMode) {
      // En modo regularizar, aplicar readonly según la validación
      const readonlyFields = [
        'codigo', 'caracteristica', 'compartimentos', 'reducciones', 
        'capacidadFinal', 'comunitaria', 'tercios', 'largo', 'ancho', 
        'nivelPropio', 'aceptaReduccionExt', 'aceptaParvulo', 'numeroTercios', 
        'tipoLapida', 'nivelTotal', 'numeroOsario', 'aceptaCuerpoEntero', 
        'aceptaCofre', 'parque', 'temporalidad'
      ];
      
      readonlyFields.forEach(field => {
        // Si readOnly = true, todos los campos son readonly
        // Si readOnly = false, solo los campos que NO son estado, descripcion o descripcionLarga son readonly
        if (this.readOnly || !['estado', 'descripcion', 'descripcionLarga'].includes(field)) {
          this.tipoSepulturaForm.get(field)?.disable();
        } else {
          // Habilitar los campos editables si readOnly = false
          this.tipoSepulturaForm.get(field)?.enable();
        }
      });
    }
  }

  isFieldReadonly(fieldName: string): boolean {
    if (!this.isRegularizarMode) {
      return false; // En modo crear, todos los campos son editables
    }
    
    // En modo regularizar
    if (this.readOnly) {
      return true; // Todos los campos son readonly
    }
    
    // Si readOnly = false, solo Estado, Descripción y Descripción Larga son editables
    const editableFields = ['estado', 'descripcion', 'descripcionLarga'];
    return !editableFields.includes(fieldName);
  }

  onTerciosChange(): void {
    const terciosValue = this.tipoSepulturaForm.get('tercios')?.value;
    const numeroTerciosControl = this.tipoSepulturaForm.get('numeroTercios');
    
    // Solo aplicar cambios si no está en modo readonly
    if (this.isFieldReadonly('numeroTercios')) {
      return;
    }
    
    if (terciosValue === 'NO' || terciosValue === 'N') {
      numeroTerciosControl?.setValue('1');
      numeroTerciosControl?.disable();
    } else if (terciosValue === 'SI' || terciosValue === 'S') {
      numeroTerciosControl?.enable();
    }
  }

  calcularCapacidadFinal(): void {
    const compartimentos = this.tipoSepulturaForm.get('compartimentos')?.value;
    const reducciones = this.tipoSepulturaForm.get('reducciones')?.value;
    
    if (!compartimentos || compartimentos === '' || !reducciones || reducciones === '') {
      this.messageModalService.showError('Debe ingresar Compartimentos y Reducciones.');
      return;
    }
    
    this.tipoSepulturaService.calcularCapacidadFinal(
      Number(compartimentos), 
      Number(reducciones)
    ).subscribe({
      next: (response: any) => {
        if (response && response.capacidad !== undefined) {
          this.tipoSepulturaForm.patchValue({
            capacidadFinal: response.capacidad
          });
        } else if (response && response.result !== undefined) {
          this.tipoSepulturaForm.patchValue({
            capacidadFinal: response.result
          });
        } else {
          // Si no viene en la respuesta, calcular como suma (fallback)
          const capacidad = Number(compartimentos) + Number(reducciones);
          this.tipoSepulturaForm.patchValue({
            capacidadFinal: capacidad
          });
        }
      },
      error: (error) => {
        console.error('Error al calcular capacidad:', error);
        // Fallback: calcular como suma
        const capacidad = Number(compartimentos) + Number(reducciones);
        this.tipoSepulturaForm.patchValue({
          capacidadFinal: capacidad
        });
      }
    });
  }

  onSubmit(): void {
    if (this.tipoSepulturaForm.valid) {
      const formValue = this.tipoSepulturaForm.getRawValue(); // getRawValue para incluir campos disabled
      
      // Construir el objeto tipo de sepultura según la estructura esperada por el backend
      const tipoSepulturaData = {
        P_TIPO_OPER: (!this.isEditMode && !this.tipoSepulturaFromState) ? 'I' : 'U',
        P_SEPU_COD: formValue.codigo?.toUpperCase() || '',
        P_SEPU_DESC_CRTA: formValue.descripcion || '',
        P_SEPU_DESC_LRGA: formValue.descripcionLarga || '',
        P_SEPU_CRAC: formValue.caracteristica || '',
        P_SEPU_NUM_CPTOS: formValue.compartimentos || 0,
        P_SEPU_NUM_REDU: formValue.reducciones || 0,
        P_SEPU_NUM_CAP: formValue.capacidadFinal || 0,
        P_SEPU_INDI_COMU: formValue.comunitaria || '',
        P_SEPU_ESTA_COD: formValue.estado || '',
        P_SEPU_IND_TERCIOS: formValue.tercios || '',
        P_SEPU_NUM_TERCIOS: formValue.numeroTercios || 1,
        P_SEPU_TEMP: formValue.temporalidad || '',
        P_SEPU_LARGO: formValue.largo || 0,
        P_SEPU_ANCHO: formValue.ancho || 0,
        P_SEPU_LPDA_TIPO: formValue.tipoLapida || '',
        P_SEPU_NIVEL_TOTAL: formValue.nivelTotal || 0,
        P_SEPU_NIVEL_PROPIO: formValue.nivelPropio || 0,
        P_SEPU_OSARIO_NUM: formValue.numeroOsario || 0,
        P_SEPU_TASA_CUERPO_ENT: formValue.aceptaCuerpoEntero || 0,
        P_SEPU_TASA_REDUCCION: formValue.aceptaReduccionExt || 0,
        P_SEPU_TASA_COFRE: formValue.aceptaCofre || 0,
        P_SEPU_TASA_PARVULO: formValue.aceptaParvulo || 0,
        P_EMPR_COD: formValue.parque || ''
      };

      // Determinar si es creación o actualización
      const isCreacion = !this.isEditMode && !this.tipoSepulturaFromState;

      if (isCreacion) {
        // Insertar nuevo tipo de sepultura
        this.tipoSepulturaService.insertarTipoSepultura(tipoSepulturaData).subscribe({
          next: (response) => {
            this.messageModalService.showSuccess(
              `Se ha creado un nuevo Tipo de Sepultura con código ${tipoSepulturaData.P_SEPU_COD}`
            );
            // Redirigir a la lista después de guardar
            setTimeout(() => {
              this.volver();
            }, 1500);
          },
          error: (error) => {
            console.error('Error al crear tipo de sepultura:', error);
            this.messageModalService.showError(
              'Error al crear el tipo de sepultura. Por favor, intente nuevamente.'
            );
          }
        });
      } else {
        // Actualizar tipo de sepultura existente
        this.tipoSepulturaService.actualizarTipoSepultura(tipoSepulturaData).subscribe({
          next: (response) => {
            this.messageModalService.showSuccess(
              `Se ha modificado el Tipo de Sepultura con código ${tipoSepulturaData.P_SEPU_COD}`
            );
            // Redirigir a la lista después de guardar
            setTimeout(() => {
              this.volver();
            }, 1500);
          },
          error: (error) => {
            console.error('Error al actualizar tipo de sepultura:', error);
            this.messageModalService.showError(
              'Error al actualizar el tipo de sepultura. Por favor, intente nuevamente.'
            );
          }
        });
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.tipoSepulturaForm.controls).forEach(key => {
        this.tipoSepulturaForm.get(key)?.markAsTouched();
      });
      this.messageModalService.showError('Por favor, complete todos los campos requeridos');
    }
  }

  volver(): void {
    this.router.navigate(['/tipo-sepultura']);
  }

  // Getters para acceso fácil a los controles del formulario
  get parque() { return this.tipoSepulturaForm.get('parque'); }
  get codigo() { return this.tipoSepulturaForm.get('codigo'); }
  get descripcion() { return this.tipoSepulturaForm.get('descripcion'); }
  get descripcionLarga() { return this.tipoSepulturaForm.get('descripcionLarga'); }
  get caracteristica() { return this.tipoSepulturaForm.get('caracteristica'); }
  get compartimentos() { return this.tipoSepulturaForm.get('compartimentos'); }
  get reducciones() { return this.tipoSepulturaForm.get('reducciones'); }
  get capacidadFinal() { return this.tipoSepulturaForm.get('capacidadFinal'); }
  get comunitaria() { return this.tipoSepulturaForm.get('comunitaria'); }
  get estado() { return this.tipoSepulturaForm.get('estado'); }
  get tercios() { return this.tipoSepulturaForm.get('tercios'); }
  get numeroTercios() { return this.tipoSepulturaForm.get('numeroTercios'); }
  get temporalidad() { return this.tipoSepulturaForm.get('temporalidad'); }
  get tipoLapida() { return this.tipoSepulturaForm.get('tipoLapida'); }
  get nivelTotal() { return this.tipoSepulturaForm.get('nivelTotal'); }
  get numeroOsario() { return this.tipoSepulturaForm.get('numeroOsario'); }
  get aceptaCuerpoEntero() { return this.tipoSepulturaForm.get('aceptaCuerpoEntero'); }
  get aceptaCofre() { return this.tipoSepulturaForm.get('aceptaCofre'); }
  get largo() { return this.tipoSepulturaForm.get('largo'); }
  get ancho() { return this.tipoSepulturaForm.get('ancho'); }
  get nivelPropio() { return this.tipoSepulturaForm.get('nivelPropio'); }
  get aceptaReduccionExt() { return this.tipoSepulturaForm.get('aceptaReduccionExt'); }
  get aceptaParvulo() { return this.tipoSepulturaForm.get('aceptaParvulo'); }
}
