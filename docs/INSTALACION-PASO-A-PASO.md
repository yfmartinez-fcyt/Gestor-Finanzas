# Instalación paso a paso — Gestor Finanzas

Guía para instalar y ejecutar el proyecto desde cero en **Windows**.

> **Tiempo estimado:** 20–40 minutos (según descargas e instaladores).

---

## Antes de empezar

### Estructura del proyecto

```
Gestor-Finanzas/                    ← RAÍZ del proyecto
├── backend/                        ← API (Node.js + Express)
│   ├── database/
│   │   └── schema.sql              ← Script de tablas
│   ├── .env.example
│   └── package.json
├── frontend/                       ← Interfaz web (React + Vite)
│   ├── .env.example
│   └── package.json
└── README.md
```

### Puertos que usa la aplicación

| Puerto | Servicio        | URL de prueba                    |
|--------|-----------------|----------------------------------|
| `5432` | PostgreSQL      | —                                |
| `4000` | Backend (API)   | http://localhost:4000/api/health |
| `5173` | Frontend (Vite) | http://localhost:5173            |

---

## Paso 1 — Instalar Node.js

**Para qué sirve:** ejecutar el backend y el frontend.

1. Descarga la versión **LTS** desde https://nodejs.org/
2. Ejecuta el instalador (siguiente, siguiente…)
3. Asegúrate de marcar **"Add to PATH"** si el instalador lo ofrece

**Verificar** (PowerShell o terminal de VS Code, en cualquier carpeta):

```powershell
node -v
npm -v
```

Debes ver números de versión, por ejemplo `v20.x.x` y `10.x.x`.

---

## Paso 2 — Instalar PostgreSQL y pgAdmin

**Para qué sirve:** guardar usuarios, sesiones y transacciones.

1. Descarga desde https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Durante la instalación, anota:
   - **Usuario:** `postgres`
   - **Contraseña:** la que elijas (la usarás en el Paso 6)
   - **Puerto:** `5432` (valor por defecto)
4. Marca la opción **pgAdmin 4** si el instalador la ofrece (viene incluido normalmente)

**Verificar** (opcional):

```powershell
psql --version
```

> Si `psql` no se reconoce, no pasa nada: puedes usar **pgAdmin** para todos los pasos de base de datos.

**Abrir pgAdmin:**

1. Menú Inicio → busca **pgAdmin 4**
2. Conecta al servidor **PostgreSQL** (te pedirá la contraseña de `postgres`)

---

## Paso 3 — Instalar Visual Studio Code (recomendado)

**Para qué sirve:** editar código y abrir terminales integradas.

1. Descarga desde https://code.visualstudio.com/
2. Instala con opciones por defecto
3. Abre VS Code → **File → Open Folder…**
4. Selecciona la carpeta `Gestor-Finanzas`

**Extensiones útiles (opcionales):**

- ES7+ React/Redux/React-Native snippets
- PostgreSQL
- Thunder Client o REST Client

---

## Paso 4 — Obtener el proyecto

### Opción A — Ya tienes la carpeta

Copia o descomprime el proyecto, por ejemplo en:

```
C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas
```

### Opción B — Clonar con Git

```powershell
cd C:\Users\TU_USUARIO\Desktop
git clone <URL_DEL_REPOSITORIO>
cd Gestor-Finanzas
```

> **No copies** las carpetas `node_modules` ni los archivos `.env` de otra PC. Se regeneran en los pasos siguientes.

---

## Paso 5 — Instalar dependencias del proyecto

Abre una terminal en VS Code (**Terminal → New Terminal**) o PowerShell.

### 5.1 Backend

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
npm install
```

### 5.2 Frontend

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
npm install
```

Espera a que termine cada `npm install` sin errores.

---

## Paso 6 — Crear la base de datos

### Opción A — pgAdmin (recomendada)

1. Abre **pgAdmin 4**
2. En el panel izquierdo: **Servers → PostgreSQL**
3. Clic derecho en **Databases** → **Create → Database…**
4. En **Database:** escribe `gestor_finanzas`
5. Clic en **Save**

### Opción B — Terminal (si `psql` funciona)

```powershell
psql -U postgres -c "CREATE DATABASE gestor_finanzas;"
```

Te pedirá la contraseña de `postgres`.

---

## Paso 7 — Ejecutar el esquema (crear tablas)

El archivo con las tablas está en:

```
Gestor-Finanzas\backend\database\schema.sql
```

Crea estas tablas:

| Tabla            | Contenido                          |
|------------------|------------------------------------|
| `usuarios`       | Datos de usuario y rol             |
| `refresh_tokens` | Sesiones activas (JWT refresh)     |
| `transacciones`  | Ingresos y gastos                  |

### Opción A — pgAdmin (recomendada)

1. pgAdmin → **gestor_finanzas** → clic derecho → **Query Tool**
2. Abre `backend\database\schema.sql` en VS Code
3. Copia **todo** el contenido y pégalo en el Query Tool
4. Pulsa **Execute** (F5)

### Opción B — Terminal

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas
psql -U postgres -d gestor_finanzas -f backend\database\schema.sql
```

### Comprobar que se creó bien

En pgAdmin: **gestor_finanzas → Schemas → public → Tables**

Debes ver: `usuarios`, `refresh_tokens`, `transacciones`.

---

## Paso 8 — Configurar variables de entorno

### 8.1 Backend

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
copy .env.example .env
```

Abre `backend\.env` con VS Code y edita al menos estas líneas:

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

| Variable              | Qué poner                                      |
|-----------------------|------------------------------------------------|
| `DB_PASSWORD`         | La contraseña de PostgreSQL del Paso 2         |
| `JWT_ACCESS_SECRET`   | Texto largo y aleatorio (no compartir)         |
| `JWT_REFRESH_SECRET`  | Otro texto largo y aleatorio, distinto al anterior |

### 8.2 Frontend

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
copy .env.example .env
```

El archivo `frontend\.env` debe quedar así en desarrollo:

```env
VITE_API_URL=
```

> Déjalo **vacío** para que Vite redirija las peticiones `/api` al backend en `http://localhost:4000`.

---

## Paso 9 — Iniciar la aplicación

Necesitas **dos terminales abiertas** a la vez. En VS Code: **Terminal → Split Terminal**.

### Terminal 1 — Backend

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
npm run dev
```

Debe aparecer algo como:

```
Servidor corriendo en http://0.0.0.0:4000
```

**No cierres esta terminal.**

### Terminal 2 — Frontend

```powershell
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
npm run dev
```

Debe aparecer algo como:

```
Local: http://localhost:5173/
```

**No cierres esta terminal.**

---

## Paso 10 — Comprobar que todo funciona

| # | Dónde | Qué hacer | Resultado esperado |
|---|-------|-----------|-------------------|
| 1 | Navegador | Abrir http://localhost:4000/api/health | JSON con `"status": "online"` |
| 2 | Navegador | Abrir http://localhost:5173 | Pantalla de login o registro |
| 3 | App | Registrarte con un email y contraseña | Cuenta creada |
| 4 | App | Crear una transacción de prueba | Aparece en el listado |

### Crear un usuario administrador (opcional)

1. Regístrate en la app con tu email
2. En pgAdmin → Query Tool sobre `gestor_finanzas`:

```sql
UPDATE usuarios SET rol = 'admin' WHERE email = 'tu@email.com';
```

3. Cierra sesión y vuelve a entrar

---

## Resumen rápido (comandos en orden)

```powershell
# Paso 5 — Dependencias
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
npm install
cd ..\frontend
npm install

# Paso 6-7 — Base de datos (terminal; o usa pgAdmin)
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas
psql -U postgres -c "CREATE DATABASE gestor_finanzas;"
psql -U postgres -d gestor_finanzas -f backend\database\schema.sql

# Paso 8 — Variables de entorno
cd backend
copy .env.example .env
# Editar backend\.env con VS Code
cd ..\frontend
copy .env.example .env

# Paso 9 — Arrancar (DOS terminales)
# Terminal 1:
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\backend
npm run dev

# Terminal 2:
cd C:\Users\TU_USUARIO\Desktop\Gestor-Finanzas\frontend
npm run dev
```

---

## Solución de problemas

### `node` o `npm` no se reconoce

- Reinstala Node.js con **Add to PATH**
- Cierra y abre de nuevo la terminal (o VS Code)

### Error de conexión a PostgreSQL

- Comprueba que el servicio Windows `postgresql-x64-XX` esté **En ejecución**
- Revisa en `backend\.env`: `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Confirma que la base de datos `gestor_finanzas` existe en pgAdmin

### `psql` no se reconoce

- Usa **pgAdmin** para los Pasos 6 y 7
- O añade al PATH: `C:\Program Files\PostgreSQL\16\bin` (ajusta la versión)

### `npm install` falla

```powershell
npm cache clean --force
npm install
```

Ejecuta el comando en la misma carpeta donde falló (`backend\` o `frontend\`).

### El frontend no llega al backend

- Terminal 1: backend corriendo en `backend\`
- Terminal 2: frontend corriendo en `frontend\`
- `FRONTEND_URL=http://localhost:5173` en `backend\.env`
- `VITE_API_URL=` vacío en `frontend\.env`
- Prueba directo: http://localhost:4000/api/health

### Sesión expira muy rápido

- El access token dura 5 minutos por defecto; el frontend lo renueva solo
- Si borras cookies del navegador, tendrás que iniciar sesión de nuevo

---

## Referencia: dónde ejecutar cada cosa

| Acción                         | Dónde ejecutar              | Herramienta        |
|--------------------------------|-----------------------------|--------------------|
| `node -v`, `npm -v`            | Cualquier carpeta           | PowerShell / VS Code |
| `npm install`                  | `backend\` o `frontend\`    | Terminal           |
| `copy .env.example .env`       | `backend\` o `frontend\`    | Terminal           |
| Editar `.env`                  | `backend\` o `frontend\`    | VS Code            |
| `CREATE DATABASE ...`          | —                           | pgAdmin o `psql`   |
| Ejecutar `schema.sql`          | RAÍZ o pgAdmin              | Terminal o pgAdmin |
| `npm run dev`                  | `backend\` (terminal 1)     | Terminal           |
| `npm run dev`                  | `frontend\` (terminal 2)   | Terminal           |
| Probar la app                  | —                           | Navegador          |

---

## Documentación relacionada

- [README.md](./README.md) — Descripción general, API y rutas
- [INSTALACION-NUEVA-PC.md](./INSTALACION-NUEVA-PC.md) — Guía ampliada con migración de datos y anexo SQL
- [backend/database/schema.sql](./backend/database/schema.sql) — Esquema de la base de datos

---

*Última actualización: junio 2026*
