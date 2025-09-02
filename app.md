**Chatty Website Front-end**
==========================

### HTML (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatty</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="chat-container">
        <div class="chat-messages" id="chat-messages"></div>
        <input type="text" id="message-input" placeholder="Type a message...">
        <button id="send-button">Send</button>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### CSS (style.css)

```css
body {
    font-family: Arial, sans-serif;
}

.chat-container {
    width: 400px;
    height: 600px;
    margin: 40px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chat-messages {
    padding: 20px;
    overflow-y: auto;
    max-height: 400px;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.message.user {
    background-color: #f0f0f0;
    border-radius: 10px 10px 0 10px;
    align-self: flex-end;
}

.message.assistant {
    background-color: #e0e0e0;
    border-radius: 10px 10px 10px 0;
    align-self: flex-start;
}

#message-input {
    width: calc(100% - 100px);
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
}

#send-button {
    width: 80px;
    padding: 10px;
    font-size: 16px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#send-button:hover {
    background-color: #3e8e41;
}
```

### JavaScript (script.js)

```javascript
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
```

This code creates a simple chatbot website with a text input, send button, and a container to display messages. When the user types a message and clicks the send button or presses Enter, the message is sent to the `/api/chat` endpoint via a POST request. The response from the API is then displayed as the assistant's message. The messages are stored on the client-side in an array.