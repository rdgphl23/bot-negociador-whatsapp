# 🧪 Guia de Testes

Este documento contém cenários de teste para validar o funcionamento do bot.

## 📱 Testes Manuais

### Pré-requisitos
- Bot autenticado e conectado
- Número de teste disponível para enviar mensagens

## ✅ Cenários de Teste

### 1. Teste de Saudação

**Entrada:** `olá`

**Saída Esperada:**
```
🤖 Olá! Bem-vindo ao Bot Negociador

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

Digite o número da opção desejada (1, 2 ou 3)
Digite "ajuda" para mais informações
```

**Status:** ✅ Passou | ❌ Falhou

---

### 2. Teste de Seleção - Opção 1

**Pré-requisito:** Ter enviado "olá" antes

**Entrada:** `1`

**Saída Esperada:**
```
✅ Opção 1 selecionada!

📋 Contrato: 12345
📊 Forma de pagamento: À vista com 20% de desconto
💵 Valor total: R$ 1.000,00

✨ Próximos passos:
Em uma implementação completa, aqui seria gerado:
- Link de pagamento PIX ou boleto
- Código de barras para pagamento
- Confirmação por e-mail

Digite "menu" para ver outras opções
Digite "ajuda" para suporte
```

**Status:** ✅ Passou | ❌ Falhou

---

### 3. Teste de Seleção - Opção 2

**Pré-requisito:** Ter enviado "olá" antes

**Entrada:** `2`

**Saída Esperada:**
```
✅ Opção 2 selecionada!

📋 Contrato: 12345
📊 Forma de pagamento: Parcelado em 3x com 10% de desconto
💵 Valor total: R$ 1.125,00
🔢 Parcelas: 3x de R$ 375,00

✨ Próximos passos:
[...]
```

**Status:** ✅ Passou | ❌ Falhou

---

### 4. Teste de Seleção - Opção 3

**Pré-requisito:** Ter enviado "olá" antes

**Entrada:** `3`

**Saída Esperada:**
```
✅ Opção 3 selecionada!

📋 Contrato: 12345
📊 Forma de pagamento: Parcelado em 6x sem juros
💵 Valor total: R$ 1.250,00
🔢 Parcelas: 6x de R$ 208,33

✨ Próximos passos:
[...]
```

**Status:** ✅ Passou | ❌ Falhou

---

### 5. Teste de Comando Menu

**Entrada:** `menu`

**Saída Esperada:** Mesmo output do teste 1 (menu completo)

**Status:** ✅ Passou | ❌ Falhou

---

### 6. Teste de Comando Ajuda

**Entrada:** `ajuda`

**Saída Esperada:**
```
📖 Central de Ajuda

Comandos disponíveis:

🔹 olá - Iniciar atendimento
🔹 menu - Ver opções de pagamento
🔹 1, 2 ou 3 - Selecionar opção
🔹 ajuda - Mostrar esta mensagem

Dúvidas sobre pagamento?
Entre em contato com nosso suporte:
📧 suporte@exemplo.com
📱 (11) 9999-9999

Este é um bot de demonstração
```

**Status:** ✅ Passou | ❌ Falhou

---

### 7. Teste de Mensagem Inválida

**Entrada:** `xyz123`

**Saída Esperada:**
```
Desculpe, não entendi sua mensagem. 😕

Digite "olá" para iniciar o atendimento.
Digite "menu" para ver as opções.
Digite "ajuda" para obter ajuda.
```

**Status:** ✅ Passou | ❌ Falhou

---

### 8. Teste de Seleção Sem Contexto

**Entrada:** `1` (sem ter enviado "olá" antes)

**Saída Esperada:**
```
Por favor, digite "olá" para iniciar o atendimento.
```

**Status:** ✅ Passou | ❌ Falhou

---

### 9. Teste de Variações de Saudação

**Entradas a testar:**
- `oi`
- `Olá`
- `OLÁ`
- `bom dia`
- `boa tarde`
- `boa noite`
- `hey`

**Saída Esperada:** Todas devem retornar o menu inicial

**Status:** ✅ Passou | ❌ Falhou

---

## 🖥️ Testes do Dashboard

### 1. Autenticação

**Teste:** Acessar `http://localhost:3000` sem credenciais

**Esperado:** Popup de autenticação HTTP Basic

**Status:** ✅ Passou | ❌ Falhou

---

### 2. Login com Credenciais Corretas

**Teste:** Usar as credenciais definidas no `.env`

**Esperado:** Acesso ao dashboard

**Status:** ✅ Passou | ❌ Falhou

---

### 3. Login com Credenciais Incorretas

**Teste:** Usar credenciais erradas

**Esperado:** Acesso negado

**Status:** ✅ Passou | ❌ Falhou

---

### 4. Exibição de QR Code

**Teste:** Dashboard quando não autenticado

**Esperado:** QR Code visível e escaneável

**Status:** ✅ Passou | ❌ Falhou

---

### 5. Status da Conexão

**Teste:** Observar mudanças de status

**Esperado:** Badge de status atualiza conforme conecta

**Status:** ✅ Passou | ❌ Falhou

---

### 6. Mensagens em Tempo Real

**Teste:** Enviar mensagem pelo WhatsApp

**Esperado:** 
- Mensagem aparece no dashboard instantaneamente
- Resposta do bot aparece em seguida
- Contador atualiza

**Status:** ✅ Passou | ❌ Falhou

---

### 7. Sanitização de Números

**Teste:** Verificar números nos logs do dashboard

**Esperado:** Números aparecem como `+55 (11) ****-**21`

**Status:** ✅ Passou | ❌ Falhou

---

### 8. Scroll Automático

**Teste:** Enviar múltiplas mensagens

**Esperado:** Dashboard faz scroll automático para última mensagem

**Status:** ✅ Passou | ❌ Falhou

---

## 🔒 Testes de Segurança

### 1. Arquivo .env não Commitado

**Teste:** Verificar `.gitignore`

**Esperado:** `.env` está listado

**Status:** ✅ Passou | ❌ Falhou

---

### 2. Pasta .wwebjs_auth não Commitada

**Teste:** Verificar `.gitignore`

**Esperado:** `.wwebjs_auth/` está listado

**Status:** ✅ Passou | ❌ Falhou

---

### 3. XSS Protection

**Teste:** Enviar mensagem com HTML: `<script>alert('xss')</script>`

**Esperado:** HTML é escapado e exibido como texto

**Status:** ✅ Passou | ❌ Falhou

---

### 4. Variáveis de Ambiente

**Teste:** Verificar se credenciais estão em variáveis de ambiente

**Esperado:** Nenhuma senha hardcoded no código

**Status:** ✅ Passou | ❌ Falhou

---

## 📊 Checklist de Validação Final

Antes de entregar o desafio:

- [ ] Todos os testes manuais passaram
- [ ] Dashboard funciona corretamente
- [ ] Autenticação está funcionando
- [ ] Mensagens aparecem em tempo real
- [ ] QR Code é exibido corretamente
- [ ] Status atualiza conforme esperado
- [ ] `.env` não está commitado
- [ ] `.wwebjs_auth/` não está commitado
- [ ] README.md está completo
- [ ] Código está comentado adequadamente
- [ ] Não há senhas hardcoded
- [ ] Números são sanitizados nos logs

## 🐛 Reportar Problemas

Se algum teste falhar:

1. Verifique os logs do servidor
2. Verifique o console do navegador
3. Confirme que o WhatsApp está conectado
4. Tente reiniciar o servidor
5. Delete `.wwebjs_auth/` e reconecte

## 📝 Notas

- Mensagens de grupo são ignoradas pelo bot
- Bot responde apenas a mensagens diretas
- Delay de 1-2 segundos é normal (simula comportamento humano)
- QR Code expira em ~45 segundos

---

**Data do último teste:** ___/___/____

**Testado por:** _________________

**Resultado geral:** ✅ Aprovado | ❌ Reprovado

