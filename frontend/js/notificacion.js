$(document).ready(function () {
    consultarNotificacion();

    $("#formNotificacion").on("submit", function (evento) {
        evento.preventDefault();
        const id = $("#notificacionId").val();
        if (id === "") {
            crearNotificacion();
        } else {
            actualizarNotificacion(id);
        }
    });
});

function consultarNotificacion() {
    $.ajax({
        url: config.apiNotificacion,
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
            dibujarTablaNotificacion(respuesta);
        },
        error: function (error) {
            mostrarAlertaNotificacion("Error al consultar las notificaciones.", "danger");
            console.error(error);
        }
    });
}

function dibujarTablaNotificacion(notificaciones) {
    const tabla = $("#tablaNotificacion");
    tabla.html("");

    notificaciones.forEach(function (notificacionElemento) {
        const fechaTexto = notificacionElemento.fecha ? new Date(notificacionElemento.fecha).toLocaleDateString() : "";

        const fila = `
            <tr>
                <td>${notificacionElemento.usuario}</td>
                <td>${notificacionElemento.tipo}</td>
                <td>${notificacionElemento.mensaje}</td>
                <td>${fechaTexto}</td>
                <td>${notificacionElemento.estado}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick='cargarActualizarNotificacion("${notificacionElemento._id}","${notificacionElemento.usuario}","${notificacionElemento.tipo}","${notificacionElemento.mensaje}","${notificacionElemento.estado}")'>Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarNotificacion('${notificacionElemento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.append(fila);
    });
}

function crearNotificacion() {
    const usuario = $("#notificacionUsuario").val();
    const tipo = $("#notificacionTipo").val();
    const mensaje = $("#notificacionMensaje").val();
    const estado = $("#notificacionEstado").val();

    const nuevaNotificacion = new Notificacion(usuario, tipo, mensaje, undefined, estado);
    delete nuevaNotificacion.fecha;

    $.ajax({
        url: config.apiNotificacion,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevaNotificacion),
        success: function () {
            mostrarAlertaNotificacion("Notificacion creada correctamente.", "success");
            limpiarFormularioNotificacion();
            $("#modalNotificacion").modal("hide");
            consultarNotificacion();
        },
        error: function (error) {
            mostrarAlertaNotificacion("Error al crear la notificacion.", "danger");
            console.error(error);
        }
    });
}

function cargarActualizarNotificacion(id, usuario, tipo, mensaje, estado) {
    $("#tituloModalNotificacion").text("Editar Notificacion");
    $("#notificacionId").val(id);
    $("#notificacionUsuario").val(usuario);
    $("#notificacionTipo").val(tipo);
    $("#notificacionMensaje").val(mensaje);
    $("#notificacionEstado").val(estado);

    const modal = new bootstrap.Modal($("#modalNotificacion")[0]);
    modal.show();
}

function actualizarNotificacion(id) {
    const usuario = $("#notificacionUsuario").val();
    const tipo = $("#notificacionTipo").val();
    const mensaje = $("#notificacionMensaje").val();
    const estado = $("#notificacionEstado").val();

    const notificacionActualizada = new Notificacion(usuario, tipo, mensaje, undefined, estado);
    delete notificacionActualizada.fecha;

    $.ajax({
        url: `${config.apiNotificacion}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(notificacionActualizada),
        success: function () {
            mostrarAlertaNotificacion("Notificacion actualizada correctamente.", "success");
            limpiarFormularioNotificacion();
            $("#modalNotificacion").modal("hide");
            consultarNotificacion();
        },
        error: function (error) {
            mostrarAlertaNotificacion("Error al actualizar la notificacion.", "danger");
            console.error(error);
        }
    });
}

function eliminarNotificacion(id) {
    if (!confirm("¿Seguro que desea eliminar esta notificacion?")) {
        return;
    }
    $.ajax({
        url: `${config.apiNotificacion}/${id}`,
        method: "DELETE",
        success: function () {
            mostrarAlertaNotificacion("Notificacion eliminada correctamente.", "success");
            consultarNotificacion();
        },
        error: function (error) {
            mostrarAlertaNotificacion("Error al eliminar la notificacion.", "danger");
            console.error(error);
        }
    });
}

function limpiarFormularioNotificacion() {
    $("#formNotificacion")[0].reset();
    $("#notificacionId").val("");
    $("#tituloModalNotificacion").text("Nueva Notificacion");
}

function mostrarAlertaNotificacion(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show rounded-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertaNotificacion").html(alerta);
}