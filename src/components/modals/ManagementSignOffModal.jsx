import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { FileCheck2, UploadCloud, CheckCircle2, XCircle, Paperclip, FileText } from 'lucide-react';

export function ManagementSignOffModal() {
  const {
    isManagementModalOpen,
    setIsManagementModalOpen,
    submitManagementSignOff
  } = useApp();

  const [decision, setDecision] = useState('Approve');
  const [meetingMinutesName, setMeetingMinutesName] = useState('Signed_Appraisal_Minutes_OCT2026.pdf');
  const [directorNotes, setDirectorNotes] = useState('Approved by Plant Operations Director with condition that Coating Line 01 variance is offset in November.');
  const [isFileAttached, setIsFileAttached] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitManagementSignOff(decision, isFileAttached ? meetingMinutesName : null);
  };

  return (
    <Modal
      isOpen={isManagementModalOpen}
      onClose={() => setIsManagementModalOpen(false)}
      title="Management Appraisal Sign-Off (Executive Review)"
      subtitle="October 2026 Plant-wide Spare Parts Budget Assessment"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Radio Selection: Approve / Reject */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Executive Appraisal Decision *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                decision === 'Approve'
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="decision"
                value="Approve"
                checked={decision === 'Approve'}
                onChange={() => setDecision('Approve')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs">Approve Batch</span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                decision === 'Reject'
                  ? 'bg-red-50/80 border-red-300 text-red-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="decision"
                value="Reject"
                checked={decision === 'Reject'}
                onChange={() => setDecision('Reject')}
                className="text-red-600 focus:ring-red-500"
              />
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs">Reject / Hold</span>
            </label>
          </div>
        </div>

        {/* File Upload Zone: Attach signed meeting minutes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Attach Signed Meeting Minutes (PDF/Scan) *
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer">
            <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-1.5" />
            <p className="text-xs font-medium text-slate-700">
              Drag & drop signed committee PDF or browse file
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Supports .PDF, .XLSX, .PNG up to 25MB
            </p>

            {isFileAttached && (
              <div className="mt-3 p-2 bg-white rounded border border-indigo-200 inline-flex items-center gap-2 text-xs text-indigo-700 shadow-2xs font-mono font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>{meetingMinutesName}</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">
                  ✓ Verified
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Executive Director Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Director Review Remarks / Conditions
          </label>
          <textarea
            rows={3}
            value={directorNotes}
            onChange={(e) => setDirectorNotes(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsManagementModalOpen(false)}
            className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm"
          >
            <FileCheck2 className="w-4 h-4" />
            Save Management Sign-Off
          </button>
        </div>
      </form>
    </Modal>
  );
}
