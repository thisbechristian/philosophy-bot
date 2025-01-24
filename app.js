const { OpenAI } = require('openai');

// Constants
const model = "gpt-4o-mini";
const prompt = "Hello, how are you today?";

const openAiApiKey = process.env.AI_API_KEY;
if (!openAiApiKey) { throw new Error('Open API Key was not found.'); }

// Initialize OpenAI with the API key
const openAI = new OpenAI({ apiKey: openAiApiKey });

// Function to call the ChatGPT API
async function chatWithGpt(prompt) {
    try {
        const response = await openAI.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
        });
        console.log(JSON.stringify(response));
    } catch (error) {
        console.error('Error calling the OpenAI API:', error);
    }
}

// Example usage
chatWithGpt(prompt);