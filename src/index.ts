import { events } from "fetch-event-stream";
import { Hono } from "hono";
import { streamText } from "hono/streaming";

const app = new Hono<{Bindings: Env}>();

app.get("/api/hello", async (c) => {
	const results = await c.env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
		prompt: "Say hello world in five different spoken languages"
	})
	return c.json(results);
});

app.post("/api/chat", async (c) => {
	const {messages, systemMessage} = await c.req.json();
	console.log("Payload is", {messages, systemMessage});
	if (systemMessage) {
		messages.unshift({role: "system", content: systemMessage});
	}
	const results = await c.env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
		messages,
		max_tokens: 80000
	})

	return c.json(results);
});

app.post("/api/chat/streaming", async (c) => {
	const {messages, systemMessage} = await c.req.json();
	console.log("Payload is", {messages, systemMessage});
	if (systemMessage) {
		messages.unshift({role: "system", content: systemMessage});
	}
	const resultStream = await c.env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
		messages,
		max_tokens: 80000,
		stream: true
	})
	// Stream properly in dev mode
	c.header("Content-Encoding", "Identity");
	return streamText(c, async(stream) => {
		const chunks = events(new Response(resultStream));
		for await (const chunk of chunks) {
			console.log(chunk);
			if (chunk.data !== undefined && chunk.data !== "[DONE]") {
				const data = JSON.parse(chunk.data);
				const token = data.response;
				if (token) {
					stream.write(token.toString());
				}
			}
		}
	})
});


export default app;
