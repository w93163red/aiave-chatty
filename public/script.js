let messages = [];
const chatMessagesElement = document.getElementById('chat-messages');
const userMessageElement = document.getElementById('user-message');
const sendMessageButton = document.getElementById('send-message');
const systemMessageElement = document.getElementById('system-message');
const exampleBtn1 = document.getElementById('example-btn-1');
const exampleBtn2 = document.getElementById('example-btn-2');
let assistantMessageElement;
// Add event listeners
sendMessageButton.addEventListener('click', sendMessage);
exampleBtn1.addEventListener(
	'click',
	() =>
		(systemMessageElement.value = `You are a long time New Yorker. You speak with a thick accent. You are helpful eventually, but often want to rile people up.`)
);
exampleBtn2.addEventListener(
	'click',
	() =>
		(systemMessageElement.value =
			'You are a karaoke pro. You love to give people suggestions of what to sing. You share YouTube links like https://www.youtube.com/results? and then karaoke + the band and song name url encoded. You encourage them to practice with YouTube')
);
function sendMessage() {
	const userMessage = userMessageElement.value.trim();
	if (userMessage) {
		messages.push({ role: 'user', content: userMessage });
		renderMessages();
		userMessageElement.value = '';
		// Send request to API
		fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: messages, systemMessage: systemMessageElement.value }),
		})
			.then((response) => {
				if (!response.body) {
					throw new Error('The response body is not a ReadableStream');
				}
				const reader = response.body.getReader();
				let assistantMessageContent = '';
				return new Promise((resolve) => {
					function read() {
						reader.read().then(({ value, done }) => {
							if (done) {
								const assistantMessage = { role: 'assistant', content: assistantMessageContent };
								messages.push(assistantMessage);
								renderMessages();
								resolve();
								return;
							}
							assistantMessageContent += new TextDecoder().decode(value);
							renderAssistantMessage(assistantMessageContent);
							read();
						});
					}
					read();
				});
			})
			.catch((error) => console.error(error));
	}
} // Function to render messages
function renderMessages() {
	chatMessagesElement.innerHTML = '';
	messages.forEach((message) => {
		const messageElement = document.createElement('div');
		messageElement.classList.add('message');
		if (message.role === 'user') {
			messageElement.classList.add('user-message');
		} else if (message.role === 'assistant') {
			messageElement.classList.add('assistant-message');
			assistantMessageElement = messageElement;
		} else if (message.role === 'system') {
			messageElement.classList.add('system-message');
		}
		messageElement.textContent = message.content;
		chatMessagesElement.appendChild(messageElement);
	});
} // Function to render assistant message
function renderAssistantMessage(content) {
	if (assistantMessageElement) {
		assistantMessageElement.textContent = content;
	} else {
		const messageElement = document.createElement('div');
		messageElement.classList.add('message', 'assistant-message');
		messageElement.textContent = content;
		chatMessagesElement.appendChild(messageElement);
		assistantMessageElement = messageElement;
	}
}
