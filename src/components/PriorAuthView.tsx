import React, { useState } from 'react';
import { evaluatePriorAuth } from '../services/geminiService';
import { AuditTrail } from './AuditTrail';
import { Loader2, ShieldCheck, FileText, Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface PriorAuthViewProps {
  onAuthApproved?: (auth: any) => void;
}

export function PriorAuthView({ onAuthApproved }: PriorAuthViewProps) {
  const [formData, setFormData] = useState({
    patientName: 'Sarah Jenkins',
    procedureCode: '63030',
    clinicalNotes: 'Patient presents with chronic lower back pain radiating down left leg for 6 months. Failed conservative treatment including physical therapy and NSAIDs. MRI shows L4-L5 disc herniation with nerve root compression.'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const handleEvaluate = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const data = await evaluatePriorAuth(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApproval = () => {
    if (!result || !onAuthApproved) return;
    
    const authRecord = {
      id: `AUTH-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName: formData.patientName,
      procedureCode: result.identifiedCode?.code || formData.procedureCode,
      procedureDescription: result.identifiedCode?.description || 'Requested Procedure',
      dateApproved: new Date().toISOString().split('T')[0],
      status: 'approved',
      clinicalJustification: result.clinicalJustification
    };

    onAuthApproved(authRecord);
    setSaved(true);
  };

  const handleManualDeny = () => {
    if (!result) return;
    setResult({
      ...result,
      decision: 'denied',
      clinicalJustification: 'Request manually denied by reviewer due to policy non-compliance or lack of clinical evidence.'
    });
    setSaved(false);
  };

  const handleRecordDenial = () => {
    if (!result || !onAuthApproved) return;
    
    const authRecord = {
      id: `AUTH-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName: formData.patientName,
      procedureCode: result.identifiedCode?.code || formData.procedureCode,
      procedureDescription: result.identifiedCode?.description || 'Requested Procedure',
      dateProcessed: new Date().toISOString().split('T')[0],
      status: 'denied',
      clinicalJustification: result.clinicalJustification
    };

    onAuthApproved(authRecord); // We use the same callback but with 'denied' status
    setSaved(true);
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-serif italic mb-2">Prior Authorization Agent</h2>
        <p className="text-sm opacity-60">AI-driven medical necessity review and policy compliance check.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-[#141414] p-6 space-y-4">
            <h3 className="font-serif italic text-lg mb-4 border-b border-[#141414] pb-2">New Request</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Patient Name</label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="bg-transparent border-b border-[#141414] py-1 font-mono text-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Procedure Code (CPT)</label>
                <input
                  type="text"
                  value={formData.procedureCode}
                  onChange={(e) => setFormData({ ...formData, procedureCode: e.target.value })}
                  className="bg-transparent border-b border-[#141414] py-1 font-mono text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Clinical Notes & Justification</label>
              <textarea
                value={formData.clinicalNotes}
                onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                className="w-full h-48 bg-[#141414]/5 border border-[#141414]/10 p-4 font-mono text-sm focus:outline-none focus:border-[#141414] resize-none"
              />
            </div>

            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="w-full bg-[#141414] text-[#E4E3E0] py-3 font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Submit for Evaluation
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className={cn(
                "p-6 border",
                result.decision === 'approved' ? "bg-green-50 border-green-500 text-green-900" :
                result.decision === 'denied' ? "bg-red-50 border-red-500 text-red-900" :
                "bg-blue-50 border-blue-500 text-blue-900"
              )}>
                <h4 className="font-bold uppercase tracking-tighter text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck size={20} />
                  Status: {result.decision.replace('_', ' ')}
                </h4>
                
                {result.identifiedCode && (
                  <div className="mb-4 p-3 bg-white/50 border border-current/10 font-mono text-xs">
                    <div className="uppercase font-bold opacity-50 mb-1">Identified Procedure Code</div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-sm mr-2">{result.identifiedCode.code}</span>
                        <span className="opacity-70">{result.identifiedCode.description}</span>
                      </div>
                      {formData.procedureCode !== result.identifiedCode.code && (
                        <button 
                          onClick={() => setFormData(prev => ({ ...prev, procedureCode: result.identifiedCode.code }))}
                          className="underline hover:no-underline font-bold"
                        >
                          Update Form
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-sm italic font-medium mb-4">{result.clinicalJustification}</p>

                {!saved && (
                  <div className="flex flex-col gap-2">
                    {result.decision === 'approved' && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveApproval}
                          className="flex-1 bg-green-600 text-white py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                        >
                          <ShieldCheck size={14} />
                          Save Approval
                        </button>
                        <button
                          onClick={handleManualDeny}
                          className="bg-red-600 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                        >
                          Manual Deny
                        </button>
                      </div>
                    )}
                    
                    {result.decision === 'denied' && (
                      <button
                        onClick={handleRecordDenial}
                        className="w-full bg-red-600 text-white py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                      >
                        Record Denial in Registry
                      </button>
                    )}
                  </div>
                )}

                {saved && (
                  <div className={cn(
                    "text-center p-2 text-[10px] font-bold uppercase tracking-widest border",
                    result.decision === 'approved' ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
                  )}>
                    Authorization {result.decision === 'approved' ? 'Saved' : 'Denial Recorded'} to Registry
                  </div>
                )}
              </div>

              <AuditTrail steps={result.auditTrail} />
            </>
          ) : (
            <div className="h-full border border-dashed border-[#141414]/30 flex flex-col items-center justify-center p-12 text-center opacity-40">
              <FileText size={48} strokeWidth={1} className="mb-4" />
              <p className="font-serif italic">Evaluation results and clinical audit trail will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
