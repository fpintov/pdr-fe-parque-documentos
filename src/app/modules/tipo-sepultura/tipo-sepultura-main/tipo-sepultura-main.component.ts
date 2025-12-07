import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TipoSepulturaService } from '../tipo-sepultura.service';
import { MessageModalService } from '../../../shared/modals/message-modal.service';
import { TipoSepultura, UnidadNegocio } from '../tipo-sepultura.interfaces';
import { CommonService } from 'src/app/shared/service/common.service';

@Component({
  selector: 'app-tipo-sepultura-main',
  templateUrl: './tipo-sepultura-main.component.html'
})
export class TipoSepulturaMainComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'descripcionCorta', 'caracteristica', 'compartimentos', 'reducciones', 'capacidadFinal', 'comunitaria', 'estado', 'tercios', 'numeroTercios', 'nivelTotal', 'nivelPropio'];
  
  // Datos completos
  allTiposSepultura: TipoSepultura[] = [];
  
  // Datos filtrados y paginados
  filteredTiposSepultura: TipoSepultura[] = [];
  paginatedTiposSepultura: TipoSepultura[] = [];
  
  // Filtros
  filtroCodigo: string = '';
  filtroDescripcionCorta: string = '';
  filtroCaracteristica: string = '';
  filtroCompartimentos: string = '';
  filtroReducciones: string = '';
  filtroCapacidadFinal: string = '';
  filtroComunitaria: string = '';
  filtroEstado: string = '';
  filtroTercios: string = '';
  filtroNumeroTercios: string = '';
  filtroNivelTotal: string = '';
  filtroNivelPropio: string = '';
  
  // Parque
  parques: UnidadNegocio[] = [];
  parqueSeleccionado: UnidadNegocio | null = null;
  
  // Opciones para filtros
  estados: string[] = [];
  caracteristicas: string[] = [];
  comunitarias: string[] = ['SI', 'NO'];
  tercios: string[] = [];
  
  // Paginación
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;

  // Fila seleccionada
  selectedTipoSepultura: TipoSepultura | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tipoSepulturaService: TipoSepulturaService,
    private commonService: CommonService,
    private messageModalService: MessageModalService
  ) { }

  ngOnInit(): void {
    this.getLstUnegUsuarios();
  }

  getLstUnegUsuarios(): void {
    this.commonService.getLstUnegUsuarios('VTA', 'VtaMantTpoSepul').subscribe({
      next: (response: any) => {
        // La respuesta tiene la estructura: { rows: [...], P_TOT_REG: number, P_COD_ERR: number, P_DES_ERR: string }
        if (response && response.rows && Array.isArray(response.rows)) {
          if (response.P_COD_ERR === 0) {
            this.parques = response.rows;
          } else {
            console.error('Error en la respuesta del servicio:', response.P_DES_ERR);
            this.messageModalService.showError(response.P_DES_ERR || 'Error al cargar los parques.');
            this.parques = [];
          }
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
          this.parques = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar parques:', error);
        this.messageModalService.showError('Error al cargar los parques. Por favor, intente nuevamente.');
        this.parques = [];
      }
    });
  }

  loadTiposSepultura(pEmprCod?: string, pUnegCod?: string): void {
    this.tipoSepulturaService.getTiposSepultura(pEmprCod, pUnegCod).subscribe({
      next: (response: any) => {
        // La respuesta tiene la estructura: { rows: [...], P_TOT_REG: number, P_COD_ERR: number, P_DES_ERR: string }
        if (response && response.rows && Array.isArray(response.rows)) {
          if (response.P_COD_ERR === 0) {
            // Mapear los datos de la respuesta a la interfaz TipoSepultura
            this.allTiposSepultura = response.rows.map((item: any) => ({
              codigo: item.SEPU_COD || '',
              descripcion: item.SEPU_DESC_LRGA || item.SEPU_DESC_CRTA || '',
              descripcionCorta: item.SEPU_DESC_CRTA,
              descripcionLarga: item.SEPU_DESC_LRGA,
              caracteristica: item.SEPU_CRAC,
              caracteristicaDesc: item.SEPU_CRAC_DESC,
              compartimentos: item.SEPU_NUM_CPTOS,
              reducciones: item.SEPU_NUM_REDU,
              capacidadFinal: item.SEPU_NUM_CAP,
              comunitaria: item.SEPU_INDI_COMU,
              estado: {
                codigo: item.SEPU_ESTA_COD || '',
                descripcion: item.SEPU_ESTA_DESC || ''
              },
              tercios: item.SEPU_IND_TERCIOS,
              numeroTercios: item.SEPU_NUM_TERCIOS,
              nivelTotal: item.SEPU_NIVEL_TOTAL,
              nivelPropio: item.SEPU_NIVEL_PROPIO,
              version: item.VERSION,
              emprCod: item.EMPR_COD
            }));
            // Extraer opciones únicas para filtros
            this.estados = [...new Set(this.allTiposSepultura.map(t => t.estado?.descripcion).filter((d): d is string => Boolean(d)))];
            this.caracteristicas = [...new Set(this.allTiposSepultura.map(t => t.caracteristicaDesc || t.caracteristica).filter((c): c is string => Boolean(c)))];
            this.tercios = [...new Set(this.allTiposSepultura.map(t => t.tercios).filter((t): t is string => Boolean(t)))];
            this.applyFilters();
          } else {
            console.error('Error en la respuesta del servicio:', response.P_DES_ERR);
            this.messageModalService.showError(response.P_DES_ERR || 'Error al cargar los tipos de sepultura.');
            this.allTiposSepultura = [];
            this.applyFilters();
          }
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
          this.allTiposSepultura = [];
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de sepultura:', error);
        this.messageModalService.showError('Error al cargar los tipos de sepultura. Por favor, intente nuevamente.');
        this.allTiposSepultura = [];
        this.applyFilters();
      }
    });
  }

  onParqueChange(): void {
    if (this.parqueSeleccionado) {
      this.loadTiposSepultura(this.parqueSeleccionado.EMPR_COD, this.parqueSeleccionado.UNEG_COD);
    } else {
      // Si se limpia la selección, limpiar también los datos
      this.allTiposSepultura = [];
      this.applyFilters();
    }
  }

  buscar(): void {
    if (this.parqueSeleccionado) {
      this.loadTiposSepultura(this.parqueSeleccionado.EMPR_COD, this.parqueSeleccionado.UNEG_COD);
    } else {
      this.messageModalService.showError('Por favor, seleccione un parque para buscar.');
    }
  }

  limpiar(): void {
    this.parqueSeleccionado = null;
    this.filtroCodigo = '';
    this.filtroDescripcionCorta = '';
    this.filtroCaracteristica = '';
    this.filtroCompartimentos = '';
    this.filtroReducciones = '';
    this.filtroCapacidadFinal = '';
    this.filtroComunitaria = '';
    this.filtroEstado = '';
    this.filtroTercios = '';
    this.filtroNumeroTercios = '';
    this.filtroNivelTotal = '';
    this.filtroNivelPropio = '';
    this.allTiposSepultura = [];
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTiposSepultura = this.allTiposSepultura.filter(tipoSepultura => {
      const matchCodigo = !this.filtroCodigo || tipoSepultura.codigo?.toLowerCase().includes(this.filtroCodigo.toLowerCase());
      const matchDescripcionCorta = !this.filtroDescripcionCorta || (tipoSepultura.descripcionCorta || tipoSepultura.descripcion || '').toLowerCase().includes(this.filtroDescripcionCorta.toLowerCase());
      const matchCaracteristica = !this.filtroCaracteristica || (tipoSepultura.caracteristicaDesc || tipoSepultura.caracteristica || '') === this.filtroCaracteristica;
      const matchCompartimentos = !this.filtroCompartimentos || (tipoSepultura.compartimentos?.toString() || '').includes(this.filtroCompartimentos);
      const matchReducciones = !this.filtroReducciones || (tipoSepultura.reducciones?.toString() || '').includes(this.filtroReducciones);
      const matchCapacidadFinal = !this.filtroCapacidadFinal || (tipoSepultura.capacidadFinal?.toString() || '').includes(this.filtroCapacidadFinal);
      const matchComunitaria = !this.filtroComunitaria || (tipoSepultura.comunitaria || '') === this.filtroComunitaria;
      const matchEstado = !this.filtroEstado || (tipoSepultura.estado?.descripcion || '') === this.filtroEstado;
      const matchTercios = !this.filtroTercios || (tipoSepultura.tercios || '') === this.filtroTercios;
      const matchNumeroTercios = !this.filtroNumeroTercios || (tipoSepultura.numeroTercios?.toString() || '').includes(this.filtroNumeroTercios);
      const matchNivelTotal = !this.filtroNivelTotal || (tipoSepultura.nivelTotal?.toString() || '').includes(this.filtroNivelTotal);
      const matchNivelPropio = !this.filtroNivelPropio || (tipoSepultura.nivelPropio?.toString() || '').includes(this.filtroNivelPropio);

      return matchCodigo && matchDescripcionCorta && matchCaracteristica && matchCompartimentos && 
             matchReducciones && matchCapacidadFinal && matchComunitaria && matchEstado && 
             matchTercios && matchNumeroTercios && matchNivelTotal && matchNivelPropio;
    });

    this.totalItems = this.filteredTiposSepultura.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTiposSepultura = this.filteredTiposSepultura.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  onFirstPage(): void {
    this.onPageChange(1);
  }

  onPreviousPage(): void {
    this.onPageChange(this.currentPage - 1);
  }

  onNextPage(): void {
    this.onPageChange(this.currentPage + 1);
  }

  onLastPage(): void {
    this.onPageChange(this.totalPages);
  }

  onFilterChange(): void {
    this.applyFilters();
    // Limpiar selección al filtrar
    this.selectedTipoSepultura = null;
  }

  selectTipoSepultura(tipoSepultura: TipoSepultura): void {
    this.selectedTipoSepultura = this.selectedTipoSepultura?.codigo === tipoSepultura.codigo ? null : tipoSepultura;
  }

  nuevo(): void {
    this.router.navigate(['/tipo-sepultura/nuevo']);
  }

  regularizar(): void {
    if (this.selectedTipoSepultura) {
      // Navegar al componente de crear/editar pasando los datos del tipo de sepultura seleccionado
      this.router.navigate(['/tipo-sepultura/regularizar'], {
        state: { tipoSepultura: this.selectedTipoSepultura }
      });
    }
  }
}

