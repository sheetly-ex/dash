import React, { useState, useMemo } from 'react';
import { Contact2, Search, ChevronRight, UserPlus, Globe, MoreHorizontal, ChevronDown } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import { useSettings } from '../contexts/SettingsContext';

type DivisionId = 'all' | 'mgmt' | 'tech' | 'sales' | 'design';

const DIVISION_IDS: DivisionId[] = ['all', 'mgmt', 'tech', 'sales', 'design'];

const EMPLOYEES = [
  { name: '김철수', pos: '부장', dept: '인사총무팀', division: 'mgmt' as DivisionId, email: 'csk@a9.com', phone: '010-1111-2222' },
  { name: '이영희', pos: '팀장', dept: '전략기획팀', division: 'mgmt' as DivisionId, email: 'yhlee@a9.com', phone: '010-3333-4444' },
  { name: '박민수', pos: '과장', dept: '경영지원팀', division: 'mgmt' as DivisionId, email: 'mspark@a9.com', phone: '010-5555-6666' },
  { name: '정우성', pos: '대리', dept: '플랫폼개발팀', division: 'tech' as DivisionId, email: 'wsjung@a9.com', phone: '010-7777-8888' },
  { name: '한가인', pos: '대리', dept: '인프라운영팀', division: 'tech' as DivisionId, email: 'gihan@a9.com', phone: '010-9999-0000' },
  { name: '손예진', pos: '팀장', dept: '국내영업팀', division: 'sales' as DivisionId, email: 'yjson@a9.com', phone: '010-2222-3333' },
];

const ContactHome: React.FC = () => {
  const { t, tArray } = useSettings();
  const divisions = tArray('contact.divisions');
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState<DivisionId>('all');
  const [dropOpen, setDropOpen] = useState(false);

  const divisionLabel = (id: DivisionId) => {
    const idx = DIVISION_IDS.indexOf(id);
    return divisions[idx] ?? t('contact.divisionAll');
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EMPLOYEES.filter(emp => {
      const matchDivision = division === 'all' || emp.division === division;
      const matchSearch = !q
        || emp.name.toLowerCase().includes(q)
        || emp.dept.toLowerCase().includes(q)
        || emp.pos.toLowerCase().includes(q)
        || emp.email.toLowerCase().includes(q)
        || emp.phone.includes(q);
      return matchDivision && matchSearch;
    });
  }, [search, division]);

  return (
    <div className="space-y-10">
      <Card className="flex flex-col md:flex-row gap-4 items-stretch md:items-center" hoverable={false}>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-app-muted" size={20} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('contact.searchEmployee')}
            className="w-full bg-surface-muted border border-app-muted rounded-lg py-4 pl-14 pr-6 text-sm focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none"
          />
        </div>

        <div className="relative w-full md:w-52 shrink-0">
          <button
            onClick={() => setDropOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-4 bg-surface-muted border border-app-muted rounded-lg text-sm font-bold text-app-secondary hover:bg-surface-elevated hover:border-blue-300 transition-all cursor-pointer"
          >
            <span className="truncate">{divisionLabel(division)}</span>
            <ChevronDown size={16} className={`text-app-muted shrink-0 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropOpen && (
            <ul className="absolute z-20 w-full mt-1.5 rounded-lg overflow-hidden bg-surface-elevated border border-app shadow-lg">
              {DIVISION_IDS.map(id => (
                <li key={id}>
                  <button
                    onClick={() => { setDivision(id); setDropOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer border-none
                      ${id === division
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                        : 'text-app-secondary hover-surface'
                      }`}
                  >
                    {divisionLabel(id)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-4 w-full md:w-auto shrink-0">
          <button className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 border-none cursor-pointer">
            <UserPlus size={18} />
            {t('contact.addContact')}
          </button>
          <button className="flex-1 md:flex-none px-8 py-4 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2 border-none cursor-pointer">
            <Globe size={18} />
            {t('contact.viewOrgChart')}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xl font-black text-app tracking-tight">
              {t('contact.allEmployees')} <span className="text-blue-600 ml-1 text-sm">{filtered.length}</span>
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-elevated border border-app rounded text-[10px] font-black text-app-muted uppercase tracking-widest cursor-pointer hover:bg-surface-muted">{t('contact.sortByName')}</span>
              <span className="px-3 py-1 bg-blue-600 border border-blue-600 rounded text-[10px] font-black text-white uppercase tracking-widest cursor-pointer">{t('contact.sortByDept')}</span>
            </div>
          </div>

          <Card className="overflow-hidden" noPadding hoverable={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-muted/50 border-b border-app-muted">
                    <th className="py-5 px-6 text-[10px] font-black text-app-muted uppercase tracking-widest">{t('contact.nameRank')}</th>
                    <th className="py-5 px-6 text-[10px] font-black text-app-muted uppercase tracking-widest">{t('contact.department')}</th>
                    <th className="py-5 px-6 text-[10px] font-black text-app-muted uppercase tracking-widest">{t('contact.email')}</th>
                    <th className="py-5 px-6 text-[10px] font-black text-app-muted uppercase tracking-widest">{t('contact.mobile')}</th>
                    <th className="py-5 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-muted">
                  {filtered.length > 0 ? (
                    filtered.map(emp => (
                      <ContactRow key={emp.email} {...emp} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm font-bold text-app-muted">
                        {t('common.noResults')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-surface-muted/30 text-center border-t border-app-muted">
              <button className="text-[11px] font-black text-app-muted hover:text-blue-600 transition-colors uppercase tracking-widest border-none bg-transparent cursor-pointer">{t('contact.loadMore')} (1/42)</button>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Widget title={t('contact.favorites')} color="rose">
            <div className="space-y-4">
              <FavoriteItem name="이대리 (CEO)" dept="이사회" />
              <FavoriteItem name="김철수 부장" dept="인사총무팀" />
              <FavoriteItem name="박민수 과장" dept="경영지원팀" />
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
};

interface ContactRowProps { name: string; pos: string; dept: string; email: string; phone: string; }
function ContactRow({ name, pos, dept, email, phone }: ContactRowProps) {
  return (
    <tr className="group hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors cursor-pointer">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-surface-muted flex items-center justify-center text-app-muted group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Contact2 size={16} />
          </div>
          <div>
            <div className="text-[14px] font-black text-app group-hover:text-blue-600 transition-colors">{name}</div>
            <div className="text-[11px] font-bold text-app-muted">{pos}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-[12px] font-black text-app-secondary uppercase tracking-tighter bg-surface-muted px-2.5 py-1 rounded border border-app/50 group-hover:bg-surface-elevated transition-colors">{dept}</span>
      </td>
      <td className="py-4 px-6 text-[13px] font-bold text-app-muted">{email}</td>
      <td className="py-4 px-6 text-[13px] font-bold text-app-muted">{phone}</td>
      <td className="py-4 px-6 text-right">
        <button className="p-2 text-app-muted hover:text-blue-600 transition-colors border-none bg-transparent cursor-pointer">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}

interface FavoriteItemProps { name: string; dept: string; }
function FavoriteItem({ name, dept }: FavoriteItemProps) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-app-muted group-hover:bg-rose-50 group-hover:text-rose-500 transition-all">
          <Contact2 size={14} />
        </div>
        <div>
          <div className="text-[13px] font-black text-app group-hover:text-rose-600 transition-colors">{name}</div>
          <div className="text-[10px] font-bold text-app-muted">{dept}</div>
        </div>
      </div>
      <ChevronRight size={14} className="text-app-muted group-hover:text-app-muted transition-colors" />
    </div>
  );
}

export default ContactHome;
