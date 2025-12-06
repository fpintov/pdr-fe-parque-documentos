import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class AdmFuentesService {

  constructor(private http: HttpClient) { }
  
  getFuentes(operacion: string): Observable<any[]> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_get_fuentes}`;
    
    let httpParams = new HttpParams();
    httpParams = httpParams.set('operacion', operacion);
    
    return this.http.get<any[]>(url, { params: httpParams });
  }

  getLstDominio(pRefDom: string, pOrdBy: string): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.ednp_get_lst_dominio}`;
    
    let httpParams = new HttpParams();
    httpParams = httpParams.set('pRefDom', pRefDom);
    httpParams = httpParams.set('pOrdBy', pOrdBy);
    
    return this.http.get<any>(url, { params: httpParams });
  }

  insertarFuente(fuente: any): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_insertar_fuente}`;
    
    return this.http.post<any>(url, fuente);
  }

  actualizarFuente(fuente: any): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_actualizar_fuente}`;
    
    return this.http.put<any>(url, fuente);
  }
}

