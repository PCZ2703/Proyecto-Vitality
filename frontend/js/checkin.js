$(document).ready(function () {
    consultarCheckins();

    // Manejo del submit del formulario (sirve tanto para crear como editar)
    $("#formCheckin").on("submit", function (evento) {
        evento.preventDefault();

        const id = $("#checkinId").val();

        if (id === "") {
            crearCheckin();
        } else {
            actualizarCheckin(id);
        }
    });
});

// ===== LISTAR (GET) =====
function consultarCheckins() {
    $.ajax({
        url: config.apiCheckin,
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
            dibujarTablaCheckin(respuesta);
        },
        error: function (error) {
            mostrarAlerta("Error al consultar los checkins.", "danger");
            console.error(error);
        }
    });
}

// ===== DIBUJAR TABLA =====
function dibujarTablaCheckin(checkins) {
    const tabla = $("#tablaCheckin");
    tabla.html("");

    checkins.forEach(function (checkinElemento) {
        const fechaFormateada = new Date(checkinElemento.fecha).toLocaleDateString("es-CR");

        const fila = `
            <tr>
                <td>${checkinElemento.usuario}</td>
                <td>${checkinElemento.nivelEnergia}</td>
                <td>${checkinElemento.calidadSueno}</td>
                <td>${checkinElemento.digestion}</td>
                <td>${checkinElemento.animo}</td>
                <td>${fechaFormateada}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="cargarActualizarCheckin('${checkinElemento._id}','${checkinElemento.usuario}',${checkinElemento.nivelEnergia},${checkinElemento.calidadSueno},${checkinElemento.digestion},${checkinElemento.animo})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarCheckin('${checkinElemento._id}')">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.append(fila);
    });
}

// ===== CREAR (POST) =====
function crearCheckin() {
    const usuario = $("#checkinUsuario").val();
    const nivelEnergia = $("#checkinEnergia").val();
    const calidadSueno = $("#checkinSueno").val();
    const digestion = $("#checkinDigestion").val();
    const animo = $("#checkinAnimo").val();

    const nuevoCheckin = new Checkin(usuario, nivelEnergia, calidadSueno, digestion, animo);

    $.ajax({
        url: config.apiCheckin,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(nuevoCheckin),
        success: function () {
            mostrarAlerta("Checkin creado correctamente.", "success");
            limpiarFormularioCheckin();
            $("#modalCheckin").modal("hide");
            consultarCheckins();
        },
        error: function (error) {
            mostrarAlerta("Error al crear el checkin.", "danger");
            console.error(error);
        }
    });
}

// ===== CARGAR DATOS PARA EDITAR =====
function cargarActualizarCheckin(id, usuario, energia, sueno, digestion, animo) {
    $("#tituloModalCheckin").text("Editar Checkin");
    $("#checkinId").val(id);
    $("#checkinUsuario").val(usuario);
    $("#checkinEnergia").val(energia);
    $("#checkinSueno").val(sueno);
    $("#checkinDigestion").val(digestion);
    $("#checkinAnimo").val(animo);

    const modal = new bootstrap.Modal($("#modalCheckin")[0]);
    modal.show();
}

// ===== ACTUALIZAR (PUT) =====
function actualizarCheckin(id) {
    const usuario = $("#checkinUsuario").val();
    const nivelEnergia = $("#checkinEnergia").val();
    const calidadSueno = $("#checkinSueno").val();
    const digestion = $("#checkinDigestion").val();
    const animo = $("#checkinAnimo").val();

    const checkinActualizado = new Checkin(usuario, nivelEnergia, calidadSueno, digestion, animo);

    $.ajax({
        url: `${config.apiCheckin}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(checkinActualizado),
        success: function () {
            mostrarAlerta("Checkin actualizado correctamente.", "success");
            limpiarFormularioCheckin();
            $("#modalCheckin").modal("hide");
            consultarCheckins();
        },
        error: function (error) {
            mostrarAlerta("Error al actualizar el checkin.", "danger");
            console.error(error);
        }
    });
}

// ===== ELIMINAR (DELETE) =====
function eliminarCheckin(id) {
    if (!confirm("¿Seguro que desea eliminar este checkin?")) {
        return;
    }

    $.ajax({
        url: `${config.apiCheckin}/${id}`,
        method: "DELETE",
        success: function () {
            mostrarAlerta("Checkin eliminado correctamente.", "success");
            consultarCheckins();
        },
        error: function (error) {
            mostrarAlerta("Error al eliminar el checkin.", "danger");
            console.error(error);
        }
    });
}

// ===== UTILIDADES =====
function limpiarFormularioCheckin() {
    $("#formCheckin")[0].reset();
    $("#checkinId").val("");
    $("#tituloModalCheckin").text("Nuevo Checkin");
}

function mostrarAlerta(mensaje, tipo) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show rounded-3" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertaCheckin").html(alerta);
}