const urlConfigServer = 'http://localhost:8888/';

// const urlConfigServer = 'https://ic-portal-digital-cross.losparques.cl/';

export const environment = {
  production: false,
  token_key: 'token',
  url_config_server: urlConfigServer,
  ms_port: 3000,
  ms_base_uri: '/api/pdr/v01/administracion/vta-sep-mant/adm-fuentes',
  // Endpoints Administracion de Fuentes
  endp_get_fuentes: 'obtener-datos-fuentes',
  endp_get_parametros: 'parametros',
  endp_get_lst_unidades: 'unidades',
  endp_get_tipo_documento: 'tipos-documentos',
  endp_crear_serie: 'series',
  endp_generar_documentos: 'generar',
  endp_eliminar_documentos: 'eliminar',
  ednp_get_lst_dominio: 'get-lst-dominio',
  endp_insertar_fuente: 'insertar-fuente',
  endp_actualizar_fuente: 'actualizar-fuente',
  url_endp_login: 'https://portal-digital-cross.losparques.cl/api/pdr/v01/cross/security/portal-digital/login'
};

