import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, AlertCircle, Stethoscope, BookOpen } from 'lucide-react';
import { api } from '../../services/api';
import { HealthArticle } from '../../types';

export const HealthArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<HealthArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      api.getHealthArticleBySlug(slug)
        .then(setArticle)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading medical guide...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Article Not Found</h2>
        <Link to="/health" className="text-xs text-teal-600 font-bold mt-2 inline-block">
          ← Return to Health Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-8 pb-16">
      
      <Link to="/health" className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        <span>Back to Health Library</span>
      </Link>

      <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        
        {/* Meta & Title */}
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-0.5 rounded-full uppercase">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {article.read_time}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
            Sources: {article.sources}
          </p>
        </div>

        {/* Summary Box */}
        <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs text-teal-950 font-medium leading-relaxed">
          {article.summary}
        </div>

        {/* Symptoms & Causes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          {article.symptoms && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                Identifiable Symptoms
              </h3>
              <p className="text-slate-700">{article.symptoms}</p>
            </div>
          )}

          {article.causes && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                Underlying Causes & Transmission
              </h3>
              <p className="text-slate-700">{article.causes}</p>
            </div>
          )}
        </div>

        {/* Prevention */}
        {article.prevention && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs leading-relaxed">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
              Preventative Measures & Lifestyle Recommendations
            </h3>
            <p className="text-slate-700">{article.prevention}</p>
          </div>
        )}

        {/* When to Seek Care Alert */}
        <div className="p-5 bg-rose-50 border-2 border-rose-400 rounded-2xl text-xs space-y-2">
          <h3 className="font-black text-rose-800 uppercase tracking-wider text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-1.5 text-rose-600" />
            <span>When to Consult a Physician</span>
          </h3>
          <p className="text-rose-900 leading-relaxed font-semibold">
            {article.when_to_see_doctor}
          </p>
          <div className="pt-2">
            <Link
              to={`/doctors?specialty=${encodeURIComponent(article.relevant_specialty)}`}
              className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Consult an Indore {article.relevant_specialty} Doctor</span>
            </Link>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="p-4 bg-slate-100 rounded-2xl text-[10px] text-slate-500 leading-relaxed border border-slate-200">
          <strong className="text-slate-700">Medical Disclaimer:</strong> {article.disclaimer}
        </div>

      </article>

    </div>
  );
};
