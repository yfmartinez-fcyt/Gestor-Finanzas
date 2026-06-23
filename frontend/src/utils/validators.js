const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function esCorreoValido(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

export function esNombreValido(value, campo = 'Nombre') {
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
}

export function esContrasenaValida(password) {
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
}

export function validateRegisterForm({ nombre, apellido, email, password }) {
  if (!nombre?.trim() || !apellido?.trim() || !email?.trim() || !password) {
    return 'Todos los campos son obligatorios';
  }

  const nombreError = esNombreValido(nombre, 'Nombre');
  if (nombreError) return nombreError;

  const apellidoError = esNombreValido(apellido, 'Apellido');
  if (apellidoError) return apellidoError;

  if (!esCorreoValido(email)) {
    return 'Debe ingresarse una dirección de correo electrónico válida';
  }

  const passwordError = esContrasenaValida(password);
  if (passwordError) return passwordError;

  return null;
}
