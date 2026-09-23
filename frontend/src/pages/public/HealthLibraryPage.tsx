import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, Clock, Shield } from 'lucide-react';
import { api } from '../../services/api';
import { HealthArticle } from '../../types';

export const HealthLibraryPage: React.FC = () => {
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Seasonal infections', 'Heart health', 'Diabetes', 'Bone & Joint Health'];

  useEffect(() => {
    setLoading(true);
    const catParam = selectedCategory === 'All' ? undefined : selectedCategory;
    api.getHealthArticles(catParam)
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>Clinical Health Library</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Evidence-Based Health Guides & Disease Awareness
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Educational medical guides compiled from verified public health authorities (MoHFW India, WHO, ICMR). Learn symptoms, prevention, and exactly when to consult a specialist.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c === 'All' ? '' : c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              (selectedCategory === c || (c === 'All' && !selectedCategory))
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading verified health articles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Link
              key={art.id}
              to={`/health/${art.slug}`}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:border-teal-400 transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full uppercase">
                    {art.category}
                  </span>
                  <span className="text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {art.read_time}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-700 transition leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">When to Seek Care:</span>
                  <p className="text-slate-700 line-clamp-2">{art.when_to_see_doctor}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600 group-hover:text-teal-800 mt-4">
                <span>Read Full Medical Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Clinical Disclaimer */}
      <div className="p-4 bg-slate-100 rounded-2xl text-[11px] text-slate-500 leading-relaxed border border-slate-200">
        <strong className="text-slate-700">Educational Disclaimer:</strong> All articles are for patient education and health literacy purposes only. They do not constitute clinical diagnoses or formal prescriptions. For medical treatment, always book a consultation with a registered healthcare professional.
      </div>

    </div>
  );
};
