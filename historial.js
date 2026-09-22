let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
console.log("Ventas guardadas:", ventas);

function mostrarHistorial() {
    let tabla = document.getElementById("tablaHistorial");
    tabla.innerHTML = "";

    ventas.forEach((venta, index) => {
        let detalle = venta.detalle || [];

        tabla.innerHTML += `
            <tr>
                <td>${venta.cliente || "Sin cliente"}</td>
                <td>${venta.fecha}</td>
                <td>Q${Number(venta.total).toFixed(2)}</td>
                <td><button onclick="verDetalle(${index})">Ver detalle</button></td>
                <td><button onclick="generarPDF(${index})">Generar PDF</button></td>
                <td><button onclick="modificarVenta(${index})">Modificar</button></td>
                <td><button onclick="imprimirTicket(${index})">Imprimir</button></td>
            </tr>

            <tr id="detalle-${index}" style="display:none;">
                <td colspan="6">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${detalle.map(item => `
                                <tr>
                                    <td>${item.producto}</td>
                                    <td>Q${Number(item.precio).toFixed(2)}</td>
                                    <td>${item.cantidad}</td>
                                    <td>Q${Number(item.subtotal).toFixed(2)}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </td>
            </tr>
        `;
    });
}

function verDetalle(index) {
    let fila = document.getElementById(`detalle-${index}`);

    if (fila.style.display === "none") {
        fila.style.display = "";
    } else {
        fila.style.display = "none";
    }
}

function generarPDF(index) {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter"
    });

    let venta = ventas[index];

    // Encabezado
    doc.setFontSize(18);
    doc.text(
        "DISTRIBUIDORA SAN ANTONIO",
        105,
        20,
        { align: "center" }
    );

    doc.setFontSize(12);
    doc.text(
        "TEL: 3264-3544 -- 3272-3676",
        105,
        28,
        { align: "center" }
    );

    // Datos de la venta
    doc.setFontSize(12);

    doc.text(
        `Cliente: ${venta.cliente}`,
        20,
        40
    );

    doc.text(
        `Fecha: ${venta.fecha}`,
        20,
        48
    );

    // Línea
    doc.line(
        20,
        58,
        195,
        58
    );

    // Encabezado tabla
    doc.setFontSize(10);

    doc.text("Cantidad", 20, 68);
    doc.text("Producto", 40, 68);
    doc.text("Precio", 125, 68);
    doc.text("Subtotal", 160, 68);

    doc.line(
        20,
        72,
        195,
        72
    );

    // Detalle
    let y = 80;

    venta.detalle.forEach(item => {

        doc.text(
            String(item.cantidad),
            20,
            y
        );

        doc.text(
            item.producto,
            40,
            y
        );

        doc.text(
            `Q${Number(item.precio).toFixed(2)}`,
            125,
            y
        );

        doc.text(
            `Q${Number(item.subtotal).toFixed(2)}`,
            160,
            y
        );

        y += 6;

        if (y > 240) {

            doc.addPage();

            y = 20;
        }
    });

    // Línea antes del total
    doc.line(
        20,
        y + 4,
        195,
        y + 4
    );

    // Total
    doc.setFontSize(14);

    doc.text(
        `TOTAL: Q${Number(venta.total).toFixed(2)}`,
        155,
        y + 15,
        {
            align: "right"
        }
    );

    doc.save(
        `venta_${venta.cliente}.pdf`
    );
}

function compartirWhatsApp(index) {
    let venta = ventas[index];

    let mensaje = `Detalle de venta%0A`;
    mensaje += `Cliente: ${venta.cliente}%0A`;
    mensaje += `Fecha: ${venta.fecha}%0A%0A`;

    venta.detalle.forEach(item => {
        mensaje += `${item.producto} - Cant: ${item.cantidad} - Q${item.subtotal.toFixed(2)}%0A`;
    });

    mensaje += `%0ATotal: Q${venta.total.toFixed(2)}`;

    window.open(`https://wa.me/?text=${mensaje}`, "_blank");
}

mostrarHistorial();
function imprimirTicket(index) {
    let venta = ventas[index];

    let contenido = `
        <html>
        <head>
            <style>
                body {
                    font-family: monospace;
                    width: 58mm;
                    font-size: 12px;
                }

                h2 {
                    text-align: center;
                    margin: 5px 0;
                }

                .centrado {
                    text-align: center;
                }

                .linea {
                    border-top: 1px dashed #000;
                    margin: 8px 0;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }

                td {
                    padding: 2px 0;
                }

                .total {
                    font-size: 14px;
                    font-weight: bold;
                    text-align: right;
                }

                @media print {
                    button {
                        display: none;
                    }

                    body {
                        margin: 0;
                    }
                }
            </style>
        </head>
        <body>
            <h2>MI TIENDA</h2>
            <p class="centrado">Ticket de venta</p>

            <div class="linea"></div>

            <p>Cliente: ${venta.cliente}</p>
            <p>Fecha: ${venta.fecha}</p>

            <div class="linea"></div>

            <table>
                ${venta.detalle.map(item => `
                    <tr>
                        <td>${item.producto}</td>
                    </tr>
                    <tr>
                        <td>${item.cantidad} x Q${Number(item.precio).toFixed(2)}</td>
                        <td style="text-align:right;">Q${Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                `).join("")}
            </table>

            <div class="linea"></div>

            <p class="total">TOTAL: Q${Number(venta.total).toFixed(2)}</p>

            <div class="linea"></div>

            <p class="centrado">Gracias por su compra</p>

            <script>
                window.onload = function() {
                    window.print();
                }
            <\/script>
        </body>
        </html>
    `;

    let ventana = window.open("", "_blank");
    ventana.document.write(contenido);
    ventana.document.close();
}

function exportarVentasJSON() {

    let ventas =
        JSON.parse(localStorage.getItem("ventas")) || [];

    let datos =
        JSON.stringify(ventas, null, 2);

    let blob =
        new Blob([datos], {type:"application/json"});

    let enlace =
        document.createElement("a");

    enlace.href =
        URL.createObjectURL(blob);

    enlace.download =
        "ventas.json";

    enlace.click();
}

function exportarVentasCSV() {

    let ventas =
        JSON.parse(localStorage.getItem("ventas")) || [];

    let csv =
        "Cliente,Fecha,Total\n";

    ventas.forEach(v => {

        csv +=
        `"${v.cliente}","${v.fecha}",${v.total}\n`;

    });

    let blob =
        new Blob([csv], {type:"text/csv"});

    let enlace =
        document.createElement("a");

    enlace.href =
        URL.createObjectURL(blob);

    enlace.download =
        "ventas.csv";

        function borrarHistorial() {

    let confirmar =
        confirm("¿Desea eliminar todo el historial?");

    if(!confirmar)
        return;

    localStorage.removeItem("ventas");

    location.reload();
}

    enlace.click();
}

function borrarHistorial() {

    let confirmar =
        confirm("¿Desea eliminar todo el historial?");

    if(!confirmar)
        return;

    localStorage.removeItem("ventas");

    location.reload();
}

function modificarVenta(index){

    let venta = ventas[index];

    localStorage.setItem(
        "ventaEditar",
        JSON.stringify({
            index:index,
            venta:venta
        })
    );

    window.location.href = "index.html";
}
