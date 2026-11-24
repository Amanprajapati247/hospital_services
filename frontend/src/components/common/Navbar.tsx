import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  User, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Building2, 
  Stethoscope, 
  Menu, 
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, role, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Indore');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cities = ['Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Gwalior', 'Jabalpur', 'Delhi NCR', 'Mumbai'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&city=${encodeURIComponent(selectedCity)}`);
    } else {
      navigate('/search');
    }
  };

  const getDashboardRoute = () => {
    if (!role) return '/patient/dashboard';
    switch (role) {
      case 'hospital_admin': return '/hospital/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'platform_admin': return '/admin/dashboard';
      default: return '/patient/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo - CareConnect */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              CareConnect
            </span>
          </Link>

          {/* Center Search & Location */}
          <div className="hidden lg:flex flex-1 max-w-2xl items-center border border-slate-300 rounded-full shadow-xs hover:border-teal-500 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 transition bg-white overflow-visible relative">
            
            {/* Location Selector */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center space-x-1 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 border-r border-slate-200"
              >
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select City
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-teal-50 flex items-center justify-between ${selectedCity === city ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-slate-700'}`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <span className="text-xs bg-teal-600 text-white rounded-full px-1.5 py-0.2">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Global Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center px-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospitals, doctors, specialties, treatments, ICU beds..."
                className="w-full text-sm py-2 bg-transparent focus:outline-hidden text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full shrink-0 transition shadow-xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Ask AI Button (shown on tablet/desktop, mobile has it in BottomNav) */}
            <Link
              to="/ai-assistant"
              className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 border border-teal-200/80 hover:border-teal-400 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>Ask AI</span>
            </Link>

            {/* 🚨 Emergency CTA */}
            <Link
              to="/emergency"
              className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs shadow-rose-500/20"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline sm:inline">Emergency</span>
              <span className="xs:hidden sm:hidden">108</span>
            </Link>

            {/* Comparison Link */}
            <Link
              to="/compare"
              className="hidden xl:flex items-center space-x-1 text-slate-600 hover:text-teal-700 px-2 py-1.5 text-xs font-semibold"
            >
              <span>Compare</span>
            </Link>

            {/* Join as Hospital Link */}
            <Link
              to="/join-hospital"
              className="hidden xl:flex items-center space-x-1 text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold transition"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Join as Hospital</span>
            </Link>

            {/* Auth / Profile Area */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 hover:bg-slate-200 py-1.5 px-2 sm:px-3 rounded-full text-xs font-semibold text-slate-800 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate hidden md:inline">{user.full_name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>

                    <Link
                      to={getDashboardRoute()}
                      onClick={() => setShowRoleDropdown(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      <User className="w-4 h-4 text-teal-600" />
                      <span>My Dashboard</span>
                    </Link>

                    {role === 'patient' && (
                      <Link
                        to="/patient/dashboard"
                        onClick={() => setShowRoleDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50"
                      >
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span>My Appointments</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setShowRoleDropdown(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1.5">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-teal-700 px-3 py-1.5 rounded-lg transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-100 rounded-full px-3 py-1.5">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals or doctors in Indore..."
              className="w-full text-xs bg-transparent focus:outline-hidden text-slate-800 placeholder-slate-400"
            />
            <button type="submit" className="text-teal-700 text-xs font-bold px-2">Go</button>
          </form>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 mt-3 pt-3 pb-2 space-y-2">
            <div className="flex justify-between items-center px-2 py-1">
              <span className="text-xs text-slate-500 font-semibold">City Location:</span>
              <span className="text-xs font-bold text-teal-700 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" /> {selectedCity}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold px-2">
              <Link to="/hospitals" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-slate-100 text-slate-800">
                🏥 Find Hospitals
              </Link>
              <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-slate-100 text-slate-800">
                👨‍⚕️ Find Doctors
              </Link>
              <Link to="/compare" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-slate-100 text-slate-800">
                ⚖️ Compare Hospitals
              </Link>
              <Link to="/insurance" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-slate-100 text-slate-800">
                🛡️ Cashless Insurance
              </Link>
              <Link to="/government-schemes" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-slate-100 text-slate-800">
                🏛️ Ayushman PM-JAY
              </Link>
              <Link to="/health" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-slate-100 text-slate-800">
                📚 Health Library
              </Link>
              <Link to="/join-hospital" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-amber-50 text-amber-900 font-bold border border-amber-300">
                🏥 Join as Hospital
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
