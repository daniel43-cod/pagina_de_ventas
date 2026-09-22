// Servidor de desarrollo local, sin dependencias. Ejecutar: node server.cjs
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const types = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.webmanifest': 'application/manifest+json',
    '.png': 'image/png'
};
const server = http.createServer(async (req, res) => {
    try {
        if (!['GET', 'HEAD'].includes(req.method)) {
            res.writeHead(405).end();
            return;
        }
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
        const file = path.resolve(__dirname, relative);
        const safeRelative = path.relative(__dirname, file);
        const type = types[path.extname(file)];
        if (!type || safeRelative.startsWith('..') || path.isAbsolute(safeRelative)
            || safeRelative.split(/[\\/]/).some(part => part.startsWith('.'))) {
            res.writeHead(404).end();
            return;
        }
        const data = await fs.readFile(file);
        res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
        res.end(req.method === 'HEAD' ? undefined : data);
    } catch (error) {
        res.writeHead(error.code === 'ENOENT' ? 404 : 400).end();
    }
});
server.on('error', error => {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exitCode = 1;
});
server.listen(8080, '127.0.0.1', () => console.log('PWA lista: http://127.0.0.1:8080'));
