import React, { useState, useEffect } from 'react';
import { Server, CheckCircle2, XCircle, RefreshCw, X, Wifi } from 'lucide-react';
import { getApiBase, getCustomApiUrl, setCustomApiUrl } from '../../services/api';

interface ServerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerSettingsModal: React.FC<ServerSettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiUrl, setApiUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const custom = getCustomApiUrl();
      setApiUrl(custom || getApiBase());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const presets = [
    { label: 'Android Emulator', url: 'http://10.0.2.2:8000/api' },
    { label: 'Localhost (PC)', url: 'http://127.0.0.1:8000/api' },
    { label: 'Wi-Fi Network', url: 'http://192.168.233.1:8000/api' },
  ];

  const handleTestConnection = async (targetUrl?: string) => {
    const urlToTest = (targetUrl || apiUrl).trim().replace(/\/$/, '');
    const endpoint = urlToTest.endsWith('/api') ? `${urlToTest}/health-check` : `${urlToTest}/api/health-check`;
    
    setTesting(true);
    setTestResult(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        setTestResult({
          success: true,
          message: `Connected! ${data.city || 'Indore'} gateway is healthy (${data.hospitals_count || 0} hospitals, ${data.doctors_count || 0} doctors).`
        });
      } else {
        setTestResult({
          success: false,
          message: `Server returned HTTP ${res.status}: ${res.statusText}`
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.name === 'AbortError' 
          ? 'Connection timed out (6s). Check if backend is running.' 
          : `Connection failed: ${err.message || 'Network unreachable'}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setCustomApiUrl(apiUrl.trim());
    onClose();
    window.location.reload();
  };

  const handleResetDefault = () => {
    setCustomApiUrl('');
    setApiUrl(getApiBase());
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-teal-300" />
            <h3 className="font-bold text-base">Backend Server Configuration</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-teal-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600">
            For Android devices, configure the server address so the mobile app can communicate with your CareConnect AI backend.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              API Base URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => {
                setApiUrl(e.target.value);
                setTestResult(null);
              }}
              placeholder="http://10.0.2.2:8000/api"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" /> Quick Presets
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setApiUrl(preset.url);
                    handleTestConnection(preset.url);
                  }}
                  className="px-2 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 rounded-lg border border-slate-200 text-center transition truncate"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start space-x-2 border ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Reset Default
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleTestConnection()}
                disabled={testing}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Testing...' : 'Test'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
