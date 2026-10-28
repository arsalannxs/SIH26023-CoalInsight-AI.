import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExtractedField } from '../../types';

export const AddRecordModal: React.FC = () => {
  const { isAddRecordModalOpen, setIsAddRecordModalOpen, documents, addManualField } = useApp();

  const [docId, setDocId] = useState(documents[0]?.id || '');
  const [fieldName, setFieldName] = useState('');
  const [category, setCategory] = useState<ExtractedField['category']>('production');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('Million Tonnes (MT)');
  const [pageNumber, setPageNumber] = useState(1);
  const [passage, setPassage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAddRecordModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim() || !value.trim()) {
      setErrorMsg('Field name and extracted value are required.');
      return;
    }

    const selectedDoc = documents.find((d) => d.id === docId) || documents[0];

    addManualField({
      docId: selectedDoc.id,
      sourceDocTitle: selectedDoc.title,
      sourceOrg: selectedDoc.sourceOrg,
      pageNumber: Number(pageNumber) || 1,
      fieldName: fieldName.trim(),
      category,
      value: isNaN(Number(value)) ? value : Number(value),
      originalValue: isNaN(Number(value)) ? value : Number(value),
      unit: unit.trim(),
      status: 'VERIFIED',
      extractionMethod: 'Manual Entry',
      confidenceScore: 100,
      supportingPassage: passage.trim() || 'Manual entry substantiated by physical document review.',
      verifiedBy: 'Er. V. K. Sharma (Reviewer)',
      verifiedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
    });

    setIsAddRecordModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-[#DFE5EB] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#17263C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#278A85]" />
            <h2 className="font-bold text-base">Add Verified Field Manually</h2>
          </div>
          <button
            onClick={() => setIsAddRecordModalOpen(false)}
            className="text-white/70 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-[#202B38] mb-1">Source Document</label>
            <select
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#DFE5EB] bg-white text-[#202B38]"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.sourceOrg} - {d.title.slice(0, 48)}...
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Field / Parameter Name</label>
              <input
                type="text"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g. Clean Coal Yield"
                className="w-full px-3 py-1.5 rounded-lg border border-[#DFE5EB]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-[#DFE5EB] bg-white"
              >
                <option value="production">Production & Dispatch</option>
                <option value="geology">Geology & Reserves</option>
                <option value="quality">Coal Quality & Ash</option>
                <option value="stripping">Stripping & Overburden</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Value</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 48.50"
                className="w-full px-3 py-1.5 rounded-lg border border-[#DFE5EB] font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. MT, %, m³/t"
                className="w-full px-3 py-1.5 rounded-lg border border-[#DFE5EB]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202B38] mb-1">Source Page Number</label>
            <input
              type="number"
              min="1"
              value={pageNumber}
              onChange={(e) => setPageNumber(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg border border-[#DFE5EB] font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202B38] mb-1">Supporting Passage / Quote</label>
            <textarea
              rows={2}
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              placeholder="Quote from original document..."
              className="w-full px-3 py-1.5 rounded-lg border border-[#DFE5EB]"
            />
          </div>

          {errorMsg && (
            <div className="p-2 bg-[#C44747]/10 text-[#C44747] rounded border border-[#C44747]/20">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DFE5EB]">
            <button
              type="button"
              onClick={() => setIsAddRecordModalOpen(false)}
              className="px-3 py-1.5 text-xs text-[#6B7785] hover:bg-[#F3F6F8] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#278A85] hover:bg-[#278A85]/90 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Add Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
