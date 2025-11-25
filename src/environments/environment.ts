// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  token_key: 'token',
  url_config_server: 'http://localhost:8888/',
  ms_port: 3000,
  ms_base_uri: '/api/pdr/v01/parque/documentos',
  endp_get_empresas_user: 'empresas-sp',
  endp_get_parametros: 'parametros',
  endp_get_lst_unidades: 'unidades',
  endp_get_tipo_documento: 'tipos-documentos',
  url_endp_login: 'https://portal-digital-cross.losparques.cl/api/pdr/v01/cross/security/portal-digital/login'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
