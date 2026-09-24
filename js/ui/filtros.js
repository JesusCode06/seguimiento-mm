// ==========================================
// SISTEMA DE FILTROS
// ==========================================

export function inicializarFiltros(miembros, callback) {

    const buscar = document.getElementById("buscar");
    const filtroMesa = document.getElementById("filtroMesa");
    const filtroCargo = document.getElementById("filtroCargo");
    const filtroContacto = document.getElementById("filtroContacto");
    const filtroCapacitacion = document.getElementById("filtroCapacitacion");
    const filtroAsistencia = document.getElementById("filtroAsistencia");
    const filtroCredencial = document.getElementById("filtroCredencial");
    const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");


    // ==========================================
    // CARGAR MESAS
    // ==========================================

    function cargarMesas() {
        const mesas = [
            ...new Set(
                miembros.map(miembro => miembro.mesa)
            )
        ].sort();

        filtroMesa.querySelectorAll("option:not(:first-child)").forEach(opcion => {
            opcion.remove();
        });

        mesas.forEach(mesa => {
            const opcion = document.createElement("option");

            opcion.value = mesa;
            opcion.textContent = mesa;

            filtroMesa.appendChild(opcion);
        });
    }

    cargarMesas();
    document.addEventListener("miembrosActualizados", cargarMesas);


    // ==========================================
    // FUNCIÓN DE FILTRADO
    // ==========================================

    function aplicarFiltros() {

        const texto =
            buscar.value
                .trim()
                .toLowerCase();


        const mesa =
            filtroMesa.value;


        const cargo =
            filtroCargo.value;


        const contacto =
            filtroContacto.value;


        const capacitacion =
            filtroCapacitacion.value;


        const asistencia =
            filtroAsistencia.value;

        const credencial =
            filtroCredencial.value;


        const resultados =
            miembros.filter(miembro => {

                // Buscar texto

                const textoBuscable = [
                    miembro.dni,
                    miembro.apellidos,
                    miembro.nombres,
                    miembro.celular,
                    miembro.lugarPertenencia,
                    miembro.cargo,
                    miembro.nota,
                    miembro.modalidadCredencial,
                    miembro.lugarCapacitacion
                ].filter(Boolean).join(" ").toLowerCase();

                const coincideTexto =
                    !texto || textoBuscable.includes(texto);


                // Mesa

                const coincideMesa =
                    !mesa ||
                    miembro.mesa === mesa;


                // Cargo

                const coincideCargo =
                    !cargo ||
                    miembro.cargo === cargo;


                // Contacto

                const coincideContacto =
                    !contacto ||
                    miembro.contacto === contacto;


                // Capacitación

                const coincideCapacitacion =
                    !capacitacion ||
                    miembro.capacitacion === capacitacion;


                // Asistencia

                const coincideAsistencia =
                    !asistencia ||
                    miembro.asistencia === asistencia;

                const coincideCredencial =
                    !credencial ||
                    (miembro.credencial || "Pendiente") === credencial;


                return (
                    coincideTexto &&
                    coincideMesa &&
                    coincideCargo &&
                    coincideContacto &&
                    coincideCapacitacion &&
                    coincideAsistencia &&
                    coincideCredencial
                );

            });


        callback(resultados);

    }


    // ==========================================
    // EVENTOS
    // ==========================================

    buscar.addEventListener(
        "input",
        aplicarFiltros
    );


    filtroMesa.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroCargo.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroContacto.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroCapacitacion.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroAsistencia.addEventListener(
        "change",
        aplicarFiltros
    );

    filtroCredencial.addEventListener(
        "change",
        aplicarFiltros
    );

    btnLimpiarFiltros.addEventListener("click", () => {
        buscar.value = "";
        filtroMesa.value = "";
        filtroCargo.value = "";
        filtroContacto.value = "";
        filtroCapacitacion.value = "";
        filtroAsistencia.value = "";
        filtroCredencial.value = "";
        aplicarFiltros();
    });

}