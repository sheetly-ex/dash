import React, { useState, useRef, useEffect } from 'react';
import { Users, Mail, Phone, X, ChevronUp } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const TEAM_MEMBERS = [
  { name: '김팀장', rank: '팀장',  phone: '010-1234-5678', email: 'kim.tj@i-on.com' },
  { name: '이대리', rank: '대리',  phone: '010-2345-6789', email: 'lee.dr@i-on.com' },
  { name: '박주임', rank: '주임',  phone: '010-3456-7890', email: 'park.ji@i-on.com' },
  { name: '최사원', rank: '사원',  phone: '010-4567-8901', email: 'choi.sw@i-on.com' },
  { name: '정과장', rank: '과장',  phone: '010-5678-9012', email: 'jung.gj@i-on.com' },
];

const FloatingTeamButton: React.FC = () => {
  const { t } = useSettings();
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
        <div className="w-68 bg-surface-elevated rounded-xl shadow-2xl border border-app overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-app-muted">
            <div className="flex items-center gap-2">
              <Users size={13} className="text-app-muted" />
              <span className="text-[11px] font-black text-app-secondary uppercase tracking-widest">{t('team.title')}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md text-app-muted hover:text-app-secondary hover:bg-surface-muted transition-colors border-none bg-transparent cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>

          <ul className="divide-y divide-slate-100">
            {TEAM_MEMBERS.map(member => (
              <li key={member.email} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted transition-colors">
                <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-black text-app-muted">{member.name[0]}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-black text-app-secondary">
                    {member.name}
                    <span className="ml-1.5 text-[10px] font-bold text-app-muted">{member.rank}</span>
                  </p>
                  <button
                    onClick={() => handleCopyPhone(member.phone)}
                    className="flex items-center gap-1 mt-0.5 border-none bg-transparent p-0 cursor-pointer group"
                    title={t('team.clickToCopy')}
                  >
                    <Phone size={10} className="text-app-muted group-hover:text-app-muted transition-colors" />
                    <span className={`text-[11px] font-medium transition-colors ${
                      copiedPhone === member.phone
                        ? 'text-emerald-500'
                        : 'text-app-muted group-hover:text-app-secondary'
                    }`}>
                      {copiedPhone === member.phone ? t('team.copied') : member.phone}
                    </span>
                  </button>
                </div>

                <a
                  href={`https://mail.google.com/mail/?view=cm&to=${member.email}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg text-app-muted hover:text-app-secondary hover:bg-surface-muted transition-colors"
                  title={`${t('team.sendMailTo')} ${member.name}`}
                >
                  <Mail size={14} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        className={`w-13 h-13 rounded-full shadow-lg flex items-center justify-center border-none cursor-pointer transition-all duration-200 ${
          open
            ? 'bg-surface-elevated scale-95'
            : 'bg-surface-elevated hover:bg-surface-elevated'
        }`}
        title={t('team.quickContact')}
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
