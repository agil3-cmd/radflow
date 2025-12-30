
import { GoogleGenAI, Type } from "@google/genai";
import { ReportAnalysis } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Strictly follow guidelines: Use process.env.API_KEY directly
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeReport(reportText: string): Promise<ReportAnalysis> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: reportText,
      config: {
        systemInstruction: `You are a world-class radiologist's AI assistant. 
        Analyze the provided unstructured medical report text. 
        Extract key clinical insights in a structured format. 
        Use professional medical terminology while ensuring the 'Lab Correlations' and 'Clinical History' are clearly isolated from 'Key Findings'.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clinicalHistory: { type: Type.STRING, description: "Relevant patient medical history mentioned in report" },
            labCorrelations: { type: Type.STRING, description: "Any mentioned lab values or bloodwork correlations" },
            keyFindings: { type: Type.STRING, description: "The core imaging findings and diagnosis" },
            followUpSuggestions: { type: Type.STRING, description: "Recommended next steps or future studies" }
          },
          required: ["clinicalHistory", "labCorrelations", "keyFindings", "followUpSuggestions"]
        }
      }
    });

    try {
      // response.text is a property, not a method
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse AI response", e);
      throw new Error("Analysis failed");
    }
  }

  async generatePatientExplanation(patientName: string, reason: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, empathetic explanation for a patient named ${patientName} who is waiting. 
      The reason for someone else being prioritized is: ${reason}. 
      Tone: Compassionate, professional, and reassuring. Keep it under 60 words.`,
      config: {
        systemInstruction: "You are a patient coordinator at a high-end medical imaging center."
      }
    });
    // response.text is a property, not a method
    return response.text || "";
  }
}

export const geminiService = new GeminiService();
