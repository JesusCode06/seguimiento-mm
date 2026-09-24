// ==========================================
// TABLA DE MIEMBROS
// ==========================================

import { claseEstado, escaparHtml, ordenarMiembros } from "../utils/helpers.js";

function renderizarEstado(estado) {
    const clase = claseEstado(estado);
    return `<span class="estado estado-${clase}">${escaparHtml(estado)}</span>`;
}

export function renderizarTabla(miembros) {

    const cuerpoTabla =
        document.getElementById("cuerpoTabla");

    const contador =
        document.getElementById("contadorRegistros");

    cuerpoTabla.innerHTML = "";

    contador.textContent = miembros.length;


    if (miembros.length === 0) {

        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="13" style="text-align: center;">
                    No hay miembros registrados.
                </td>
            </tr>
        `;

        return;
    }


    ordenarMiembros(miembros).forEach(miembro => {

        const fila =
            document.createElement("tr");

        fila.innerHTML = `

            <td>${escaparHtml(miembro.dni)}</td>

            <td>${escaparHtml(miembro.apellidos)}</td>

            <td>${escaparHtml(miembro.nombres)}</td>

            <td>${escaparHtml(miembro.celular)}</td>

            <td>${escaparHtml(miembro.lugarPertenencia || "-")}</td>

            <td>${escaparHtml(miembro.mesa)}</td>

            <td>${escaparHtml(miembro.cargo)}</td>

            <td>${renderizarEstado(miembro.contacto)}</td>

            <td>${renderizarEstado(miembro.capacitacion)}</td>

            <td>${renderizarEstado(miembro.asistencia)}</td>

            <td>${renderizarEstado(miembro.credencial || "Pendiente")}</td>

            <td class="celda-nota" title="${escaparHtml(miembro.nota || "Sin observaciones")}">
                ${escaparHtml(miembro.nota || "-")}
            </td>

            <td class="celda-acciones">
                <button
                    class="btn-accion btn-ver"
                    data-dni="${miembro.dni}"
                    type="button"
                    title="Ver detalle">
                    Ver
                </button>
                <button
                    class="btn-accion btn-editar"
                    data-dni="${miembro.dni}"
                    type="button"
                    title="Editar miembro">
                    Editar
                </button>
                <button
                    class="btn-accion btn-eliminar-tabla"
                    data-dni="${miembro.dni}"
                    type="button"
                    title="Eliminar miembro">
                    Eliminar
                </button>
            </td>

        `;

        cuerpoTabla.appendChild(fila);

    });


    // ==========================================
    // ACCIONES DE LA TABLA
    // ==========================================

    const botonesAccion =
        document.querySelectorAll(".btn-accion");


    botonesAccion.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const dni =
                    boton.dataset.dni;

                const miembro =
                    miembros.find(
                        item =>
                            item.dni === dni
                    );


                if (!miembro) {
                    return;
                }


                const evento = boton.classList.contains("btn-editar")
                    ? "editarMiembro"
                    : boton.classList.contains("btn-eliminar-tabla")
                        ? "eliminarMiembro"
                        : "verMiembro";

                document.dispatchEvent(
                    new CustomEvent(evento, { detail: miembro })
                );

            }
        );

    });

}