$(document).ready(function () {
    consultarEnvioLogistica();

    $("#formEnvioLogistica").on("submit", function (evento) {
        evento.preventDefault();
        const id = $("#envioLogisticaId").val();
        if (id === "") {
            crearEnvioLogistica();
        } else {
            actualizarEnvioLogistica(id);
        }
    });
});

function consultarEnvioLogistica() {
    $.ajax({
        url: config.apiEnvioLogistica,
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
            dibujarTablaEnvioLogistica(respuesta);
        },
        error: function (error) {
            mostrarAlertaEnvioLogistica("Error al consultar los envios.", "danger");
            console.error(error);
        }
    });
}

function dibujarTablaEnvioLogistica(envios) {
    const tabla = $("#tablaEnvioLogistica");
    tabla.html("");

    envios.forEach(function (envioElemento) {
        const fila = `
            <tr>
                <td>${envioElemento.usuario}</td>
                <td>${envioElemento.direccion}</td>
                <td>${envioElemento.transportista}</td>
                <td>${envioElemento.numeroSeguimiento}</td>
                <td>${envioElemento.estadoEntrega}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick='cargarActualizarEnvioLogistica("${envioElemento._id}","${envioElemento.usuario}","${envioElemento.direccion}","${envioElemento.transportista}","${envioElemento.numeroSeguimiento}","${envioElemento.estadoEntrega}")'>Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarEnvioLogistica('${envioElemento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.append(fila);
    });
}

function crearEnvioLogistica() {
    const usuario = $("#envioLogisticaUsuario").val();
    const direccion = $("#envioLogisticaDireccion").val();
    const transportista = $("#envioLogisticaTransportista").val();
    const numeroSeguimiento = $("#envioLogisticaNumeroSeguimiento").val();
    const estadoEntrega = $("#envioLogisticaEstadoEntrega").val();

    const nuevoEnvio = new EnvioLogistica(usuario, direccion, transportista, numeroSeguimiento, estadoEntrega);

    $.ajax({
        url: config.apiEnvioLogistica,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevoEnvio),
        success: function () {
            mostrarAlertaEnvioLogistica("Envio creado correctamente.", "success");
            limpiarFormularioEnvioLogistica();
            $("#modalEnvioLogistica").modal("hide");
            consultarEnvioLogistica();
        },
        error: function (error) {
            mostrarAlertaEnvioLogistica("Error al crear el envio.", "danger");
            console.error(error);
        }
    });
}

function cargarActualizarEnvioLogistica(id, usuario, direccion, transportista, numeroSeguimiento, estadoEntrega) {
    $("#tituloModalEnvioLogistica").text("Editar Envio");
    $("#envioLogisticaId").val(id);
    $("#envioLogisticaUsuario").val(usuario);
    $("#envioLogisticaDireccion").val(direccion);
    $("#envioLogisticaTransportista").val(transportista);
    $("#envioLogisticaNumeroSeguimiento").val(numeroSeguimiento);
    $("#envioLogisticaEstadoEntrega").val(estadoEntrega);

    const modal = new bootstrap.Modal($("#modalEnvioLogistica")[0]);
    modal.show();
}

function actualizarEnvioLogistica(id) {
    const usuario = $("#envioLogisticaUsuario").val();
    const direccion = $("#envioLogisticaDireccion").val();
    const transportista = $("#envioLogisticaTransportista").val();
    const numeroSeguimiento = $("#envioLogisticaNumeroSeguimiento").val();
    const estadoEntrega = $("#envioLogisticaEstadoEntrega").val();

    const envioActualizado = new EnvioLogistica(usuario, direccion, transportista, numeroSeguimiento, estadoEntrega);

    $.ajax({
        url: `${config.apiEnvioLogistica}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(envioActualizado),
        success: function () {
            mostrarAlertaEnvioLogistica("Envio actualizado correctamente.", "success");
            limpiarFormularioEnvioLogistica();
            $("#modalEnvioLogistica").modal("hide");
            consultarEnvioLogistica();
        },
        error: function (error) {
            mostrarAlertaEnvioLogistica("Error al actualizar el envio.", "danger");
            console.error(error);
        }
    });
}

function eliminarEnvioLogistica(id) {
    if (!confirm("¿Seguro que desea eliminar este envio?")) {
        return;
    }
    $.ajax({
        url: `${config.apiEnvioLogistica}/${id}`,
        method: "DELETE",
        success: function () {
            mostrarAlertaEnvioLogistica("Envio eliminado correctamente.", "success");
            consultarEnvioLogistica();
        },
        error: function (error) {
            mostrarAlertaEnvioLogistica("Error al eliminar el envio.", "danger");
            console.error(error);
        }
    });
}

function limpiarFormularioEnvioLogistica() {
    $("#formEnvioLogistica")[0].reset();
    $("#envioLogisticaId").val("");
    $("#tituloModalEnvioLogistica").text("Nuevo Envio");
}

function mostrarAlertaEnvioLogistica(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show rounded-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertaEnvioLogistica").html(alerta);
}