import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }
  
  getLstUnegUsuarios(
    pSistCod: string,
    pApliCod: string,
    pCount?: number,
    pOffset?: number,
    pNumreg?: number,
    pOrdBy?: string,
    pEmegTipo?: string
  ): Observable<any> {
    const baseUrl = environment.url_config_server.replace(/\/$/, '').replace(/:\d+/, '');
    const url = `${baseUrl}:${environment.ms_port}${environment.ms_base_uri}/${environment.endp_get_lst_uneg_usuarios}`;
    
    let httpParams = new HttpParams();
    
    // Parámetros requeridos
    httpParams = httpParams.set('pSistCod', pSistCod);
    httpParams = httpParams.set('pApliCod', pApliCod);
    
    // Parámetros opcionales
    if (pCount !== undefined && pCount !== null) {
      httpParams = httpParams.set('pCount', pCount.toString());
    }
    if (pOffset !== undefined && pOffset !== null) {
      httpParams = httpParams.set('pOffset', pOffset.toString());
    }
    if (pNumreg !== undefined && pNumreg !== null) {
      httpParams = httpParams.set('pNumreg', pNumreg.toString());
    }
    if (pOrdBy) {
      httpParams = httpParams.set('pOrdBy', pOrdBy);
    }
    if (pEmegTipo) {
      httpParams = httpParams.set('pEmegTipo', pEmegTipo);
    }
    
    return this.http.get<any>(url, { params: httpParams });
  }
}

