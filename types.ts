
export enum StudyStatus {
  REGISTERED = 'Registered',
  IN_ROOM = 'In-Room',
  REPORTING = 'Reporting',
  DISPATCHED = 'Dispatched'
}

export enum Priority {
  ROUTINE = 'Routine',
  FASTING = 'Fasting',
  CONTRAST = 'Contrast',
  STAT = 'Stat/Sick'
}

export interface PatientStudy {
  id: string;
  name: string;
  age: number;
  gender: string;
  modality: 'CT' | 'MRI' | 'X-Ray' | 'US';
  studyType: string;
  status: StudyStatus;
  priority: Priority;
  arrivalTime: string;
  technologistFlag?: string;
  radiologistNote?: string;
  clinicalHistory?: string;
}

export interface ReportAnalysis {
  clinicalHistory: string;
  labCorrelations: string;
  keyFindings: string;
  followUpSuggestions: string;
}
