import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.dev';

export interface EmpresaDto {
  EMPR_COD: string;
  EMPR_DESC: string;
}

export interface ParametroDto {
  valor: string;
  codErr: number;
  desErr: string;
}

export interface UnidadDto {
  EMPR_COD: string;
  UNID_COD: string;
  UNID_TIPO: string;
  UNID_TIPO_DESC: string;
  UNID_DESC: string;
  UNID_ESTA_COD: string;
  UNID_ESTA_DESC: string;
}

export interface TipoDocumentoDto {
  SUB_FAMI_COD: string;
  EMPR_COD: string;
  UNID_COD: string;
  SUB_FAMI_DESC: string;
  FAMI_LARGO_SERIE: number;
}

export interface CrearSerieRequestDto {
  emprCod: string;
  serieCod: string;
  subFamiCod: string;
}

export interface CrearSerieResponseDto {
  [key: string]: any;
}

export interface GenerarDocumentosRequestDto {
  emprCod: string;
  unidCod: string;
  subFamiCod: string;
  serieCod: string;
  folioInicial: number;
  folioFinal: number;
}

export interface GenerarDocumentosResponseDto {
  [key: string]: any;
}

export interface EliminarDocumentosRequestDto {
  emprCod: string;
  unidCod: string;
  subFamiCod: string;
  serieCod: string;
  folioInicial: number;
  folioFinal: number;
}

export interface EliminarDocumentosResponseDto {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class GeneracionService {

  constructor(private http: HttpClient) { }

  getEmprUser(sistCod: string, apliCod: string): Observable<EmpresaDto[]> {
    // Construir la URL concatenando las constantes del environment
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_get_empresas_user}`;
    
    // Crear los parámetros de consulta
    const params = new HttpParams()
      .set('sistCod', sistCod)
      .set('apliCod', apliCod);

    return this.http.get<EmpresaDto[]>(url, { params });
  }

  getParametros(nomParametro: string): Observable<ParametroDto> {
    // Construir la URL concatenando las constantes del environment
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_get_parametros}/${nomParametro}`;

    return this.http.get<ParametroDto>(url);
  }

  getLstUnidades(
    emprCod: string,
    unidTipo?: string,
    filtroUas?: string,
    unidEstaCod?: string,
    count?: number,
    offset?: number,
    numReg?: number,
    ordBy?: string
  ): Observable<UnidadDto[]> {
    // Construir la URL concatenando las constantes del environment
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_get_lst_unidades}`;

    // Crear los parámetros de consulta
    let params = new HttpParams().set('emprCod', emprCod);

    if (unidTipo) {
      params = params.set('unidTipo', unidTipo);
    }
    if (filtroUas) {
      params = params.set('filtroUas', filtroUas);
    }
    if (unidEstaCod) {
      params = params.set('unidEstaCod', unidEstaCod);
    }
    if (count !== undefined && count !== null) {
      params = params.set('count', count.toString());
    }
    if (offset !== undefined && offset !== null) {
      params = params.set('offset', offset.toString());
    }
    if (numReg !== undefined && numReg !== null) {
      params = params.set('numReg', numReg.toString());
    }
    if (ordBy) {
      params = params.set('ordBy', ordBy);
    }

    return this.http.get<UnidadDto[]>(url, { params });
  }

  getTiposDocumentos(emprCod: string, unidCod: string): Observable<TipoDocumentoDto[]> {
    // Construir la URL concatenando las constantes del environment
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_get_tipo_documento}`;

    // Crear los parámetros de consulta
    const params = new HttpParams()
      .set('emprCod', emprCod)
      .set('unidCod', unidCod);

    return this.http.get<TipoDocumentoDto[]>(url, { params });
  }

  crearSerie(crearSerieDto: CrearSerieRequestDto): Observable<CrearSerieResponseDto> {
    // Construir la URL concatenando las constantes del environment
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_crear_serie}`;

    return this.http.post<CrearSerieResponseDto>(url, crearSerieDto);
  }

  generarDocumentos(generarDocumentosDto: GenerarDocumentosRequestDto): Observable<GenerarDocumentosResponseDto> {
    // Construir la URL concatenando las constantes del environment
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_generar_documentos}`;

    return this.http.post<GenerarDocumentosResponseDto>(url, generarDocumentosDto);
  }

  eliminarDocumentos(eliminarDocumentosDto: EliminarDocumentosRequestDto): Observable<EliminarDocumentosResponseDto> {
    // Construir la URL concatenando las constantes del environment
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_eliminar_documentos}`;

    return this.http.post<EliminarDocumentosResponseDto>(url, eliminarDocumentosDto);
  }
}

