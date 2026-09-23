import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Mic, 
  MicOff, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Heart, 
  Building2, 
  Stethoscope, 
  FileText, 
  Clock, 
  Bed, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../../services/api';
import { HospitalListItem, Doctor, HealthArticle } from '../../types';
import { HospitalCard } from '../../components/common/HospitalCard';
import { DoctorCard } from '../../components/common/DoctorCard';
import { EmergencyBanner } from '../../components/common/EmergencyBanner';
import { AppointmentModal } from '../../components/common/AppointmentModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [hospitals, setHospitals] = useState<HospitalListItem[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  
  // AI Interactive State on Homepage
  const [aiInput, setAiInput] = useState('');
  const [aiListening, setAiListening] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  // Booking modal state
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    // Load initial showcase data
    api.getHospitals({ city: 'Indore' }).then(setHospitals).catch(console.error);
    api.getDoctors().then(setDoctors).catch(console.error);
    api.getHealthArticles(undefined, true).then(setArticles).catch(console.error);
    api.getSpecialties().then(setSpecialties).catch(console.error);
  }, []);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.chatHealthAi(aiInput.trim(), 'Indore');
      setAiResult(res);
    } catch (err) {
      console.error('AI chat failed', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Voice Search via Web Speech API
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (aiListening) {
      setAiListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Hindi / English recognition
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setAiListening(true);
      recognition.onend = () => setAiListening(false);
      recognition.onerror = () => setAiListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAiInput(transcript);
        setAiListening(false);
      };

      recognition.start();
    } catch (e) {
      setAiListening(false);
    }
  };

  const openDoctorBooking = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setSelectedHospital(null);
    setIsBookingOpen(true);
  };

  const openHospitalBooking = (hosp: HospitalListItem) => {
    setSelectedHospital(hosp);
    setSelectedDoctor(null);
    setIsBookingOpen(true);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO SECTION - Flipkart/Zomato Style */}
      <section className="relative bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-teal-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>Launch City: Indore, Madhya Pradesh • Expanding Across India</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Find the Right Doctor. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-200">
              Find the Right Hospital.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover verified hospitals, real-time ICU beds, transparent treatment costs, and expert specialists tailored to your medical condition and budget.
          </p>

          {/* Large Marketplace Search Bar */}
          <div className="max-w-3xl mx-auto pt-4">
            <form onSubmit={handleHeroSubmit} className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-2 border-2 border-teal-400/30 focus-within:border-teal-400 transition">
              
              <div className="flex items-center w-full px-4 text-slate-800">
                <Search className="w-5 h-5 text-teal-600 mr-3 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="What healthcare service are you looking for? (e.g. Cardiologist near Vijay Nagar, ICU beds, Ayushman)"
                  className="w-full text-sm font-medium focus:outline-hidden text-slate-900 placeholder-slate-400 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl sm:rounded-full transition shadow-lg shrink-0 flex items-center justify-center space-x-2"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular Search Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs">
              <span className="text-slate-400 font-medium">Popular:</span>
              {[
                { label: 'Cardiology', query: 'Cardiology' },
                { label: 'Orthopedics', query: 'Orthopedics' },
                { label: 'Vijay Nagar Hospitals', query: 'Vijay Nagar' },
                { label: 'Ayushman PM-JAY', query: 'Ayushman' },
                { label: 'ICU Beds', query: 'ICU' },
                { label: 'Dermatology', query: 'Dermatology' }
              ].map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(pill.query)}`)}
                  className="bg-slate-800/80 hover:bg-teal-900/60 border border-slate-700 hover:border-teal-500 text-slate-300 hover:text-white px-3 py-1 rounded-full text-xs font-semibold transition"
                >
                  {pill.label}
                </button>
              ))}
            </div>

          </div>

        </div>

      </section>

      {/* 2. EMERGENCY QUICK CTA BANNER */}
      <div className="-mt-12 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmergencyBanner />
      </div>

      {/* 3. ASK CARECONNECT AI WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-800/50">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask CareConnect AI Health Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Describe what you’re experiencing in your own words.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Speaks English, Hindi, and Hinglish. Detects emergency red-flags, identifies matching medical specialties, and connects you with Indore doctors.
            </p>
          </div>

          {/* AI Input Form with Voice Button */}
          <form onSubmit={handleAiSubmit} className="mt-6 max-w-3xl">
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 focus-within:border-teal-400 transition">
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g. 'Mujhe 2 din se chest pain aur ghabrahat ho rahi hai' OR 'Need an orthopedic specialist for knee pain under ₹1000 in Indore'..."
                rows={3}
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-hidden p-2 resize-none"
              />

              <div className="flex items-center justify-between pt-2 border-t border-white/10 px-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      aiListening 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {aiListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{aiListening ? 'Listening...' : 'Voice Search (Hindi / Eng)'}</span>
                  </button>

                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Safe & Private • Clinical Guardrails Active
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={aiLoading || !aiInput.trim()}
                  className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl transition shadow-md flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiLoading ? 'Analyzing...' : 'Ask CareConnect AI'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <span className="text-slate-400">Try asking:</span>
              {[
                "Mujhe chest pain ho raha hai",
                "Meri mummy ke knee mein bahut pain hai",
                "Indore mein child specialist chahiye",
                "Ayushman Bharat empanelled hospital near me"
              ].map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAiInput(prompt)}
                  className="bg-white/5 hover:bg-white/15 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg border border-white/10 transition"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </form>

          {/* AI Result Card if generated on homepage */}
          {aiResult && (
            <div className="mt-6 p-5 rounded-2xl bg-white text-slate-900 shadow-2xl animate-in fade-in duration-300 border border-teal-200">
              
              {/* Emergency Banner */}
              {aiResult.is_emergency && (
                <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-xl mb-4 text-rose-900 flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-extrabold text-rose-800">EMERGENCY CLINICAL WARNING</h4>
                    <p className="text-xs font-semibold mt-0.5">{aiResult.emergency_alert}</p>
                    <div className="mt-2 flex space-x-3">
                      <a href="tel:108" className="inline-flex items-center bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                        🚨 Call 108 Ambulance
                      </a>
                      <Link to="/emergency" className="inline-flex items-center bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                        View Trauma Centers
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Relevant Specialty:</span>
                  <span className="bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-xs font-extrabold">
                    {aiResult.recommended_specialty}
                  </span>
                </div>
                <Link to="/ai-assistant" className="text-xs font-bold text-teal-700 hover:text-teal-900">
                  Open Full AI Chat →
                </Link>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {aiResult.educational_summary}
              </p>

              {/* Recommended Doctors from AI */}
              {aiResult.recommended_doctors && aiResult.recommended_doctors.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Recommended Doctors in Indore:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aiResult.recommended_doctors.map((doc: any) => (
                      <div key={doc.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{doc.name}</p>
                          <p className="text-[11px] text-slate-500">{doc.hospital_name} • ₹{doc.consultation_fee}</p>
                          <p className="text-[10px] text-teal-700 font-medium mt-1">✓ {doc.match_reason}</p>
                        </div>
                        <Link
                          to={`/doctors/${doc.id}`}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0"
                        >
                          Book Slot
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                {aiResult.disclaimer}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 4. POPULAR SPECIALTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Popular Medical Specialties</h2>
            <p className="text-xs text-slate-500">Consult with top-rated medical practitioners in Indore</p>
          </div>
          <Link to="/doctors" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center">
            <span>View All Specialties</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {specialties.map((spec) => (
            <Link
              key={spec.name}
              to={`/doctors?specialty=${encodeURIComponent(spec.name)}`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition text-center group flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition leading-tight">
                  {spec.name}
                </p>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                  {spec.count} Doctors
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. TOP VERIFIED HOSPITALS IN INDORE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Top Verified Hospitals in Indore</h2>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Live Beds
              </span>
            </div>
            <p className="text-xs text-slate-500">Super-speciality centers with verified ICU status & Ayushman Bharat coverage</p>
          </div>
          <Link to="/hospitals" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center">
            <span>Explore All Hospitals</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.slice(0, 6).map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onBookClick={openHospitalBooking}
            />
          ))}
        </div>
      </section>

      {/* 6. DOCTORS AVAILABLE TODAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Doctors Available Today in Indore</h2>
            <p className="text-xs text-slate-500">Book confirmed OPD slots across leading hospital networks</p>
          </div>
          <Link to="/doctors" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center">
            <span>Browse All Doctors</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 6).map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookClick={openDoctorBooking}
            />
          ))}
        </div>
      </section>

      {/* 7. SCHEMES & INSURANCE PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Financial Healthcare Protection
            </span>
            <h3 className="text-2xl font-black">
              Ayushman Bharat PM-JAY & Cashless Insurance Desks
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Find participating hospitals in Indore offering cashless treatment up to ₹5 Lakh under Ayushman Bharat, plus dedicated TPA desks for Star Health, HDFC ERGO, Care Health, and ICICI Lombard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/government-schemes"
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs px-5 py-3 rounded-xl transition shadow-md"
            >
              Ayushman PM-JAY Guide
            </Link>
            <Link
              to="/insurance"
              className="bg-blue-800/80 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition border border-blue-500/40"
            >
              Cashless Insurers
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TRENDING HEALTH TOPICS IN INDORE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Trending Health Guides in Indore</h2>
            <p className="text-xs text-slate-500">Verified medical education and disease awareness from certified sources</p>
          </div>
          <Link to="/health" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center">
            <span>Read Health Library</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map((art) => (
            <Link
              key={art.id}
              to={`/health/${art.slug}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-500 hover:shadow-lg transition flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md uppercase">
                  {art.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition line-clamp-2">
                  {art.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 mt-4">
                <span>{art.read_time}</span>
                <span className="font-bold text-teal-600 group-hover:translate-x-1 transition">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. HOSPITAL PARTNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white mx-auto flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Are You a Hospital in Central India?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Bring your bed inventory, OPD doctor schedules, and emergency response capabilities online with CareConnect AI’s integrated Hospital ERP dashboard.
          </p>
          <div className="pt-2">
            <Link
              to="/register?role=hospital_admin"
              className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-full transition shadow-xl"
            >
              <span>Register Your Hospital</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctor={selectedDoctor}
        hospital={selectedHospital}
      />

    </div>
  );
};
