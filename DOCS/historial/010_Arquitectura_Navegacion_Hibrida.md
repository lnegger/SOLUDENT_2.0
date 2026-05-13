# 010 - Implementación de Arquitectura de Navegación Híbrida y Dashboard del Paciente

**Fecha:** 11 de Mayo de 2026
**Módulo:** Frontend (Angular)

## Descripción del Requerimiento
Se solicitó reorganizar la experiencia de usuario y la arquitectura de navegación de la aplicación para separar las opciones "Globales" de la clínica (Tablero, Agenda, Finanzas, Configuración) de las opciones "Contextuales" que pertenecen intrínsecamente a un paciente (Perfil, Odontograma, Citas del paciente, Presupuestos, Abonos).

El objetivo fue crear un menú lateral global que siempre esté presente, y una vista de "Dashboard del Paciente" con pestañas que se active únicamente al consultar o editar un paciente en particular, sin perder la funcionalidad actual.

## Cambios Realizados

### 1. Refactorización del Layout Global (`MainLayoutComponent`)
- **Problema Anterior:** El diseño de la barra lateral (Sidebar) y la barra superior (Topbar) estaba duplicado en el código HTML y SCSS de `Dashboard`, `PacientesList` y `PacienteForm`.
- **Solución:** Se creó un nuevo componente `MainLayout` en `src/app/core/layout/main-layout` que centraliza la barra lateral y la barra superior.
- Se implementó un `<router-outlet>` dentro de `MainLayout` para renderizar el contenido dinámico.
- Se movieron las variables de diseño y clases principales (como `.dashboard-layout` y `.sidebar`) al archivo `main-layout.scss` globalizando los estilos de estructura.
- Se reubicó la lógica de cierre de sesión (`logout()`) dentro del `MainLayout`.

### 2. Creación de la Vista Contextual (`PacienteDashboardComponent`)
- Se creó el componente `PacienteDashboard` en `src/app/components/pacientes/paciente-dashboard`.
- Este componente actúa como contenedor al abrir un paciente específico.
- **Funcionalidades:**
  - Extrae el `id` (Cédula) y el `representado` desde la URL (Ej: `/pacientes/12345678/00`).
  - Llama al servicio `PacienteService` para cargar y mostrar el nombre del paciente en el encabezado dinámicamente.
  - Implementa un menú de navegación horizontal (Tabs) con las siguientes rutas planificadas:
    - `perfil` (Muestra el `PacienteForm` en modo edición)
    - `odontograma`
    - `citas`
    - `presupuestos`
    - `abonos`

### 3. Adaptación de Componentes Existentes
- **`dashboard.html`, `pacientes-list.html`, `paciente-form.html`:** Se eliminó todo el código HTML duplicado relacionado con la barra lateral.
- **`paciente-form.html`:** Se agregaron condicionales `*ngIf="!isEditing()"` en el encabezado y las migas de pan (breadcrumbs) para que no se muestren cuando el formulario se inserta dentro del Dashboard del Paciente, logrando así una integración visual perfecta como una pestaña.

### 4. Actualización del Enrutamiento (`app.routes.ts`)
Se reestructuraron las rutas para soportar la anidación de componentes:
```typescript
{
  path: '',
  component: MainLayout, // Layout principal que contiene el Sidebar
  canActivate: [authGuard],
  children: [
    { path: 'dashboard', loadComponent: () => ... },
    { path: 'pacientes', loadComponent: () => ... },
    { path: 'pacientes/nuevo', loadComponent: () => ... }, // Formulario directo sin tabs
    { 
      path: 'pacientes/:id/:representado', 
      loadComponent: () => ...PacienteDashboard, // Contenedor de Tabs del paciente
      children: [
        { path: '', redirectTo: 'perfil', pathMatch: 'full' },
        { path: 'perfil', loadComponent: () => ...PacienteForm } // La pestaña 'Perfil' es el formulario de edición
      ]
    }
  ]
}
```

### 5. Correcciones y Optimizaciones Adicionales
- **Presupuesto CSS Angular:** Se eliminaron las importaciones múltiples de `@import url('https://fonts.googleapis.com/...');` en cada archivo `.scss` individual, consolidándolo todo al principio del archivo global `src/styles.scss`. Esto solucionó los errores de presupuesto máximo de CSS durante la compilación (`ng build`).
- Se actualizaron las referencias de navegación en el botón "Ver/Editar" de la lista de pacientes, redirigiendo correctamente a la nueva estructura (`/pacientes/CEDULA/REPRESENTADO`).

## Estado Final
- La compilación es exitosa.
- Todas las funcionalidades de listado, registro y edición continúan operando normalmente.
- La aplicación ahora cuenta con una arquitectura de UI híbrida, moderna y fácilmente escalable para los próximos módulos.
