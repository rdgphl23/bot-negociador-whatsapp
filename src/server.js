require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const basicAuth = require('express-basic-auth');
const path = require('path');
const WhatsAppBot = require('./bot/whatsapp-bot');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Middleware para autenticação básica
const authMiddleware = basicAuth({
  users: { 
    [process.env.DASHBOARD_USER || 'admin']: process.env.DASHBOARD_PASSWORD || 'admin123' 
  },
  challenge: true,
  realm: 'WhatsApp Bot Dashboard'
});

// Aplicar autenticação em todas as rotas
app.use(authMiddleware);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Inicializar o bot
const whatsappBot = new WhatsAppBot(io);

// Rotas da API
app.get('/api/status', (req, res) => {
  res.json({
    status: whatsappBot.getStatus(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/qr', (req, res) => {
  const qr = whatsappBot.getQRCode();
  if (qr) {
    res.json({ qr });
  } else {
    res.status(404).json({ message: 'QR Code não disponível' });
  }
});

// WebSocket para comunicação em tempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado ao WebSocket');
  
  // Enviar status atual
  socket.emit('status', whatsappBot.getStatus());
  
  // Enviar QR se disponível
  const qr = whatsappBot.getQRCode();
  if (qr) {
    socket.emit('qr', qr);
  }

  socket.on('disconnect', () => {
    console.log('Cliente desconectado do WebSocket');
  });
});

// Inicializar o bot
whatsappBot.initialize();

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║       🤖 WhatsApp Bot Negociador                          ║
║                                                           ║
║       Servidor rodando em: http://localhost:${PORT}       ║
║                                                           ║
║       Credenciais padrão:                                 ║
║       Usuário: ${process.env.DASHBOARD_USER || 'admin'}                                       ║
║       Senha: ${process.env.DASHBOARD_PASSWORD || 'admin123'}                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Tratamento de erros
process.on('unhandledRejection', (error) => {
  console.error('Erro não tratado:', error);
});

