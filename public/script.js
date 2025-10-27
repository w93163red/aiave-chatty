let messages = [];
let systemMessage = document.getElementById('system-message').value;
let currentAssistantMessage = '';
let assistantMessageIndex = 0;
let currentAssistantElement = null;

// Get elements
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const contextCount = document.getElementById('context-count');
const exampleBtn1 = document.getElementById('example-btn-1');
const exampleBtn2 = document.getElementById('example-btn-2');
const exampleBtn3 = document.getElementById('example-btn-3');

// Add event listeners
sendBtn.addEventListener('click', sendMessage);
clearChatBtn.addEventListener('click', clearChat);

// Allow Enter key to send message (Shift+Enter for new line)
userInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault();
		sendMessage();
	}
});
exampleBtn1.addEventListener('click', () =>
	setSystemMessage(`You are a successful Startup CEO mentor! 💼
You speak like a seasoned entrepreneur who has built multiple successful companies.
You connect every concept to real-world business applications and startup scenarios.
You use terminology like "MVP," "product-market fit," "scalability," "pivot," and "growth hacking."
You encourage students to think like founders: "How would this create value?" "What's the business model?"
You share insights from Silicon Valley success stories and lessons from failures.
You help students see how technology and business strategy intersect.`)
);
exampleBtn2.addEventListener('click', () =>
	setSystemMessage(`You are a visionary Tech Innovator! 🚀
You speak like a passionate engineer excited about cutting-edge technology.
You explain concepts by relating them to breakthrough innovations (AI, blockchain, cloud computing, etc.).
You use analogies from famous tech companies: "Like how Netflix scaled..." or "Similar to how Google optimized..."
You encourage computational thinking and problem-solving with engineering mindset.
You connect CS concepts to real-world tech applications and industry trends.
You inspire students by showing how code can change the world.`)
);
exampleBtn3.addEventListener('click', () => setSystemMessage(`You are an experienced CS Professor! 👨‍🏫
You speak like a passionate computer science educator who loves teaching complex concepts.
You break down technical topics into digestible pieces using clear explanations and relevant examples.
You use the Socratic method - asking guiding questions to help students discover answers themselves.
You connect theory to practice: "Let's see how this works in real code..." or "Remember the algorithm we studied..."
You encourage computational thinking, problem decomposition, and algorithmic reasoning.
You reference classic CS concepts (data structures, algorithms, complexity, design patterns) and relate them to modern applications.
You're patient, encouraging, and celebrate student progress with phrases like "Excellent observation!" or "Now you're thinking like a computer scientist!"
You help students understand not just the 'how' but the 'why' behind CS concepts.`));

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

				// Create assistant message element once
				currentAssistantElement = document.createElement('div');
				currentAssistantElement.classList.add('message', 'assistant-message');
				chatLog.appendChild(currentAssistantElement);

				// Scroll to bottom
				chatLog.scrollTop = chatLog.scrollHeight;

				// Update context count immediately
				updateContextCount();

				return reader.read().then(function processResult(result) {
					if (result.done) {
						// The stream has ended
						currentAssistantElement = null;
						return;
					}

					const decodedChunk = decoder.decode(result.value);
					messages[assistantMessageIndex].content += decodedChunk;

					// Only update the current assistant message element
					if (currentAssistantElement) {
						currentAssistantElement.innerHTML = marked.parse(messages[assistantMessageIndex].content);
						// Auto-scroll to bottom
						chatLog.scrollTop = chatLog.scrollHeight;
					}

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
			messageElement.textContent = message.content;
		} else if (message.role === 'assistant') {
			messageElement.classList.add('assistant-message');
			messageElement.innerHTML = marked.parse(message.content);
		}
		chatLog.appendChild(messageElement);
	});
	// Scroll to bottom
	chatLog.scrollTop = chatLog.scrollHeight;
	// Update context count
	updateContextCount();
}

// Function to update context count
function updateContextCount() {
	const count = messages.length;
	contextCount.textContent = `${count} message${count !== 1 ? 's' : ''}`;
}

// Function to set system message
function setSystemMessage(message) {
	systemMessage = message;
	document.getElementById('system-message').value = message;
}

// Function to clear chat
function clearChat() {
	if (confirm('Are you sure you want to clear the chat history?')) {
		messages = [];
		chatLog.innerHTML = '';
		updateContextCount();
		console.log('Chat history cleared');
	}
}
