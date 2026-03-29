import React from 'react';
import { Activity, Users, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const stats = [
  { label: 'Claims Pending', value: '142', icon: Clock, color: 'text-amber-500' },
  { label: 'Prior Auths Today', value: '28', icon: Activity, color: 'text-blue-500' },
  { label: 'Coding Accuracy', value: '98.4%', icon: CheckCircle, color: 'text-green-500' },
  { label: 'Flagged for Review', value: '12', icon: AlertCircle, color: 'text-red-500' },
];

export function DashboardView() {
  return (
    <div className="flex-1 p-8 overflow-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-serif italic mb-2">Operations Overview</h2>
        <p className="text-sm opacity-60">Real-time monitoring of healthcare administrative workflows.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-[#141414] p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-4xl font-mono font-bold tracking-tighter">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-[#141414] p-6">
          <h3 className="font-serif italic text-lg mb-4 border-b border-[#141414] pb-2">Recent Activity</h3>
          <div className="space-y-4 font-mono text-xs">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center border-b border-[#141414]/5 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <div className="font-bold">Claim CLM-982{i} Adjudicated</div>
                    <div className="opacity-50">Approved • 2m ago</div>
                  </div>
                </div>
                <button className="text-[10px] uppercase tracking-widest font-bold hover:underline">View Audit</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#141414] p-6">
          <h3 className="font-serif italic text-lg mb-4 border-b border-[#141414] pb-2">System Health</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span>AI Reasoning Confidence</span>
                <span>94%</span>
              </div>
              <div className="h-1 bg-[#141414]/10">
                <div className="h-full bg-[#141414] w-[94%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span>Policy Engine Coverage</span>
                <span>87%</span>
              </div>
              <div className="h-1 bg-[#141414]/10">
                <div className="h-full bg-[#141414] w-[87%]"></div>
              </div>
            </div>
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#141414]/5 border border-[#141414]/10 text-center">
                <div className="text-2xl font-bold font-mono">1.2s</div>
                <div className="text-[10px] uppercase opacity-50">Avg Latency</div>
              </div>
              <div className="p-4 bg-[#141414]/5 border border-[#141414]/10 text-center">
                <div className="text-2xl font-bold font-mono">99.9%</div>
                <div className="text-[10px] uppercase opacity-50">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
