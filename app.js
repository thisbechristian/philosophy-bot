// Imports
const fs = require('fs/promises');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');
const newPrompt = require("./prompt.js");
const history = require("./history.json");

// AI Options
const model = "gemini-2.0-flash-exp";
const generationConfig = { temperature: 1, responseMimeType: "application/json", };
const topics = ["Stoicism", "Taoism", "Buddhism", "Hinduism", "Confucianism"];
const randomTopic = topics[Math.floor(Math.random() * topics.length)];
const existingPrompt = `Generate another email using a book with a topic of ${randomTopic}`;
const prompt = (history && history.length) > 0 ? existingPrompt : newPrompt;
const maximumChatHistoryLength = (15 * 2); // Limit the maximum Chat History length (includes both a prompt and a response)
const numberOfRecentChatsToPersist = (5 * 2); // Number of recent Chat History to persist when maximum is reached (includes both a prompt and a response)

// Email Options
const fromEmail = process.env.EMAIL;
const email = {
    from: `Circadian Contemplations <${fromEmail}>`,
    to: ["christianjboni@gmail.com", "laurenrosnick@gmail.com"]
};

// Create AI Client 
const googleAI = new GoogleGenerativeAI(process.env.GOOGLEAI_API_KEY);
const ai = googleAI.getGenerativeModel({ model });

// Create Email Client
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: fromEmail,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const run = async () => {
    let response = "";
    try {
        // Prompt AI
        const aiChatSession = ai.startChat({ generationConfig, history });
        const result = await aiChatSession.sendMessage(prompt);
        response = result.response.text();
        console.log("Successfully prompted AI");
        try {
            // Persist AI Chat History
            let chatHistory = await aiChatSession.getHistory();
            // Trim Chat History if it exceeds the maximum limit
            const currentChatHistoryLength = chatHistory.length;
            if (currentChatHistoryLength > maximumChatHistoryLength) {
                const initialChatHistory = chatHistory.slice(0, 2);
                const recentChatHistory = chatHistory.slice(currentChatHistoryLength - numberOfRecentChatsToPersist, currentChatHistoryLength);
                chatHistory = [...initialChatHistory, ...recentChatHistory];
            }
            await fs.writeFile('history.json', JSON.stringify(chatHistory));
            console.log("Successfully persisted AI Chat History");
        } catch (error) {
            console.error('Failed to persist AI Chat History:', error);
            // continue 
        }
    } catch (error) {
        console.log("Failed to prompt AI: ", error);
        throw error;
    }
    try {
        // Parse JSON
        const results = JSON.parse(response);
        email.subject = results.subject;
        email.html = results.body;
        console.log("Successfully parsed the response from AI");
    } catch (error) {
        console.log("Failed to parse the response from AI: ", error);
        console.log("AI response: ", response);
        throw error;
    }
    try {
        // Send Email
        await transporter.sendMail(email);
        console.log("Successfully sent Email");
    } catch (error) {
        console.log("Failed to send Email: ", error);
        throw error;
    }
}

run();