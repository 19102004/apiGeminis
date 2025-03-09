const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Token = require('../models/wasa');
const Usuario = require('../models/usuario');

router.use(express.json());

const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

const generateToken = (phoneNumber) => {
  return jwt.sign({ phoneNumber }, JWT_SECRET, { expiresIn: '1h' });
};

router.post('/enviar', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'phoneNumber es requerido' });
  }

  try {
    const token = generateToken(phoneNumber);

    const newToken = new Token({
      phoneNumber,
      token,
    });
    await newToken.save();

    const resetUrl = `${token}`;

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: 'tony',
          language: { code: 'en' },
          components: [
            {
              type: 'button',
              sub_type: 'url',
              index: 0,
              parameters: [{ type: 'text', text: resetUrl }],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Mensaje enviado:', response.data);
    res.status(200).json({ success: true, data: response.data, token });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: error.response ? error.response.data : error.message });
  }
});

router.post('/verificarwasa', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token es requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { phoneNumber } = decoded;

    const usuario = await Usuario.findOne({ telefono: phoneNumber });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Token válido', telefono: usuario.telefono });
  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }

    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.post('/contrawasa', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Datos en el token:", decoded); 

    const { phoneNumber } = decoded; 

    const usuario = await Usuario.findOne({ telefono: phoneNumber });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.password = newPassword; 
    await usuario.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }

    res.status(500).json({ message: 'Error en el servidor' });
  }
});


module.exports = router;