class NegotiationFlow {
  constructor() {
    // Armazenar estado da conversa por usuário
    this.userStates = new Map();
    
    // Dados fictícios de contratos para demonstração
    this.contracts = {
      default: {
        id: '12345',
        saldo: 1250.00,
        options: [
          { id: 1, desc: 'À vista com 20% de desconto', valor: 1000.00 },
          { id: 2, desc: '3x com 10% de desconto', valor: 1125.00, parcelas: 3 },
          { id: 3, desc: '6x sem juros', valor: 1250.00, parcelas: 6 }
        ]
      }
    };
  }

  processMessage(userId, message) {
    const normalizedMessage = message.trim().toLowerCase();
    
    // Comandos principais
    if (this.isGreeting(normalizedMessage)) {
      return this.handleGreeting(userId);
    }
    
    if (normalizedMessage === 'menu' || normalizedMessage === 'voltar') {
      return this.showMenu(userId);
    }
    
    if (normalizedMessage === 'ajuda' || normalizedMessage === 'help') {
      return this.showHelp();
    }
    
    // Verificar se é uma opção numérica
    if (/^[1-3]$/.test(normalizedMessage)) {
      return this.handleOptionSelection(userId, parseInt(normalizedMessage));
    }
    
    // Resposta padrão
    return this.defaultResponse();
  }

  isGreeting(message) {
    const greetings = ['ola', 'olá', 'oi', 'hey', 'bom dia', 'boa tarde', 'boa noite'];
    return greetings.some(greeting => message.includes(greeting));
  }

  handleGreeting(userId) {
    this.userStates.set(userId, { step: 'menu_shown' });
    return this.showMenu(userId);
  }

  showMenu(userId) {
    const contract = this.contracts.default;
    this.userStates.set(userId, { step: 'menu_shown', contract });
    
    return `🤖 *Olá! Bem-vindo ao Bot Negociador*

📋 *Contrato:* ${contract.id}
💰 *Saldo devedor:* R$ ${this.formatCurrency(contract.saldo)}

*Escolha uma opção de pagamento:*

*1️⃣* - À vista com *20% de desconto*
   Valor: R$ ${this.formatCurrency(contract.options[0].valor)}

*2️⃣* - Parcelado em *3x com 10% de desconto*
   Valor: R$ ${this.formatCurrency(contract.options[1].valor)}
   Parcelas: 3x de R$ ${this.formatCurrency(contract.options[1].valor / 3)}

*3️⃣* - Parcelado em *6x sem juros*
   Valor: R$ ${this.formatCurrency(contract.options[2].valor)}
   Parcelas: 6x de R$ ${this.formatCurrency(contract.options[2].valor / 6)}

_Digite o número da opção desejada (1, 2 ou 3)_
_Digite "ajuda" para mais informações_`;
  }

  handleOptionSelection(userId, optionId) {
    const userState = this.userStates.get(userId);
    
    if (!userState || userState.step !== 'menu_shown') {
      return 'Por favor, digite *"olá"* para iniciar o atendimento.';
    }
    
    const contract = userState.contract;
    const option = contract.options[optionId - 1];
    
    if (!option) {
      return 'Opção inválida. Por favor, escolha 1, 2 ou 3.';
    }
    
    // Atualizar estado
    this.userStates.set(userId, { 
      step: 'option_selected', 
      contract, 
      selectedOption: option 
    });
    
    return this.generateOptionSummary(option, contract.id);
  }

  generateOptionSummary(option, contractId) {
    let summary = `✅ *Opção ${option.id} selecionada!*\n\n`;
    summary += `📋 *Contrato:* ${contractId}\n`;
    summary += `📊 *Forma de pagamento:* ${option.desc}\n`;
    summary += `💵 *Valor total:* R$ ${this.formatCurrency(option.valor)}\n`;
    
    if (option.parcelas) {
      const valorParcela = option.valor / option.parcelas;
      summary += `🔢 *Parcelas:* ${option.parcelas}x de R$ ${this.formatCurrency(valorParcela)}\n`;
    }
    
    summary += `\n✨ *Próximos passos:*\n`;
    summary += `Em uma implementação completa, aqui seria gerado:\n`;
    summary += `- Link de pagamento PIX ou boleto\n`;
    summary += `- Código de barras para pagamento\n`;
    summary += `- Confirmação por e-mail\n\n`;
    summary += `_Digite "menu" para ver outras opções_\n`;
    summary += `_Digite "ajuda" para suporte_`;
    
    return summary;
  }

  showHelp() {
    return `📖 *Central de Ajuda*

*Comandos disponíveis:*

🔹 *olá* - Iniciar atendimento
🔹 *menu* - Ver opções de pagamento
🔹 *1, 2 ou 3* - Selecionar opção
🔹 *ajuda* - Mostrar esta mensagem

*Dúvidas sobre pagamento?*
Entre em contato com nosso suporte:
📧 suporte@exemplo.com
📱 (11) 9999-9999

_Este é um bot de demonstração_`;
  }

  defaultResponse() {
    return `Desculpe, não entendi sua mensagem. 😕

Digite *"olá"* para iniciar o atendimento.
Digite *"menu"* para ver as opções.
Digite *"ajuda"* para obter ajuda.`;
  }

  formatCurrency(value) {
    return value.toFixed(2).replace('.', ',');
  }

  // Limpar estados antigos (evitar vazamento de memória)
  clearOldStates() {
    // Em produção, implementar limpeza baseada em timestamp
    if (this.userStates.size > 1000) {
      this.userStates.clear();
    }
  }
}

module.exports = NegotiationFlow;

