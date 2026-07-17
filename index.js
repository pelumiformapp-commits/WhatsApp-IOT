const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// Dummy server so Render sees the app as "alive"
const app = express();
app.get('/', (req, res) => res.send('Bot running'));
app.listen(process.env.PORT || 3000);

// WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

client.on('qr', qr => {
  console.log('Scan this QR code with WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => console.log('WhatsApp bot is ready!'));

const RELAY_URL = 'https://pelumidayo43-art-whatsapp-iot-gateway.onrender.com/api/relay_status';

client.on('message', async msg => {
  const text = msg.body.toLowerCase().trim();

  if (text === 'relay on') {
    await axios.post(RELAY_URL, { status: 1 });
    msg.reply('✅ Relay turned ON');
  } else if (text === 'relay off') {
    await axios.post(RELAY_URL, { status: 0 });
    msg.reply('✅ Relay turned OFF');
  }
});

client.initialize();
