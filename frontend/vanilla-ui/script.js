document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const tabs = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const messagesArea = document.getElementById('messages-area');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const aiStateLabel = document.getElementById('ai-state-label');
    const orbOuter = document.getElementById('orb-outer');
    const orbStatusText = document.getElementById('orb-status-text');
    const engineStatus = document.getElementById('engine-status');

    let ws = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    // Tab Switching Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            
            // Update Tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update Sections
            sections.forEach(s => {
                s.classList.remove('active');
                if (s.id === `${targetId}-section`) {
                    s.classList.add('active');
                }
            });
        });
    });

    // WebSocket Initialization
    function connect() {
        ws = new WebSocket('ws://localhost:8080/ws/chat');

        ws.onopen = () => {
            console.log('Connected to JARVIS Core Engine');
            engineStatus.textContent = 'Online';
            engineStatus.classList.add('online');
            updateAIState('idle');
            reconnectAttempts = 0;
        };

        ws.onmessage = (event) => {
            const data = event.data;
            handleJarvisResponse(data);
        };

        ws.onclose = () => {
            console.log('Disconnected from JARVIS Core Engine');
            engineStatus.textContent = 'Offline';
            engineStatus.classList.remove('online');
            
            if (reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                console.log(`Reconnecting attempt ${reconnectAttempts}...`);
                setTimeout(connect, 3000);
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket Error:', err);
            updateAIState('idle');
        };
    }

    // Handle Messages
    function handleJarvisResponse(data) {
        let intent = 'general';
        let text = data;

        const intentMatch = data.match(/^\[(.*?)\]\sJARVIS:\s(.*)/);
        if (intentMatch) {
            intent = intentMatch[1].toLowerCase();
            text = intentMatch[2];
        }

        addMessage('jarvis', text, intent);
        updateAIState('speaking');
        
        // Return to idle after delay
        setTimeout(() => updateAIState('idle'), 3000);
    }

    function addMessage(sender, text, intent = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        if (intent && sender === 'jarvis') {
            const intentDiv = document.createElement('div');
            intentDiv.classList.add('intent-tag');
            intentDiv.textContent = `[${intent}]`;
            contentDiv.appendChild(intentDiv);
        }

        const textDiv = document.createElement('div');
        textDiv.classList.add('text');
        textDiv.textContent = text;
        contentDiv.appendChild(textDiv);

        messageDiv.appendChild(contentDiv);
        messagesArea.appendChild(messageDiv);

        // Scroll to bottom
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;

        addMessage('user', text);
        ws.send(text);
        chatInput.value = '';
        updateAIState('thinking');
    }

    // AI State Management
    function updateAIState(state) {
        // Update Label
        aiStateLabel.textContent = state.toUpperCase();
        orbStatusText.textContent = state === 'idle' ? 'SYSTEM READY' : state.toUpperCase();

        // Update Orb Classes
        orbOuter.className = 'orb-outer ' + state;
        
        // Handle State Colors/Effects
        switch(state) {
            case 'idle':
                aiStateLabel.style.color = 'var(--accent-cyan)';
                aiStateLabel.style.borderColor = 'rgba(6, 182, 212, 0.2)';
                break;
            case 'thinking':
                aiStateLabel.style.color = '#8b5cf6';
                aiStateLabel.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                break;
            case 'listening':
                aiStateLabel.style.color = '#10b981';
                aiStateLabel.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                break;
            case 'speaking':
                aiStateLabel.style.color = 'var(--accent-neon)';
                aiStateLabel.style.borderColor = 'rgba(14, 165, 233, 0.2)';
                break;
        }
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    micBtn.addEventListener('click', () => {
        // Toggle listening state
        if (orbOuter.classList.contains('listening')) {
            updateAIState('idle');
        } else {
            updateAIState('listening');
            // Audio recording logic would go here
        }
    });

    // Start Connection
    connect();
});
