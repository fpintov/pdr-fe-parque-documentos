export interface CategoriaGrupoEstado {
  codigo: string;
  descripcion: string;
}

export interface Fuente {
  codigo: string;
  descripcion: string;
  descripcionLarga?: string;
  categoria: CategoriaGrupoEstado;
  grupo: CategoriaGrupoEstado;
  estado: CategoriaGrupoEstado;
  indicadorTarjeta?: boolean;
  version?: number;
}

