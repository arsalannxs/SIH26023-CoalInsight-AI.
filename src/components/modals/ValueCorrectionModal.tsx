import React, { useState } from 'react';
import { X, ShieldAlert, Check, Undo2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ValueCorrectionModal: React.FC = () => {
  const { fieldToCorrect, setFieldToCorrect, correctField } = useApp();
  
  const [newValue, setNewValue] = useState<string>(fieldToCorrect ? String(fieldToCorrect.value) : '');
  const [reason, setReason] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('Er. V. K. Sharma (Chief Reviewer)');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!fieldToCorrect) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('A specific reason for correction is mandatory for statutory audit compliance.');
      return;
    }
    if (!newValue.trim()) {
      setErrorMsg('Please specify the corrected value.');
      return;
    }

    correctField(fieldToCorrect.id, newValue, reason.trim(), reviewerName);
    setFieldToCorrect(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-[#DFE5EB] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#17263C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#C47A43]" />
            <h2 className="font-bold text-base">Audit-Tracked Value Correction</h2>
          </div>
          <button
            onClick={() => setFieldToCorrect(null)}
            className="text-white/70 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-xs text-[#6B7785]">
            Every correction is permanently audited with the original extracted value, reviewer identity, timestamp, and substantiating reason.
          </div>

          {/* Field Details */}
          <div className="p-3.5 bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#6B7785]">Parameter Name:</span>
              <span className="font-semibold text-[#202B38]">{fieldToCorrect.fieldName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7785]">Source Document:</span>
              <span className="font-medium text-[#202B38] truncate max-w-xs">{fieldToCorrect.sourceDocTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7785]">Page / Reference:</span>
              <span className="font-mono text-[#202B38]">Page {fieldToCorrect.pageNumber}</span>
            </div>
            <div className="flex justify-between border-t border-[#DFE5EB] pt-1.5">
              <span className="text-[#6B7785]">Original Extracted Value:</span>
              <span className="font-mono font-bold text-[#C44747]">
                {fieldToCorrect.originalValue} {fieldToCorrect.unit || ''}
              </span>
            </div>
          </div>

          {/* Supporting Passage */}
          {fieldToCorrect.supportingPassage && (
            <div className="text-xs">
              <span className="font-semibold text-[#435164]">Supporting Source Passage:</span>
              <div className="p-2.5 mt-1 bg-white border border-[#DFE5EB] rounded text-[#435164] italic text-[11px] leading-relaxed">
                "{fieldToCorrect.supportingPassage}"
              </div>
            </div>
          )}

          {/* Corrected Value Input */}
          <div>
            <label className="block text-xs font-semibold text-[#202B38] mb-1">
              Corrected Value {fieldToCorrect.unit && `(${fieldToCorrect.unit})`}
            </label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value);
                setErrorMsg('');
              }}
              placeholder={`e.g. ${fieldToCorrect.value}`}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#DFE5EB] focus:outline-hidden focus:border-[#C47A43] font-mono font-medium"
            />
          </div>

          {/* Reason for Correction */}
          <div>
            <label className="block text-xs font-semibold text-[#202B38] mb-1">
              Audit Correction Reason <span className="text-[#C44747]">*</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. Reconciled against audited CIL statutory dispatch returns table 1.1; OCR misread decimal point."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFE5EB] focus:outline-hidden focus:border-[#C47A43]"
            />
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="block text-xs font-semibold text-[#202B38] mb-1">
              Authorized Reviewer Signature
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#DFE5EB] bg-[#F3F6F8]"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-[#C44747]/10 border border-[#C44747]/30 text-[#C44747] text-xs rounded-md">
              {errorMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DFE5EB]">
            <button
              type="button"
              onClick={() => setFieldToCorrect(null)}
              className="px-3 py-1.5 text-xs font-medium text-[#435164] hover:bg-[#F3F6F8] rounded-lg border border-[#DFE5EB] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#C47A43] hover:bg-[#C47A43]/90 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Save Audited Correction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
