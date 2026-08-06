$(document).ready(function () {
    consultarSesiones();

    $("#formSesion").on("submit", function (evento) {
        evento.preventDefault();

        const id = $("#sesionId").val();

        if (id === "") {
            crearSesion();
        } else {
            actualizarSesion(id);
        }
    });
});

// ===== LISTAR (GET) =====
function consultarSesiones() {
    $.ajax({
        url: config.apiSesion,
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
            dibujarTablaSesion(respuesta);
        },
        error: function (error) {
            mostrarAlertaSesion("Error al consultar las sesiones.", "danger");
            console.error(error);
        }
    });
}

// ===== DIBUJAR TABLA =====
function dibujarTablaSesion(sesiones) {
    const tabla = $("#tablaSesion");
    tabla.html("");

    sesiones.forEach(function (sesionElemento) {
        // La fecha llega como ISO desde Mongo, la dejamos en formato yyyy-mm-dd
        const fechaTexto = formatearFechaSesion(sesionElemento.fecha);
        const notasTexto = sesionElemento.notas ? sesionElemento.notas : "";
        const recomendacionesTexto = sesionElemento.recomendaciones ? sesionElemento.recomendaciones : "";

        // Escapamos comillas dobles para que no rompan el onclick
        const notasEscapadas = notasTexto.replace(/"/g, "&quot;");
        const recomendacionesEscapadas = recomendacionesTexto.replace(/"/g, "&quot;");

        const fila = `
            <tr>
                <td>${sesionElemento.cliente}</td>
                <td>${sesionElemento.terapeuta}</td>
                <td>${fechaTexto}</td>
                <td>${sesionElemento.hora}</td>
                <td>${notasTexto}</td>
                <td>${recomendacionesTexto}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick='cargarActualizarSesion("${sesionElemento._id}","${sesionElemento.cliente}","${sesionElemento.terapeuta}","${fechaTexto}","${sesionElemento.hora}","${notasEscapadas}","${recomendacionesEscapadas}")'>Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarSesion('${sesionElemento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.append(fila);
    });
}

// ===== CREAR (POST) =====
function crearSesion() {
    const cliente = $("#sesionCliente").val();
    const terapeuta = $("#sesionTerapeuta").val();
    const fecha = $("#sesionFecha").val();
    const hora = $("#sesionHora").val();
    const notas = $("#sesionNotas").val();
    const recomendaciones = $("#sesionRecomendaciones").val();

    const nuevaSesion = new Sesion(cliente, terapeuta, fecha, hora, notas, recomendaciones);

    $.ajax({
        url: config.apiSesion,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevaSesion),
        success: function () {
            mostrarAlertaSesion("Sesion creada correctamente.", "success");
            limpiarFormularioSesion();
            $("#modalSesion").modal("hide");
            consultarSesiones();
        },
        error: function (error) {
            mostrarAlertaSesion("Error al crear la sesion.", "danger");
            console.error(error);
        }
    });
}

// ===== CARGAR DATOS PARA EDITAR =====
function cargarActualizarSesion(id, cliente, terapeuta, fecha, hora, notas, recomendaciones) {
    $("#tituloModalSesion").text("Editar Sesion");
    $("#sesionId").val(id);
    $("#sesionCliente").val(cliente);
    $("#sesionTerapeuta").val(terapeuta);
    $("#sesionFecha").val(fecha);
    $("#sesionHora").val(hora);
    $("#sesionNotas").val(notas);
    $("#sesionRecomendaciones").val(recomendaciones);

    const modal = new bootstrap.Modal($("#modalSesion")[0]);
    modal.show();
}

// ===== ACTUALIZAR (PUT) =====
function actualizarSesion(id) {
    const cliente = $("#sesionCliente").val();
    const terapeuta = $("#sesionTerapeuta").val();
    const fecha = $("#sesionFecha").val();
    const hora = $("#sesionHora").val();
    const notas = $("#sesionNotas").val();
    const recomendaciones = $("#sesionRecomendaciones").val();

    const sesionActualizada = new Sesion(cliente, terapeuta, fecha, hora, notas, recomendaciones);

    $.ajax({
        url: `${config.apiSesion}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(sesionActualizada),
        success: function () {
            mostrarAlertaSesion("Sesion actualizada correctamente.", "success");
            limpiarFormularioSesion();
            $("#modalSesion").modal("hide");
            consultarSesiones();
        },
        error: function (error) {
            mostrarAlertaSesion("Error al actualizar la sesion.", "danger");
            console.error(error);
        }
    });
}

// ===== ELIMINAR (DELETE) =====
function eliminarSesion(id) {
    if (!confirm("¿Seguro que desea eliminar esta sesion?")) {
        return;
    }

    $.ajax({
        url: `${config.apiSesion}/${id}`,
        method: "DELETE",
        success: function () {
            mostrarAlertaSesion("Sesion eliminada correctamente.", "success");
            consultarSesiones();
        },
        error: function (error) {
            mostrarAlertaSesion("Error al eliminar la sesion.", "danger");
            console.error(error);
        }
    });
}

// ===== UTILIDADES =====
function formatearFechaSesion(fecha) {
    if (!fecha) {
        return "";
    }
    // Mongo devuelve "2026-08-05T00:00:00.000Z", nos quedamos con la parte de la fecha
    return fecha.substring(0, 10);
}

function limpiarFormularioSesion() {
    $("#formSesion")[0].reset();
    $("#sesionId").val("");
    $("#tituloModalSesion").text("Nueva Sesion");
}

function mostrarAlertaSesion(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show rounded-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertaSesion").html(alerta);
}
