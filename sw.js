// Incrementar VERSION al publicar cambios en cualquiera de los archivos cacheados.
const VERSION = 'v4';
const CACHE_PREFIX = `san-antonio-${self.registration.scope}-`;
const CACHE_NAME = CACHE_PREFIX + VERSION;
const ASSETS = [
    'index.html', 'productos.html', 'categorias.html', 'historial.html',
    'ventas.js', 'productos.js', 'categorias.js', 'historial.js',
    'ventas.css', 'producto.css', 'categorias.css', 'historial.css',
    'pwa.js', 'pwa.css', 'responsive.js', 'responsive.css', 'manifest.webmanifest',
    'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
    'vendor/jspdf.umd.min.js'
].map(path => new URL(path, self.registration.scope).href);

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
    // Las actualizaciones esperan al cierre de las ventanas para no interrumpir ventas.
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map(key => caches.delete(key)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    const scope = new URL(self.registration.scope);
    if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
    url.search = '';
    if (url.pathname === scope.pathname) url.pathname += 'index.html';
    if (!ASSETS.includes(url.href)) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        return await cache.match(url.href) || fetch(event.request);
    })());
});
