import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (apiKey && apiKey !== "PASTE_MY_NEW_KEY_HERE") {
  console.log("[Gemini API] Key loaded successfully.");
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "You are an AI financial adviser. Give SHORT, CONCISE answers (3-5 sentences max). Be direct and to the point. If the user asks a financial question, provide personalized advice based on their provided data if relevant. If the user asks an unrelated or general question, answer it normally without mentioning their financial data."
  });
} else {
  console.warn("[Gemini API] Missing or invalid API key. Please update your .env file.");
}

export async function askGemini(prompt) {
  console.log("[Gemini API] Request started with prompt:", prompt);
  
  if (!apiKey || apiKey === "PASTE_MY_NEW_KEY_HERE") {
    const errorMsg = "Missing API key. Please configure VITE_GEMINI_API_KEY in your .env file.";
    console.error("[Gemini API] Error:", errorMsg);
    throw new Error(errorMsg);
  }

  if (!model) {
    throw new Error("Gemini Model is not initialized.");
  }

  try {
    const result = await model.generateContent(prompt);
    console.log("[Gemini API] Response received successfully.");
    return result.response.text();
  } catch (error) {
    console.error("[Gemini API] Error details:", error);

    let friendlyError = "An unexpected error occurred while generating the response.";

    if (error.status === 403 || error.message.includes("403")) {
      friendlyError = "Access forbidden (403). Your API key may be invalid or restricted.";
    } else if (error.message.includes("Network Error") || error.message.includes("fetch")) {
      friendlyError = "Network error. Please check your internet connection.";
    } else if (error.status === 429 || error.message.includes("429")) {
      friendlyError = "Rate limit exceeded. Please wait a moment and try again.";
    } else if (error.message.includes("unregistered caller") || error.message.includes("API key not valid")) {
      friendlyError = "Invalid API key provided. Please check your credentials.";
    }

    throw new Error(friendlyError);
  }
}

export async function askGeminiStream(prompt) {
  console.log("[Gemini API] Streaming request started with prompt:", prompt);
  
  if (!apiKey || apiKey === "PASTE_MY_NEW_KEY_HERE") {
    const errorMsg = "Missing API key. Please configure VITE_GEMINI_API_KEY in your .env file.";
    console.error("[Gemini API] Error:", errorMsg);
    throw new Error(errorMsg);
  }

  if (!model) {
    throw new Error("Gemini Model is not initialized.");
  }

  try {
    const result = await model.generateContentStream(prompt);
    console.log("[Gemini API] Stream started successfully.");
    return result.stream;
  } catch (error) {
    console.error("[Gemini API] Streaming error details:", error);

    let friendlyError = "An unexpected error occurred while generating the response.";
    if (error.status === 403 || error.message.includes("403")) {
      friendlyError = "Access forbidden (403). Your API key may be invalid or restricted.";
    } else if (error.message.includes("Network Error") || error.message.includes("fetch")) {
      friendlyError = "Network error. Please check your internet connection.";
    } else if (error.status === 429 || error.message.includes("429")) {
      friendlyError = "Rate limit exceeded. Please wait a moment and try again.";
    } else if (error.message.includes("unregistered caller") || error.message.includes("API key not valid")) {
      friendlyError = "Invalid API key provided. Please check your credentials.";
    }

    throw new Error(friendlyError);
  }
}
