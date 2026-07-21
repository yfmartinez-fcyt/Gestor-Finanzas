# 💰 Gestor Finanzas

## Autores

- María Duarte.
- Yanina Martínez.
- Marcelo Vera.

UNCA - FCyT - Carrera de Ingeniería Informática - Programación Web 1 - 2026

Aplicación web de gestión de finanzas personales con autenticación JWT, panel de estadísticas y CRUD completo de transacciones.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)

---

## Tabla de contenidos

1. [Descripción general](#descripción-general)
2. [Tecnologías](#tecnologías)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos previos](#requisitos-previos)
5. [Instalación](#instalación)
6. [Configuración de la base de datos](#configuración-de-la-base-de-datos)
7. [Variables de entorno](#variables-de-entorno)
8. [Cómo iniciar el proyecto](#cómo-iniciar-el-proyecto)
9. [Iniciar en Visual Studio Code](#iniciar-en-visual-studio-code)
10. [Rutas del frontend](#rutas-del-frontend)
11. [API REST](#api-rest)
12. [Autenticación y roles](#autenticación-y-roles)
13. [Solución de problemas](#solución-de-problemas)

---

## Descripción general

**Gestor Finanzas** es un monorepo con backend y frontend independientes:

| Parte        | Descripción                    | Puerto |
|--------------|--------------------------------|--------|
| `backend/`   | API REST con Node.js + Express | `4000` |
| `frontend/`  | Interfaz web con React + Vite  | `5173` |

### Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Dashboard con balance, ingresos y gastos
- Crear, editar, filtrar y eliminar transacciones
- Gestión de categorías personalizadas por usuario
- Metas de ahorro (crear, editar, eliminar y seguimiento de progreso)
- Edición de perfil de usuario
- Tema claro / oscuro
- Roles `usuario` y `admin` con panel de administración (gestión de usuarios y sesiones)

---

## Tecnologías

### Backend
| Tecnología | Uso |
|------------|-----|
| Node.js + Express 5 | Servidor y rutas |
| PostgreSQL (driver `pg`) | Base de datos |
| JWT (access + refresh) | Autenticación con rotación de tokens |
| bcryptjs | Hash de contraseñas |
| CORS + cookies HTTP-only | Seguridad |

### Frontend
| Tecnología | Uso |
|------------|-----|
| React 19 | UI |
| React Router 7 | Navegación |
| Vite 6 | Bundler y servidor de desarrollo |

---

## Estructura del proyecto

```
Gestor-Finanzas/
├── .vscode/                    # Tareas y depuración de VS Code
├── docs/                       # Guías de instalación adicionales
├── backend/
│   ├── database/
│   │   └── schema.sql          # Crea la BD y el esquema SQL
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Conexión a PostgreSQL
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── categoriasController.js
│   │   │   ├── metasController.js
│   │   │   ├── transaccionController.js
│   │   │   └── usuarioController.js
│   │   ├── middleware/         # Auth, roles, errores
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── categoriasRoutes.js
│   │   │   ├── metasRoutes.js
│   │   │   ├── transaccionRoutes.js
│   │   │   └── usuarioRoutes.js
│   │   ├── utils/              # Validadores de datos
│   │   ├── app.js              # Configuración Express
│   │   └── server.js           # Punto de entrada
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/         # Layout, formularios, tablas, rutas protegidas
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Categorias.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Metas.jsx
│   │   │   ├── Perfil.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Transaccion.jsx
│   │   ├── services/
│   │   │   └── api.js          # Cliente HTTP hacia el backend
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## Requisitos previos

Instala las siguientes herramientas antes de comenzar:

| Herramienta | Versión mínima | Enlace |
|-------------|---------------|--------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | 14+ | [postgresql.org](https://www.postgresql.org/download/) |
| Visual Studio Code | Cualquiera | [code.visualstudio.com](https://code.visualstudio.com/) |

> **Nota:** Este proyecto usa Node.js y React. **Visual Studio Code** es el editor recomendado. Visual Studio completo también funciona si tienes instalada la carga de trabajo *Node.js development*.

**Extensiones útiles para VS Code:**
- ES7+ React/Redux/React-Native snippets
- PostgreSQL *(opcional, para consultas)*
- Thunder Client o REST Client *(opcional, para probar la API)*

---

## Instalación

Abre una terminal en la raíz del proyecto (`Gestor-Finanzas`).

### 1. Backend

```powershell
cd backend
npm install
```

### 2. Frontend

```powershell
cd ..\frontend
npm install
```

---

## Configuración de la base de datos

### 1. Ejecutar el esquema

Desde la raíz del proyecto (`Gestor-Finanzas`), conectado a la BD por defecto `postgres`:

```powershell
psql -U postgres -f backend/database/schema.sql
```

El script `schema.sql`:
1. Crea la base de datos `gestor_finanzas` si no existe
2. Se conecta a ella
3. Crea las tablas e índices

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Datos de usuario y rol |
| `refresh_tokens` | Sesiones activas |
| `categorias` | Categorías personalizadas por usuario |
| `transacciones` | Ingresos y gastos (referencia a `categorias`) |
| `metas` | Metas de ahorro del usuario |

**Si usas pgAdmin** (no soporta `\gexec` / `\c` de psql):

1. Ejecuta solo: `CREATE DATABASE gestor_finanzas;`
2. Conéctate a esa base
3. Ejecuta el resto del archivo a partir de `CREATE TABLE IF NOT EXISTS usuarios`

> **Nota:** Si ya tenías una versión anterior de la BD (sin `categorias` / `metas`, o con columna `categoria` en texto), elimínala y vuelve a ejecutar el script, o adapta el esquema manualmente.

### 2. Crear un administrador *(opcional)*

Tras registrarte desde la app, promueve tu cuenta en la base de datos:

```sql
UPDATE usuarios SET rol = 'admin' WHERE email = 'tu@email.com';
```

> Cierra sesión y vuelve a entrar para que el JWT incluya el rol `admin`.

---

## Variables de entorno

### Backend — `backend/.env`

```powershell
cd backend
copy .env.example .env
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor API | `4000` |
| `HOST` | Host de escucha | `0.0.0.0` |
| `NODE_ENV` | Entorno | `development` |
| `FRONTEND_URL` | Origen permitido por CORS | `http://localhost:5173` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `gestor_finanzas` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `tu_password` |
| `JWT_ACCESS_SECRET` | Secreto del access token | cadena larga y aleatoria |
| `JWT_REFRESH_SECRET` | Secreto del refresh token | otra cadena aleatoria |
| `JWT_ACCESS_EXPIRES` | Duración del access token | `5m` |
| `JWT_REFRESH_EXPIRES` | Duración del refresh token | `1h` |

### Frontend — `frontend/.env`

```powershell
cd frontend
copy .env.example .env
```

> En desarrollo, deja `VITE_API_URL` **vacío**. Vite redirige automáticamente las peticiones `/api` al backend en `http://localhost:4000` mediante proxy.

---

## Cómo iniciar el proyecto

Necesitas **dos terminales abiertas** simultáneamente.

### Terminal 1 — Backend

```powershell
cd backend
npm run dev
```

Servidor disponible en: **http://localhost:4000**  
Verifica que funciona: **http://localhost:4000/api/health**

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

Aplicación disponible en: **http://localhost:5173**

### Scripts disponibles

| Carpeta | Comando | Descripción |
|---------|---------|-------------|
| `backend/` | `npm run dev` | Servidor con recarga automática (nodemon) |
| `backend/` | `npm start` | Servidor en modo producción |
| `frontend/` | `npm run dev` | Servidor de desarrollo Vite |
| `frontend/` | `npm run build` | Build de producción |
| `frontend/` | `npm run preview` | Previsualizar build de producción |

---

## Iniciar en Visual Studio Code

### Paso 1: Abrir el proyecto

1. Abre **Visual Studio Code**
2. Ve a **Archivo → Abrir carpeta…**
3. Selecciona la carpeta `Gestor-Finanzas`

### Paso 2: Abrir dos terminales integradas

Presiona `` Ctrl+` `` para abrir la terminal, luego el ícono **+** para abrir una segunda.

**Terminal 1:**
```powershell
cd backend
npm run dev
```

**Terminal 2:**
```powershell
cd frontend
npm run dev
```

### Paso 3: Abrir la aplicación

Haz clic en el enlace que muestra Vite (`http://localhost:5173`) o ábrelo manualmente en el navegador.

### Atajo con tareas de VS Code *(opcional)*

Si existe la carpeta `.vscode/`, puedes usar **Terminal → Run Task…** y elegir **Backend: dev** y **Frontend: dev**. También puedes presionar **F5** si está configurado el depurador (`.vscode/launch.json`).

### Depuración

- **Backend:** coloca breakpoints en `backend/src/` y usa la configuración *Debug Backend*
- **Frontend:** usa las DevTools del navegador (F12); se recomienda instalar React DevTools

---

## Rutas del frontend

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro de usuario |
| `/` | Privado | Dashboard con estadísticas |
| `/transaccion` | Privado | Listado y gestión de movimientos |
| `/categorias` | Privado | Gestión de categorías |
| `/metas` | Privado | Gestión de metas de ahorro |
| `/perfil` | Privado | Editar datos del usuario |
| `/admin` | Admin | Gestión de usuarios y sesiones |

> La ruta `/transacciones` redirige automáticamente a `/transaccion`.

---

## API REST

**Base URL:** `http://localhost:4000`

### Health check

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/health` | No | Estado de la API y la base de datos |

---

### Autenticación — `/api/auth`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/register` | No | Registrar nuevo usuario |
| POST | `/login` | No | Iniciar sesión (devuelve JWT) |
| POST | `/refresh` | Cookie | Renovar access token |
| POST | `/logout` | No | Cerrar sesión |
| GET | `/me` | Sí | Obtener usuario autenticado |

#### Registro `POST /api/auth/register`

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "password": "MiPassword1!",
  "avatar": "https://..."
}
```

**Validaciones:**

| Campo | Regla |
|-------|-------|
| `nombre`, `apellido` | Mínimo 2 caracteres; solo letras |
| `email` | Formato válido estricto |
| `password` | Mínimo 8 caracteres; mayúsculas, minúsculas, números y caracteres especiales |

#### Login `POST /api/auth/login`

```json
{
  "email": "juan@email.com",
  "password": "MiPassword1!"
}
```

La respuesta incluye `accessToken` y datos del `user`. El refresh token se guarda en una cookie HTTP-only.

---

### Transacciones — `/api/transaccion`

Todas requieren el header: `Authorization: Bearer <accessToken>`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listar transacciones (filtros opcionales) |
| GET | `/stats` | Estadísticas: ingresos, gastos, balance |
| GET | `/:id` | Obtener una transacción |
| POST | `/` | Crear transacción |
| PUT | `/:id` | Actualizar transacción |
| DELETE | `/:id` | Eliminar transacción |

**Filtros disponibles en GET `/api/transaccion`:** `tipo`, `categoria` (ID de categoría), `desde`, `hasta`

#### Crear transacción `POST /api/transaccion`

```json
{
  "tipo": "gasto",
  "importe": 45.50,
  "descripcion": "Supermercado",
  "categoria_id": 1,
  "fecha": "2026-06-21T10:00:00.000Z"
}
```

**Validaciones:**

| Campo | POST | PUT |
|-------|------|-----|
| `tipo` | Obligatorio (`"ingreso"` o `"gasto"`) | Opcional, mismo enum |
| `importe` | Obligatorio, número > 0 | Opcional, número > 0 |
| `categoria_id` | Obligatorio, ID de categoría del usuario | Opcional, ID válido |
| `fecha` | Opcional, formato ISO válido | Opcional, formato ISO válido |
| Body vacío | — | Rechazado |

---

### Categorías — `/api/categorias`

Todas requieren el header: `Authorization: Bearer <accessToken>`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listar categorías del usuario |
| GET | `/:id` | Obtener una categoría |
| POST | `/` | Crear categoría (`nombre`) |
| PUT | `/:id` | Renombrar categoría |
| DELETE | `/:id` | Eliminar (solo si no tiene transacciones) |

---

### Metas — `/api/metas`

Todas requieren el header: `Authorization: Bearer <accessToken>`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listar metas del usuario |
| GET | `/:id` | Obtener una meta |
| POST | `/` | Crear meta |
| PUT | `/:id` | Actualizar meta |
| DELETE | `/:id` | Eliminar meta |

#### Crear meta `POST /api/metas`

```json
{
  "nombre": "Viaje",
  "descripcion": "Ahorro para vacaciones",
  "monto_objetivo": 500000,
  "monto_actual": 50000,
  "fecha_limite": "2026-12-31",
  "estado": "activa"
}
```

`estado` puede ser `"activa"`, `"completada"` o `"cancelada"`. Si `monto_actual >= monto_objetivo`, el backend marca la meta como `completada`.

---

### Usuarios — `/api/usuarios`

Todas requieren `Authorization: Bearer <accessToken>`

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/` | admin | Listar todos los usuarios |
| GET | `/sessions` | admin | Listar todas las sesiones |
| GET | `/:id/sessions` | admin | Sesiones de un usuario |
| DELETE | `/sessions/:sessionId` | admin | Revocar sesión |
| PUT | `/:id` | usuario / admin | Actualizar perfil |

**Reglas para actualizar perfil `PUT /api/usuarios/:id`:**

- Debe incluir al menos un campo: `nombre`, `apellido`, `email`, `avatar` o `rol`
- `nombre` y `apellido` no pueden estar vacíos si se envían
- `email` debe tener formato válido y no estar registrado por otro usuario
- Solo un **admin** puede modificar el campo `rol` (`"usuario"` o `"admin"`)
- Un usuario normal solo puede actualizar su propio perfil

---

## Autenticación y roles

```
Login
  └─▶ Access Token (5 min, localStorage)
  └─▶ Refresh Token (cookie HTTP-only, 1 h)
        │
        ▼
  Peticiones con: Authorization: Bearer <token>
        │
        ▼ (token expirado)
  POST /api/auth/refresh  ──▶  Nuevo access token
        │
        ▼
  Reintento automático de la petición original
```

| Rol | Permisos |
|-----|----------|
| `usuario` | Sus propias transacciones y perfil |
| `admin` | Todo lo anterior + panel `/admin`: listar/editar usuarios, ver y revocar sesiones, cambiar roles |

> **Nota:** En la consola del backend puede aparecer `Error al verificar token: jwt expired`. Es **normal**: indica que el access token caducó y el frontend lo está renovando. No es un error si la app sigue funcionando.

---

## Solución de problemas

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté en ejecución
- Revisa `DB_HOST`, `DB_PORT`, `DB_USER` y `DB_PASSWORD` en `backend/.env`
- Confirma que la base de datos `gestor_finanzas` existe

### CORS bloqueado
- Asegúrate de que `FRONTEND_URL` en `backend/.env` sea `http://localhost:5173`
- Reinicia el backend tras cambiar variables de entorno

### El frontend no llega al backend
- Verifica que el backend esté corriendo en el puerto `4000`
- En desarrollo, `VITE_API_URL` debe estar **vacío** para usar el proxy de Vite
- Prueba directamente: http://localhost:4000/api/health

### Sesión expira constantemente
- El access token dura 5 minutos; el frontend lo renueva automáticamente
- Si borras las cookies del navegador, tendrás que iniciar sesión de nuevo
- El refresh token dura 1 hora; tras ese tiempo es necesario hacer login nuevamente
- Para menos ruido en desarrollo, aumenta `JWT_ACCESS_EXPIRES` (por ejemplo `15m`) en `backend/.env`

### Mensajes `jwt expired` en la consola del backend
- Aparecen cuando llegan peticiones con el token antiguo mientras el frontend lo renueva
- El Dashboard lanza varias peticiones en paralelo, por eso suele repetirse
- Si la app no te saca al login, puedes ignorarlos con seguridad

### `psql` no reconocido en PowerShell
- Añade PostgreSQL al PATH de Windows, o usa pgAdmin Query Tool: abre `backend/database/schema.sql` y ejecútalo conectado a la BD `postgres`

---

## Licencia

ISC