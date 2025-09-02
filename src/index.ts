import { Hono } from "hono";

const app = new Hono<{Bindings: Env}>();

app.get("/api/hello", async(c) => {
	const results = await c.env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
		prompt: "Translate the phrase 'Hello, world' in 5 different languages"
	})
	return c.json(results);
});

app.post("/api/v1/chat", async(c) => {
	const payload = await c.req.json();
	const results = await c.env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
		messages: payload.messages,
		max_tokens: 81000
	})
	return c.text(results.response);
});

app.post("/api/chat", async(c) => {
	const {messages, systemMessage} = await c.req.json();
	if (systemMessage) {
		messages.unshift(systemMessage);
	}
	const results = await c.env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
		messages,
		max_tokens: 81000
	})
	return c.json(results);
});


export default app;
