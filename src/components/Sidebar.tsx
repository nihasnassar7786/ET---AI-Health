import React from 'react';
import { LayoutDashboard, FileCode, ClipboardCheck, ShieldCheck, Settings, LogOut, Users, FileText, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'coding', label: 'Medical Coding', icon: FileCode },
  { id: 'claims', label: 'Claims Adjudication', icon: ClipboardCheck },
  { id: 'prior-auth', label: 'Prior Authorization', icon: ShieldCheck },
  { id: 'scheduling', label: 'Patient Access', icon: Users },
  { id: 'intake', label: 'Intake & Docs', icon: FileText },
  { id: 'clinical', label: 'Clinical Support', icon: Activity },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-[#141414] text-[#E4E3E0] h-screen flex flex-col border-r border-[#141414]">
      <div className="p-6 border-b border-[#2A2A2A]">
        <h1 className="text-xl font-serif italic tracking-tight">CareOps AI</h1>
        <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Operations Control</p>
      </div>
      
      <nav className="flex-1 py-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200",
              activeTab === item.id 
                ? "bg-[#E4E3E0] text-[#141414] font-medium" 
                : "hover:bg-[#2A2A2A] opacity-70 hover:opacity-100"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-[#2A2A2A] flex flex-col gap-4">
        <button className="flex items-center gap-3 text-sm opacity-50 hover:opacity-100 transition-opacity">
          <Settings size={18} />
          Settings
        </button>
        <button className="flex items-center gap-3 text-sm opacity-50 hover:opacity-100 transition-opacity text-red-400">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
