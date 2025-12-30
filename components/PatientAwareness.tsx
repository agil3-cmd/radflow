
import React, { useState } from 'react';
import { PatientStudy, Priority } from '../types';
import { geminiService } from '../services/gemini';

const PatientAwareness: React.FC<{ studies: PatientStudy[] }> = ({ studies }) => {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [delayReason, setDelayReason] = useState('An emergency trauma case (Stat) just arrived requiring immediate scan.');
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExplanation = async () => {
    const patient = studies.find(s => s.id === selectedPatientId);
    if (!patient) return;

    setIsGenerating(true);
    try {
      const msg = await geminiService.generatePatientExplanation(patient.name, delayReason);
      setExplanation(msg);
    } catch (e) {
      alert("Failed to generate message");
    } finally {
      setIsGenerating(false);
    }
  };

  const commonReasons = [
    "An emergency trauma case (Stat) just arrived requiring immediate scan.",
    "A patient requires a specific fasting duration which has just been met.",
    "Contrast prep time is varying between patients for safety reasons.",
    "Equipment calibration is currently in progress to ensure accuracy."
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Automated Patient Awareness</h2>
        <p className="text-slate-500">Generate empathetic explanations to reduce waiting room friction.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">1. Select Patient to Update</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">-- Select Patient --</option>
              {studies.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">2. Reason for Priority Shift</label>
            <textarea
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              className="w-full min-h-[100px] p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 text-sm"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {commonReasons.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setDelayReason(r)}
                  className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition"
                >
                  Quick: Reason {i+1}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateExplanation}
            disabled={isGenerating || !selectedPatientId}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
          >
            {isGenerating ? "Crafting Message..." : "Generate AI Explanation"}
          </button>
        </div>

        <div>
          {explanation ? (
            <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-xl shadow-indigo-100 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
                </svg>
              </div>
              <div className="text-indigo-200 font-bold uppercase tracking-tighter text-[10px]">Suggested Script for Patient</div>
              <p className="text-lg font-medium leading-relaxed italic">
                "{explanation}"
              </p>
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-white text-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-50 transition text-sm">Copy Script</button>
                <button className="flex-1 bg-indigo-500 text-white py-2 rounded-lg font-bold hover:bg-indigo-400 transition text-sm">Print Card</button>
              </div>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center text-slate-400 flex flex-col items-center gap-4">
              <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <div>
                <p className="text-lg font-semibold text-slate-500">Ready to help patients</p>
                <p className="text-xs">Select a patient and a reason to generate an AI explanation.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAwareness;
