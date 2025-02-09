import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBEej6KAxTOUTwhpgMMlGqKvwsXh6wsdXQ"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // Or another suitable model
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain", // Important for text responses
};

async function run(prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const response = result.response;
    console.log(response.text());
    return response.text();
  } catch (error) {
    console.error("Error generating text:", error);
    return "Error occurred during generation."; // Return an error message
  }
}

export default run;