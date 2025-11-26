const urlConfigServer = 'https://ic-portal-digital-cross.losparques.cl/';

export const environment = {
  production: false,
  token_key: 'token',
  url_config_server: urlConfigServer,
  ms_port: 3000,
  ms_base_uri: '/api/pdr/v01/parque/documentos',
  endp_get_empresas_user: 'empresas-sp',
  endp_get_parametros: 'parametros',
  endp_get_lst_unidades: 'unidades',
  endp_get_tipo_documento: 'tipos-documentos',
  endp_crear_serie: 'series',
  endp_generar_documentos: 'generar',
  endp_eliminar_documentos: 'eliminar',
  url_endp_login: 'https://portal-digital-cross.losparques.cl/api/pdr/v01/cross/security/portal-digital/login'
};
