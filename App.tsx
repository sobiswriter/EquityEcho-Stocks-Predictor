
import React, { useState, useEffect } from 'react';
import { analyzeStock, processPredictiveData } from './services/geminiService';
import { AnalysisResult, ChartDataPoint } from './types';
import { StockChart } from './components/StockChart';
import { AnalystCard } from './components/AnalystCard';
import { 
  Search, Upload, Activity, AlertCircle, Loader2, ExternalLink, Globe, Cpu, Clock, ShieldAlert,
  BarChart3, Info, FileText
} from 'lucide-react';

const App: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [monthlyChart, setMonthlyChart] = useState<ChartDataPoint[]>([]);
  const [weeklyChart, setWeeklyChart] = useState<ChartDataPoint[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const performAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      let documentBase64 = undefined;
      let mimeType = undefined;
      if (file) {
        documentBase64 = await fileToBase64(file);
        mimeType = file.type;
      }
      const result = await analyzeStock(symbol, documentBase64, mimeType);
      
      setWeeklyChart(processPredictiveData(result.weeklyPredictedPriceData || [], 0.02, true));
      setMonthlyChart(processPredictiveData(result.predictedPriceData || [], 0.01, false));
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError("Synthesis failed. Check ticker symbol or network connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const formatPercent = (val: number | undefined) => {
    if (val === undefined) return 0;
    if (val > 0 && val <= 1) return Math.round(val * 100);
    return Math.round(val);
  };

  return (
    <div className="min-h-screen pb-12 px-4 md:px-8 max-w-7xl mx-auto font-sans flex flex-col selection:bg-blue-500/30">
      <header className="py-8 flex flex-col lg:flex-row justify-between items-center border-b border-slate-800/50 mb-12 gap-8">
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] group-hover:rotate-12 transition-transform duration-500">
            <Cpu className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic uppercase text-slate-100 flex items-center gap-3">
              EquityEcho <span className="text-[9px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full not-italic tracking-widest align-middle font-black">PROPHET v3.8</span>
            </h1>
            <div className="flex items-center gap-2 mt-1 opacity-70">
              <Clock size={12} className="text-blue-500" />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                {currentTime.toLocaleTimeString()} • SESSION_ACTIVE
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={performAnalysis} className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-stretch">
          <div className="relative group flex-1 md:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" placeholder="TICKER (e.g. AAPL)" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="bg-slate-900/60 border border-slate-800 text-slate-100 pl-12 pr-6 py-4 rounded-2xl w-full md:w-80 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 font-black tracking-widest outline-none transition-all placeholder:text-slate-700 placeholder:font-bold"
            />
          </div>
          <label className="flex items-center gap-3 px-6 py-4 bg-slate-900/60 border border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-800/80 transition-all text-slate-400 border-dashed hover:border-slate-600 group">
            <Upload size={18} className="group-hover:text-blue-400 transition-colors" />
            <span className="text-xs font-black uppercase tracking-widest truncate max-w-[150px]">{file ? file.name : "Inject Doc"}</span>
            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.png,.jpg,.jpeg" />
          </label>
          <button type="submit" disabled={loading || !symbol} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] italic transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-95">
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Synthesize"}
          </button>
        </form>
      </header>

      <main className="flex-1">
        {!analysis && !loading && (
          <div className="flex flex-col items-center justify-center py-40 text-center opacity-40">
            <Activity size={64} className="text-slate-700 mb-6" />
            <h2 className="text-xl font-black text-slate-500 uppercase tracking-[0.4em]">Awaiting Input Sequence</h2>
            <p className="text-xs text-slate-600 mt-2 font-bold max-w-sm mx-auto">Enter a ticker symbol to initialize the EquityEcho intelligence protocol.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="relative mb-8">
               <Activity className="text-blue-500 animate-pulse" size={64} />
               <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse rounded-full"></div>
            </div>
            <h2 className="text-2xl font-black text-slate-200 uppercase tracking-[0.4em] italic">Decoding Signal...</h2>
            <p className="text-[10px] text-slate-500 mt-4 font-black uppercase tracking-widest animate-bounce">Scouring Global Markets • Consulting Tribunal</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-[2rem] text-rose-400 mb-12 flex items-center gap-6 animate-in slide-in-from-top-4">
            <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center shrink-0">
               <AlertCircle size={24} />
            </div>
            <div>
               <p className="font-black uppercase tracking-widest text-sm">Protocol Failure</p>
               <p className="text-xs opacity-70 mt-1 font-bold">{error}</p>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-1000">
            {/* Verdict Header */}
            <div className="bg-slate-900/20 p-10 rounded-[2.5rem] border border-slate-800/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative group shadow-2xl">
              <div className="absolute top-0 left-10 w-20 h-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
              <div>
                <h2 className="text-5xl font-black text-slate-100 tracking-tighter italic uppercase">{analysis.companyName}</h2>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-3xl font-black text-blue-400 tracking-tighter">${analysis.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <div className="h-4 w-[1px] bg-slate-800"></div>
                  <span className="text-slate-500 font-black text-xs tracking-[0.3em] uppercase">{analysis.symbol} • LIVE_MARKET</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 self-end lg:self-center">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] italic opacity-60">Presiding Decree</span>
                <div className={`px-12 py-6 rounded-3xl text-4xl font-black italic tracking-tighter shadow-2xl border-4 transition-transform hover:scale-105 duration-500 ${
                  analysis.judgeAnalyst?.recommendation?.includes('BUY') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10' : 
                  analysis.judgeAnalyst?.recommendation?.includes('SELL') ? 'bg-rose-500/10 text-rose-400 border-rose-400/40 shadow-rose-500/10' : 'bg-amber-500/10 text-amber-400 border-amber-300/40 shadow-amber-500/10'
                }`}>
                  {analysis.judgeAnalyst?.recommendation || 'HOLD'}
                </div>
              </div>
            </div>

            {/* Charts & Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              <div className="xl:col-span-8 space-y-10">
                <StockChart data={weeklyChart} symbol={analysis.symbol} mode="tactical" />
                <StockChart data={monthlyChart} symbol={analysis.symbol} mode="strategic" />
                
                {/* Grounding Points */}
                <div className="bg-slate-900/30 rounded-[2rem] p-10 border border-slate-800/50">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-200 flex items-center gap-3">
                      <Globe size={18} className="text-blue-500" /> Evidence Scour Results
                    </h3>
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{analysis.sources?.length || 0} SOURCES_RESOLVED</span>
                  </div>
                  
                  {analysis.sources && analysis.sources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.sources.map((source, idx) => (
                        <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 bg-slate-800/20 hover:bg-slate-800/60 px-6 py-5 rounded-2xl border border-slate-700/30 text-xs text-slate-300 transition-all hover:-translate-y-1 group">
                          <div className="flex flex-col gap-1 min-w-0">
                             <span className="truncate font-black uppercase tracking-tight text-slate-100">{source.title}</span>
                             <span className="truncate opacity-40 text-[9px] font-bold">{source.uri}</span>
                          </div>
                          <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center text-center opacity-30 grayscale">
                      <FileText size={40} className="mb-4 text-slate-500" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">No Web Evidence Found</p>
                      <p className="text-[10px] font-bold mt-2">Tribunal using primary model knowledge base</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Synthesis */}
              <div className="xl:col-span-4 bg-slate-900/40 rounded-[2.5rem] p-10 border border-slate-800/50 h-fit sticky top-8 shadow-2xl">
                 <div className="flex items-center gap-4 mb-10">
                   <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                      <BarChart3 className="text-blue-400" size={20} />
                   </div>
                   <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-100">Synthesis Engine</h3>
                 </div>

                 <div className="space-y-12">
                   <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-800/80 text-slate-300 text-sm font-bold leading-relaxed relative shadow-inner">
                      <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg">Decision Rationale</div>
                      <p className="italic">"{analysis.summaryVerdict}"</p>
                   </div>
                   
                   <div className="space-y-8">
                     <div className="flex items-center gap-3 mb-2">
                        <Info size={16} className="text-blue-500/50" />
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Tribunal Indices</h4>
                     </div>
                     
                     <div className="space-y-6">
                       {[
                         { label: 'Data Robustness', val: formatPercent(analysis.confidenceMetrics?.dataRobustness), color: 'bg-slate-700' },
                         { label: 'Sentiment Signal', val: formatPercent(analysis.confidenceMetrics?.sentimentSignal), color: 'bg-slate-700' },
                         { label: 'Forecast Reliability', val: formatPercent(analysis.confidenceMetrics?.forecastReliability), color: 'bg-slate-700' }
                       ].map(item => (
                         <div key={item.label} className="flex flex-col gap-2">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                             <span className="text-slate-500">{item.label}</span>
                             <span className="text-slate-400">{item.val}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full ${item.color} transition-all duration-1000 ease-out`} style={{ width: `${item.val}%` }}></div>
                           </div>
                         </div>
                       ))}

                       <div className="pt-10 border-t border-slate-800/50 space-y-6">
                         {[
                           { label: 'Buy Confidence', val: formatPercent(analysis.confidenceMetrics?.buyConfidence), color: 'bg-emerald-500 shadow-emerald-500/20' },
                           { label: 'Hold Confidence', val: formatPercent(analysis.confidenceMetrics?.holdConfidence), color: 'bg-amber-500 shadow-amber-500/20' },
                           { label: 'Sell Confidence', val: formatPercent(analysis.confidenceMetrics?.sellConfidence), color: 'bg-rose-500 shadow-rose-500/20' }
                         ].map(item => (
                           <div key={item.label} className="flex flex-col gap-2">
                             <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                               <span className="text-slate-300">{item.label}</span>
                               <span className={`${item.color.replace('bg-', 'text-')}`}>{item.val}%</span>
                             </div>
                             <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                               <div className={`h-full ${item.color} transition-all duration-1000 ease-out shadow-lg`} style={{ width: `${item.val}%` }}></div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>

                   <div className="pt-8 mt-4 border-t border-slate-800/50">
                      <div className={`p-8 rounded-3xl border flex flex-col items-center gap-3 shadow-2xl transition-all hover:scale-105 duration-500 ${
                        analysis.riskFactor === 'LOW' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                        analysis.riskFactor === 'MEDIUM' ? 'bg-amber-500/5 border-amber-500/20' : 
                        'bg-rose-500/5 border-rose-500/20'
                      }`}>
                        <div className="flex items-center gap-3">
                          <ShieldAlert size={16} className={analysis.riskFactor === 'LOW' ? 'text-emerald-500' : analysis.riskFactor === 'MEDIUM' ? 'text-amber-500' : 'text-rose-500'} />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">Risk Profile</span>
                        </div>
                        <span className={`text-5xl font-black italic tracking-tighter uppercase ${
                          analysis.riskFactor === 'LOW' ? 'text-emerald-500' : 
                          analysis.riskFactor === 'MEDIUM' ? 'text-amber-500' : 
                          'text-rose-500'
                        }`}>{analysis.riskFactor}</span>
                      </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Deliberations */}
            <section className="space-y-12 pt-16 border-t border-slate-800/50">
              <div className="flex flex-col items-center text-center">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.6em] mb-4">Tribunal Members</h3>
                 <div className="w-20 h-1 bg-blue-600/30 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <AnalystCard perspective={analysis.quantAnalyst} type="quant" />
                <AnalystCard perspective={analysis.newsAnalyst} type="news" />
                <AnalystCard perspective={analysis.judgeAnalyst} type="judge" />
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="mt-24 pt-16 border-t border-slate-800/30 pb-12 text-center opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex justify-center gap-6 mb-8 text-slate-500">
           <Cpu size={20} /> <BarChart3 size={20} /> <Globe size={20} />
        </div>
        <p className="text-[10px] text-slate-500 max-w-3xl mx-auto leading-loose font-black uppercase tracking-[0.2em]">
          Regulatory Warning: EquityEcho v3.8 is an experimental AI synthesis platform. Financial projections are algorithmic simulations. Market volatility is unpredictable. Consult a licensed advisor before executing trades.
        </p>
      </footer>
    </div>
  );
};

export default App;
