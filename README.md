 # Sistema de Seguimiento de Miembros de Mesa

Aplicación web para registrar y consultar el seguimiento de miembros de mesa de Charat, Otuzco, para las Elecciones Regionales y Municipales 2026.

## Uso

Abre `index.html` en un navegador. La aplicación funciona sin servidor y guarda los cambios en `localStorage`.

Incluye:

- Dashboard con totales de mesas, miembros, contacto, capacitación y asistencia.
- Búsqueda y filtros combinados.
- Registro y edición con validación de DNI, celular, mesa y cargo duplicado.
- Estados visuales para contacto, capacitación y asistencia.
- Seguimiento de entrega de credencial, con forma física o virtual.
- Registro de asistencia correspondiente al 04 de octubre.
- Eliminación protegida de registros ingresados por error.
- Reporte Excel con resumen ejecutivo, detalle completo y hoja de pendientes.
- Cada mesa admite hasta 9 cargos: Presidente, Secretaria, Tercer miembro y seis suplentes.
- Cada persona puede tener una nota u observación de hasta 500 caracteres.
- El dashboard y el Excel incluyen el avance de cada mesa sobre sus 9 cargos.
- Para iniciar el uso real, utiliza **Más opciones > Eliminar todos los miembros** y confirma la operación.
- Respaldo JSON mediante descarga e importación.
- Restauración de los datos iniciales de ejemplo.

## Respaldo

Usa **Descargar respaldo** periódicamente. El archivo JSON permite recuperar los registros en otro momento desde **Importar respaldo**. Los datos también permanecen en el navegador mediante `localStorage`, pero pueden eliminarse al limpiar los datos del sitio.
