/**
 * Modelo de Usuario
 * Define la estructura y validaciones para el objeto Usuario
 */

/**
 * @typedef {Object} User
 * @property {string} _id - ID único del usuario (MongoDB)
 * @property {string} nombre - Nombre del usuario
 * @property {string} apellido - Apellido del usuario
 * @property {string} email - Correo electrónico
 * @property {string} telefono - Número de teléfono
 * @property {string} documento_tipo - Tipo de documento (DNI, Pasaporte, NIE, etc.)
 * @property {string} documento_numero - Número de documento
 * @property {string} tipo_usuario - Tipo de usuario (emprendedor, inversor, administrador, contador)
 * @property {boolean} activo - Estado del usuario
 * @property {string} avatar - URL del avatar (opcional)
 * @property {string} fecha_registro - Fecha de registro
 * @property {string} createdAt - Fecha de creación
 * @property {string} updatedAt - Fecha de última actualización
 */

// Tipos de documento disponibles
export const DOCUMENTO_TIPOS = ["DNI", "Pasaporte", "NIE", "RUC", "Cédula"];

// Tipos de usuario disponibles
export const USUARIO_TIPOS = [
  "emprendedor",
  "inversor",
  "administrador",
  "contador",
];

/**
 * Crea un objeto de registro de usuario con valores por defecto
 * @param {Partial<RegisterUserData>} data - Datos parciales del usuario
 * @returns {RegisterUserData} Objeto de registro completo
 */
export const createRegisterData = (data = {}) => ({
  nombre: data.nombre || "",
  apellido: data.apellido || "",
  email: data.email || "",
  password: data.password || "",
  telefono: data.telefono || "",
  documento_tipo: data.documento_tipo,
  documento_numero: data.documento_numero || "",
});

/**
 * Crea un objeto de actualización de usuario (solo campos editables)
 * @param {Partial<UpdateUserData>} data - Datos parciales del usuario
 * @returns {UpdateUserData} Objeto de actualización
 */
export const createUpdateData = (data = {}) => {
  const updateData = {};

  if (data.nombre) updateData.nombre = data.nombre;
  if (data.apellido) updateData.apellido = data.apellido;
  if (data.telefono) updateData.telefono = data.telefono;
  if (data.avatar) updateData.avatar = data.avatar;

  return updateData;
};

/**
 * Validaciones para el formulario de registro
 */
export const registerValidations = {
  nombre: [
    (v) => !!v || "El nombre es requerido",
    (v) => (v && v.length >= 2) || "El nombre debe tener al menos 2 caracteres",
  ],
  apellido: [
    (v) => !!v || "El apellido es requerido",
    (v) =>
      (v && v.length >= 2) || "El apellido debe tener al menos 2 caracteres",
  ],
  email: [
    (v) => !!v || "El email es requerido",
    (v) => /.+@.+\..+/.test(v) || "Email inválido",
  ],
  password: [
    (v) => !!v || "La contraseña es requerida",
    (v) =>
      (v && v.length >= 8) || "La contraseña debe tener al menos 8 caracteres",
    (v) =>
      /[A-Z]/.test(v) || "La contraseña debe contener al menos una mayúscula",
    (v) =>
      /[a-z]/.test(v) || "La contraseña debe contener al menos una minúscula",
    (v) => /[0-9]/.test(v) || "La contraseña debe contener al menos un número",
    (v) =>
      /[!@#$%^&*]/.test(v) ||
      "La contraseña debe contener al menos un carácter especial (!@#$%^&*)",
  ],
  telefono: [
    (v) =>
      !v ||
      /^\+?[0-9]{9,15}$/.test(v) ||
      "Teléfono inválido (ej: +34600123456)",
  ],
  documento_tipo: [(v) => !!v || "El tipo de documento es requerido"],
  documento_numero: [
    (v) => !!v || "El número de documento es requerido",
    (v) =>
      (v && v.length >= 5) ||
      "El número de documento debe tener al menos 5 caracteres",
  ],
};

/**
 * Obtiene las iniciales del usuario
 * @param {User} user - Objeto usuario
 * @returns {string} Iniciales en mayúsculas
 */
export const getUserInitials = (user) => {
  const n = user?.nombre?.[0] || "";
  const a = user?.apellido?.[0] || "";
  return (n + a).toUpperCase() || "?";
};

/**
 * Obtiene el nombre completo del usuario
 * @param {User} user - Objeto usuario
 * @returns {string} Nombre completo
 */
export const getUserFullName = (user) => {
  if (!user) return "";
  return `${user.nombre || ""} ${user.apellido || ""}`.trim();
};

export default {
  DOCUMENTO_TIPOS,
  USUARIO_TIPOS,
  createRegisterData,
  createUpdateData,
  registerValidations,
  getUserInitials,
  getUserFullName,
};
