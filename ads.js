const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Ruta para servir las imágenes
app.use('/ads', express.static(path.join(__dirname, '/frontend/src/assets/images/ads')));

// Ruta para obtener la lista de imágenes
app.get('/get-ads', (req, res) => {
    const adsDir = path.join(__dirname, '/frontend/src/assets/images/ads');
    fs.readdir(adsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading ads directory');
        }

        // Filtrar solo imágenes
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json(imageFiles);
    });
});