import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Sparkles, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user, role } = useAuth();

  const getDashboardRoute = () => {
    if (!role) return '/login';
    switch (role) {
      case 'hospital_admin': return '/hospital/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'platform_admin': return '/admin/dashboard';
      default: return '/patient/dashboard';
    }
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Ask AI', path: '/ai-assistant', icon: Sparkles, highlight: true },
    { label: 'Bookings', path: user ? '/patient/dashboard' : '/login', icon: Calendar },
    { label: user ? 'Profile' : 'Log In', path: getDashboardRoute(), icon: User },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))] px-1"
    >
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 text-[10px] font-semibold transition text-center ${
                item.highlight
                  ? 'text-teal-600 font-bold scale-105'
                  : isActive
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`p-1.5 rounded-full flex items-center justify-center ${item.highlight ? 'bg-teal-100 text-teal-700 shadow-xs' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-0.5 truncate w-full text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
