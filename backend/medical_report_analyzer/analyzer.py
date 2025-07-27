# analyzer.py
import os
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
model = genai.GenerativeModel("gemini-2.0-flash")

def analyze_report_text(text: str) -> dict:
    prompt = f"""
You are an AI medical assistant. Analyze the following medical report text:
{text}

Please provide:
1. A short summary (max 2-3 sentences)
2. A detailed analysis including abnormalities and suggestions

Format your answer as:
Summary:
...
Detailed Analysis:
...
"""
    response = model.generate_content(prompt)
    answer = response.text

    # Split answer into summary + detailed
    summary = ""
    detailed = ""

    if "Summary:" in answer and "Detailed Analysis:" in answer:
        parts = answer.split("Detailed Analysis:")
        summary_part = parts[0].replace("Summary:", "").strip()
        detailed_part = parts[1].strip()
        summary = summary_part
        detailed = detailed_part
    else:
        # fallback: put everything in detailed
        detailed = answer
        summary = "Summary not found in AI response."

    return {
        "summary": summary,
        "detailed_analysis": detailed
    }

