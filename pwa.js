(() => {
    const bar = document.createElement('aside');
    bar.className = 'pwa-bar';
    bar.setAttribute('aria-label', 'Aplicación');
    const status = document.createElement('span');
    status.setAttribute('role', 'status');
    const install = document.createElement('button');
    install.type = 'button';
    install.textContent = 'Cómo instalar la app';
    bar.append(status, install);
    document.querySelector('nav').after(bar);

    const help = document.createElement('dialog');
    help.className = 'pwa-help';
    help.setAttribute('aria-labelledby', 'pwa-help-title');
    help.innerHTML = `
        <h2 id="pwa-help-title">Instalar en móvil o PC</h2>
        <p>La aplicación se instala desde el navegador y aparece con su propio icono.</p>
        <ul>
            <li><strong>Android:</strong> en Chrome, abre el menú ⋮ y selecciona Instalar aplicación o Añadir a pantalla de inicio.</li>
            <li><strong>iPhone / iPad:</strong> en Safari, selecciona Compartir → Añadir a pantalla de inicio.</li>
            <li><strong>PC:</strong> en Chrome o Edge, busca Instalar aplicación en el menú o en la barra de direcciones.</li>
        </ul>
        <p>Abre la página desde HTTPS o localhost y espera a que termine de prepararse. Si ya está instalada, puedes abrirla desde su icono.</p>
        <p id="pwa-local-help" hidden>Estás abriendo un archivo local. En VS Code, presiona F5 y elige «Abrir PWA en Chrome». También puedes ejecutar node server.cjs en la terminal y abrir http://127.0.0.1:8080. Para instalar en otro dispositivo, publica la aplicación con HTTPS.</p>
        <form method="dialog"><button>Cerrar</button></form>`;
    document.body.append(help);
    help.querySelector('#pwa-local-help').hidden = location.protocol !== 'file:';

    let ready = false;
    let failed = false;
    let pendingInstall;
    const supported = 'serviceWorker' in navigator && window.isSecureContext
        && ['http:', 'https:'].includes(location.protocol);
    function updateStatus() {
        if (!supported) {
            status.textContent = location.protocol === 'file:'
                ? 'Archivo local: presiona F5 en VS Code para abrir la PWA desde el servidor local.'
                : 'Para instalar y usar sin conexión, abre la aplicación con HTTPS o localhost.';
        } else if (failed) {
            status.textContent = 'No se pudo preparar el modo sin conexión. Recarga con internet para reintentar.';
        } else if (!ready) {
            status.textContent = 'Preparando aplicación para usar sin conexión…';
        } else {
            status.textContent = navigator.onLine
                ? 'Aplicación lista para usar sin conexión.'
                : 'Sin conexión · Los datos se guardan en este dispositivo.';
        }
    }
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        pendingInstall = event;
        install.textContent = 'Instalar aplicación';
    });
    install.addEventListener('click', async () => {
        if (!pendingInstall) {
            help.showModal();
            return;
        }
        const prompt = pendingInstall;
        pendingInstall = null;
        install.textContent = 'Cómo instalar la app';
        try {
            await prompt.prompt();
            await prompt.userChoice;
        } catch (error) {
            help.showModal();
            console.warn('No se pudo abrir la instalación.', error);
        }
    });
    window.addEventListener('appinstalled', () => {
        pendingInstall = null;
        install.textContent = 'Aplicación instalada';
    });
    updateStatus();
    if (supported) {
        navigator.serviceWorker.register('./sw.js').then(registration => {
            function watch(worker) {
                if (!worker) return;
                worker.addEventListener('statechange', () => {
                    if (worker.state === 'redundant' && !registration.active) {
                        failed = true;
                        updateStatus();
                    }
                });
            }
            watch(registration.installing);
            registration.addEventListener('updatefound', () => watch(registration.installing));
            return navigator.serviceWorker.ready;
        }).then(() => {
            ready = true;
            failed = false;
            updateStatus();
        }).catch(error => {
            failed = true;
            updateStatus();
            console.warn('No se pudo preparar la aplicación sin conexión.', error);
        });
    }
})();
