import React, { useState } from 'react';
import { adjudicateClaim } from '../services/geminiService';
import { AuditTrail } from './AuditTrail';
import { Loader2, ClipboardCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ClaimsViewProps {
  claims: any[];
}

export function ClaimsView({ claims }: ClaimsViewProps) {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAdjudicate = async () => {
    if (!selectedClaim) return;
    setLoading(true);
    try {
      const data = await adjudicateClaim(selectedClaim);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-serif italic mb-2">Claims Adjudication Agent</h2>
        <p className="text-sm opacity-60">Automated policy compliance and payment determination engine.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Pending Claims Queue</label>
            <div className="space-y-2">
              {claims.map((claim) => (
                <button
                  key={claim.id}
                  onClick={() => {
                    setSelectedClaim(claim);
                    setResult(null);
                  }}
                  className={cn(
                    "w-full text-left p-4 border transition-all duration-200",
                    selectedClaim?.id === claim.id 
                      ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" 
                      : "bg-white border-[#141414]/10 hover:border-[#141414]"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-bold">{claim.id}</span>
                    <span className="text-[10px] opacity-60">{claim.dos}</span>
                  </div>
                  <div className="font-bold mb-1">{claim.patient}</div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs opacity-60 font-bold">${claim.amount.toFixed(2)}</div>
                    <div className="text-[9px] uppercase tracking-tighter bg-[#141414]/10 px-1">Commercial</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedClaim ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white border border-[#141414] p-6">
                  <h3 className="font-serif italic text-lg mb-4 border-b border-[#141414] pb-2">Claim Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <div className="text-[10px] opacity-50 uppercase mb-1">Diagnosis Codes</div>
                      <div className="flex gap-1 flex-wrap">
                        {selectedClaim.diagnosis.map((c: string) => (
                          <span key={c} className="bg-[#141414]/5 px-2 py-0.5 border border-[#141414]/10">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] opacity-50 uppercase mb-1">Procedure Codes</div>
                      <div className="flex gap-1 flex-wrap">
                        {selectedClaim.procedures.map((c: string) => (
                          <span key={c} className="bg-[#141414]/5 px-2 py-0.5 border border-[#141414]/10">{c}</span>
                        ))}
                      </div>
                    </div>
                    {selectedClaim.patientStatus && (
                      <div className="mt-2">
                        <div className="text-[10px] opacity-50 uppercase mb-1">Patient Status</div>
                        <div className="text-xs font-bold bg-blue-50 text-blue-900 px-2 py-1 border border-blue-200 inline-block">
                          {selectedClaim.patientStatus} Patient
                        </div>
                      </div>
                    )}
                    {selectedClaim.authId && (
                      <div className="mt-2">
                        <div className="text-[10px] opacity-50 uppercase mb-1">Linked Pre-Auth</div>
                        <div className="text-xs font-bold bg-green-50 text-green-900 px-2 py-1 border border-green-200 inline-block">
                          {selectedClaim.authId}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleAdjudicate}
                    disabled={loading}
                    className="w-full mt-6 bg-[#141414] text-[#E4E3E0] py-3 font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ClipboardCheck size={16} />}
                    Run Adjudication Engine
                  </button>
                </div>

                {result && (
                  <div className={cn(
                    "p-6 border flex gap-4",
                    result.decision === 'approved' ? "bg-green-50 border-green-500 text-green-900" :
                    result.decision === 'denied' ? "bg-red-50 border-red-500 text-red-900" :
                    "bg-amber-50 border-amber-500 text-amber-900"
                  )}>
                    <div className="mt-1">
                      {result.decision === 'approved' ? <CheckCircle size={24} /> :
                       result.decision === 'denied' ? <AlertTriangle size={24} /> :
                       <AlertTriangle size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-tighter text-lg mb-1">
                        Decision: {result.decision}
                      </h4>
                      <p className="text-sm opacity-80 italic">{result.finalReason}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {result && <AuditTrail steps={result.auditTrail} />}
              </div>
            </div>
          ) : (
            <div className="h-full border border-dashed border-[#141414]/30 flex flex-col items-center justify-center p-12 text-center opacity-40">
              <ClipboardCheck size={48} strokeWidth={1} className="mb-4" />
              <p className="font-serif italic">Select a claim from the queue to begin adjudication.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
