$(document).ready(function () {
    consultarCajasMensuales();

    $("#formCajaMensual").on("submit", function (evento) {
        evento.preventDefault();

        const id = $("#cajaMensualId").val();

        if (id === "") {
            crearCajaMensual();
        } else {
            actualizarCajaMensual(id);
        }
    });
});

function consultarCajasMensuales() {
    $.ajax({
        url: config.apiCajaMensual,
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
            dibujarTablaCajaMensual(respuesta);
        },
        error: function (error) {
            mostrarAlertaCajaMensual("Error al consultar las cajas mensuales.", "danger");
            console.error(error);
        }
    });
}

function dibujarTablaCajaMensual(cajas) {
    const tabla = $("#tablaCajaMensual");
    tabla.html("");

    cajas.forEach(function (cajaElemento) {
        const productosTexto = cajaElemento.productosIncluidos.join(", ");
        const productosParaOnclick = JSON.stringify(cajaElemento.productosIncluidos).replace(/"/g, "&quot;");

        const fila = `
            <tr>
                <td>${cajaElemento.usuario}</td>
                <td>${cajaElemento.mes}</td>
                <td>${productosTexto}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick='cargarActualizarCajaMensual("${cajaElemento._id}","${cajaElemento.usuario}","${cajaElemento.mes}",${productosParaOnclick})'>Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarCajaMensual('${cajaElemento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.append(fila);
    });
}

function crearCajaMensual() {
    const usuario = $("#cajaMensualUsuario").val();
    const mes = $("#cajaMensualMes").val();
    const productosTexto = $("#cajaMensualProductos").val();

    const productosIncluidos = productosTexto.split(",").map(function (producto) {
        return producto.trim();
    });

    const nuevaCaja = new CajaMensual(usuario, mes, productosIncluidos);

    $.ajax({
        url: config.apiCajaMensual,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevaCaja),
        success: function () {
            mostrarAlertaCajaMensual("Caja mensual creada correctamente.", "success");
            limpiarFormularioCajaMensual();
            $("#modalCajaMensual").modal("hide");
            consultarCajasMensuales();
        },
        error: function (error) {
            mostrarAlertaCajaMensual("Error al crear la caja mensual.", "danger");
            console.error(error);
        }
    });
}

function cargarActualizarCajaMensual(id, usuario, mes, productosIncluidos) {
    $("#tituloModalCajaMensual").text("Editar Caja Mensual");
    $("#cajaMensualId").val(id);
    $("#cajaMensualUsuario").val(usuario);
    $("#cajaMensualMes").val(mes);
    $("#cajaMensualProductos").val(productosIncluidos.join(", "));

    const modal = new bootstrap.Modal($("#modalCajaMensual")[0]);
    modal.show();
}

function actualizarCajaMensual(id) {
    const usuario = $("#cajaMensualUsuario").val();
    const mes = $("#cajaMensualMes").val();
    const productosTexto = $("#cajaMensualProductos").val();

    const productosIncluidos = productosTexto.split(",").map(function (producto) {
        return producto.trim();
    });

    const cajaActualizada = new CajaMensual(usuario, mes, productosIncluidos);

    $.ajax({
        url: `${config.apiCajaMensual}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(cajaActualizada),
        success: function () {
            mostrarAlertaCajaMensual("Caja mensual actualizada correctamente.", "success");
            limpiarFormularioCajaMensual();
            $("#modalCajaMensual").modal("hide");
            consultarCajasMensuales();
        },
        error: function (error) {
            mostrarAlertaCajaMensual("Error al actualizar la caja mensual.", "danger");
            console.error(error);
        }
    });
}

function eliminarCajaMensual(id) {
    if (!confirm("¿Seguro que desea eliminar esta caja mensual?")) {
        return;
    }

    $.ajax({
        url: `${config.apiCajaMensual}/${id}`,
        method: "DELETE",
        success: function () {
            mostrarAlertaCajaMensual("Caja mensual eliminada correctamente.", "success");
            consultarCajasMensuales();
        },
        error: function (error) {
            mostrarAlertaCajaMensual("Error al eliminar la caja mensual.", "danger");
            console.error(error);
        }
    });
}

function limpiarFormularioCajaMensual() {
    $("#formCajaMensual")[0].reset();
    $("#cajaMensualId").val("");
    $("#tituloModalCajaMensual").text("Nueva Caja Mensual");
}

function mostrarAlertaCajaMensual(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show rounded-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertaCajaMensual").html(alerta);
}