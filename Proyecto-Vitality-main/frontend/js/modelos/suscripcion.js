/* ==========================================================================
   Vitalia Connect — Módulo Suscripción
   CRUD completo contra config.apiSuscripcion usando jQuery AJAX.
   ========================================================================== */

// Guarda temporalmente el historial de cambios del registro que se está
// editando, para poder agregarle una nueva entrada sin perder las viejas.
let historialActual = [];

$(document).ready(function () {
    cargarSuscripciones();

    $('#formCrearSuscripcion').on('submit', function (e) {
        e.preventDefault();
        crearSuscripcion();
    });

    $('#formEditarSuscripcion').on('submit', function (e) {
        e.preventDefault();
        actualizarSuscripcion();
    });

    // Limpia el formulario de creación cada vez que se abre el modal
    $('#modalCrearSuscripcion').on('show.bs.modal', function () {
        $('#formCrearSuscripcion')[0].reset();
    });

    $('#btnConfirmarEliminarSuscripcion').on('click', function () {
        eliminarSuscripcion();
    });
});

// ---------- LEER / LISTAR ----------
function cargarSuscripciones() {
    $('#tablaSuscripcion tbody').html(
        '<tr class="fila-vacia"><td colspan="6">Cargando suscripciones...</td></tr>'
    );

    $.ajax({
        url: config.apiSuscripcion,
        method: 'GET',
        dataType: 'json'
    })
        .done(function (suscripciones) {
            renderizarTablaSuscripcion(suscripciones);
        })
        .fail(function (xhr) {
            $('#tablaSuscripcion tbody').html(
                '<tr class="fila-vacia"><td colspan="6">No se pudieron cargar las suscripciones.</td></tr>'
            );
            mostrarAlerta(obtenerMensajeError(xhr, 'No se pudo cargar la lista de suscripciones.'), 'danger');
        });
}

function renderizarTablaSuscripcion(suscripciones) {
    const $tbody = $('#tablaSuscripcion tbody');
    $tbody.empty();

    if (!suscripciones || suscripciones.length === 0) {
        $tbody.html('<tr class="fila-vacia"><td colspan="6">Todavía no hay suscripciones registradas.</td></tr>');
        return;
    }

    suscripciones.forEach(function (s) {
        const badge = obtenerBadgeEstado(s.estado);
        const historial = (s.historialCambios && s.historialCambios.length)
            ? s.historialCambios.length + ' cambio(s)'
            : 'Sin cambios';

        const fila = `
            <tr>
                <td>${escaparHtml(s.usuario)}</td>
                <td>${escaparHtml(s.plan)}</td>
                <td>${escaparHtml(s.cicloFacturacion)}</td>
                <td>${badge}</td>
                <td><span class="text-muted small">${historial}</span></td>
                <td class="text-nowrap">
                    <button class="btn btn-sm btn-success me-1" onclick="abrirEditarSuscripcion('${s._id}')">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="abrirConfirmarEliminarSuscripcion('${s._id}', '${escaparHtml(s.usuario)}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
        $tbody.append(fila);
    });
}

// ---------- CREAR ----------
function crearSuscripcion() {
    const nuevaSuscripcion = {
        usuario: $('#crearUsuario').val().trim(),
        plan: $('#crearPlan').val().trim(),
        cicloFacturacion: $('#crearCicloFacturacion').val(),
        estado: $('#crearEstado').val(),
        historialCambios: [`Suscripción creada (${formatearFecha(new Date())})`]
    };

    $('#btnGuardarCrearSuscripcion').prop('disabled', true);

    $.ajax({
        url: config.apiSuscripcion,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(nuevaSuscripcion)
    })
        .done(function (respuesta) {
            $('#modalCrearSuscripcion').modal('hide');
            mostrarAlerta(respuesta.mensaje || 'Suscripción creada correctamente.', 'success');
            cargarSuscripciones();
        })
        .fail(function (xhr) {
            mostrarAlerta(obtenerMensajeError(xhr, 'No se pudo crear la suscripción.'), 'danger');
        })
        .always(function () {
            $('#btnGuardarCrearSuscripcion').prop('disabled', false);
        });
}

// ---------- ABRIR MODAL EDITAR (carga los datos actuales) ----------
function abrirEditarSuscripcion(id) {
    $.ajax({
        url: `${config.apiSuscripcion}/${id}`,
        method: 'GET',
        dataType: 'json'
    })
        .done(function (s) {
            $('#editarId').val(s._id);
            $('#editarUsuario').val(s.usuario);
            $('#editarPlan').val(s.plan);
            $('#editarCicloFacturacion').val(s.cicloFacturacion);
            $('#editarEstado').val(s.estado);
            $('#editarEstado').data('estado-original', s.estado);
            historialActual = s.historialCambios || [];

            $('#modalEditarSuscripcion').modal('show');
        })
        .fail(function (xhr) {
            mostrarAlerta(obtenerMensajeError(xhr, 'No se pudo cargar la suscripción seleccionada.'), 'danger');
        });
}

// ---------- ACTUALIZAR ----------
function actualizarSuscripcion() {
    const id = $('#editarId').val();
    const estadoNuevo = $('#editarEstado').val();
    const estadoOriginal = $('#editarEstado').data('estado-original');

    let historial = historialActual.slice();
    if (estadoNuevo !== estadoOriginal) {
        historial.push(`Estado cambiado de "${estadoOriginal}" a "${estadoNuevo}" (${formatearFecha(new Date())})`);
    }

    const suscripcionActualizada = {
        usuario: $('#editarUsuario').val().trim(),
        plan: $('#editarPlan').val().trim(),
        cicloFacturacion: $('#editarCicloFacturacion').val(),
        estado: estadoNuevo,
        historialCambios: historial
    };

    $('#btnGuardarEditarSuscripcion').prop('disabled', true);

    $.ajax({
        url: `${config.apiSuscripcion}/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(suscripcionActualizada)
    })
        .done(function (respuesta) {
            $('#modalEditarSuscripcion').modal('hide');
            mostrarAlerta(respuesta.mensaje || 'Suscripción actualizada correctamente.', 'success');
            cargarSuscripciones();
        })
        .fail(function (xhr) {
            mostrarAlerta(obtenerMensajeError(xhr, 'No se pudo actualizar la suscripción.'), 'danger');
        })
        .always(function () {
            $('#btnGuardarEditarSuscripcion').prop('disabled', false);
        });
}

// ---------- ELIMINAR ----------
let idAEliminar = null;

function abrirConfirmarEliminarSuscripcion(id, usuario) {
    idAEliminar = id;
    $('#nombreSuscripcionAEliminar').text(usuario);
    $('#modalConfirmarEliminarSuscripcion').modal('show');
}

function eliminarSuscripcion() {
    if (!idAEliminar) return;

    $('#btnConfirmarEliminarSuscripcion').prop('disabled', true);

    $.ajax({
        url: `${config.apiSuscripcion}/${idAEliminar}`,
        method: 'DELETE'
    })
        .done(function (respuesta) {
            $('#modalConfirmarEliminarSuscripcion').modal('hide');
            mostrarAlerta(respuesta.mensaje || 'Suscripción eliminada correctamente.', 'success');
            idAEliminar = null;
            cargarSuscripciones();
        })
        .fail(function (xhr) {
            $('#modalConfirmarEliminarSuscripcion').modal('hide');
            mostrarAlerta(obtenerMensajeError(xhr, 'No se pudo eliminar la suscripción.'), 'danger');
        })
        .always(function () {
            $('#btnConfirmarEliminarSuscripcion').prop('disabled', false);
        });
}

// ---------- Utilidades ----------
function obtenerBadgeEstado(estado) {
    const clases = {
        'Activa': 'badge-activa',
        'Pausada': 'badge-pausada',
        'Cancelada': 'badge-cancelada'
    };
    const clase = clases[estado] || 'bg-secondary';
    return `<span class="badge ${clase}">${escaparHtml(estado)}</span>`;
}

function formatearFecha(fecha) {
    return fecha.toLocaleDateString('es-CR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function escaparHtml(texto) {
    if (texto === undefined || texto === null) return '';
    return $('<div>').text(texto).html();
}

function obtenerMensajeError(xhr, mensajePorDefecto) {
    if (xhr.responseJSON) {
        return xhr.responseJSON.mensajePersonalizado || xhr.responseJSON.mensaje || mensajePorDefecto;
    }
    return mensajePorDefecto;
}

// Alertas de Bootstrap (nunca alert() nativo)
function mostrarAlerta(mensaje, tipo) {
    const id = 'alerta-' + Date.now();
    const html = `
        <div id="${id}" class="alert alert-${tipo} alert-dismissible fade show shadow-sm rounded-3" role="alert">
            ${escaparHtml(mensaje)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    $('#alertContainer').append(html);
    setTimeout(function () {
        $(`#${id}`).alert('close');
    }, 5000);
}