# Página de Emergencia para Registro de Ventas

## Descripción

Este proyecto consiste en una página web desarrollada con HTML, CSS y JavaScript que permite gestionar productos y registrar ventas de forma rápida y sencilla. Fue creada como una solución temporal para el control de ventas y catálogo de productos, utilizando el almacenamiento local del navegador (LocalStorage) para guardar la información sin necesidad de una base de datos o servidor.

## Características

### Gestión de Productos

* Registro de productos.
* Registro opcional de imágenes.
* Modificación de productos existentes.
* Eliminación de productos.
* Visualización de productos registrados.

### Registro de Ventas

* Ingreso obligatorio del nombre del cliente.
* Búsqueda de productos mediante autocompletado.
* Registro de cantidad por producto.
* Aplicación de descuentos por producto.
* Cálculo automático de subtotales y total de la venta.
* Eliminación de productos del detalle de venta.
* Persistencia temporal de la venta al cambiar de página.

### Historial de Ventas

* Visualización de ventas registradas.
* Consulta del detalle de cada venta.
* Generación de comprobantes en formato PDF.
* Compartir información de la venta mediante WhatsApp.
* Eliminación individual de ventas.
* Eliminación completa del historial.

### Respaldo de Información

* Exportación de productos a formato JSON.
* Importación de productos desde archivos JSON.
* Exportación de ventas a formato JSON.
* Exportación de ventas a formato CSV compatible con Excel.

## Tecnologías Utilizadas

* HTML5
* CSS3
* JavaScript
* LocalStorage
* jsPDF
* GitHub Pages

## Estructura del Proyecto

* productos.html
* productos.js
* producto.css
* ventas.html
* ventas.js
* ventas.css
* historial.html
* historial.js

## Funcionamiento

Toda la información es almacenada localmente en el navegador mediante LocalStorage, permitiendo que los datos permanezcan disponibles incluso después de cerrar la página. Además, se incorporaron funciones de exportación e importación para facilitar la realización de respaldos y la recuperación de información.

## Estado del Proyecto

Proyecto desarrollado como solución temporal para la administración de productos y ventas, con posibilidad de evolucionar posteriormente hacia una arquitectura más robusta utilizando una API y una base de datos centralizada.

## Aplicación instalable (PWA)

Las cuatro pantallas, sus estilos, scripts y la biblioteca jsPDF se guardan en caché para funcionar sin internet después de la primera carga completa. Espera el mensaje «Aplicación lista para usar sin conexión» antes de desconectarte. Las imágenes cargadas desde archivos se conservan con los productos; las imágenes con enlaces externos importadas en JSON necesitan conexión.

### Abrir e instalar

Para probar en esta PC con Node.js instalado, presiona **F5** en VS Code y selecciona **Abrir PWA en Chrome**. La tarea inicia el servidor automáticamente. También puedes ejecutar `node server.cjs` y abrir `http://127.0.0.1:8080`. Detén el servidor con Ctrl+C cuando termines. Si ya lo iniciaste manualmente, abre esa dirección directamente en lugar de iniciar una segunda copia con F5.

El botón muestra **Instalar aplicación** cuando el navegador ofrece la instalación real. Mientras no esté disponible, muestra **Cómo instalar la app**. Una PWA no descarga un archivo APK o EXE.

1. Publica esta carpeta completa en un servidor HTTPS, por ejemplo GitHub Pages. También funciona bajo una subcarpeta. Para desarrollo, usa un servidor local (por ejemplo Live Server de VS Code) y abre `http://localhost:5500`. Abrir el HTML con `file://` no permite instalar la PWA.
2. En Chrome o Edge, utiliza «Instalar aplicación» cuando aparezca, o la opción de instalación del navegador. La disponibilidad depende del navegador.
3. En iPhone/iPad, abre la página en Safari y utiliza Compartir → Añadir a pantalla de inicio.

Los datos siguen guardándose en LocalStorage, por navegador y origen (protocolo, dominio y puerto). No se sincronizan entre dispositivos. Si antes abrías los archivos directamente o cambias de dirección, los datos no se trasladan automáticamente. Exporta tus respaldos antes de cambiar; actualmente la interfaz permite importar productos, pero no ventas. Borrar los datos del sitio también elimina los registros locales.

### Actualizaciones

Incrementa `VERSION` en `sw.js` cada vez que publiques cambios en los archivos cacheados. Publica todos los archivos juntos. La nueva versión se descarga al visitar con conexión y se activa al cerrar todas las ventanas de la aplicación y volver a abrirla. No se recarga automáticamente una venta en curso.

### Comprobar en el navegador

1. Abre la aplicación con conexión y espera que esté lista para usar sin conexión.
2. En las herramientas de desarrollo, comprueba el manifiesto y el service worker en Application.
3. Activa Offline en Network y recarga. Visita Categorías, Productos, Ventas e Historial; crea un producto y una venta de prueba y genera su PDF.
4. Comprueba la instalación y la apertura desde el icono del dispositivo.

Referencia: [Requisitos de instalación de PWA (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).
