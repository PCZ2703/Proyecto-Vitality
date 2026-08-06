$(document).ready(function () {
    cargarTerapeutas();

    $('#formCrearTerapeuta').on('submit', function (e) {
        e.preventDefault();
        crearTerapeuta();
    });

    $('#formEditarTerapeuta').on('submit', function (e) {
        e.preventDefault();
        actualizarTerapeuta();
    });

    $('#modalCrearTerapeuta').on('show.bs.modal', function () {
        $('#formCrearTerapeuta')[0].reset();
    });

    $('#btnConfirmarEliminarTerapeuta').on('click', function () {
        eliminarTerapeuta();
    });
});

function cargarTerapeutas() {
    $('#tablaTerapeuta tbody').html(
        '<tr class="fila-vacia"><td colspan="5">Cargando terapeutas...</td></tr>'
    );

    $.ajax({
        url: config.apiTerapeuta,
        method: 'GET',
        dataType: 'json'
    })
        .done(function (terapeutas) {
            renderizarTablaTerapeuta(terapeutas);
        })
        .fail(function (xhr) {
            $('#tablaTerapeuta tbody').html(
                '<tr class="fila-vacia"><td colspan="5">No se pudieron cargar los terapeutas.</td></tr>'
            );
            mostrarAlertaTerapeuta(obtenerMensajeErrorTerapeuta(xhr, 'No se pudo cargar la lista de terapeutas.'), 'danger');
        });
}

function renderizarTablaTerapeuta(terapeutas) {
    const $tbody = $('#tablaTerapeuta tbody');
    $tbody.empty();

    if (!terapeutas || terapeutas.length === 0) {
        $tbody.html('<tr class="fila-vacia"><td colspan="5">Todavía no hay terapeutas registrados.</td></tr>');
        return;
    }

    terapeutas.forEach(function (t) {
        const certificaciones = formatearListaComoBadges(t.certificaciones, 'bg-secondary');
        const disponibilidad = formatearListaComoBadges(t.disponibilidadHoraria, 'badge-activa');

        const fila = `
            <tr>
                <td>${escaparHtmlTerapeuta(t.nombre)}</td>
                <td>${escaparHtmlTerapeuta(t.especialidad)}</td>
                <td>${certificaciones}</td>
                <td>${disponibilidad}</td>
                <td class="text-nowrap">
                    <button class="btn btn-sm btn-success me-1" onclick="abrirEditarTerapeuta('${t._id}')">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="abrirConfirmarEliminarTerapeuta('${t._id}', '${escaparHtmlTerapeuta(t.nombre)}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
        $tbody.append(fila);
    });
}

function crearTerapeuta() {
    const nuevoTerapeuta = {
        nombre: $('#crearNombre').val().trim(),
        especialidad: $('#crearEspecialidad').val().trim(),
        certificaciones: textoATexto_lista($('#crearCertificaciones').val()),
        disponibilidadHoraria: textoATexto_lista($('#crearDisponibilidad').val())
    };

    if (nuevoTerapeuta.certificaciones.length === 0 || nuevoTerapeuta.disponibilidadHoraria.length === 0) {
        mostrarAlertaTerapeuta('Certificaciones y disponibilidad no pueden estar vacías.', 'danger');
        return;
    }

    $('#btnGuardarCrearTerapeuta').prop('disabled', true);

    $.ajax({
        url: config.apiTerapeuta,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(nuevoTerapeuta)
    })
        .done(function (respuesta) {
            $('#modalCrearTerapeuta').modal('hide');
            mostrarAlertaTerapeuta(respuesta.mensaje || 'Terapeuta creado correctamente.', 'success');
            cargarTerapeutas();
        })
        .fail(function (xhr) {
            mostrarAlertaTerapeuta(obtenerMensajeErrorTerapeuta(xhr, 'No se pudo crear el terapeuta.'), 'danger');
        })
        .always(function () {
            $('#btnGuardarCrearTerapeuta').prop('disabled', false);
        });
}

function abrirEditarTerapeuta(id) {
    $.ajax({
        url: `${config.apiTerapeuta}/${id}`,
        method: 'GET',
        dataType: 'json'
    })
        .done(function (t) {
            $('#editarId').val(t._id);
            $('#editarNombre').val(t.nombre);
            $('#editarEspecialidad').val(t.especialidad);
            $('#editarCertificaciones').val((t.certificaciones || []).join(', '));
            $('#editarDisponibilidad').val((t.disponibilidadHoraria || []).join(', '));

            $('#modalEditarTerapeuta').modal('show');
        })
        .fail(function (xhr) {
            mostrarAlertaTerapeuta(obtenerMensajeErrorTerapeuta(xhr, 'No se pudo cargar el terapeuta seleccionado.'), 'danger');
        });
}

function actualizarTerapeuta() {
    const id = $('#editarId').val();

    const terapeutaActualizado = {
        nombre: $('#editarNombre').val().trim(),
        especialidad: $('#editarEspecialidad').val().trim(),
        certificaciones: textoATexto_lista($('#editarCertificaciones').val()),
        disponibilidadHoraria: textoATexto_lista($('#editarDisponibilidad').val())
    };

    if (terapeutaActualizado.certificaciones.length === 0 || terapeutaActualizado.disponibilidadHoraria.length === 0) {
        mostrarAlertaTerapeuta('Certificaciones y disponibilidad no pueden estar vacías.', 'danger');
        return;
    }

    $('#btnGuardarEditarTerapeuta').prop('disabled', true);

    $.ajax({
        url: `${config.apiTerapeuta}/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(terapeutaActualizado)
    })
        .done(function (respuesta) {
            $('#modalEditarTerapeuta').modal('hide');
            mostrarAlertaTerapeuta(respuesta.mensaje || 'Terapeuta actualizado correctamente.', 'success');
            cargarTerapeutas();
        })
        .fail(function (xhr) {
            mostrarAlertaTerapeuta(obtenerMensajeErrorTerapeuta(xhr, 'No se pudo actualizar el terapeuta.'), 'danger');
        })
        .always(function () {
            $('#btnGuardarEditarTerapeuta').prop('disabled', false);
        });
}

let idAEliminarTerapeuta = null;

function abrirConfirmarEliminarTerapeuta(id, nombre) {
    idAEliminarTerapeuta = id;
    $('#nombreTerapeutaAEliminar').text(nombre);
    $('#modalConfirmarEliminarTerapeuta').modal('show');
}

function eliminarTerapeuta() {
    if (!idAEliminarTerapeuta) return;

    $('#btnConfirmarEliminarTerapeuta').prop('disabled', true);

    $.ajax({
        url: `${config.apiTerapeuta}/${idAEliminarTerapeuta}`,
        method: 'DELETE'
    })
        .done(function (respuesta) {
            $('#modalConfirmarEliminarTerapeuta').modal('hide');
            mostrarAlertaTerapeuta(respuesta.mensaje || 'Terapeuta eliminado correctamente.', 'success');
            idAEliminarTerapeuta = null;
            cargarTerapeutas();
        })
        .fail(function (xhr) {
            $('#modalConfirmarEliminarTerapeuta').modal('hide');
            mostrarAlertaTerapeuta(obtenerMensajeErrorTerapeuta(xhr, 'No se pudo eliminar el terapeuta.'), 'danger');
        })
        .always(function () {
            $('#btnConfirmarEliminarTerapeuta').prop('disabled', false);
        });
}

function textoATexto_lista(texto) {
    if (!texto) return [];
    return texto.split(',')
        .map(function (item) { return item.trim(); })
        .filter(function (item) { return item.length > 0; });
}

function formatearListaComoBadges(lista, claseBadge) {
    if (!lista || lista.length === 0) {
        return '<span class="text-muted small">Sin datos</span>';
    }
    return lista.map(function (item) {
        return `<span class="badge ${claseBadge} me-1 mb-1">${escaparHtmlTerapeuta(item)}</span>`;
    }).join('');
}

function escaparHtmlTerapeuta(texto) {
    if (texto === undefined || texto === null) return '';
    return $('<div>').text(texto).html();
}

function obtenerMensajeErrorTerapeuta(xhr, mensajePorDefecto) {
    if (xhr.responseJSON) {
        return xhr.responseJSON.mensajePersonalizado || xhr.responseJSON.mensaje || mensajePorDefecto;
    }
    return mensajePorDefecto;
}

function mostrarAlertaTerapeuta(mensaje, tipo) {
    const id = 'alerta-' + Date.now();
    const html = `
        <div id="${id}" class="alert alert-${tipo} alert-dismissible fade show shadow-sm rounded-3" role="alert">
            ${escaparHtmlTerapeuta(mensaje)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    $('#alertContainer').append(html);
    setTimeout(function () {
        $(`#${id}`).alert('close');
    }, 5000);
}
