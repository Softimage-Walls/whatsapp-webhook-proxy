const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const N8N_URL = process.env.N8N_URL;

// Verificación webhook Meta (GET)
app.get('/webhook/whatsapp-ricardo', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado correctamente');
    res.status(200).send(challenge);
  } else {
    console.log('Token incorrecto');
    res.status(403).end();
  }
});

// Reenviar mensajes de Meta a n8n (POST)
app.post('/webhook/whatsapp-ricardo', async (req, res) => {
  console.log('Mensaje recibido de Meta, reenviando a n8n...');
  try {
    await axios.post(N8N_URL, req.body);
    console.log('Reenviado correctamente a n8n');
  } catch (err) {
    console.error('Error reenviando a n8n:', err.message);
  }
  res.status(200).end();
});

app.listen(port, () => {
  console.log(`Proxy corriendo en puerto ${port}`);
});
