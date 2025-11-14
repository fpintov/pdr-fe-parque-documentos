# Angular 12 - Accordion Sidebar Menu App

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 12.2.18.

## Características

- ✅ Sidenav contraíble con menú de navegación
- ✅ Angular Material integrado
- ✅ Módulos principales configurados:
  - Dashboard
  - Usuarios
  - Productos
  - Ventas
  - Reportes
  - Configuración

## Desarrollo

### Requisitos previos

- Node.js 12.x o superior
- npm 6.x o superior

### Instalación

```bash
npm install
```

### Ejecutar la aplicación

```bash
npm start
```

La aplicación se abrirá en `http://localhost:4200/`

### Compilar para producción

```bash
npm run build
```

Los archivos compilados se guardarán en la carpeta `dist/`.

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes de los módulos
│   │   ├── dashboard/
│   │   ├── usuarios/
│   │   ├── productos/
│   │   ├── ventas/
│   │   ├── reportes/
│   │   └── configuracion/
│   ├── app.component.*       # Componente principal con sidenav
│   ├── app.module.ts         # Módulo principal
│   └── app-routing.module.ts # Configuración de rutas
└── styles.css                # Estilos globales
```

## Uso del Sidenav

El sidenav se puede contraer/expandir haciendo clic en el botón de menú (☰) en la barra de herramientas superior. Cuando está contraído, solo se muestran los iconos de los elementos del menú.

## Nota sobre Node.js 17+

Si estás usando Node.js 17 o superior y encuentras errores de compilación relacionados con OpenSSL, puedes:

1. Usar Node.js 16.x o inferior, o
2. Instalar `cross-env` y actualizar los scripts en `package.json`:

```bash
npm install --save-dev cross-env
```

Luego actualizar los scripts:
```json
"start": "cross-env NODE_OPTIONS=--openssl-legacy-provider ng serve",
"build": "cross-env NODE_OPTIONS=--openssl-legacy-provider ng build"
```

## Personalización

Puedes personalizar los elementos del menú editando el array `menuItems` en `src/app/app.component.ts`.
