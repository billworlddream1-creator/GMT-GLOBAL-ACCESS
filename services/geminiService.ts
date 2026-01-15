import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client strictly using process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeQuery = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: "You are ACCESS, a highly advanced AI dashboard assistant. Provide concise, analytical, and data-driven responses. Format output in Markdown. If asked to perform illegal acts (hack, steal), politely decline and offer a theoretical security analysis instead.",
      }
    });
    return response.text || "Analysis complete. No textual output derived.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ACCESS DENIED: Neural link unstable. Unable to process request.";
  }
};

export const resolveIdentity = async (target: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a simulated OSINT identity resolution for the following identifier: ${target}. 
      Include potential associated accounts, data breach presence (simulated), and a risk profile. 
      Format as a professional intelligence report with sections: IDENTITY PROFILE, DIGITAL FOOTPRINT, and SECURITY RECOMMENDATIONS.`,
      config: {
        systemInstruction: "You are a specialized identity resolver module for the GMT Global Access system. Your output is simulated and for demonstration purposes. Do not divulge real private data.",
      }
    });
    return response.text || "Resolution failed. No data found for specified parameters.";
  } catch (error) {
    return "Error connecting to Identity Matrix. Check target format.";
  }
};

export const extractCommLogs = async (target: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a simulated communication metadata extraction for: ${target}. 
      Generate a realistic list of recent SMS and Call logs (simulated numbers and timestamps). 
      Include 'Direction', 'Timestamp', 'Duration/Type', and 'Metadata Flag'.
      Format as a secure signal intelligence table.`,
      config: {
        systemInstruction: "You are a Signal Intelligence AI. Your output is simulated for investigative training. Do not provide real private records.",
      }
    });
    return response.text || "Extraction failed. Signal too weak.";
  } catch (error) {
    return "Error: Node extraction timeout.";
  }
};

export const extractUSBData = async (deviceLabel: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Initiate a simulated deep-file extraction from the following hardware node: ${deviceLabel}. 
      Identify hidden system partitions, encrypted archives, and metadata remnants. 
      Format the response as a file explorer manifest with 'Path', 'Status', 'Encryption Level', and 'Intel Value'.
      Include a section for 'SECRET DATA DISCOVERED' containing fictional, highly sensitive intelligence snippets (codes, names, project titles).`,
      config: {
        systemInstruction: "You are a specialized Hardware Forensics AI. Your output is simulated for demonstration and visualization. Do not provide actual software instructions for illicit activities.",
      }
    });
    return response.text || "Hardware handshake failed.";
  } catch (error) {
    return "Critical hardware error: USB bridge disconnected.";
  }
};

export const queryFinancialIntel = async (account: string, location: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Simulate a deep-dive banking system extraction for Account Number: ${account} in ${location}. 
      Provide a detailed intelligence summary including: 
      1. Bank Institution Identity.
      2. Branch Logistics (City, Country).
      3. Transaction Vector Analysis.
      4. Risk Score and Compliance Status.
      Format as a secure financial dossier.`,
      config: {
        systemInstruction: "You are a Financial Reconnaissance AI. Your output is simulated for security training and high-level dashboard visualization. Do not process real sensitive banking data.",
      }
    });
    return response.text || "Extraction failed. Database unreachable.";
  } catch (error) {
    return "Error: Financial node timeout.";
  }
};

export const solveMathProblem = async (problem: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: `Solve this mathematical problem step-by-step. Show deep analytical reasoning. Problem: ${problem}`,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    return response.text || "Calculation failed.";
  } catch (error) {
    return "Calculation Error: Input parameters invalid or too complex.";
  }
};