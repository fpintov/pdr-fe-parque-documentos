export interface Estado {
  codigo: string;
  descripcion: string;
}

export interface TipoSepultura {
  codigo: string; // SEPU_COD
  descripcion?: string;
  descripcionCorta?: string; // SEPU_DESC_CRTA
  descripcionLarga?: string; // SEPU_DESC_LRGA
  caracteristica?: string; // SEPU_CRAC
  caracteristicaDesc?: string; // SEPU_CRAC_DESC
  compartimentos?: number; // SEPU_NUM_CPTOS
  reducciones?: number; // SEPU_NUM_REDU
  capacidadFinal?: number; // SEPU_NUM_CAP
  comunitaria?: string; // SEPU_INDI_COMU
  estado: Estado; // SEPU_ESTA_COD, SEPU_ESTA_DESC
  tercios?: string; // SEPU_IND_TERCIOS (SI/NO)
  numeroTercios?: number; // SEPU_NUM_TERCIOS
  nivelTotal?: number; // SEPU_NIVEL_TOTAL
  nivelPropio?: number; // SEPU_NIVEL_PROPIO
  version?: number; // VERSION
  emprCod?: string; // EMPR_COD
  temporalidad?: string; // SEPU_TEMP (PERPETUO/TEMPORAL)
  tipoLapida?: string; // SEPU_LPDA_TIPO
  largo?: number; // SEPU_LARGO
  ancho?: number; // SEPU_ANCHO
  numeroOsario?: number; // SEPU_OSARIO_NUM
  aceptaCuerpoEntero?: number; // SEPU_TASA_CUERPO_ENT
  aceptaCofre?: number; // SEPU_TASA_COFRE
  aceptaReduccionExt?: number; // SEPU_TASA_REDUCCION
  aceptaParvulo?: number; // SEPU_TASA_PARVULO
}

export interface UnidadNegocio {
  EMPR_COD?: string;
  UNEG_COD?: string;
  UNEG_EMPR_DESC?: string;
  UNEG_EMPR_DESC_LARGA?: string;
}

