$(document).ready(function () {
    consultarPago();

    $("#formPago").on("submit", function (evento) {
        evento.preventDefault();
        const id = $("#pagoId").val();
        if (id === "") {
            crearPago();
        } else {
            actualizarPago(id);
        }
    });
});

function consultarPago() {
    $.ajax({
        url: config.apiPago,
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
            dibujarTablaPago(respuesta);
        },
        error: function (error) {
            mostrarAlertaPago("Error al consultar los pagos.", "danger");
            console.error(error);
        }
    });
}

function dibujarTablaPago(pagos) {
    const tabla = $("#tablaPago");
    tabla.html("");

    pagos.forEach(function (pagoElemento) {
        const fechaTexto = pagoElemento.fecha ? new Date(pagoElemento.fecha).toLocaleDateString() : "";

        const fila = `
            <tr>
                <td>${pagoElemento.usuario}</td>
                <td>${pagoElemento.monto}</td>
                <td>${pagoElemento.metodoPago}</td>
                <td>${pagoElemento.estado}</td>
                <td>${fechaTexto}</td>
                <td>${pagoElemento.referenciaSuscripcion}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick='cargarActualizarPago("${pagoElemento._id}","${pagoElemento.usuario}",${pagoElemento.monto},"${pagoElemento.metodoPago}","${pagoElemento.estado}","${pagoElemento.referenciaSuscripcion}")'>Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarPago('${pagoElemento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.append(fila);
    });
}

function crearPago() {
    const usuario = $("#pagoUsuario").val();
    const monto = $("#pagoMonto").val();
    const metodoPago = $("#pagoMetodoPago").val();
    const estado = $("#pagoEstado").val();
    const referenciaSuscripcion = $("#pagoReferenciaSuscripcion").val();

    const nuevoPago = new Pago(usuario, monto, metodoPago, estado, referenciaSuscripcion);

    $.ajax({
        url: config.apiPago,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevoPago),
        success: function () {
            mostrarAlertaPago("Pago creado correctamente.", "success");
            limpiarFormularioPago();
            $("#modalPago").modal("hide");
            consultarPago();
        },
        error: function (error) {
            mostrarAlertaPago("Error al crear el pago.", "danger");
            console.error(error);
        }
    });
}

function cargarActualizarPago(id, usuario, monto, metodoPago, estado, referenciaSuscripcion) {
    $("#tituloModalPago").text("Editar Pago");
    $("#pagoId").val(id);
    $("#pagoUsuario").val(usuario);
    $("#pagoMonto").val(monto);
    $("#pagoMetodoPago").val(metodoPago);
    $("#pagoEstado").val(estado);
    $("#pagoReferenciaSuscripcion").val(referenciaSuscripcion);

    const modal = new bootstrap.Modal($("#modalPago")[0]);
    modal.show();
}

function actualizarPago(id) {
    const usuario = $("#pagoUsuario").val();
    const monto = $("#pagoMonto").val();
    const metodoPago = $("#pagoMetodoPago").val();
    const estado = $("#pagoEstado").val();
    const referenciaSuscripcion = $("#pagoReferenciaSuscripcion").val();

    const pagoActualizado = new Pago(usuario, monto, metodoPago, estado, referenciaSuscripcion);

    $.ajax({
        url: `${config.apiPago}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(pagoActualizado),
        success: function () {
            mostrarAlertaPago("Pago actualizado correctamente.", "success");
            limpiarFormularioPago();
            $("#modalPago").modal("hide");
            consultarPago();
        },
        error: function (error) {
            mostrarAlertaPago("Error al actualizar el pago.", "danger");
            console.error(error);
        }
    });
}

function eliminarPago(id) {
    if (!confirm("¿Seguro que desea eliminar este pago?")) {
        return;
    }
    $.ajax({
        url: `${config.apiPago}/${id}`,
        method: "DELETE",
        success: function () {
            mostrarAlertaPago("Pago eliminado correctamente.", "success");
            consultarPago();
        },
        error: function (error) {
            mostrarAlertaPago("Error al eliminar el pago.", "danger");
            console.error(error);
        }
    });
}

function limpiarFormularioPago() {
    $("#formPago")[0].reset();
    $("#pagoId").val("");
    $("#tituloModalPago").text("Nuevo Pago");
}

function mostrarAlertaPago(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show rounded-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertaPago").html(alerta);
}