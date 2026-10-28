import React, { useState } from 'react';
import { 
  Database, 
  Check, 
  Edit3, 
  X, 
  PlusCircle, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Eye, 
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExtractedField, ReviewStatus } from '../../types';

export const ExtractedDataView: React.FC = () => {
  const { 
    extractedFields, 
    verifyField, 
    rejectField, 
    setFieldToCorrect, 
    setIsAddRecordModalOpen, 
    conflicts, 
    resolveConflict, 
    setSelectedDocForView, 
    documents,
    activeSubsidiary 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'conflicts' | 'needs_review' | 'verified'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter fields
  const filteredFields = extractedFields.filter((f) => {
    if (activeSubsidiary !== 'ALL' && f.sourceOrg !== activeSubsidiary) return false;
    if (categoryFilter !== 'ALL' && f.category !== categoryFilter) return false;
    if (activeTab === 'needs_review' && f.status !== 'NEEDS_REVIEW') return false;
    if (activeTab === 'verified' && (f.status !== 'VERIFIED' && f.status !== 'MANUALLY_CORRECTED')) return false;
    return true;
  });

  const activeConflicts = conflicts.filter((c) => !c.resolved);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C47A43] text-white flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202B38]">Structured Mining Parameters & Field Verification</h2>
              <p className="text-xs text-[#6B7785] mt-0.5">
                Every extracted metric maintains full traceability to source document pages, confidence score, and human audit trail.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddRecordModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#278A85] hover:bg-[#278A85]/90 rounded-lg shadow-2xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Missing Parameter
            </button>
          </div>
        </div>

        {/* Tab & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DFE5EB] text-xs">
          <div className="flex items-center gap-1 p-1 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'all' ? 'bg-white text-[#17263C] shadow-2xs' : 'text-[#6B7785] hover:text-[#202B38]'
              }`}
            >
              All Extracted Parameters ({extractedFields.length})
            </button>
            <button
              onClick={() => setActiveTab('needs_review')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'needs_review' ? 'bg-white text-[#B7791F] shadow-2xs' : 'text-[#6B7785] hover:text-[#202B38]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#B7791F]" />
              Requires Review ({extractedFields.filter((f) => f.status === 'NEEDS_REVIEW').length})
            </button>
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'conflicts' ? 'bg-white text-[#C44747] shadow-2xs' : 'text-[#6B7785] hover:text-[#202B38]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#C44747]" />
              Cross-Doc Discrepancies ({activeConflicts.length})
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'verified' ? 'bg-white text-[#2E805A] shadow-2xs' : 'text-[#6B7785] hover:text-[#202B38]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E805A]" />
              Verified ({extractedFields.filter((f) => f.status === 'VERIFIED' || f.status === 'MANUALLY_CORRECTED').length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#6B7785] font-medium">Domain Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#F3F6F8] px-2.5 py-1.5 rounded-lg border border-[#DFE5EB] font-medium text-[#202B38]"
            >
              <option value="ALL">All Categories</option>
              <option value="production">Production & Output</option>
              <option value="geology">Geology & Reserves</option>
              <option value="stripping">Stripping & Overburden</option>
              <option value="quality">Quality & Ash Analysis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cross-Document Conflicts Tab */}
      {activeTab === 'conflicts' ? (
        <div className="space-y-4">
          <div className="p-4 bg-[#FFFDFB] rounded-xl border border-[#C47A43]/40 text-xs text-[#435164] space-y-1">
            <div className="font-bold text-[#17263C] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#C47A43]" />
              Statutory Multi-Source Contradiction Detection
            </div>
            <p>
              When official returns conflict (e.g. preliminary parliamentary answers vs audited annual subsidiary bulletins), CoalInsight AI isolates the contradictory figures side-by-side with exact page citations rather than silently overwriting data.
            </p>
          </div>

          {activeConflicts.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-[#DFE5EB] text-center text-xs text-[#2E805A]">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#2E805A] mb-2" />
              All documented conflicts have been reconciled!
            </div>
          ) : (
            activeConflicts.map((conflict) => (
              <div key={conflict.id} className="bg-white rounded-xl border border-[#DFE5EB] p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DFE5EB]">
                  <div>
                    <div className="font-bold text-sm text-[#202B38]">
                      {conflict.fieldName}
                    </div>
                    <div className="text-xs text-[#6B7785] font-mono mt-0.5">
                      Target Project: {conflict.mineRef} · Period: {conflict.period}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded font-bold uppercase bg-[#C44747]/10 text-[#C44747]">
                      {conflict.severity} severity
                    </span>
                    <button
                      onClick={() => resolveConflict(conflict.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2E805A] hover:bg-[#2E805A]/90 rounded-lg shadow-2xs cursor-pointer"
                    >
                      Mark Reconciled
                    </button>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Source A */}
                  <div className="p-4 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] space-y-2">
                    <div className="flex justify-between items-center text-[11px] text-[#6B7785]">
                      <span className="font-bold text-[#17263C]">Source Filing A ({conflict.docA.sourceOrg})</span>
                      <span className="font-mono">Page {conflict.docA.page}</span>
                    </div>
                    <div className="font-semibold text-xs text-[#202B38]">
                      {conflict.docA.docTitle}
                    </div>
                    <div className="text-lg font-bold font-mono text-[#17263C]">
                      {conflict.docA.value} <span className="text-xs font-normal text-[#6B7785]">{conflict.docA.unit}</span>
                    </div>
                  </div>

                  {/* Source B */}
                  <div className="p-4 bg-[#FFFBF8] rounded-lg border border-[#C47A43]/40 space-y-2">
                    <div className="flex justify-between items-center text-[11px] text-[#6B7785]">
                      <span className="font-bold text-[#C47A43]">Source Filing B ({conflict.docB.sourceOrg})</span>
                      <span className="font-mono">Page {conflict.docB.page}</span>
                    </div>
                    <div className="font-semibold text-xs text-[#202B38]">
                      {conflict.docB.docTitle}
                    </div>
                    <div className="text-lg font-bold font-mono text-[#C47A43]">
                      {conflict.docB.value} <span className="text-xs font-normal text-[#6B7785]">{conflict.docB.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded border border-[#DFE5EB] text-xs text-[#435164] italic">
                  <strong>Reconciliation Note:</strong> {conflict.discrepancyNote}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Parameters Table */
        <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F3F6F8] text-[#435164] uppercase font-mono text-[10px] tracking-wider border-b border-[#DFE5EB]">
                <tr>
                  <th className="px-4 py-3">Parameter / Metric</th>
                  <th className="px-4 py-3">Extracted Value</th>
                  <th className="px-4 py-3">Source Document & Page</th>
                  <th className="px-4 py-3">Method & Confidence</th>
                  <th className="px-4 py-3">Review Status</th>
                  <th className="px-4 py-3 text-right">Review Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE5EB]">
                {filteredFields.map((field) => {
                  const doc = documents.find((d) => d.id === field.docId);

                  return (
                    <tr key={field.id} className="hover:bg-[#F3F6F8]/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#202B38]">{field.fieldName}</div>
                        <div className="text-[10px] text-[#6B7785] uppercase tracking-wider font-mono mt-0.5">
                          {field.category} · {field.id}
                        </div>
                        {field.correctionReason && (
                          <div className="text-[10px] text-[#B7791F] mt-1 italic">
                            Correction: {field.correctionReason}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-sm text-[#17263C]">
                          {field.value}{' '}
                          <span className="text-[11px] font-normal text-[#6B7785]">
                            {field.unit}
                          </span>
                        </div>
                        {field.status === 'MANUALLY_CORRECTED' && (
                          <div className="text-[10px] text-[#6B7785] font-mono line-through">
                            Orig: {field.originalValue}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <div
                          onClick={() => doc && setSelectedDocForView(doc)}
                          className="font-medium text-[#202B38] hover:text-[#C47A43] cursor-pointer truncate"
                          title={field.sourceDocTitle}
                        >
                          {field.sourceDocTitle}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#6B7785] font-mono mt-0.5">
                          <span>{field.sourceOrg}</span>
                          <span>·</span>
                          <span className="font-bold text-[#202B38]">Page {field.pageNumber}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-[#202B38] text-[11px]">
                          {field.extractionMethod}
                        </div>
                        <div className="text-[10px] font-mono text-[#6B7785]">
                          Confidence: {field.confidenceScore}%
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            field.status === 'VERIFIED'
                              ? 'bg-[#2E805A]/10 text-[#2E805A]'
                              : field.status === 'MANUALLY_CORRECTED'
                              ? 'bg-[#278A85]/10 text-[#278A85]'
                              : field.status === 'NEEDS_REVIEW'
                              ? 'bg-[#B7791F]/10 text-[#B7791F]'
                              : 'bg-[#C44747]/10 text-[#C44747]'
                          }`}
                        >
                          {field.status}
                        </span>
                        {field.verifiedBy && (
                          <div className="text-[10px] text-[#6B7785] mt-0.5 truncate max-w-[130px]">
                            {field.verifiedBy.split(' ')[0]} {field.verifiedBy.split(' ')[1]}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {field.status !== 'VERIFIED' && (
                            <button
                              onClick={() => verifyField(field.id)}
                              title="Accept & Verify Value"
                              className="p-1.5 text-[#2E805A] hover:bg-[#2E805A]/10 rounded border border-[#2E805A]/30 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => setFieldToCorrect(field)}
                            title="Edit Value with Statutory Audit Reason"
                            className="p-1.5 text-[#C47A43] hover:bg-[#C47A43]/10 rounded border border-[#C47A43]/30 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {field.status !== 'REJECTED' && (
                            <button
                              onClick={() => rejectField(field.id)}
                              title="Reject Field"
                              className="p-1.5 text-[#C44747] hover:bg-[#C44747]/10 rounded border border-[#C44747]/30 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
