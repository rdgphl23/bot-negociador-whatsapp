# ❓ Perguntas Frequentes (FAQ)

## 📱 Sobre o WhatsApp

### P: Posso usar meu número principal?
**R:** Não é recomendado. O WhatsApp pode banir contas que usam APIs não oficiais. Use um número de teste.

### P: O bot funciona com WhatsApp Business?
**R:** Não. Este bot usa a biblioteca `whatsapp-web.js` que funciona apenas com contas pessoais do WhatsApp.

### P: Preciso manter o celular conectado?
**R:** Não. Após autenticar via QR Code, o bot funciona independentemente. O celular pode ficar offline.

### P: O bot responde mensagens de grupos?
**R:** Não. O bot está configurado para ignorar mensagens de grupos e status, respondendo apenas mensagens diretas.

### P: Quantos dispositivos posso conectar?
**R:** Um por instância do bot. Para múltiplas conexões, você precisaria de múltiplas instâncias.

## 🔐 Sobre Segurança

### P: É seguro usar este bot?
**R:** Para fins educacionais e testes, sim. Para produção, revise todas as práticas de segurança no [SECURITY.md](SECURITY.md).

### P: Minhas mensagens ficam salvas?
**R:** Não. As mensagens ficam apenas em memória durante a execução. Ao reiniciar o servidor, o histórico é perdido.

### P: Como protejo o dashboard?
**R:** O dashboard já tem autenticação HTTP Basic Auth. Configure uma senha forte no arquivo `.env`.

### P: Alguém pode acessar minha sessão do WhatsApp?
**R:** Não, desde que você não commite a pasta `.wwebjs_auth/` no Git. Ela já está no `.gitignore`.

### P: O bot é compatível com LGPD?
**R:** O código sanitiza dados sensíveis, mas você é responsável por obter consentimento dos usuários e seguir as leis aplicáveis.

## 🛠️ Instalação e Setup

### P: Quais são os requisitos mínimos?
**R:** 
- Node.js 16 ou superior
- 2GB RAM
- Conexão com internet
- Windows, Linux ou macOS

### P: Preciso instalar o Chromium separadamente?
**R:** Não. O Puppeteer (usado pelo whatsapp-web.js) baixa o Chromium automaticamente.

### P: O setup demora muito?
**R:** A instalação das dependências leva 2-5 minutos, dependendo da sua conexão.

### P: Posso usar Yarn em vez de NPM?
**R:** Sim! Todos os comandos NPM podem ser substituídos por Yarn.

```bash
# NPM
npm install
npm start

# Yarn
yarn install
yarn start
```

## 🐛 Problemas Comuns

### P: QR Code não aparece no dashboard
**R:** 
1. Verifique se o servidor está rodando (veja o console)
2. Aguarde alguns segundos (pode demorar 10-15s)
3. Recarregue a página
4. Verifique se tem erros no console do navegador

### P: "Authentication failure"
**R:** 
1. Delete a pasta `.wwebjs_auth/`
2. Reinicie o servidor
3. Escaneie o QR Code novamente

### P: Bot não responde mensagens
**R:** 
1. Verifique se o status está "ready" no dashboard
2. Confira que não é mensagem de grupo
3. Digite exatamente "olá" (sem acentos funcionais também)
4. Veja os logs do servidor para erros

### P: Erro "Port already in use"
**R:** 
1. Finalize outros processos na porta 3000
2. Ou altere `PORT=3001` no arquivo `.env`

### P: Erro "Cannot find module"
**R:** 
```bash
rm -rf node_modules
npm install
```

### P: QR Code expira antes de escanear
**R:** Normal. Um novo QR Code será gerado automaticamente em ~45 segundos.

### P: Sessão desconecta sozinha
**R:** Pode acontecer por:
- Perda de conexão com internet
- WhatsApp detectou uso não oficial
- Servidor reiniciado
- Solução: Escaneie QR Code novamente

## 💻 Desenvolvimento

### P: Como adicionar novos comandos?
**R:** Edite `src/bot/negotiation-flow.js`:

```javascript
processMessage(userId, message) {
  if (message === 'meu_comando') {
    return this.meuNovoMetodo(userId);
  }
  // ... resto do código
}
```

### P: Como mudar as opções de negociação?
**R:** Edite o objeto `contracts` em `src/bot/negotiation-flow.js`

### P: Como adicionar um banco de dados?
**R:** 
1. Instale MongoDB/PostgreSQL
2. Conecte no `server.js`
3. Modifique `whatsapp-bot.js` para salvar mensagens
4. Veja exemplos em [DEPLOYMENT.md](DEPLOYMENT.md)

### P: Como fazer deploy?
**R:** Consulte [DEPLOYMENT.md](DEPLOYMENT.md) com guias para:
- Heroku
- Railway
- Render
- AWS EC2
- Docker
- VPS genérico

### P: Posso usar TypeScript?
**R:** Sim! Você precisará:
1. Converter os arquivos .js para .ts
2. Configurar tsconfig.json
3. Adicionar tipos para as dependências

## 🎨 Interface

### P: Como personalizar as cores?
**R:** Edite as variáveis CSS em `src/public/styles.css`:

```css
:root {
  --primary-color: #25D366;  /* Verde WhatsApp */
  --secondary-color: #128C7E;
  /* ... outras cores */
}
```

### P: O dashboard é responsivo?
**R:** Sim! Funciona em desktop, tablet e mobile.

### P: Posso adicionar funcionalidade de enviar mensagens?
**R:** Sim! Você precisaria:
1. Adicionar um input no HTML
2. Criar rota POST no servidor
3. Usar `client.sendMessage()` no whatsapp-bot.js

### P: Como adicionar dark mode?
**R:** 
1. Adicione toggle no HTML
2. Crie variáveis CSS para tema escuro
3. Use JavaScript para alternar classes

## 📊 Performance

### P: Quantas mensagens o bot aguenta?
**R:** Depende do hardware, mas facilmente centenas por minuto.

### P: Qual o consumo de memória?
**R:** ~200-300MB em operação normal (principalmente pelo Chromium).

### P: Posso processar mensagens em paralelo?
**R:** Não é necessário. O bot já processa mensagens assincronamente.

### P: Como escalar para múltiplos atendentes?
**R:** Você precisaria:
- Sistema de filas (Redis, RabbitMQ)
- Banco de dados compartilhado
- Load balancer
- Veja roadmap no README

## 🔄 Atualização

### P: Como atualizar as dependências?
**R:** 
```bash
npm update
# ou para major updates
npm outdated
npm install package@latest
```

### P: Novas versões quebram a aplicação?
**R:** Sempre teste em ambiente de desenvolvimento primeiro.

### P: Como fazer backup da sessão?
**R:** 
```bash
# Backup
cp -r .wwebjs_auth .wwebjs_auth_backup

# Restaurar
rm -rf .wwebjs_auth
cp -r .wwebjs_auth_backup .wwebjs_auth
```

## 📝 Customização

### P: Posso mudar o idioma?
**R:** Sim! Todos os textos estão hardcoded. Busque e substitua as strings.

### P: Como adicionar mais dados ao contrato?
**R:** Edite o objeto `contracts` em `negotiation-flow.js` e ajuste as mensagens.

### P: Posso integrar com API externa?
**R:** Sim! Use `fetch` ou `axios` dentro dos métodos do bot.

### P: Como adicionar validação de CPF?
**R:** 
```javascript
validateCPF(cpf) {
  // Sua lógica de validação
  return true/false;
}

// Use no processMessage
if (!this.validateCPF(message)) {
  return 'CPF inválido';
}
```

## 🚀 Deploy

### P: Qual plataforma recomenda?
**R:** Para testes: Railway ou Render (free tier)
Para produção: AWS EC2 ou DigitalOcean

### P: Preciso de HTTPS?
**R:** Para produção, sim. Use Let's Encrypt (gratuito).

### P: Como garantir uptime 24/7?
**R:** 
- Use PM2 para auto-restart
- Configure monitoring (UptimeRobot)
- Use plataforma cloud confiável

### P: Quanto custa hospedar?
**R:** 
- Heroku/Railway/Render: $0-7/mês (free tier limitado)
- VPS (DigitalOcean): $5-10/mês
- AWS EC2 t2.micro: $0-10/mês

## 🧪 Testes

### P: Tem testes automatizados?
**R:** Não na v1.0. Planejado para v1.1 (veja CHANGELOG.md)

### P: Como testar sem WhatsApp real?
**R:** Atualmente não há mock. Você precisa de um número real.

### P: Posso automatizar os testes?
**R:** Sim! Use:
- Jest para testes unitários
- Supertest para testes de API
- Puppeteer para testes E2E

## 🎓 Aprendizado

### P: Onde aprender mais sobre whatsapp-web.js?
**R:** 
- [Documentação oficial](https://wwebjs.dev/)
- [GitHub do projeto](https://github.com/pedroslopez/whatsapp-web.js)

### P: Onde aprender sobre Socket.IO?
**R:** [Socket.IO Documentation](https://socket.io/docs/v4/)

### P: Este projeto é bom para portfólio?
**R:** Sim! Demonstra:
- Node.js
- WebSocket
- Event-driven architecture
- Frontend/Backend integration
- Documentação profissional

## 📜 Licença

### P: Posso usar comercialmente?
**R:** A licença MIT permite, MAS o uso de API não oficial do WhatsApp pode violar ToS do WhatsApp. Use por sua conta e risco.

### P: Preciso dar crédito?
**R:** Apreciado mas não obrigatório (MIT License).

### P: Posso modificar o código?
**R:** Sim! MIT License permite modificação livre.

## 🆘 Suporte

### P: Onde reportar bugs?
**R:** Abra uma issue no GitHub com:
- Descrição do problema
- Passos para reproduzir
- Versão do Node.js
- Sistema operacional
- Logs de erro

### P: Onde sugerir melhorias?
**R:** Abra uma issue com label "enhancement" no GitHub.

### P: Posso contribuir?
**R:** Sim! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para guidelines.

### P: Tem comunidade/Discord?
**R:** Este é um projeto individual para desafio. Para whatsapp-web.js, veja o GitHub oficial.

---

## 🔗 Links Úteis

- [README Principal](README.md)
- [Guia de Início Rápido](QUICK_START.md)
- [Segurança](SECURITY.md)
- [Testes](TESTING.md)
- [Deploy](DEPLOYMENT.md)
- [Arquitetura](ARQUITETURA.md)

---

**Não encontrou sua pergunta?** Abra uma issue no GitHub! 💬

