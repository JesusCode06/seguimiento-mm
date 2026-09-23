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

const btnNuevo = document.getElementById("btnNuevoMiembro");
const btnCerrar = document.getElementById("btnCerrarModal");
const btnCancelar = document.getElementById("btnCancelarModal");
const btnGuardar = document.getElementById("btnGuardarMiembro");
const btnEliminar = document.getElementById("btnEliminarMiembro");

const titulo = document.getElementById("tituloModal");

const campoModalidad = document.getElementById("campoModalidad");
const campoLugar = document.getElementById("campoLugar");

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

habilitarCampos();

campoModalidad.classList.remove("visible");
campoLugar.classList.remove("visible");
campoModalidadCredencial.classList.remove("visible");

btnGuardar.style.display = "inline-flex";
btnEliminar.style.display = "none";
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

titulo.textContent = "Ver miembro de mesa";

cargarDatos(miembro);

// Bloqueamos los campos
deshabilitarCampos();

// El botón NO debe enviar el formulario
btnGuardar.type = "button";
btnGuardar.textContent = "Editar";
btnGuardar.style.display = "inline-flex";
btnEliminar.style.display = "inline-flex";

modal.classList.remove("oculto");

}

// ==========================================
// CARGAR DATOS
// ==========================================

function cargarDatos(miembro) {

document.getElementById("dni").value =
  miembro.dni || "";

document.getElementById("apellidos").value =
  miembro.apellidos || "";

document.getElementById("nombres").value =
  miembro.nombres || "";

document.getElementById("celular").value =
  miembro.celular || "";

document.getElementById("mesa").value =
  miembro.mesa || "";

document.getElementById("cargo").value =
  miembro.cargo || "";

document.getElementById("contacto").value =
  miembro.contacto || "";

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

// ==========================================
// CAMPOS CONDICIONALES
// ==========================================

function actualizarCamposCondicionales() {

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

const celular =
  document.getElementById("celular").value.trim();

const mesa =
  document.getElementById("mesa").value.trim();

const cargo =
  document.getElementById("cargo").value;

const contacto =
  document.getElementById("contacto").value;

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
  nota
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
    nota

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

habilitarCampos();

campoModalidad.classList.remove("visible");
campoLugar.classList.remove("visible");
campoModalidadCredencial.classList.remove("visible");

btnGuardar.type = "submit";
btnGuardar.textContent =
  "Guardar miembro";
btnEliminar.style.display = "none";

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

btnEliminar.addEventListener("click", () => {
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
});

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

// ==========================================
// EVENTO VER MIEMBRO
// ==========================================

document.addEventListener(
"verMiembro",
event => {


  abrirVer(event.detail);

}

);

}
