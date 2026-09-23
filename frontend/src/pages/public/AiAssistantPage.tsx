import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  AlertCircle, 
  ShieldCheck, 
  User, 
  Bot, 
  RotateCcw, 
  Calendar, 
  Building2, 
  Star, 
  ArrowRight 
} from 'lucide-react';
import { api } from '../../services/api';
import { AiChatResponse } from '../../types';
import { AppointmentModal } from '../../components/common/AppointmentModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  aiData?: AiChatResponse;
}

export const AiAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! I am CareConnect AI, your healthcare discovery assistant for Indore and Central India. You can describe your symptoms or requirements in English, Hindi, or Hinglish (e.g. "Mujhe chest pain ho raha hai", "Knee specialist near Vijay Nagar"). How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // Booking modal
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatHealthAi(query, 'Indore');
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.educational_summary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aiData: res
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'I apologize, but I encountered an error communicating with the health knowledge service. Please try again or check our hospitals directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (listening) {
      setListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'hi-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setListening(true);
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);

      rec.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setInput(spoken);
        setListening(false);
        handleSend(spoken);
      };

      rec.start();
    } catch {
      setListening(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Chat history cleared. How may I assist you with your health query today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 space-y-4 h-[calc(100vh-140px)] flex flex-col justify-between">
      
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <span>CareConnect AI Health Assistant</span>
              <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                English • Hindi • Hinglish
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">
              Symptom classification, specialty guidance & hospital discovery in Indore
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              m.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-teal-600 text-white'
            }`}>
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 shadow-xs ${
              m.sender === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
            }`}>
              
              <p className="whitespace-pre-line">{m.text}</p>

              {/* Extended AI Analysis Card */}
              {m.aiData && (
                <div className="space-y-4 pt-2 border-t border-slate-100 text-slate-800">
                  
                  {/* Emergency Box */}
                  {m.aiData.is_emergency && (
                    <div className="p-3 bg-rose-50 border-2 border-rose-500 rounded-xl text-rose-900 space-y-2">
                      <div className="flex items-center space-x-2 font-black text-rose-700">
                        <AlertCircle className="w-5 h-5" />
                        <span>EMERGENCY CLINICAL TRIAGE DETECTED</span>
                      </div>
                      <p className="font-semibold text-xs leading-normal">
                        {m.aiData.emergency_alert}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <a href="tel:108" className="bg-rose-600 text-white px-3 py-1.5 rounded-lg font-extrabold text-xs shadow-sm">
                          🚨 Call 108 Ambulance
                        </a>
                        <Link to="/emergency" className="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold text-xs">
                          View Emergency Beds
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Warning Signs list */}
                  {m.aiData.warning_signs && m.aiData.warning_signs.length > 0 && (
                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 space-y-1">
                      <p className="font-bold text-amber-900 text-[11px] uppercase">Warning Signs to Monitor:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                        {m.aiData.warning_signs.map((ws: string, i: number) => (
                          <li key={i}>{ws}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Doctors */}
                  {m.aiData.recommended_doctors && m.aiData.recommended_doctors.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                        Relevant Specialists in Indore:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.aiData.recommended_doctors.map((doc: any) => (
                          <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                            <div>
                              <p className="font-bold text-slate-900">{doc.name}</p>
                              <p className="text-[11px] text-teal-700">{doc.specialization} • {doc.experience_years}y exp</p>
                              <p className="text-[10px] text-slate-500">{doc.hospital_name}</p>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                              <span className="font-bold text-slate-900">₹{doc.consultation_fee}</span>
                              <button
                                onClick={() => {
                                  setSelectedDoctor(doc);
                                  setIsBookingOpen(true);
                                }}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-md"
                              >
                                Book Slot
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Hospitals */}
                  {m.aiData.recommended_hospitals && m.aiData.recommended_hospitals.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                        Equipped Hospitals:
                      </p>
                      <div className="space-y-2">
                        {m.aiData.recommended_hospitals.map((hosp: any) => (
                          <div key={hosp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-900">{hosp.name}</p>
                              <p className="text-[10px] text-slate-500">{hosp.area}, Indore • {hosp.icu_avail} ICU Beds Avail</p>
                              <p className="text-[10px] text-emerald-700 font-semibold">✓ {hosp.match_reason}</p>
                            </div>
                            <Link
                              to={`/hospitals/${hosp.id}`}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] px-3 py-1.5 rounded-lg shrink-0"
                            >
                              Details
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestions pills */}
                  {m.aiData.follow_up_suggestions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.aiData.follow_up_suggestions.map((sug: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[10px] font-semibold px-2.5 py-1 rounded-full transition"
                        >
                          {sug} →
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Disclaimer note */}
                  <p className="text-[9px] text-slate-400 border-t border-slate-100 pt-1">
                    {m.aiData.disclaimer}
                  </p>

                </div>
              )}

              <span className={`block text-[9px] ${m.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs p-3 bg-white rounded-2xl border border-slate-200 w-fit">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <span>CareConnect AI is evaluating symptoms and checking hospital availability...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="bg-white p-2 rounded-2xl border border-slate-200 shadow-md shrink-0 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleVoice}
          className={`p-2.5 rounded-xl transition ${
            listening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title="Voice Search (Hindi / English)"
        >
          {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? "Listening in Hindi/English..." : "Type your symptoms in English, Hindi, or Hinglish (e.g. 'Mujhe chest pain hai')..."}
          className="flex-1 text-xs sm:text-sm bg-transparent focus:outline-hidden text-slate-900 placeholder-slate-400 px-2"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctor={selectedDoctor}
      />

    </div>
  );
};
