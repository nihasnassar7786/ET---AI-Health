export interface Patient {
  id: string;
  name: string;
  dob: string;
  insuranceId: string;
  provider: string;
}

export interface Claim {
  id: string;
  patientId: string;
  dateOfService: string;
  diagnosisCodes: string[];
  procedureCodes: string[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'denied' | 'flagged';
  reasoning?: AuditStep[];
}

export interface PriorAuthRequest {
  id: string;
  patientId: string;
  procedureCode: string;
  clinicalNotes: string;
  status: 'pending' | 'approved' | 'denied' | 'info_requested';
  reasoning?: AuditStep[];
}

export interface AuditStep {
  step: string;
  finding: string;
  evidence: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
}

export interface MedicalCode {
  code: string;
  description: string;
  type: 'ICD-10' | 'CPT';
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface IntakeForm {
  id: string;
  patientName: string;
  submittedAt: string;
  content: string;
  summary?: string;
  extractedFields?: Record<string, string>;
}

export interface ClinicalRisk {
  patientId: string;
  patientName: string;
  riskType: 'readmission' | 'sepsis' | 'care_gap';
  score: number;
  reasoning: string;
  recommendation: string;
}
