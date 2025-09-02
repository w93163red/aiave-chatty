**Chatty Website Front-end**
==========================

### HTML

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatty</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="chat-container">
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-input">
            <textarea id="user-message" placeholder="Type a message..."></textarea>
            <button id="send-message">Send</button>
        </div>
        <div class="admin-section">
            <h2>Admin Section</h2>
            <textarea id="system-message" placeholder="System message...">You are a helpful assistant.</textarea>
            <button id="example-btn-1">Example 1</button>
            <button id="example-btn-2">Example 2</button>
            <button id="example-btn-3">Example 3</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### CSS

```css
/* styles.css */

body {
    font-family: Arial, sans-serif;
}

.chat-container {
    width: 500px;
    margin: 40px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chat-messages {
    padding: 20px;
    border-bottom: 1px solid #ccc;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 10px;
}

.user-message {
    background-color: #f0f0f0;
    align-self: flex-start;
}

.assistant-message {
    background-color: #e0f0f0;
    align-self: flex-end;
}

.system-message {
    background-color: #ccc;
    align-self: center;
}

.chat-input {
    padding: 20px;
    display: flex;
    flex-direction: column;
}

#user-message {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
}

#send-message {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

#send-message:hover {
    background-color: #3e8e41;
}

.admin-section {
    padding: 20px;
    border-top: 1px solid #ccc;
}

#system-message {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 100%;
}

.example-btn {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 10px;
}

.example-btn:hover {
    background-color: #3e8e41;
}
```

### JavaScript

```javascript
// script.js

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
exampleBtn1.addEventListener('click', () => systemMessageElement.value = 'Example 1 system message');
exampleBtn2.addEventListener('click', () => systemMessageElement.value = 'Example 2 system message');
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
```

This code creates a simple chatbot website with a text input field, a send button, and an admin section with a system message textarea and example buttons. When the send button is clicked, it sends a POST request to the `/api/chat` endpoint with the current messages and system message. The response from the API is then rendered as an assistant message. The messages are stored on the client-side and rendered in a chat-like interface.