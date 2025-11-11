# 🚀 Guia de Início Rápido

## Instalação Express (5 minutos)

### 1. Clone e instale
```bash
git clone https://github.com/seu-usuario/whatsapp-bot-negociador.git
cd whatsapp-bot-negociador
npm install
```

### 2. Configure (opcional)
```bash
# Copie o .env.example para .env e edite se desejar
cp .env.example .env
```

### 3. Inicie
```bash
npm start
```

### 4. Acesse
```
http://localhost:3000
```

**Credenciais:** admin / admin123

### 5. Conecte seu WhatsApp
- Escaneie o QR Code que aparece
- Aguarde a confirmação
- Pronto! 🎉

## 📱 Teste o Bot

Envie mensagens para o número conectado:

1. **"olá"** → Ver menu
2. **"1"** → Selecionar opção 1
3. **"menu"** → Voltar ao menu
4. **"ajuda"** → Ver ajuda

## 🛑 Parar o Bot

```bash
# Pressione Ctrl+C no terminal
```

## 🔧 Troubleshooting Rápido

### Erro de porta em uso
```bash
# Edite o .env e mude PORT=3000 para PORT=3001
```

### QR Code não aparece
```bash
# Delete a sessão antiga e reinicie
rm -rf .wwebjs_auth
npm start
```

### Bot não responde
- Verifique se o status está "Conectado e pronto"
- Veja se não é mensagem de grupo
- Confira os logs no terminal

## 📚 Próximos Passos

- Leia o [README.md](README.md) completo
- Veja [SECURITY.md](SECURITY.md) para segurança
- Contribua! [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Precisa de ajuda?** Abra uma issue no GitHub!

