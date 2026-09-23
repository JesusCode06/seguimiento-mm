let temporizador;

export function mostrarMensaje(texto, tipo = "exito") {
	const mensaje = document.getElementById("mensajeAplicacion");

	if (!mensaje) {
		return;
	}

	clearTimeout(temporizador);
	mensaje.textContent = texto;
	mensaje.className = `mensaje-aplicacion visible ${tipo}`;

	temporizador = setTimeout(() => {
		mensaje.className = "mensaje-aplicacion";
	}, 4500);
}
