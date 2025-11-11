// Inicializar Socket.IO
const socket = io();

// Estado da aplicação
const state = {
    status: 'initializing',
    receivedCount: 0,
    sentCount: 0,
    hasMessages: false
};

// Elementos do DOM
const elements = {
    statusBadge: document.getElementById('statusBadge'),
    qrCodeContainer: document.getElementById('qrCodeContainer'),
    messagesContainer: document.getElementById('messagesContainer'),
    receivedCount: document.getElementById('receivedCount'),
    sentCount: document.getElementById('sentCount'),
    qrSection: document.getElementById('qrSection')
};

// Status labels em português
const statusLabels = {
    initializing: 'Inicializando...',
    qr_received: 'Aguardando leitura do QR Code',
    authenticated: 'Autenticado',
    ready: 'Conectado e pronto',
    auth_failure: 'Falha na autenticação',
    disconnected: 'Desconectado'
};

// Atualizar status
function updateStatus(status) {
    state.status = status;
    elements.statusBadge.className = `status-badge ${status}`;
    elements.statusBadge.querySelector('.status-text').textContent = 
        statusLabels[status] || status;
}

// Mostrar QR Code
function showQRCode(qrDataUrl) {
    elements.qrCodeContainer.innerHTML = `
        <img src="${qrDataUrl}" alt="QR Code" />
    `;
}

// Mostrar mensagem de autenticado
function showAuthenticatedMessage() {
    elements.qrCodeContainer.innerHTML = `
        <div class="authenticated-message">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3>✅ Conectado!</h3>
            <p>Seu WhatsApp está autenticado e pronto para receber mensagens.</p>
        </div>
    `;
}

// Adicionar mensagem ao painel
function addMessage(message) {
    // Remover "no messages" se existir
    if (!state.hasMessages) {
        elements.messagesContainer.innerHTML = '';
        state.hasMessages = true;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;
    
    const isReceived = message.type === 'received';
    const contactName = isReceived ? message.from : message.to;
    const contactNumber = isReceived ? message.fromNumber : message.toNumber;
    const icon = isReceived ? '📥' : '📤';
    const label = isReceived ? 'De' : 'Para';
    
    // Formatar timestamp
    const timestamp = new Date(message.timestamp);
    const timeStr = timestamp.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="message-icon">${icon}</div>
            <div class="message-info">
                <div class="message-from">
                    ${label}: ${contactName}
                    ${contactNumber ? `<span style="color: var(--text-secondary); font-weight: 400; font-size: 12px;">(${contactNumber})</span>` : ''}
                </div>
                <div class="message-timestamp">${timeStr}</div>
            </div>
        </div>
        <div class="message-body">${escapeHtml(message.body)}</div>
    `;
    
    elements.messagesContainer.appendChild(messageDiv);
    
    // Scroll para o final
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    
    // Atualizar contadores
    if (isReceived) {
        state.receivedCount++;
        elements.receivedCount.textContent = state.receivedCount;
    } else {
        state.sentCount++;
        elements.sentCount.textContent = state.sentCount;
    }
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
}

// Mostrar toast notification
function showToast(message, type = 'info', description = '') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
            ${description ? `<div class="toast-description">${description}</div>` : ''}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remover após 5 segundos
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Event Listeners do Socket.IO
socket.on('connect', () => {
    console.log('Conectado ao servidor');
    showToast('Conectado ao servidor', 'success');
});

socket.on('disconnect', () => {
    console.log('Desconectado do servidor');
    showToast('Desconectado do servidor', 'error', 'Tentando reconectar...');
});

socket.on('status', (status) => {
    console.log('Status atualizado:', status);
    updateStatus(status);
    
    // Se autenticado, mostrar mensagem de sucesso
    if (status === 'ready' || status === 'authenticated') {
        showAuthenticatedMessage();
        showToast('WhatsApp autenticado!', 'success', 'Pronto para receber mensagens');
    }
});

socket.on('qr', (qrDataUrl) => {
    console.log('QR Code recebido');
    showQRCode(qrDataUrl);
    showToast('QR Code gerado', 'info', 'Escaneie com seu WhatsApp');
});

socket.on('authenticated', (data) => {
    console.log('Autenticado:', data);
    showAuthenticatedMessage();
    showToast('Autenticado com sucesso!', 'success');
});

socket.on('message', (message) => {
    console.log('Nova mensagem:', message);
    addMessage(message);
    
    // Notificação para mensagens recebidas
    if (message.type === 'received') {
        showToast('Nova mensagem recebida', 'info', `De: ${message.from}`);
    }
});

socket.on('error', (error) => {
    console.error('Erro:', error);
    showToast('Erro', 'error', error.message || 'Ocorreu um erro');
});

// Carregar status inicial ao carregar a página
window.addEventListener('load', () => {
    fetch('/api/status')
        .then(res => res.json())
        .then(data => {
            updateStatus(data.status);
            if (data.status === 'ready' || data.status === 'authenticated') {
                showAuthenticatedMessage();
            }
        })
        .catch(err => {
            console.error('Erro ao carregar status:', err);
        });
});

// Log de boas-vindas
console.log('%c🤖 WhatsApp Bot Negociador', 'font-size: 20px; font-weight: bold; color: #25D366;');
console.log('%cDashboard carregado com sucesso!', 'color: #666;');

