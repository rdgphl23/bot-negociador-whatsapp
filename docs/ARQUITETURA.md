# 🏗️ Arquitetura do Sistema

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO / AVALIADOR                      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ HTTP/WebSocket
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DASHBOARD WEB (Frontend)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   QR Code    │  │   Status     │  │   Mensagens        │   │
│  │   Display    │  │   Monitor    │  │   em Tempo Real    │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│         index.html + styles.css + app.js                        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ Socket.IO / REST
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SERVIDOR EXPRESS (Backend)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      server.js                           │  │
│  │  • HTTP Server                                           │  │
│  │  • Socket.IO Server                                      │  │
│  │  • Basic Auth Middleware                                 │  │
│  │  • Routes: /api/status, /api/qr                          │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│                       │ Events                                   │
│                       ↓                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              WhatsAppBot (whatsapp-bot.js)               │  │
│  │  • Client Manager                                        │  │
│  │  • Event Handlers                                        │  │
│  │  • Message Router                                        │  │
│  │  • QR Code Generator                                     │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│                       │ Message Processing                       │
│                       ↓                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         NegotiationFlow (negotiation-flow.js)            │  │
│  │  • State Management                                      │  │
│  │  • Command Processing                                    │  │
│  │  • Response Generation                                   │  │
│  │  • Business Logic                                        │  │
│  └────────────────────┬─────────────────────────────────────┘  │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ whatsapp-web.js
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WHATSAPP WEB (Puppeteer)                      │
│  • Browser Automation                                            │
│  • QR Authentication                                             │
│  • Message Send/Receive                                          │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ WhatsApp Protocol
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                      WHATSAPP SERVERS                            │
│                    (Meta Infrastructure)                         │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ Mobile/Web Client
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTE FINAL                                │
│                  (Usuário do WhatsApp)                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### 1. Autenticação

```
Dashboard      Server          WhatsAppBot     WhatsApp Web
   │              │                 │                │
   │─── Login ───→│                 │                │
   │◄── Auth ────│                 │                │
   │              │                 │                │
   │─ Request QR ─→│── Get QR ────→│                │
   │              │                 │─ Initialize ──→│
   │              │                 │◄─── QR Code ───│
   │              │◄─── QR Code ───│                │
   │◄─ Send QR ──│                 │                │
   │              │                 │                │
   │              │                 │◄─ Authenticated ─│
   │◄─ Status: Ready ───────────────│                │
```

### 2. Recebimento de Mensagem

```
Cliente      WhatsApp      WhatsAppBot    NegotiationFlow    Dashboard
   │             │              │                │               │
   │──"olá"─────→│              │                │               │
   │             │─ Message ───→│                │               │
   │             │              │─ Process ─────→│               │
   │             │              │                │─ Get Menu ──→│
   │             │              │◄─ Response ────│               │
   │             │◄─ Reply ─────│                │               │
   │◄─ Menu ────│              │                │               │
   │             │              │─ Emit ───────────────────────→│
```

### 3. Envio de Resposta

```
NegotiationFlow    WhatsAppBot    WhatsApp Web    Dashboard
       │                │               │              │
       │─ Response ────→│               │              │
       │                │─── Send ─────→│              │
       │                │               │─ Deliver ──→ Cliente
       │                │─ Emit Event ──────────────→│
       │                │               │              │
```

## 📂 Estrutura de Arquivos Detalhada

```
whatsapp-bot-negociador/
│
├── src/                              # Código-fonte
│   ├── server.js                     # Servidor principal
│   │   ├── Express setup
│   │   ├── Socket.IO setup
│   │   ├── Auth middleware
│   │   └── Routes
│   │
│   ├── bot/                          # Lógica do bot
│   │   ├── whatsapp-bot.js           # Gerenciador WhatsApp
│   │   │   ├── Client initialization
│   │   │   ├── Event handlers
│   │   │   ├── Message processing
│   │   │   └── State management
│   │   │
│   │   └── negotiation-flow.js       # Lógica de negociação
│   │       ├── Command processing
│   │       ├── State machine
│   │       ├── Response generation
│   │       └── Business rules
│   │
│   └── public/                       # Frontend
│       ├── index.html                # Dashboard UI
│       ├── styles.css                # Estilos
│       └── app.js                    # Lógica frontend
│
├── docs/                             # Documentação
│   ├── README.md
│   ├── QUICK_START.md
│   ├── SECURITY.md
│   ├── CONTRIBUTING.md
│   ├── TESTING.md
│   ├── DEPLOYMENT.md
│   ├── CHANGELOG.md
│   ├── ARQUITETURA.md
│   └── RESUMO_EXECUTIVO.md
│
├── setup.js                          # Script de setup
├── package.json                      # Dependências
├── .gitignore                        # Git ignore
├── .env.example                      # Exemplo de env
├── .editorconfig                     # Config editor
└── LICENSE                           # Licença MIT
```

## 🔌 Componentes e Responsabilidades

### server.js
**Responsabilidades:**
- Inicializar servidor Express
- Configurar Socket.IO
- Aplicar middleware de autenticação
- Definir rotas da API
- Gerenciar conexões WebSocket

**Dependências:**
- express
- socket.io
- express-basic-auth
- dotenv

### whatsapp-bot.js
**Responsabilidades:**
- Gerenciar cliente WhatsApp
- Tratar eventos do whatsapp-web.js
- Processar mensagens recebidas
- Enviar mensagens
- Gerar QR Code
- Emitir eventos para dashboard

**Dependências:**
- whatsapp-web.js
- qrcode
- negotiation-flow.js

### negotiation-flow.js
**Responsabilidades:**
- Implementar lógica de negociação
- Gerenciar estado da conversa
- Processar comandos do usuário
- Gerar respostas contextuais
- Manter dados de contratos

**Dependências:**
- Nenhuma (puro JavaScript)

### Frontend (index.html + styles.css + app.js)
**Responsabilidades:**
- Exibir interface do dashboard
- Conectar via Socket.IO
- Mostrar QR Code
- Exibir status em tempo real
- Listar mensagens
- Notificações toast

**Dependências:**
- Socket.IO client

## 🔐 Fluxo de Segurança

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADAS DE SEGURANÇA                      │
└─────────────────────────────────────────────────────────────┘

1. AUTENTICAÇÃO
   ┌──────────────────────────────────────────┐
   │ HTTP Basic Auth                          │
   │ • Usuário/senha via .env                 │
   │ • Todas as rotas protegidas              │
   └──────────────────────────────────────────┘

2. SANITIZAÇÃO
   ┌──────────────────────────────────────────┐
   │ Dados Sensíveis                          │
   │ • Números de telefone ofuscados          │
   │ • Logs sanitizados                       │
   └──────────────────────────────────────────┘

3. PROTEÇÃO XSS
   ┌──────────────────────────────────────────┐
   │ Frontend                                 │
   │ • HTML escapado                          │
   │ • Validação de entrada                   │
   └──────────────────────────────────────────┘

4. ISOLAMENTO
   ┌──────────────────────────────────────────┐
   │ Arquivos Sensíveis                       │
   │ • .env não commitado                     │
   │ • .wwebjs_auth/ ignorado                 │
   │ • .gitignore configurado                 │
   └──────────────────────────────────────────┘
```

## 📊 Diagrama de Estados

### Estado do Bot

```
┌──────────────┐
│ initializing │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ qr_received  │───────┐
└──────┬───────┘       │
       │               │ (timeout)
       │ (scan)        ↓
       ↓         ┌─────────────┐
┌──────────────┐ │auth_failure │
│authenticated │ └─────────────┘
└──────┬───────┘
       │
       ↓
┌──────────────┐
│    ready     │◄────────┐
└──────┬───────┘         │
       │                 │
       │ (disconnect)    │ (reconnect)
       ↓                 │
┌──────────────┐         │
│ disconnected │─────────┘
└──────────────┘
```

### Estado da Conversa

```
┌─────────┐
│  Idle   │
└────┬────┘
     │
     │ "olá"
     ↓
┌─────────┐
│  Menu   │◄────┐
│  Shown  │     │
└────┬────┘     │
     │          │ "menu"
     │ 1|2|3    │
     ↓          │
┌─────────┐     │
│ Option  │─────┘
│Selected │
└─────────┘
```

## 🌊 Fluxo de Eventos (Event-Driven)

```
WhatsApp Events          Bot Handler           Socket.IO Events
     │                       │                       │
qr ──┼──────────────────────→│                       │
     │                       │─────── qr ───────────→│
     │                       │                       │
ready ┼──────────────────────→│                       │
     │                       │──── status: ready ───→│
     │                       │                       │
message ┼────────────────────→│                       │
     │                       │── message received ──→│
     │                       │                       │
     │                       │── message sent ──────→│
     │                       │                       │
disconnected ┼──────────────→│                       │
     │                       │─ status: disconnected →│
```

## 🎯 Pontos de Extensão

### 1. Adicionar Novo Comando
```javascript
// Em negotiation-flow.js
processMessage(userId, message) {
  // Adicionar novo case
  if (message === 'novo_comando') {
    return this.handleNovoComando(userId);
  }
}
```

### 2. Adicionar Nova Rota
```javascript
// Em server.js
app.get('/api/nova-rota', (req, res) => {
  // Implementação
});
```

### 3. Adicionar Novo Evento WebSocket
```javascript
// Em whatsapp-bot.js
this.io.emit('novo-evento', dados);

// Em app.js (frontend)
socket.on('novo-evento', (dados) => {
  // Handler
});
```

## 📈 Escalabilidade

### Limitações Atuais
- ❌ Um bot por instância
- ❌ Sem banco de dados
- ❌ Estado em memória
- ❌ Sem fila de mensagens

### Melhorias Futuras
- ✅ Multi-instância com Redis
- ✅ Banco de dados (MongoDB/PostgreSQL)
- ✅ Queue system (Bull, RabbitMQ)
- ✅ Load balancing
- ✅ Microservices architecture

## 🔍 Monitoramento

### Pontos de Observabilidade
1. **Logs**
   - Console logs estruturados
   - Eventos importantes registrados

2. **Métricas**
   - Mensagens processadas
   - Taxa de resposta
   - Tempo de resposta

3. **Saúde**
   - Status da conexão
   - Estado do bot
   - Uptime

## 🛠️ Tecnologias e Padrões

### Padrões Utilizados
- **Event-Driven Architecture** - Eventos assíncronos
- **State Machine** - Gerenciamento de estado
- **Singleton** - Cliente WhatsApp único
- **Observer** - Socket.IO listeners
- **Strategy** - Processamento de comandos

### Princípios SOLID
- ✅ Single Responsibility
- ✅ Open/Closed
- ✅ Dependency Inversion

---

**Esta arquitetura foi projetada para ser:**
- 🎯 Simples e clara
- 🔧 Fácil de manter
- 📈 Preparada para crescer
- 🔒 Segura por design
- 📚 Bem documentada

