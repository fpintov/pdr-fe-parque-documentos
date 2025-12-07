# Mantenedor Tipo de Sepulturas

## 1. Descripción General

El mantenedor de Tipo de Sepulturas permite gestionar los tipos de sepulturas disponibles por parque. Cada tipo de sepultura define las características físicas y funcionales de las sepulturas, incluyendo dimensiones, capacidad, características especiales (comunitaria, tercios, etc.), y tipos de servicios que acepta. Este mantenedor es fundamental para la configuración de los diferentes tipos de sepulturas que se pueden ofrecer en las ventas.

## 2. Componentes Principales

### 2.1 Backing Bean

- **Clase:** `cl.precuerdo.ventas.backingbeans.mantenedor.sepultura.MantenedorTipoSepulturaBean`
- **Ubicación:** `src/main/java/cl/precuerdo/ventas/backingbeans/mantenedor/sepultura/MantenedorTipoSepulturaBean.java`

### 2.2 Servicio

- **Interfaz:** `cl.precuerdo.ventas.service.sepultura.SepulturaService`
- **Implementación:** `cl.precuerdo.ventas.service.sepultura.SepulturaServiceImpl`
- **Ubicación:** `src/main/java/cl/precuerdo/ventas/service/sepultura/SepulturaServiceImpl.java`

### 2.3 Vista

- **Archivo:** `mantenedor_tipo_sepultura.xhtml`
- **Ubicación:** `src/main/webapp/pages/ventas/mantenedores/sepultura/tipo/mantenedor_tipo_sepultura.xhtml`

## 3. Carga Inicial de Datos

El método `init()` se ejecuta cuando se accede al mantenedor:

```java
public void init() {
    setPopUpmantenedorTipoSepultura(false);
    setTipoSepulturaSeleccionado(new TipoSepultura());
    aplicacion = new Aplicacion(
        ConstantesVentas.SISTEMA_VENTAS, 
        "VtaMantTpoSepul");
    
    this.empresa = new DropDownBean<UnidadNegocio>();
    this.empresa.setItems(
        getEmpresaService().obtenerUnidadNegocio(aplicacion));
    this.empresa.setLabelProperty("descripcion");
    
    lstTipoSepultura = null;
    tipoSepulturaSeleccionado = null;
}
```

### 3.1 Dropdown de Parques

Se carga con todas las unidades de negocio disponibles mediante `obtenerUnidadNegocio(aplicacion)`. Este dropdown utiliza la función Oracle `GEN_GET_LST_UNEG_USUARIOS` y se utiliza para filtrar los tipos de sepultura por parque.

**Función Oracle Utilizada:**

| Propiedad | Valor |
|-----------|-------|
| Schema | GENPAR |
| Función | GEN_GET_LST_UNEG_USUARIOS |
| Package Interno | PKGEN_SERVICIOS_WEB.getLstUnegUsuarios |
| Tipo | FUNCTION |
| Retorno | SYS_REFCURSOR |

**Parámetros de Entrada:**

| Parámetro | Tipo | Descripción | Valor Usado |
|-----------|------|-------------|-------------|
| P_COUNT | NUMBER | Control de paginación (default: 0) | 0 |
| P_OFFSET | NUMBER | Desplazamiento para paginación (default: 0) | 0 |
| P_NUMREG | NUMBER | Número de registros (default: 0) | 0 |
| P_ORD_BY | VARCHAR2 | Order by en formato (1,2,..n) | null |
| P_SIST_COD | VARCHAR2 | Código del sistema - **OBLIGATORIO** | Código del sistema de la aplicación (ConstantesVentas.SISTEMA_VENTAS) |
| P_APLI_COD | VARCHAR2 | Código de la aplicación - **OBLIGATORIO** | Nombre de la aplicación ("VtaMantTpoSepul") |
| P_EMEG_TIPO | VARCHAR2 | Tipo de unidad de negocio (opcional) | null |

**Parámetros de Salida:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| P_TOT_REG | NUMBER | Total de registros en la consulta |
| P_COD_ERR | NUMBER | Código de error (0 = éxito) |
| P_DES_ERR | VARCHAR2 | Descripción del error |
| RETURN | SYS_REFCURSOR | Cursor con unidades de negocio (UNEG_COD, EMPR_COD, UNEG_EMPR_DESC, etc.) |

**Flujo de Ejecución:**

1. El método `obtenerUnidadNegocio(aplicacion)` del servicio llama a `obtenerUnidadesNegocioVentas(aplicacion)`
2. Se preparan los parámetros `P_SIST_COD` y `P_APLI_COD` desde el objeto `Aplicacion`
3. Se ejecuta `GEN_GET_LST_UNEG_USUARIOS` que internamente llama a `PKGEN_SERVICIOS_WEB.getLstUnegUsuarios`
4. Los resultados se convierten a objetos `UnidadNegocio` mediante `UnidadNegocioConverter`
5. La lista se asigna al dropdown

> **Nota:** Esta función filtra las unidades de negocio según los permisos del usuario y la aplicación, mostrando solo las unidades de negocio a las que el usuario tiene acceso.

### 3.2 Dropdowns del Popup

Los dropdowns se inicializan cuando se abre el popup de nuevo/modificar mediante el método `initDropDownPopUp()`:

```java
public void initDropDownPopUp() {
    setDrpcomunitaria(new DropDownBean<Estado>());
    drpcomunitaria.setItems(getSepuService().obtenerSiNo());
    drpcomunitaria.setLabelProperty("descripcion");

    setDrpestado(new DropDownBean<Estado>());
    drpestado.setItems(getSepuService().obtenerEstadosSepultura());
    drpestado.setLabelProperty("descripcion");

    setDrpcaracteristica(new DropDownBean<Estado>());
    drpcaracteristica.setItems(getSepuService().obtenerCaracteristicasSepultura());
    drpcaracteristica.setLabelProperty("descripcion");

    setDrpTercios(new DropDownBean<Estado>());
    drpTercios.setItems(getSepuService().obtenerSiNo());
    drpTercios.setLabelProperty("descripcion");

    setDrpNumeroTercios(new DropDownBean<Estado>());
    drpNumeroTercios.setItems(obtenerNumeroTercios());
    drpNumeroTercios.setLabelProperty("descripcion");

    tipoTemporalidad = new DropDownBean<Dominio>();
    tipoTemporalidad.setItems(dominioService.getTipoTemporalidad());
    tipoTemporalidad.setLabelProperty("descripcion");

    tipoLapida = new DropDownBean<Dominio>();
    tipoLapida.setItems(dominioService.getTipoLapida());
    tipoLapida.setLabelProperty("descripcion");
}
```

Este método carga los datos para cada dropdown desde la base de datos:

- **Comunitaria:** Se obtiene mediante `obtenerSiNo()` que consulta el dominio `DM_SI_NO` mediante la función `VTA_GET_LST_DOMINIO` del schema `VTAPAR`
- **Estado:** Se obtiene mediante `obtenerEstadosSepultura()` que consulta el dominio `DM_ESTA_COD` mediante la función `VTA_GET_LST_DOMINIO` del schema `VTAPAR`
- **Característica:** Se obtiene mediante `obtenerCaracteristicasSepultura()` que consulta el dominio `DM_SEPUL_CARAC` mediante la función `VTA_GET_LST_DOMINIO` del schema `VTAPAR`
- **Tercios:** Se obtiene mediante `obtenerSiNo()` que consulta el dominio `DM_SI_NO` mediante la función `VTA_GET_LST_DOMINIO` del schema `VTAPAR`
- **Número de Tercios:** Se obtiene mediante `obtenerNumeroTercios()` que retorna una lista hardcodeada con valores "1" y "2" (no utiliza función Oracle)
- **Tipo Temporalidad:** Se obtiene mediante `dominioService.getTipoTemporalidad()` que consulta el dominio `DM_SEPU_TMP_PER` mediante la función `VTA_GET_LST_DOMINIO` del schema `VTAPAR`
- **Tipo Lápida:** Se obtiene mediante `dominioService.getTipoLapida()` que consulta el dominio `DM_SGLE_TIPO_LAP_COD` mediante la función `SER_GET_LST_DOMINIO` del schema `SERPAR`

Los dropdowns que utilizan `VTA_GET_LST_DOMINIO` son: Comunitaria, Estado, Característica, Tercios y Tipo Temporalidad (ver sección 6.1 para más detalles). El dropdown de Tipo Lápida utiliza `SER_GET_LST_DOMINIO` (ver sección 6.1.5 para más detalles).

### 3.3 Carga de Datos al Ingresar Nueva Sepultura

Cuando el usuario hace clic en el botón "Nuevo", se ejecuta el método `ingresarTipoSepultura()`:

```java
public void ingresarTipoSepultura() {
    initDropDownPopUp();
    this.empresa = new DropDownBean<UnidadNegocio>();
    this.empresa.setItems(getEmpresaService().obtenerUnidadNegocio(aplicacion));
    this.empresa.setLabelProperty("descripcion");
    setPopUpmantenedorTipoSepultura(true);
    setTipoSepulturaSeleccionado(new TipoSepultura());
    setModificar(false);
    nuevo = false;
    readOnly = false;
}
```

**Flujo paso a paso:**

1. **Inicializar dropdowns:** Se llama a `initDropDownPopUp()` que carga todas las opciones desde la base de datos
2. **Cargar dropdown de parques:** Se recarga el dropdown de parques/empresas
3. **Abrir popup:** Se establece `popUpmantenedorTipoSepultura = true` para mostrar el formulario
4. **Crear nueva instancia:** Se crea un nuevo objeto `TipoSepultura` vacío
5. **Modo nuevo:** Se establece `modificar = false` y `readOnly = false` para permitir edición completa

> **Nota importante:** Los datos de los dropdowns se cargan desde la base de datos cada vez que se abre el popup, asegurando que siempre se muestren las opciones más actualizadas disponibles en el sistema.

## 4. Funcionamiento del Mantenedor

### 4.1 Búsqueda de Tipos de Sepultura

El método `obtenerDatosTipoSepultura()` se ejecuta al hacer clic en "Buscar":

```java
public void obtenerDatosTipoSepultura() {
    Sector sector = new Sector();
    
    if(empresa.getValue() != null){
        sector.setParques(empresa.getValue());
    }
    
    lstTipoSepultura = getSepuService()
        .obtenerListaTipoSepultura(sector);
}
```

**Flujo técnico:**

1. **Bean:** Se crea un objeto `Sector` y se asigna el parque seleccionado
2. **Servicio:** Se llama a `obtenerListaTipoSepultura(sector)` que:
   - Prepara los parámetros para la función Oracle
   - Ejecuta `VTA_GET_LST_SEPULTURA` con los parámetros del sector/parque
   - Convierte los resultados a objetos `TipoSepultura`

**Función Oracle Utilizada:**

| Propiedad | Valor |
|-----------|-------|
| Función | `VTA_GET_LST_SEPULTURA` |
| Package | `PKVTA_SERVICIOS_WEB` |
| Schema | `VTAPAR` |

**Parámetros Pasados a la Función Oracle:**

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `P_empr_cod` | Código de empresa del parque seleccionado | Código de la empresa (puede ser null) |
| `P_uneg_cod` | Código del parque seleccionado | Código de la unidad de negocio (puede ser null) |
| `P_sect_cod` | `null` | Sin filtro de sector |
| `P_sepu_cod` | `null` | Sin filtro de código |
| `P_esta_dom` | `null` | Sin filtro de estado |

**Conversión de Datos:**

Los resultados (`Vta_get_lst_sepulturaRetornoRS`) se convierten a objetos `TipoSepultura` mediante `TipoSepulturaConverter.convertirTipoSepultura()`. La lista resultante se asigna a `lstTipoSepultura` en el bean.

> **Resultado:** Se obtienen todos los tipos de sepultura del parque seleccionado sin filtros adicionales.

### 4.2 Ingresar Tipo de Sepultura

Al hacer clic en el botón "Nuevo" en la vista, se ejecuta el método `ingresarTipoSepultura()` del bean:

```java
public void ingresarTipoSepultura() {
    initDropDownPopUp();
    this.empresa = new DropDownBean<UnidadNegocio>();
    this.empresa.setItems(getEmpresaService().obtenerUnidadNegocio(aplicacion));
    this.empresa.setLabelProperty("descripcion");
    setPopUpmantenedorTipoSepultura(true);
    setTipoSepulturaSeleccionado(new TipoSepultura());
    setModificar(false);
    nuevo = false;
    readOnly = false;
}
```

**Proceso detallado:**

1. **Inicializar dropdowns:** Se ejecuta `initDropDownPopUp()` que carga todas las opciones desde la base de datos
2. **Cargar parques:** Se recarga el dropdown de parques/empresas
3. **Mostrar popup:** Se establece `popUpmantenedorTipoSepultura = true` para mostrar el formulario modal
4. **Crear nueva instancia:** Se crea un nuevo objeto `TipoSepultura` vacío
5. **Modo creación:** Se establece `modificar = false` y `readOnly = false` para permitir edición completa

**Resultado:** El usuario ve un formulario vacío con todos los dropdowns cargados con las opciones disponibles desde la base de datos.

### 4.3 Modificar Tipo de Sepultura

Al hacer clic en "Regularizar" después de seleccionar un tipo de sepultura, se ejecuta el método `modificarTipoSepultura()`:

```java
public void modificarTipoSepultura() {
    String val = getSepuService().validaTipoSepultura(tipoSepulturaSeleccionado);
    readOnly = true;
    nuevo = true;

    if (ConstantesVentas.PARAMETRO_SI.equals(val)) {
        readOnly = false;
    }

    initDropDownPopUp();
    setPopUpmantenedorTipoSepultura(true);
    setModificar(true);

    // Se establecen los valores actuales en los dropdowns
    this.empresa.setByPropertyValue("", tipoSepulturaSeleccionado.getEmprCod());
    drpestado.setByPropertyValue("codigo", tipoSepulturaSeleccionado.getEstado().getCodigo());
    drpcaracteristica.setByPropertyValue("codigo", tipoSepulturaSeleccionado.getCaracteristica().getCodigo());
    drpcomunitaria.setByPropertyValue("codigo", tipoSepulturaSeleccionado.getComunitaria().getCodigo());
    drpTercios.setByPropertyValue("codigo", tipoSepulturaSeleccionado.getTercios());
    drpNumeroTercios.setByPropertyValue("codigo", tipoSepulturaSeleccionado.getNumeroTercios().toString());
    tipoLapida.setByPropertyValue("codigo", tipoSepulturaSeleccionado.getTipoLapida());
    tipoTemporalidad.setByPropertyValue("codigo", tipoSepulturaSeleccionado.getTemporalPerpetuo());
}
```

**Proceso detallado:**

1. **Validar modificación:** Se ejecuta `validaTipoSepultura()` que llama a la función Oracle `VTA_VAL_SEPU_MODIF`
2. **Establecer modo lectura:** Por defecto se establece `readOnly = true`
3. **Habilitar edición si es válido:** Si la validación retorna "SI", se establece `readOnly = false`
4. **Inicializar dropdowns:** Se ejecuta `initDropDownPopUp()` para cargar las opciones
5. **Cargar valores actuales:** Se establecen los valores actuales del tipo de sepultura en cada dropdown
6. **Mostrar popup:** Se establece `popUpmantenedorTipoSepultura = true` y `modificar = true`

### 4.4 Calcular Capacidad Final

El método `calcularCapacidadFinal()` calcula la capacidad basándose en compartimientos y reducciones:

```java
public void calcularCapacidadFinal() {
    if (tipoSepulturaSeleccionado.getCompartimientos() != null && 
        tipoSepulturaSeleccionado.getReducciones() != null) {
        tipoSepulturaSeleccionado.setCapacidad(
            sepuService.calculaCapasidadFinal(
                tipoSepulturaSeleccionado.getCompartimientos(), 
                tipoSepulturaSeleccionado.getReducciones()));
    } else {
        FacesUtils.error("Debe ingresar Compartimentos y Reducciones.");
    }
}
```

Este método llama al servicio que ejecuta la función Oracle `VTA_GET_SEPU_NUM_CAP` para calcular la capacidad final.

### 4.5 Aceptar Tipo de Sepultura

Cuando el usuario presiona el botón "Aceptar" en el popup, se ejecuta el método `aceptar()`:

```java
public void aceptar() {
    cargarTipoSepultura();
    if (!isModificar()) {
        if (getTipoSepulturaSeleccionado().getCapacidad() != null) {
            getSepuService().insertarTipoSepultura(
                getTipoSepulturaSeleccionado());
            FacesUtils.addMensajeAlertInfo("Se ha creado un nuevo Tipo de Sepultura con codigo " + 
                tipoSepulturaSeleccionado.getCodigo().toString());
        } else {
            FacesUtils.error("Debe Calcular Capasidad Final.");
            return;
        }
    } else {
        getSepuService().modificarTipoSepultura(
            getTipoSepulturaSeleccionado());
        FacesUtils.addMensajeAlertInfo("Se ha modificado el Tipo de Sepultura con codigo " + 
            tipoSepulturaSeleccionado.getCodigo().toString());
    }
    init();
    setPopUpmantenedorTipoSepultura(false);
}
```

#### 4.5.1 Cargar Datos del Formulario

Primero se ejecuta `cargarTipoSepultura()` para transferir los valores seleccionados en los dropdowns al objeto `TipoSepultura`:

```java
private void cargarTipoSepultura() {
    if (drpestado.getValue() != null) {
        tipoSepulturaSeleccionado.setEstado(drpestado.getValue());
    }
    if (drpcaracteristica.getValue() != null) {
        tipoSepulturaSeleccionado.setCaracteristica(drpcaracteristica.getValue());
    }
    if (drpcomunitaria.getValue() != null) {
        tipoSepulturaSeleccionado.setComunitaria(drpcomunitaria.getValue());
    }
    if (drpTercios.getValue() != null) {
        tipoSepulturaSeleccionado.setTercios(drpTercios.getValue().getCodigo());
    }
    if (drpNumeroTercios.getValue() != null) {
        tipoSepulturaSeleccionado.setNumeroTercios(Integer.parseInt(drpNumeroTercios.getValue().getCodigo()));
    }
    if (tipoLapida.getValue() != null) {
        tipoSepulturaSeleccionado.setTipoLapida(tipoLapida.getValue().getCodigo());
    }
    if (tipoTemporalidad.getValue() != null) {
        tipoSepulturaSeleccionado.setTemporalPerpetuo(tipoTemporalidad.getValue().getCodigo());
    }
    if (empresa.getValue() != null) {
        tipoSepulturaSeleccionado.setEmprCod(empresa.getValue().getCodigo_empresa());
    }
}
```

Este método toma los valores seleccionados de cada dropdown y los asigna al objeto `tipoSepulturaSeleccionado`.

#### 4.5.2 Insertar Nueva Sepultura

Si `modificar = false`, se ejecuta `insertarTipoSepultura()`:

```java
@Transactional(propagation = Propagation.REQUIRED)
public void insertarTipoSepultura(TipoSepultura tiposepultura) {
    logger.info("Insertar un Tipo de Sepultura : " + tiposepultura.toString());

    Vta_graba_sepulturaIN in = new Vta_graba_sepulturaIN();
    in.setP_sepu_ancho(tiposepultura.getAncho());
    in.setP_sepu_cod(tiposepultura.getCodigo().toUpperCase());
    in.setP_sepu_crac((tiposepultura.getCaracteristica() != null) ? tiposepultura.getCaracteristica().getCodigo() : "");
    in.setP_sepu_desc_crta(tiposepultura.getDescripcion_corta());
    in.setP_sepu_desc_lrga(tiposepultura.getDescripcion_larga());
    in.setP_sepu_esta_cod(tiposepultura.getEstado().getCodigo());
    in.setP_sepu_ind_tercios(tiposepultura.getTercios());
    in.setP_sepu_indi_comu(tiposepultura.getComunitaria().getCodigo());
    in.setP_sepu_largo(tiposepultura.getLargo());
    in.setP_sepu_lpda_tipo(tiposepultura.getTipoLapida());
    in.setP_sepu_nivel_propio(tiposepultura.getNivelPropio());
    in.setP_sepu_nivel_total(tiposepultura.getNivelTotal());
    in.setP_sepu_num_cap(tiposepultura.getCapacidad());
    in.setP_sepu_num_cptos(tiposepultura.getCompartimientos());
    in.setP_sepu_num_redu(tiposepultura.getReducciones());
    in.setP_sepu_num_tercios(tiposepultura.getNumeroTercios());
    in.setP_sepu_osario_num(tiposepultura.getNumOsario());
    in.setP_sepu_tasa_cofre(tiposepultura.getAceptaCofre());
    in.setP_sepu_tasa_cuerpo_ent(tiposepultura.getAceptaCuerpoEntero());
    in.setP_sepu_tasa_parvulo(tiposepultura.getAceptaParvulo());
    in.setP_sepu_tasa_reduccion(tiposepultura.getAceptaReduccion());
    in.setP_sepu_temp(tiposepultura.getTemporalPerpetuo());
    in.setP_empr_cod(tiposepultura.getEmprCod());
    in.setP_tipo_oper("I");

    this.getVtaparServices().getVta_graba_sepulturaService().execute(in);
}
```

**Proceso:**

1. Se preparan todos los parámetros del objeto `TipoSepultura` en el objeto `Vta_graba_sepulturaIN`
2. Se establece `P_tipo_oper = "I"` para indicar que es una inserción
3. Se ejecuta el procedimiento almacenado `VTAPAR.VTA_GRABA_SEPULTURA`

#### 4.5.3 Modificar Sepultura Existente

Si `modificar = true`, se ejecuta `modificarTipoSepultura()`:

```java
@Transactional(propagation = Propagation.REQUIRED)
public void modificarTipoSepultura(TipoSepultura tiposepultura) {
    logger.info("Modificar un Tipo de Sepultura : " + tiposepultura.toString());

    Vta_graba_sepulturaIN in = new Vta_graba_sepulturaIN();
    // ... mismos parámetros que en insertar ...
    in.setP_tipo_oper("U");

    this.getVtaparServices().getVta_graba_sepulturaService().execute(in);
}
```

**Proceso:**

1. Se preparan todos los parámetros del objeto `TipoSepultura` en el objeto `Vta_graba_sepulturaIN`
2. Se establece `P_tipo_oper = "U"` para indicar que es una actualización
3. Se ejecuta el procedimiento almacenado `VTAPAR.VTA_GRABA_SEPULTURA`

> ⚠️ **Importante:** A diferencia del mantenedor de Fuentes, este mantenedor utiliza un **procedimiento almacenado** (`VTA_GRABA_SEPULTURA`) en lugar de operaciones CRUD directas. El procedimiento maneja tanto INSERT como UPDATE según el parámetro `P_TIPO_OPER`.

## 5. Eventos y Cambios (Change Events)

### 5.1 Cambio de Tercios

El dropdown de tercios tiene un listener que habilita/deshabilita el campo de número de tercios:

```java
drpTercios.addChangeListener(new ValueLabelChangeListener<Estado>() {
    public void execute(GenericValueLabelBean<Estado> value) 
        throws PADException {
        _this.evaluaTercios(value.getValue());
    }
});

private void evaluaTercios(Estado e) {
    if (ConstantesVentas.PARAMETRO_SI.equals(e.getCodigo())) {
        this.readOnlyNTercio = false;
    } else {
        setDrpNumeroTercios(new DropDownBean<Estado>());
        drpNumeroTercios.setItems(obtenerNumeroTercios());
        drpNumeroTercios.setLabelProperty("codigo");
        drpNumeroTercios.setByPropertyValue("codigo", "1");
        this.readOnlyNTercio = true;
    }
}
```

**Comportamiento:**

- Si se selecciona "SI": Se habilita el campo de número de tercios (`readOnlyNTercio = false`)
- Si se selecciona "NO": Se deshabilita el campo y se establece automáticamente en "1" (`readOnlyNTercio = true`)

## 6. Funciones de Oracle

### 6.0 GEN_GET_LST_UNEG_USUARIOS (Para Dropdown de Parques)

Esta función se utiliza para cargar el dropdown de Parques/Unidades de Negocio cuando se accede al mantenedor o cuando se abre el popup.

| Propiedad | Valor |
|-----------|-------|
| Schema | GENPAR |
| Función | GEN_GET_LST_UNEG_USUARIOS |
| Package Interno | PKGEN_SERVICIOS_WEB.getLstUnegUsuarios |
| Tipo | FUNCTION |
| Retorno | SYS_REFCURSOR |

#### Parámetros de Entrada

| Parámetro | Tipo | Descripción | Valor Usado |
|-----------|------|-------------|-------------|
| P_COUNT | NUMBER | Control de paginación (default: 0) | 0 |
| P_OFFSET | NUMBER | Desplazamiento para paginación (default: 0) | 0 |
| P_NUMREG | NUMBER | Número de registros (default: 0) | 0 |
| P_ORD_BY | VARCHAR2 | Order by en formato (1,2,..n) | null |
| P_SIST_COD | VARCHAR2 | Código del sistema - **OBLIGATORIO** | Código del sistema de la aplicación (ConstantesVentas.SISTEMA_VENTAS) |
| P_APLI_COD | VARCHAR2 | Código de la aplicación - **OBLIGATORIO** | Nombre de la aplicación ("VtaMantTpoSepul") |
| P_EMEG_TIPO | VARCHAR2 | Tipo de unidad de negocio (opcional) | null |

#### Parámetros de Salida

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| P_TOT_REG | NUMBER | Total de registros en la consulta |
| P_COD_ERR | NUMBER | Código de error (0 = éxito) |
| P_DES_ERR | VARCHAR2 | Descripción del error |
| RETURN | SYS_REFCURSOR | Cursor con unidades de negocio (UNEG_COD, EMPR_COD, UNEG_EMPR_DESC, etc.) |

**Flujo de Ejecución:**

1. El método `obtenerUnidadNegocio(aplicacion)` del servicio `EmpresaVentasServiceImpl` llama a `obtenerUnidadesNegocioVentas(aplicacion)`
2. Se preparan los parámetros `P_SIST_COD` y `P_APLI_COD` desde el objeto `Aplicacion`:
   - `P_SIST_COD = aplicacion.getCodigoSistema()` (valor: ConstantesVentas.SISTEMA_VENTAS)
   - `P_APLI_COD = aplicacion.getNombreAplicacion()` (valor: "VtaMantTpoSepul")
3. Se ejecuta `GEN_GET_LST_UNEG_USUARIOS` que internamente llama a `PKGEN_SERVICIOS_WEB.getLstUnegUsuarios`
4. Los resultados (`Gen_get_lst_uneg_usuariosRetornoRS`) se convierten a objetos `UnidadNegocio` mediante `UnidadNegocioConverter.convertirUnidadNegocioUsuario()`
5. La lista se asigna al dropdown mediante `setItems()`

> **Nota importante:** Esta función filtra las unidades de negocio según los permisos del usuario y la aplicación, mostrando solo las unidades de negocio a las que el usuario tiene acceso según su configuración en el sistema de seguridad.

### 6.1 VTA_GET_LST_DOMINIO (Para Dropdowns)

Esta función se utiliza para cargar los datos de varios dropdowns cuando se abre el popup para ingresar o modificar una sepultura.

| Propiedad | Valor |
|-----------|-------|
| Schema | VTAPAR |
| Función | VTA_GET_LST_DOMINIO |
| Package Interno | PKVTA_SERVICIOS_WEB.getLstdominio |
| Tipo | FUNCTION |
| Retorno | SYS_REFCURSOR |

#### Parámetros de la Función

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| P_COUNT | NUMBER | Control de paginación (default: 0) |
| P_OFFSET | NUMBER | Desplazamiento para paginación (default: 0) |
| P_NUMREG | NUMBER | Número de registros (default: 0) |
| P_TOT_REG | NUMBER (OUT) | Total de registros en la consulta |
| P_COD_ERR | NUMBER (OUT) | Código de error (0 = éxito) |
| P_DES_ERR | VARCHAR2 (OUT) | Descripción del error |
| P_ORD_BY | VARCHAR2 | Order by en formato (1,2,..n) - Valor usado: "2" |
| P_REF_DOM | VARCHAR2 | **Código del dominio a consultar (obligatorio)** |
| P_LOW_VAL | VARCHAR2 | Valor específico a filtrar (opcional, null en este caso) |
| P_REF_ABR | VARCHAR2 | Abreviación del código (opcional, null en este caso) |

#### Uso por Dropdown

La misma función se utiliza para varios dropdowns, pero con diferentes valores del parámetro `P_REF_DOM`:

| Dropdown | P_REF_DOM | Constante Java | P_ORD_BY | Otros Parámetros |
|----------|-----------|---------------|----------|------------------|
| **Comunitaria** | `DM_SI_NO` | `DOMINIO_SI_NO` | `"2"` | P_COUNT=0, P_OFFSET=0, P_NUMREG=0, P_LOW_VAL=null, P_REF_ABR=null |
| **Estado** | `DM_ESTA_COD` | `DOMINIO_ESTADOS_SEPULTURA` | `"2"` | P_COUNT=0, P_OFFSET=0, P_NUMREG=0, P_LOW_VAL=null, P_REF_ABR=null |
| **Característica** | `DM_SEPUL_CARAC` | `DOMINIO_CARACTERISTICAS_SEPULTURA` | `"2"` | P_COUNT=0, P_OFFSET=0, P_NUMREG=0, P_LOW_VAL=null, P_REF_ABR=null |
| **Tercios** | `DM_SI_NO` | `DOMINIO_SI_NO` | `"2"` | P_COUNT=0, P_OFFSET=0, P_NUMREG=0, P_LOW_VAL=null, P_REF_ABR=null |
| **Tipo Temporalidad** | `DM_SEPU_TMP_PER` | `DOMINIO_TEMPORALIDAD` | `"2"` | P_COUNT=0, P_OFFSET=0, P_NUMREG=0, P_LOW_VAL=null, P_REF_ABR=null |

### 6.2 VTA_GET_LST_SEPULTURA

Esta función se utiliza para obtener la lista de tipos de sepultura al hacer clic en "Buscar".

| Propiedad | Valor |
|-----------|-------|
| Schema | VTAPAR |
| Package | PKVTA_SERVICIOS_WEB |
| Tipo | FUNCTION |
| Retorno | SYS_REFCURSOR |

#### Parámetros de Entrada

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| P_COUNT | NUMBER | Control de paginación (default: 0) |
| P_OFFSET | NUMBER | Desplazamiento para paginación (default: 0) |
| P_NUMREG | NUMBER | Número de registros (default: 0) |
| P_ORD_BY | VARCHAR2 | Order by en formato (1,2,..n) |
| P_SEPU_COD | VARCHAR2 | Código del tipo de sepultura a filtrar (opcional) |
| P_ESTA_DOM | VARCHAR2 | Estado a filtrar (opcional) |
| P_EMPR_COD | VARCHAR2 | Código de la empresa (opcional) |
| P_UNEG_COD | VARCHAR2 | Código de la unidad de negocio (opcional) |
| P_SECT_COD | VARCHAR2 | Código del sector (opcional) |

#### Parámetros de Salida

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| P_TOT_REG | NUMBER | Total de registros en la consulta |
| P_COD_ERR | NUMBER | Código de error |
| P_DES_ERR | VARCHAR2 | Descripción del error |
| RETURN | SYS_REFCURSOR | Cursor con los tipos de sepultura (SEPU_COD, SEPU_DESC_CRTA, SEPU_CRAC, SEPU_NUM_CPTOS, SEPU_NUM_REDU, SEPU_NUM_CAP, SEPU_INDI_COMU, SEPU_ESTA_COD, SEPU_IND_TERCIOS, SEPU_NUM_TERCIOS, etc.) |

### 6.3 VTA_GRABA_SEPULTURA (Procedimiento Almacenado)

> ⚠️ **Importante:** Este mantenedor utiliza un **procedimiento almacenado** para insertar y modificar tipos de sepultura, a diferencia del mantenedor de Fuentes que usa CRUD directo.

| Propiedad | Valor |
|-----------|-------|
| Schema | VTAPAR |
| Package | PKVTA_SERVICIOS_WEB7 |
| Tipo | PROCEDURE |
| Nombre | VTA_GRABA_SEPULTURA |

Este procedimiento maneja tanto INSERT como UPDATE según el parámetro `P_TIPO_OPER`:

- `P_TIPO_OPER = 'I'`: Inserta un nuevo tipo de sepultura
- `P_TIPO_OPER = 'U'`: Actualiza un tipo de sepultura existente
- `P_TIPO_OPER = 'D'`: Elimina un tipo de sepultura (no se usa en este mantenedor)

#### Parámetros de Entrada

| Parámetro | Tipo | Descripción | Obligatorio |
|-----------|------|-------------|-------------|
| P_TIPO_OPER | VARCHAR2 | Tipo de operación: 'I' (Insert), 'U' (Update), 'D' (Delete) | Sí |
| P_SEPU_COD | VARCHAR2 | Código del tipo de sepultura | Sí |
| P_SEPU_DESC_CRTA | VARCHAR2 | Descripción corta | Sí (I, U) |
| P_SEPU_DESC_LRGA | VARCHAR2 | Descripción larga | Sí (I, U) |
| P_SEPU_CRAC | VARCHAR2 | Código de característica | Sí (I, U) |
| P_SEPU_NUM_CPTOS | NUMBER | Número de compartimientos | Sí (I, U) |
| P_SEPU_NUM_REDU | NUMBER | Número de reducciones | Sí (I, U) |
| P_SEPU_NUM_CAP | NUMBER | Número de capacidad final | Sí (I, U) |
| P_SEPU_INDI_COMU | VARCHAR2 | Indicador comunitaria: 'SI' o 'NO' | Sí (I, U) |
| P_SEPU_ESTA_COD | VARCHAR2 | Código de estado | Sí (I, U) |
| P_SEPU_IND_TERCIOS | VARCHAR2 | Indicador tercios: 'SI' o 'NO' | Sí (I, U) |
| P_SEPU_NUM_TERCIOS | NUMBER | Número de tercios | Sí (I, U) |
| P_SEPU_TEMP | VARCHAR2 | Tipo temporalidad: Temporal o Perpetuo | Sí (I, U) |
| P_SEPU_LARGO | NUMBER | Largo en metros | Sí (I, U) |
| P_SEPU_ANCHO | NUMBER | Ancho en metros | Sí (I, U) |
| P_SEPU_LPDA_TIPO | VARCHAR2 | Tipo de lápida | Sí (I, U) |
| P_SEPU_NIVEL_TOTAL | NUMBER | Nivel total | Sí (I, U) |
| P_SEPU_NIVEL_PROPIO | NUMBER | Nivel propio | Sí (I, U) |
| P_SEPU_OSARIO_NUM | NUMBER | Número de osario | Sí (I, U) |
| P_SEPU_TASA_CUERPO_ENT | NUMBER | Tasa cuerpo entero | Sí (I, U) |
| P_SEPU_TASA_REDUCCION | NUMBER | Tasa reducción | Sí (I, U) |
| P_SEPU_TASA_COFRE | NUMBER | Tasa cofre | Sí (I, U) |
| P_SEPU_TASA_PARVULO | NUMBER | Tasa párvulo | Sí (I, U) |
| P_EMPR_COD | VARCHAR2 | Código de la empresa (default '02') | No |

#### Parámetros de Salida

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| P_COD_ERR | NUMBER | Código de error (0 = éxito) |
| P_DES_ERR | VARCHAR2 | Descripción del error |

**Flujo del Procedimiento:**

1. Valida que `P_TIPO_OPER` no sea null
2. Si `P_TIPO_OPER = 'I'`, valida que el código no exista previamente
3. Llama internamente a `VTA_PUT_VTA_SEPULTURA` que realiza el INSERT o UPDATE en la tabla `VTA_SEPULTURA`
4. Retorna códigos de error si algo falla

### 6.4 VTA_VAL_SEPU_MODIF

Función que valida si se puede modificar un tipo de sepultura.

| Propiedad | Valor |
|-----------|-------|
| Schema | VTAPAR |
| Package | PKVTA_SERVICIOS_WEB |
| Tipo | FUNCTION |
| Retorno | VARCHAR2 |

**Parámetros:**

- **Entrada:** Código del tipo de sepultura
- **Salida:** Retorna 'SI' si se puede modificar, 'NO' en caso contrario

Esta función se utiliza antes de permitir la edición de un tipo de sepultura existente.

### 6.5 VTA_GET_SEPU_NUM_CAP

Función que calcula la capacidad final basándose en compartimientos y reducciones.

| Propiedad | Valor |
|-----------|-------|
| Schema | VTAPAR |
| Package | PKVTA_SERVICIOS_WEB |
| Tipo | FUNCTION |
| Retorno | NUMBER |

**Parámetros:**

- **Entrada:** Número de compartimientos y número de reducciones
- **Salida:** Capacidad final calculada

Se utiliza en el método `calculaCapasidadFinal()` del servicio cuando el usuario hace clic en "Calcular Capacidad".

### 6.1.5 SER_GET_LST_DOMINIO (Para Dropdown de Tipo Lápida)

Esta función se utiliza para cargar el dropdown de Tipo Lápida cuando se abre el popup para ingresar o modificar una sepultura.

| Propiedad | Valor |
|-----------|-------|
| Schema | SERPAR |
| Función | SER_GET_LST_DOMINIO |
| Package Interno | PKSER_SERVICIOS_WEB.getLstDominio (inferido) |
| Tipo | FUNCTION |
| Retorno | SYS_REFCURSOR |

#### Parámetros de la Función

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| P_COUNT | NUMBER | Control de paginación (default: 0) |
| P_OFFSET | NUMBER | Desplazamiento para paginación (default: 0) |
| P_NUMREG | NUMBER | Número de registros (default: 0) |
| P_TOT_REG | NUMBER (OUT) | Total de registros en la consulta |
| P_COD_ERR | NUMBER (OUT) | Código de error (0 = éxito) |
| P_DES_ERR | VARCHAR2 (OUT) | Descripción del error |
| P_ORD_BY | VARCHAR2 | Order by en formato (1,2,..n) - Valor usado: "2" |
| P_REF_DOM | VARCHAR2 | **Código del dominio a consultar (obligatorio)** |

#### Uso para el Dropdown de Tipo Lápida

| Dropdown | P_REF_DOM | Constante Java | P_ORD_BY | Otros Parámetros |
|----------|-----------|---------------|----------|------------------|
| **Tipo Lápida** | `DM_SGLE_TIPO_LAP_COD` | `DOMINIO_TIPO_LAPIDA` | `"2"` | P_COUNT=0, P_OFFSET=0, P_NUMREG=0, P_LOW_VAL=null, P_REF_ABR=null |

**Flujo de Ejecución:**

1. El método `getTipoLapida()` del servicio `DominioServiceImpl` llama a `obtenerDominioSerpar(ConstantesVentas.DOMINIO_TIPO_LAPIDA)`
2. Se preparan los parámetros:
   - `P_REF_DOM = "DM_SGLE_TIPO_LAP_COD"`
   - `P_ORD_BY = ConstantesVentas.ORDEN_LISTA_DOMINIO` (valor: "2")
3. Se ejecuta `SER_GET_LST_DOMINIO` del schema `SERPAR`
4. Los resultados (`Ser_get_lst_dominioRetornoRS`) se convierten a objetos `Dominio`
5. La lista se asigna al dropdown mediante `setItems()`

> **Nota:** Esta función es similar a `VTA_GET_LST_DOMINIO` pero pertenece al schema `SERPAR` y consulta dominios de ese schema.

## 7. Flujo de Trabajo

1. **Carga inicial:** Se cargan los parques disponibles en el dropdown principal
2. **Buscar:** Usuario selecciona parque → Hace clic en "Buscar" → Se ejecuta `VTA_GET_LST_SEPULTURA` → Se muestran los tipos de sepultura del parque
3. **Nuevo Tipo de Sepultura:** Usuario hace clic en "Nuevo" → Se cargan dropdowns → Usuario completa todos los campos → Calcula capacidad → Se graba mediante `VTA_GRABA_SEPULTURA` con `P_TIPO_OPER='I'`
4. **Modificar Tipo de Sepultura:** Usuario selecciona tipo → Se valida con `VTA_VAL_SEPU_MODIF` → Hace clic en "Regularizar" → Se cargan datos → Usuario modifica → Se graba mediante `VTA_GRABA_SEPULTURA` con `P_TIPO_OPER='U'`
5. **Cambio de Tercios:** Si cambia a "SI", se habilita número de tercios; si cambia a "NO", se deshabilita y se establece en 1

## 8. Validaciones

- El parque es obligatorio para buscar
- Al crear un nuevo tipo de sepultura, la capacidad final es obligatoria (debe calcularse primero)
- Todos los campos son obligatorios al crear o modificar
- Se valida si se puede modificar un tipo de sepultura antes de permitir la edición mediante `VTA_VAL_SEPU_MODIF`
- Si Tercios = "NO", el número de tercios se establece automáticamente en 1
- El código se convierte a mayúsculas antes de grabar

## 9. Consideraciones Técnicas

> ⚠️ **Importante:**
> 
> - La capacidad final debe calcularse antes de grabar un nuevo tipo de sepultura mediante la función `VTA_GET_SEPU_NUM_CAP`
> - El mantenedor utiliza un **procedimiento almacenado** (`VTA_GRABA_SEPULTURA`) en lugar de operaciones CRUD directas
> - El procedimiento almacenado maneja tanto INSERT como UPDATE según el parámetro `P_TIPO_OPER`
> - Algunos campos pueden estar en modo solo lectura según la validación de modificación (`VTA_VAL_SEPU_MODIF`)
> - La tabla utiliza paginación con 10 registros por página
> - El código se convierte a mayúsculas antes de grabar
> - El mantenedor tiene muchos campos obligatorios que deben completarse correctamente
> - Las tasas (cuerpo entero, reducción, cofre, párvulo) son campos numéricos obligatorios
> - Los dropdowns se cargan desde dominios mediante la función `VTA_GET_LST_DOMINIO` cada vez que se abre el popup:
>   - Comunitaria: `DM_SI_NO`
>   - Estado: `DM_ESTA_COD`
>   - Característica: `DM_SEPUL_CARAC`
>   - Tercios: `DM_SI_NO`
> - Las operaciones de inserción y actualización están marcadas como `@Transactional`, por lo que Spring maneja los commits y rollbacks automáticamente
> - El dropdown de número de tercios se carga con valores hardcodeados ("1" y "2") cuando Tercios = "NO"

## 10. Resumen de Funciones Oracle Utilizadas

| Función | Schema | Propósito | Cuándo se Ejecuta |
|---------|--------|-----------|-------------------|
| `GEN_GET_LST_UNEG_USUARIOS` | GENPAR | Cargar opciones del dropdown de Parques/Unidades de Negocio | Al acceder al mantenedor (en `init()`) y al abrir el popup (en `ingresarTipoSepultura()` y `modificarTipoSepultura()`) |
| `VTA_GET_LST_DOMINIO` | VTAPAR | Cargar opciones de los dropdowns (Comunitaria, Estado, Característica, Tercios, Tipo Temporalidad) | Al hacer clic en "Nuevo" o "Regularizar" (cuando se abre el popup) |
| `SER_GET_LST_DOMINIO` | SERPAR | Cargar opciones del dropdown de Tipo Lápida | Al hacer clic en "Nuevo" o "Regularizar" (cuando se abre el popup) |
| `VTA_GET_LST_SEPULTURA` | VTAPAR | Obtener lista de tipos de sepultura por parque | Al hacer clic en "Buscar" después de seleccionar un parque |
| `VTA_GRABA_SEPULTURA` | VTAPAR | Insertar o modificar tipo de sepultura (procedimiento almacenado) | Al presionar "Aceptar" en modo creación (`P_TIPO_OPER='I'`) o modificación (`P_TIPO_OPER='U'`) |
| `VTA_VAL_SEPU_MODIF` | VTAPAR | Validar si se puede modificar un tipo de sepultura | Al hacer clic en "Regularizar" antes de permitir la edición |
| `VTA_GET_SEPU_NUM_CAP` | VTAPAR | Calcular capacidad final | Al hacer clic en "Calcular Capacidad" |

