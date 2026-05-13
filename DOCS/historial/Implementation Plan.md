mplementación del Dashboard y Seguridad en Frontend
Este plan detalla los pasos para completar el flujo de inicio de sesión de SoluDent 2.0 creando el Dashboard principal, implementando la protección de rutas y configurando el interceptor HTTP.

Proposed Changes
Interceptor y Guard de Autenticación
Implementaremos la lógica base para la seguridad y el manejo del token en el frontend.

[NEW] frontend/src/app/core/guards/auth.guard.ts
Se creará un CanActivateFn que verifique la existencia de un token en el localStorage.
Si el token existe, permitirá el acceso a la ruta protegida.
Si no existe, redirigirá automáticamente a la pantalla de login.
[NEW] frontend/src/app/core/interceptors/auth.interceptor.ts
Se creará un HttpInterceptorFn que clonará las peticiones salientes para inyectar la cabecera Authorization: Bearer <token>.
Manejará casos donde el token no exista (no adjuntará nada) y permitirá añadir manejo global de errores (ej. 401 Unauthorized para limpiar el token y desloguear).
Componente Dashboard
El componente donde los usuarios autenticados llegarán tras iniciar sesión.

[NEW] frontend/src/app/components/dashboard/dashboard.ts
Componente "standalone" básico del Dashboard.
Incluirá un método simple de "logout" que limpiará el token y redirigirá al login.
[NEW] frontend/src/app/components/dashboard/dashboard.html
Maquetado base del dashboard con una barra lateral (sidebar) provisional y un área de contenido, manteniendo la estética de la app.
[NEW] frontend/src/app/components/dashboard/dashboard.scss
Estilos correspondientes para dar una apariencia profesional de acuerdo con el Design System "Clinical Sanctuary".
Actualizaciones de Configuración y Rutas
Conectaremos las nuevas piezas creadas en la estructura principal.

[MODIFY] frontend/src/app/app.config.ts
Modificaremos provideHttpClient() para incluir el nuevo authInterceptor mediante withInterceptors([authInterceptor]).
[MODIFY] frontend/src/app/app.routes.ts
Añadiremos la ruta path: 'dashboard' que cargará el componente Dashboard y estará protegida por nuestro authGuard.
[MODIFY] frontend/src/app/components/auth/login/login.ts
Descomentaremos la redirección para que se ejecute this.router.navigate(['/dashboard']) al realizar un inicio de sesión exitoso.
Verification Plan
Manual Verification
Compilaremos la aplicación Angular.
Comprobaremos que si intentamos navegar directamente a http://localhost:4200/dashboard sin iniciar sesión, somos redirigidos a /login.
Iniciaremos sesión con credenciales válidas y verificaremos la redirección automática al Dashboard.
Probaremos el botón de "Cerrar sesión" en el Dashboard.
Verificaremos en las Herramientas para Desarrolladores del navegador (pestaña Red) que las peticiones al backend lleven la cabecera Authorization: Bearer ....