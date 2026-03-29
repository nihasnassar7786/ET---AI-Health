import React, { useState } from 'react';
import { detectClinicalRisks } from '../services/geminiService';
import { AuditTrail } from './AuditTrail';
import { Loader2, Activity, ShieldAlert, HeartPulse, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export function ClinicalSupportView() {
  const [patientData, setPatientData] = useState({
    name: 'Robert Miller',
    age: 68,
    vitals: 'BP: 145/92, HR: 88, Temp: 99.1F, SpO2: 94%',
    labs: 'WBC: 12.5, Lactate: 2.1, Procalcitonin: 0.15',
    history: 'CHF, Type 2 Diabetes, Recent discharge (3 days ago) for pneumonia.'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await detectClinicalRisks(patientData);
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
        <h2 className="text-3xl font-serif italic mb-2">Clinical Decision Support Agent</h2>
        <p className="text-sm opacity-60">Real-time risk detection for readmission, sepsis, and care gaps.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-[#141414] p-6 space-y-4">
            <h3 className="font-serif italic text-lg mb-4 border-b border-[#141414] pb-2">Patient Monitoring Data</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Patient Name</label>
                <div className="font-bold">{patientData.name} ({patientData.age}y)</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Vitals & Labs</label>
                <textarea
                  value={patientData.vitals + '\n' + patientData.labs}
                  readOnly
                  className="w-full h-24 bg-[#141414]/5 border border-[#141414]/10 p-3 font-mono text-xs resize-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Clinical History</label>
                <textarea
                  value={patientData.history}
                  readOnly
                  className="w-full h-24 bg-[#141414]/5 border border-[#141414]/10 p-3 font-mono text-xs resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-[#141414] text-[#E4E3E0] py-3 font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              Run Risk Analysis
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="space-y-4">
                {result.risks.map((risk: any, idx: number) => (
                  <div key={idx} className={cn(
                    "p-6 border flex gap-4",
                    risk.score > 70 ? "bg-red-50 border-red-500 text-red-900" :
                    risk.score > 40 ? "bg-amber-50 border-amber-500 text-amber-900" :
                    "bg-green-50 border-green-500 text-green-900"
                  )}>
                    <div className="mt-1">
                      {risk.riskType === 'sepsis' ? <HeartPulse size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold uppercase tracking-tighter text-lg">
                          {risk.riskType.replace('_', ' ')} Risk
                        </h4>
                        <span className="font-mono font-bold text-xl">{risk.score}%</span>
                      </div>
                      <p className="text-sm mb-3 opacity-80">{risk.reasoning}</p>
                      <div className="bg-white/50 p-2 border border-current/10 text-xs font-bold">
                        REC: {risk.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <AuditTrail steps={result.auditTrail} />
            </>
          ) : (
            <div className="h-full border border-dashed border-[#141414]/30 flex flex-col items-center justify-center p-12 text-center opacity-40">
              <Activity size={48} strokeWidth={1} className="mb-4" />
              <p className="font-serif italic">Risk assessments and clinical reasoning will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
