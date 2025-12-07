const urlConfigServer = 'http://localhost:8888/';

// const urlConfigServer = 'https://ic-portal-digital-cross.losparques.cl/';

export const environment = {
  production: false,
  token_key: 'token',
  url_config_server: urlConfigServer,
  ms_port: 3000,
  ms_base_uri: '/api/pdr/v01/administracion/vta-sep-mant',
  // Endpoints Administracion de Fuentes
  endp_get_fuentes: 'adm-fuentes/obtener-datos-fuentes',
  endp_get_parametros: 'adm-fuentes/parametros',
  endp_get_lst_unidades: 'adm-fuentes/unidades',
  endp_get_tipo_documento: 'adm-fuentes/tipos-documentos',
  endp_crear_serie: 'adm-fuentes/series',
  endp_generar_documentos: 'adm-fuentes/generar',
  endp_eliminar_documentos: 'adm-fuentes/eliminar',
  ednp_get_lst_dominio: 'adm-fuentes/get-lst-dominio',
  endp_insertar_fuente: 'adm-fuentes/insertar-fuente',
  endp_actualizar_fuente: 'adm-fuentes/actualizar-fuente',
  // Endpoints Tipo de Sepultura
  endp_get_tipos_sepultura: 'tipos-sepulturas/obtener-datos-tipos-sepultura',
  endp_insertar_tipo_sepultura: 'insertar-tipo-sepultura',
  endp_actualizar_tipo_sepultura: 'actualizar-tipo-sepultura',
  // Servicios Comunes
  endp_get_lst_uneg_usuarios: 'common/get-lst-uneg-usuarios',
  endp_get_lst_dominio: 'common/get-lst-dominio',
  //
  url_endp_login: 'https://portal-digital-cross.losparques.cl/api/pdr/v01/cross/security/portal-digital/login'
};

