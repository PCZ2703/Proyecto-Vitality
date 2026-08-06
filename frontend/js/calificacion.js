$(document).ready(function () {
    consultarCalificaciones();

    $("#formCalificacion").on("submit", function (evento) {
        evento.preventDefault();

        const id = $("#calificacionId").val();

        if (id === "") {
            crearCalificacion();
        } else {
            actualizarCalificacion(id);
        }
    });
});

// ===== LISTAR (GET) =====
function consultarCalificaciones() {
    $.ajax({
        url: config.apiCalificacion,
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
            dibujarTablaCalificacion(respuesta);
        },
        error: function (error) {
            mostrarAlertaCalificacion("Error al consultar las calificaciones.", "danger");
            console.error(error);
        }
    });
}

// ===== DIBUJAR TABLA =====
function dibujarTablaCalificacion(calificaciones) {
    const tabla = $("#tablaCalificacion");
    tabla.html("");

    calificaciones.forEach(function (calificacionElemento) {
        const resenaTexto = calificacionElemento.resena ? calificacionElemento.resena : "";
        // Escapamos comillas dobles en la resena para que no rompa el onclick
        const resenaEscapada = resenaTexto.replace(/"/g, "&quot;");

        const fila = `
            <tr>
                <td>${calificacionElemento.usuario}</td>
                <td>${calificacionElemento.tipo}</td>
                <td>${calificacionElemento.referencia}</td>
                <td>${calificacionElemento.puntuacion} / 5</td>
                <td>${resenaTexto}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick='cargarActualizarCalificacion("${calificacionElemento._id}","${calificacionElemento.usuario}","${calificacionElemento.tipo}","${calificacionElemento.referencia}",${calificacionElemento.puntuacion},"${resenaEscapada}")'>Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarCalificacion('${calificacionElemento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.append(fila);
    });
}

// ===== CREAR (POST) =====
function crearCalificacion() {
    const usuario = $("#calificacionUsuario").val();
    const tipo = $("#calificacionTipo").val();
    const referencia = $("#calificacionReferencia").val();
    const puntuacion = $("#calificacionPuntuacion").val();
    const resena = $("#calificacionResena").val();

    const nuevaCalificacion = new Calificacion(usuario, tipo, referencia, puntuacion, resena);

    $.ajax({
        url: config.apiCalificacion,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevaCalificacion),
        success: function () {
            mostrarAlertaCalificacion("Calificacion creada correctamente.", "success");
            limpiarFormularioCalificacion();
            $("#modalCalificacion").modal("hide");
            consultarCalificaciones();
        },
        error: function (error) {
            mostrarAlertaCalificacion("Error al crear la calificacion.", "danger");
            console.error(error);
        }
    });
}

// ===== CARGAR DATOS PARA EDITAR =====
function cargarActualizarCalificacion(id, usuario, tipo, referencia, puntuacion, resena) {
    $("#tituloModalCalificacion").text("Editar Calificacion");
    $("#calificacionId").val(id);
    $("#calificacionUsuario").val(usuario);
    $("#calificacionTipo").val(tipo);
    $("#calificacionReferencia").val(referencia);
    $("#calificacionPuntuacion").val(puntuacion);
    $("#calificacionResena").val(resena);

    const modal = new bootstrap.Modal($("#modalCalificacion")[0]);
    modal.show();
}

// ===== ACTUALIZAR (PUT) =====
function actualizarCalificacion(id) {
    const usuario = $("#calificacionUsuario").val();
    const tipo = $("#calificacionTipo").val();
    const referencia = $("#calificacionReferencia").val();
    const puntuacion = $("#calificacionPuntuacion").val();
    const resena = $("#calificacionResena").val();

    const calificacionActualizada = new Calificacion(usuario, tipo, referencia, puntuacion, resena);

    $.ajax({
        url: `${config.apiCalificacion}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(calificacionActualizada),
        success: function () {
            mostrarAlertaCalificacion("Calificacion actualizada correctamente.", "success");
            limpiarFormularioCalificacion();
            $("#modalCalificacion").modal("hide");
            consultarCalificaciones();
        },
        error: function (error) {
            mostrarAlertaCalificacion("Error al actualizar la calificacion.", "danger");
            console.error(error);
        }
    });
}

// ===== ELIMINAR (DELETE) =====
function eliminarCalificacion(id) {
    if (!confirm("¿Seguro que desea eliminar esta calificacion?")) {
        return;
    }

    $.ajax({
        url: `${config.apiCalificacion}/${id}`,
        method: "DELETE",
        success: function () {
            mostrarAlertaCalificacion("Calificacion eliminada correctamente.", "success");
            consultarCalificaciones();
        },
        error: function (error) {
            mostrarAlertaCalificacion("Error al eliminar la calificacion.", "danger");
            console.error(error);
        }
    });
}

// ===== UTILIDADES =====
function limpiarFormularioCalificacion() {
    $("#formCalificacion")[0].reset();
    $("#calificacionId").val("");
    $("#tituloModalCalificacion").text("Nueva Calificacion");
}

function mostrarAlertaCalificacion(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show rounded-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertaCalificacion").html(alerta);
}