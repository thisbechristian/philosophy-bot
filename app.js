// Imports
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');

// AI Options
const model = "gemini-2.0-flash-exp";
const generationConfig = { temperature: 2, responseMimeType: "text/plain", };
const prompt = `
I would like you to generate a user-friendly email inspired by a random phrase or passage from a randomly selected book on one of the following topics: Stoicism, Buddhism, or Taoism.

Criteria for the email:

Sender: The sender of the email should remain anonymous. Avoid referencing any specific individual or organization.

Summarization:
Summarize the selected phrase or passage in simple and accessible language suitable for teenagers or young adults.
Avoid using overly complex terms or academic jargon.

Target Audience:
Write for individuals seeking self-help guidance on various life challenges, such as stress, decision-making, relationships, or personal growth.
Ensure the content is relatable, motivational, and actionable.
Write in a concise manner, avoid being overly verbose.

Format:
The output should be formatted as a JSON object with the following structure:
{
  "subject": "string",
  "body": "string"
}
The "body" parameter should contain an HTML-formatted string that uses:
Headings (<h1>, <h2>, <h3>)
Block quotes (<blockquote>)
Bold (<b>) and italic (<i>) text
Lists (<ul> or <ol>)
This formatting should create a visually engaging and easy-to-read email.

Tone:
The tone should be empathetic, motivational, and actionable.
Focus on offering relatable insights and practical advice.
`;

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