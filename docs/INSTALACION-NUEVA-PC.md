# Instalación en otra PC — Gestor Finanzas

Guía para configurar el proyecto desde cero en un equipo nuevo (Windows). Sigue los pasos en orden.

---

## Estructura de carpetas del proyecto

Antes de empezar, ubica estas rutas en tu PC (ajusta `TU_USUARIO`):

```
C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\     ← RAÍZ del proyecto
├── backend\                                      ← comandos del servidor API
│   └── database\schema.sql                       ← crea la BD y las tablas
├── frontend\                                     ← comandos de la interfaz web
├── docs\                                         ← guías de instalación
└── README.md
```

En esta guía usamos **RAÍZ** para referirnos a `Gestor-Finanzas\`, **backend/** y **frontend/**.

---

## Dónde abrir la terminal

Puedes usar cualquiera de estas opciones:

| Opción | Cómo |
|--------|------|
| **VS Code** (recomendado) | Abre la carpeta `Gestor-Finanzas` → **Terminal → New Terminal** (`Ctrl+ñ`) |
| **PowerShell de Windows** | Clic derecho en la carpeta → "Abrir en Terminal" o `cd` manual hasta la ruta |
| **pgAdmin** | Solo para comandos SQL (crear BD, ejecutar script) — no uses terminal |

> En VS Code, la terminal siempre muestra la carpeta actual al inicio del prompt, por ejemplo:  
> `PS C:\Users\...\Gestor-Finanzas\backend>`

Para ir a una carpeta:

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas        # RAÍZ
cd backend                                               # desde RAÍZ → backend
cd ..\frontend                                           # desde backend → frontend
cd ..                                                    # volver a RAÍZ
```

---

## Resumen rápido

| Qué instalar | Para qué sirve | Dónde se instala |
|--------------|----------------|------------------|
| **Node.js** | Ejecutar backend y frontend | Instalador de Windows (no dentro del proyecto) |
| **PostgreSQL** | Base de datos | Instalador de Windows (no dentro del proyecto) |
| **Visual Studio Code** | Editar y ejecutar código | Instalador de Windows |
| **Git** (opcional) | Clonar repositorio | Instalador de Windows |

Las dependencias de código (`express`, `react`, etc.) se instalan con `npm install` **dentro de** `backend/` y `frontend/`.

---

## 1. Software obligatorio

### Node.js

- **Descarga:** https://nodejs.org/
- **Versión recomendada:** LTS (18 o superior)
- **Dónde instalar:** Instalador de Windows (siguiente, siguiente…). No hace falta estar dentro del proyecto.

**Verificar instalación**

| Dónde ejecutar | Comando |
|----------------|---------|
| Cualquier terminal (PowerShell, CMD o VS Code) — **no importa la carpeta** | `node -v` y `npm -v` |

```powershell
node -v
npm -v
```

Deberías ver números de versión, por ejemplo `v20.x.x` y `10.x.x`.

---

### PostgreSQL

- **Descarga:** https://www.postgresql.org/download/windows/
- **Versión recomendada:** 14 o superior
- **Dónde instalar:** Instalador de Windows. Anota la contraseña del usuario `postgres` y deja el puerto **5432**.

**Verificar instalación**

| Dónde ejecutar | Comando |
|----------------|---------|
| Cualquier terminal — **no importa la carpeta** | `psql --version` |

```powershell
psql --version
```

Si `psql` no se reconoce, usa **pgAdmin** o añade al PATH: `C:\Program Files\PostgreSQL\16\bin`.

---

## 2. Software recomendado (no obligatorio)

### Visual Studio Code

- **Descarga:** https://code.visualstudio.com/
- **Dónde abrir el proyecto:** **File → Open Folder** → selecciona `C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas`

### Git

- **Descarga:** https://git-scm.com/download/win

**Verificar**

| Dónde ejecutar | Comando |
|----------------|---------|
| Cualquier terminal | `git --version` |

---

## 3. Qué copiar a la otra PC

### Sí copiar

```
Gestor-Finanzas\          ← toda esta carpeta (sin node_modules)
├── backend\
│   └── database\
│       └── schema.sql    ← IMPORTANTE: crea la BD y las tablas
├── frontend\
├── docs\
├── .vscode\
└── README.md
```

> **Si no ves `backend\database\schema.sql`**, créalo tú (ver [Anexo: schema.sql](#anexo-contenido-de-schemasql)). Ese archivo puede faltar si el proyecto se copió sin todos los archivos.

### No copiar

| Carpeta / archivo | Motivo |
|-------------------|--------|
| `backend\node_modules\` | Se regenera con `npm install` en `backend/` |
| `frontend\node_modules\` | Se regenera con `npm install` en `frontend/` |
| `backend\.env` | Secretos; créalo de nuevo en la PC nueva |
| `frontend\.env` | Config local; créalo de nuevo |

---

## 4. Pasos de instalación (checklist)

### Paso 1 — Instalar software base

- [ ] Node.js (`node -v` en cualquier terminal)
- [ ] PostgreSQL (servicio activo en Windows)
- [ ] VS Code (opcional)

---

### Paso 2 — Obtener el proyecto

**Opción A — Copiar carpeta**

Copia `Gestor-Finanzas` a, por ejemplo:

```
C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas
```

**Opción B — Clonar con Git**

| Dónde ejecutar | Comando |
|----------------|---------|
| Carpeta donde quieras el proyecto (ej. `Desktop\`) — **no dentro de Gestor-Finanzas** | ver abajo |

```powershell
cd C:\Users\TU_USUARIO\Desktop
git clone <URL_DEL_REPOSITORIO>
cd Gestor-Finanzas
```

---

### Paso 3 — Instalar dependencias de Node.js

**3.1 Backend**

| Dónde ejecutar | Comando |
|----------------|---------|
| **`Gestor-Finanzas\backend\`** | `npm install` |

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
npm install
```

**3.2 Frontend**

| Dónde ejecutar | Comando |
|----------------|---------|
| **`Gestor-Finanzas\frontend\`** | `npm install` |

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
npm install
```

> En VS Code: abre terminal → `cd backend` → `npm install` → luego `cd ..\frontend` → `npm install`.

---

### Paso 4 — Configurar PostgreSQL

**4.1 Crear la base de datos y las tablas**

El script `backend\database\schema.sql` crea la BD `gestor_finanzas` (si no existe) y las tablas:

| Tabla | Contenido |
|-------|-----------|
| `usuarios` | Datos de usuario y rol |
| `refresh_tokens` | Sesiones activas |
| `categorias` | Categorías por usuario |
| `transacciones` | Ingresos y gastos (`categoria_id`) |
| `metas` | Metas de ahorro |

**Si el archivo NO existe**, créalo:

| Dónde | Qué hacer |
|-------|-----------|
| **`Gestor-Finanzas\backend\`** | Crear carpeta `database` si no existe |
| **`Gestor-Finanzas\backend\database\`** | Crear `schema.sql` con el SQL del [Anexo](#anexo-contenido-de-schemasql) |

---

**Opción A — Terminal con `psql` (un solo comando)**

| Dónde ejecutar | Comando |
|----------------|---------|
| **`Gestor-Finanzas\`** (carpeta RAÍZ) | ver abajo |

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas
psql -U postgres -f backend\database\schema.sql
```

**Opción B — pgAdmin**

pgAdmin no soporta `\gexec` / `\c`. Hazlo así:

1. Query Tool sobre la BD `postgres` → ejecuta: `CREATE DATABASE gestor_finanzas;`
2. Conéctate a `gestor_finanzas` → Query Tool
3. Pega el SQL del [Anexo](#anexo-contenido-de-schemasql) (solo las tablas) → **Execute (F5)**

---

### Paso 5 — Crear archivos de entorno

**5.1 Backend**

| Dónde ejecutar | Comando |
|----------------|---------|
| **`Gestor-Finanzas\backend\`** | `copy .env.example .env` |

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
copy .env.example .env
```

| Dónde editar | Archivo |
|--------------|---------|
| VS Code o bloc de notas | **`Gestor-Finanzas\backend\.env`** |

```env
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestor_finanzas
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_POSTGRES

JWT_ACCESS_SECRET=genera_una_cadena_larga_y_aleatoria
JWT_REFRESH_SECRET=otra_cadena_larga_y_diferente
JWT_ACCESS_EXPIRES=5m
JWT_REFRESH_EXPIRES=1h
```

**5.2 Frontend**

| Dónde ejecutar | Comando |
|----------------|---------|
| **`Gestor-Finanzas\frontend\`** | `copy .env.example .env` |

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
copy .env.example .env
```

| Dónde editar | Archivo |
|--------------|---------|
| VS Code o bloc de notas | **`Gestor-Finanzas\frontend\.env`** |

```env
VITE_API_URL=
```

---

### Paso 6 — Iniciar la aplicación

Necesitas **dos terminales** (ambas pueden ser de VS Code: **Terminal → Split Terminal**).

**Terminal 1 — Backend**

| Dónde ejecutar | Comando |
|----------------|---------|
| **`Gestor-Finanzas\backend\`** | `npm run dev` |

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
npm run dev
```

Debe aparecer: `Servidor corriendo en http://0.0.0.0:4000`  
**No cierres esta terminal.**

**Terminal 2 — Frontend**

| Dónde ejecutar | Comando |
|----------------|---------|
| **`Gestor-Finanzas\frontend\`** | `npm run dev` |

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
npm run dev
```

Debe aparecer: `Local: http://localhost:5173/`  
**No cierres esta terminal.**

---

### Paso 7 — Comprobar que todo funciona

| Dónde probar | Qué hacer |
|--------------|-----------|
| **Navegador** (Chrome, Edge, etc.) | Abrir `http://localhost:4000/api/health` → debe decir `"status": "online"` |
| **Navegador** | Abrir `http://localhost:5173` → login o dashboard |
| **Navegador** | Registrarse, crear una transacción de prueba |

---

## 5. Tabla de referencia: dónde ejecutar cada comando

| Comando | Carpeta / lugar | Herramienta |
|---------|-----------------|-------------|
| `node -v`, `npm -v` | Cualquiera | PowerShell / VS Code |
| `psql --version` | Cualquiera | PowerShell |
| `git clone ...` | Donde quieras clonar (ej. Desktop) | PowerShell |
| `npm install` | `backend\` | Terminal en VS Code |
| `npm install` | `frontend\` | Terminal en VS Code |
| `copy .env.example .env` | `backend\` | Terminal |
| `copy .env.example .env` | `frontend\` | Terminal |
| Editar `.env` | `backend\` o `frontend\` | VS Code / bloc de notas |
| `psql -f backend\database\schema.sql` | **RAÍZ** `Gestor-Finanzas\` | PowerShell (crea BD + tablas) |
| `npm run dev` | `backend\` | Terminal 1 (dejar abierta) |
| `npm run dev` | `frontend\` | Terminal 2 (dejar abierta) |
| Probar la app | — | Navegador → `localhost:5173` |
| Probar la API | — | Navegador → `localhost:4000/api/health` |

---

## 6. Puertos que usa el proyecto

| Puerto | Servicio | Dónde se configura |
|--------|----------|-------------------|
| `4000` | API backend | `backend\.env` → `PORT` |
| `5173` | Frontend Vite | `frontend\vite.config.js` |
| `5432` | PostgreSQL | Instalador de PostgreSQL |

---

## 7. Migrar datos de la PC anterior

**En la PC antigua — exportar**

| Dónde ejecutar | Comando |
|----------------|---------|
| Cualquier carpeta (el `.dump` se crea ahí) | `pg_dump ...` |

```powershell
pg_dump -U postgres -d gestor_finanzas -F c -f gestor_finanzas_backup.dump
```

**En la PC nueva — restaurar**

| Dónde ejecutar | Comando |
|----------------|---------|
| Carpeta donde copiaste el archivo `.dump` | `pg_restore ...` |

```powershell
pg_restore -U postgres -d gestor_finanzas -c gestor_finanzas_backup.dump
```

---

## 8. Problemas frecuentes

### `node` o `npm` no se reconoce

- Reinstala Node.js con **"Add to PATH"**
- Cierra y vuelve a abrir la terminal (VS Code: **Terminal → New Terminal**)

### Error al conectar con PostgreSQL

- Servicio Windows: `postgresql-x64-XX` debe estar **En ejecución**
- Revisa `Gestor-Finanzas\backend\.env` (usuario, contraseña, `DB_NAME`)

### `npm install` falla

| Dónde ejecutar | Comando |
|----------------|---------|
| La misma carpeta donde falló (`backend\` o `frontend\`) | ver abajo |

```powershell
npm cache clean --force
npm install
```

### El frontend no llega al backend

- Terminal 1: backend corriendo en `backend\`
- Terminal 2: frontend corriendo en `frontend\`
- `FRONTEND_URL=http://localhost:5173` en `backend\.env`
- `VITE_API_URL=` vacío en `frontend\.env`

---

## 9. Resumen paso a paso (con rutas)

Suponiendo que el proyecto está en el Escritorio:

```powershell
# ── PASO 3: Dependencias ──────────────────────────────────────
# Terminal → ir a backend
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
npm install

# Terminal → ir a frontend
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
npm install

# ── PASO 4: Base de datos ─────────────────────────────────────
# Terminal → ir a RAÍZ (crea BD + tablas en un solo paso)
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas
psql -U postgres -f backend\database\schema.sql

# ── PASO 5: Variables de entorno ───────────────────────────────
# Terminal → backend
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
copy .env.example .env
# Editar backend\.env con VS Code

# Terminal → frontend
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
copy .env.example .env

# ── PASO 6: Arrancar (DOS terminales) ──────────────────────────
# Terminal 1 → backend (dejar abierta)
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
npm run dev

# Terminal 2 → frontend (dejar abierta)
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
npm run dev

# ── PASO 7: Probar ─────────────────────────────────────────────
# Navegador → http://localhost:5173
# Navegador → http://localhost:4000/api/health
```

---

## 10. Documentación relacionada

- [README.md](../README.md) — Documentación general del proyecto
- [INSTALACION-PASO-A-PASO.md](./INSTALACION-PASO-A-PASO.md) — Guía paso a paso
- [backend/.env.example](../backend/.env.example) — Variables del servidor
- [frontend/.env.example](../frontend/.env.example) — Variables del frontend
- [backend/database/schema.sql](../backend/database/schema.sql) — Esquema de la base de datos

---

## Anexo: contenido de schema.sql

Si no tienes el archivo, créalo en `backend\database\schema.sql` o ejecuta este SQL en pgAdmin **después** de crear la BD `gestor_finanzas` y estar conectado a ella.

> Para `psql`, usa el archivo completo del repo (incluye la creación de la BD). El bloque de abajo es solo las tablas (apto para pgAdmin).

```sql
-- Tablas para Gestor Finanzas (ejecutar sobre la BD gestor_finanzas)

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar TEXT,
    rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_categorias_usuario_nombre
    ON categorias (usuario_id, LOWER(nombre));

CREATE TABLE IF NOT EXISTS transacciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
    importe NUMERIC(12, 2) NOT NULL CHECK (importe > 0),
    descripcion TEXT,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE RESTRICT,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS metas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    monto_objetivo NUMERIC(12, 2) NOT NULL CHECK (monto_objetivo > 0),
    monto_actual NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (monto_actual >= 0),
    fecha_limite DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'activa'
        CHECK (estado IN ('activa', 'completada', 'cancelada')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transacciones_usuario ON transacciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones(fecha);
CREATE INDEX IF NOT EXISTS idx_transacciones_categoria ON transacciones(categoria_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario ON refresh_tokens(usuario_id);
CREATE INDEX IF NOT EXISTS idx_categorias_usuario ON categorias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_metas_usuario ON metas(usuario_id);
```

---

*Última actualización: julio 2026*
