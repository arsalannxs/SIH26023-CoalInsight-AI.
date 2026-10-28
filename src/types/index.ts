export type Subsidiary = 
  | 'CMPDI' 
  | 'SECL' 
  | 'MCL' 
  | 'BCCL' 
  | 'CCL' 
  | 'ECL' 
  | 'WCL' 
  | 'NCL' 
  | 'NEC';

export type DocumentType = 
  | 'Geological Appraisal'
  | 'Mining Production Bulletin'
  | 'Borehole Exploration Log'
  | 'Environmental Clearance'
  | 'Statutory Return'
  | 'Parliamentary Query Brief';

export type DocumentCategory = 
  | 'Geology & Exploration'
  | 'Production & Dispatch'
  | 'Overburden & Stripping'
  | 'Regulatory & Compliance'
  | 'Coal Quality & Washability';

export type ProcessingStatus = 
  | 'Processed'
  | 'Needs Review'
  | 'Processing'
  | 'Ingestion Failed';

export type ReviewStatus = 
  | 'VERIFIED'
  | 'NEEDS_REVIEW'
  | 'REJECTED'
  | 'MANUALLY_CORRECTED';

export type ReportStatus = 
  | 'Draft'
  | 'Processing'
  | 'Needs Review'
  | 'Changes Requested'
  | 'Reviewed'
  | 'Approved'
  | 'Archived';

export interface DocumentPassage {
  id: string;
  page: number;
  text: string;
  sectionTitle?: string;
  highlightedTerms?: string[];
}

export interface ExtractedTable {
  id: string;
  title: string;
  pageNumber: number;
  headers: string[];
  rows: string[][];
}

export interface ExtractedField {
  id: string;
  docId: string;
  sourceDocTitle: string;
  sourceOrg: Subsidiary;
  pageNumber: number;
  fieldName: string;
  category: 'production' | 'geology' | 'exploration' | 'quality' | 'stripping';
  value: string | number;
  originalValue: string | number;
  unit?: string;
  status: ReviewStatus;
  extractionMethod: 'Digital Text Parser' | 'OCR Engine v2' | 'Table Matrix Parser' | 'Manual Entry';
  confidenceScore: number; // 0-100
  supportingPassage: string;
  verifiedBy?: string;
  verifiedAt?: string;
  correctionReason?: string;
}

export interface MiningDocument {
  id: string;
  title: string;
  documentType: DocumentType;
  sourceOrg: Subsidiary;
  reportingPeriod: string; // e.g. "FY 2023-24", "Q3 FY 2024-25"
  uploadDate: string;
  fileSize: string;
  mimeType: string;
  mineProjectRef: string;
  category: DocumentCategory;
  status: ProcessingStatus;
  tags: string[];
  passages: DocumentPassage[];
  tables: ExtractedTable[];
  fieldsCount: number;
  verifiedCount: number;
  flaggedCount: number;
  summaryText: string;
  fileUrl?: string;
}

export interface FieldConflict {
  id: string;
  fieldName: string;
  mineRef: string;
  period: string;
  docA: {
    docId: string;
    docTitle: string;
    sourceOrg: Subsidiary;
    value: string | number;
    unit?: string;
    page: number;
  };
  docB: {
    docId: string;
    docTitle: string;
    sourceOrg: Subsidiary;
    value: string | number;
    unit?: string;
    page: number;
  };
  discrepancyNote: string;
  severity: 'high' | 'medium' | 'low';
  resolved: boolean;
}

export interface ResearchCitation {
  docId: string;
  docTitle: string;
  sourceOrg: string;
  period: string;
  page: number;
  text: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  grounded?: boolean;
  engine?: string;
  citations?: ResearchCitation[];
  isDraftReport?: boolean;
}

export interface GeneratedReport {
  id: string;
  title: string;
  reportType: string;
  reportingPeriod: string;
  subsidiary: Subsidiary | 'ALL';
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  author: string;
  reviewer?: string;
  markdownContent: string;
  selectedDocIds: string[];
  verifiedFieldIds: string[];
  version: number;
  approvalNotes?: string;
  auditTrail: {
    action: string;
    user: string;
    timestamp: string;
    comment?: string;
  }[];
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  user: string;
  timestamp: string;
  category: 'upload' | 'extraction' | 'correction' | 'research' | 'report' | 'approval';
  details?: string;
}
