// Mantener etiquetas también al agregar ventas o desplegar detalles dinámicos.
(() => {
    function labelTables() {
        document.querySelectorAll('.contenedor table').forEach(table => {
            const headers = Array.from(table.tHead?.rows[0]?.cells || [], cell => cell.textContent.trim());
            for (const body of table.tBodies) {
                for (const row of body.rows) {
                    Array.from(row.cells).forEach((cell, index) => {
                        if (cell.colSpan === 1 && headers[index]) cell.dataset.label = headers[index];
                    });
                }
            }
        });
    }
    labelTables();
    const container = document.querySelector('.contenedor');
    if (container) new MutationObserver(labelTables).observe(container, { childList: true, subtree: true });
})();
