/* ==========================================================================
   Vitalia Connect — Módulo Usuario
   CRUD completo contra config.apiUsuario usando jQuery AJAX.
   La contraseña nunca se muestra en la tabla (se enmascara), y en el
   modal de editar queda vacía: si el campo se deja vacío al actualizar,
   no se envía (se conserva la contraseña anterior).
   ========================================================================== */

$(document).ready(function () {
    cargarUsuarios();

    $('#formCrearUsuario').on('submit', function (e) {
        e.preventDefault();
        crearUsuario();
    });

    $('#formEditarUsuario').on('submit', function (e) {
        e.preventDefault();
        actualizarUsuario();
    });

    $('#modalCrearUsuario').on('show.bs.modal', function () {
        $('#formCrearUsuario')[0].reset();
    });

    $('#btnConfirmarEliminarUsuario').on('click', function () {
        eliminarUsuario();
    });
});

// ---------- LEER / LISTAR ----------
function cargarUsuarios() {
    $('#tablaUsuario tbody').html(
        '<tr class="fila-vacia"><td colspan="5">Cargando usuarios...</td></tr>'
    );

    $.ajax({
        url: config.apiUsuario,
        method: 'GET',
        dataType: 'json'
    })
        .done(function (usuarios) {
            renderizarTablaUsuario(usuarios);
        })
        .fail(function (xhr) {
            $('#tablaUsuario tbody').html(
                '<tr class="fila-vacia"><td colspan="5">No se pudieron cargar los usuarios.</td></tr>'
            );
            mostrarAlertaUsuario(obtenerMensajeErrorUsuario(xhr, 'No se pudo cargar la lista de usuarios.'), 'danger');
        });
}

function renderizarTablaUsuario(usuarios) {
    const $tbody = $('#tablaUsuario tbody');
    $tbody.empty();

    if (!usuarios || usuarios.length === 0) {
        $tbody.html('<tr class="fila-vacia"><td colspan="5">Todavía no hay usuarios registrados.</td></tr>');
        return;
    }

    usuarios.forEach(function (u) {
        const badgeRol = obtenerBadgeRol(u.rol);
        const fecha = u.fechaRegistro ? formatearFechaUsuario(new Date(u.fechaRegistro)) : '—';

        const fila = `
            <tr>
                <td>${escaparHtmlUsuario(u.nombre)}</td>
                <td>${escaparHtmlUsuario(u.correo)}</td>
                <td>${badgeRol}</td>
                <td>${fecha}</td>
                <td class="text-nowrap">
                    <button class="btn btn-sm btn-success me-1" onclick="abrirEditarUsuario('${u._id}')">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="abrirConfirmarEliminarUsuario('${u._id}', '${escaparHtmlUsuario(u.nombre)}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
        $tbody.append(fila);
    });
}

// ---------- CREAR ----------
function crearUsuario() {
    const nuevoUsuario = {
        nombre: $('#crearNombre').val().trim(),
        correo: $('#crearCorreo').val().trim(),
        contrasena: $('#crearContrasena').val(),
        rol: $('#crearRol').val()
    };

    $('#btnGuardarCrearUsuario').prop('disabled', true);

    $.ajax({
        url: config.apiUsuario,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(nuevoUsuario)
    })
        .done(function (respuesta) {
            $('#modalCrearUsuario').modal('hide');
            mostrarAlertaUsuario(respuesta.mensaje || 'Usuario creado correctamente.', 'success');
            cargarUsuarios();
        })
        .fail(function (xhr) {
            mostrarAlertaUsuario(obtenerMensajeErrorUsuario(xhr, 'No se pudo crear el usuario. Verificá que el correo no esté repetido.'), 'danger');
        })
        .always(function () {
            $('#btnGuardarCrearUsuario').prop('disabled', false);
        });
}

// ---------- ABRIR MODAL EDITAR ----------
function abrirEditarUsuario(id) {
    $.ajax({
        url: `${config.apiUsuario}/${id}`,
        method: 'GET',
        dataType: 'json'
    })
        .done(function (u) {
            $('#editarId').val(u._id);
            $('#editarNombre').val(u.nombre);
            $('#editarCorreo').val(u.correo);
            $('#editarContrasena').val(''); // nunca se precarga la contraseña
            $('#editarRol').val(u.rol);

            $('#modalEditarUsuario').modal('show');
        })
        .fail(function (xhr) {
            mostrarAlertaUsuario(obtenerMensajeErrorUsuario(xhr, 'No se pudo cargar el usuario seleccionado.'), 'danger');
        });
}

// ---------- ACTUALIZAR ----------
function actualizarUsuario() {
    const id = $('#editarId').val();

    const usuarioActualizado = {
        nombre: $('#editarNombre').val().trim(),
        correo: $('#editarCorreo').val().trim(),
        rol: $('#editarRol').val()
    };

    // Solo se envía la contraseña si el usuario escribió una nueva
    const nuevaContrasena = $('#editarContrasena').val();
    if (nuevaContrasena) {
        usuarioActualizado.contrasena = nuevaContrasena;
    }

    $('#btnGuardarEditarUsuario').prop('disabled', true);

    $.ajax({
        url: `${config.apiUsuario}/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(usuarioActualizado)
    })
        .done(function (respuesta) {
            $('#modalEditarUsuario').modal('hide');
            mostrarAlertaUsuario(respuesta.mensaje || 'Usuario actualizado correctamente.', 'success');
            cargarUsuarios();
        })
        .fail(function (xhr) {
            mostrarAlertaUsuario(obtenerMensajeErrorUsuario(xhr, 'No se pudo actualizar el usuario.'), 'danger');
        })
        .always(function () {
            $('#btnGuardarEditarUsuario').prop('disabled', false);
        });
}

// ---------- ELIMINAR ----------
let idAEliminarUsuario = null;

function abrirConfirmarEliminarUsuario(id, nombre) {
    idAEliminarUsuario = id;
    $('#nombreUsuarioAEliminar').text(nombre);
    $('#modalConfirmarEliminarUsuario').modal('show');
}

function eliminarUsuario() {
    if (!idAEliminarUsuario) return;

    $('#btnConfirmarEliminarUsuario').prop('disabled', true);

    $.ajax({
        url: `${config.apiUsuario}/${idAEliminarUsuario}`,
        method: 'DELETE'
    })
        .done(function (respuesta) {
            $('#modalConfirmarEliminarUsuario').modal('hide');
            mostrarAlertaUsuario(respuesta.mensaje || 'Usuario eliminado correctamente.', 'success');
            idAEliminarUsuario = null;
            cargarUsuarios();
        })
        .fail(function (xhr) {
            $('#modalConfirmarEliminarUsuario').modal('hide');
            mostrarAlertaUsuario(obtenerMensajeErrorUsuario(xhr, 'No se pudo eliminar el usuario.'), 'danger');
        })
        .always(function () {
            $('#btnConfirmarEliminarUsuario').prop('disabled', false);
        });
}

// ---------- Utilidades (con sufijo Usuario para no chocar con otros módulos) ----------
function obtenerBadgeRol(rol) {
    const clases = {
        'Cliente': 'badge-activa',
        'Terapeuta': 'bg-primary',
        'Administrador': 'bg-dark'
    };
    const clase = clases[rol] || 'bg-secondary';
    return `<span class="badge ${clase}">${escaparHtmlUsuario(rol)}</span>`;
}

function formatearFechaUsuario(fecha) {
    return fecha.toLocaleDateString('es-CR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function escaparHtmlUsuario(texto) {
    if (texto === undefined || texto === null) return '';
    return $('<div>').text(texto).html();
}

function obtenerMensajeErrorUsuario(xhr, mensajePorDefecto) {
    if (xhr.responseJSON) {
        return xhr.responseJSON.mensajePersonalizado || xhr.responseJSON.mensaje || mensajePorDefecto;
    }
    return mensajePorDefecto;
}

function mostrarAlertaUsuario(mensaje, tipo) {
    const id = 'alerta-' + Date.now();
    const html = `
        <div id="${id}" class="alert alert-${tipo} alert-dismissible fade show shadow-sm rounded-3" role="alert">
            ${escaparHtmlUsuario(mensaje)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    $('#alertContainer').append(html);
    setTimeout(function () {
        $(`#${id}`).alert('close');
    }, 5000);
}