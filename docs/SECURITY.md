# Política de Segurança

## 🔒 Dados Sensíveis

### ⚠️ CRÍTICO: Nunca Commitar

Os seguintes arquivos/pastas contêm dados sensíveis e **NUNCA** devem ser commitados:

- `.wwebjs_auth/` - Sessão autenticada do WhatsApp
- `.wwebjs_cache/` - Cache do WhatsApp
- `.env` - Variáveis de ambiente e credenciais

Estes já estão configurados no `.gitignore`, mas **verifique sempre** antes de fazer push.

## 🛡️ Práticas de Segurança

### 1. Autenticação do Dashboard

O dashboard está protegido com HTTP Basic Authentication. 

**Antes de usar em produção:**
1. Altere as credenciais padrão no arquivo `.env`
2. Use senhas fortes (mínimo 12 caracteres)
3. Considere implementar autenticação mais robusta (JWT, OAuth)

### 2. Proteção de Dados Pessoais

Este bot processa mensagens do WhatsApp, que podem conter dados pessoais.

**Conformidade LGPD:**
- Use apenas para fins educacionais ou com consentimento explícito
- Não armazene mensagens em banco de dados sem criptografia
- Implemente política de retenção de dados
- Informe aos usuários sobre coleta e processamento de dados

### 3. Sanitização de Dados

Números de telefone são automaticamente mascarados nos logs e no dashboard:
- `+5511987654321` → `+55 (11) ****-**21`
- Se o número não puder ser determinado, exibimos apenas o identificador interno (JID) parcialmente ofuscado.

**Em produção:**
- Implemente sanitização adicional para outros dados sensíveis
- Use ferramentas de log estruturado (Winston, Bunyan)
- Configure níveis de log apropriados

### 4. HTTPS em Produção

Para ambientes de produção:
```bash
# Use um proxy reverso (Nginx, Caddy)
# Ou configure HTTPS no Express
```

Exemplo com Nginx:
```nginx
server {
    listen 443 ssl;
    server_name seu-dominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
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

### 5. Variáveis de Ambiente

Nunca hardcode credenciais:

❌ **Errado:**
```javascript
const PASSWORD = 'admin123';
```

✅ **Correto:**
```javascript
const PASSWORD = process.env.DASHBOARD_PASSWORD;
```

## 🚨 Riscos Conhecidos

### API Não Oficial

- **Risco:** Banimento da conta WhatsApp
- **Mitigação:** Use número de teste, não seu número principal
- **Status:** Inerente à biblioteca `whatsapp-web.js`

### Exposição de Dados

- **Risco:** Vazamento de sessão WhatsApp
- **Mitigação:** `.gitignore` configurado, documentação clara
- **Status:** Protegido

### XSS (Cross-Site Scripting)

- **Risco:** Injeção de código malicioso via mensagens
- **Mitigação:** Sanitização de HTML implementada no frontend
- **Status:** Protegido

## 📊 Checklist de Segurança

Antes de colocar em produção, verifique:

- [ ] Senha do dashboard alterada e forte
- [ ] `.env` no `.gitignore`
- [ ] HTTPS configurado
- [ ] Firewall configurado (apenas portas necessárias)
- [ ] Rate limiting implementado
- [ ] Logs de segurança habilitados
- [ ] Backup da sessão WhatsApp configurado
- [ ] Política de privacidade implementada
- [ ] Consentimento dos usuários obtido
- [ ] Monitoramento de erros (Sentry, etc.)

## 🐛 Reportar Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança:

1. **NÃO** abra uma issue pública
2. Envie um e-mail para: [seu-email-de-seguranca]
3. Descreva a vulnerabilidade em detalhes
4. Inclua passos para reproduzir
5. Aguarde resposta em até 48h

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/esporte/pt-br/acesso-a-informacao/lgpd)
- [Boas Práticas Node.js](https://github.com/goldbergyoni/nodebestpractices)

---

**Última atualização:** Novembro 2025

