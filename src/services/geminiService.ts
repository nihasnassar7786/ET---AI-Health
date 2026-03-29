import { GoogleGenAI, Type } from "@google/genai";
import { AuditStep, MedicalCode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeMedicalCoding(clinicalNotes: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following clinical notes and suggest appropriate medical codes.
    Use ICD-10 for diagnosis and CPT/HCPCS for procedure codes.
    
    Clinical Notes:
    ${clinicalNotes}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedCodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["ICD-10", "CPT"] },
                reasoning: { type: Type.STRING }
              },
              required: ["code", "description", "type", "reasoning"]
            }
          },
          auditTrail: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                finding: { type: Type.STRING },
                evidence: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["pass", "fail", "warning", "info"] }
              },
              required: ["step", "finding", "evidence", "status"]
            }
          }
        },
        required: ["suggestedCodes", "auditTrail"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function adjudicateClaim(claimData: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Adjudicate the following medical claim based on standard payer policies.
    Check for:
    1. Code consistency (Diagnosis vs Procedure)
    2. Patient Status Verification: Ensure codes match patient classification (New vs Established).
    3. Duplicate billing
    4. Medical necessity based on clinical guidelines
    5. Coverage limits and policy exclusions
    
    Claim Data:
    ${JSON.stringify(claimData, null, 2)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING, enum: ["approved", "denied", "flagged"] },
          finalReason: { type: Type.STRING },
          auditTrail: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                finding: { type: Type.STRING },
                evidence: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["pass", "fail", "warning", "info"] }
              },
              required: ["step", "finding", "evidence", "status"]
            }
          }
        },
        required: ["decision", "finalReason", "auditTrail"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function evaluatePriorAuth(requestData: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate this Prior Authorization request against standard clinical guidelines.
    IMPORTANT: Identify the most appropriate procedure code based on the clinical notes provided if missing or needs verification.
    
    Request Data:
    ${JSON.stringify(requestData, null, 2)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING, enum: ["approved", "denied", "info_requested"] },
          clinicalJustification: { type: Type.STRING },
          identifiedCode: { 
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["code", "description"]
          },
          auditTrail: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                finding: { type: Type.STRING },
                evidence: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["pass", "fail", "warning", "info"] }
              },
              required: ["step", "finding", "evidence", "status"]
            }
          }
        },
        required: ["decision", "clinicalJustification", "identifiedCode", "auditTrail"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function processIntakeForm(formContent: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Process this digital intake form. Generate a concise clinical summary and extract key EHR fields (allergies, medications, history).
    
    Form Content:
    ${formContent}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          extractedFields: {
            type: Type.OBJECT,
            properties: {
              allergies: { type: Type.STRING },
              currentMedications: { type: Type.STRING },
              medicalHistory: { type: Type.STRING },
              primaryComplaint: { type: Type.STRING }
            }
          },
          auditTrail: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                finding: { type: Type.STRING },
                evidence: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["pass", "fail", "warning", "info"] }
              },
              required: ["step", "finding", "evidence", "status"]
            }
          }
        },
        required: ["summary", "extractedFields", "auditTrail"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function detectClinicalRisks(patientData: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this patient data to detect risks for readmission, sepsis, or care gaps.
    
    Patient Data:
    ${JSON.stringify(patientData, null, 2)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          risks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                riskType: { type: Type.STRING, enum: ["readmission", "sepsis", "care_gap"] },
                score: { type: Type.NUMBER, description: "Risk score from 0 to 100" },
                reasoning: { type: Type.STRING },
                recommendation: { type: Type.STRING }
              },
              required: ["riskType", "score", "reasoning", "recommendation"]
            }
          },
          auditTrail: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                finding: { type: Type.STRING },
                evidence: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["pass", "fail", "warning", "info"] }
              },
              required: ["step", "finding", "evidence", "status"]
            }
          }
        },
        required: ["risks", "auditTrail"]
      }
    }
  });

  return JSON.parse(response.text);
}
