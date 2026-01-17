
import React from 'react';
import { 
  ComposedChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Bar,
  ReferenceLine,
  Line
} from 'recharts';
import { ChartDataPoint } from '../types';

interface StockChartProps {
  data: ChartDataPoint[];
  symbol: string;
  mode?: 'tactical' | 'strategic';
}

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 1
});

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length > 0) {
    // Find price payload specifically to ignore volume in text if needed
    const pricePayload = payload.find((p: any) => p.dataKey === 'price');
    const price = pricePayload?.value;
    
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl text-sm backdrop-blur-xl border-l-4 border-l-blue-500">
        <p className="text-slate-500 font-black mb-1 uppercase text-[9px] tracking-[0.2em]">{label}</p>
        {price !== undefined && (
          <p className="text-white font-black text-xl tracking-tighter">${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
           <p className="text-slate-400 text-[10px] font-bold italic uppercase tracking-wider">AI Projection Model</p>
        </div>
      </div>
    );
  }
  return null;
};

export const StockChart: React.FC<StockChartProps> = ({ data, symbol, mode = 'strategic' }) => {
  const currentPrice = data[0]?.price || 0;
  const isTactical = mode === 'tactical';

  return (
    <div className={`w-full ${isTactical ? 'h-[320px]' : 'h-[400px]'} bg-slate-900/40 rounded-[2rem] p-8 border ${isTactical ? 'border-blue-500/10 shadow-[0_0_50px_rgba(59,130,246,0.05)]' : 'border-slate-800/50'} relative overflow-hidden transition-all duration-700 group`}>
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
        <span className="text-9xl font-black italic tracking-tighter uppercase leading-none">{mode}</span>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3">
             <h3 className="text-2xl font-black text-slate-100 tracking-tight italic uppercase">
              {isTactical ? '7-Day High-Precision Scour' : '30-Day Strategic Forecast'}
            </h3>
            <span className={`text-[8px] px-2.5 py-1 rounded-full font-black tracking-[0.2em] uppercase border ${
              isTactical ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}>
              {mode}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase mt-2 opacity-80">
            {isTactical ? 'Immediate Catalyst Modeling' : 'Structural Trend Analysis'}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isTactical ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-blue-600'}`}></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Path</span>
          </div>
        </div>
      </div>

      <div className="h-[75%] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorPred-${mode}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isTactical ? "#60a5fa" : "#2563eb"} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={isTactical ? "#60a5fa" : "#2563eb"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#1e293b" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              stroke="#475569" 
              fontSize={9} 
              tickLine={false}
              axisLine={false}
              tick={{ fontWeight: '800', fill: '#64748b' }}
              dy={15}
            />
            {/* Primary Y-Axis for Price */}
            <YAxis 
              yAxisId="price"
              stroke="#475569" 
              fontSize={9} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => compactFormatter.format(val)}
              domain={['auto', 'auto']}
              tick={{ fontWeight: '800', fill: '#64748b' }}
              dx={-5}
            />
            {/* Secondary Hidden Y-Axis for Volume so it doesn't break price scale */}
            <YAxis 
              yAxisId="volume"
              hide={true}
              domain={[0, 'auto']}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            <ReferenceLine yAxisId="price" y={currentPrice} stroke="#334155" strokeDasharray="4 4" opacity={0.5} />
            
            <Area 
              yAxisId="price"
              type="monotone" 
              dataKey="price" 
              stroke={isTactical ? "#60a5fa" : "#2563eb"} 
              fillOpacity={1} 
              fill={`url(#colorPred-${mode})`} 
              strokeWidth={0}
              animationDuration={1500}
            />
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="price" 
              stroke={isTactical ? "#60a5fa" : "#2563eb"} 
              strokeWidth={isTactical ? 3 : 2} 
              dot={isTactical ? { r: 3, fill: '#60a5fa', strokeWidth: 2, stroke: '#0f172a' } : false} 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Bar 
              yAxisId="volume"
              dataKey="volume" 
              barSize={isTactical ? 30 : 12} 
              fill="#1e293b" 
              opacity={0.1}
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
