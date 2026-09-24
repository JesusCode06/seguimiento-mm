const CLAVE_ALMACENAMIENTO = "charat-miembros-mesa-2026";

export function cargarMiembros(miembrosIniciales) {
	const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);

	if (!datosGuardados) {
		const copiaInicial = normalizarMiembros(miembrosIniciales);
		guardarMiembros(copiaInicial);
		return copiaInicial;
	}

	try {
		const miembrosGuardados = JSON.parse(datosGuardados);
		return Array.isArray(miembrosGuardados)
			? normalizarMiembros(miembrosGuardados)
			: normalizarMiembros(miembrosIniciales);
	} catch {
		return normalizarMiembros(miembrosIniciales);
	}
}

function normalizarMiembros(registros) {
	return registros.map(miembro => ({
		...miembro,
		celular: miembro.contacto === "Sí" ? (miembro.celular || "") : "",
		lugarPertenencia: miembro.lugarPertenencia || "",
		cargo: miembro.cargo === "Secretario"
			? "Secretaria"
			: miembro.cargo === "Presidente"
				? "Presidenta"
				: miembro.cargo,
		nota: miembro.nota || "",
		credencial: miembro.credencial || "Pendiente",
		modalidadCredencial: miembro.modalidadCredencial || ""
	}));
}

export function guardarMiembros(miembros) {
	localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(miembros));
}

export function eliminarTodosLosMiembros() {
	guardarMiembros([]);
}

export function exportarMiembros(miembros) {
	const contenido = JSON.stringify(miembros, null, 2);
	const archivo = new Blob([contenido], { type: "application/json" });
	const url = URL.createObjectURL(archivo);
	const enlace = document.createElement("a");

	enlace.href = url;
	enlace.download = "respaldo-miembros-charat-2026.json";
	enlace.click();
	URL.revokeObjectURL(url);
}

function escaparXml(valor = "") {
	return String(valor)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function celdaExcel(valor, tipo = "String", estilo = "") {
	const atributoEstilo = estilo ? ` ss:StyleID="${estilo}"` : "";
	return `<Cell${atributoEstilo}><Data ss:Type="${tipo}">${escaparXml(valor)}</Data></Cell>`;
}

function filaExcel(valores, estilo = "") {
	return `<Row>${valores.map(valor => celdaExcel(valor, "String", estilo)).join("")}</Row>`;
}

function porcentaje(cantidad, total) {
	return total ? `${Math.round((cantidad / total) * 100)}%` : "0%";
}

function observacionesPendientes(miembro) {
	const pendientes = [];

	if (miembro.contacto === "Pendiente") pendientes.push("contactar");
	if (miembro.capacitacion === "Pendiente") pendientes.push("capacitar");
	if (miembro.asistencia === "Pendiente") pendientes.push("registrar asistencia");
	if ((miembro.credencial || "Pendiente") === "Pendiente") pendientes.push("registrar credencial");

	return pendientes.length ? `Pendiente: ${pendientes.join(", ")}` : "Seguimiento completo";
}

export function exportarReporteExcel(miembros) {
	const total = miembros.length;
	const contactados = miembros.filter(miembro => miembro.contacto === "Sí").length;
	const capacitados = miembros.filter(miembro => miembro.capacitacion === "Sí").length;
	const asistencias = miembros.filter(miembro => miembro.asistencia === "Sí").length;
	const credenciales = miembros.filter(miembro => miembro.credencial === "Sí").length;
	const mesas = new Set(miembros.map(miembro => miembro.mesa)).size;
	const fecha = new Intl.DateTimeFormat("es-PE", {
		dateStyle: "long",
		timeStyle: "short"
	}).format(new Date());
	const pendientes = miembros.filter(miembro => observacionesPendientes(miembro) !== "Seguimiento completo");
	const mesasReporte = [...new Set(miembros.map(miembro => miembro.mesa))].sort();

	const resumen = [
		`<Row><Cell ss:MergeAcross="3" ss:StyleID="Titulo"><Data ss:Type="String">REPORTE GENERAL DE SEGUIMIENTO</Data></Cell></Row>`,
		`<Row><Cell ss:MergeAcross="3" ss:StyleID="Subtitulo"><Data ss:Type="String">Miembros de Mesa - Charat, Otuzco - Elecciones 2026</Data></Cell></Row>`,
		filaExcel(["Fecha de generación", fecha]),
		filaExcel(["Indicador", "Resultado", "Porcentaje", "Interpretación"], "Encabezado"),
		filaExcel(["Mesas registradas", mesas, "100%", "Mesas con al menos un miembro registrado"]),
		filaExcel(["Miembros registrados", total, "100%", "Total de personas en el sistema"]),
		filaExcel(["Miembros contactados", contactados, porcentaje(contactados, total), "Personas con contacto confirmado"]),
		filaExcel(["Miembros capacitados", capacitados, porcentaje(capacitados, total), "Personas con capacitación registrada como Sí"]),
		filaExcel(["Asistencia 04 de octubre", asistencias, porcentaje(asistencias, total), "Personas con asistencia confirmada"]),
		filaExcel(["Credenciales entregadas", credenciales, porcentaje(credenciales, total), "Personas con entrega de credencial confirmada"]),
		filaExcel(["Pendientes de seguimiento", pendientes.length, porcentaje(pendientes.length, total), "Registros con al menos una actividad pendiente"]),
		`<Row><Cell ss:MergeAcross="3" ss:StyleID="Nota"><Data ss:Type="String">Este reporte se genera desde el seguimiento guardado en el navegador. Revise la hoja Pendientes para organizar las próximas acciones.</Data></Cell></Row>`
	].join("");

	const encabezados = ["DNI", "Apellidos", "Nombres", "Celular", "Lugar de pertenencia", "Mesa", "Cargo", "Contacto", "Capacitación", "Modalidad capacitación", "Lugar capacitación", "Asistencia 04 de octubre", "Entregó credencial", "Forma de entrega", "Nota / observación", "Acciones pendientes"];
	const detalle = [filaExcel(encabezados, "Encabezado")].concat(miembros.map(miembro => filaExcel([
		miembro.dni,
		miembro.apellidos,
		miembro.nombres,
		miembro.celular,
		miembro.lugarPertenencia || "-",
		miembro.mesa,
		miembro.cargo,
		miembro.contacto,
		miembro.capacitacion,
		miembro.modalidad || "-",
		miembro.lugarCapacitacion || "-",
		miembro.asistencia,
		miembro.credencial || "Pendiente",
		miembro.modalidadCredencial || "-",
		miembro.nota || "-",
		observacionesPendientes(miembro)
	]))).join("");

	const pendientesHoja = [
		`<Row><Cell ss:MergeAcross="4" ss:StyleID="Titulo"><Data ss:Type="String">PENDIENTES DE SEGUIMIENTO</Data></Cell></Row>`,
		`<Row><Cell ss:MergeAcross="4" ss:StyleID="Nota"><Data ss:Type="String">Use esta hoja como lista de trabajo para priorizar llamadas, capacitaciones, asistencia y entrega de credenciales.</Data></Cell></Row>`,
		filaExcel(["DNI", "Apellidos y nombres", "Mesa", "Cargo", "Acciones pendientes"], "Encabezado"),
		pendientes.map(miembro => filaExcel([
			miembro.dni,
			`${miembro.apellidos}, ${miembro.nombres}`,
			miembro.mesa,
			miembro.cargo,
			observacionesPendientes(miembro)
		])).join("")
	].join("");

	const avancePorMesa = [
		`<Row><Cell ss:MergeAcross="6" ss:StyleID="Titulo"><Data ss:Type="String">AVANCE POR MESA</Data></Cell></Row>`,
		filaExcel(["Mesa", "Registrados", "Contacto", "Capacitación", "Credencial", "Asistencia 04 de octubre", "Estado"], "Encabezado"),
		mesasReporte.map(mesa => {
			const miembrosMesa = miembros.filter(miembro => miembro.mesa === mesa);
			const porcentajeMesa = estado => porcentaje(
				miembrosMesa.filter(miembro => miembro[estado] === "Sí").length,
				9
			);
			const completa = miembrosMesa.length === 9 && ["contacto", "capacitacion", "credencial", "asistencia"].every(
				estado => miembrosMesa.every(miembro => miembro[estado] === "Sí")
			);

			return filaExcel([
				mesa,
				`${miembrosMesa.length} / 9`,
				porcentajeMesa("contacto"),
				porcentajeMesa("capacitacion"),
				porcentajeMesa("credencial"),
				porcentajeMesa("asistencia"),
				completa ? "Completa" : "En seguimiento"
			]);
		}).join("")
	].join("");

	const contenido = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
<Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="Calibri" ss:Size="11"/></Style>
<Style ss:ID="Titulo"><Font ss:Bold="1" ss:Size="16" ss:Color="#FFFFFF"/><Interior ss:Color="#1D4ED8" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/></Style>
<Style ss:ID="Subtitulo"><Font ss:Bold="1" ss:Color="#1E3A8A"/><Interior ss:Color="#DBEAFE" ss:Pattern="Solid"/></Style>
<Style ss:ID="Encabezado"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#1E3A8A" ss:Pattern="Solid"/></Style>
<Style ss:ID="Nota"><Font ss:Italic="1" ss:Color="#475569"/><Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/></Style>
</Styles>
<Worksheet ss:Name="Resumen"><Table>${resumen}</Table></Worksheet>
<Worksheet ss:Name="Detalle de miembros"><Table>${detalle}</Table></Worksheet>
<Worksheet ss:Name="Pendientes"><Table>${pendientesHoja}</Table></Worksheet>
<Worksheet ss:Name="Avance por mesa"><Table>${avancePorMesa}</Table></Worksheet>
</Workbook>`;

	const archivo = new Blob([contenido], { type: "application/vnd.ms-excel" });
	const url = URL.createObjectURL(archivo);
	const enlace = document.createElement("a");

	enlace.href = url;
	enlace.download = "reporte-general-seguimiento-charat-2026.xls";
	enlace.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function leerRespaldo(archivo) {
	const contenido = await archivo.text();
	const datos = JSON.parse(contenido);

	if (!Array.isArray(datos)) {
		throw new Error("El respaldo no contiene una lista de miembros.");
	}

	return datos;
}

export function restaurarMiembros(miembrosIniciales) {
	const copiaInicial = miembrosIniciales.map(miembro => ({ ...miembro }));
	guardarMiembros(copiaInicial);
	return copiaInicial;
}
