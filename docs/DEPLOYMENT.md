# 🚀 Guia de Deploy

Este documento explica como fazer deploy do WhatsApp Bot Negociador em diferentes plataformas.

## ⚠️ Considerações Importantes

### Antes do Deploy

1. **WhatsApp Session Persistence**
   - A sessão do WhatsApp é armazenada em `.wwebjs_auth/`
   - É necessário persistir esta pasta entre restarts
   - Use volumes Docker ou storage persistente

2. **Chromium/Puppeteer**
   - O bot usa Puppeteer para controlar o WhatsApp Web
   - Certifique-se que o ambiente suporta Chromium
   - Pode ser necessário instalar dependências extras

3. **Variáveis de Ambiente**
   - Configure todas as variáveis de ambiente na plataforma
   - Nunca commite o arquivo `.env`
   - Use senhas fortes em produção

## 🐳 Docker

### Dockerfile

Crie um `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:18-alpine

# Instalar dependências do Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Definir Puppeteer para usar o Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Criar diretório da aplicação
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Criar diretório para sessão (será um volume)
RUN mkdir -p .wwebjs_auth

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  whatsapp-bot:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
    volumes:
      # Persistir sessão do WhatsApp
      - whatsapp-session:/app/.wwebjs_auth
    restart: unless-stopped

volumes:
  whatsapp-session:
```

### Comandos Docker

```bash
# Build da imagem
docker-compose build

# Iniciar container
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar container
docker-compose down

# Parar e remover volumes (reset de sessão)
docker-compose down -v
```

## ☁️ Heroku

### Pré-requisitos
- Conta no Heroku
- Heroku CLI instalado

### Buildpacks Necessários

```bash
heroku buildpacks:add --index 1 heroku/nodejs
heroku buildpacks:add --index 2 jontewks/puppeteer
```

### Procfile

Crie um arquivo `Procfile`:

```
web: npm start
```

### Deploy

```bash
# Login no Heroku
heroku login

# Criar app
heroku create seu-bot-negociador

# Configurar variáveis de ambiente
heroku config:set DASHBOARD_USER=seu_usuario
heroku config:set DASHBOARD_PASSWORD=uma_senha_muito_segura
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

### ⚠️ Limitações do Heroku

- Filesystem efêmero (sessão pode ser perdida em restart)
- Requer add-on para storage persistente
- Dynos gratuitos dormem após 30min de inatividade

## 🚂 Railway

### Deploy via CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Deploy
railway up

# Configurar variáveis
railway variables set DASHBOARD_USER=seu_usuario
railway variables set DASHBOARD_PASSWORD=uma_senha_muito_segura
```

### Deploy via GitHub

1. Conecte seu repositório ao Railway
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push

### Configuração

No dashboard do Railway:
- **Variáveis:** Configure todas do `.env.example`
- **Volume:** Monte em `/app/.wwebjs_auth` (se disponível)

## 🔷 Render

### render.yaml

Crie um arquivo `render.yaml`:

```yaml
services:
  - type: web
    name: whatsapp-bot-negociador
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: DASHBOARD_USER
        value: seu_usuario
      - key: DASHBOARD_PASSWORD
        generateValue: true
      - key: NODE_ENV
        value: production
    disk:
      name: whatsapp-session
      mountPath: /app/.wwebjs_auth
      sizeGB: 1
```

### Deploy Manual

1. Vá para render.com
2. New → Web Service
3. Conecte seu repositório
4. Configure as variáveis de ambiente
5. Adicione disco persistente em `/app/.wwebjs_auth`
6. Deploy

## ☁️ AWS EC2

### Setup da Instância

```bash
# Conectar via SSH
ssh -i sua-chave.pem ubuntu@seu-ip

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar dependências do Chromium
sudo apt-get install -y \
    gconf-service libasound2 libatk1.0-0 libc6 libcairo2 \
    libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 \
    libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
    libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
    libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
    libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
    libxrender1 libxss1 libxtst6 ca-certificates \
    fonts-liberation libappindicator1 libnss3 lsb-release \
    xdg-utils wget chromium-browser

# Clonar repositório
git clone https://github.com/seu-usuario/whatsapp-bot-negociador.git
cd whatsapp-bot-negociador

# Instalar dependências
npm install

# Configurar .env
nano .env
# (Cole as configurações)

# Instalar PM2
sudo npm install -g pm2

# Iniciar aplicação
pm2 start src/server.js --name whatsapp-bot

# Configurar para iniciar no boot
pm2 startup
pm2 save

# Configurar Nginx (opcional)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/whatsapp-bot
```

### Configuração Nginx

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/whatsapp-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Instalar SSL com Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 🌐 VPS Genérico (DigitalOcean, Linode, etc)

### Setup Rápido

```bash
# Como root ou sudo

# 1. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 2. Instalar dependências do Chromium
apt-get install -y chromium-browser

# 3. Criar usuário
adduser botuser
usermod -aG sudo botuser
su - botuser

# 4. Clonar e configurar
git clone https://github.com/seu-usuario/whatsapp-bot-negociador.git
cd whatsapp-bot-negociador
npm install
cp .env.example .env
nano .env

# 5. Instalar PM2 e iniciar
npm install -g pm2
pm2 start src/server.js --name whatsapp-bot
pm2 startup
pm2 save
```

## 📊 Monitoramento

### PM2 Monitoring

```bash
# Status
pm2 status

# Logs
pm2 logs

# Monitoramento em tempo real
pm2 monit

# Restart
pm2 restart whatsapp-bot

# Stop
pm2 stop whatsapp-bot
```

### Logs Estruturados

Para produção, considere adicionar Winston:

```bash
npm install winston
```

## 🔐 Checklist de Segurança

Antes de colocar em produção:

- [ ] Senha forte configurada
- [ ] HTTPS configurado (SSL/TLS)
- [ ] Firewall configurado (apenas portas necessárias)
- [ ] SSH com chave, não senha
- [ ] Rate limiting configurado
- [ ] Logs estruturados
- [ ] Backup da sessão WhatsApp
- [ ] Monitoramento ativo
- [ ] Variáveis de ambiente seguras
- [ ] Atualizações automáticas de segurança

## 🆘 Troubleshooting

### Chromium não encontrado

```bash
# Instalar dependências manualmente
apt-get install -y chromium-browser

# Ou definir path customizado
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### Sessão perdida após restart

```bash
# Verificar se volume está montado
docker volume ls

# Ou usar storage persistente na plataforma
```

### Memória insuficiente

```bash
# Aumentar swap (Linux)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 📚 Recursos

- [Heroku Node.js Docs](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [PM2 Docs](https://pm2.keymetrics.io/)
- [Docker Docs](https://docs.docker.com/)

---

**Boa sorte com o deploy!** 🚀

