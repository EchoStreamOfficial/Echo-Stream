const express = require('express');
const path = require('path');
const server = require('./server');
const t = require('./sesion');
const a = require('./404');
const v = require('./video');
const ads = require('./ads');
const vds = require('./videosave');

const app = express();
app.use(a);

app.get('/', (req, res) => {
    res.send('Servidor Express está corriendo');
});