$(document).ready(function () {
    consultarProductos();

    $("#formProducto").on("submit", function (evento) {
        evento.preventDefault();
        const id = $("#productoId").val();
        if (id === "") {
            crearProducto();
        } else {
            actualizarProducto(id);
        }
    });
});

function consultarProductos() {
    $.ajax({
        url: config.apiProducto,
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
            dibujarTablaProducto(respuesta);
        },
        error: function (error) {
            mostrarAlertaProducto("Error al consultar los productos.", "danger");
            console.error(error);
        }
    });
}

function dibujarTablaProducto(productos) {
    const tabla = $("#tablaProducto");
    tabla.html("");

    productos.forEach(function (productoElemento) {
        const ingredientesTexto = productoElemento.ingredientes.join(", ");
        const beneficiosTexto = productoElemento.beneficios.join(", ");
        const ingredientesJson = JSON.stringify(productoElemento.ingredientes).replace(/"/g, "&quot;");
        const beneficiosJson = JSON.stringify(productoElemento.beneficios).replace(/"/g, "&quot;");

        const fila = `
            <tr>
                <td>${productoElemento.nombre}</td>
                <td>${productoElemento.tipo}</td>
                <td>${ingredientesTexto}</td>
                <td>${beneficiosTexto}</td>
                <td>${productoElemento.stock}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick='cargarActualizarProducto("${productoElemento._id}","${productoElemento.nombre}","${productoElemento.tipo}",${ingredientesJson},${beneficiosJson},${productoElemento.stock})'>Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${productoElemento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.append(fila);
    });
}

function crearProducto() {
    const nombre = $("#productoNombre").val();
    const tipo = $("#productoTipo").val();
    const ingredientes = $("#productoIngredientes").val().split(",").map(function (i) { return i.trim(); });
    const beneficios = $("#productoBeneficios").val().split(",").map(function (b) { return b.trim(); });
    const stock = $("#productoStock").val();

    const nuevoProducto = new Producto(nombre, tipo, ingredientes, beneficios, stock);

    $.ajax({
        url: config.apiProducto,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevoProducto),
        success: function () {
            mostrarAlertaProducto("Producto creado correctamente.", "success");
            limpiarFormularioProducto();
            $("#modalProducto").modal("hide");
            consultarProductos();
        },
        error: function (error) {
            mostrarAlertaProducto("Error al crear el producto.", "danger");
            console.error(error);
        }
    });
}

function cargarActualizarProducto(id, nombre, tipo, ingredientes, beneficios, stock) {
    $("#tituloModalProducto").text("Editar Producto");
    $("#productoId").val(id);
    $("#productoNombre").val(nombre);
    $("#productoTipo").val(tipo);
    $("#productoIngredientes").val(ingredientes.join(", "));
    $("#productoBeneficios").val(beneficios.join(", "));
    $("#productoStock").val(stock);

    const modal = new bootstrap.Modal($("#modalProducto")[0]);
    modal.show();
}

function actualizarProducto(id) {
    const nombre = $("#productoNombre").val();
    const tipo = $("#productoTipo").val();
    const ingredientes = $("#productoIngredientes").val().split(",").map(function (i) { return i.trim(); });
    const beneficios = $("#productoBeneficios").val().split(",").map(function (b) { return b.trim(); });
    const stock = $("#productoStock").val();

    const productoActualizado = new Producto(nombre, tipo, ingredientes, beneficios, stock);

    $.ajax({
        url: `${config.apiProducto}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(productoActualizado),
        success: function () {
            mostrarAlertaProducto("Producto actualizado correctamente.", "success");
            limpiarFormularioProducto();
            $("#modalProducto").modal("hide");
            consultarProductos();
        },
        error: function (error) {
            mostrarAlertaProducto("Error al actualizar el producto.", "danger");
            console.error(error);
        }
    });
}

function eliminarProducto(id) {
    if (!confirm("¿Seguro que desea eliminar este producto?")) {
        return;
    }
    $.ajax({
        url: `${config.apiProducto}/${id}`,
        method: "DELETE",
        success: function () {
            mostrarAlertaProducto("Producto eliminado correctamente.", "success");
            consultarProductos();
        },
        error: function (error) {
            mostrarAlertaProducto("Error al eliminar el producto.", "danger");
            console.error(error);
        }
    });
}

function limpiarFormularioProducto() {
    $("#formProducto")[0].reset();
    $("#productoId").val("");
    $("#tituloModalProducto").text("Nuevo Producto");
}

function mostrarAlertaProducto(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show rounded-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertaProducto").html(alerta);
}