import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Stethoscope, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'patient';
  const redirect = searchParams.get('redirect');

  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { id: 'patient', label: 'Patient', icon: User, placeholder: 'patient@example.com' },
    { id: 'doctor', label: 'Doctor', icon: Stethoscope, placeholder: 'doctor@careconnect.in' },
    { id: 'hospital_admin', label: 'Hospital Admin', icon: Building2, placeholder: 'hospital@careconnect.in' },
    { id: 'platform_admin', label: 'Admin', icon: ShieldCheck, placeholder: 'admin@careconnect.in' }
  ];

  const currentRoleConfig = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      if (redirect) {
        navigate(redirect);
      } else {
        // Direct to appropriate dashboard based on selected role
        switch (selectedRole) {
          case 'hospital_admin':
            navigate('/hospital/dashboard');
            break;
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'platform_admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/patient/dashboard');
            break;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email address or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to CareConnect AI
          </h1>
          <p className="text-xs text-slate-500">
            Choose your account type and enter your login credentials.
          </p>
        </div>

        {/* Role Selection Tabs matching Register Page */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Account Type:</label>
          <div className="grid grid-cols-4 gap-1.5">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.id);
                    setError('');
                  }}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    isSelected
                      ? 'bg-teal-50 border-teal-600 text-teal-800 font-extrabold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] truncate w-full">{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Contextual Guidance for Hospital ERP */}
          {selectedRole === 'hospital_admin' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between mt-2">
              <span>Managing live hospital beds and clinical tariffs?</span>
              <Link to="/hospital/login" className="font-extrabold text-amber-800 hover:text-amber-900 underline shrink-0 ml-1">
                Hospital ERP Portal →
              </Link>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Clean Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {currentRoleConfig.label} Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentRoleConfig.placeholder}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">Password *</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password recovery: Please contact platform support at support@careconnect.in.'); }} className="text-[11px] text-teal-700 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-medium text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In as {currentRoleConfig.label}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-2 border-t border-slate-100 text-center space-y-2 text-xs">
          <p className="text-slate-600">
            Don't have an account yet?{' '}
            <Link to={`/register?role=${selectedRole}`} className="font-extrabold text-teal-700 hover:text-teal-800 underline">
              Create New Account
            </Link>
          </p>
          <p className="text-slate-500 text-[11px]">
            Healthcare Facility?{' '}
            <Link to="/join-hospital" className="font-bold text-amber-700 hover:underline">
              Empanel Hospital & Publish Services →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
