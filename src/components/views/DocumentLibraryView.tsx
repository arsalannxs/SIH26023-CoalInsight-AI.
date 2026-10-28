import React, { useState } from 'react';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon, 
  FileText, 
  Calendar, 
  Building2, 
  Tag, 
  Eye, 
  Download, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentType, ProcessingStatus, MiningDocument } from '../../types';

export const DocumentLibraryView: React.FC = () => {
  const { 
    documents, 
    setSelectedDocForView, 
    setActiveSection, 
    activeSubsidiary, 
    searchFilter, 
    setSearchFilter 
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filter documents
  const filtered = documents.filter((doc) => {
    // Subsidiary filter
    if (activeSubsidiary !== 'ALL' && doc.sourceOrg !== activeSubsidiary) return false;
    
    // Type filter
    if (selectedType !== 'ALL' && doc.documentType !== selectedType) return false;

    // Status filter
    if (selectedStatus !== 'ALL' && doc.status !== selectedStatus) return false;

    // Text search filter
    if (searchFilter.trim()) {
      const term = searchFilter.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(term);
      const matchSummary = doc.summaryText.toLowerCase().includes(term);
      const matchTags = doc.tags.some((t) => t.toLowerCase().includes(term));
      const matchPassages = doc.passages.some((p) => p.text.toLowerCase().includes(term));
      if (!matchTitle && !matchSummary && !matchTags && !matchPassages) return false;
    }

    return true;
  });

  const docTypes: Array<DocumentType | 'ALL'> = [
    'ALL',
    'Geological Appraisal',
    'Mining Production Bulletin',
    'Borehole Exploration Log',
    'Environmental Clearance',
    'Parliamentary Query Brief',
  ];

  return (
    <div className="space-y-5">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7785]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search across title, content, borehole codes, ash %, seam names..."
              className="w-full bg-[#F3F6F8] pl-9 pr-4 py-2 text-xs rounded-lg border border-[#DFE5EB] focus:outline-hidden focus:border-[#C47A43] text-[#202B38]"
            />
          </div>

          {/* View Toggles & Filters */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Type Dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#F3F6F8] px-3 py-2 text-xs rounded-lg border border-[#DFE5EB] text-[#202B38] font-medium"
            >
              {docTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Document Types' : t}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F3F6F8] px-3 py-2 text-xs rounded-lg border border-[#DFE5EB] text-[#202B38] font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Processed">Processed</option>
              <option value="Needs Review">Needs Review</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#DFE5EB] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#17263C] text-white' : 'bg-white text-[#6B7785] hover:bg-[#F3F6F8]'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#17263C] text-white' : 'bg-white text-[#6B7785] hover:bg-[#F3F6F8]'}`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Count Bar */}
        <div className="flex items-center justify-between text-xs text-[#6B7785] pt-1 border-t border-[#DFE5EB]">
          <span>
            Showing <strong className="text-[#202B38] font-mono">{filtered.length}</strong> of {documents.length} repository documents
          </span>
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="text-[#C47A43] hover:underline font-medium"
            >
              Clear search query
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-[#DFE5EB] hover:border-[#C47A43]/60 transition-all p-5 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Info */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-xs bg-[#17263C]/10 text-[#17263C] px-2 py-0.5 rounded">
                    {doc.sourceOrg}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded ${
                      doc.status === 'Processed'
                        ? 'bg-[#2E805A]/10 text-[#2E805A]'
                        : 'bg-[#B7791F]/10 text-[#B7791F]'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => setSelectedDocForView(doc)}
                  className="font-bold text-sm text-[#202B38] hover:text-[#C47A43] transition-colors cursor-pointer line-clamp-2 leading-snug"
                >
                  {doc.title}
                </h3>

                {/* Context Details */}
                <div className="text-xs text-[#6B7785] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#435164]" />
                    <span className="truncate">{doc.documentType}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#435164]" />
                    <span>Period: {doc.reportingPeriod}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#435164]" />
                    <span className="truncate">{doc.mineProjectRef}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-[#435164] line-clamp-2 leading-relaxed bg-[#F3F6F8] p-2.5 rounded-lg border border-[#DFE5EB]/60">
                  {doc.summaryText}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {doc.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="font-mono text-[10px] bg-[#F3F6F8] text-[#6B7785] px-1.5 py-0.5 rounded border border-[#DFE5EB]">
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="text-[10px] text-[#6B7785] font-mono">
                      +{doc.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#DFE5EB] flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#6B7785]">
                  {doc.passages.length} pgs · {doc.tables.length} tbls
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedDocForView(doc)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#17263C] bg-[#F3F6F8] hover:bg-[#17263C] hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F3F6F8] text-[#435164] uppercase font-mono text-[10px] border-b border-[#DFE5EB]">
              <tr>
                <th className="px-4 py-3">Document Title</th>
                <th className="px-4 py-3">Subsidiary</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Passages & Tables</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE5EB]">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F3F6F8]/60 transition-colors">
                  <td className="px-4 py-3">
                    <div
                      onClick={() => setSelectedDocForView(doc)}
                      className="font-semibold text-[#202B38] hover:text-[#C47A43] cursor-pointer line-clamp-1 max-w-md"
                    >
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-[#6B7785] mt-0.5 font-mono">
                      {doc.id} · {doc.fileSize}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#17263C]">
                    {doc.sourceOrg}
                  </td>
                  <td className="px-4 py-3 text-[#435164]">
                    {doc.category}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#6B7785]">
                    {doc.reportingPeriod}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#6B7785]">
                    {doc.passages.length} pgs · {doc.tables.length} tbls
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        doc.status === 'Processed'
                          ? 'bg-[#2E805A]/10 text-[#2E805A]'
                          : 'bg-[#B7791F]/10 text-[#B7791F]'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedDocForView(doc)}
                      className="px-3 py-1 text-xs font-semibold text-[#17263C] bg-[#F3F6F8] hover:bg-[#17263C] hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
