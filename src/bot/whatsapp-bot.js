const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const NegotiationFlow = require('./negotiation-flow');

class WhatsAppBot {
  constructor(io) {
    this.io = io;
    this.client = null;
    this.qrCode = null;
    this.status = 'initializing';
    this.negotiationFlow = new NegotiationFlow();
    this.messageHistory = [];
  }

  initialize() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/whatsappwebjs/whatsapp-web.js/main/web-version.json'
      },
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });

    this.setupEventHandlers();
    this.client.initialize();
  }

  setupEventHandlers() {
    // QR Code recebido
    this.client.on('qr', async (qr) => {
      console.log('📱 QR Code recebido');
      this.status = 'qr_received';
      
      try {
        this.qrCode = await qrcode.toDataURL(qr);
        this.io.emit('qr', this.qrCode);
        this.io.emit('status', this.status);
      } catch (err) {
        console.error('Erro ao gerar QR Code:', err);
      }
    });

    // Cliente pronto
    this.client.on('ready', () => {
      console.log('✅ Cliente WhatsApp pronto!');
      this.status = 'ready';
      this.qrCode = null;
      this.io.emit('status', this.status);
      this.io.emit('authenticated', { message: 'Autenticado com sucesso!' });
    });

    // Cliente autenticado
    this.client.on('authenticated', () => {
      console.log('🔐 Cliente autenticado');
      this.status = 'authenticated';
      this.io.emit('status', this.status);
    });

    // Falha na autenticação
    this.client.on('auth_failure', (msg) => {
      console.error('❌ Falha na autenticação:', msg);
      this.status = 'auth_failure';
      this.io.emit('status', this.status);
      this.io.emit('error', { message: 'Falha na autenticação' });
    });

    // Cliente desconectado
    this.client.on('disconnected', (reason) => {
      console.log('⚠️ Cliente desconectado:', reason);
      this.status = 'disconnected';
      this.io.emit('status', this.status);
    });

    // Mensagem recebida
    this.client.on('message', async (message) => {
      try {
        await this.handleMessage(message);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    });
  }

  async handleMessage(message) {
    // Ignorar mensagens de grupos e status
    if (message.from.includes('@g.us') || message.isStatus) {
      return;
    }

    const contact = await message.getContact();
    const contactName = contact.pushname || contact.name || message.from;
    
    // Gerar identificador mascarado para logs e histórico
    const sanitizedNumber = this.sanitizePhoneNumber(
      contact.number || contact.id?.user,
      message.from
    );
    
    console.log(`📥 Mensagem de ${contactName} (${sanitizedNumber}): ${message.body}`);

    // Adicionar ao histórico
    const messageData = {
      type: 'received',
      from: contactName,
      fromNumber: sanitizedNumber,
      body: message.body,
      timestamp: new Date().toISOString()
    };
    
    this.messageHistory.push(messageData);
    this.io.emit('message', messageData);

    // Processar mensagem e obter resposta
    const response = this.negotiationFlow.processMessage(message.from, message.body);

    if (response) {
      // Simular delay humano (evitar detecção de bot)
      await this.delay(1000 + Math.random() * 1000);
      
      await message.reply(response);
      
      console.log(`📤 Resposta enviada para ${contactName}: ${response.substring(0, 50)}...`);

      // Adicionar resposta ao histórico
      const responseData = {
        type: 'sent',
        to: contactName,
        toNumber: sanitizedNumber,
        body: response,
        timestamp: new Date().toISOString()
      };
      
      this.messageHistory.push(responseData);
      this.io.emit('message', responseData);
    }
  }

  sanitizePhoneNumber(contactNumber, fallbackIdentifier) {
    const maskedFromContact = this.maskPhoneNumber(contactNumber);
    if (maskedFromContact) {
      return maskedFromContact;
    }
    return this.maskWhatsappId(fallbackIdentifier);
  }

  maskPhoneNumber(number) {
    if (!number) {
      return null;
    }

    const hasPlus = number.startsWith('+');
    const digits = number.replace(/\D/g, '');

    if (digits.length < 4) {
      return null;
    }

    const countryCodeLength = Math.min(2, digits.length - 2);
    const countryCode = digits.slice(0, countryCodeLength);
    const remaining = digits.slice(countryCodeLength);
    const areaCode = remaining.length > 4 ? remaining.slice(0, 2) : '';
    const lastTwo = digits.slice(-2);

    let masked = '';
    if (hasPlus) {
      masked += '+';
    }
    masked += countryCode;
    if (areaCode) {
      masked += ` (${areaCode})`;
    }
    masked += ' ****-**' + lastTwo;

    return masked;
  }

  maskWhatsappId(identifier) {
    if (!identifier) {
      return '****';
    }

    const atIndex = identifier.indexOf('@');
    if (atIndex > 4) {
      return `${identifier.substring(0, atIndex - 4)}****${identifier.substring(atIndex)}`;
    }

    return '****';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatus() {
    return this.status;
  }

  getQRCode() {
    return this.qrCode;
  }

  getMessageHistory() {
    return this.messageHistory;
  }
}

module.exports = WhatsAppBot;

