import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class TipoSepulturaService {

  constructor(private http: HttpClient) { }
  
  getTiposSepultura(pEmprCod?: string, pUnegCod?: string): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_get_tipos_sepultura}`;
    
    let httpParams = new HttpParams();
    
    if (pEmprCod) {
      httpParams = httpParams.set('pEmprCod', pEmprCod);
    }
    if (pUnegCod) {
      httpParams = httpParams.set('pUnegCod', pUnegCod);
    }
    
    return this.http.get<any[]>(url, { params: httpParams });
  }

  getLstDominio(pRefDom: string, pOrdBy: string): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_get_lst_dominio}`;
    
    let httpParams = new HttpParams();
    httpParams = httpParams.set('pRefDom', pRefDom);
    httpParams = httpParams.set('pOrdBy', pOrdBy);
    
    return this.http.get<any>(url, { params: httpParams });
  }

  insertarTipoSepultura(tipoSepultura: any): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_insertar_tipo_sepultura}`;
    
    return this.http.post<any>(url, tipoSepultura);
  }

  actualizarTipoSepultura(tipoSepultura: any): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_actualizar_tipo_sepultura}`;
    
    return this.http.put<any>(url, tipoSepultura);
  }

  validaTipoSepulturaModif(pSepuCod: string): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/tipos-sepulturas/valida-modif`;
    
    let httpParams = new HttpParams();
    httpParams = httpParams.set('pSepuCod', pSepuCod);
    
    return this.http.get<any>(url, { params: httpParams });
  }

  calcularCapacidadFinal(pNumCptos: number, pNumRedu: number): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/tipos-sepulturas/calcular-capacidad`;
    
    let httpParams = new HttpParams();
    httpParams = httpParams.set('pNumCptos', pNumCptos.toString());
    httpParams = httpParams.set('pNumRedu', pNumRedu.toString());
    
    return this.http.get<any>(url, { params: httpParams });
  }
}

