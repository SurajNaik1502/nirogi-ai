
const GEMINI_API_KEY = "AIzaSyCXS8cqy_sJSRRjAh5rW9Q1sToqigK_5Nw";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const generateHealthAdvice = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI health advisor called HealthGlow Assistant. You provide helpful health advice but always clarify you're not a medical professional and serious concerns should be addressed by a doctor. 
            
            User input: ${prompt}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Gemini API');
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};
