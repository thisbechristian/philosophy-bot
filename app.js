// Imports
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');

// AI Options
const model = "gemini-2.0-flash-exp";
const generationConfig = { temperature: 2, responseMimeType: "text/plain", };
const prompt = "Hello, how are you today?";

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
        aiResponse = result.response.text;
    } catch (error) {
        console.log("Failed to prompt AI: ", error);
    }
    try {
        // Send Email
        email.subject = "";
        email.html = aiResponse;
        await transporter.sendMail(email);
    } catch (error) {
        console.log("Failed to send Emai: ", error);
    }
}

run();