// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Módulo para manejar rutas de archivos
const authRoutes = require('./backend/routes/auth'); // Importa las rutas de autenticación

dotenv.config();

// Suprimir las advertencias de MongoDB (opcional)
process.env.NODE_NO_WARNINGS = '1'; 

const app = express();
app.use(express.json()); // Para parsear JSON
app.use(cors()); // Para permitir solicitudes de diferentes dominios

// Conexión a la base de datos

// Actualizar la ruta de los archivos estáticos
app.use(express.static(path.join(__dirname, 'frontend', 'src', 'styles')));

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta para la página principal donde generamos las tarjetas
app.get('/cards', (req, res) => {
    const cards = [];
    for (let i = 1; i <= 200; i++) {
        cards.push({
            id: `str-${i}`,
            title: `Stream ${i}`,
            status: 'Streaming'
        });
    }

    res.json(cards);
});

// Ruta por defecto para servir el frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
