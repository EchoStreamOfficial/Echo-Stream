const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware para manejar las solicitudes JSON
app.use(express.json());

// Endpoint para crear un archivo dentro de la carpeta /frontend/streams
app.post('/stream', (req, res) => {
    const { filename, content } = req.body;

    // Ruta de la carpeta streams
    const streamsDir = path.join(__dirname, 'frontend', 'streams');

    // Asegurarnos de que la carpeta 'streams' exista
    if (!fs.existsSync(streamsDir)) {
        fs.mkdirSync(streamsDir, { recursive: true });
    }

    // Ruta completa del archivo
    const filePath = path.join(streamsDir, filename);

    // Crear el archivo con el contenido proporcionado
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al crear el archivo', error: err });
        }
        res.status(200).json({ message: 'Archivo creado con éxito', filePath });
    });
});