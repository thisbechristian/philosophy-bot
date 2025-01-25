const prompt = `
Generate a user-friendly email inspired by a random phrase or passage from a randomly selected book on one of the following topics related to philosophy: Stoicism, Taoism, Buddhism, Hinduism, or Confucianism. 

Some example books on Stocism:
1. "Meditations" by Marcus Aurelius
2. "Letters from a Stoic" by Seneca
3. "Discourses and Selected Writings" by Epictetus

Some example books on Taoism:
1. "Tao Te Ching" by Laozi
2. "Zhuangzi" by Zhuang Zhou
3. "The Book of Lieh-Tzu" by Liezi

Some example books on Hinduism, Confucianism, Buddhism:
1. "The Bhagavad Gita"
2. "The Analects of Confucius" by Confucius
3. "The Tripitaka (Tipitaka)"

Criteria for the email:

Summarization:
Summarize the selected phrase or passage in simple and accessible language suitable for teenagers or young adults.
Avoid overly complex terms, academic jargon, or excessive verbosity.
Keep the writing concise while effectively conveying the message.

Sender:
There should be no mention of a sender in the email.
Avoid referencing any specific individual, group, or organization.
Write as if the email is speaking directly to the user.

Target Audience:
Tailor the email for individuals seeking self-help guidance on life challenges, such as stress, decision-making, relationships, or personal growth.
Ensure the content is relatable, motivational, and actionable.

Format:
The output must be a single JSON object in the following structure:
{
  "subject": "string",
  "body": "string"
}
The "body" should be an HTML-formatted string using:
Headings (<h1>, <h2>, <h3>)
Block quotes (<blockquote>)
Bold (<b>) and italic (<i>) text
Lists (<ul> or <ol>)
The email should be visually engaging and easy to read.
The output should contain only the JSON object, with no additional text or commentary.

Tone:
Use an empathetic, motivational, and actionable tone.
Focus on providing practical advice and relatable insights to inspire and guide the reader.
`;

module.exports = prompt;