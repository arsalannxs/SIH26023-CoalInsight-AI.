import React from 'react';
import { 
  Search, 
  RotateCcw, 
  Sparkles, 
  Building2, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Subsidiary } from '../../types';

export const Header: React.FC = () => {
  const { 
    activeSection, 
    activeSubsidiary, 
    setActiveSubsidiary, 
    searchFilter, 
    setSearchFilter, 
    loadDemoData, 
    resetDemoData, 
    geminiConfigured,
    isBackendHealthy 
  } = useApp();

  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: 'Operational Overview', subtitle: 'Consolidated mining & geological metrics across CIL subsidiaries' },
    library: { title: 'Document Library', subtitle: 'Searchable repository of PDFs, appraisals, borehole logs & spreadsheets' },
    upload: { title: 'Upload & Process Documents', subtitle: '9-stage ingestion pipeline with OCR, table extraction & validation' },
    extracted: { title: 'Structured Data & Verification', subtitle: 'Review extracted parameters, resolve conflicts & edit with audit trail' },
    assistant: { title: 'AI Research Assistant', subtitle: 'Ask complex queries grounded in verified records with page citations' },
    topics: { title: 'Topic Explorer & Word Cloud', subtitle: 'Frequency analysis, n-gram mining & semantic document clustering' },
    analytics: { title: 'Mining & Operational Analytics', subtitle: 'Production trends, stripping ratios, and period comparisons' },
    reports: { title: 'Automated Report Builder', subtitle: 'Generate verifiable geological drafts, parliamentary responses & audits' },
    reviews: { title: 'Review & Approvals Workflow', subtitle: 'Multi-stage statutory approval tracking with digital signatures' },
    activity: { title: 'System Activity & Audit Trail', subtitle: 'Immutable chronological record of edits, verifications & exports' },
    settings: { title: 'Platform Settings', subtitle: 'Subsidiary configurations, OCR thresholds & AI engine status' },
  };

  const subsidiaries: Array<Subsidiary | 'ALL'> = [
    'ALL', 'CMPDI', 'SECL', 'MCL', 'BCCL', 'CCL', 'ECL', 'WCL', 'NCL'
  ];

  const currentInfo = sectionTitles[activeSection] || { title: 'CoalInsight AI', subtitle: 'Mining Intelligence' };

  return (
    <header className="bg-white border-b border-[#DFE5EB] px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Title & Context */}
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#202B38] tracking-tight">
              {currentInfo.title}
            </h1>
            <span className="text-xs text-[#6B7785] hidden md:inline">·</span>
            <span className="text-xs text-[#6B7785] hidden md:inline truncate max-w-xs">
              {currentInfo.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Search & Subsidiary Filter */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Subsidiary Selector */}
        <div className="flex items-center gap-1.5 bg-[#F3F6F8] px-2.5 py-1.5 rounded-lg border border-[#DFE5EB] text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#435164]" />
          <span className="text-[#6B7785] font-medium hidden sm:inline">Subsidiary:</span>
          <select
            value={activeSubsidiary}
            onChange={(e) => setActiveSubsidiary(e.target.value as Subsidiary | 'ALL')}
            className="bg-transparent font-semibold text-[#202B38] outline-hidden cursor-pointer text-xs"
          >
            {subsidiaries.map((sub) => (
              <option key={sub} value={sub}>
                {sub === 'ALL' ? 'All Subsidiaries (CIL)' : sub}
              </option>
            ))}
          </select>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-44 md:w-56">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7785]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Quick search terms..."
            className="w-full bg-[#F3F6F8] pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#DFE5EB] focus:outline-hidden focus:border-[#C47A43] transition-colors text-[#202B38]"
          />
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quick Demo Controls */}
        <button
          onClick={loadDemoData}
          title="Reload fresh demonstration dataset"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#278A85] bg-[#278A85]/10 hover:bg-[#278A85]/20 rounded-lg transition-colors border border-[#278A85]/30 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Load Demo Data</span>
        </button>

        <button
          onClick={resetDemoData}
          title="Reset workspace state"
          className="p-1.5 text-xs font-medium text-[#6B7785] hover:text-[#202B38] hover:bg-[#F3F6F8] rounded-lg transition-colors border border-[#DFE5EB] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Status Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-[#F3F6F8] border border-[#DFE5EB] text-[#435164]">
          <span className={`w-2 h-2 rounded-full ${geminiConfigured ? 'bg-[#2E805A]' : 'bg-[#278A85]'}`} />
          <span className="font-mono text-[11px]">
            {geminiConfigured ? 'Gemini 3.8 Online' : 'Local Grounding Ready'}
          </span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#DFE5EB]">
          <div className="w-7 h-7 rounded-full bg-[#17263C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            VK
          </div>
          <div className="hidden sm:block text-left text-xs leading-tight">
            <div className="font-semibold text-[#202B38]">Er. V. K. Sharma</div>
            <div className="text-[10px] text-[#6B7785]">Chief Reviewer · CIL</div>
          </div>
        </div>
      </div>
    </header>
  );
};
