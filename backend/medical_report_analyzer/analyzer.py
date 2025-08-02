# analyzer.py
import os
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
model = genai.GenerativeModel("gemini-2.0-flash")

def analyze_report_text(text: str) -> dict:
    prompt = f"""
    You are an AI medical assistant.

    Analyze the following medical report text:
    {text}

    **Instructions:**
    - Respond in clean, readable markdown.
    - Use proper markdown syntax:
    - Use `###` for section titles
    - Use `-` for bullet points
    - Use numbered lists only for recommendations or steps
    - Keep language clear, professional, and concise.
    - Group findings under clear headings (e.g., "Complete Blood Count", "Lipid Profile", etc.)

    Please provide:

    ### Summary
    - A brief summary (2–3 sentences) highlighting key concerns or normal findings.

    ### Detailed Analysis
    - Organize by report sections (CBC, Lipid Profile, etc.)
    - List out abnormal findings clearly
    - Brief notes on normal findings
    - Provide recommendations or suggestions at the end under **Recommendations**

    **Example format:**

    ### Summary
    - Short summary here.

    ### Detailed Analysis

    #### Complete Blood Count (CBC)
    - Finding 1
    - Finding 2

    #### Lipid Profile
    - Finding 1

    #### Other Findings
    - Finding 1

    ### Recommendations
    1. Suggestion 1
    2. Suggestion 2

    **End your response here.**  
    Output only the markdown, do not add extra commentary or disclaimers.
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

