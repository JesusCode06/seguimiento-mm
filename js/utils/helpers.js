export function escaparHtml(valor = "") {
	return String(valor)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

export function claseEstado(estado) {
	return estado.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace("pendiente", "pendiente");
}

const ORDEN_CARGOS = [
	"Presidenta",
	"Secretaria",
	"Tercer miembro",
	"Primer suplente",
	"Segundo suplente",
	"Tercer suplente",
	"Cuarto suplente",
	"Quinto suplente",
	"Sexto suplente"
];

export function ordenarMiembros(miembros) {
	return [...miembros].sort((a, b) => {
		const diferenciaMesa = String(a.mesa).localeCompare(String(b.mesa), "es", {
			numeric: true
		});

		if (diferenciaMesa !== 0) {
			return diferenciaMesa;
		}

		return ORDEN_CARGOS.indexOf(a.cargo) - ORDEN_CARGOS.indexOf(b.cargo);
	});
}
