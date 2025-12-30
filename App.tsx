
import React, { useState, useEffect } from 'react';
import { StudyStatus, Priority, PatientStudy } from './types';
import { ICONS, INITIAL_STUDIES } from './constants';
import TriageDashboard from './components/TriageDashboard';
import ReportAnalyzer from './components/ReportAnalyzer';
import PatientAwareness from './components/PatientAwareness';
import CollaborationHub from './components/CollaborationHub';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyzer' | 'awareness' | 'team'>('dashboard');
  const [studies, setStudies] = useState<PatientStudy[]>(() => {
    const saved = localStorage.getItem('radflow_studies');
    return saved ? JSON.parse(saved) : INITIAL_STUDIES;
  });

  useEffect(() => {
    localStorage.setItem('radflow_studies', JSON.stringify(studies));
  }, [studies]);

  const updateStudy = (id: string, updates: Partial<PatientStudy>) => {
    setStudies(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addStudy = (newStudy: PatientStudy) => {
    setStudies(prev => [newStudy, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-1 rounded-md flex-shrink-0 shadow-sm shadow-indigo-100">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600 tracking-tight">
            RadFlow AI
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Active System</span>
            <span className="text-sm font-bold text-slate-500">Super Admin Mode</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-600 border border-indigo-200 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
            JD
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200 p-5 hidden md:flex flex-col gap-2">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            label="Triage Dashboard" 
            icon={<ICONS.Dashboard className="w-5 h-5" />} 
          />
          <NavItem 
            active={activeTab === 'analyzer'} 
            onClick={() => setActiveTab('analyzer')} 
            label="AI Report Analyzer" 
            icon={<ICONS.Analyzer className="w-5 h-5" />} 
          />
          <NavItem 
            active={activeTab === 'awareness'} 
            onClick={() => setActiveTab('awareness')} 
            label="Patient Awareness" 
            icon={<ICONS.Awareness className="w-5 h-5" />} 
          />
          <NavItem 
            active={activeTab === 'team'} 
            onClick={() => setActiveTab('team')} 
            label="Collaboration Hub" 
            icon={<ICONS.Team className="w-5 h-5" />} 
          />
          
          <div className="mt-auto p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Clinic Health</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 font-bold">Avg Wait:</span>
              <span className="text-sm text-indigo-700 font-black">24m</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               AI ASSISTANT READY
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto pb-12">
            {activeTab === 'dashboard' && <TriageDashboard studies={studies} onUpdate={updateStudy} onAdd={addStudy} />}
            {activeTab === 'analyzer' && <ReportAnalyzer />}
            {activeTab === 'awareness' && <PatientAwareness studies={studies} />}
            {activeTab === 'team' && <CollaborationHub studies={studies} onUpdate={updateStudy} />}
          </div>
        </main>
      </div>
      
      {/* Mobile Nav */}
      <nav className="md:hidden bg-white border-t border-slate-200 flex justify-around py-4 px-2 sticky bottom-0 z-20 shadow-xl">
        <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
          <ICONS.Dashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold">Triage</span>
        </button>
        <button onClick={() => setActiveTab('analyzer')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'analyzer' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
          <ICONS.Analyzer className="w-6 h-6" />
          <span className="text-[10px] font-bold">AI Docs</span>
        </button>
        <button onClick={() => setActiveTab('awareness')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'awareness' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
          <ICONS.Awareness className="w-6 h-6" />
          <span className="text-[10px] font-bold">Patient</span>
        </button>
        <button onClick={() => setActiveTab('team')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'team' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
          <ICONS.Team className="w-6 h-6" />
          <span className="text-[10px] font-bold">Team</span>
        </button>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'
    }`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className="font-bold text-base">{label}</span>
  </button>
);

export default App;
