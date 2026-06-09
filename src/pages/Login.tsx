import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SUBSIDIARIES = [
  '본사 (i-on)',
  'B 계열사',
  'C 계열사',
  'D 계열사',
];

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [subsidiary, setSubsidiary] = useState(SUBSIDIARIES[0]);
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <div className="p-12 rounded-2xl text-center w-[420px] border border-slate-100">
        {/* Logo */}
        <div className="w-20 h-20 rounded-xl mx-auto mb-10 flex items-center justify-center">
          <span className="text-blue-500 text-3xl font-black tracking-tight">dash</span>
        </div>

        {/* 자회사 선택 */}
        <div className="mb-6 text-left relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
            자회사 선택
          </label>
          <button
            onClick={() => setDropOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#fafafa] border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:border-slate-300 transition-all cursor-pointer"
          >
            {subsidiary}
            <ChevronDown size={15} className={`text-slate-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-[#fafafa] border border-slate-200 rounded-lg shadow-lg overflow-hidden">
              {SUBSIDIARIES.map(s => (
                <li key={s}>
                  <button
                    onClick={() => { setSubsidiary(s); setDropOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer border-none ${
                      s === subsidiary ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Google 로그인 버튼 */}
        <button
          className="w-full py-4 px-4 rounded-lg bg-[#fafafa] border border-slate-200 flex items-center justify-center gap-3 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 font-bold text-slate-700 active:scale-[0.97] cursor-pointer"
          onClick={onLogin}
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          Google 계정으로 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
