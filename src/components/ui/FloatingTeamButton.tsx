import React, { useState, useRef, useEffect } from 'react';
import { Users, Mail, Phone, X, ChevronUp } from 'lucide-react';

const TEAM_MEMBERS = [
  { name: '김팀장', rank: '팀장',  phone: '010-1234-5678', email: 'kim.tj@a9.com' },
  { name: '이대리', rank: '대리',  phone: '010-2345-6789', email: 'lee.dr@a9.com' },
  { name: '박주임', rank: '주임',  phone: '010-3456-7890', email: 'park.ji@a9.com' },
  { name: '최사원', rank: '사원',  phone: '010-4567-8901', email: 'choi.sw@a9.com' },
  { name: '정과장', rank: '과장',  phone: '010-5678-9012', email: 'jung.gj@a9.com' },
];

const FloatingTeamButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone).catch(() => {});
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 1500);
  };

  return (
    <div ref={ref} className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-68 bg-[#fafafa] rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users size={13} className="text-slate-400" />
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">우리 팀</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>

          {/* 팀원 목록 */}
          <ul className="divide-y divide-slate-100">
            {TEAM_MEMBERS.map(member => (
              <li key={member.email} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                {/* 아바타 */}
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-black text-slate-500">{member.name[0]}</span>
                </div>

                {/* 이름 + 직급 + 전화 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-black text-slate-700">
                    {member.name}
                    <span className="ml-1.5 text-[10px] font-bold text-slate-400">{member.rank}</span>
                  </p>
                  <button
                    onClick={() => handleCopyPhone(member.phone)}
                    className="flex items-center gap-1 mt-0.5 border-none bg-transparent p-0 cursor-pointer group"
                    title="클릭하여 복사"
                  >
                    <Phone size={10} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    <span className={`text-[11px] font-medium transition-colors ${
                      copiedPhone === member.phone
                        ? 'text-emerald-500'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}>
                      {copiedPhone === member.phone ? '복사됨!' : member.phone}
                    </span>
                  </button>
                </div>

                {/* 메일 버튼 */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&to=${member.email}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title={`${member.name}에게 메일 보내기`}
                >
                  <Mail size={14} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`w-13 h-13 rounded-full shadow-lg flex items-center justify-center border-none cursor-pointer transition-all duration-200 ${
          open
            ? 'bg-slate-700 scale-95'
            : 'bg-slate-800 hover:bg-slate-700 hover:scale-105 hover:shadow-xl'
        }`}
        title="팀원 빠른 연락"
      >
        {open
          ? <ChevronUp size={20} className="text-white" />
          : <Users size={20} className="text-white" />
        }
      </button>
    </div>
  );
};

export default FloatingTeamButton;
