const { OpenAI } = require('openai');

const openAiApiKey = process.env.OPENAI_API_KEY;
const model = "chatgpt-4o-latest";
const prompt = "Hello, how are you today?";

if (openAiApiKey) {
    console.log('Open API Key:', openAiApiKey);
} else {
    throw new Error('Open API Key was not found.');
}

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