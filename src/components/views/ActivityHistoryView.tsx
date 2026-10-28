import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  UploadCloud, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  FileText,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityLog } from '../../types';

export const ActivityHistoryView: React.FC = () => {
  const { activityLogs } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = activityLogs.filter((log) => {
    if (filterCategory !== 'ALL' && log.category !== filterCategory) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      if (!log.action.toLowerCase().includes(term) &&
          !log.target.toLowerCase().includes(term) &&
          !(log.details || '').toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = 'ID,Action,Target,User,Timestamp,Category,Details\n';
    const rows = activityLogs.map((l) => 
      `"${l.id}","${l.action.replace(/"/g, '""')}","${l.target.replace(/"/g, '""')}","${l.user}","${l.timestamp}","${l.category}","${(l.details || '').replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coalinsight_audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const getCategoryIcon = (cat: ActivityLog['category']) => {
    switch (cat) {
      case 'upload':
        return <UploadCloud className="w-3.5 h-3.5 text-[#278A85]" />;
      case 'correction':
        return <Edit3 className="w-3.5 h-3.5 text-[#C47A43]" />;
      case 'extraction':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#2E805A]" />;
      case 'research':
        return <Sparkles className="w-3.5 h-3.5 text-[#17263C]" />;
      case 'report':
        return <FileText className="w-3.5 h-3.5 text-[#C47A43]" />;
      case 'approval':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#2E805A]" />;
      default:
        return <History className="w-3.5 h-3.5 text-[#6B7785]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C47A43] text-white flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202B38]">
                Statutory Activity Log & Immutable Audit Trail
              </h2>
              <p className="text-xs text-[#6B7785] mt-0.5">
                Every document ingestion, parameter correction, research retrieval, and report approval is permanently recorded.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold text-[#17263C] bg-[#F3F6F8] hover:bg-[#17263C] hover:text-white rounded-lg border border-[#DFE5EB] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Audit Trail (CSV)
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DFE5EB] text-xs">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7785]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full bg-[#F3F6F8] pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#DFE5EB] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#6B7785] font-medium">Activity Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#F3F6F8] px-3 py-1.5 rounded-lg border border-[#DFE5EB] text-xs font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="upload">Upload & Ingestion</option>
              <option value="extraction">Field Verification</option>
              <option value="correction">Value Corrections</option>
              <option value="research">AI Research Q&A</option>
              <option value="report">Report Synthesis</option>
              <option value="approval">Statutory Approvals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F3F6F8] text-[#435164] uppercase font-mono text-[10px] tracking-wider border-b border-[#DFE5EB]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target Subject</th>
                <th className="px-4 py-3">Audited Details / Reason</th>
                <th className="px-4 py-3 text-right">User / Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE5EB]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#F3F6F8]/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-[#6B7785] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#F3F6F8] text-[#435164] border border-[#DFE5EB]">
                      {getCategoryIcon(log.category)}
                      {log.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#202B38]">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-[#202B38] font-medium max-w-xs truncate">
                    {log.target}
                  </td>
                  <td className="px-4 py-3 text-[#6B7785] max-w-sm">
                    {log.details || '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] text-[#17263C] whitespace-nowrap">
                    {log.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
