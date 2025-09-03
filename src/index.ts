import { Hono } from 'hono';
import { events } from 'fetch-event-stream';
import { streamText } from 'hono/streaming';

const app = new Hono<{ Bindings: Env }>();

app.get('/api/hello', async (c) => {
	const results = await c.env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', {
		prompt: "Translate the phrase 'Hello, world' in 5 different languages",
	});
	return c.json(results);
});

app.post('/api/v1/chat', async (c) => {
	const payload = await c.req.json();
	const results = await c.env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', {
		messages: payload.messages,
		max_tokens: 81000,
	});
	return c.text(results.response);
});

app.post('/api/chat', async (c) => {
	const { messages, systemMessage } = await c.req.json();
	if (systemMessage) {
		const systemMsg = { role: 'system', content: systemMessage };
		messages.unshift(systemMsg);
	}
	console.log(messages);
	const results = await c.env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', {
		messages,
		max_tokens: 81000,
	});
	return c.json(results);
});

app.post('/api/streaming/chat', async (c) => {
	const { messages, systemMessage } = await c.req.json();
	if (systemMessage) {
		const systemMsg = { role: 'system', content: systemMessage };
		messages.unshift(systemMsg);
	}
	console.log(messages);
	const resultStream = await c.env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', {
		messages,
		max_tokens: 81000,
		stream: true,
	});
	return streamText(c, async (stream) => {
		const chunks = events(new Response(resultStream));
		for await (const chunk of chunks) {
			if (chunk.data !== undefined && chunk.data !== '[DONE]') {
				const data = JSON.parse(chunk.data);
				const token = data.response;
				if (token) {
					stream.write(token);
				}
			}
		}
	});
});

export default app;
