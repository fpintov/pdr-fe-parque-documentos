import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdmFuentesService } from '../adm-fuentes.service';
import { MessageModalService } from '../../../shared/modals/message-modal.service';
import { CategoriaGrupoEstado, Fuente } from '../adm-fuentes.interfaces';
import { DOMINIO_FUENTE_CATEGORIA, DOMINIO_GRUPO_FUENTE, DOMINIO_ESTADOS_COD } from '../../../utils/constants';

@Component({
  selector: 'app-adm-fuentes-crear-editar',
  templateUrl: './adm-fuentes-crear-editar.component.html'
})
export class AdmFuentesCrearEditarComponent implements OnInit {
  fuenteForm: FormGroup;
  isEditMode: boolean = false;
  fuenteId: string | null = null;
  // Fuente recibida desde el estado del router
  fuenteFromState: Fuente | null = null; 
  // Versión de la fuente para actualizaciones
  fuenteVersion: number | null = null;

  // Opciones para los dropdowns
  grupos: CategoriaGrupoEstado[] = [];
  categorias: CategoriaGrupoEstado[] = [];
  estados: CategoriaGrupoEstado[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private admFuentesService: AdmFuentesService,
    private messageModalService: MessageModalService
  ) {
    this.fuenteForm = this.fb.group({
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      grupo: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      estado: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    this.fuenteId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.fuenteId;

    // Verificar si hay una fuente en el estado del router (viene de "Regularizar")
    // Primero intentar desde getCurrentNavigation (durante la navegación)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['fuente']) {
      this.fuenteFromState = navigation.extras.state['fuente'] as Fuente;
      this.isEditMode = true; // Tratarlo como modo edición para cargar los datos
    } else if (history.state && history.state['fuente']) {
      // Si no está en getCurrentNavigation, intentar desde history.state
      this.fuenteFromState = history.state['fuente'] as Fuente;
      this.isEditMode = true;
    }

    // Cargar opciones para los dropdowns (siempre, tanto para crear como editar)
    this.loadOptions();
  }

  loadOptions(): void {
    // Cargar categorías, grupos y estados desde el servicio
    // Estos deben estar disponibles tanto al crear como al editar
    // Usar forkJoin para esperar a que todos se carguen antes de cargar datos de la fuente en modo edición
    forkJoin({
      categorias: this.admFuentesService.getLstDominio(DOMINIO_FUENTE_CATEGORIA, '2'),
      grupos: this.admFuentesService.getLstDominio(DOMINIO_GRUPO_FUENTE, '2'),
      estados: this.admFuentesService.getLstDominio(DOMINIO_ESTADOS_COD, '2')
    }).subscribe({
      next: (responses: any) => {
        // Mapear categorías
        if (responses.categorias && responses.categorias.rows && Array.isArray(responses.categorias.rows)) {
          this.categorias = responses.categorias.rows.map((row: any) => ({
            codigo: row.REF_LOW_VAL,
            descripcion: row.REF_MNG
          }));
        }

        // Mapear grupos
        if (responses.grupos && responses.grupos.rows && Array.isArray(responses.grupos.rows)) {
          this.grupos = responses.grupos.rows.map((row: any) => ({
            codigo: row.REF_LOW_VAL,
            descripcion: row.REF_MNG
          }));
        }

        // Mapear estados
        if (responses.estados && responses.estados.rows && Array.isArray(responses.estados.rows)) {
          this.estados = responses.estados.rows.map((row: any) => ({
            codigo: row.REF_LOW_VAL,
            descripcion: row.REF_MNG
          }));
        }

        // Una vez que todos los listados están cargados, cargar los datos de la fuente
        if (this.fuenteFromState) {
          // Cargar datos desde el estado del router (viene de "Regularizar")
          this.loadFuenteFromState();
        } else if (this.isEditMode && this.fuenteId) {
          // Cargar datos desde el backend usando el ID
          this.loadFuenteData();
        }
      },
      error: (error) => {
        console.error('Error al cargar opciones:', error);
        this.messageModalService.showError('Error al cargar las opciones del formulario. Por favor, intente nuevamente.');
      }
    });
  }



  loadFuenteData(): void {
    // Implementar carga de datos si es necesario
    // Por ahora, dejar vacío
  }

  loadFuenteFromState(): void {
    // Cargar los datos de la fuente recibida desde el estado del router
    if (this.fuenteFromState) {
      this.fuenteForm.patchValue({
        codigo: this.fuenteFromState.codigo,
        descripcion: this.fuenteFromState.descripcion,
        grupo: this.fuenteFromState.grupo.codigo,
        categoria: this.fuenteFromState.categoria.codigo,
        estado: this.fuenteFromState.estado.codigo
      });
      // Guardar la versión de la fuente para actualizaciones
      this.fuenteVersion = this.fuenteFromState.version || 1;
    }
  }

  onSubmit(): void {
    if (this.fuenteForm.valid) {
      const formValue = this.fuenteForm.value;
      
      // Construir el objeto fuente según la estructura esperada por el backend
      const fuenteData = {
        codigo: formValue.codigo,
        descripcion: formValue.descripcion,
        categoria: {
          codigo: formValue.categoria
        },
        grupo: {
          codigo: formValue.grupo
        },
        estado: {
          codigo: formValue.estado
        },
        version: this.isEditMode || this.fuenteFromState 
          ? (this.fuenteVersion || 1) 
          : 1
      };

      // Determinar si es creación o actualización
      const isCreacion = !this.isEditMode && !this.fuenteFromState;

      if (isCreacion) {
        // Insertar nueva fuente
        this.admFuentesService.insertarFuente(fuenteData).subscribe({
          next: (response) => {
            this.messageModalService.showSuccess(
              `Se ha creado un nuevo Tipo de Fuente con código ${fuenteData.codigo}`
            );
            // Redirigir a la lista después de guardar
            setTimeout(() => {
              this.volver();
            }, 1500);
          },
          error: (error) => {
            console.error('Error al crear fuente:', error);
            this.messageModalService.showError(
              'Error al crear la fuente. Por favor, intente nuevamente.'
            );
          }
        });
      } else {
        // Actualizar fuente existente
        this.admFuentesService.actualizarFuente(fuenteData).subscribe({
          next: (response) => {
            this.messageModalService.showSuccess(
              `Se ha modificado el Tipo de Fuente con código ${fuenteData.codigo}`
            );
            // Redirigir a la lista después de guardar
            setTimeout(() => {
              this.volver();
            }, 1500);
          },
          error: (error) => {
            console.error('Error al actualizar fuente:', error);
            this.messageModalService.showError(
              'Error al actualizar la fuente. Por favor, intente nuevamente.'
            );
          }
        });
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.fuenteForm.controls).forEach(key => {
        this.fuenteForm.get(key)?.markAsTouched();
      });
      this.messageModalService.showError('Por favor, complete todos los campos requeridos');
    }
  }

  volver(): void {
    this.router.navigate(['/adm-fuentes']);
  }

  get codigo() { return this.fuenteForm.get('codigo'); }
  get descripcion() { return this.fuenteForm.get('descripcion'); }
  get grupo() { return this.fuenteForm.get('grupo'); }
  get categoria() { return this.fuenteForm.get('categoria'); }
  get estado() { return this.fuenteForm.get('estado'); }
}

