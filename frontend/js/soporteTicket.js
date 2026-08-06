$(document).ready(function () {
    consultarSoporteTickets();

    $("#formSoporteTicket").on("submit", function (evento) {
        evento.preventDefault();

        const id = $("#soporteTicketId").val();

        if (id === "") {
            crearSoporteTicket();
        } else {
            actualizarSoporteTicket(id);
        }
    });
});

function consultarSoporteTickets() {
    $.ajax({
        url: config.apiSoporteTicket,
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
            dibujarTablaSoporteTicket(respuesta);
        },
        error: function (error) {
            mostrarAlertaSoporteTicket("Error al consultar los tickets de soporte.", "danger");
            console.error(error);
        }
    });
}

function dibujarTablaSoporteTicket(tickets) {
    const tabla = $("#tablaSoporteTicket");
    tabla.html("");

    tickets.forEach(function (ticketElemento) {
        const respuestaTexto = ticketElemento.respuesta ? ticketElemento.respuesta : "";

        const asuntoEscapado = ticketElemento.asunto.replace(/"/g, "&quot;");
        const mensajeEscapado = ticketElemento.mensaje.replace(/"/g, "&quot;");
        const respuestaEscapada = respuestaTexto.replace(/"/g, "&quot;");

        const fila = `
            <tr>
                <td>${ticketElemento.usuario}</td>
                <td>${ticketElemento.asunto}</td>
                <td>${ticketElemento.mensaje}</td>
                <td><span class="badge ${obtenerColorEstadoTicket(ticketElemento.estado)}">${ticketElemento.estado}</span></td>
                <td>${respuestaTexto}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick='cargarActualizarSoporteTicket("${ticketElemento._id}","${ticketElemento.usuario}","${asuntoEscapado}","${mensajeEscapado}","${ticketElemento.estado}","${respuestaEscapada}")'>Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarSoporteTicket('${ticketElemento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.append(fila);
    });
}

function crearSoporteTicket() {
    const usuario = $("#soporteTicketUsuario").val();
    const asunto = $("#soporteTicketAsunto").val();
    const mensaje = $("#soporteTicketMensaje").val();
    const estado = $("#soporteTicketEstado").val();
    const respuesta = $("#soporteTicketRespuesta").val();

    const nuevoTicket = new SoporteTicket(usuario, asunto, mensaje, estado, respuesta);

    $.ajax({
        url: config.apiSoporteTicket,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevoTicket),
        success: function () {
            mostrarAlertaSoporteTicket("Ticket creado correctamente.", "success");
            limpiarFormularioSoporteTicket();
            $("#modalSoporteTicket").modal("hide");
            consultarSoporteTickets();
        },
        error: function (error) {
            mostrarAlertaSoporteTicket("Error al crear el ticket.", "danger");
            console.error(error);
        }
    });
}

function cargarActualizarSoporteTicket(id, usuario, asunto, mensaje, estado, respuesta) {
    $("#tituloModalSoporteTicket").text("Editar Ticket");
    $("#soporteTicketId").val(id);
    $("#soporteTicketUsuario").val(usuario);
    $("#soporteTicketAsunto").val(asunto);
    $("#soporteTicketMensaje").val(mensaje);
    $("#soporteTicketEstado").val(estado);
    $("#soporteTicketRespuesta").val(respuesta);

    const modal = new bootstrap.Modal($("#modalSoporteTicket")[0]);
    modal.show();
}

function actualizarSoporteTicket(id) {
    const usuario = $("#soporteTicketUsuario").val();
    const asunto = $("#soporteTicketAsunto").val();
    const mensaje = $("#soporteTicketMensaje").val();
    const estado = $("#soporteTicketEstado").val();
    const respuesta = $("#soporteTicketRespuesta").val();

    const ticketActualizado = new SoporteTicket(usuario, asunto, mensaje, estado, respuesta);

    $.ajax({
        url: `${config.apiSoporteTicket}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(ticketActualizado),
        success: function () {
            mostrarAlertaSoporteTicket("Ticket actualizado correctamente.", "success");
            limpiarFormularioSoporteTicket();
            $("#modalSoporteTicket").modal("hide");
            consultarSoporteTickets();
        },
        error: function (error) {
            mostrarAlertaSoporteTicket("Error al actualizar el ticket.", "danger");
            console.error(error);
        }
    });
}

function eliminarSoporteTicket(id) {
    if (!confirm("¿Seguro que desea eliminar este ticket?")) {
        return;
    }

    $.ajax({
        url: `${config.apiSoporteTicket}/${id}`,
        method: "DELETE",
        success: function () {
            mostrarAlertaSoporteTicket("Ticket eliminado correctamente.", "success");
            consultarSoporteTickets();
        },
        error: function (error) {
            mostrarAlertaSoporteTicket("Error al eliminar el ticket.", "danger");
            console.error(error);
        }
    });
}

function obtenerColorEstadoTicket(estado) {
    if (estado === "Abierto") {
        return "bg-danger";
    }
    if (estado === "En proceso") {
        return "bg-warning text-dark";
    }
    return "bg-success";
}

function limpiarFormularioSoporteTicket() {
    $("#formSoporteTicket")[0].reset();
    $("#soporteTicketId").val("");
    $("#tituloModalSoporteTicket").text("Nuevo Ticket");
}

function mostrarAlertaSoporteTicket(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show rounded-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertaSoporteTicket").html(alerta);
}
