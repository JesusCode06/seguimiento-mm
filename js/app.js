// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================

import { miembros } from "./data/miembros.js";
import { cargarMiembros } from "./services/miembrosService.js";
import {
    exportarMiembros,
    exportarReporteExcel,
    eliminarTodosLosMiembros,
    guardarMiembros,
    leerRespaldo,
    restaurarMiembros
} from "./services/miembrosService.js";

import { renderizarTabla } from "./ui/tabla.js";

import { inicializarFiltros }
    from "./ui/filtros.js";

import { inicializarFormulario }
    from "./ui/formulario.js";
import { mostrarMensaje } from "./ui/mensajes.js";
import { validarMiembro } from "./utils/validaciones.js";

const miembrosActuales = cargarMiembros(miembros);


// ==========================================
// INICIAR
// ==========================================

function iniciarAplicacion() {

    actualizarInterfaz(miembrosActuales);


    // ======================================
    // FILTROS
    // ======================================

    inicializarFiltros(
        miembrosActuales,
        resultados => {
            renderizarTabla(resultados);

        }
    );


    // ======================================
    // FORMULARIO
    // ======================================

    inicializarFormulario(
        miembrosActuales,
        () => {

            actualizarInterfaz(miembrosActuales);

        }
    );

    inicializarRespaldo();
    inicializarVistas();

}

function inicializarVistas() {
    const contenedor = document.querySelector("main");
    const btnSeguimiento = document.getElementById("btnVistaSeguimiento");
    const btnResumen = document.getElementById("btnVistaResumen");

    function cambiarVista(vista) {
        const esResumen = vista === "resumen";

        contenedor.classList.toggle("vista-resumen-activa", esResumen);
        btnSeguimiento.classList.toggle("activo", !esResumen);
        btnResumen.classList.toggle("activo", esResumen);
        btnSeguimiento.setAttribute("aria-selected", String(!esResumen));
        btnResumen.setAttribute("aria-selected", String(esResumen));
    }

    btnSeguimiento.addEventListener("click", () => cambiarVista("seguimiento"));
    btnResumen.addEventListener("click", () => cambiarVista("resumen"));
}

function inicializarRespaldo() {
    const btnImprimir = document.getElementById("btnImprimir");
    const btnReporteExcel = document.getElementById("btnReporteExcel");
    const btnExportar = document.getElementById("btnExportar");
    const btnImportar = document.getElementById("btnImportar");
    const btnRestaurar = document.getElementById("btnRestaurar");
    const btnEliminarTodos = document.getElementById("btnEliminarTodos");
    const archivoImportacion = document.getElementById("archivoImportacion");

    btnImprimir.addEventListener("click", () => {
        window.print();
    });

    btnReporteExcel.addEventListener("click", () => {
        exportarReporteExcel(miembrosActuales);
        mostrarMensaje("Reporte Excel generado con resumen, detalle y pendientes.");
    });

    btnExportar.addEventListener("click", () => {
        exportarMiembros(miembrosActuales);
        mostrarMensaje("Respaldo descargado correctamente.");
    });

    btnImportar.addEventListener("click", () => archivoImportacion.click());

    archivoImportacion.addEventListener("change", async () => {
        const archivo = archivoImportacion.files[0];

        if (!archivo) {
            return;
        }

        try {
            const datos = await leerRespaldo(archivo);
            const datosValidados = [];

            for (const miembro of datos) {
                const error = validarMiembro(miembro, datosValidados);

                if (error) {
                    throw new Error(`El respaldo no es válido: ${error}`);
                }

                datosValidados.push(miembro);
            }

            miembrosActuales.splice(0, miembrosActuales.length, ...datosValidados);
            guardarMiembros(miembrosActuales);
            document.dispatchEvent(new CustomEvent("miembrosActualizados"));
            actualizarInterfaz(miembrosActuales);
            mostrarMensaje("Respaldo importado correctamente.");
        } catch (error) {
            mostrarMensaje(error.message || "No se pudo importar el respaldo.", "error");
        } finally {
            archivoImportacion.value = "";
        }
    });

    btnRestaurar.addEventListener("click", () => {
        if (!confirm("Se reemplazarán los registros actuales por los datos iniciales. ¿Continuar?")) {
            return;
        }

        const datosIniciales = restaurarMiembros(miembros);
        miembrosActuales.splice(0, miembrosActuales.length, ...datosIniciales);
        document.dispatchEvent(new CustomEvent("miembrosActualizados"));
        actualizarInterfaz(miembrosActuales);
        mostrarMensaje("Datos iniciales restaurados.");
    });

    btnEliminarTodos.addEventListener("click", () => {
        if (!confirm("Se eliminarán todos los miembros guardados. Esta acción no se puede deshacer. ¿Continuar?")) {
            return;
        }

        eliminarTodosLosMiembros();
        miembrosActuales.splice(0, miembrosActuales.length);
        document.dispatchEvent(new CustomEvent("miembrosActualizados"));
        actualizarInterfaz(miembrosActuales);
        mostrarMensaje("Todos los miembros fueron eliminados. El sistema está listo para comenzar.");
    });
}


// ==========================================
// ACTUALIZAR INTERFAZ
// ==========================================

function actualizarInterfaz(miembrosParaTabla) {

    renderizarTabla(
        miembrosParaTabla
    );


    actualizarResumen(
        miembrosActuales
    );

    actualizarResumenMesas(miembrosActuales);
    actualizarResumenDetallado(miembrosActuales);

}

function actualizarResumenDetallado(registros) {
    const contenedor = document.getElementById("detalleIndicadores");
    const total = registros.length;
    const indicadores = [
        ["Contacto", "contacto"],
        ["Capacitación", "capacitacion"],
        ["Credencial", "credencial"],
        ["Asistencia 04 de octubre", "asistencia"]
    ];

    contenedor.innerHTML = indicadores.map(([titulo, campo]) => {
        const si = registros.filter(miembro => (miembro[campo] || "Pendiente") === "Sí").length;
        const no = registros.filter(miembro => miembro[campo] === "No").length;
        const pendiente = total - si - no;
        const porcentajeSi = total ? Math.round((si / total) * 100) : 0;

        return `
            <article class="detalle-indicador">
                <div class="detalle-indicador-cabecera">
                    <h3>${titulo}</h3>
                    <strong>${porcentajeSi}%</strong>
                </div>
                <div class="barra-progreso" aria-label="${porcentajeSi}% completado">
                    <span style="width: ${porcentajeSi}%"></span>
                </div>
                <div class="detalle-estados">
                    <span class="detalle-si"><b>${si}</b> Sí</span>
                    <span class="detalle-no"><b>${no}</b> No</span>
                    <span class="detalle-pendiente"><b>${pendiente}</b> Pendiente</span>
                </div>
            </article>
        `;
    }).join("");
}

function actualizarResumenMesas(registros) {
    const cuerpo = document.getElementById("cuerpoResumenMesas");
    const mesas = [...new Set(registros.map(miembro => miembro.mesa))].sort();

    cuerpo.innerHTML = "";

    if (mesas.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="7" class="tabla-vacia">No hay mesas registradas.</td></tr>';
        return;
    }

    mesas.forEach(mesa => {
        const miembrosMesa = registros.filter(miembro => miembro.mesa === mesa);
        const porcentajeEstado = estado => Math.round(
            (miembrosMesa.filter(miembro => miembro[estado] === "Sí").length / 9) * 100
        );
        const completos = miembrosMesa.length === 9 && ["contacto", "capacitacion", "asistencia", "credencial"].every(
            estado => miembrosMesa.every(miembro => miembro[estado] === "Sí")
        );
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td><strong>${mesa}</strong></td>
            <td>${miembrosMesa.length} / 9</td>
            <td>${porcentajeEstado("contacto")} %</td>
            <td>${porcentajeEstado("capacitacion")} %</td>
            <td>${porcentajeEstado("credencial")} %</td>
            <td>${porcentajeEstado("asistencia")} %</td>
            <td><span class="estado ${completos ? "estado-si" : "estado-pendiente"}">${completos ? "Completa" : "En seguimiento"}</span></td>
        `;

        cuerpo.appendChild(fila);
    });
}


// ==========================================
// RESUMEN
// ==========================================

function actualizarResumen(
    miembrosActuales
) {

    document.getElementById(
        "totalMiembros"
    ).textContent =
        miembrosActuales.length;


    const mesas =
        new Set(
            miembrosActuales.map(
                miembro =>
                    miembro.mesa
            )
        );


    document.getElementById(
        "totalMesas"
    ).textContent =
        mesas.size;


    const contactados =
        miembrosActuales.filter(
            miembro =>
                miembro.contacto === "Sí"
        ).length;


    document.getElementById(
        "totalContactados"
    ).textContent =
        contactados;


    const capacitados =
        miembrosActuales.filter(
            miembro =>
                miembro.capacitacion === "Sí"
        ).length;


    document.getElementById(
        "totalCapacitados"
    ).textContent =
        capacitados;


    const asistencia =
        miembrosActuales.filter(
            miembro =>
                miembro.asistencia === "Sí"
        ).length;


    document.getElementById(
        "totalAsistencia"
    ).textContent =
        asistencia;

}


// ==========================================
// EJECUTAR
// ==========================================

iniciarAplicacion();