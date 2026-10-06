import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { MessageSquarePlus, Send, AlertTriangle } from 'lucide-react';

export function CreateTaskModal() {
  const {
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
    taskTargetItem,
    createPICClarificationTask
  } = useApp();

  const [comment, setComment] = useState('');

  if (!taskTargetItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createPICClarificationTask(taskTargetItem, comment);
    setComment('');
  };

  return (
    <Modal
      isOpen={isCreateTaskModalOpen}
      onClose={() => setIsCreateTaskModalOpen(false)}
      title="Create Clarification Task for Requestor"
      subtitle={`Item: ${taskTargetItem.id} - ${taskTargetItem.name}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Requestor:</span>
            <strong className="text-slate-800">{taskTargetItem.requestor}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Target Line:</span>
            <strong className="text-slate-800">{taskTargetItem.line}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Requested Qty:</span>
            <strong className="text-slate-800 font-mono">
              {taskTargetItem.requestedQty} {taskTargetItem.unit}
            </strong>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Clarification Question / Technical Inquiry *
          </label>
          <textarea
            rows={4}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g. Please clarify why 4 units are required instead of standard 2, and provide MTBF historical failure rates for this actuator..."
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(false)}
            className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            Dispatch Task to Requestor
          </button>
        </div>
      </form>
    </Modal>
  );
}
