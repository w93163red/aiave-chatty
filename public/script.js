// Get elements
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Initialize messages array
let messages = [];

// Function to render messages
function renderMessages() {
    chatMessages.innerHTML = '';
    messages.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.role);
        messageElement.textContent = message.content;
        chatMessages.appendChild(messageElement);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send message to API
async function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (userMessage) {
        messages.push({ role: 'user', content: userMessage });
        renderMessages();
        messageInput.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages }),
            });
            const data = await response.json();
            messages.push({ role: 'assistant', content: data.response });
            renderMessages();
        } catch (error) {
            console.error(error);
        }
    }
}

// Add event listener to send button
sendButton.addEventListener('click', sendMessage);

// Add event listener to message input (for Enter key)
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
