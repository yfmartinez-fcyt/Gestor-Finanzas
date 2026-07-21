const TIPOS_TRANSACCION = ['ingreso', 'gasto'];
const ROLES_USUARIO = ['usuario', 'admin'];

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const esCorreoValido = (email) =>
  typeof email === 'string' && EMAIL_REGEX.test(email.trim());

const esNombreValido = (value, campo = 'Nombre') => {
  if (typeof value !== 'string') {
    return `El ${campo.toLowerCase()} no es válido`;
  }

  const trimmed = value.trim();

  if (trimmed.length < 2) {
    return `El ${campo.toLowerCase()} debe tener al menos 2 caracteres`;
  }

  if (!NOMBRE_REGEX.test(trimmed)) {
    return `El ${campo.toLowerCase()} solo puede contener letras (sin números ni caracteres especiales)`;
  }

  return null;
};

const esContrasenaValida = (password) => {
  if (typeof password !== 'string' || !password) {
    return 'La contraseña es obligatoria';
  }

  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }

  if (!PASSWORD_REGEX.test(password)) {
    return 'La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales';
  }

  return null;
};

const parseImporte = (importe) => {
  const num = Number(importe);
  if (isNaN(num) || num <= 0) return null;
  return num;
};

const isValidDate = (value) => !isNaN(Date.parse(value));

const isValidId = (id) => {
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
};

const validateTipoTransaccion = (tipo) => {
  if (!TIPOS_TRANSACCION.includes(tipo)) {
    return 'El tipo debe ser "ingreso" o "gasto"';
  }
  return null;
};

/**
 * Valida body para crear transacción (POST).
 * @returns {{ valid: boolean, message?: string, data?: object }}
 */
const validateCreateTransaccion = (body) => {
  const { tipo, importe, descripcion, categoria_id, fecha } = body;

  if (!tipo || importe === undefined || importe === null || importe === '') {
    return { valid: false, message: 'Tipo e importe son obligatorios' };
  }

  const tipoError = validateTipoTransaccion(tipo);
  if (tipoError) {
    return { valid: false, message: tipoError };
  }

  const importeParsed = parseImporte(importe);
  if (importeParsed === null) {
    return { valid: false, message: 'El importe debe ser un número mayor a 0' };
  }

  if (fecha !== undefined && fecha !== null && fecha !== '' && !isValidDate(fecha)) {
    return { valid: false, message: 'La fecha no es válida' };
  }

  if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
    return { valid: false, message: 'La descripción debe ser texto' };
  }

  if (!isValidId(categoria_id)) {
    return {
      valid: false,
      message: 'Debe seleccionar una categoría válida',
    };
  }

  return {
    valid: true,
    data: {
      tipo,
      importe: importeParsed,
      descripcion: descripcion?.trim() || null,
      categoria_id: Number(categoria_id),
      fecha: fecha || new Date(),
    },
  };
};

/**
 * Valida body para actualizar transacción (PUT).
 * @returns {{ valid: boolean, message?: string }}
 */
const validateUpdateTransaccion = (body) => {
  const { tipo, importe, descripcion, categoria_id, fecha } = body;
  const fields = [tipo, importe, descripcion, categoria_id, fecha];
  const hasField = fields.some((v) => v !== undefined);

  if (!hasField) {
    return { valid: false, message: 'Debe enviar al menos un campo para actualizar' };
  }

  if (tipo !== undefined) {
    const tipoError = validateTipoTransaccion(tipo);
    if (tipoError) {
      return { valid: false, message: tipoError };
    }
  }

  if (importe !== undefined && parseImporte(importe) === null) {
    return { valid: false, message: 'El importe debe ser un número mayor a 0' };
  }

  if (fecha !== undefined && fecha !== null && fecha !== '' && !isValidDate(fecha)) {
    return { valid: false, message: 'La fecha no es válida' };
  }

  if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
    return { valid: false, message: 'La descripción debe ser texto' };
  }

  if (categoria_id !== undefined && !isValidId(categoria_id)) {
    return {
      valid: false,
      message: 'Debe seleccionar una categoría válida'
    };
  }

  return { valid: true };
};

/**
 * Valida body para registrar usuario (POST /api/auth/register).
 * @returns {{ valid: boolean, message?: string, data?: object }}
 */
const validateRegister = (body) => {
  const { nombre, apellido, email, password, avatar } = body;

  if (!nombre || !apellido || !email || !password) {
    return { valid: false, message: 'Todos los campos son obligatorios' };
  }

  const nombreError = esNombreValido(nombre, 'Nombre');
  if (nombreError) {
    return { valid: false, message: nombreError };
  }

  const apellidoError = esNombreValido(apellido, 'Apellido');
  if (apellidoError) {
    return { valid: false, message: apellidoError };
  }

  if (!esCorreoValido(email)) {
    return { valid: false, message: 'Debe ingresarse una dirección de correo electrónico válida' };
  }

  const passwordError = esContrasenaValida(password);
  if (passwordError) {
    return { valid: false, message: passwordError };
  }

  if (avatar !== undefined && avatar !== null && avatar !== '' && typeof avatar !== 'string') {
    return { valid: false, message: 'El avatar debe ser una URL en formato texto' };
  }

  return {
    valid: true,
    data: {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim().toLowerCase(),
      password,
      avatar: avatar?.trim() || null,
    },
  };
};

/**
 * Valida body para actualizar usuario (PUT).
 * @returns {{ valid: boolean, message?: string, data?: object }}
 */
const validateUpdateUser = (body, { allowRol = false } = {}) => {
  const { nombre, apellido, email, rol, avatar } = body;
  const fields = [nombre, apellido, email, rol, avatar];
  const hasField = fields.some((v) => v !== undefined);

  if (!hasField) {
    return { valid: false, message: 'Debe enviar al menos un campo para actualizar' };
  }

  if (nombre !== undefined) {
    if (!isNonEmptyString(nombre)) {
      return { valid: false, message: 'El nombre no puede estar vacío' };
    }
    const nombreError = esNombreValido(nombre, 'Nombre');
    if (nombreError) {
      return { valid: false, message: nombreError };
    }
  }

  if (apellido !== undefined) {
    if (!isNonEmptyString(apellido)) {
      return { valid: false, message: 'El apellido no puede estar vacío' };
    }
    const apellidoError = esNombreValido(apellido, 'Apellido');
    if (apellidoError) {
      return { valid: false, message: apellidoError };
    }
  }

  if (email !== undefined) {
    if (!isNonEmptyString(email)) {
      return { valid: false, message: 'El email no puede estar vacío' };
    }
    if (!esCorreoValido(email)) {
      return { valid: false, message: 'Debe ingresarse una dirección de correo electrónico válida' };
    }
  }

  if (allowRol && rol !== undefined && !ROLES_USUARIO.includes(rol)) {
    return { valid: false, message: 'El rol debe ser "usuario" o "admin"' };
  }

  if (avatar !== undefined && avatar !== null && avatar !== '' && typeof avatar !== 'string') {
    return { valid: false, message: 'El avatar debe ser una URL en formato texto' };
  }

  return {
    valid: true,
    data: {
      nombre: nombre !== undefined ? nombre.trim() : undefined,
      apellido: apellido !== undefined ? apellido.trim() : undefined,
      email: email !== undefined ? email.trim().toLowerCase() : undefined,
      rol,
      avatar: avatar !== undefined ? (avatar?.trim() || null) : undefined,
    },
  };
};

/**
 * Valida filtro tipo en query string (GET).
 */
const validateTipoQuery = (tipo) => {
  if (!tipo) return null;
  return validateTipoTransaccion(tipo);
};

const validateCreateMeta = (body) => {
  const {
    nombre,
    descripcion,
    monto_objetivo,
    fecha_limite,
  } = body;

  if (!nombre?.trim()) {
    return {
      valid: false,
      message: "El nombre es obligatorio",
    };
  }

  if (isNaN(Number(monto_objetivo)) || Number(monto_objetivo) <= 0) {
    return {
      valid: false,
      message: "El monto objetivo debe ser mayor a cero",
    };
  }

  return {
    valid: true,
    data: {
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
      monto_objetivo: Number(monto_objetivo),
      fecha_limite: fecha_limite?.trim() || null
    },
  };
};

const validateUpdateMeta = (body) => {
  const {
    nombre,
    descripcion,
    monto_objetivo,
    fecha_limite,
    estado,
  } = body;

  const fields = [
    nombre,
    descripcion,
    monto_objetivo,
    fecha_limite,
    estado,
  ];

  const hasField = fields.some((v) => v !== undefined);

  if (!hasField) {
    return {
      valid: false,
      message: "Debe enviar al menos un campo para actualizar",
    };
  }

  if (nombre !== undefined) {
    if (typeof nombre !== "string" || !nombre.trim()) {
      return {
        valid: false,
        message: "El nombre es obligatorio",
      };
    }
  }

  if (
    monto_objetivo !== undefined &&
    (isNaN(Number(monto_objetivo)) || Number(monto_objetivo) <= 0)
  ) {
    return {
      valid: false,
      message: "El monto objetivo debe ser mayor a cero",
    };
  }

  if (
    fecha_limite !== undefined &&
    fecha_limite !== null &&
    fecha_limite !== "" &&
    !isValidDate(fecha_limite)
  ) {
    return {
      valid: false,
      message: "La fecha límite no es válida",
    };
  }

  if (
    estado !== undefined &&
    !["activa", "completada", "cancelada"].includes(estado)
  ) {
    return {
      valid: false,
      message: 'El estado debe ser "activa", "completada" o "cancelada"',
    };
  }

  return { valid: true };
};

const validateCreateMovimientoMeta = (body) => {
  const {
    meta_id,
    tipo,
    monto,
    descripcion,
  } = body;

  if (!isValidId(meta_id)) {
    return {
      valid: false,
      message: "Debe seleccionar una meta válida",
    };
  }

  if (!["aporte", "retiro"].includes(tipo)) {
    return {
      valid: false,
      message: 'El tipo debe ser "aporte" o "retiro"',
    };
  }

  if (parseImporte(monto) === null) {
    return {
      valid: false,
      message: "El monto debe ser mayor a cero",
    };
  }

  if (
    descripcion !== undefined &&
    descripcion !== null &&
    typeof descripcion !== "string"
  ) {
    return {
      valid: false,
      message: "La descripción debe ser texto",
    };
  }

  return {
    valid: true,
    data: {
      meta_id: Number(meta_id),
      tipo,
      monto: parseImporte(monto),
      descripcion: descripcion?.trim() || null,
    },
  };
};

const validateUpdateMovimientoMeta = (body) => {
  const {
    tipo,
    monto,
    descripcion,
  } = body;

  const fields = [tipo, monto, descripcion];

  const hasField = fields.some(v => v !== undefined);

  if (!hasField) {
    return {
      valid: false,
      message: "Debe enviar al menos un campo para actualizar",
    };
  }

  if (
    tipo !== undefined &&
    !["aporte", "retiro"].includes(tipo)
  ) {
    return {
      valid: false,
      message: 'El tipo debe ser "aporte" o "retiro"',
    };
  }

  if (
    monto !== undefined &&
    parseImporte(monto) === null
  ) {
    return {
      valid: false,
      message: "El monto debe ser mayor a cero",
    };
  }

  if (
    descripcion !== undefined &&
    descripcion !== null &&
    typeof descripcion !== "string"
  ) {
    return {
      valid: false,
      message: "La descripción debe ser texto",
    };
  }

  return {
    valid: true,
  };
};



module.exports = {
  isValidId,
  parseImporte,
  esCorreoValido,
  esNombreValido,
  esContrasenaValida,
  validateRegister,
  validateCreateTransaccion,
  validateUpdateTransaccion,
  validateUpdateUser,
  validateTipoQuery,
  validateCreateMeta,
  validateUpdateMeta,
  validateCreateMovimientoMeta,
  validateUpdateMovimientoMeta,
};
