import React, { useState } from 'react';
import { GlassCard } from '../GlassCard';
import { solveMathProblem } from '../../services/geminiService';
import { Calculator, FunctionSquare, Binary, Sigma } from 'lucide-react';

export const MathCore: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!problem) return;
    setLoading(true);
    const result = await solveMathProblem(problem);
    setSolution(result);
    setLoading(false);
  };

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard title="Analytical Engine" className="flex flex-col">
        <div className="mb-6 flex-1">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="h-full w-full resize-none rounded-xl border border-white/10 bg-black/50 p-6 font-mono text-lg text-emerald-300 placeholder-emerald-900/50 focus:border-emerald-500 focus:outline-none"
            placeholder="INPUT COMPLEX MATHEMATICAL QUERY, ALGORITHM, OR STATISTICAL MODEL..."
          />
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSolve}
            disabled={loading}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 font-tech text-lg font-bold tracking-widest text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'COMPUTING...' : 'EXECUTE SOLUTION'}
          </button>
        </div>
      </GlassCard>

      <GlassCard title="Computation Log" className="overflow-hidden">
        <div className="h-full overflow-y-auto rounded-xl border border-white/10 bg-black/80 p-6 font-mono text-sm shadow-inner">
           {loading && (
             <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
                <Binary className="h-12 w-12 animate-bounce text-emerald-500" />
                <span className="animate-pulse text-emerald-500">PROCESSING LOGIC GATES...</span>
             </div>
           )}
           {!loading && !solution && (
             <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
               <FunctionSquare className="h-16 w-16 opacity-20" />
               <p>READY FOR INPUT</p>
             </div>
           )}
           {!loading && solution && (
             <div className="whitespace-pre-wrap text-emerald-100/90 leading-7">
               {solution}
             </div>
           )}
        </div>
      </GlassCard>
    </div>
  );
};