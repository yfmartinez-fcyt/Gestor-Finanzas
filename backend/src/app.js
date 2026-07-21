require('dotenv').config();

const express= require('express');

const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDB, pool } = require('./config/db');

const authRoutes = require("./routes/authRoutes");
const transaccionRoutes = require("./routes/transaccionRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const categoriasRoutes = require("./routes/categoriasRoutes");
const metasRoutes = require("./routes/metasRoutes");


const errorHandler = require('./middleware/errorHandler');

const app= express(); 

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim()) 
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como Postman o peticiones del mismo servidor)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.error(`CORS bloqueado para el origen: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Permitir el envío de cookies
}));

// 📦 Middlewares base
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

// Rutas de diagnóstico
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a DB
    await pool.query('SELECT 1');
    
    res.json({ 
      success: true,
      status: 'online', 
      message: 'API funcionando correctamente',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'error',
      message: 'Error de conexión con la base de datos',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use("/api/transaccion", transaccionRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/metas", metasRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta '${req.originalUrl}' no encontrada`
  });
});


app.use(errorHandler);

module.exports = app;
