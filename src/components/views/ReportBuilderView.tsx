import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  Check, 
  CheckCircle2, 
  Send, 
  Edit3, 
  Eye, 
  Loader2, 
  Building2, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GeneratedReport, Subsidiary } from '../../types';

export const ReportBuilderView: React.FC = () => {
  const { 
    documents, 
    extractedFields, 
    createReport, 
    setActiveSection, 
    activeSubsidiary 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reportType, setReportType] = useState('Geological Summary');
  const [title, setTitle] = useState('Consolidated Geological Appraisal & Mining Production Review');
  const [period, setPeriod] = useState('FY 2023-24');
  const [targetSubsidiary, setTargetSubsidiary] = useState<Subsidiary | 'ALL'>('CMPDI');
  const [citationStyle, setCitationStyle] = useState('CMPDI Statutory Standard (Bracketed)');
  const [authorName, setAuthorName] = useState('Dr. S. K. Mukherjee (Chief Geologist)');
  
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(
    documents.slice(0, 3).map((d) => d.id)
  );

  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>(
    extractedFields.slice(0, 5).map((f) => f.id)
  );

  const [includedSections, setIncludedSections] = useState<string[]>([
    'Executive Summary',
    'Purpose and Scope',
    'Source Documents & Repository References',
    'Key Geological Findings & Borehole Analysis',
    'Verified Production Figures & Stripping Log',
    'Inconsistency & Data-Gap Analysis',
    'Statutory Limitations & Disclaimer',
    'Full Evidence References'
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedReport | null>(null);
  const [editableMarkdown, setEditableMarkdown] = useState('');

  const reportTypes = [
    'Geological Summary',
    'Mining Production Report',
    'Historical Comparison Report',
    'Document Compilation Report',
    'Data-Quality & Inconsistency Report',
    'Administrative Query Response Draft',
    'Parliamentary Question Response Draft',
    'Custom Technical Research Summary',
  ];

  const handleToggleDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleToggleField = (id: string) => {
    setSelectedFieldIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleToggleSection = (sec: string) => {
    setIncludedSections((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    const relevantDocs = documents.filter((d) => selectedDocIds.includes(d.id));
    const relevantFields = extractedFields.filter((f) => selectedFieldIds.includes(f.id));

    try {
      const res = await fetch('/api/gemini/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          title,
          period,
          subsidiary: targetSubsidiary,
          selectedDocs: relevantDocs,
          verifiedRecords: relevantFields,
          sections: includedSections,
        }),
      });

      const data = await res.json();
      const reportContent = data.reportMarkdown || '';

      const report = createReport({
        title,
        reportType,
        reportingPeriod: period,
        subsidiary: targetSubsidiary,
        status: 'Draft',
        author: authorName,
        markdownContent: reportContent,
        selectedDocIds,
        verifiedFieldIds: selectedFieldIds,
      });

      setGeneratedDraft(report);
      setEditableMarkdown(reportContent);
      setStep(3);
    } catch (err) {
      console.error('Failed to generate report draft:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!editableMarkdown) return;
    const blob = new Blob([editableMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadDoc = () => {
    if (!editableMarkdown) return;
    const blob = new Blob([editableMarkdown], { type: 'application/msword;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.doc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Wizard Header */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-4 no-print">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C47A43] text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202B38]">Automated Statutory Report Builder</h2>
              <p className="text-xs text-[#6B7785] mt-0.5">
                Generate structured, verifiable drafts compliant with CMPDI technical and parliamentary review standards.
              </p>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              onClick={() => setStep(1)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                step === 1 ? 'bg-[#17263C] text-white' : 'bg-[#F3F6F8] text-[#6B7785]'
              }`}
            >
              1. Type & Scope
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7785]" />
            <span
              onClick={() => setStep(2)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                step === 2 ? 'bg-[#17263C] text-white' : 'bg-[#F3F6F8] text-[#6B7785]'
              }`}
            >
              2. Data & Sections
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7785]" />
            <span
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                step === 3 ? 'bg-[#C47A43] text-white' : 'bg-[#F3F6F8] text-[#6B7785]'
              }`}
            >
              3. Review & Export
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: Metadata & Type Selection */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs p-6 space-y-5 text-xs max-w-3xl mx-auto">
          <div className="font-bold text-sm text-[#202B38] pb-2 border-b border-[#DFE5EB]">
            Step 1: Define Report Framework & Classification
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Select Statutory Report Template</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {reportTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReportType(t)}
                    className={`p-3 text-left rounded-lg border transition-all text-xs cursor-pointer ${
                      reportType === t
                        ? 'border-[#C47A43] bg-[#C47A43]/10 font-bold text-[#17263C] shadow-2xs ring-1 ring-[#C47A43]'
                        : 'border-[#DFE5EB] bg-white text-[#435164] hover:bg-[#F3F6F8]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Official Report Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFE5EB] font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#202B38] mb-1">Reporting Period</label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFE5EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202B38] mb-1">Subsidiary / Agency Target</label>
                <select
                  value={targetSubsidiary}
                  onChange={(e) => setTargetSubsidiary(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFE5EB] bg-white font-medium"
                >
                  <option value="ALL">All Subsidiaries (CIL Consolidated)</option>
                  <option value="CMPDI">CMPDI</option>
                  <option value="SECL">SECL</option>
                  <option value="MCL">MCL</option>
                  <option value="BCCL">BCCL</option>
                  <option value="CCL">CCL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#202B38] mb-1">Citation Style</label>
                <select
                  value={citationStyle}
                  onChange={(e) => setCitationStyle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFE5EB] bg-white"
                >
                  <option value="CMPDI Statutory Standard (Bracketed)">CMPDI Statutory Standard (Bracketed with Page)</option>
                  <option value="Parliamentary Briefing Style">Parliamentary Written Answer Style (Numbered)</option>
                  <option value="Academic Harvard Style">Author-Date Harvard Geological Standard</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#202B38] mb-1">Author / Lead Technical Compiler</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFE5EB]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#DFE5EB]">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#17263C] hover:bg-[#17263C]/90 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              Continue to Data Selection <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Grounding Documents & Sections */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs p-6 space-y-5 text-xs max-w-4xl mx-auto">
          <div className="font-bold text-sm text-[#202B38] pb-2 border-b border-[#DFE5EB]">
            Step 2: Grounding Documents, Parameters & Report Sections
          </div>

          {/* Select Source Documents */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-[#202B38]">
                Select Source Documents to Ground the Report ({selectedDocIds.length} selected)
              </label>
              <span className="text-[11px] text-[#6B7785]">Only verified documents will be cited</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {documents.map((d) => (
                <label
                  key={d.id}
                  className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-colors ${
                    selectedDocIds.includes(d.id)
                      ? 'bg-[#C47A43]/10 border-[#C47A43] text-[#17263C]'
                      : 'bg-[#F3F6F8]/60 border-[#DFE5EB] text-[#435164]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDocIds.includes(d.id)}
                    onChange={() => handleToggleDoc(d.id)}
                    className="mt-0.5 rounded text-[#C47A43]"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{d.title}</div>
                    <div className="text-[10px] text-[#6B7785] font-mono mt-0.5">
                      {d.sourceOrg} · {d.reportingPeriod}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Select Verified Fields */}
          <div className="space-y-2">
            <label className="font-semibold text-[#202B38]">
              Select Verified Quantitative Figures to Include in Report Tables ({selectedFieldIds.length} selected)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {extractedFields.map((f) => (
                <label
                  key={f.id}
                  className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-colors ${
                    selectedFieldIds.includes(f.id)
                      ? 'bg-[#278A85]/10 border-[#278A85] text-[#17263C]'
                      : 'bg-[#F3F6F8]/60 border-[#DFE5EB] text-[#435164]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFieldIds.includes(f.id)}
                    onChange={() => handleToggleField(f.id)}
                    className="mt-0.5 rounded text-[#278A85]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold truncate">{f.fieldName}</span>
                      <span className="font-mono font-bold text-[#17263C] shrink-0 ml-1">
                        {f.value} {f.unit}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#6B7785] font-mono truncate">
                      {f.sourceDocTitle} (p. {f.pageNumber})
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Report Sections Checklist */}
          <div className="space-y-2">
            <label className="font-semibold text-[#202B38]">Required Statutory Sections</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Executive Summary',
                'Purpose and Scope',
                'Source Documents & Repository References',
                'Key Geological Findings & Borehole Analysis',
                'Verified Production Figures & Stripping Log',
                'Inconsistency & Data-Gap Analysis',
                'Statutory Limitations & Disclaimer',
                'Full Evidence References',
              ].map((sec) => (
                <label key={sec} className="flex items-center gap-2 p-2 rounded bg-[#F3F6F8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includedSections.includes(sec)}
                    onChange={() => handleToggleSection(sec)}
                    className="rounded text-[#C47A43]"
                  />
                  <span>{sec}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-[#DFE5EB]">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-medium text-[#6B7785] hover:bg-[#F3F6F8] rounded-lg cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || selectedDocIds.length === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#C47A43] hover:bg-[#C47A43]/90 disabled:opacity-50 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Grounded Report Draft...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Synthesize Report Draft
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Live Editable Draft, Print View & Export */}
      {step === 3 && generatedDraft && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-[#DFE5EB] shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold bg-[#17263C] text-white px-2 py-0.5 rounded">
                {generatedDraft.id}
              </span>
              <span className="text-[#6B7785]">·</span>
              <span className="font-semibold text-[#202B38]">{generatedDraft.title}</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#B7791F]/10 text-[#B7791F]">
                DRAFT - NOT YET APPROVED
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-semibold text-[#17263C] bg-[#F3F6F8] hover:bg-[#17263C] hover:text-white rounded-lg transition-colors border border-[#DFE5EB] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="px-3 py-1.5 text-xs font-semibold text-[#17263C] bg-[#F3F6F8] hover:bg-[#17263C] hover:text-white rounded-lg transition-colors border border-[#DFE5EB] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Markdown (.md)
              </button>
              <button
                onClick={handleDownloadDoc}
                className="px-3 py-1.5 text-xs font-semibold text-[#17263C] bg-[#F3F6F8] hover:bg-[#17263C] hover:text-white rounded-lg transition-colors border border-[#DFE5EB] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Word (.doc)
              </button>
              <button
                onClick={() => setActiveSection('reviews')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#C47A43] hover:bg-[#C47A43]/90 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit to Review & Approvals
              </button>
            </div>
          </div>

          {/* Editable Draft View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 no-print">
            {/* Editor Pane */}
            <div className="bg-white p-5 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#DFE5EB]">
                <div className="font-bold text-xs text-[#202B38] flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-[#C47A43]" />
                  Markdown Report Editor (Reviewer Comments & Revisions)
                </div>
                <span className="text-[10px] text-[#6B7785]">Edit text directly before sign-off</span>
              </div>
              <textarea
                rows={22}
                value={editableMarkdown}
                onChange={(e) => setEditableMarkdown(e.target.value)}
                className="w-full p-4 font-mono text-xs leading-relaxed border border-[#DFE5EB] rounded-lg focus:outline-hidden focus:border-[#C47A43] bg-[#F3F6F8]/40"
              />
            </div>

            {/* Formatted Technical Preview Pane */}
            <div className="bg-white p-6 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-4 overflow-y-auto max-h-[620px] print:shadow-none print:border-none">
              <div className="flex items-center justify-between pb-2 border-b border-[#DFE5EB]">
                <div className="font-bold text-xs text-[#202B38] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#278A85]" />
                  Statutory Formatted Document Preview
                </div>
                <span className="font-mono text-[10px] text-[#2E805A]">Live Rendered</span>
              </div>

              <div className="prose prose-xs max-w-none text-xs text-[#202B38] whitespace-pre-wrap leading-relaxed font-sans">
                {editableMarkdown}
              </div>
            </div>
          </div>

          {/* Printable Report View (Visible when printing) */}
          <div className="hidden print:block p-8 bg-white text-black font-sans">
            <div className="text-center pb-4 border-b-2 border-black mb-6">
              <h1 className="text-xl font-bold uppercase">{title}</h1>
              <div className="text-xs mt-1">Coal India Limited · CMPDI Statutory Report System</div>
              <div className="text-xs text-gray-600 mt-0.5">Period: {period} · Reference: {generatedDraft.id}</div>
            </div>
            <div className="whitespace-pre-wrap text-xs leading-relaxed">
              {editableMarkdown}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
