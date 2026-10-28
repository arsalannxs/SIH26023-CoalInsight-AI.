import React from 'react';
import { 
  FolderArchive, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  UploadCloud, 
  Pickaxe, 
  ArrowUpRight, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { extractTopicsAndFrequencies } from '../../utils/textProcessing';
import opencastImg from '../../assets/images/coal_opencast_mine_1793211245638.jpg';

export const OverviewView: React.FC = () => {
  const { 
    documents, 
    extractedFields, 
    reports, 
    activityLogs, 
    conflicts, 
    setActiveSection, 
    setSelectedDocForView, 
    activeSubsidiary 
  } = useApp();

  const filteredDocs = activeSubsidiary === 'ALL'
    ? documents
    : documents.filter((d) => d.sourceOrg === activeSubsidiary);

  const processedCount = filteredDocs.filter((d) => d.status === 'Processed').length;
  const reviewRequiredCount = filteredDocs.filter((d) => d.status === 'Needs Review').length;
  const flaggedFieldsCount = extractedFields.filter((f) => f.status === 'NEEDS_REVIEW').length;
  const verifiedFieldsCount = extractedFields.filter((f) => f.status === 'VERIFIED' || f.status === 'MANUALLY_CORRECTED').length;
  const approvedReportsCount = reports.filter((r) => r.status === 'Approved').length;

  const topics = extractTopicsAndFrequencies(filteredDocs).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#DFE5EB] bg-[#17263C] text-white shadow-sm">
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src={opencastImg}
            alt="Opencast Coal Mining Operations"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17263C] via-[#17263C]/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-white text-xs font-mono">
              <span className="text-[#C47A43] font-bold">SIH26023</span>
              <span>·</span>
              <span>Ministry of Coal & CIL Subsidiary Platform</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Your Mining Data. Organised, Verified and Ready to Use.
            </h1>
            <p className="text-sm text-[#DFE5EB]/80 leading-relaxed">
              Automated document digitization, OCR processing, structured parameter verification, evidence-grounded research, and statutory reporting for CMPDI, SECL, MCL, BCCL, and CCL.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setActiveSection('upload')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#C47A43] hover:bg-[#C47A43]/90 rounded-lg shadow-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Document
            </button>
            <button
              onClick={() => setActiveSection('assistant')}
              className="px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#278A85]" />
              Ask AI Assistant
            </button>
            <button
              onClick={() => setActiveSection('reports')}
              className="px-4 py-2 text-xs font-semibold text-[#DFE5EB] hover:text-white bg-transparent hover:bg-white/5 rounded-lg border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Build Statutory Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-[#DFE5EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7785] text-xs">
            <span>Uploaded Docs</span>
            <FolderArchive className="w-4 h-4 text-[#435164]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#202B38] mt-2 tabular-nums">
            {filteredDocs.length}
          </div>
          <div className="text-[11px] text-[#278A85] mt-1 font-medium">
            Active in library
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DFE5EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7785] text-xs">
            <span>Processed</span>
            <CheckCircle2 className="w-4 h-4 text-[#2E805A]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#2E805A] mt-2 tabular-nums">
            {processedCount}
          </div>
          <div className="text-[11px] text-[#6B7785] mt-1">
            9-stage pipeline verified
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DFE5EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7785] text-xs">
            <span>Needs Review</span>
            <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#B7791F] mt-2 tabular-nums">
            {reviewRequiredCount}
          </div>
          <div className="text-[11px] text-[#B7791F] mt-1 font-medium">
            Awaiting human check
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DFE5EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7785] text-xs">
            <span>Verified Values</span>
            <ShieldCheck className="w-4 h-4 text-[#278A85]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#202B38] mt-2 tabular-nums">
            {verifiedFieldsCount}
          </div>
          <div className="text-[11px] text-[#6B7785] mt-1">
            Ground-truthed parameters
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DFE5EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7785] text-xs">
            <span>Reports Drafted</span>
            <FileText className="w-4 h-4 text-[#C47A43]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#202B38] mt-2 tabular-nums">
            {reports.length}
          </div>
          <div className="text-[11px] text-[#2E805A] mt-1 font-medium">
            {approvedReportsCount} approved
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DFE5EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7785] text-xs">
            <span>Audit Inconsistencies</span>
            <AlertTriangle className="w-4 h-4 text-[#C44747]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#C44747] mt-2 tabular-nums">
            {conflicts.filter((c) => !c.resolved).length}
          </div>
          <div className="text-[11px] text-[#C44747] mt-1 font-medium">
            Cross-doc conflict flags
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Documents & Topic Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Documents & Discrepancies */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Ingested Documents */}
          <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#DFE5EB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-[#C47A43]" />
                <h2 className="font-bold text-sm text-[#202B38]">Recently Processed Documents</h2>
              </div>
              <button
                onClick={() => setActiveSection('library')}
                className="text-xs font-semibold text-[#278A85] hover:text-[#17263C] flex items-center gap-1"
              >
                View Library <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#DFE5EB]">
              {filteredDocs.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocForView(doc)}
                  className="p-4 hover:bg-[#F3F6F8]/60 transition-colors cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-mono font-bold text-[#17263C] bg-[#17263C]/10 px-1.5 py-0.5 rounded">
                        {doc.sourceOrg}
                      </span>
                      <span className="text-[#6B7785]">·</span>
                      <span className="text-[#6B7785]">{doc.documentType}</span>
                      <span className="text-[#6B7785]">·</span>
                      <span className="text-[#6B7785]">{doc.reportingPeriod}</span>
                    </div>
                    <div className="font-semibold text-xs text-[#202B38] line-clamp-1 hover:text-[#C47A43]">
                      {doc.title}
                    </div>
                    <p className="text-[11px] text-[#6B7785] line-clamp-1">
                      {doc.summaryText}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        doc.status === 'Processed'
                          ? 'bg-[#2E805A]/10 text-[#2E805A]'
                          : 'bg-[#B7791F]/10 text-[#B7791F]'
                      }`}
                    >
                      {doc.status}
                    </span>
                    <div className="text-[10px] text-[#6B7785] mt-1 font-mono">
                      {doc.passages.length} passages · {doc.tables.length} tables
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Data Conflicts & Inconsistencies */}
          {conflicts.filter((c) => !c.resolved).length > 0 && (
            <div className="bg-[#FFFDFB] rounded-xl border border-[#C47A43]/30 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C47A43]" />
                  <h3 className="font-bold text-xs text-[#202B38]">
                    Cross-Document Value Discrepancies Requiring Reconciliation
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSection('extracted')}
                  className="text-xs font-semibold text-[#C47A43] hover:underline"
                >
                  Resolve in Extracted Data
                </button>
              </div>

              {conflicts.filter((c) => !c.resolved).slice(0, 1).map((conflict) => (
                <div key={conflict.id} className="bg-white p-3 rounded-lg border border-[#DFE5EB] text-xs space-y-2">
                  <div className="font-semibold text-[#202B38] flex items-center justify-between">
                    <span>{conflict.fieldName} ({conflict.mineRef})</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#C44747]/10 text-[#C44747]">
                      {conflict.severity} severity
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2 bg-[#F3F6F8] rounded border border-[#DFE5EB]">
                      <div className="text-[#6B7785] truncate">{conflict.docA.docTitle} (p. {conflict.docA.page})</div>
                      <div className="font-mono font-bold text-[#17263C] mt-0.5">
                        {conflict.docA.value} {conflict.docA.unit}
                      </div>
                    </div>
                    <div className="p-2 bg-[#F3F6F8] rounded border border-[#DFE5EB]">
                      <div className="text-[#6B7785] truncate">{conflict.docB.docTitle} (p. {conflict.docB.page})</div>
                      <div className="font-mono font-bold text-[#C47A43] mt-0.5">
                        {conflict.docB.value} {conflict.docB.unit}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6B7785] italic">
                    Note: {conflict.discrepancyNote}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Topics & Recent Activity */}
        <div className="space-y-6">
          {/* Frequent Geological Topics */}
          <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pickaxe className="w-4 h-4 text-[#278A85]" />
                <h3 className="font-bold text-xs text-[#202B38]">Frequent Geological Topics</h3>
              </div>
              <button
                onClick={() => setActiveSection('topics')}
                className="text-xs font-semibold text-[#278A85] hover:underline"
              >
                Explorer
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <button
                  key={t.text}
                  onClick={() => setActiveSection('topics')}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#F3F6F8] text-[#435164] hover:bg-[#C47A43]/10 hover:text-[#C47A43] transition-colors border border-[#DFE5EB] cursor-pointer"
                >
                  {t.text} <span className="font-mono text-[10px] text-[#6B7785]">({t.weight})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Audit Activity */}
          <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#202B38]">Recent System Activity</h3>
              <button
                onClick={() => setActiveSection('activity')}
                className="text-xs font-semibold text-[#278A85] hover:underline"
              >
                Full History
              </button>
            </div>

            <div className="space-y-2.5">
              {activityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs space-y-0.5 border-b border-[#DFE5EB]/60 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#202B38] truncate">{log.action}</span>
                    <span className="font-mono text-[#6B7785] text-[10px] shrink-0">{log.timestamp.split(' ')[1] || log.timestamp}</span>
                  </div>
                  <div className="text-[#435164] text-[11px] truncate">
                    {log.target}
                  </div>
                  <div className="text-[10px] text-[#6B7785] flex items-center justify-between">
                    <span>{log.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Guided 3-Minute Demo Card */}
          <div className="bg-[#17263C] text-white rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-[#C47A43] uppercase tracking-wider font-mono">
              Smart India Hackathon Walkthrough
            </div>
            <p className="text-xs text-[#DFE5EB]/80 leading-relaxed">
              1. Inspect documents in <strong>Library</strong><br/>
              2. Review & edit parameter in <strong>Extracted Data</strong><br/>
              3. Ask questions in <strong>AI Assistant</strong> with citations<br/>
              4. Generate draft report in <strong>Report Builder</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
