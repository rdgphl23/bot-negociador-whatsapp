# 🤖 WhatsApp Bot Negociador

Plataforma que transforma um número de WhatsApp em um bot negociador automatizado, utilizando a biblioteca não oficial `whatsapp-web.js`. O sistema exibe QR Code para autenticação, status da sessão e visualização de mensagens em tempo real.

> 📚 **[Documentação Completa](docs/INDEX.md)** - Acesse o índice completo da documentação

## 📋 Visão Geral

Este projeto implementa:
- Backend Node.js com Express
- Integração com WhatsApp via `whatsapp-web.js`
- Dashboard web com visualização em tempo real
- Sistema de autenticação básica
- Fluxo de negociação automatizado
- WebSocket para comunicação em tempo real

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **whatsapp-web.js** - API não oficial do WhatsApp
- **Socket.IO** - WebSocket para comunicação em tempo real
- **QRCode** - Geração de QR Code
- **dotenv** - Gerenciamento de variáveis de ambiente
- **express-basic-auth** - Autenticação HTTP Basic

### Frontend
- **HTML5/CSS3** - Interface responsiva
- **JavaScript (Vanilla)** - Lógica do cliente
- **Socket.IO Client** - Conexão WebSocket

## 🚀 Passo a Passo de Execução

### Pré-requisitos
- Node.js 16+ instalado
- NPM ou Yarn
- Conta do WhatsApp

### Opção A: Setup Automatizado (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/whatsapp-bot-negociador.git
cd whatsapp-bot-negociador

# Execute o script de setup
npm run setup

# Inicie o servidor
npm start
```

### Opção B: Setup Manual

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/whatsapp-bot-negociador.git
cd whatsapp-bot-negociador
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
PORT=3000
DASHBOARD_USER=admin
DASHBOARD_PASSWORD=sua_senha_segura_aqui
NODE_ENV=development
BOT_NAME=Bot Negociador
```

> ⚠️ **IMPORTANTE**: Altere a senha padrão antes de usar em produção!

### 4. Inicie o Servidor

**Modo desenvolvimento (com nodemon):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

### 5. Acesse o Dashboard

Abra seu navegador e acesse:
```
http://localhost:3000
```

Credenciais padrão:
- **Usuário**: admin
- **Senha**: admin123 (ou a que você configurou no `.env`)

### 6. Autentique seu WhatsApp

1. No dashboard, aguarde o QR Code aparecer
2. Abra o WhatsApp no seu celular
3. Vá em **Menu** → **Aparelhos conectados** → **Conectar um aparelho**
4. Escaneie o QR Code exibido no dashboard
5. Aguarde a confirmação de autenticação

### 7. Teste o Bot

Envie uma mensagem para o número autenticado:
- Digite **"olá"** para iniciar o atendimento
- O bot responderá com opções de negociação
- Digite **1**, **2** ou **3** para selecionar uma opção
- Digite **"menu"** para ver as opções novamente
- Digite **"ajuda"** para obter suporte

## 📡 Endpoints da API

### `GET /api/status`
Retorna o status atual da conexão do bot.

**Resposta:**
```json
{
  "status": "ready",
  "timestamp": "2024-11-10T12:00:00.000Z"
}
```

**Status possíveis:**
- `initializing` - Bot inicializando
- `qr_received` - QR Code gerado, aguardando leitura
- `authenticated` - WhatsApp autenticado
- `ready` - Bot pronto e operacional
- `auth_failure` - Falha na autenticação
- `disconnected` - Desconectado

### `GET /api/qr`
Retorna o QR Code em formato Data URL (base64).

**Resposta:**
```json
{
  "qr": "data:image/png;base64,..."
}
```

## 🔄 Fluxo do Bot

### 1. Saudação Inicial
**Usuário:** "olá"

**Bot:** Exibe menu com opções de pagamento do contrato

### 2. Seleção de Opção
**Usuário:** "1" (ou 2, 3)

**Bot:** Confirma a opção e exibe resumo da negociação

### 3. Comandos Auxiliares
- **"menu"** - Reexibe as opções de pagamento
- **"ajuda"** - Mostra comandos e informações de suporte

### Exemplo de Conversa

```
👤 Usuário: olá

🤖 Bot: Olá! Bem-vindo ao Bot Negociador

📋 Contrato: 12345
💰 Saldo devedor: R$ 1.250,00

Escolha uma opção de pagamento:

1️⃣ - À vista com 20% de desconto
   Valor: R$ 1.000,00

2️⃣ - Parcelado em 3x com 10% de desconto
   Valor: R$ 1.125,00
   Parcelas: 3x de R$ 375,00

3️⃣ - Parcelado em 6x sem juros
   Valor: R$ 1.250,00
   Parcelas: 6x de R$ 208,33

---

👤 Usuário: 1

🤖 Bot: ✅ Opção 1 selecionada!

📋 Contrato: 12345
📊 Forma de pagamento: À vista com 20% de desconto
💵 Valor total: R$ 1.000,00

✨ Próximos passos:
Em uma implementação completa, aqui seria gerado:
- Link de pagamento PIX ou boleto
- Código de barras para pagamento
- Confirmação por e-mail
```

## 🔒 Considerações de Segurança e Privacidade

### 🚨 CRÍTICO: Proteção de Dados Sensíveis

#### 1. Sessão do WhatsApp
- **NUNCA** commite a pasta `.wwebjs_auth/` no Git
- Esta pasta contém sua sessão autenticada do WhatsApp
- Se vazar, terceiros podem controlar sua conta
- ✅ Já configurado no `.gitignore`

#### 2. Variáveis de Ambiente
- Nunca exponha credenciais no código
- Use sempre o arquivo `.env` (já no `.gitignore`)
- Altere a senha padrão antes de usar

#### 3. Sanitização de Dados
- Números de telefone são sanitizados nos logs
- Exemplo: `+5511987654321` → `+5511****4321`
- Implementado em `src/bot/whatsapp-bot.js`

#### 4. Autenticação do Dashboard
- Dashboard protegido com HTTP Basic Auth
- Credenciais configuráveis via `.env`
- Recomendado: Use HTTPS em produção

#### 5. Dados Pessoais (LGPD)
- ⚠️ Este bot processa mensagens com dados pessoais
- **Uso recomendado:** Apenas para fins educacionais/testes
- Mensagens não são armazenadas em banco de dados
- Histórico só existe em memória durante execução

### 🛡️ Medidas de Segurança Implementadas

✅ Autenticação básica no dashboard
✅ Sanitização de números de telefone
✅ `.gitignore` configurado corretamente
✅ Variáveis de ambiente para credenciais
✅ Rate limiting implícito (delay entre mensagens)
✅ Proteção contra injeção de HTML (XSS) no frontend

## ⚠️ Limitações e Riscos

### API Não Oficial
- O WhatsApp pode detectar e **banir temporariamente** contas que usam APIs não oficiais
- Este projeto usa uma biblioteca de terceiros não endossada pelo WhatsApp
- **Risco:** Suspensão temporária ou permanente da conta
- **Recomendação:** Use um número de teste, não seu número principal

### Limitações Técnicas
- Não funciona com contas comerciais (WhatsApp Business API)
- Requer que o celular permaneça conectado à internet
- QR Code expira após alguns minutos
- Não suporta múltiplas sessões simultâneas

### Escalabilidade
- Limitado a um número/sessão por instância
- Histórico de mensagens armazenado apenas em memória
- Não possui banco de dados para persistência

## 🎯 Próximos Passos

### Melhorias Sugeridas

#### 1. Persistência de Dados
- [ ] Adicionar MongoDB/PostgreSQL para armazenar conversas
- [ ] Sistema de cache com Redis
- [ ] Histórico de negociações

#### 2. Funcionalidades Avançadas
- [ ] Integração com gateway de pagamento (PIX, boleto)
- [ ] Sistema de notificações por e-mail
- [ ] Relatórios e analytics
- [ ] Multi-atendimento (fila de mensagens)

#### 3. Segurança
- [ ] Implementar HTTPS com certificado SSL
- [ ] Autenticação com JWT
- [ ] Rate limiting robusto
- [ ] Logs estruturados (Winston/Bunyan)

#### 4. Infraestrutura
- [ ] Dockerização da aplicação
- [ ] CI/CD com GitHub Actions
- [ ] Deploy em cloud (AWS, Heroku, Railway)
- [ ] Monitoramento com Prometheus/Grafana

#### 5. UX/UI
- [ ] Painel administrativo completo
- [ ] Envio de mensagens pelo dashboard
- [ ] Estatísticas em tempo real
- [ ] Modo escuro

## 📁 Estrutura do Projeto

```
whatsapp-bot-negociador/
├── src/
│   ├── bot/
│   │   ├── whatsapp-bot.js      # Lógica principal do bot
│   │   └── negotiation-flow.js  # Fluxo de negociação
│   ├── public/
│   │   ├── index.html           # Dashboard HTML
│   │   ├── styles.css           # Estilos do dashboard
│   │   └── app.js               # Lógica do frontend
│   └── server.js                # Servidor Express
├── docs/                        # Documentação
│   ├── START_HERE.md            # Guia inicial
│   ├── QUICK_START.md           # Início rápido
│   ├── SECURITY.md              # Segurança
│   ├── TESTING.md               # Testes
│   ├── DEPLOYMENT.md            # Deploy
│   ├── ARQUITETURA.md           # Arquitetura
│   ├── CONTRIBUTING.md          # Contribuição
│   ├── CHANGELOG.md             # Histórico
│   ├── RESUMO_EXECUTIVO.md      # Resumo
│   ├── FAQ.md                   # Perguntas frequentes
│   └── INSTRUCOES_GITHUB.md     # GitHub
├── .gitignore                   # Arquivos ignorados pelo Git
├── .env.example                 # Exemplo de variáveis de ambiente
├── package.json                 # Dependências do projeto
├── setup.js                     # Script de setup
├── LICENSE                      # Licença MIT
└── README.md                    # Este arquivo
```

## 🐛 Troubleshooting

### Erro: "QR Code não aparece"
- Verifique se o Chromium está instalado corretamente
- Tente reiniciar o servidor
- Verifique os logs do console

### Erro: "Authentication failure"
- Delete a pasta `.wwebjs_auth/`
- Reinicie o servidor
- Escaneie um novo QR Code

### Bot não responde às mensagens
- Verifique se o status é "ready" no dashboard
- Confirme que a mensagem não é de grupo
- Veja os logs do servidor para erros

### Porta já em uso
- Altere a variável `PORT` no `.env`
- Ou finalize o processo que está usando a porta 3000

## 📄 Licença

Este projeto é open-source e está sob a licença MIT.

## ⚖️ Aviso Legal

Este projeto utiliza uma biblioteca **não oficial** do WhatsApp. O uso desta biblioteca pode violar os Termos de Serviço do WhatsApp. Use por sua conta e risco.

**Para uso educacional e de demonstração apenas.**

---

## 👨‍💻 Autor

Desenvolvido como parte de um desafio técnico.

**Repositório:** https://github.com/seu-usuario/whatsapp-bot-negociador

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através do GitHub.

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**

