let productos = [];


function agregarProducto() {
  const nombre = document.getElementById("producto").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precio = parseFloat(document.getElementById("precio").value);
  if (!nombre || !cantidad || !precio){

    document.getElementById("producto").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("precio").value = "";

  }
  const subtotal = cantidad * precio;
  productos.push({ nombre, cantidad, precio, subtotal });

   document.getElementById("producto").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("precio").value = "";

  alert("Producto agregado exitosamente");

  document.getElementById("producto").focus();  

  mostrarTabla();
}

function mostrarTabla() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  let total = 0.00;
  productos.forEach((p) => {
    total += p.subtotal;
    lista.innerHTML += `
          <tr>
            <td class="border p-2">${p.nombre}</td>
            <td class="border p-2 text-center">${p.cantidad}</td>
            <td class="border p-2 text-right">$${p.precio.toFixed(2)}</td>
            <td class="border p-2 text-right">$${p.subtotal.toFixed(2)}</td>
          </tr>
        `;
  });
  document.getElementById("total").textContent = total.toFixed(2);
}

//limpiar tabla
function limpiarTabla() {
  productos = [];
  mostrarTabla();
  document.getElementById("total").textContent = "0.00";
  alert("Tabla limpiada exitosamente");
}

async function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString("es-ES");
  const cliente = document.getElementById("cliente").value || "N/A";
  const telefono = document.getElementById("telefono").value || "xxx-xxx-xxxx";

  const logoUrl = "./logo.png"; // Ruta al logode tu aplicación
  doc.addImage(logoUrl, "PNG", 10, 10, 40, 40);
  const logo = await fetch(logoUrl)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );

    //hora de en la factura
    const hora = fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const tipoDocumento = document.getElementById("tipoDocumento").value || "FACTURA";
  doc.setFontSize(16);
  doc.text(`${tipoDocumento}`, 105, 15, { align: "center" });
  doc.setFontSize(13);
  doc.text(`Fecha: ${fechaStr}`, 200, 10, { align: "right" });
  doc.setFontSize(13);
  doc.text(`Hora: ${hora}`, 200, 15, { align: "right" });
  doc.setFontSize(12);
  doc.text("DELICIAS BEREGÜETE RODRÍGUEZ", 105, 22, { align: "center" });
  doc.setFontSize(10);
  doc.text("Calle 12 con interior 1, Pueblon 13 - Tel: 829-375-0265", 105,28,{ align: "center" });
  doc.setFontSize(12);
  doc.text(`Cliente: ${cliente}       Telefono: ${telefono}`, 105, 36, {
    align: "center",
  });
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(50, 45, 210, 45); // Línea horizontal

let y = 60; // posición inicial en Y
const startX = 10; // posición inicial en X
const colWidth = [70, 30, 35, 50]; // ancho de cada columna: nombre, cantidad, precio, subtotal

// Encabezado de la tabla
doc.setFont('helvetica', 'bold');
doc.text('Nombre', startX, y);
doc.text("Cantidad", startX + colWidth[0], y);
doc.text('Precio', startX + colWidth[0] + colWidth[1], y);
doc.text('Subtotal', startX + colWidth[0] + colWidth[1] + colWidth[2], y);

y += 10;
doc.setFont('helvetica', 'normal');

// Filas de productos
productos.forEach((p) => {
  doc.text(p.nombre, startX, y, { maxWidth: colWidth[0] - 2 });
  doc.text(p.cantidad.toString(), startX + colWidth[0], y);
  doc.text(`$${p.precio}`, startX + colWidth[0] + colWidth[1], y);
  doc.text(`$${p.subtotal}`, startX + colWidth[0] + colWidth[1] + colWidth[2], y);
  y += 10;
  doc.text(`\n`, startX, y, { maxWidth: 190 });
  y += 15;
});
// Nota al pie
doc.setFontSize(10);
doc.text(`En DELICIAS BEREGÜETE RODRÍGUEZ, nos dedicamos a ofrecer soluciones para satisfacer las necesidades en cada 
pedido. Contamos con un amplio menu de comida preparadas, con los productos de mayor calidad, todos ellos 
cuidadosamente seleccionados para brindarte el mejor el mejor sabor.`, 105, y + 20, { align: "center" });

doc.setFontSize(12);
const metodoPago = document.getElementById("metodoPago").value || "Efectivo";
doc.text(`Método de pago: ${metodoPago}`, 10, y + 10);
  doc.text(
    `TOTAL: $${document.getElementById("total").textContent}`,
    200,
    y + 10,
    { align: "right"});

    const comentario = document.getElementById("comentario").value || "Sin comentarios";
    if (comentario) {
      doc.setFontSize(13);
      doc.text(
        `Comentario:\n\n ${comentario}`,
        10,
        y + 50,
        { maxWidth: 190 },
        { align: "left" }
      );
    }

  doc.save(`${tipoDocumento}_${cliente}_${fechaStr}.pdf`);
}
