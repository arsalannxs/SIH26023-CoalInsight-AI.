import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Table as TableIcon, 
  Database, 
  Calendar, 
  Building2, 
  Download, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DocumentModal: React.FC = () => {
  const { selectedDocForView, setSelectedDocForView, extractedFields, verifyField, setActiveSection } = useApp();
  const [activeTab, setActiveTab] = useState<'passages' | 'tables' | 'fields' | 'meta'>('passages');
  const [copiedPassageId, setCopiedPassageId] = useState<string | null>(null);

  if (!selectedDocForView) return null;

  const doc = selectedDocForView;
  const docFields = extractedFields.filter((f) => f.docId === doc.id);

  const handleCopyCitation = (passageText: string, page: number, id: string) => {
    const citation = `[${doc.title} (${doc.sourceOrg}, ${doc.reportingPeriod}), Page ${page}]: "${passageText}"`;
    navigator.clipboard.writeText(citation);
    setCopiedPassageId(id);
    setTimeout(() => setCopiedPassageId(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(doc, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${doc.id}_extracted_intelligence.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-[#DFE5EB] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#17263C] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#C47A43] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#278A85] bg-white/10 px-1.5 py-0.5 rounded">
                  {doc.id}
                </span>
                <span className="text-xs text-white/70">·</span>
                <span className="text-xs text-white/80">{doc.sourceOrg}</span>
                <span className="text-xs text-white/70">·</span>
                <span className="text-xs text-white/80">{doc.reportingPeriod}</span>
              </div>
              <h2 className="font-bold text-base text-white truncate max-w-2xl mt-0.5">
                {doc.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              title="Download Extracted Intelligence (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDocForView(null)}
              className="text-white/70 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-[#DFE5EB] bg-[#F3F6F8] shrink-0 text-xs font-medium">
          <button
            onClick={() => setActiveTab('passages')}
            className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'passages'
                ? 'border-[#C47A43] text-[#17263C] font-semibold bg-white'
                : 'border-transparent text-[#6B7785] hover:text-[#202B38]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Extracted Passages ({doc.passages.length})
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tables'
                ? 'border-[#C47A43] text-[#17263C] font-semibold bg-white'
                : 'border-transparent text-[#6B7785] hover:text-[#202B38]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Extracted Tables ({doc.tables.length})
          </button>
          <button
            onClick={() => setActiveTab('fields')}
            className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'fields'
                ? 'border-[#C47A43] text-[#17263C] font-semibold bg-white'
                : 'border-transparent text-[#6B7785] hover:text-[#202B38]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Structured Parameters ({docFields.length})
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'meta'
                ? 'border-[#C47A43] text-[#17263C] font-semibold bg-white'
                : 'border-transparent text-[#6B7785] hover:text-[#202B38]'
            }`}
          >
            Audit & Metadata
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'passages' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] text-xs text-[#435164]">
                <span className="font-semibold text-[#202B38]">Document Summary: </span>
                {doc.summaryText}
              </div>

              {doc.passages.map((passage) => (
                <div
                  key={passage.id}
                  className="p-4 bg-white rounded-lg border border-[#DFE5EB] hover:border-[#C47A43]/50 transition-colors shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold px-2 py-0.5 bg-[#17263C]/10 text-[#17263C] rounded">
                        Page {passage.page}
                      </span>
                      {passage.sectionTitle && (
                        <span className="font-semibold text-[#202B38]">
                          {passage.sectionTitle}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopyCitation(passage.text, passage.page, passage.id)}
                      className="flex items-center gap-1 text-[11px] text-[#278A85] hover:text-[#17263C] font-medium transition-colors"
                      title="Copy exact statutory citation"
                    >
                      {copiedPassageId === passage.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#2E805A]" />
                          <span className="text-[#2E805A]">Citation Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Citation</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#435164] leading-relaxed bg-[#F3F6F8]/50 p-2.5 rounded border border-[#DFE5EB]/60">
                    "{passage.text}"
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-6">
              {doc.tables.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#6B7785]">
                  No structured tables detected in this document.
                </div>
              ) : (
                doc.tables.map((table) => (
                  <div key={table.id} className="border border-[#DFE5EB] rounded-lg overflow-hidden">
                    <div className="bg-[#F3F6F8] px-4 py-2 border-b border-[#DFE5EB] flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#202B38]">{table.title}</span>
                      <span className="font-mono text-[#6B7785]">Page {table.pageNumber}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#17263C]/5 text-[#435164] uppercase font-mono text-[10px] tracking-wider border-b border-[#DFE5EB]">
                          <tr>
                            {table.headers.map((h, i) => (
                              <th key={i} className="px-4 py-2.5 font-semibold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DFE5EB]">
                          {table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#F3F6F8]/60 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-2 font-mono text-[#202B38]">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'fields' && (
            <div className="space-y-3">
              <div className="text-xs text-[#6B7785]">
                Parameters extracted from this document. Each parameter can be verified or flagged for reconciliation.
              </div>
              <div className="border border-[#DFE5EB] rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F3F6F8] text-[#435164] uppercase font-mono text-[10px] border-b border-[#DFE5EB]">
                    <tr>
                      <th className="px-4 py-2">Parameter</th>
                      <th className="px-4 py-2">Extracted Value</th>
                      <th className="px-4 py-2">Source Page</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE5EB]">
                    {docFields.map((field) => (
                      <tr key={field.id} className="hover:bg-[#F3F6F8]/50">
                        <td className="px-4 py-2.5 font-medium text-[#202B38]">
                          {field.fieldName}
                        </td>
                        <td className="px-4 py-2.5 font-mono font-bold text-[#17263C]">
                          {field.value} <span className="text-[11px] font-normal text-[#6B7785]">{field.unit}</span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[#6B7785]">
                          Page {field.pageNumber}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                            field.status === 'VERIFIED'
                              ? 'bg-[#2E805A]/10 text-[#2E805A]'
                              : field.status === 'NEEDS_REVIEW'
                              ? 'bg-[#B7791F]/10 text-[#B7791F]'
                              : 'bg-[#C44747]/10 text-[#C44747]'
                          }`}>
                            {field.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {field.status !== 'VERIFIED' && (
                            <button
                              onClick={() => verifyField(field.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#2E805A] hover:bg-[#2E805A]/10 rounded border border-[#2E805A]/30 transition-colors"
                            >
                              Verify Value
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] space-y-1.5">
                <div className="text-[#6B7785]">Document Identifier</div>
                <div className="font-mono font-semibold text-[#202B38]">{doc.id}</div>
              </div>
              <div className="p-3 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] space-y-1.5">
                <div className="text-[#6B7785]">Subsidiary / Subsidiary Ref</div>
                <div className="font-semibold text-[#202B38]">{doc.sourceOrg} · {doc.mineProjectRef}</div>
              </div>
              <div className="p-3 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] space-y-1.5">
                <div className="text-[#6B7785]">Reporting Period</div>
                <div className="font-semibold text-[#202B38]">{doc.reportingPeriod}</div>
              </div>
              <div className="p-3 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] space-y-1.5">
                <div className="text-[#6B7785]">File Size & MIME Format</div>
                <div className="font-mono text-[#202B38]">{doc.fileSize} · {doc.mimeType}</div>
              </div>
              <div className="p-3 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] space-y-1.5">
                <div className="text-[#6B7785]">Processing Status</div>
                <div className="font-semibold text-[#278A85]">{doc.status} (9 Stages Completed)</div>
              </div>
              <div className="p-3 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] space-y-1.5">
                <div className="text-[#6B7785]">Extraction Tags</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {doc.tags.map((t, idx) => (
                    <span key={idx} className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#DFE5EB]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F3F6F8] px-6 py-3 border-t border-[#DFE5EB] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7785]">
            <ShieldCheck className="w-4 h-4 text-[#2E805A]" />
            <span>Digital extraction and passage references verified by CoalInsight AI Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedDocForView(null);
                setActiveSection('assistant');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-[#278A85] bg-[#278A85]/10 hover:bg-[#278A85]/20 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI About This Document
            </button>
            <button
              onClick={() => setSelectedDocForView(null)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#17263C] hover:bg-[#17263C]/90 rounded-lg shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
