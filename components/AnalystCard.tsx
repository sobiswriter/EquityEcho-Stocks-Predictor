
import React from 'react';
import { Recommendation, AnalystPerspective } from '../types';
import { TrendingUp, TrendingDown, Minus, Briefcase, Newspaper, Scale, ShieldCheck } from 'lucide-react';

interface AnalystCardProps {
  perspective: AnalystPerspective;
  type: 'quant' | 'news' | 'judge';
}

const RecommendationBadge = ({ rec }: { rec: Recommendation }) => {
  const isBuy = rec?.toUpperCase()?.includes('BUY') || rec?.toUpperCase()?.includes('ACCUMULATE');
  const isSell = rec?.toUpperCase()?.includes('SELL') || rec?.toUpperCase()?.includes('REDUCE');
  const baseClasses = "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 border shadow-lg transition-all duration-300";
  
  if (isBuy) return <span className={`${baseClasses} bg-emerald-500/10 text-emerald-400 border-emerald-500/30`}><TrendingUp size={14}/> {rec}</span>;
  if (isSell) return <span className={`${baseClasses} bg-rose-500/10 text-rose-400 border-rose-500/30`}><TrendingDown size={14}/> {rec}</span>;
  return <span className={`${baseClasses} bg-amber-500/10 text-amber-400 border-amber-500/30`}><Minus size={14}/> {rec || 'HOLD'}</span>;
};

export const AnalystCard: React.FC<AnalystCardProps> = ({ perspective, type }) => {
  if (!perspective) return null;

  const isJudge = type === 'judge';

  const icons = {
    quant: <Briefcase className="text-blue-400" size={24} />,
    news: <Newspaper className="text-orange-400" size={24} />,
    judge: <Scale className="text-purple-400" size={24} />
  };

  const colors = {
    quant: "text-blue-400 border-blue-500/20 bg-blue-500/[0.03]",
    news: "text-orange-400 border-orange-500/20 bg-orange-500/[0.03]",
    judge: "text-purple-400 border-purple-500/20 bg-purple-500/[0.03]"
  };

  // Logic to highlight the Judge's concluding decree if present
  const renderRationale = (text: string) => {
    if (!isJudge) return text;
    
    const parts = text.split(/(FINAL DECREE:.*)/i);
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl shadow-inner animate-in fade-in slide-in-from-bottom-2 duration-700">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/60 block mb-2">Verdict Execution</span>
             <span className="text-slate-100 font-black tracking-tight leading-tight block uppercase italic">
               {parts[1]}
             </span>
          </div>
        </>
      );
    }
    return text;
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border ${colors[type]} backdrop-blur-md flex flex-col h-full transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 relative overflow-hidden group ${isJudge ? 'ring-2 ring-purple-500/20 ring-offset-4 ring-offset-slate-950' : ''}`}>
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-current opacity-[0.02] rounded-full blur-3xl group-hover:opacity-[0.05] transition-opacity pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner group-hover:border-current transition-all duration-500">
            {icons[type]}
          </div>
          <div>
            <h4 className="font-black text-xl leading-tight tracking-tight text-slate-100 uppercase italic">{perspective.name}</h4>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] mt-0.5">{perspective.title}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
         <RecommendationBadge rec={perspective.recommendation} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="relative mb-10">
          <span className="absolute -top-6 -left-2 text-6xl text-slate-800 font-serif leading-none opacity-30 select-none">"</span>
          <div className="text-slate-300 text-sm leading-relaxed font-medium relative z-10 italic">
            {renderRationale(perspective.rationale)}
          </div>
          <span className="absolute -bottom-10 -right-2 text-6xl text-slate-800 font-serif leading-none opacity-30 rotate-180 select-none">"</span>
        </div>
        
        <div className="mt-auto pt-8 border-t border-slate-800/50">
          <div className="flex items-center gap-2 mb-4">
             <ShieldCheck size={12} className="text-slate-500" />
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Evidence Weighting</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {perspective.keyMetrics?.map((metric, idx) => (
              <div key={idx} className="bg-slate-950/40 px-4 py-3 rounded-xl border border-slate-800 flex items-center gap-3 group/item hover:border-current/30 transition-all duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover/item:bg-current transition-colors"></div>
                <span className="text-[11px] font-bold text-slate-400 group-hover/item:text-slate-200 transition-colors leading-tight">{metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
