import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdmFuentesService } from '../adm-fuentes.service';
import { MessageModalService } from '../../../shared/modals/message-modal.service';
import { CategoriaGrupoEstado, Fuente } from '../adm-fuentes.interfaces';

@Component({
  selector: 'app-adm-fuentes-main',
  templateUrl: './adm-fuentes-main.component.html'
})
export class AdmFuentesMainComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'descripcion', 'categoria', 'grupo', 'estado'];
  
  // Datos completos
  allFuentes: Fuente[] = [];
  
  // Datos filtrados y paginados
  filteredFuentes: Fuente[] = [];
  paginatedFuentes: Fuente[] = [];
  
  // Filtros
  filtroCodigo: string = '';
  filtroDescripcion: string = '';
  filtroCategoria: string = '';
  filtroGrupo: string = '';
  filtroEstado: string = '';
  
  // Opciones para filtros
  categorias: string[] = [];
  grupos: string[] = [];
  estados: string[] = [];
  
  // Paginación
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;

  // Fila seleccionada
  selectedFuente: Fuente | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private admFuentesService: AdmFuentesService,
    private messageModalService: MessageModalService
  ) { }

  ngOnInit(): void {
    this.loadFuentes();
  }

  loadFuentes(): void {
    this.admFuentesService.getFuentes('').subscribe({
      next: (data: Fuente[]) => {
        this.allFuentes = data;
        // Extraer opciones únicas para filtros
        this.categorias = [...new Set(this.allFuentes.map(f => f.categoria.descripcion))];
        this.grupos = [...new Set(this.allFuentes.map(f => f.grupo.descripcion))];
        this.estados = [...new Set(this.allFuentes.map(f => f.estado.descripcion))];
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar fuentes:', error);
        this.messageModalService.showError('Error al cargar las fuentes. Por favor, intente nuevamente.');
      }
    });
  }

  applyFilters(): void {
    this.filteredFuentes = this.allFuentes.filter(fuente => {
      const matchCodigo = !this.filtroCodigo || fuente.codigo.toLowerCase().includes(this.filtroCodigo.toLowerCase());
      const matchDescripcion = !this.filtroDescripcion || fuente.descripcion.toLowerCase().includes(this.filtroDescripcion.toLowerCase());
      const matchCategoria = !this.filtroCategoria || fuente.categoria.descripcion === this.filtroCategoria;
      const matchGrupo = !this.filtroGrupo || fuente.grupo.descripcion === this.filtroGrupo;
      const matchEstado = !this.filtroEstado || fuente.estado.descripcion === this.filtroEstado;

      return matchCodigo && matchDescripcion && matchCategoria && matchGrupo && matchEstado;
    });

    this.totalItems = this.filteredFuentes.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFuentes = this.filteredFuentes.slice(startIndex, endIndex);
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
    this.selectedFuente = null;
  }

  selectFuente(fuente: Fuente): void {
    this.selectedFuente = this.selectedFuente?.codigo === fuente.codigo ? null : fuente;
  }

  nuevo(): void {
    this.router.navigate(['/adm-fuentes/nuevo']);
  }

  regularizar(): void {
    if (this.selectedFuente) {
      // Navegar al componente de crear/editar pasando los datos de la fuente seleccionada
      this.router.navigate(['/adm-fuentes/regularizar'], {
        state: { fuente: this.selectedFuente }
      });
    }
  }
}

