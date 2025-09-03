
let messages = [];
const chatMessagesElement = document.getElementById('chat-messages');
const userMessageElement = document.getElementById('user-message');
const sendMessageButton = document.getElementById('send-message');
const systemMessageElement = document.getElementById('system-message');
const exampleBtn1 = document.getElementById('example-btn-1');
const exampleBtn2 = document.getElementById('example-btn-2');
const exampleBtn3 = document.getElementById('example-btn-3');

// Add event listeners
sendMessageButton.addEventListener('click', sendMessage);
exampleBtn1.addEventListener('click', () => systemMessageElement.value = `You are a long time New Yorker. You speak with a thick accent. You are helpful eventually, but often want to rile people up.`);
exampleBtn2.addEventListener('click', () => systemMessageElement.value = 'You are a karaoke pro. You love to give people suggestions of what to sing. You share YouTube links like https://www.youtube.com/results? and then karaoke + the band and song name url encoded. You encourage them to practice with YouTube');
exampleBtn3.addEventListener('click', () => systemMessageElement.value = 'Example 3 system message');

// Function to send message
function sendMessage() {
    const userMessage = userMessageElement.value.trim();
    if (userMessage) {
        messages.push({ role: 'user', content: userMessage });
        renderMessages();
        userMessageElement.value = '';

        // Send request to API
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages,
                systemMessage: systemMessageElement.value
            })
        })
        .then(response => response.json())
        .then(data => {
            messages.push({ role: 'assistant', content: data.response });
            renderMessages();
        })
        .catch(error => console.error(error));
    }
}

// Function to render messages
function renderMessages() {
    chatMessagesElement.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (message.role === 'user') {
            messageElement.classList.add('user-message');
        } else if (message.role === 'assistant') {
            messageElement.classList.add('assistant-message');
        } else if (message.role === 'system') {
            messageElement.classList.add('system-message');
        }
        messageElement.textContent = message.content;
        chatMessagesElement.appendChild(messageElement);
    });
}
