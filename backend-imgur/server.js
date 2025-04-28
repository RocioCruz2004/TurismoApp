// backend-imgur/server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(cors());

// Configurar multer para archivos
const upload = multer({ dest: 'uploads/' });

// Ruta para subir imagen
app.post('/upload', upload.single('image'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  try {
    const image = fs.readFileSync(file.path, { encoding: 'base64' });

    const response = await axios.post('https://api.imgur.com/3/image', {
      image,
      type: 'base64'
    }, {
      headers: {
        Authorization: `Client-ID f3f292e13fdee8e` // Tu CLIENT ID de Imgur aquí
      }
    });

    fs.unlinkSync(file.path); // Borra la imagen temporal

    res.json({ url: response.data.data.link });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir a Imgur', details: error.message });
  }
});

app.listen(4000, () => {
  console.log('Servidor backend corriendo en http://localhost:4000');
});
