# 012 - Corrección del Módulo de Citas y Agenda

**Fecha:** 12 de Mayo de 2026
**Módulo:** Frontend (Angular)

## Descripción del Problema
Se reportaron tres defectos críticos en el sistema de agendamiento:

1. **Las citas no se mostraban en la Agenda Global:** Al navegar a `/agenda` desde el menú principal, el calendario aparecía vacío a pesar de que existían citas en la base de datos.
2. **Las citas del paciente requerían Ctrl+F5:** En la vista contextual `/pacientes/:id/:representado/citas`, las citas solo aparecían tras forzar una recarga completa del navegador.
3. **El modal de edición no se abría al hacer click:** Al hacer click sobre un evento del calendario, no se desplegaba la ventana modal para editar o eliminar la cita.

Adicionalmente, se corrigió:
4. **Calendario en inglés:** Los textos del calendario (días, meses, botones) aparecían en inglés en lugar de español.

## Causa Raíz (Diagnóstico Técnico)

Los tres primeros problemas compartían la **misma causa raíz** relacionada con cómo FullCalendar para Angular maneja la detección de cambios:

| Problema | Causa Técnica |
|----------|---------------|
| Eventos no aparecen | La asignación `this.calendarOptions.events = events` no dispara la detección de cambios de Angular porque es la misma referencia de objeto. |
| Requería Ctrl+F5 | Los eventos se intentaban cargar en `ngOnInit()`, antes de que el componente `<full-calendar>` estuviera completamente montado en el DOM. |
| Modal no abría | Los callbacks `eventClick`, `select` y `eventDrop` se definían con `.bind(this)` en la inicialización de propiedades de clase, perdiendo el contexto de Angular para la detección de cambios. |
| Idioma en inglés | Faltaba la configuración de `locale` en las opciones del calendario. |

## Cambios Realizados

### Frontend — `agenda-global.component.ts` (Agenda Global)
- Se agregó `@ViewChild('calendar')` para obtener una referencia directa al componente `<full-calendar>`.
- Se reemplazó `this.calendarOptions.events = events` por el uso de la API directa del calendario: `calendarApi.removeAllEvents()` + `calendarApi.addEvent()`.
- Se movió la carga de citas de `ngOnInit()` a `ngAfterViewInit()` con un `setTimeout` para garantizar que el calendario esté montado.
- Se cambiaron los callbacks de `.bind(this)` a **arrow functions** para mantener el contexto léxico de `this`.
- Se inyectó `ChangeDetectorRef` y se llama `this.cdr.detectChanges()` en `handleEventClick()`, `handleDateSelect()`, `openNuevaCitaModal()` y `closeModal()` para forzar que Angular actualice la vista del modal.
- Se agregó `import esLocale from '@fullcalendar/core/locales/es'` y la propiedad `locale: esLocale` en las opciones del calendario.

### Frontend — `agenda-global.component.html`
- Se reemplazó `<full-calendar *ngIf="calendarVisible" [options]="calendarOptions">` por `<full-calendar #calendar [options]="calendarOptions">`, eliminando el `*ngIf` innecesario y agregando la referencia de template `#calendar` requerida por `@ViewChild`.

### Frontend — `paciente-citas.component.ts` (Citas del Paciente)
- Se aplicaron las mismas correcciones que en la Agenda Global: `@ViewChild`, API directa del calendario, arrow functions, `ChangeDetectorRef` y locale en español.
- Se corrigió la lectura de parámetros de ruta: al ser un componente hijo (child route de `pacientes/:id/:representado`), los parámetros `:id` y `:representado` no están disponibles en `this.route.params` directamente. Se cambió a `this.route.parent.params` para acceder correctamente a los parámetros de la ruta padre.
- Se agregó la referencia `#calendar` en el template inline.

## Archivos Modificados
| Archivo | Tipo de Cambio |
|---------|---------------|
| `frontend/src/app/components/agenda/agenda-global/agenda-global.component.ts` | Reescritura de lógica de carga y callbacks |
| `frontend/src/app/components/agenda/agenda-global/agenda-global.component.html` | Template reference `#calendar` |
| `frontend/src/app/components/pacientes/paciente-citas/paciente-citas.component.ts` | Reescritura de lógica + fix de route params |

## Estado Final
- ✅ Las citas se muestran correctamente en la Agenda Global sin necesidad de recargar.
- ✅ Las citas del paciente se cargan automáticamente al navegar a la pestaña "Citas".
- ✅ Al hacer click sobre cualquier cita, se abre el modal "Editar Cita" con los datos pre-cargados y el botón "Eliminar Cita" visible.
- ✅ Todo el calendario está en español (días, meses, botones: "Hoy", "Mes", "Semana", "Día").
- ✅ La funcionalidad existente (crear, editar, arrastrar y soltar citas) continúa operando normalmente.
