import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../index.js";

dotenv.config();
const router = express.Router();

router.post("/text", async (req, res) => {
	try {
		const { text, activeChatId } = req.body;
		console.log("🚀 ~ file: openai.js:12 ~ router.post ~ req.body:", req.body);

		const response = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			message: [
				{ role: "system", content: "You are a helpful assistant." },
				{ role: "user", content: text },
			],
		});

		console.log("data", response.data);

		await axios.post(
			`https://api.chatengine.io/chat${activeChatId}/messages/`,
			{ text: response.data.choices[0].text },
			{
				headers: {
					"Project-ID": process.env.PROJECT_ID,
					"User-Name": process.env.BOT_USER_NAME,
					"User-Secret": process.env.BOT_USER_SECRET,
				},
			}
		);

		res.status(200).json({ text: response.data.choices[0].text });
	} catch (error) {
		console.error("error", error);
		res.status(500).json({ error: error.message });
	}
});

export default router;
