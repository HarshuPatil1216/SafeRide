import React, { useState } from 'react';
import { Server, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { CUSTOM_API_URL_KEY, getBaseApiUrl } from '../../api/axios';
import { Modal } from './Modal';

interface ServerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({ isOpen, onClose }) => {
  const [apiUrl, setApiUrl] = useState(getBaseApiUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    const trimmed = apiUrl.trim();
    if (trimmed) {
      localStorage.setItem(CUSTOM_API_URL_KEY, trimmed);
    } else {
      localStorage.removeItem(CUSTOM_API_URL_KEY);
    }
    window.location.reload();
  };

  const handleReset = () => {
    localStorage.removeItem(CUSTOM_API_URL_KEY);
    setApiUrl(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api');
    setTestResult(null);
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const trimmed = apiUrl.trim();
      const res = await fetch(`${trimmed}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ping@test.com', password: 'ping' }),
      });

      // If backend responded with 401, 400, or 200, the server is alive!
      if (res.status === 401 || res.status === 400 || res.status === 200 || res.status === 403) {
        setTestResult({
          success: true,
          message: `Connected successfully! Spring Boot backend responded with HTTP ${res.status}.`,
        });
      } else {
        setTestResult({
          success: true,
          message: `Server reachable (HTTP ${res.status}).`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection failed: ${err.message}. Verify that Spring Boot is running and @CrossOrigin(origins = "*") is configured.`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Backend Server Configuration"
      subtitle="Connect SafeRide Frontend to your Java Spring Boot REST API"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            API Base URL
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Server className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8081/api"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#050505] border border-[#1e293b] rounded-lg text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-[#38bdf8] focus:outline-none font-mono"
              />
            </div>
            <button
              type="button"
              onClick={testConnection}
              disabled={testing}
              className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#38bdf8]" /> : null}
              <span>Test Ping</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Default: <code className="text-[#38bdf8] font-mono bg-sky-950/40 px-1 py-0.5 rounded border border-sky-900/50">http://localhost:8081/api</code> (or 8080)
          </p>
        </div>

        {testResult && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{testResult.success ? 'Success' : 'Connection Warning'}</p>
              <p className="mt-0.5 leading-relaxed">{testResult.message}</p>
            </div>
          </div>
        )}

        <div className="bg-[#050505] rounded-xl p-3.5 border border-[#1e293b] text-xs text-slate-400 space-y-1.5">
          <p className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Spring Boot Integration Tips:</p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Ensure Spring Security allows preflight <code className="font-mono bg-[#0a0a0a] text-[#38bdf8] px-1 border border-slate-800 rounded">OPTIONS</code> requests.</li>
            <li>In your Controllers, add <code className="font-mono bg-[#0a0a0a] text-[#38bdf8] px-1 border border-slate-800 rounded">@CrossOrigin(origins = "*")</code>.</li>
            <li>JWT token is automatically sent in header: <code className="font-mono bg-[#0a0a0a] text-[#38bdf8] px-1 border border-slate-800 rounded">Authorization: Bearer &lt;token&gt;</code>.</li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-300 underline"
          >
            Reset to Default
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-[#38bdf8] hover:bg-sky-400 rounded-lg shadow-sm"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
