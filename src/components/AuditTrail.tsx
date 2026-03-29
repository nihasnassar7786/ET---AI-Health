import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { AuditStep } from '../types';
import { cn } from '../lib/utils';

interface AuditTrailProps {
  steps: AuditStep[];
}

const statusIcons = {
  pass: <CheckCircle2 size={14} className="text-green-500" />,
  fail: <XCircle size={14} className="text-red-500" />,
  warning: <AlertCircle size={14} className="text-amber-500" />,
  info: <Info size={14} className="text-blue-500" />,
};

export function AuditTrail({ steps }: AuditTrailProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-[#E4E3E0] border border-[#141414] p-4 font-mono text-xs">
      <h3 className="font-serif italic text-sm mb-4 border-b border-[#141414] pb-2 uppercase tracking-wider">
        Auditable Reasoning Trail
      </h3>
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-3 border-b border-[#141414]/10 pb-3 last:border-0">
            <div className="mt-0.5">{statusIcons[step.status]}</div>
            <div className="flex-1">
              <div className="font-bold uppercase tracking-tighter mb-1">{step.step}</div>
              <div className="opacity-80 mb-1">{step.finding}</div>
              <div className="text-[10px] opacity-50 italic">Evidence: {step.evidence}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
