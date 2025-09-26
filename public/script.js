let messages = [];
let systemMessage = document.getElementById('system-message').value;
let currentAssistantMessage = '';
let assistantMessageIndex = 0;

// Get elements
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const exampleBtn1 = document.getElementById('example-btn-1');
const exampleBtn2 = document.getElementById('example-btn-2');
const exampleBtn3 = document.getElementById('example-btn-3');

// Add event listeners
sendBtn.addEventListener('click', sendMessage);
exampleBtn1.addEventListener('click', () =>
	setSystemMessage(`You are a long time New Yorker.
You speak with a thick accent.
You are helpful eventually, but often want to rile people up.
`)
);
exampleBtn2.addEventListener('click', () =>
	setSystemMessage(`You are a karaoke pro.
You love to give people suggestions of what to sing. You
share YouTube links like https://www.youtube.com/results? and then karaoke + the band and song name url encoded.
You encourage them to practice with YouTube`)
);
exampleBtn3.addEventListener('click', () => setSystemMessage(`You break down topics for people new to coding and tech and general.
	You always ask if they want to learn more, and encourage them to dig deeper into subjects.`));

// Function to send message
function sendMessage() {
	const userMessage = userInput.value.trim();
	systemMessage = document.getElementById('system-message').value;
	if (userMessage) {
		messages.push({ role: 'user', content: userMessage });
		renderMessages();
		userInput.value = '';

		// Send POST request to /api/chat/streaming
		fetch('/api/chat/streaming', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ messages: messages, systemMessage: systemMessage }),
		})
			.then((response) => {
				if (!response.body) {
					throw new Error('The response body is not readable');
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				assistantMessageIndex = messages.length;
				messages.push({ role: 'assistant', content: '' });

				return reader.read().then(function processResult(result) {
					if (result.done) {
						// The stream has ended
						renderMessages();
						return;
					}

					const decodedChunk = decoder.decode(result.value);
					messages[assistantMessageIndex].content += decodedChunk;
					renderMessages();

					return reader.read().then(processResult);
				});
			})
			.catch((error) => console.error(error));
	}
}

// Function to render messages
function renderMessages() {
	chatLog.innerHTML = '';
	messages.forEach((message, index) => {
		const messageElement = document.createElement('div');
		messageElement.classList.add('message');
		if (message.role === 'user') {
			messageElement.classList.add('user-message');
		} else if (message.role === 'assistant') {
			messageElement.classList.add('assistant-message');
		}
		messageElement.textContent = message.content;
		chatLog.appendChild(messageElement);
	});
}

// Function to set system message
function setSystemMessage(message) {
	systemMessage = message;
	document.getElementById('system-message').value = message;
}
