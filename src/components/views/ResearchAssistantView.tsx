import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  Copy, 
  Check, 
  Building2,
  BookmarkPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResearchCitation } from '../../types';

export const ResearchAssistantView: React.FC = () => {
  const { 
    chatMessages, 
    askAssistant, 
    isQueryLoading, 
    activeSubsidiary, 
    documents, 
    setSelectedDocForView,
    createReport,
    setActiveSection
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const samplePrompts = [
    'Summarise coal production figures for FY 2023-24 across subsidiaries.',
    'Which documents discuss geological exploration and borehole core samples?',
    'Compare the reported Gevra OC production figures between SECL and Ministry filings.',
    'What are the proved coal reserves in Korba and North Karanpura basins?',
    'Prepare an evidence-backed summary draft for Lok Sabha USQ No. 2481.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isQueryLoading) return;
    askAssistant(inputQuery.trim());
    setInputQuery('');
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSendToReportBuilder = (content: string) => {
    createReport({
      title: 'Synthesized Research Draft',
      reportType: 'Administrative Query Response Draft',
      reportingPeriod: 'FY 2023-24',
      subsidiary: activeSubsidiary,
      status: 'Draft',
      author: 'AI Research Assistant (Evidence Grounded)',
      markdownContent: content,
      selectedDocIds: documents.slice(0, 3).map((d) => d.id),
      verifiedFieldIds: [],
    });
    setActiveSection('reports');
  };

  const handleOpenCitation = (cit: ResearchCitation) => {
    const doc = documents.find((d) => d.id === cit.docId || d.title.toLowerCase().includes(cit.docTitle.toLowerCase()));
    if (doc) {
      setSelectedDocForView(doc);
    }
  };

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col space-y-4">
      {/* Top Banner & Context */}
      <div className="bg-white p-4 rounded-xl border border-[#DFE5EB] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#C47A43] text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#202B38] flex items-center gap-2">
              Evidence-Grounded AI Research Assistant
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#2E805A]/10 text-[#2E805A]">
                Strict Traceability Active
              </span>
            </h2>
            <p className="text-xs text-[#6B7785]">
              Every statement is derived strictly from authorized CIL/CMPDI documents. Unsupported claims are discarded.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#6B7785] flex items-center gap-2 font-mono">
          <Building2 className="w-3.5 h-3.5 text-[#435164]" />
          <span>Scope: {activeSubsidiary === 'ALL' ? 'All CIL Subsidiaries' : activeSubsidiary}</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white rounded-xl border border-[#DFE5EB] shadow-2xs">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-[#6B7785]">
                <span className="font-semibold">{isUser ? 'You (Reporting Officer)' : 'CoalInsight Engine'}</span>
                <span>·</span>
                <span className="font-mono text-[10px]">{msg.timestamp}</span>
                {msg.engine && (
                  <>
                    <span>·</span>
                    <span className="font-mono text-[10px] text-[#278A85]">{msg.engine}</span>
                  </>
                )}
              </div>

              <div
                className={`p-4 rounded-xl text-xs leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-[#17263C] text-white'
                    : 'bg-[#F3F6F8] text-[#202B38] border border-[#DFE5EB]'
                }`}
              >
                {/* Content with basic markdown display */}
                <div className="whitespace-pre-wrap font-sans text-xs space-y-1.5">
                  {msg.content}
                </div>

                {/* Source Citations Box */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-[#DFE5EB] space-y-1.5">
                    <div className="font-mono font-bold text-[10px] text-[#6B7785] uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E805A]" />
                      Underlying Source Citations ({msg.citations.length})
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.citations.map((cit, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleOpenCitation(cit)}
                          className="p-2 bg-white rounded border border-[#DFE5EB] hover:border-[#C47A43] transition-colors cursor-pointer flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="font-semibold text-[11px] text-[#202B38] truncate">
                              [{idx + 1}] {cit.docTitle}
                            </div>
                            <div className="text-[10px] text-[#6B7785] font-mono mt-0.5">
                              {cit.sourceOrg} · Period: {cit.period} · <strong className="text-[#C47A43]">Page {cit.page}</strong>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-[#6B7785] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Actions */}
                {!isUser && (
                  <div className="flex items-center gap-2 pt-2 border-t border-[#DFE5EB]/60">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="px-2 py-1 text-[11px] text-[#6B7785] hover:text-[#17263C] rounded hover:bg-white flex items-center gap-1"
                    >
                      {copiedMsgId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#2E805A]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleSendToReportBuilder(msg.content)}
                      className="px-2 py-1 text-[11px] text-[#C47A43] hover:text-[#C47A43]/80 rounded hover:bg-white flex items-center gap-1"
                    >
                      <BookmarkPlus className="w-3 h-3" />
                      <span>Export to Report Builder</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isQueryLoading && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-[#F3F6F8] border border-[#DFE5EB] max-w-md text-xs text-[#6B7785]">
            <Loader2 className="w-4 h-4 animate-spin text-[#C47A43]" />
            <span>Searching authorized document passages and extracting citations...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs shrink-0">
        <span className="text-[11px] font-semibold text-[#6B7785] shrink-0">Suggested:</span>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => askAssistant(prompt)}
            disabled={isQueryLoading}
            className="whitespace-nowrap px-2.5 py-1 text-[11px] bg-white hover:bg-[#F3F6F8] text-[#435164] hover:text-[#202B38] rounded-md border border-[#DFE5EB] transition-colors cursor-pointer truncate max-w-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isQueryLoading}
            placeholder="Ask a technical or administrative question about the uploaded mining records..."
            className="w-full bg-white px-4 py-3 text-xs rounded-xl border border-[#DFE5EB] focus:outline-hidden focus:border-[#C47A43] shadow-2xs text-[#202B38]"
          />
        </div>
        <button
          type="submit"
          disabled={isQueryLoading || !inputQuery.trim()}
          className="px-5 py-3 text-xs font-bold text-white bg-[#C47A43] hover:bg-[#C47A43]/90 disabled:opacity-50 rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
