// Imports
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');
import { prompt } from "./prompt";

// AI Options
const model = "gemini-2.0-flash-exp";
const generationConfig = { temperature: 2, responseMimeType: "text/plain", };

// Email Options
const fromEmail = process.env.EMAIL;
const email = {
    from: fromEmail,
    to: ["christianjboni@gmail.com"]
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
    let aiResponse = "";
    try {
        // Prompt AI
        const aiChatSession = ai.startChat({ generationConfig, history: [], });
        const result = await aiChatSession.sendMessage(prompt);
        aiResponse = result.response.text();
        console.log("Successfully prompted AI");
    } catch (error) {
        console.log("Failed to prompt AI: ", error);
    }
    try {
        // Parse JSON
        const results = JSON.parse(aiResponse);
        email.subject = results.subject;
        email.html = results.body;
        console.log("Successfully parsed AI response");
    } catch (error) {
        console.log(`Failed to parse AI response, ${aiResponse}`, error);
    }
    try {
        // Send Email
        await transporter.sendMail(email);
        console.log("Successfully sent Email");
    } catch (error) {
        console.log("Failed to send Email: ", error);
    }
}

run();