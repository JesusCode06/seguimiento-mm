export function validarMiembro(miembro, miembros, miembroActual = null) {
	if (!/^\d{8}$/.test(miembro.dni)) {
		return "El DNI debe tener exactamente 8 dígitos.";
	}

	if (miembro.contacto === "Sí" && !/^\d{9}$/.test(miembro.celular)) {
		return "El celular debe tener exactamente 9 dígitos.";
	}

	if (miembro.contacto !== "Sí" && miembro.celular) {
		return "No ingreses celular si el contacto no está confirmado.";
	}

	if (!miembro.apellidos || !miembro.nombres || !miembro.mesa || !miembro.cargo) {
		return "Completa todos los campos obligatorios.";
	}

	if (!/^\d{6}$/.test(miembro.mesa)) {
		return "La mesa debe tener exactamente 6 dígitos.";
	}

	if (miembros.some(registro => registro.dni === miembro.dni && registro !== miembroActual)) {
		return "Ya existe un miembro registrado con ese DNI.";
	}

	if (miembros.some(registro => registro.mesa === miembro.mesa && registro.cargo === miembro.cargo && registro !== miembroActual)) {
		return `Ya existe un ${miembro.cargo} registrado en la mesa ${miembro.mesa}.`;
	}

	const miembrosDeLaMesa = miembros.filter(registro => registro.mesa === miembro.mesa && registro !== miembroActual);

	if (miembrosDeLaMesa.length >= 9) {
		return `La mesa ${miembro.mesa} ya tiene sus 9 miembros registrados.`;
	}

	if (miembro.capacitacion === "Sí" && !miembro.modalidad) {
		return "Selecciona la modalidad de capacitación.";
	}

	if (miembro.capacitacion === "Sí" && miembro.modalidad === "Presencial" && !miembro.lugarCapacitacion) {
		return "Ingresa el lugar de capacitación presencial.";
	}

	if (miembro.credencial === "Sí" && !miembro.modalidadCredencial) {
		return "Selecciona la forma de entrega de la credencial.";
	}

	return "";
}
