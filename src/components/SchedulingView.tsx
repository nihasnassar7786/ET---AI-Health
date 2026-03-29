import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Search, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';

const sampleAppointments = [
  { id: 'APT-001', patient: 'Sarah Jenkins', date: '2026-03-30', time: '09:00 AM', type: 'Follow-up', status: 'confirmed' },
  { id: 'APT-002', patient: 'Robert Miller', date: '2026-03-30', time: '10:30 AM', type: 'Initial Consultation', status: 'pending' },
  { id: 'APT-003', patient: 'Michael Chen', date: '2026-03-30', time: '01:15 PM', type: 'Specialist Consult', status: 'confirmed' },
];

export function SchedulingView() {
  return (
    <div className="flex-1 p-8 overflow-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif italic mb-2">Patient Access & Scheduling</h2>
          <p className="text-sm opacity-60">24/7 intelligent scheduling and multilingual support.</p>
        </div>
        <button className="bg-[#141414] text-[#E4E3E0] px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-opacity-90">
          <UserPlus size={14} />
          New Appointment
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#141414] p-6">
            <div className="flex justify-between items-center mb-6 border-b border-[#141414] pb-4">
              <h3 className="font-serif italic text-lg">Daily Schedule — March 30, 2026</h3>
              <div className="flex gap-2">
                <button className="p-2 border border-[#141414]/10 hover:bg-[#141414]/5"><Search size={16} /></button>
                <button className="p-2 border border-[#141414]/10 hover:bg-[#141414]/5"><Plus size={16} /></button>
              </div>
            </div>

            <div className="space-y-4">
              {sampleAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-6 p-4 border border-[#141414]/5 hover:border-[#141414]/20 transition-all">
                  <div className="w-20 text-center border-r border-[#141414]/10 pr-6">
                    <div className="font-mono font-bold text-sm">{apt.time.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-50 uppercase">{apt.time.split(' ')[1]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{apt.patient}</div>
                    <div className="text-xs opacity-60">{apt.type}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 border",
                      apt.status === 'confirmed' ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700"
                    )}>
                      {apt.status}
                    </span>
                    <button className="text-[10px] uppercase font-bold hover:underline">Reschedule</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#141414] text-[#E4E3E0] p-6">
            <h3 className="font-serif italic text-lg mb-4 border-b border-white/20 pb-2">AI Access Assistant</h3>
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-white/5 border border-white/10">
                <div className="opacity-50 mb-1">Recent Interaction (Spanish)</div>
                <p className="italic">"Necesito cambiar mi cita del martes..."</p>
                <div className="mt-2 text-blue-400">→ Rescheduled to Thursday 10:00 AM</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/10">
                <div className="opacity-50 mb-1">Slot Optimization</div>
                <p>Radiology: 4 gaps detected. Auto-filling from waitlist...</p>
                <div className="mt-2 text-green-400">→ 3 slots filled (75% efficiency gain)</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#141414] p-6">
            <h3 className="font-serif italic text-lg mb-4 border-b border-[#141414] pb-2">Waitlist Management</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center text-xs border-b border-[#141414]/5 pb-2 last:border-0">
                  <span>Patient ID: WL-{800 + i}</span>
                  <span className="font-bold">Priority: High</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
