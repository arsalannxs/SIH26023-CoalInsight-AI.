import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  MiningDocument, 
  ExtractedField, 
  FieldConflict, 
  GeneratedReport, 
  ActivityLog, 
  ChatMessage, 
  Subsidiary, 
  ReportStatus, 
  ReviewStatus 
} from '../types';
import { 
  INITIAL_DOCUMENTS, 
  INITIAL_EXTRACTED_FIELDS, 
  INITIAL_CONFLICTS, 
  INITIAL_REPORTS, 
  INITIAL_ACTIVITY_LOGS 
} from '../data/demoData';

export type NavigationSection = 
  | 'overview'
  | 'library'
  | 'upload'
  | 'extracted'
  | 'assistant'
  | 'topics'
  | 'analytics'
  | 'reports'
  | 'reviews'
  | 'activity'
  | 'settings';

interface AppContextType {
  activeSection: NavigationSection;
  setActiveSection: (sec: NavigationSection) => void;
  activeSubsidiary: Subsidiary | 'ALL';
  setActiveSubsidiary: (sub: Subsidiary | 'ALL') => void;
  documents: MiningDocument[];
  extractedFields: ExtractedField[];
  conflicts: FieldConflict[];
  reports: GeneratedReport[];
  activityLogs: ActivityLog[];
  chatMessages: ChatMessage[];
  isQueryLoading: boolean;
  selectedDocForView: MiningDocument | null;
  setSelectedDocForView: (doc: MiningDocument | null) => void;
  fieldToCorrect: ExtractedField | null;
  setFieldToCorrect: (field: ExtractedField | null) => void;
  isAddRecordModalOpen: boolean;
  setIsAddRecordModalOpen: (open: boolean) => void;
  isBackendHealthy: boolean;
  geminiConfigured: boolean;
  searchFilter: string;
  setSearchFilter: (term: string) => void;
  selectedTopicFilter: string | null;
  setSelectedTopicFilter: (topic: string | null) => void;
  
  // Actions
  loadDemoData: () => void;
  resetDemoData: () => void;
  addDocument: (doc: MiningDocument) => void;
  verifyField: (fieldId: string, reviewer?: string) => void;
  correctField: (fieldId: string, newValue: string | number, reason: string, reviewer?: string) => void;
  rejectField: (fieldId: string, reviewer?: string) => void;
  addManualField: (newField: Omit<ExtractedField, 'id'>) => void;
  createReport: (report: Omit<GeneratedReport, 'id' | 'createdAt' | 'updatedAt' | 'auditTrail' | 'version'>) => GeneratedReport;
  updateReport: (report: GeneratedReport) => void;
  updateReportStatus: (reportId: string, status: ReportStatus, notes?: string) => void;
  askAssistant: (query: string) => Promise<void>;
  resolveConflict: (conflictId: string) => void;
  logActivity: (action: string, target: string, category: ActivityLog['category'], details?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_DOCS = 'coalinsight_docs_v1';
const LOCAL_STORAGE_KEY_FIELDS = 'coalinsight_fields_v1';
const LOCAL_STORAGE_KEY_REPORTS = 'coalinsight_reports_v1';
const LOCAL_STORAGE_KEY_LOGS = 'coalinsight_logs_v1';
const LOCAL_STORAGE_KEY_CONFLICTS = 'coalinsight_conflicts_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<NavigationSection>('overview');
  const [activeSubsidiary, setActiveSubsidiary] = useState<Subsidiary | 'ALL'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | null>(null);

  // Initialize state with local storage or initial demo data
  const [documents, setDocuments] = useState<MiningDocument[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_DOCS);
      return stored ? JSON.parse(stored) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_FIELDS);
      return stored ? JSON.parse(stored) : INITIAL_EXTRACTED_FIELDS;
    } catch {
      return INITIAL_EXTRACTED_FIELDS;
    }
  });

  const [conflicts, setConflicts] = useState<FieldConflict[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CONFLICTS);
      return stored ? JSON.parse(stored) : INITIAL_CONFLICTS;
    } catch {
      return INITIAL_CONFLICTS;
    }
  });

  const [reports, setReports] = useState<GeneratedReport[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_REPORTS);
      return stored ? JSON.parse(stored) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_LOGS);
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [selectedDocForView, setSelectedDocForView] = useState<MiningDocument | null>(null);
  const [fieldToCorrect, setFieldToCorrect] = useState<ExtractedField | null>(null);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);
  const [geminiConfigured, setGeminiConfigured] = useState(false);
  const [isQueryLoading, setIsQueryLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Welcome to the **CoalInsight AI Research Assistant**. All answers are grounded directly in your uploaded CIL & CMPDI documents with verifiable citations.\n\nTry asking about:\n- *"Summarise coal production figures for FY 2023-24."*\n- *"What are the proved reserves in Korba Coalfield?"*\n- *"Compare reported figures between Gevra documents."*\n- *"Draft a reply for parliamentary query USQ 2481."*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      grounded: true,
      engine: 'CoalInsight Evidence Engine',
    },
  ]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_DOCS, JSON.stringify(documents));
      localStorage.setItem(LOCAL_STORAGE_KEY_FIELDS, JSON.stringify(extractedFields));
      localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(reports));
      localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(activityLogs));
      localStorage.setItem(LOCAL_STORAGE_KEY_CONFLICTS, JSON.stringify(conflicts));
    } catch (e) {
      console.warn('Storage sync issue:', e);
    }
  }, [documents, extractedFields, reports, activityLogs, conflicts]);

  // Check health and Gemini API availability
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setIsBackendHealthy(data.status === 'ok');
        setGeminiConfigured(Boolean(data.geminiConfigured));
      })
      .catch((err) => {
        console.warn('Health check failed, running local engine:', err);
        setIsBackendHealthy(false);
      });
  }, []);

  const logActivity = (action: string, target: string, category: ActivityLog['category'], details?: string) => {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      action,
      target,
      user: 'Reporting Officer (CMPDI/CIL)',
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      category,
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const loadDemoData = () => {
    setDocuments(INITIAL_DOCUMENTS);
    setExtractedFields(INITIAL_EXTRACTED_FIELDS);
    setConflicts(INITIAL_CONFLICTS);
    setReports(INITIAL_REPORTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    logActivity('Loaded Synthetic Demo Dataset', '6 CMPDI & CIL Subsidiary Documents', 'upload', 'Restored pristine demonstration benchmark collection.');
  };

  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_DOCS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_FIELDS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_REPORTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_LOGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CONFLICTS);
    setDocuments(INITIAL_DOCUMENTS);
    setExtractedFields(INITIAL_EXTRACTED_FIELDS);
    setConflicts(INITIAL_CONFLICTS);
    setReports(INITIAL_REPORTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    logActivity('Reset Application State', 'Workspace Cache', 'correction', 'Cleaned storage and restored baseline demonstration configuration.');
  };

  const addDocument = (doc: MiningDocument) => {
    setDocuments((prev) => [doc, ...prev]);
    logActivity('Uploaded New Document', doc.title, 'upload', `Type: ${doc.documentType}, Size: ${doc.fileSize}`);
  };

  const verifyField = (fieldId: string, reviewer = 'Er. V. K. Sharma (Reviewer)') => {
    setExtractedFields((prev) =>
      prev.map((f) => {
        if (f.id === fieldId) {
          return {
            ...f,
            status: 'VERIFIED' as ReviewStatus,
            verifiedBy: reviewer,
            verifiedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          };
        }
        return f;
      })
    );
    const target = extractedFields.find((f) => f.id === fieldId);
    if (target) {
      logActivity('Verified Extracted Field', `${target.fieldName} (${target.value} ${target.unit || ''})`, 'extraction', `Verified by ${reviewer}`);
    }
  };

  const correctField = (fieldId: string, newValue: string | number, reason: string, reviewer = 'Er. V. K. Sharma (Reviewer)') => {
    let oldVal: string | number = '';
    let fName = '';
    setExtractedFields((prev) =>
      prev.map((f) => {
        if (f.id === fieldId) {
          oldVal = f.value;
          fName = f.fieldName;
          return {
            ...f,
            value: newValue,
            status: 'MANUALLY_CORRECTED' as ReviewStatus,
            correctionReason: reason,
            verifiedBy: reviewer,
            verifiedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          };
        }
        return f;
      })
    );
    logActivity(
      'Corrected Extracted Value',
      `${fName}: changed from "${oldVal}" to "${newValue}"`,
      'correction',
      `Reason: ${reason} (Audited by ${reviewer})`
    );
  };

  const rejectField = (fieldId: string, reviewer = 'Er. V. K. Sharma (Reviewer)') => {
    setExtractedFields((prev) =>
      prev.map((f) => {
        if (f.id === fieldId) {
          return {
            ...f,
            status: 'REJECTED' as ReviewStatus,
            verifiedBy: reviewer,
            verifiedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          };
        }
        return f;
      })
    );
    const target = extractedFields.find((f) => f.id === fieldId);
    if (target) {
      logActivity('Rejected Extracted Value', target.fieldName, 'correction', `Flagged as invalid or unverified by ${reviewer}`);
    }
  };

  const addManualField = (newFieldData: Omit<ExtractedField, 'id'>) => {
    const newField: ExtractedField = {
      ...newFieldData,
      id: `FLD-${Date.now().toString().slice(-4)}`,
    };
    setExtractedFields((prev) => [newField, ...prev]);
    logActivity('Manually Added Structured Field', `${newField.fieldName} = ${newField.value} ${newField.unit || ''}`, 'extraction', `Source: ${newField.sourceDocTitle}`);
  };

  const createReport = (reportData: Omit<GeneratedReport, 'id' | 'createdAt' | 'updatedAt' | 'auditTrail' | 'version'>): GeneratedReport => {
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    const newReport: GeneratedReport = {
      ...reportData,
      id: `REP-${Date.now().toString().slice(-5)}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
      auditTrail: [
        {
          action: 'Report Drafted',
          user: reportData.author,
          timestamp: now,
          comment: 'Generated via Report Builder',
        },
      ],
    };
    setReports((prev) => [newReport, ...prev]);
    logActivity('Created New Technical Report', newReport.title, 'report', `Type: ${newReport.reportType}, Status: ${newReport.status}`);
    return newReport;
  };

  const updateReport = (updated: GeneratedReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...updated, updatedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) } : r))
    );
  };

  const updateReportStatus = (reportId: string, status: ReportStatus, notes?: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const now = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
          return {
            ...r,
            status,
            updatedAt: now,
            approvalNotes: notes || r.approvalNotes,
            auditTrail: [
              ...r.auditTrail,
              {
                action: `Status Changed to ${status}`,
                user: 'Er. V. K. Sharma (Reviewer)',
                timestamp: now,
                comment: notes || `Marked as ${status}`,
              },
            ],
          };
        }
        return r;
      })
    );
    const target = reports.find((r) => r.id === reportId);
    if (target) {
      logActivity(`Report Status Updated: ${status}`, target.title, 'approval', notes);
    }
  };

  const resolveConflict = (conflictId: string) => {
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, resolved: true } : c))
    );
    const target = conflicts.find((c) => c.id === conflictId);
    if (target) {
      logActivity('Resolved Data Conflict', target.fieldName, 'correction', 'Reviewed conflicting sources and reconciled final figures.');
    }
  };

  const askAssistant = async (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsQueryLoading(true);

    try {
      const response = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          documents,
          focusSubsidiary: activeSubsidiary,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to reach research endpoint`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-res-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounded: data.grounded,
        engine: data.engine,
        citations: data.sources || [],
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      logActivity('AI Research Query Answered', `"${query.slice(0, 40)}..."`, 'research', `Engine: ${data.engine}`);
    } catch (err: any) {
      console.warn('API research request failed, applying client-side fallback:', err);
      // Client-side fallback if server fails
      const matched = documents.flatMap((d) =>
        d.passages
          .filter((p) => p.text.toLowerCase().includes(query.toLowerCase().split(' ')[0] || ''))
          .map((p) => ({
            docId: d.id,
            docTitle: d.title,
            sourceOrg: d.sourceOrg,
            period: d.reportingPeriod,
            page: p.page,
            text: p.text,
          }))
      ).slice(0, 3);

      const fallbackContent = matched.length > 0
        ? `### Grounded Findings for "${query}":\n\n` +
          matched.map((m, i) => `**${i + 1}. [${m.docTitle}, Page ${m.page}]**\n> "${m.text}"`).join('\n\n') +
          `\n\n*Source-grounded via local index.*`
        : `**Evidence Not Found**: No passages matching "${query}" were located in the repository. Please review search terms or upload relevant documents.`;

      const assistantMsg: ChatMessage = {
        id: `msg-res-${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounded: matched.length > 0,
        engine: 'Local Grounded Matcher (Offline)',
        citations: matched,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsQueryLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeSection,
        setActiveSection,
        activeSubsidiary,
        setActiveSubsidiary,
        documents,
        extractedFields,
        conflicts,
        reports,
        activityLogs,
        chatMessages,
        isQueryLoading,
        selectedDocForView,
        setSelectedDocForView,
        fieldToCorrect,
        setFieldToCorrect,
        isAddRecordModalOpen,
        setIsAddRecordModalOpen,
        isBackendHealthy,
        geminiConfigured,
        searchFilter,
        setSearchFilter,
        selectedTopicFilter,
        setSelectedTopicFilter,
        loadDemoData,
        resetDemoData,
        addDocument,
        verifyField,
        correctField,
        rejectField,
        addManualField,
        createReport,
        updateReport,
        updateReportStatus,
        askAssistant,
        resolveConflict,
        logActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
