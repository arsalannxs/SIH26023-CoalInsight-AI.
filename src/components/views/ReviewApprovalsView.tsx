import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileCheck, 
  Archive, 
  MessageSquare, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportStatus, GeneratedReport } from '../../types';

export const ReviewApprovalsView: React.FC = () => {
  const { reports, updateReportStatus, setActiveSection, activeSubsidiary } = useApp();

  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredReports = reports.filter((r) => {
    if (activeSubsidiary !== 'ALL' && r.subsidiary !== 'ALL' && r.subsidiary !== activeSubsidiary) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const activeReport = reports.find((r) => r.id === selectedReportId) || filteredReports[0];

  const handleAction = (status: ReportStatus) => {
    if (!activeReport) return;
    updateReportStatus(activeReport.id, status, feedbackNotes.trim());
    setFeedbackNotes('');
  };

  const getStatusColor = (st: ReportStatus) => {
    switch (st) {
      case 'Approved':
        return 'bg-[#2E805A]/10 text-[#2E805A] border-[#2E805A]/30';
      case 'Needs Review':
        return 'bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/30';
      case 'Changes Requested':
        return 'bg-[#C44747]/10 text-[#C44747] border-[#C44747]/30';
      case 'Reviewed':
        return 'bg-[#278A85]/10 text-[#278A85] border-[#278A85]/30';
      case 'Archived':
        return 'bg-[#6B7785]/10 text-[#6B7785] border-[#6B7785]/30';
      default:
        return 'bg-[#F3F6F8] text-[#435164] border-[#DFE5EB]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C47A43] text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202B38]">
                Statutory Review, Verification & Formal Approvals
              </h2>
              <p className="text-xs text-[#6B7785] mt-0.5">
                Every generated report requires human sign-off from an authorized Competent Person prior to official submission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F3F6F8] px-3 py-1.5 text-xs rounded-lg border border-[#DFE5EB] font-medium"
            >
              <option value="ALL">All Approval Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Changes Requested">Changes Requested</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Approved">Approved</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Approval Workflow Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Reports */}
        <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs overflow-hidden flex flex-col">
          <div className="p-3.5 bg-[#F3F6F8] border-b border-[#DFE5EB] flex items-center justify-between text-xs font-bold text-[#202B38]">
            <span>Reports in Queue ({filteredReports.length})</span>
            <span className="font-mono text-[10px] text-[#6B7785]">CIL Statutory Log</span>
          </div>

          <div className="divide-y divide-[#DFE5EB] overflow-y-auto max-h-[640px]">
            {filteredReports.map((report) => {
              const isSelected = activeReport?.id === report.id;

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`p-4 transition-colors cursor-pointer space-y-1.5 ${
                    isSelected ? 'bg-[#C47A43]/10 border-l-4 border-l-[#C47A43]' : 'hover:bg-[#F3F6F8]/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#17263C]">
                      {report.id}
                    </span>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-[#202B38] line-clamp-2">
                    {report.title}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#6B7785] font-mono pt-1">
                    <span>{report.subsidiary} · {report.reportingPeriod}</span>
                    <span>v{report.version}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane & Review Actions */}
        {activeReport ? (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs p-6 space-y-5">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#DFE5EB]">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-[#C47A43]">{activeReport.id}</span>
                    <span className="text-[#6B7785]">·</span>
                    <span className="text-[#6B7785]">{activeReport.reportType}</span>
                    <span className="text-[#6B7785]">·</span>
                    <span className="font-mono text-[#6B7785]">Period: {activeReport.reportingPeriod}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#202B38] mt-1">
                    {activeReport.title}
                  </h3>
                </div>

                <div className="shrink-0">
                  <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(activeReport.status)}`}>
                    {activeReport.status}
                  </span>
                </div>
              </div>

              {/* Reviewer Action Bar */}
              <div className="p-4 bg-[#F3F6F8] rounded-xl border border-[#DFE5EB] space-y-3">
                <div className="font-bold text-xs text-[#202B38] flex items-center justify-between">
                  <span>Authorized Reviewer Actions (Er. V. K. Sharma)</span>
                  <span className="font-mono text-[10px] text-[#278A85]">Sign-Off Authority: Active</span>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Enter statutory review notes, drill core confirmation, or reason for requesting changes..."
                    className="w-full p-2.5 bg-white text-xs rounded-lg border border-[#DFE5EB] focus:outline-hidden focus:border-[#C47A43]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleAction('Approved')}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#2E805A] hover:bg-[#2E805A]/90 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve & Sign-Off
                  </button>

                  <button
                    onClick={() => handleAction('Reviewed')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#278A85] hover:bg-[#278A85]/90 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Mark Technically Reviewed
                  </button>

                  <button
                    onClick={() => handleAction('Changes Requested')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#B7791F] hover:bg-[#B7791F]/90 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Request Changes
                  </button>

                  <button
                    onClick={() => handleAction('Archived')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#435164] bg-white hover:bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Archive
                  </button>
                </div>
              </div>

              {/* Audit & Revision History */}
              <div className="space-y-2">
                <div className="font-bold text-xs text-[#202B38] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C47A43]" />
                  Statutory Approval Audit Log
                </div>

                <div className="divide-y divide-[#DFE5EB] border border-[#DFE5EB] rounded-lg overflow-hidden">
                  {activeReport.auditTrail.map((log, idx) => (
                    <div key={idx} className="p-3 bg-white text-xs flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[#202B38] flex items-center gap-2">
                          <span>{log.action}</span>
                          <span className="font-mono text-[10px] text-[#6B7785]">by {log.user}</span>
                        </div>
                        {log.comment && (
                          <div className="text-[11px] text-[#435164] italic">
                            "{log.comment}"
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-[#6B7785] shrink-0">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Preview */}
              <div className="space-y-2">
                <div className="font-bold text-xs text-[#202B38] flex items-center justify-between">
                  <span>Report Text & Source Passages</span>
                  <button
                    onClick={() => setActiveSection('reports')}
                    className="text-[11px] text-[#278A85] font-semibold hover:underline"
                  >
                    Open in Editor
                  </button>
                </div>
                <div className="p-4 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] max-h-80 overflow-y-auto text-xs whitespace-pre-wrap leading-relaxed">
                  {activeReport.markdownContent}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#DFE5EB] p-8 text-center text-xs text-[#6B7785]">
            No reports in queue matching this filter.
          </div>
        )}
      </div>
    </div>
  );
};
