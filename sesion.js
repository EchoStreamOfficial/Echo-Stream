// URL de conexión a MongoDB usando MongoDB Atlas
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); // Para manejar sesiones (opcional)

// Configuración de la aplicación
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Para poder leer el cuerpo de la solicitud como JSON

// Configurar sesiones
app.use(session({
  secret: 'OsLYLCwZ2FVcCfX3', // Usa una clave secreta
  resave: false,
  saveUninitialized: true
}));

const mongoURI = 'mongodb+srv://echostreamofficial:OsLYLCwZ2FVcCfX3@echostream.yz3tr.mongodb.net/?retryWrites=true&w=majority&appName=EchoStream';

// Conexión a MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.log('Error al conectar a MongoDB', err));

// Definición del esquema y modelo de Usuario, verificando si el modelo ya está registrado
let User;
try {
  User = mongoose.model('User');
} catch (error) {
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  // Método para encriptar la contraseña antes de guardar
  userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10); // Encriptar con 10 rondas de sal
    }
    next();
  });

  // Método para comparar contraseñas (para el login)
  userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  // Crear el modelo de Usuario si no existe
  User = mongoose.model('User', userSchema);
}

// Ruta de registro de usuario
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validación simple
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario o el correo electrónico ya están registrados' });
    }

    // Crear un nuevo usuario
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    res.status(201).json({ message: 'Registro realizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'Ambos campos son obligatorios' });
  }

  try {
    // Buscar al usuario por email o username
    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Comparar la contraseña ingresada con la almacenada
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Guardar el userId en la sesión
    req.session.userId = user._id;

    // Enviar el username y otros datos al frontend
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      username: user.username, // Enviar el nombre de usuario en la respuesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta para obtener el perfil del usuario
app.get('/profile', async (req, res) => {
  // Verificar que el usuario esté autenticado (tenga una sesión)
  const userId = req.session.userId; 
  if (!userId) {
    return res.status(401).json({ error: 'No estás autenticado' });
  }

  try {
    // Buscar al usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Devolver el nombre de usuario y otros detalles si lo deseas
    res.json({
      username: user.username,
      email: user.email,
      // Otros detalles si lo deseas, como la bio o las estadísticas del perfil
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
});