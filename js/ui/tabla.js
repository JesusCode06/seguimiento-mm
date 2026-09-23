// ==========================================
// TABLA DE MIEMBROS
// ==========================================

import { claseEstado, escaparHtml } from "../utils/helpers.js";

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
                <td colspan="12" style="text-align: center;">
                    No hay miembros registrados.
                </td>
            </tr>
        `;

        return;
    }


    miembros.forEach(miembro => {

        const fila =
            document.createElement("tr");

        fila.innerHTML = `

            <td>${escaparHtml(miembro.dni)}</td>

            <td>${escaparHtml(miembro.apellidos)}</td>

            <td>${escaparHtml(miembro.nombres)}</td>

            <td>${escaparHtml(miembro.celular)}</td>

            <td>${escaparHtml(miembro.mesa)}</td>

            <td>${escaparHtml(miembro.cargo)}</td>

            <td>${renderizarEstado(miembro.contacto)}</td>

            <td>${renderizarEstado(miembro.capacitacion)}</td>

            <td>${renderizarEstado(miembro.asistencia)}</td>

            <td>${renderizarEstado(miembro.credencial || "Pendiente")}</td>

            <td class="celda-nota" title="${escaparHtml(miembro.nota || "Sin observaciones")}">
                ${escaparHtml(miembro.nota || "-")}
            </td>

            <td>
                <button
                    class="btn-ver"
                    data-dni="${miembro.dni}">
                    Ver
                </button>
            </td>

        `;

        cuerpoTabla.appendChild(fila);

    });


    // ==========================================
    // BOTONES VER
    // ==========================================

    const botonesVer =
        document.querySelectorAll(".btn-ver");


    botonesVer.forEach(boton => {

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


                // Avisamos al sistema
                // que queremos ver este miembro

                document.dispatchEvent(
                    new CustomEvent(
                        "verMiembro",
                        {
                            detail: miembro
                        }
                    )
                );

            }
        );

    });

}