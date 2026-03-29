import React, { useState } from 'react';
import { analyzeMedicalCoding } from '../services/geminiService';
import { AuditTrail } from './AuditTrail';
import { Loader2, Search, Plus, ClipboardCheck, FileCode, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface Patient {
  id: string;
  name: string;
  dob: string;
  status: string;
}

interface CodingViewProps {
  onClaimCreated?: (claim: any) => void;
  patients?: Patient[];
  approvedAuths?: any[];
}

export function CodingView({ onClaimCreated, patients = [], approvedAuths = [] }: CodingViewProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedAuth, setSelectedAuth] = useState<any | null>(null);
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patientAuths = approvedAuths.filter(a => 
    selectedPatient && a.patientName.toLowerCase() === selectedPatient.name.toLowerCase()
  );

  const handleAnalyze = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeMedicalCoding(notes);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClaim = () => {
    if (!result || !onClaimCreated || !selectedPatient) return;
    
    const newClaim = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: selectedPatient.name,
      patientId: selectedPatient.id,
      patientStatus: selectedPatient.status,
      authId: selectedAuth?.id,
      dos: new Date().toISOString().split('T')[0],
      diagnosis: result.suggestedCodes.filter((c: any) => c.type === 'ICD-10').map((c: any) => c.code),
      procedures: result.suggestedCodes.filter((c: any) => c.type === 'CPT').map((c: any) => c.code),
      amount: result.suggestedCodes.length * 125.00, // Mock calculation
    };

    onClaimCreated(newClaim);
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-serif italic mb-2">Medical Coding Agent</h2>
        <p className="text-sm opacity-60">AI-assisted ICD-10 and CPT code extraction from clinical documentation.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Patient Selection */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Member Selection (EHR)</label>
            <div 
              className="w-full bg-white border border-[#141414] p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
            >
              <div className="flex items-center gap-3">
                <User size={16} className="opacity-50" />
                {selectedPatient ? (
                  <div>
                    <span className="font-bold">{selectedPatient.name}</span>
                    <span className="text-[10px] opacity-50 ml-2 font-mono">{selectedPatient.id} • DOB: {selectedPatient.dob}</span>
                  </div>
                ) : (
                  <span className="text-sm opacity-50 italic">Select a patient from EHR...</span>
                )}
              </div>
              <ChevronDown size={16} className={cn("transition-transform", isPatientDropdownOpen && "rotate-180")} />
            </div>

            {isPatientDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#141414] z-50 shadow-xl max-h-64 overflow-auto">
                <div className="p-2 border-b border-[#141414]/10 sticky top-0 bg-white">
                  <input 
                    type="text" 
                    placeholder="Search by name or ID..."
                    className="w-full p-2 text-xs font-mono border border-[#141414]/10 focus:outline-none focus:border-[#141414]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {filteredPatients.map(p => (
                  <div 
                    key={p.id}
                    className="p-3 hover:bg-[#141414] hover:text-[#E4E3E0] cursor-pointer transition-colors border-b border-[#141414]/5 last:border-0"
                    onClick={() => {
                      setSelectedPatient(p);
                      setIsPatientDropdownOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-[10px] font-mono opacity-60">{p.id} • DOB: {p.dob} • {p.status}</div>
                  </div>
                ))}
                {filteredPatients.length === 0 && (
                  <div className="p-4 text-center text-xs opacity-50 italic">No patients found.</div>
                )}
              </div>
            )}
          </div>

          {/* Pre-Auth Selection */}
          {selectedPatient && patientAuths.length > 0 && (
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Link Approved Pre-Auth (Optional)</label>
              <div 
                className="w-full bg-white border border-[#141414] p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="opacity-50" />
                  {selectedAuth ? (
                    <div>
                      <span className="font-bold">{selectedAuth.id}</span>
                      <span className="text-[10px] opacity-50 ml-2 font-mono">{selectedAuth.procedureCode} • {selectedAuth.dateApproved}</span>
                    </div>
                  ) : (
                    <span className="text-sm opacity-50 italic">Link an approved authorization...</span>
                  )}
                </div>
                <ChevronDown size={16} className={cn("transition-transform", isAuthDropdownOpen && "rotate-180")} />
              </div>

              {isAuthDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#141414] z-50 shadow-xl max-h-64 overflow-auto">
                  <div 
                    className="p-3 hover:bg-[#141414] hover:text-[#E4E3E0] cursor-pointer transition-colors border-b border-[#141414]/5"
                    onClick={() => {
                      setSelectedAuth(null);
                      setIsAuthDropdownOpen(false);
                    }}
                  >
                    <div className="font-bold text-sm">None</div>
                    <div className="text-[10px] font-mono opacity-60">Do not link any authorization</div>
                  </div>
                  {patientAuths.map(auth => (
                    <div 
                      key={auth.id}
                      className="p-3 hover:bg-[#141414] hover:text-[#E4E3E0] cursor-pointer transition-colors border-b border-[#141414]/5 last:border-0"
                      onClick={() => {
                        setSelectedAuth(auth);
                        setIsAuthDropdownOpen(false);
                        // Optionally pre-fill notes or procedure codes if needed
                      }}
                    >
                      <div className="font-bold text-sm">{auth.id}</div>
                      <div className="text-[10px] font-mono opacity-60">{auth.procedureCode} • {auth.procedureDescription} • {auth.dateApproved}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Clinical Documentation</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste clinical notes, physician assessments, or operative reports here..."
              className="w-full h-64 bg-white border border-[#141414] p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#141414] resize-none"
            />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || !notes.trim() || !selectedPatient}
            className="w-full bg-[#141414] text-[#E4E3E0] py-3 font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Analyze Documentation
          </button>
          {!selectedPatient && !loading && (
            <p className="text-[10px] text-center text-red-600 font-bold uppercase tracking-widest">Please select a patient before analyzing</p>
          )}
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="bg-white border border-[#141414] p-6">
                <div className="flex justify-between items-center mb-4 border-b border-[#141414] pb-2">
                  <h3 className="font-serif italic text-lg">Suggested Codes</h3>
                  <button 
                    onClick={handleCreateClaim}
                    className="bg-[#141414] text-[#E4E3E0] px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-opacity-80 transition-all"
                  >
                    <ClipboardCheck size={12} />
                    Create Claim
                  </button>
                </div>
                <div className="space-y-4">
                  {result.suggestedCodes.map((item: any, idx: number) => (
                    <div key={idx} className="group border-b border-[#141414]/10 pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="bg-[#141414] text-[#E4E3E0] text-[10px] px-2 py-0.5 font-mono mr-2">
                            {item.type}
                          </span>
                          <span className="font-mono font-bold text-lg">{item.code}</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold mb-1">{item.description}</p>
                      <p className="text-xs opacity-60 italic">{item.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              <AuditTrail steps={result.auditTrail} />
            </>
          ) : (
            <div className="h-full border border-dashed border-[#141414]/30 flex flex-col items-center justify-center p-12 text-center opacity-40">
              <FileCode size={48} strokeWidth={1} className="mb-4" />
              <p className="font-serif italic">Analysis results will appear here after processing documentation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
