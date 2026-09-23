import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Layers } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

export const CompareDrawer: React.FC = () => {
  const { selectedHospitals, removeFromCompare, clearCompare } = useCompare();

  if (selectedHospitals.length === 0) return null;

  return (
    <div className="fixed bottom-14 md:bottom-6 left-4 right-4 md:left-auto md:right-8 z-40 max-w-xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Hospital Comparison</span>
          <span className="text-xs bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full">
            {selectedHospitals.length}/4 Selected
          </span>
        </div>
        <button
          onClick={clearCompare}
          className="text-[11px] text-slate-400 hover:text-white font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
        {selectedHospitals.map((h) => (
          <div key={h.id} className="relative bg-slate-800 p-2 rounded-xl border border-slate-700/80 flex items-center space-x-2">
            <img
              src={h.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=100&q=80'}
              alt={h.name}
              className="w-8 h-8 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-200 truncate">{h.name}</p>
              <p className="text-[10px] text-slate-400">₹{h.starting_fee}</p>
            </div>
            <button
              onClick={() => removeFromCompare(h.id)}
              className="text-slate-400 hover:text-rose-400 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Side-by-side ICU beds, consultation fees, and PM-JAY support
        </span>
        <Link
          to={`/compare?ids=${selectedHospitals.map(h => h.id).join(',')}`}
          className="ml-auto flex items-center space-x-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-md"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
