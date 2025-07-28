import { generateHealthAdvice } from './geminiService';

export interface ReportAnalysis {
  summary: string;
  detailed_analysis: string;
}

export const analyzeReportText = async (reportText: string): Promise<ReportAnalysis> => {
  const prompt = `
You are an AI medical assistant. Analyze the following medical report text:
${reportText}

Please provide:
1. A short summary (max 2-3 sentences)
2. A detailed analysis including abnormalities and suggestions

Format your answer as:
Summary:
...
Detailed Analysis:
...
`;

  try {
    const response = await generateHealthAdvice(prompt);
    
    // Parse the response to extract summary and detailed analysis
    let summary = "";
    let detailed_analysis = "";

    if (response.includes("Summary:") && response.includes("Detailed Analysis:")) {
      const parts = response.split("Detailed Analysis:");
      summary = parts[0].replace("Summary:", "").trim();
      detailed_analysis = parts[1].trim();
    } else {
      // Fallback: put everything in detailed analysis
      detailed_analysis = response;
      summary = "AI analysis completed";
    }

    return {
      summary,
      detailed_analysis
    };
  } catch (error) {
    console.error('Error analyzing report:', error);
    throw new Error('Failed to analyze report');
  }
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      // For now, we'll just return the base64 content
      // In a real implementation, you'd use OCR for images or PDF parsing
      resolve(`Text extracted from ${file.name}: ${result.substring(0, 500)}...`);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read as text for text files, or as data URL for others
    if (file.type.startsWith('text/')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  });
};