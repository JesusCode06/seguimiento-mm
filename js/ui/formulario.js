let miembroEditando = null;
let modoFormulario = "nuevo";

import { guardarMiembros } from "../services/miembrosService.js";
import { mostrarMensaje } from "./mensajes.js";
import { validarMiembro } from "../utils/validaciones.js";

export function inicializarFormulario(miembros, callback) {

// ==========================================
// ELEMENTOS
// ==========================================

const modal = document.getElementById("modalMiembro");
const formulario = document.getElementById("formularioMiembro");
const detalleMiembro = document.getElementById("detalleMiembro");
const btnFotografia = document.getElementById("btnFotografia");
const archivoFotografia = document.getElementById("archivoFotografia");
const detalleAvatarIcono = document.getElementById("detalleAvatarIcono");
const detalleAvatarImagen = document.getElementById("detalleAvatarImagen");
const iconoFotografiaFormulario = document.getElementById("iconoFotografiaFormulario");
const vistaPreviaFotografia = document.getElementById("vistaPreviaFotografia");
let fotografiaFormulario = "";

const btnNuevo = document.getElementById("btnNuevoMiembro");
const btnCerrar = document.getElementById("btnCerrarModal");
const btnCancelar = document.getElementById("btnCancelarModal");
const btnGuardar = document.getElementById("btnGuardarMiembro");
const btnEliminar = document.getElementById("btnEliminarMiembro");

const titulo = document.getElementById("tituloModal");

const campoModalidad = document.getElementById("campoModalidad");
const campoLugar = document.getElementById("campoLugar");
const campoCelular = document.getElementById("campoCelular");
const opcionesContacto = document.querySelectorAll('input[name="contacto"]');
const celularInput = document.getElementById("celular");

const capacitacion = document.getElementById("capacitacion");
const modalidad = document.getElementById("modalidad");
const credencial = document.getElementById("credencial");
const modalidadCredencial = document.getElementById("modalidadCredencial");
const campoModalidadCredencial = document.getElementById("campoModalidadCredencial");

// ==========================================
// ABRIR NUEVO
// ==========================================

function abrirNuevo() {

modoFormulario = "nuevo";
miembroEditando = null;

titulo.textContent = "Nuevo miembro de mesa";

formulario.reset();
fotografiaFormulario = "";
actualizarVistaFotografia();
formulario.style.display = "block";
detalleMiembro.classList.remove("visible");
modal.classList.remove("modal-detalle-activo");

habilitarCampos();

campoModalidad.classList.remove("visible");
campoLugar.classList.remove("visible");
campoModalidadCredencial.classList.remove("visible");
actualizarCamposCondicionales();

btnGuardar.style.display = "inline-flex";
btnEliminar.style.display = "none";
btnCancelar.textContent = "Cancelar";
btnGuardar.type = "submit";
btnGuardar.textContent = "Guardar miembro";

modal.classList.remove("oculto");

}

// ==========================================
// ABRIR VER
// ==========================================

function abrirVer(miembro) {

modoFormulario = "ver";
miembroEditando = miembro;

titulo.textContent = "Detalle de la persona";

renderizarDetalle(miembro);
formulario.style.display = "none";
detalleMiembro.classList.add("visible");
modal.classList.add("modal-detalle-activo");

// La vista de detalle es solo informativa.
btnGuardar.type = "button";
btnGuardar.style.display = "none";
btnEliminar.style.display = "none";
btnCancelar.textContent = "Cerrar";

modal.classList.remove("oculto");

}

function renderizarDetalle(miembro) {
  const nombreCompleto = `${miembro.nombres || ""} ${miembro.apellidos || ""}`.trim();
  const tieneFotografia = Boolean(miembro.foto);
  detalleAvatarIcono.hidden = tieneFotografia;
  detalleAvatarImagen.hidden = !tieneFotografia;
  detalleAvatarImagen.src = miembro.foto || "";

  const valores = {
    detalleNombreCompleto: nombreCompleto,
    detalleDni: `DNI ${miembro.dni || "No registrado"}`,
    detalleCelular: `Cel. ${miembro.celular || "No registrado"}`,
    detalleLugarPertenencia: miembro.lugarPertenencia,
    detalleApellidos: miembro.apellidos,
    detalleNombres: miembro.nombres,
    detalleMesa: miembro.mesa,
    detalleCargo: miembro.cargo,
    detalleModalidad: miembro.modalidad,
    detalleLugarCapacitacion: miembro.lugarCapacitacion,
    detalleAsistenciaDetalle: miembro.asistencia,
    detalleCredencial: miembro.credencial || "Pendiente",
    detalleModalidadCredencial: miembro.modalidadCredencial,
    detalleNota: miembro.nota
  };

  Object.entries(valores).forEach(([id, valor]) => {
    document.getElementById(id).textContent = valor || "No registrado";
  });

  [
    ["detalleContacto", miembro.contacto],
    ["detalleCapacitacion", miembro.capacitacion],
    ["detalleAsistencia", miembro.asistencia]
  ].forEach(([id, valor]) => {
    const elemento = document.getElementById(id);
    const estado = valor || "Pendiente";
    elemento.textContent = estado;
    elemento.className = `detalle-estado-valor estado-${estado.toLowerCase().replace("í", "i")}`;
  });
}

// ==========================================
// CARGAR DATOS
// ==========================================

function cargarDatos(miembro) {

fotografiaFormulario = miembro.foto || "";
actualizarVistaFotografia();

document.getElementById("dni").value =
  miembro.dni || "";

document.getElementById("apellidos").value =
  miembro.apellidos || "";

document.getElementById("nombres").value =
  miembro.nombres || "";

document.getElementById("lugarPertenencia").value =
  miembro.lugarPertenencia || "";

document.getElementById("celular").value =
  miembro.celular || "";

document.getElementById("mesa").value =
  miembro.mesa || "";

document.getElementById("cargo").value =
  miembro.cargo || "";

opcionesContacto.forEach(opcion => {
  opcion.checked = opcion.value === miembro.contacto;
});

document.getElementById("capacitacion").value =
  miembro.capacitacion || "";

document.getElementById("modalidad").value =
  miembro.modalidad || "";

document.getElementById("lugarCapacitacion").value =
  miembro.lugarCapacitacion || "";

document.getElementById("asistencia").value =
  miembro.asistencia || "";

document.getElementById("nota").value =
  miembro.nota || "";

document.getElementById("credencial").value =
  miembro.credencial || "Pendiente";

document.getElementById("modalidadCredencial").value =
  miembro.modalidadCredencial || "";

actualizarCamposCondicionales();

}

function actualizarVistaFotografia() {
  const tieneFotografia = Boolean(fotografiaFormulario);
  iconoFotografiaFormulario.hidden = tieneFotografia;
  vistaPreviaFotografia.hidden = !tieneFotografia;
  vistaPreviaFotografia.src = fotografiaFormulario;
  btnFotografia.textContent = tieneFotografia
    ? "Cambiar fotografía"
    : "Seleccionar fotografía";
}

// ==========================================
// HABILITAR CAMPOS
// ==========================================

function habilitarCampos() {

const campos = formulario.querySelectorAll(
  "input, select, textarea"
);

campos.forEach(campo => {

  campo.disabled = false;
  campo.readOnly = false;

  campo.removeAttribute("disabled");
  campo.removeAttribute("readonly");

});

}

// ==========================================
// DESHABILITAR CAMPOS
// ==========================================

function deshabilitarCampos() {

const campos = formulario.querySelectorAll(
  "input, select, textarea"
);

campos.forEach(campo => {

  campo.disabled = true;
  campo.readOnly = true;

});

}

function abrirEditar(miembro) {
  modoFormulario = "editar";
  miembroEditando = miembro;
  titulo.textContent = "Editar miembro de mesa";
  cargarDatos(miembro);
  formulario.style.display = "block";
  detalleMiembro.classList.remove("visible");
  modal.classList.remove("modal-detalle-activo");
  habilitarCampos();
  btnGuardar.type = "submit";
  btnGuardar.textContent = "Guardar cambios";
  btnGuardar.style.display = "inline-flex";
  btnEliminar.style.display = "inline-flex";
  btnCancelar.textContent = "Cancelar";
  modal.classList.remove("oculto");
}

// ==========================================
// CAMPOS CONDICIONALES
// ==========================================

function actualizarCamposCondicionales() {

if (obtenerContacto() === "Sí") {
  campoCelular.classList.add("visible");
  celularInput.required = true;
} else {
  campoCelular.classList.remove("visible");
  celularInput.required = false;
  celularInput.value = "";
}

if (!capacitacion || !modalidad) {
  return;
}

const lugarInput =
  document.getElementById("lugarCapacitacion");

// ------------------------------------------
// CAPACITACIÓN
// ------------------------------------------

if (capacitacion.value === "Sí") {

  campoModalidad.classList.add("visible");

} else {

  campoModalidad.classList.remove("visible");
  campoLugar.classList.remove("visible");

  modalidad.value = "";

  if (lugarInput) {
    lugarInput.value = "";
  }
}

// ------------------------------------------
// MODALIDAD
// ------------------------------------------

if (modalidad.value === "Presencial") {

  campoLugar.classList.add("visible");

} else {

  campoLugar.classList.remove("visible");

  if (lugarInput) {
    lugarInput.value = "";
  }
}

if (credencial.value === "Sí") {
  campoModalidadCredencial.classList.add("visible");
} else {
  campoModalidadCredencial.classList.remove("visible");
  modalidadCredencial.value = "";
}

}

function obtenerContacto() {
  return document.querySelector('input[name="contacto"]:checked')?.value || "Pendiente";
}

// ==========================================
// EVENTO CAPACITACIÓN
// ==========================================

capacitacion.addEventListener(
"change",
actualizarCamposCondicionales
);

// ==========================================
// EVENTO MODALIDAD
// ==========================================

modalidad.addEventListener(
"change",
actualizarCamposCondicionales
);

credencial.addEventListener(
"change",
actualizarCamposCondicionales
);

opcionesContacto.forEach(opcion => {
  opcion.addEventListener("change", actualizarCamposCondicionales);
});

// ==========================================
// BOTÓN PRINCIPAL
// ==========================================

btnGuardar.addEventListener("click", event => {


// ========================================
// MODO VER
// ========================================

if (modoFormulario === "ver") {

  // IMPORTANTE:
  // Evitamos cualquier envío del formulario.
  event.preventDefault();

  // Cambiamos a modo edición
  modoFormulario = "editar";

  titulo.textContent =
    "Editar miembro de mesa";

  // DESBLOQUEAMOS LOS CAMPOS
  habilitarCampos();

  // Cambiamos el botón
  btnGuardar.type = "submit";
  btnGuardar.textContent =
    "Guardar cambios";

  // Actualizamos campos condicionales
  actualizarCamposCondicionales();

  // TERMINAMOS AQUÍ
  // NO SE GUARDA NADA
  return;
}

});

// ==========================================
// GUARDAR FORMULARIO
// ==========================================

formulario.addEventListener("submit", event => {

event.preventDefault();

// ========================================
// SI ESTAMOS EN VER, NO GUARDAR
// ========================================

if (modoFormulario === "ver") {
  return;
}

// ========================================
// OBTENER DATOS
// ========================================

const dni =
  document.getElementById("dni").value.trim();

const apellidos =
  document.getElementById("apellidos").value.trim();

const nombres =
  document.getElementById("nombres").value.trim();

const lugarPertenencia =
  document.getElementById("lugarPertenencia").value.trim();

const celular =
  document.getElementById("celular").value.trim();

const mesa =
  document.getElementById("mesa").value.trim();

const cargo =
  document.getElementById("cargo").value;

const contacto = obtenerContacto();

const capacitacionValue =
  document.getElementById("capacitacion").value;

const modalidadValue =
  document.getElementById("modalidad").value;

const lugarCapacitacion =
  document
    .getElementById("lugarCapacitacion")
    .value
    .trim();

const asistencia =
  document.getElementById("asistencia").value;

const credencialValue =
  document.getElementById("credencial").value;

const modalidadCredencialValue =
  document.getElementById("modalidadCredencial").value;

const nota =
  document.getElementById("nota").value.trim();

const datosMiembro = {
  dni,
  apellidos,
  nombres,
  lugarPertenencia,
  celular,
  mesa,
  cargo,
  contacto,
  capacitacion: capacitacionValue,
  modalidad: modalidadValue,
  lugarCapacitacion,
  asistencia,
  credencial: credencialValue,
  modalidadCredencial: modalidadCredencialValue
  ,
  nota,
  foto: fotografiaFormulario
};

const errorValidacion = validarMiembro(
  datosMiembro,
  miembros,
  miembroEditando
);

if (errorValidacion) {
  mostrarMensaje(errorValidacion, "error");
  return;
}

// ========================================
// EDITAR
// ========================================

if (
  modoFormulario === "editar" &&
  miembroEditando
) {

  miembroEditando.dni = dni;
  miembroEditando.apellidos = apellidos;
  miembroEditando.nombres = nombres;
  miembroEditando.lugarPertenencia = lugarPertenencia;
  miembroEditando.celular = celular;
  miembroEditando.mesa = mesa;
  miembroEditando.cargo = cargo;
  miembroEditando.contacto = contacto;
  miembroEditando.capacitacion =
    capacitacionValue;
  miembroEditando.modalidad =
    modalidadValue;
  miembroEditando.lugarCapacitacion =
    lugarCapacitacion;
  miembroEditando.asistencia =
    asistencia;
  miembroEditando.credencial =
    credencialValue;
  miembroEditando.modalidadCredencial =
    modalidadCredencialValue;
  miembroEditando.nota = nota;
  miembroEditando.foto = fotografiaFormulario;

  guardarMiembros(miembros);
  document.dispatchEvent(new CustomEvent("miembrosActualizados"));

  cerrarModal();

  callback();
  mostrarMensaje("Los cambios se guardaron correctamente.");

  return;
}

// ========================================
// NUEVO MIEMBRO
// ========================================

if (modoFormulario === "nuevo") {

  const nuevoMiembro = {

    dni,
    apellidos,
    nombres,
    lugarPertenencia,
    celular,
    mesa,
    cargo,
    contacto,
    capacitacion: capacitacionValue,
    modalidad: modalidadValue,
    lugarCapacitacion,
    asistencia,
    credencial: credencialValue,
    modalidadCredencial: modalidadCredencialValue,
    nota,
    foto: fotografiaFormulario

  };

  miembros.push(nuevoMiembro);

  guardarMiembros(miembros);
  document.dispatchEvent(new CustomEvent("miembrosActualizados"));

  cerrarModal();

  callback();
  mostrarMensaje("Miembro registrado correctamente.");
}

});

// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarModal() {

modal.classList.add("oculto");

miembroEditando = null;

modoFormulario = "nuevo";

formulario.reset();
fotografiaFormulario = "";
actualizarVistaFotografia();
formulario.style.display = "block";
detalleMiembro.classList.remove("visible");
modal.classList.remove("modal-detalle-activo");

habilitarCampos();

campoModalidad.classList.remove("visible");
campoLugar.classList.remove("visible");
campoModalidadCredencial.classList.remove("visible");

btnGuardar.type = "submit";
btnGuardar.textContent =
  "Guardar miembro";
btnEliminar.style.display = "none";
btnCancelar.textContent = "Cancelar";

}

// ==========================================
// BOTÓN NUEVO
// ==========================================

btnNuevo.addEventListener(
"click",
abrirNuevo
);

// ==========================================
// CERRAR
// ==========================================

btnCerrar.addEventListener(
"click",
cerrarModal
);

btnCancelar.addEventListener(
"click",
cerrarModal
);

function eliminarMiembro() {
  if (!miembroEditando || !confirm("¿Deseas eliminar este miembro? Esta acción no se puede deshacer.")) {
    return;
  }

  const indice = miembros.indexOf(miembroEditando);

  if (indice !== -1) {
    miembros.splice(indice, 1);
    guardarMiembros(miembros);
    document.dispatchEvent(new CustomEvent("miembrosActualizados"));
    cerrarModal();
    callback();
    mostrarMensaje("Miembro eliminado correctamente.");
  }
}

btnEliminar.addEventListener("click", eliminarMiembro);

modal.addEventListener("click", event => {
  if (event.target === modal) {
    cerrarModal();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.classList.contains("oculto")) {
    cerrarModal();
  }
});

btnFotografia.addEventListener("click", () => archivoFotografia.click());

archivoFotografia.addEventListener("change", async () => {
  const archivo = archivoFotografia.files[0];

  if (!archivo) {
    return;
  }

  try {
    fotografiaFormulario = await crearFotografiaOptimizada(archivo);
    actualizarVistaFotografia();
    mostrarMensaje("Fotografía lista. Guarda el formulario para conservarla.");
  } catch (error) {
    mostrarMensaje(error.message || "No se pudo guardar la fotografía.", "error");
  } finally {
    archivoFotografia.value = "";
  }
});

function crearFotografiaOptimizada(archivo) {
  return new Promise((resolve, reject) => {
    if (!archivo.type.startsWith("image/")) {
      reject(new Error("Selecciona un archivo de imagen."));
      return;
    }

    const lector = new FileReader();
    lector.onerror = () => reject(new Error("No se pudo leer el archivo de imagen."));
    lector.onload = () => {
      const imagen = new Image();
      imagen.onerror = () => reject(new Error("El archivo no es una imagen compatible."));
      imagen.onload = () => {
        const escala = Math.min(1, 512 / Math.max(imagen.width, imagen.height));
        const lienzo = document.createElement("canvas");
        lienzo.width = Math.max(1, Math.round(imagen.width * escala));
        lienzo.height = Math.max(1, Math.round(imagen.height * escala));

        const contexto = lienzo.getContext("2d");
        if (!contexto) {
          reject(new Error("No se pudo procesar la imagen."));
          return;
        }

        contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
        resolve(lienzo.toDataURL("image/jpeg", 0.82));
      };
      imagen.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

// ==========================================
// EVENTO VER MIEMBRO
// ==========================================

document.addEventListener(
"verMiembro",
event => {


  abrirVer(event.detail);

}

);

document.addEventListener("editarMiembro", event => {
  abrirEditar(event.detail);
});

document.addEventListener("eliminarMiembro", event => {
  miembroEditando = event.detail;
  eliminarMiembro();
});

}
