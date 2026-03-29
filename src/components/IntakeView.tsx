import React, { useState } from 'react';
import { processIntakeForm } from '../services/geminiService';
import { AuditTrail } from './AuditTrail';
import { Loader2, FileText, FileUp, Database, CheckCircle } from 'lucide-react';

export function IntakeView() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleProcess = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const data = await processIntakeForm(content);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadTestData = () => {
    setContent(`Patient Name: Sarah Jenkins
DOB: 04/12/1975
Chief Complaint: Severe lower back pain radiating to left leg for 2 weeks.
History: Previous physical therapy in 2023. No recent trauma.
Current Meds: Ibuprofen 400mg as needed.`);
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-serif italic mb-2">Intake & Documentation Agent</h2>
        <p className="text-sm opacity-60">Digital form processing, EHR pre-filling, and clinical summarization.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Raw Intake Data / Digital Form</label>
              <button 
                onClick={loadTestData}
                className="text-[10px] uppercase tracking-widest font-bold hover:underline"
              >
                Load Test Data
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw intake form data or patient-submitted documentation here..."
              className="w-full h-80 bg-white border border-[#141414] p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#141414] resize-none"
            />
          </div>
          
          <button
            onClick={handleProcess}
            disabled={loading || !content.trim()}
            className="w-full bg-[#141414] text-[#E4E3E0] py-3 font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} />}
            Process & Pre-fill EHR
          </button>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="bg-white border border-[#141414] p-6">
                <h3 className="font-serif italic text-lg mb-4 border-b border-[#141414] pb-2">EHR Staging Area</h3>
                
                <div className="mb-6">
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2">Clinical Summary</div>
                  <p className="text-sm italic bg-[#141414]/5 p-3 border-l-2 border-[#141414]">{result.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.extractedFields).map(([key, value]) => (
                    <div key={key} className="border border-[#141414]/10 p-3">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-xs font-mono">{value as string}</div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 border border-[#141414] py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
                  <Database size={14} />
                  Commit to EHR System
                </button>
              </div>

              <AuditTrail steps={result.auditTrail} />
            </>
          ) : (
            <div className="h-full border border-dashed border-[#141414]/30 flex flex-col items-center justify-center p-12 text-center opacity-40">
              <FileText size={48} strokeWidth={1} className="mb-4" />
              <p className="font-serif italic">Processed EHR fields and summaries will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
