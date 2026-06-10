import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t, tArray } = useSettings();
  const subsidiaries = tArray('login.subsidiaries');
  const [subsidiary, setSubsidiary] = useState(subsidiaries[0] ?? '');
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-200 via-blue-100 to-indigo-200 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <div className="absolute top-[-10%] left-[-5%] w-[480px] h-[480px] rounded-full bg-blue-400/30 dark:bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-8%] w-[520px] h-[520px] rounded-full bg-indigo-400/25 dark:bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[15%] w-[280px] h-[280px] rounded-full bg-purple-300/20 dark:bg-purple-600/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 w-[420px] p-10 rounded-2xl text-center
        bg-surface-elevated/25 dark:bg-surface-elevated/10 backdrop-blur-2xl
        border border-white/50 dark:border-white/10
        shadow-[0_8px_32px_rgba(31,38,135,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

        <div className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center
          bg-surface-elevated/30 dark:bg-surface-elevated/20 backdrop-blur-md border border-white/60 dark:border-white/15 shadow-sm">
          <span className="text-blue-600 dark:text-blue-400 text-3xl font-black tracking-tight">dash</span>
        </div>

        <div className="mb-6 text-left relative">
          <label className="text-[10px] font-black text-app-muted/80 uppercase tracking-widest block mb-2">
            {t('login.subsidiary')}
          </label>
          <button
            onClick={() => setDropOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3
              bg-surface-elevated/35 dark:bg-surface-elevated/20 backdrop-blur-md border border-white/60 dark:border-white/15 rounded-xl
              text-sm font-bold text-app-secondary
              hover:bg-surface-elevated/45 dark:hover:bg-surface-elevated/30 hover:border-white/80 dark:hover:border-white/25
              transition-all cursor-pointer shadow-sm"
          >
            {subsidiary}
            <ChevronDown size={15} className={`text-app-muted transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropOpen && (
            <ul className="absolute z-20 w-full mt-1.5 rounded-xl overflow-hidden
              bg-surface-elevated/50 dark:bg-surface-elevated/90 backdrop-blur-xl border border-white/60 dark:border-white/15 shadow-lg">
              {subsidiaries.map(s => (
                <li key={s}>
                  <button
                    onClick={() => { setSubsidiary(s); setDropOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer border-none
                      ${s === subsidiary
                        ? 'bg-blue-500/15 dark:bg-blue-500/25 text-blue-700 dark:text-blue-300'
                        : 'text-app-secondary hover:bg-surface-elevated/40 dark:hover:bg-surface-elevated/50'
                      }`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="w-full py-4 px-4 rounded-xl
            bg-surface-elevated/40 dark:bg-surface-elevated/20 backdrop-blur-md border border-white/60 dark:border-white/15
            flex items-center justify-center gap-3
            hover:bg-surface-elevated/55 dark:hover:bg-surface-elevated/30 hover:border-white/80 dark:hover:border-white/25
            shadow-sm hover:shadow-md
            transition-all duration-300 font-bold text-app-secondary
            active:scale-[0.98] cursor-pointer"
          onClick={onLogin}
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          {t('login.googleLogin')}
        </button>
      </div>
    </div>
  );
};

export default Login;
