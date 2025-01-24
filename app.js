const { GoogleGenerativeAI } = require("@google/generative-ai");

// Constants
const model = "gemini-2.0-flash-exp";
const generationConfig = { temperature: 2, responseMimeType: "text/plain", };
const prompt = "Hello, how are you today?";

// Create AI Client 
const apiKey = process.env.GOOGLEAI_API_KEY;
const googleAI = new GoogleGenerativeAI(apiKey);
const ai = googleAI.getGenerativeModel({ model });

const run = async () => {
    try {
        // Prompt AI
        const aiChatSession = ai.startChat({ generationConfig, history: [], });
        const result = await aiChatSession.sendMessage(prompt);
        console.log(result.response.text());
    } catch (error) {
        console.log(error);
    }
}

run();