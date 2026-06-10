import React, { useState, useMemo } from 'react';
import {
  Building2, User2, Mail, Phone, Calendar, Briefcase,
  Copy, Search, X, Users,
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import type { TranslationKey } from '../i18n';

interface Member {
  name: string;
  rank: string;
  email: string;
  phone: string;
}

interface PersonInfo {
  email: string;
  phone: string;
  joinYear: number;
  headcount?: number;
  location?: string;
  bio?: string;
}

interface TeamNode {
  id: string;
  name: string;
  position: string;
  department: string;
  isHighlighted?: boolean;
  info: PersonInfo;
  members?: Member[];
}

interface BranchNode {
  id: string;
  name: string;
  position: string;
  department: string;
  isHighlighted?: boolean;
  info: PersonInfo;
  teams: TeamNode[];
}

interface RootNode {
  name: string;
  position: string;
  department: string;
  info: PersonInfo;
  branches: BranchNode[];
}

interface PersonRecord {
  id: string;
  name: string;
  rank: string;
  tier: TierKey;
  email: string;
  phone: string;
  team: string;
  branch: string;
  joinYear?: number;
  location?: string;
  bio?: string;
  isHighlighted?: boolean;
}

type TierKey = 'executive' | 'leader' | 'senior' | 'mid' | 'junior' | 'staff' | 'intern';

const TIER_KEYS: TierKey[] = ['executive', 'leader', 'senior', 'mid', 'junior', 'staff', 'intern'];

// ── 목데이터 (abbreviated - same as before) ───────────────────
const ORG: RootNode = {
  name: '이대리', position: 'CEO / 대표이사', department: '이사회',
  info: { email: 'ceo@i-on.kr', phone: '010-1000-0001', joinYear: 2015, headcount: 148, location: '본사 21F', bio: '창사 멤버로 10년간 회사를 이끌어온 대표이사.' },
  branches: [
    {
      id: 'b0', name: '김철수', position: '본부장', department: '전략기획본부',
      info: { email: 'ks.kim@i-on.kr', phone: '010-2001-0001', joinYear: 2016, headcount: 28, location: '본사 18F', bio: '전사 중장기 전략 및 사업계획 총괄.' },
      teams: [
        { id: 'b0t0', name: '박민수', position: '팀장', department: '경영지원팀', info: { email: 'ms.park@i-on.kr', phone: '010-2101-0001', joinYear: 2018, headcount: 7, location: '18F' }, members: [{ name: '김유진', rank: '대리', email: 'yj.kim@i-on.kr', phone: '010-2101-0101' }] },
      ],
    },
    {
      id: 'b1', name: '박영희', position: '본부장', department: '기술개발본부', isHighlighted: true,
      info: { email: 'yh.park@i-on.kr', phone: '010-2002-0001', joinYear: 2016, headcount: 42, location: '본사 15F', bio: '전사 기술 아키텍처 및 플랫폼 개발 총괄.' },
      teams: [
        { id: 'b1t0', name: '정우성', position: '팀장', department: '플랫폼개발팀', isHighlighted: true, info: { email: 'ws.jung@i-on.kr', phone: '010-2201-0001', joinYear: 2017, headcount: 12, location: '15F' }, members: [{ name: '김태호', rank: '시니어', email: 'th.kim@i-on.kr', phone: '010-2201-0101' }] },
      ],
    },
  ],
};

function inferTier(position?: string, rank?: string): TierKey {
  if (position?.includes('CEO') || position === '본부장') return 'executive';
  if (position === '팀장' || rank === '팀장') return 'leader';
  if (rank === '과장' || rank === '시니어') return 'senior';
  if (rank === '대리' || rank === '미드') return 'mid';
  if (rank === '주임' || rank === '주니어') return 'junior';
  if (rank === '인턴') return 'intern';
  return 'staff';
}

function flattenOrg(): PersonRecord[] {
  const people: PersonRecord[] = [];
  const root = ORG;
  people.push({
    id: 'root', name: root.name, rank: root.position.split('/')[0].trim(), tier: 'executive',
    email: root.info.email, phone: root.info.phone, team: root.department, branch: root.department,
    joinYear: root.info.joinYear, location: root.info.location, bio: root.info.bio,
  });
  root.branches.forEach(branch => {
    people.push({
      id: branch.id, name: branch.name, rank: branch.position, tier: inferTier(branch.position),
      email: branch.info.email, phone: branch.info.phone, team: branch.department, branch: branch.department,
      joinYear: branch.info.joinYear, location: branch.info.location, bio: branch.info.bio,
      isHighlighted: branch.isHighlighted,
    });
    branch.teams.forEach(team => {
      people.push({
        id: team.id, name: team.name, rank: team.position, tier: inferTier(team.position),
        email: team.info.email, phone: team.info.phone, team: team.department, branch: branch.department,
        joinYear: team.info.joinYear, location: team.info.location, isHighlighted: team.isHighlighted,
      });
      team.members?.forEach((m, i) => {
        people.push({
          id: `${team.id}m${i}`, name: m.name, rank: m.rank, tier: inferTier(undefined, m.rank),
          email: m.email, phone: m.phone, team: team.department, branch: branch.department,
          isHighlighted: team.isHighlighted,
        });
      });
    });
  });
  return people;
}

const ALL_PEOPLE = flattenOrg();

function PersonCard({ person, selected, onClick, compact }: {
  person: PersonRecord; selected: boolean; onClick: () => void; compact?: boolean;
}) {
  const isExec = person.tier === 'executive';
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border transition-all cursor-pointer shrink-0
        ${compact ? 'w-[108px] px-2.5 py-2' : 'w-[128px] px-3 py-2.5'}
        ${selected
          ? person.isHighlighted ? 'border-blue-500 bg-blue-600 text-white shadow-md' : 'border-app bg-surface-elevated text-white shadow-md'
          : person.isHighlighted ? 'border-blue-200 bg-blue-50 hover:border-blue-300' : 'border-app bg-surface-elevated hover:border-app hover:bg-surface-muted'
        }`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black mb-1.5
        ${selected ? 'bg-surface-elevated/20 text-white' : isExec ? 'bg-surface-elevated text-white' : 'bg-surface-muted text-app-muted'}`}>
        {isExec ? <Building2 size={12} /> : person.name[0]}
      </div>
      <div className={`text-[12px] font-black truncate ${selected ? 'text-white' : 'text-app'}`}>{person.name}</div>
      <div className={`text-[9px] font-black truncate ${selected ? 'text-white/60' : 'text-app-muted'}`}>{person.rank}</div>
      <div className={`text-[9px] font-bold truncate mt-0.5 ${selected ? 'text-white/50' : 'text-app-muted'}`}>{person.team}</div>
    </button>
  );
}

function RankLane({ tierKey, people, selectedId, onSelect, isCeoLane, t }: {
  tierKey: TierKey;
  people: PersonRecord[];
  selectedId: string | null;
  onSelect: (p: PersonRecord) => void;
  isCeoLane?: boolean;
  t: (key: TranslationKey) => string;
}) {
  if (people.length === 0) return null;
  const label = t(`orgChart.tiers.${tierKey}` as TranslationKey);
  const sub = t(`orgChart.tiers.${tierKey}Sub` as TranslationKey);

  return (
    <div className="flex items-stretch gap-0">
      <div className="w-28 shrink-0 flex flex-col justify-center pr-4 border-r border-app">
        <div className="text-[12px] font-black text-app-secondary">{label}</div>
        <div className="text-[9px] font-bold text-app-muted">{sub}</div>
        <div className="text-[10px] font-black text-app-muted mt-1">{people.length}{t('orgChart.total')}</div>
      </div>
      <div className={`flex-1 flex items-center gap-2 px-4 py-3 overflow-x-auto ${isCeoLane ? 'justify-center' : ''}`}>
        {people.map(p => (
          <PersonCard key={p.id} person={p} selected={selectedId === p.id} onClick={() => onSelect(p)}
            compact={tierKey !== 'executive' && tierKey !== 'leader'} />
        ))}
      </div>
    </div>
  );
}

function PersonDetail({ person, onClose, t }: { person: PersonRecord; onClose: () => void; t: (key: TranslationKey) => string }) {
  const [copied, setCopied] = useState(false);
  const isExec = person.tier === 'executive';

  return (
    <div className="rounded-xl border border-app bg-surface-elevated overflow-hidden">
      <div className={`px-5 py-4 flex items-center gap-4 ${isExec ? 'bg-slate-900' : person.isHighlighted ? 'bg-blue-600' : 'bg-surface-elevated'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isExec && person.rank === 'CEO' ? 'bg-blue-600' : 'bg-surface-elevated/15'}`}>
          {person.rank === 'CEO' ? <Building2 size={18} className="text-white" /> : <User2 size={18} className="text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white">{person.name}</span>
            <span className="text-[10px] font-black text-white/50 bg-surface-elevated/10 px-2 py-0.5 rounded">{person.rank}</span>
          </div>
          <div className="text-[11px] font-bold text-white/50">{person.team} · {person.branch}</div>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-elevated/10 text-white/60 hover:bg-surface-elevated/20 cursor-pointer border-none shrink-0">
          <X size={13} />
        </button>
      </div>
      <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <DetailItem icon={<Mail size={12} />} label={t('orgChart.email')} value={person.email} />
        <DetailItem icon={<Phone size={12} />} label={t('orgChart.phone')} value={person.phone} />
        {person.joinYear && <DetailItem icon={<Calendar size={12} />} label={t('orgChart.join')} value={`${person.joinYear}${t('common.yearSuffix')}`} />}
        {person.location && <DetailItem icon={<Briefcase size={12} />} label={t('orgChart.location')} value={person.location} />}
      </div>
      {person.bio && (
        <div className="px-5 pb-3">
          <p className="text-[12px] font-bold text-app-muted bg-surface-muted px-3 py-2 rounded-lg">{person.bio}</p>
        </div>
      )}
      <div className="px-5 pb-4 flex gap-2">
        <a href={`mailto:${person.email}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-elevated text-white text-[11px] font-black hover:bg-surface-elevated transition-colors no-underline">
          <Mail size={11} /> {t('common.mail')}
        </a>
        <button
          onClick={() => { navigator.clipboard.writeText(person.phone); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-muted text-app-secondary text-[11px] font-black hover:bg-surface-muted cursor-pointer border-none"
        >
          {copied ? t('common.copied') : <><Copy size={11} /> {t('common.copyPhone')}</>}
        </button>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <div className="w-6 h-6 rounded bg-surface-muted flex items-center justify-center text-app-muted shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-[8px] font-black text-app-muted uppercase tracking-widest">{label}</div>
        <div className="text-[11px] font-bold text-app-secondary truncate">{value}</div>
      </div>
    </div>
  );
}

const OrgChart: React.FC = () => {
  const { t } = useSettings();
  const [selected, setSelected] = useState<PersonRecord | null>(null);
  const [search, setSearch] = useState('');
  const [activeTier, setActiveTier] = useState<TierKey | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_PEOPLE.filter(p => {
      const matchTier = activeTier === 'all' || p.tier === activeTier;
      const matchSearch = !q ||
        p.name.includes(q) || p.rank.includes(q) ||
        p.team.toLowerCase().includes(q) || p.branch.toLowerCase().includes(q);
      return matchTier && matchSearch;
    });
  }, [search, activeTier]);

  const byTier = useMemo(() => {
    const map = new Map<TierKey, PersonRecord[]>();
    TIER_KEYS.forEach(k => map.set(k, []));
    filtered.forEach(p => map.get(p.tier)?.push(p));
    return map;
  }, [filtered]);

  const tierCounts = useMemo(() => {
    const counts: Record<TierKey, number> = { executive: 0, leader: 0, senior: 0, mid: 0, junior: 0, staff: 0, intern: 0 };
    ALL_PEOPLE.forEach(p => { counts[p.tier]++; });
    return counts;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] font-black text-app-muted mr-2">
            <Users size={12} /> {ALL_PEOPLE.length}{t('orgChart.total')}
          </span>
          {TIER_KEYS.map(key => (
            <button
              key={key}
              onClick={() => setActiveTier(prev => prev === key ? 'all' : key)}
              className={`text-[10px] font-black px-2.5 py-1 rounded-full transition-colors cursor-pointer border-none
                ${activeTier === key ? 'bg-surface-elevated text-white' : 'bg-surface-muted text-app-muted hover:bg-surface-muted'}`}
            >
              {t(`orgChart.tiers.${key}` as TranslationKey)} {tierCounts[key]}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('orgChart.search')}
            className="w-full pl-9 pr-3 py-2 text-[12px] font-medium rounded-lg border border-app bg-surface-elevated focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      <div className="rounded-xl border border-app bg-surface-elevated overflow-hidden divide-y divide-slate-100">
        {TIER_KEYS.map(key => (
          <RankLane key={key} tierKey={key} people={byTier.get(key) ?? []} selectedId={selected?.id ?? null}
            onSelect={setSelected} isCeoLane={key === 'executive'} t={t} />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[12px] font-bold text-app-muted">{t('common.noResults')}</div>
        )}
      </div>

      {selected && <PersonDetail person={selected} onClose={() => setSelected(null)} t={t} />}
    </div>
  );
};

export default OrgChart;
