
import React, { useState } from 'react';
import { PatientStudy, StudyStatus } from '../types';

interface CollaborationHubProps {
  studies: PatientStudy[];
  onUpdate: (id: string, updates: Partial<PatientStudy>) => void;
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ studies, onUpdate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeStudy = studies.find(s => s.id === selectedId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Team Collaboration Hub</h2>
          <p className="text-slate-500">Live sync between Radiologists, Technologists, and Staff.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Live Sync Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Studies in Progress List */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 flex justify-between text-sm">
            Active Worklist
            <span className="text-slate-400 font-normal">{studies.length} studies</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {studies.map(study => (
              <button
                key={study.id}
                onClick={() => setSelectedId(study.id)}
                className={`w-full p-4 text-left border-b border-slate-50 transition-colors flex items-center justify-between group ${selectedId === study.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
              >
                <div>
                  <div className={`font-bold text-sm ${selectedId === study.id ? 'text-indigo-700' : 'text-slate-800'}`}>{study.name}</div>
                  <div className="text-xs text-slate-500">{study.modality} • {study.status}</div>
                </div>
                {study.technologistFlag && (
                  <span className="bg-red-500 w-1.5 h-1.5 rounded-full shadow-sm"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Messaging / Flagging Area */}
        <div className="md:col-span-2 space-y-4">
          {activeStudy ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{activeStudy.name}</h3>
                  <p className="text-xs text-slate-500">{activeStudy.studyType} • Status: <span className="text-indigo-600 font-bold">{activeStudy.status}</span></p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onUpdate(activeStudy.id, { technologistFlag: 'Additional Views Needed' })}
                    className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg hover:bg-red-200 transition"
                  >
                    Flag Tech
                  </button>
                  <button 
                    onClick={() => onUpdate(activeStudy.id, { status: StudyStatus.REPORTING })}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg hover:bg-indigo-200 transition"
                  >
                    Mark Ready
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Radiologist Note</label>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 min-h-[100px] text-sm text-slate-700 italic">
                    {activeStudy.radiologistNote || "No active notes from radiologist."}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <ActionBox 
                    title="Radiologist Inquiry" 
                    icon="❓" 
                    onClick={() => {
                      const note = prompt("Enter note for Radiologist:");
                      if (note) onUpdate(activeStudy.id, { radiologistNote: note });
                    }} 
                  />
                  <ActionBox 
                    title="Scan Complete" 
                    icon="✅" 
                    onClick={() => onUpdate(activeStudy.id, { status: StudyStatus.REPORTING })} 
                  />
                  <ActionBox 
                    title="Need Contrast" 
                    icon="💉" 
                    onClick={() => alert("Nurse notified for IV placement.")} 
                  />
                  <ActionBox 
                    title="Request Views" 
                    icon="📸" 
                    onClick={() => onUpdate(activeStudy.id, { technologistFlag: "Need Lateral View" })} 
                  />
                </div>
                
                {activeStudy.technologistFlag && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <div className="bg-red-500 text-white p-1.5 rounded-lg text-xs">⚠️</div>
                    <div>
                      <div className="text-red-800 font-bold text-xs">Action Required by Technologist</div>
                      <div className="text-red-700 text-[10px]">{activeStudy.technologistFlag}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
               <svg className="w-10 h-10 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
               </svg>
               <h3 className="text-lg font-bold text-slate-500">Select a study to collaborate</h3>
               <p className="text-xs">Click on any patient in the worklist to start communicating.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionBox: React.FC<{ title: string; icon: string; onClick: () => void }> = ({ title, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 rounded-xl transition-all duration-200 group"
  >
    <div className="text-xl mb-2 transition-transform group-hover:scale-125">{icon}</div>
    <div className="text-[10px] font-bold text-slate-600 group-hover:text-indigo-700">{title}</div>
  </button>
);

export default CollaborationHub;
