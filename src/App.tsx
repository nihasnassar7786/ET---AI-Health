import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CodingView } from './components/CodingView';
import { ClaimsView } from './components/ClaimsView';
import { PriorAuthView } from './components/PriorAuthView';
import { SchedulingView } from './components/SchedulingView';
import { IntakeView } from './components/IntakeView';
import { ClinicalSupportView } from './components/ClinicalSupportView';

const initialClaims = [
  {
    id: 'CLM-9821',
    patient: 'Sarah Jenkins',
    dos: '2026-03-15',
    diagnosis: ['M54.50'],
    procedures: ['99213', '97110'],
    amount: 245.00,
  },
  {
    id: 'CLM-9822',
    patient: 'Robert Miller',
    dos: '2026-03-16',
    diagnosis: ['I10'],
    procedures: ['99214', '80053'],
    amount: 185.50,
  },
  {
    id: 'CLM-9823',
    patient: 'Emily Watson',
    dos: '2026-03-28',
    diagnosis: ['R10.9'],
    procedures: ['99212'],
    patientStatus: 'New',
    amount: 120.00,
  }
];

const ehrPatients = [
  { id: 'P-1001', name: 'Sarah Jenkins', dob: '1975-04-12', status: 'Established' },
  { id: 'P-1002', name: 'Robert Miller', dob: '1958-09-22', status: 'Established' },
  { id: 'P-1003', name: 'Emily Watson', dob: '1988-05-12', status: 'New' },
  { id: 'P-1004', name: 'Michael Chen', dob: '1992-11-30', status: 'New' },
  { id: 'P-1005', name: 'Linda Thompson', dob: '1965-02-14', status: 'Established' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [claims, setClaims] = useState(initialClaims);
  const [approvedAuths, setApprovedAuths] = useState<any[]>([]);

  const handleAddClaim = (newClaim: any) => {
    setClaims(prev => [newClaim, ...prev]);
    // If claim was linked to an auth, we could remove it from approvedAuths
    if (newClaim.authId) {
      setApprovedAuths(prev => prev.filter(a => a.id !== newClaim.authId));
    }
    setActiveTab('claims');
  };

  const handleAddAuth = (auth: any) => {
    setApprovedAuths(prev => [auth, ...prev]);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'coding':
        return <CodingView onClaimCreated={handleAddClaim} patients={ehrPatients} approvedAuths={approvedAuths.filter(a => a.status === 'approved')} />;
      case 'claims':
        return <ClaimsView claims={claims} />;
      case 'prior-auth':
        return <PriorAuthView onAuthApproved={handleAddAuth} />;
      case 'scheduling':
        return <SchedulingView />;
      case 'intake':
        return <IntakeView />;
      case 'clinical':
        return <ClinicalSupportView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col min-w-0">
        {renderView()}
      </main>
    </div>
  );
}
