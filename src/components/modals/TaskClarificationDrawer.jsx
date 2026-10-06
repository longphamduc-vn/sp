import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { MessageSquare, Send, CheckCircle2, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';

export function TaskClarificationDrawer() {
  const {
    isTaskDrawerOpen,
    setIsTaskDrawerOpen,
    selectedTask,
    items,
    replyToTask
  } = useApp();

  const [replyText, setReplyText] = useState('');

  if (!selectedTask) return null;

  const targetItem = items.find((i) => i.id === selectedTask.targetId) || {
    id: selectedTask.targetId || 'SP-9021',
    name: 'Koganei Micro Cylinder TB6X10',
    line: 'Line 05 - Assembly',
    requestedQty: 3,
    unit: 'Set',
    logic: 'Actuator piston ring degradation causing intermittent stroke timeout on fixture clamping.'
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyToTask(selectedTask.id, replyText);
    setReplyText('');
  };

  return (
    <Drawer
      isOpen={isTaskDrawerOpen}
      onClose={() => setIsTaskDrawerOpen(false)}
      title="PIC Review Logic Clarification"
      subtitle={`Resolution required for ${targetItem.id} (${targetItem.name})`}
      width="max-w-lg"
    >
      <div className="space-y-6">
        {/* Task Details Header Card */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase">
              Inquiry from {selectedTask.sender}
            </span>
            <span className="text-[10px] text-amber-700 font-mono">
              {selectedTask.createdAt}
            </span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed font-medium">
            "{selectedTask.description}"
          </p>
        </div>

        {/* Item Specification Context */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
            Current Requisition Record
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-slate-400">Target Line:</span>{' '}
              <strong className="text-slate-800">{targetItem.line}</strong>
            </div>
            <div>
              <span className="text-slate-400">Quantity:</span>{' '}
              <strong className="text-slate-800 font-mono">
                {targetItem.requestedQty} {targetItem.unit}
              </strong>
            </div>
          </div>
          <div className="mt-2 text-slate-700">
            <span className="text-slate-400 block mb-1">Previous Submitted Logic:</span>
            <div className="p-2.5 bg-white border border-slate-200 rounded text-slate-800 italic">
              {targetItem.logic}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSendReply} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Your Logic Clarification / Machine Hours Data *
              </label>
              <span className="text-[10px] text-slate-400">Detailed breakdown</span>
            </div>

            <textarea
              rows={5}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Provide machine frequency, cycle hours, station failure logs, or necessity justification..."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed font-sans"
            />

            {/* Quick response chips */}
            <div className="mt-2 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Quick Fill:</span>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setReplyText(
                      "Station 4 fixture runs 22 hrs/day. 1 set will be installed immediately during Sunday PM, and 2 sets will serve as mandatory emergency buffer per ISO-9001 line stoppage SLA."
                    )
                  }
                  className="text-left text-[11px] p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  "Station 4 fixture runs 22 hrs/day. 1 set for Sunday PM, 2 sets for mandatory line buffer..."
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsTaskDrawerOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Clarification to PIC
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}
