# Contribuindo com o Projeto

Obrigado por considerar contribuir com o WhatsApp Bot Negociador! 🎉

## 📋 Como Contribuir

### 1. Fork o Projeto

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/whatsapp-bot-negociador.git
cd whatsapp-bot-negociador

# Adicione o repositório original como upstream
git remote add upstream https://github.com/rdgphl23/bot-negociador-whatsapp/.git
```

### 2. Crie uma Branch

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma branch para sua feature/fix
git checkout -b feature/minha-nova-feature
# ou
git checkout -b fix/correcao-de-bug
```

### 3. Faça suas Alterações

- Escreva código limpo e legível
- Comente quando necessário
- Siga as convenções do projeto
- Teste suas alterações

### 4. Commit suas Alterações

Use mensagens de commit descritivas:

```bash
git add .
git commit -m "feat: adiciona funcionalidade X"
# ou
git commit -m "fix: corrige problema Y"
```

**Convenção de Commits:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações na documentação
- `style:` - Formatação, ponto e vírgula, etc
- `refactor:` - Refatoração de código
- `test:` - Adição de testes
- `chore:` - Atualização de dependências, build, etc

### 5. Push para seu Fork

```bash
git push origin feature/minha-nova-feature
```

### 6. Abra um Pull Request

1. Vá para o repositório original no GitHub
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Descreva suas alterações detalhadamente
5. Aguarde revisão

## 🎯 Áreas para Contribuir

### Funcionalidades Desejadas

- [ ] Sistema de agendamento de mensagens
- [ ] Integração com APIs de pagamento (PIX, boleto)
- [ ] Multi-atendimento (fila de mensagens)
- [ ] Painel administrativo avançado
- [ ] Relatórios e analytics
- [ ] Sistema de templates de mensagens
- [ ] Integração com CRM

### Melhorias de Código

- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Documentação de API (Swagger)
- [ ] Internacionalização (i18n)
- [ ] Logs estruturados
- [ ] Tratamento de erros robusto

### Infraestrutura

- [ ] Dockerização
- [ ] CI/CD com GitHub Actions
- [ ] Deploy automatizado
- [ ] Monitoramento e alertas

## 🧪 Testando

Antes de submeter seu PR:

```bash
# Instale as dependências
npm install

# Execute a aplicação
npm run dev

# Teste manualmente:
# 1. Autentique no WhatsApp
# 2. Envie mensagens de teste
# 3. Verifique o dashboard
# 4. Teste todos os fluxos
```

## 📝 Padrões de Código

### JavaScript

```javascript
// Use const/let, não var
const minhaConstante = 'valor';
let minhaVariavel = 'valor';

// Arrow functions quando apropriado
const minhaFuncao = () => {
  // código
};

// Async/await para operações assíncronas
async function buscarDados() {
  try {
    const dados = await api.get('/dados');
    return dados;
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Comentários claros
// Faz X porque Y
```

### Estrutura de Arquivos

```
src/
├── bot/           # Lógica do bot
├── public/        # Frontend
├── utils/         # Utilitários
└── server.js      # Servidor principal
```

## 🚫 O Que NÃO Fazer

- ❌ Commitar arquivos sensíveis (`.env`, `.wwebjs_auth/`)
- ❌ Commitar `node_modules/`
- ❌ Fazer commits muito grandes
- ❌ Misturar múltiplas funcionalidades em um PR
- ❌ Ignorar as convenções do projeto

## 📚 Recursos Úteis

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [whatsapp-web.js Guide](https://wwebjs.dev/)

## 💬 Dúvidas?

- Abra uma [issue](https://github.com/rdgphl23/repo/issues) para discussão
- Pergunte no PR
- Entre em contato com os mantenedores

## 🙏 Reconhecimento

Todos os contribuidores serão reconhecidos no README.

---

**Obrigado por contribuir!** 🎉

