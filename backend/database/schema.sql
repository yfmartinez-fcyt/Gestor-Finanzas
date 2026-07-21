-- Esquema inicial para Gestor Finanzas
-- Ejecutar conectado a la BD por defecto 'postgres':
--   psql -U postgres -f backend/database/schema.sql
--
-- Este script crea la base de datos (si no existe) y todas las tablas.

-- 1. Crear la base de datos (solo si aún no existe; requiere psql)
SELECT 'CREATE DATABASE gestor_finanzas'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gestor_finanzas')\gexec

\c gestor_finanzas

-- 2. Tablas

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

-- 3. Índices

CREATE INDEX IF NOT EXISTS idx_transacciones_usuario ON transacciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones(fecha);
CREATE INDEX IF NOT EXISTS idx_transacciones_categoria ON transacciones(categoria_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario ON refresh_tokens(usuario_id);
CREATE INDEX IF NOT EXISTS idx_categorias_usuario ON categorias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_metas_usuario ON metas(usuario_id);
