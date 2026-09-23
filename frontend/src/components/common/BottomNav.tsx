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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg py-2 px-3">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center text-[10px] font-semibold transition ${
                item.highlight
                  ? 'text-teal-600 font-bold scale-105'
                  : isActive
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`p-1 rounded-full ${item.highlight ? 'bg-teal-100 text-teal-700' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
