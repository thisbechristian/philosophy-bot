// Imports
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');
const prompt = require ("./prompt.js");

// AI Options
const model = "gemini-2.0-flash-exp";
const generationConfig = { temperature: 1, responseMimeType: "application/json", };

// Email Options
const fromEmail = process.env.EMAIL;
const email = {
    from: {
        name: "A Daily Dose of Philosophy",
        email: fromEmail
    },
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
    let response = "";
    try {
        // Prompt AI
        const aiChatSession = ai.startChat({ generationConfig, history: [], });
        const result = await aiChatSession.sendMessage(prompt);
        response = result.response.text();
        console.log("Successfully prompted AI");
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