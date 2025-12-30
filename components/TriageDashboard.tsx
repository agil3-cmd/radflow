
import React, { useState } from 'react';
import { PatientStudy, StudyStatus, Priority } from '../types';

interface TriageDashboardProps {
  studies: PatientStudy[];
  onUpdate: (id: string, updates: Partial<PatientStudy>) => void;
  onAdd: (study: PatientStudy) => void;
}

const TriageDashboard: React.FC<TriageDashboardProps> = ({ studies, onUpdate, onAdd }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'M',
    modality: 'CT',
    studyType: '',
    priority: Priority.ROUTINE
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudy: PatientStudy = {
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      modality: formData.modality as any,
      studyType: formData.studyType,
      priority: formData.priority as Priority,
      status: StudyStatus.REGISTERED,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onAdd(newStudy);
    setIsAddModalOpen(false);
    setFormData({ name: '', age: '', gender: 'M', modality: 'CT', studyType: '', priority: Priority.ROUTINE });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.STAT: return 'bg-rose-100 text-rose-700 border-rose-200';
      case Priority.CONTRAST: return 'bg-orange-100 text-orange-700 border-orange-200';
      case Priority.FASTING: return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.REGISTERED: return 'bg-slate-100 text-slate-600 border-slate-200';
      case StudyStatus.IN_ROOM: return 'bg-indigo-600 text-white border-indigo-700';
      case StudyStatus.REPORTING: return 'bg-amber-500 text-white border-amber-600';
      case StudyStatus.DISPATCHED: return 'bg-emerald-500 text-white border-emerald-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Triage Dashboard</h2>
          <p className="text-lg text-slate-500 mt-1">Orchestrating patient flow with real-time AI assistance.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black text-base hover:bg-indigo-700 transition flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Register Patient
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Live Tracker" value={studies.filter(s => s.status !== StudyStatus.DISPATCHED).length} color="indigo" sub="Patients in floor" />
        <StatCard label="Urgent" value={studies.filter(s => s.priority === Priority.STAT).length} color="red" sub="Require immediate action" />
        <StatCard label="Queue" value={studies.filter(s => s.status === StudyStatus.REGISTERED).length} color="amber" sub="Waiting for room" />
        <StatCard label="Efficiency" value="92%" color="emerald" sub="Workflow throughput" />
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Identification</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Triage Type</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Study</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Arrival</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold italic">No patients registered in the current session.</td>
                </tr>
              ) : studies.map((study) => (
                <tr key={study.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="font-black text-lg text-slate-900">{study.name}</div>
                    <div className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase font-mono">{study.id}</span>
                      <span>•</span>
                      <span>{study.age}y / {study.gender}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 inline-block shadow-sm ${getPriorityColor(study.priority)}`}>
                      {study.priority}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="font-black text-base text-slate-800">{study.modality}</div>
                    <div className="text-xs font-bold text-slate-500 truncate max-w-[160px]">{study.studyType}</div>
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-slate-500">{study.arrivalTime}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border inline-block ${getStatusBadge(study.status)}`}>
                      {study.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <select 
                      value={study.status}
                      onChange={(e) => onUpdate(study.id, { status: e.target.value as StudyStatus })}
                      className="text-xs font-black border-2 border-slate-200 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:border-indigo-400 transition-all outline-none"
                    >
                      {Object.values(StudyStatus).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-600 px-8 py-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black">Patient Registration</h3>
                <p className="text-indigo-100 text-sm font-bold opacity-80 uppercase tracking-widest">Entry Verification</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-indigo-500 outline-none transition" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Age</label>
                  <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-indigo-500 outline-none transition" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-indigo-500 outline-none transition">
                    <option>M</option><option>F</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Modality</label>
                  <select value={formData.modality} onChange={e => setFormData({...formData, modality: e.target.value})} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-indigo-500 outline-none transition">
                    <option>CT</option><option>MRI</option><option>X-Ray</option><option>US</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-indigo-500 outline-none transition">
                    {Object.values(Priority).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Study Type Details</label>
                  <input required type="text" placeholder="e.g. Brain w/ Contrast" value={formData.studyType} onChange={e => setFormData({...formData, studyType: e.target.value})} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-indigo-500 outline-none transition" />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 mt-4">Confirm Registration</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number | string; color: string; sub: string }> = ({ label, value, color, sub }) => {
  const colorClasses: any = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
    red: "bg-rose-50 border-rose-100 text-rose-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
  };
  return (
    <div className={`p-6 rounded-3xl border-2 ${colorClasses[color] || colorClasses.indigo} shadow-sm transition-transform hover:-translate-y-1 duration-300`}>
      <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</div>
      <div className="text-4xl font-black">{value}</div>
      <div className="text-[10px] font-bold mt-2 opacity-80">{sub}</div>
    </div>
  );
};

export default TriageDashboard;
