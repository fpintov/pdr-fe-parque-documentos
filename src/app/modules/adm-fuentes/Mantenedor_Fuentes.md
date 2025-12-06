# Mantenedor Administración de Fuentes

## 1. Descripción General

El mantenedor de Administración de Fuentes permite gestionar las fuentes de información o procedencia de las operaciones. Las fuentes se clasifican por categoría y grupo, y tienen un estado asociado. Este mantenedor es utilizado para mantener el catálogo de fuentes que pueden ser asociadas a las operaciones de venta.

## 2. Componentes Principales

### 2.1 Backing Bean

- **Clase:** `cl.precuerdo.ventas.backingbeans.mantenedor.fuente.MantenedorFuenteBean`
- **Ubicación:** `src/main/java/cl/precuerdo/ventas/backingbeans/mantenedor/fuente/MantenedorFuenteBean.java`

### 2.2 Servicio

- **Interfaz:** `cl.precuerdo.ventas.service.fuente.FuenteService`
- **Implementación:** `cl.precuerdo.ventas.service.fuente.FuenteServiceImpl`
- **Ubicación:** `src/main/java/cl/precuerdo/ventas/service/fuente/FuenteServiceImpl.java`

### 2.3 Vista

- **Archivo:** `mantenedor_fuente.xhtml`
- **Ubicación:** `src/main/webapp/pages/ventas/mantenedores/fuente/mantenedor_fuente.xhtml`

## 3. Carga Inicial de Datos

El método `init()` se ejecuta cuando se accede al mantenedor:

```java
public void init() {
    setPopUpmantenedorFuente(false);
    obtenerDatosFuentes(null);
    setTipoFuenteSeleccionado(new Fuente());
}
```

### 3.1 Lista de Fuentes

Se carga automáticamente con todas las fuentes disponibles mediante `obtenerDatosFuentes(null)`.

### 3.2 Dropdowns del Popup

Los dropdowns (Categoría, Grupo y Estado) se inicializan cuando se abre el popup de nuevo/modificar mediante el método `initDropDownPopUp()`:

```java
public void initDropDownPopUp() {
    setDrpCategoria(new DropDownBean<Dominio>());
    getDrpCategoria().setItems(getFuenteService().obtenerListaCategorias());
    getDrpCategoria().setLabelProperty("descripcion");

    setDrpGrupo(new DropDownBean<Dominio>());
    getDrpGrupo().setItems(getFuenteService().obtenerListaGrupos());
    getDrpGrupo().setLabelProperty("descripcion");

    setDrpEstado(new DropDownBean<Estado>());
    getDrpEstado().setItems(getFuenteService().obtenerListaEstados());
    getDrpEstado().setLabelProperty("descripcion");
}
```

Este método carga los datos para cada dropdown desde la base de datos mediante el servicio `FuenteService`:

- **Categoría:** Se obtiene mediante `obtenerListaCategorias()` que consulta el dominio `DM_CAT_FNTE` (extraer valor real de las constantes)
- **Grupo:** Se obtiene mediante `obtenerListaGrupos()` que consulta el dominio `DM_GRPO_FNTE`  (extraer valor real de las constantes)
- **Estado:** Se obtiene mediante `obtenerListaEstados()` que consulta el dominio `DM_ESTA_COD`  (extraer valor real de las constantes)

Todos los dropdowns utilizan la misma función Oracle `VTAPAR.VTA_GET_LST_DOMINIO`, pero con diferentes valores del parámetro `P_REF_DOM` (ver sección 6.1 para más detalles).

### 3.3 Carga de Datos al Ingresar Nueva Fuente

Cuando el usuario hace clic en el botón "Nuevo", se ejecuta el método `ingresarTipoFuente()`:

```java
public void ingresarTipoFuente() {
    setTipoFuenteSeleccionado(new Fuente());
    initDropDownPopUp();
    setPopUpmantenedorFuente(true);
    setModificar(false);
}
```

**Flujo paso a paso:**

1. **Crear nueva instancia:** Se crea un nuevo objeto `Fuente` vacío mediante `new Fuente()`
2. **Inicializar dropdowns:** Se llama a `initDropDownPopUp()` que:
   - Inicializa cada dropdown (`drpCategoria`, `drpGrupo`, `drpEstado`)
   - Carga las opciones desde la base de datos mediante el servicio
   - Establece la propiedad de etiqueta como "descripcion" para mostrar el texto descriptivo
3. **Abrir popup:** Se establece `popUpmantenedorFuente = true` para mostrar el formulario
4. **Modo nuevo:** Se establece `modificar = false` para indicar que es una creación, no una modificación

> **Nota importante:** Los datos de los dropdowns se cargan desde la base de datos cada vez que se abre el popup, asegurando que siempre se muestren las opciones más actualizadas disponibles en el sistema.

## 4. Funcionamiento del Mantenedor

### 4.1 Carga Inicial de Fuentes

Al cargar el mantenedor, se muestran todas las fuentes disponibles:

```java
private void obtenerDatosFuentes(Operacion operacion) {
    setLstFuente(getFuenteService().obtenerDatosFuentes(operacion));
}
```

#### 4.1.1 Flujo Técnico de Carga Inicial

El proceso de carga inicial de fuentes sigue el siguiente flujo:

1. **Vista XHTML:** Llama a `MantenedorFuenteBean.getIniciar()`
2. **Bean:** `init()` → llama a `obtenerDatosFuentes(null)`
3. **Bean:** `obtenerDatosFuentes(null)` → llama a `FuenteService.obtenerDatosFuentes(null)`
4. **Servicio:** `obtenerDatosFuentes(null)` → llama a `obtenerFuentes(null, null, null)`

##### Función Oracle Utilizada

| Propiedad | Valor |
|-----------|-------|
| Función | `VTA_GET_LST_FUENTE` |
| Package | `PKVTA_SERVICIOS_WEB` |
| Schema | `VTAPAR` |

##### Parámetros Pasados a la Función Oracle

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `P_fnte_esta_cod` | `null` | Sin filtro de estado |
| `P_fnte_cod` | `null` | Sin filtro de código |
| `P_vtop_cod` | `null` | Sin filtro de operación (no se setea porque operacion == null) |

##### Conversión de Datos

Los resultados (`Vta_get_lst_fuenteRetornoRS`) se convierten a objetos `Fuente` mediante `FuenteConverter.convertirFuente()`. La lista resultante se asigna a `lstFuente` en el bean.

> **Resultado:** Se obtienen todas las fuentes sin filtros (estado, código u operación).

### 4.2 Ingresar Fuente

Al hacer clic en el botón "Nuevo" en la vista, se ejecuta el método `ingresarTipoFuente()` del bean:

```java
public void ingresarTipoFuente() {
    setTipoFuenteSeleccionado(new Fuente());
    initDropDownPopUp();
    setPopUpmantenedorFuente(true);
    setModificar(false);
}
```

**Proceso detallado:**

1. **Crear nueva instancia:** Se crea un nuevo objeto `Fuente` vacío que se asigna a `tipoFuenteSeleccionado`
2. **Inicializar dropdowns:** Se ejecuta `initDropDownPopUp()` que:
   - Crea instancias de `DropDownBean` para cada dropdown
   - Llama al servicio para obtener las listas de opciones:
     - `obtenerListaCategorias()` → consulta dominio `DM_CAT_FNTE`
     - `obtenerListaGrupos()` → consulta dominio `DM_GRPO_FNTE`
     - `obtenerListaEstados()` → consulta dominio `DM_ESTA_COD`
   - Establece la propiedad de etiqueta como "descripcion" para mostrar textos descriptivos
3. **Mostrar popup:** Se establece `popUpmantenedorFuente = true` para mostrar el formulario modal
4. **Modo creación:** Se establece `modificar = false` para indicar que es una operación de inserción

**Resultado:** El usuario ve un formulario vacío con los tres dropdowns (Categoría, Grupo, Estado) cargados con todas las opciones disponibles desde la base de datos.

### 4.3 Modificar Fuente

Al hacer clic en "Regularizar" después de seleccionar una fuente:

1. Se inicializan los dropdowns del popup
2. Se cargan los datos de la fuente seleccionada
3. Se establecen los valores en los dropdowns (categoría, grupo, estado)
4. Se muestra el popup de edición
5. Se establece `modificar = true`

### 4.4 Aceptar Fuente

Cuando el usuario presiona el botón "Aceptar" en el popup, se ejecuta el método `aceptar()`:

```java
public void aceptar() {
    cargarTipoFuente();
    
    if (!isModificar()) {
        getFuenteService().insertarTipoFuente(getTipoFuenteSeleccionado());
        FacesUtils.addMensajeAlertInfo("Se ha creado un nuevo Tipo de Fuente con código " + 
            getTipoFuenteSeleccionado().getCodigo());
        init();
        setPopUpmantenedorFuente(false);
    } else {
        getFuenteService().modificarTipoFuente(getTipoFuenteSeleccionado());
        FacesUtils.addMensajeAlertInfo("Se ha modificado el Tipo de Fuente con código " + 
            getTipoFuenteSeleccionado().getCodigo());
        init();
        setPopUpmantenedorFuente(false);
    }
}
```

#### 4.4.1 Cargar Datos del Formulario

Primero se ejecuta `cargarTipoFuente()` para transferir los valores seleccionados en los dropdowns al objeto `Fuente`:

```java
private void cargarTipoFuente() {
    getTipoFuenteSeleccionado().setCategoria(drpCategoria.getValue());
    getTipoFuenteSeleccionado().setEstado(drpEstado.getValue());
    getTipoFuenteSeleccionado().setGrupo(drpGrupo.getValue());
}
```

Este método toma los valores seleccionados de cada dropdown y los asigna al objeto `tipoFuenteSeleccionado`.

#### 4.4.2 Insertar Nueva Fuente

Si `modificar = false`, se ejecuta `insertarTipoFuente()`:

```java
@Transactional(propagation = Propagation.REQUIRED)
public void insertarTipoFuente(Fuente fuente) {
    logger.info("Insertar un Tipo de Fuente : " + fuente.toString());
    
    Vta_fuente vtafuente = new Vta_fuente();
    vtafuente = FuenteConverter.getFuente(fuente);
    vtafuente.setVersion(ConstantesVentas.VERSION_INICIAL);
    
    this.getVtaparCrudServices().getVta_fuenteService().executeInsert(vtafuente);
}
```

**Proceso:**

1. Se convierte el objeto `Fuente` a `Vta_fuente` mediante `FuenteConverter.getFuente()`
2. Se establece la versión inicial (valor = 1)
3. Se ejecuta `executeInsert()` que realiza un `INSERT` directo en la tabla `VTAPAR.VTA_FUENTE`

#### 4.4.3 Modificar Fuente Existente

Si `modificar = true`, se ejecuta `modificarTipoFuente()`:

```java
@Transactional(propagation = Propagation.REQUIRED)
public void modificarTipoFuente(Fuente fuente) {
    logger.info("Modificar un Tipo de Fuente : " + fuente.toString());
    
    Vta_fuente vtafuente = new Vta_fuente();
    vtafuente = FuenteConverter.getFuente(fuente);
    
    this.getVtaparCrudServices().getVta_fuenteService().executeUpdate(vtafuente);
}
```

**Proceso:**

1. Se convierte el objeto `Fuente` a `Vta_fuente` mediante `FuenteConverter.getFuente()`
2. Se ejecuta `executeUpdate()` que realiza un `UPDATE` directo en la tabla `VTAPAR.VTA_FUENTE` usando `FNTE_COD` como clave primaria

#### 4.4.4 Conversión de Datos

El método `FuenteConverter.getFuente()` convierte el objeto del modelo de negocio al objeto de persistencia:

```java
public static Vta_fuente getFuente(Fuente fuente) {
    Vta_fuente vtafuente = new Vta_fuente();
    
    vtafuente.setFnte_cate(fuente.getCategoria().getCodigo());
    vtafuente.setFnte_desc(fuente.getDescripcion());
    vtafuente.setFnte_cod(fuente.getCodigo());
    vtafuente.setFnte_esta_cod(fuente.getEstado().getCodigo());
    vtafuente.setFnte_grpo(fuente.getGrupo().getCodigo());
    vtafuente.setVersion(fuente.getVersion());
    
    return vtafuente;
}
```

> ⚠️ **Importante:** No se utiliza un procedimiento almacenado específico. Las operaciones de INSERT y UPDATE se realizan directamente sobre la tabla `VTAPAR.VTA_FUENTE` mediante el framework CRUD del proyecto. Los campos `FNTE_USER_MOD` y `FNTE_FEC_MOD` se establecen automáticamente (probablemente mediante triggers o el framework).

## 5. Eventos y Cambios (Change Events)

Este mantenedor no tiene eventos `onchange` configurados. La interacción se realiza mediante botones que ejecutan métodos del bean.

## 6. Funciones de Oracle

### 6.1 VTA_GET_LST_DOMINIO (Para Dropdowns)

Esta función se utiliza para cargar los datos de los dropdowns (Categoría, Grupo y Estado) cuando se abre el popup para ingresar o modificar una fuente.

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

La misma función se utiliza para los tres dropdowns, pero con diferentes valores del parámetro `P_REF_DOM`:

| Dropdown | P_REF_DOM | Constante Java | P_ORD_BY | Otros Parámetros |
|----------|-----------|---------------|----------|------------------|
| **Categoría** | `DM_CAT_FNTE` | `DOMINIO_FUENTE_CATEGORIA` | `"2"` | P_COUNT=0, P_OFFSET=0, P_NUMREG=0, P_LOW_VAL=null, P_REF_ABR=null |
| **Grupo** | `DM_GRPO_FNTE` | `DOMINIO_GRPO_FUENTE` | `"2"` | P_COUNT=0, P_OFFSET=0, P_NUMREG=0, P_LOW_VAL=null, P_REF_ABR=null |
| **Estado** | `DM_ESTA_COD` | `DOMINIO_ESTADO_CODIGO` | `"2"` | P_COUNT=0, P_OFFSET=0, P_NUMREG=0, P_LOW_VAL=null, P_REF_ABR=null |

#### Flujo de Ejecución

1. **Bean:** `initDropDownPopUp()` llama a los métodos del servicio
2. **Servicio:** Cada método (`obtenerListaCategorias()`, `obtenerListaGrupos()`, `obtenerListaEstados()`) llama a `super.obtenerDominio(codigoDominio)`
3. **Base Service:** `VentasServiceBase.obtenerDominio()` prepara los parámetros y ejecuta `vtaparServices.getVta_get_lst_dominioService().execute(params)`
4. **Oracle:** Se ejecuta la función `VTAPAR.VTA_GET_LST_DOMINIO` que internamente llama a `PKVTA_SERVICIOS_WEB.getLstdominio`
5. **Resultado:** Se retorna un cursor con los registros de la tabla `cod_ref` filtrados por el dominio especificado
6. **Conversión:** Los resultados se mapean a objetos `Dominio` o `Estado` con código y descripción

> **Nota:** La función consulta la tabla `cod_ref` (tabla de dominios) filtrada por el código de dominio especificado en `P_REF_DOM`. Los campos retornados incluyen `ref_low_val` (código) y `ref_mng` (descripción).

### 6.2 VTA_GET_LST_FUENTE

| Propiedad | Valor |
|-----------|-------|
| Schema | VTAPAR |
| Package | PKVTA_SERVICIOS_WEB |
| Tipo | FUNCTION |
| Retorno | SYS_REFCURSOR |

#### Parámetros de Entrada

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| P_COUNT | NUMBER | Control de paginación |
| P_OFFSET | NUMBER | Desplazamiento para paginación |
| P_NUMREG | NUMBER | Número de registros |
| P_ORD_BY | VARCHAR2 | Order by en formato (1,2,..n) |
| P_FNTE_COD | VARCHAR2 | Código de la fuente a filtrar (opcional) |
| P_FNTE_ESTA_COD | VARCHAR2 | Estado a filtrar (opcional) |
| P_FNTE_CATE | VARCHAR2 | Categoría a filtrar (opcional) |
| P_FNTE_GRPO | VARCHAR2 | Grupo a filtrar (opcional) |
| P_VTOP_COD | NUMBER | Código de operación a filtrar (opcional) |

#### Parámetros de Salida

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| P_TOT_REG | NUMBER | Total de registros en la consulta |
| P_COD_ERR | NUMBER | Código de error |
| P_DES_ERR | VARCHAR2 | Descripción del error |
| RETURN | SYS_REFCURSOR | Cursor con las fuentes (FNTE_COD, FNTE_DESC, FNTE_CATE, FNTE_GRPO, FNTE_ESTA_COD) |

### 6.3 VTA_FUENTE (Operaciones CRUD)

> ⚠️ **Importante:** No se utiliza un procedimiento almacenado específico para insertar o modificar fuentes. Las operaciones se realizan directamente sobre la tabla mediante el framework CRUD del proyecto.

| Propiedad | Valor |
|-----------|-------|
| Schema | VTAPAR |
| Tabla | VTA_FUENTE |
| Tipo de Operación | CRUD Directo (INSERT/UPDATE) |
| Framework | VtaparCrudServices |

#### 6.3.1 Estructura de la Tabla

La tabla `VTAPAR.VTA_FUENTE` tiene la siguiente estructura:

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `FNTE_COD` | VARCHAR2(10) | Código de la fuente (Clave Primaria) | Sí |
| `FNTE_DESC` | VARCHAR2(40) | Descripción de la fuente | Sí |
| `FNTE_CATE` | VARCHAR2(20) | Categoría de la fuente (CHECK: 'CONTARJETA','SINTARJETA') | Sí |
| `FNTE_GRPO` | VARCHAR2(20) | Grupo de la fuente | Sí |
| `FNTE_ESTA_COD` | VARCHAR2(20) | Estado de la fuente (CHECK: 'VIGENTE', 'NOVIGENTE') | Sí |
| `FNTE_USER_MOD` | VARCHAR2(30) | Usuario que modificó el registro | Sí |
| `FNTE_FEC_MOD` | DATE | Fecha de modificación del registro | Sí |
| `VERSION` | NUMBER(5,0) | Versión del registro (inicial = 1) | Sí |

#### 6.3.2 Operación INSERT (Nueva Fuente)

Cuando se crea una nueva fuente, se ejecuta:

```java
this.getVtaparCrudServices().getVta_fuenteService().executeInsert(vtafuente);
```

**Parámetros que se insertan:**

| Campo | Origen | Valor |
|-------|--------|-------|
| `FNTE_COD` | Campo "Código" del formulario | Valor ingresado por el usuario |
| `FNTE_DESC` | Campo "Descripción" del formulario | Valor ingresado por el usuario |
| `FNTE_CATE` | Dropdown "Categoría" | Código de la categoría seleccionada (ej: "CONTARJETA", "SINTARJETA") |
| `FNTE_GRPO` | Dropdown "Grupo" | Código del grupo seleccionado |
| `FNTE_ESTA_COD` | Dropdown "Estado" | Código del estado seleccionado (ej: "VIGENTE", "NOVIGENTE") |
| `VERSION` | Constante | 1 (ConstantesVentas.VERSION_INICIAL) |
| `FNTE_USER_MOD` | Automático | Usuario actual (establecido por trigger o framework) |
| `FNTE_FEC_MOD` | Automático | Fecha actual (establecida por trigger o framework) |

**SQL equivalente:**

```sql
INSERT INTO VTAPAR.VTA_FUENTE 
    (FNTE_COD, FNTE_DESC, FNTE_CATE, FNTE_GRPO, FNTE_ESTA_COD, VERSION, FNTE_USER_MOD, FNTE_FEC_MOD)
VALUES 
    (?, ?, ?, ?, ?, 1, ?, SYSDATE)
```

#### 6.3.3 Operación UPDATE (Modificar Fuente)

Cuando se modifica una fuente existente, se ejecuta:

```java
this.getVtaparCrudServices().getVta_fuenteService().executeUpdate(vtafuente);
```

**Parámetros que se actualizan:**

| Campo | Origen | Nota |
|-------|--------|------|
| `FNTE_COD` | Campo "Código" (readonly) | Se usa como clave para el WHERE (no se modifica) |
| `FNTE_DESC` | Campo "Descripción" del formulario | Puede ser modificado |
| `FNTE_CATE` | Dropdown "Categoría" | Puede ser modificado |
| `FNTE_GRPO` | Dropdown "Grupo" | Puede ser modificado |
| `FNTE_ESTA_COD` | Dropdown "Estado" | Puede ser modificado |
| `VERSION` | Objeto Fuente | Se mantiene la versión existente |
| `FNTE_USER_MOD` | Automático | Usuario actual (actualizado por trigger o framework) |
| `FNTE_FEC_MOD` | Automático | Fecha actual (actualizada por trigger o framework) |

**SQL equivalente:**

```sql
UPDATE VTAPAR.VTA_FUENTE 
SET FNTE_DESC = ?,
    FNTE_CATE = ?,
    FNTE_GRPO = ?,
    FNTE_ESTA_COD = ?,
    VERSION = ?,
    FNTE_USER_MOD = ?,
    FNTE_FEC_MOD = SYSDATE
WHERE FNTE_COD = ?
```

> ⚠️ **Nota importante:** Los campos `FNTE_USER_MOD` y `FNTE_FEC_MOD` pueden ser establecidos automáticamente mediante triggers en la base de datos Oracle o por el framework CRUD. Es recomendable verificar si existen triggers asociados a la tabla `VTA_FUENTE`.

## 7. Flujo de Trabajo

1. **Carga inicial:** Se cargan automáticamente todas las fuentes disponibles
2. **Nuevo Fuente:** Usuario hace clic en "Nuevo" → Se muestra popup → Usuario ingresa código y descripción → Selecciona categoría, grupo y estado → Se graba
3. **Modificar Fuente:** Usuario selecciona fuente → Hace clic en "Regularizar" → Se cargan datos → Usuario modifica → Se graba

## 8. Validaciones

- El código de la fuente es obligatorio
- La descripción es obligatoria
- La categoría es obligatoria
- El grupo es obligatorio
- El estado es obligatorio

## 9. Consideraciones Técnicas

> ⚠️ **Importante:**
> 
> - La lista de fuentes se carga automáticamente al iniciar el mantenedor mediante la función `VTA_GET_LST_FUENTE`
> - No hay filtros de búsqueda, se muestran todas las fuentes
> - La tabla utiliza paginación con 10 registros por página
> - El mantenedor utiliza operaciones CRUD directas (INSERT/UPDATE) sobre la tabla `VTA_FUENTE`, no se utiliza un procedimiento almacenado específico
> - Los dropdowns de categoría, grupo y estado se cargan desde dominios mediante la función `VTA_GET_LST_DOMINIO` cada vez que se abre el popup
> - Al crear una nueva fuente, se establece la versión inicial (valor = 1) automáticamente
> - Los campos `FNTE_USER_MOD` y `FNTE_FEC_MOD` se establecen automáticamente (probablemente mediante triggers o el framework CRUD)
> - La función `VTA_GET_LST_DOMINIO` se utiliza para los tres dropdowns con diferentes valores del parámetro `P_REF_DOM`:
>   - Categoría: `DM_CAT_FNTE`
>   - Grupo: `DM_GRPO_FNTE`
>   - Estado: `DM_ESTA_COD`
> - Las operaciones de inserción y actualización están marcadas como `@Transactional`, por lo que Spring maneja los commits y rollbacks automáticamente

## 10. Resumen de Funciones Oracle Utilizadas

| Función | Schema | Propósito | Cuándo se Ejecuta |
|---------|--------|-----------|-------------------|
| `VTA_GET_LST_DOMINIO` | VTAPAR | Cargar opciones de los dropdowns (Categoría, Grupo, Estado) | Al hacer clic en "Nuevo" o "Regularizar" (cuando se abre el popup) |
| `VTA_GET_LST_FUENTE` | VTAPAR | Obtener lista de todas las fuentes | Al cargar el mantenedor inicialmente |
| `INSERT INTO VTA_FUENTE` | VTAPAR | Insertar nueva fuente | Al presionar "Aceptar" en modo creación |
| `UPDATE VTA_FUENTE` | VTAPAR | Actualizar fuente existente | Al presionar "Aceptar" en modo modificación |

## 11. DDL de la tabla VTAPAR.VTA_FUENTE 

-- VTAPAR.VTA_FUENTE definition

CREATE TABLE "VTAPAR"."VTA_FUENTE" 
   ("FNTE_COD" VARCHAR2(10) NOT NULL ENABLE, 
	"FNTE_CATE" VARCHAR2(20) NOT NULL ENABLE, 
	"FNTE_GRPO" VARCHAR2(20) NOT NULL ENABLE, 
	"FNTE_DESC" VARCHAR2(40) NOT NULL ENABLE, 
	"FNTE_ESTA_COD" VARCHAR2(20) NOT NULL ENABLE, 
	"FNTE_USER_MOD" VARCHAR2(30) NOT NULL ENABLE, 
	"FNTE_FEC_MOD" DATE NOT NULL ENABLE, 
	"VERSION" NUMBER(5,0) NOT NULL ENABLE, 
	 CONSTRAINT "VTA_FUENTE_CATE_CH" CHECK (fnte_cate IN ('CONTARJETA','SINTARJETA')
) ENABLE, 
	 CONSTRAINT "VTA_FNTE_ESTA_COD_CH" CHECK (FNTE_ESTA_COD IN ('VIGENTE', 'NOVIGENTE')) ENABLE, 
	 CONSTRAINT "VTA_FUENTE_PK" PRIMARY KEY ("FNTE_COD") ENABLE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "DATOS"   NO INMEMORY ;

GRANT DELETE ON "VTAPAR"."VTA_FUENTE" TO "BSGTI";
  GRANT INSERT ON "VTAPAR"."VTA_FUENTE" TO "BSGTI";
  GRANT SELECT ON "VTAPAR"."VTA_FUENTE" TO "BSGTI";
  GRANT UPDATE ON "VTAPAR"."VTA_FUENTE" TO "BSGTI";

