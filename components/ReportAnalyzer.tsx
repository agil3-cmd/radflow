
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { ReportAnalysis } from '../types';
import { ICONS } from '../constants';

const ReportAnalyzer: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadSample = () => {
    setReportText(`[CLINICAL HISTORY]
Patient is a 58-year-old male with a history of hypertension and chronic kidney disease stage 2. Presents with generalized abdominal pain, predominantly in the right lower quadrant, and occasional hematuria.

[LAB DATA]
Creatinine: 1.4 mg/dL (Baseline 1.2). GFR: 58. WBC: 11.4k.

[IMAGING FINDINGS - CT ABDOMEN/PELVIS]
The liver is normal in size and attenuation without focal lesion. Gallbladder is surgically absent. Spleen and pancreas are unremarkable.
The right kidney contains a 3.4 cm exophytic enhancing mass at the lower pole, suspicious for renal cell carcinoma. The left kidney contains multiple simple cysts, the largest measuring 1.2 cm.
No evidence of bowel obstruction. 
There is a small amount of free fluid in the pelvic cul-de-sac.
No suspicious bony lesions.`);
  };

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;
    setIsLoading(true);
    try {
      const result = await geminiService.analyzeReport(reportText);
      setAnalysis(result);
    } catch (e) {
      alert("Analysis failed. Please check your API configuration or network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Report Analyzer</h2>
          <p className="text-lg text-slate-500 mt-1">Smart context extraction from legacy medical documentation.</p>
        </div>
        <button 
          onClick={loadSample}
          className="bg-white text-slate-700 px-5 py-3 rounded-2xl font-black text-sm border-2 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition shadow-sm active:scale-95"
        >
          Load Sample Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <label className="text-lg font-black text-slate-800">Unstructured Text Input</label>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">GPT-4o/Gemini Core</span>
          </div>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="flex-1 min-h-[400px] p-6 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 focus:outline-none text-slate-800 font-mono text-base leading-relaxed bg-slate-50 transition-all placeholder:text-slate-300"
            placeholder="Paste raw report text here or drag .doc content..."
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !reportText}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Patient Data...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Execute AI Summary
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          {analysis ? (
            <div className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-2xl shadow-indigo-100/30 animate-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <ICONS.Analyzer className="w-32 h-32" />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Structured Insights</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Medical Intelligence Layer</p>
                </div>
              </div>
              
              <AnalysisSection title="History & Clinical Context" content={analysis.clinicalHistory} />
              <AnalysisSection title="Lab / Serum Correlations" content={analysis.labCorrelations} />
              <AnalysisSection title="Critical Findings" content={analysis.keyFindings} isPrimary />
              <AnalysisSection title="Management Plan / Follow-up" content={analysis.followUpSuggestions} />

              <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
                    alert("Copied to clipboard!");
                  }}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-800 font-black text-sm hover:bg-slate-200 transition active:scale-95"
                >
                  Export JSON
                </button>
                <button className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95">
                  Append to PACS
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center p-16 text-center text-slate-400">
              <div className="bg-slate-200 p-6 rounded-full mb-6">
                <ICONS.Analyzer className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-500 mb-3">AI Engine Offline</h3>
              <p className="max-w-xs text-lg font-medium leading-relaxed">Paste clinical findings or a legacy report on the left to activate extraction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalysisSection: React.FC<{ title: string; content: string; isPrimary?: boolean }> = ({ title, content, isPrimary }) => (
  <div className="mb-8 last:mb-0">
    <div className={`text-[10px] font-black uppercase tracking-widest mb-2.5 ${isPrimary ? 'text-indigo-600' : 'text-slate-400'}`}>{title}</div>
    <div className={`p-6 rounded-2xl leading-relaxed text-base font-bold shadow-sm ${isPrimary ? 'bg-indigo-600 text-white border-2 border-indigo-500' : 'bg-slate-50 text-slate-800 border border-slate-100'}`}>
      {content}
    </div>
  </div>
);

export default ReportAnalyzer;
