import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Building2, Mail, Phone, Calendar, Briefcase,
  Copy, Search, X, Users, ChevronDown, Check,
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import type { TranslationKey } from '../../i18n';

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

const AVATAR_GRADIENTS = [
  'from-blue-400 to-indigo-500',
  'from-violet-400 to-purple-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-cyan-400 to-blue-500',
];

function avatarGradient(name: string) {
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
}

const ORG: RootNode = {
  name: '이대리', position: 'CEO / 대표이사', department: '이사회',
  info: { email: 'ceo@i-on.kr', phone: '010-1000-0001', joinYear: 2015, headcount: 148, location: '본사 21F', bio: '창사 멤버로 10년간 회사를 이끌어온 대표이사.' },
  branches: [
    {
      id: 'b0', name: '김철수', position: '본부장', department: '전략기획본부',
      info: { email: 'ks.kim@i-on.kr', phone: '010-2001-0001', joinYear: 2016, headcount: 28, location: '본사 18F', bio: '전사 중장기 전략 및 사업계획 총괄.' },
      teams: [
        { id: 'b0t0', name: '박민수', position: '팀장', department: '경영지원팀', info: { email: 'ms.park@i-on.kr', phone: '010-2101-0001', joinYear: 2018, headcount: 7, location: '18F' }, members: [{ name: '김유진', rank: '대리', email: 'yj.kim@i-on.kr', phone: '010-2101-0101' }, { name: '이준호', rank: '사원', email: 'jh.lee@i-on.kr', phone: '010-2101-0102' }] },
        { id: 'b0t1', name: '최지우', position: '팀장', department: '인사기획팀', info: { email: 'jw.choi@i-on.kr', phone: '010-2102-0001', joinYear: 2019, headcount: 5, location: '18F' }, members: [{ name: '한소희', rank: '대리', email: 'sh.han@i-on.kr', phone: '010-2102-0101' }] },
      ],
    },
    {
      id: 'b1', name: '박영희', position: '본부장', department: '기술개발본부', isHighlighted: true,
      info: { email: 'yh.park@i-on.kr', phone: '010-2002-0001', joinYear: 2016, headcount: 42, location: '본사 15F', bio: '전사 기술 아키텍처 및 플랫폼 개발 총괄.' },
      teams: [
        { id: 'b1t0', name: '정우성', position: '팀장', department: '플랫폼개발팀', isHighlighted: true, info: { email: 'ws.jung@i-on.kr', phone: '010-2201-0001', joinYear: 2017, headcount: 12, location: '15F' }, members: [{ name: '김태호', rank: '시니어', email: 'th.kim@i-on.kr', phone: '010-2201-0101' }, { name: '박서연', rank: '대리', email: 'sy.park@i-on.kr', phone: '010-2201-0102' }] },
        { id: 'b1t1', name: '한가인', position: '팀장', department: '인프라운영팀', info: { email: 'gi.han@i-on.kr', phone: '010-2202-0001', joinYear: 2018, headcount: 8, location: '15F' }, members: [{ name: '오민석', rank: '과장', email: 'ms.oh@i-on.kr', phone: '010-2202-0101' }] },
      ],
    },
    {
      id: 'b2', name: '홍길동', position: '본부장', department: '영업마케팅본부',
      info: { email: 'gd.hong@i-on.kr', phone: '010-2003-0001', joinYear: 2017, headcount: 35, location: '본사 12F', bio: '국내외 영업 및 마케팅 전략 총괄.' },
      teams: [
        { id: 'b2t0', name: '손예진', position: '팀장', department: '국내영업팀', info: { email: 'yj.son@i-on.kr', phone: '010-2301-0001', joinYear: 2018, headcount: 10, location: '12F' }, members: [{ name: '강동원', rank: '대리', email: 'dw.kang@i-on.kr', phone: '010-2301-0101' }] },
        { id: 'b2t1', name: '현빈', position: '팀장', department: '글로벌마케팅팀', info: { email: 'hb.hyun@i-on.kr', phone: '010-2302-0001', joinYear: 2019, headcount: 9, location: '12F' }, members: [{ name: '송혜교', rank: '과장', email: 'hg.song@i-on.kr', phone: '010-2302-0101' }, { name: '유재석', rank: '대리', email: 'js.yoo@i-on.kr', phone: '010-2302-0102' }] },
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

function matchesQuery(person: PersonRecord, q: string) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return person.name.includes(q) || person.rank.includes(q) ||
    person.team.toLowerCase().includes(lower) || person.branch.toLowerCase().includes(lower);
}

interface OrgCardProps {
  id: string;
  name: string;
  subtitle: string;
  email: string;
  phone: string;
  isHighlighted?: boolean;
  selected: boolean;
  dimmed?: boolean;
  hasChildren?: boolean;
  expanded?: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onToggle?: () => void;
  t: (key: TranslationKey) => string;
}

function OrgCard({
  id, name, subtitle, email, phone, isHighlighted, selected, dimmed,
  hasChildren, expanded, onSelect, onToggle, t,
}: OrgCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleMail = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const cardClass = selected
    ? 'bg-blue-500/80 backdrop-blur-md border border-blue-300/50 dark:border-blue-400/30 text-white shadow-lg shadow-blue-500/20'
    : isHighlighted
      ? 'bg-blue-50/70 dark:bg-blue-950/35 backdrop-blur-md border border-blue-200/80 dark:border-blue-700/40 hover:border-blue-300/90 hover:shadow-md hover:shadow-blue-500/10'
      : 'bg-white/55 dark:bg-surface-elevated/30 backdrop-blur-md border border-white/80 dark:border-white/10 hover:border-blue-200/60 hover:shadow-md hover:shadow-blue-500/5';

  const iconBtn = selected
    ? 'text-white/80 hover:text-white'
    : 'text-app-muted hover:text-app-secondary';

  const chevronClass = expanded
    ? selected ? 'text-white' : 'text-blue-600'
    : selected ? 'text-white/50 hover:text-white/80' : 'text-app-muted hover:text-blue-500';

  return (
    <div className={`flex flex-col items-center ${dimmed ? 'opacity-30' : ''}`} data-node-id={id}>
      <div className={`flex items-center gap-2 pl-4 pr-2.5 py-2 rounded-full border shadow-sm transition-all min-w-[180px] max-w-[260px] ${cardClass}`}>
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={onSelect}
            className={`block w-full text-left truncate text-[13px] font-semibold leading-tight cursor-pointer border-none bg-transparent p-0 ${selected ? 'text-white' : 'text-app'}`}
          >
            {name}
          </button>
          <button
            type="button"
            onClick={onSelect}
            className={`block w-full text-left truncate text-[11px] leading-tight cursor-pointer border-none bg-transparent p-0 mt-0.5 ${selected ? 'text-white/70' : 'text-app-muted'}`}
          >
            {subtitle}
          </button>
        </div>
        <div className="flex items-center gap-1 shrink-0 self-start mt-0.5">
          <button
            type="button"
            onClick={handleCopyPhone}
            title={copied ? t('common.copied') : phone}
            className={`px-0.5 shrink-0 flex items-center justify-center cursor-pointer border-none bg-transparent transition-all duration-300
              ${copied
                ? selected ? 'text-emerald-300 scale-110' : 'text-emerald-600 scale-110'
                : iconBtn}`}
            aria-label={t('orgChart.phone')}
          >
            {copied ? (
              <Check key="check" size={12} strokeWidth={2.5} className="org-check-pop" />
            ) : (
              <Phone key="phone" size={12} strokeWidth={2} />
            )}
          </button>
          <button
            type="button"
            onClick={handleMail}
            title={email}
            className={`px-0.5 shrink-0 flex items-center justify-center cursor-pointer border-none bg-transparent transition-colors ${iconBtn}`}
            aria-label={t('orgChart.email')}
          >
            <Mail size={12} strokeWidth={2} />
          </button>
        </div>
        {hasChildren && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onToggle?.(); }}
            className="p-0 shrink-0 self-start mt-0.5 cursor-pointer border-none bg-transparent flex items-center justify-center"
            aria-expanded={expanded}
            aria-label={expanded ? 'collapse' : 'expand'}
          >
            <ChevronDown
              size={13}
              className={`transition-all duration-200 ${expanded ? 'rotate-180' : ''} ${chevronClass}`}
            />
          </button>
        )}
      </div>
    </div>
  );
}

function ConnectorDown({ height = 32 }: { height?: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-0.5 bg-blue-400/50" style={{ height }} />
      <div className="w-2 h-2 rounded-full bg-blue-400/60 shrink-0" />
    </div>
  );
}

function HorizontalConnector({ childCount }: { childCount: number }) {
  if (childCount <= 1) return <ConnectorDown />;
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-0.5 h-8 bg-blue-400/50" />
      <div className="relative w-full flex justify-center">
        <div
          className="absolute top-0 h-0.5 bg-blue-400/50"
          style={{ left: `${100 / (childCount * 2)}%`, right: `${100 / (childCount * 2)}%` }}
        />
        <div className="flex w-full justify-around">
          {Array.from({ length: childCount }).map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="w-0.5 h-8 bg-blue-400/50" />
              <div className="w-2 h-2 rounded-full bg-blue-400/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamGroup({
  teams, selectedId, search, collapsedTeams, onSelect, onToggleTeam,
  toPerson, t,
}: {
  teams: TeamNode[];
  selectedId: string | null;
  search: string;
  collapsedTeams: Set<string>;
  onSelect: (p: PersonRecord, e: React.MouseEvent) => void;
  onToggleTeam: (id: string) => void;
  toPerson: (team: TeamNode, member?: Member, memberIdx?: number) => PersonRecord;
  t: (key: TranslationKey) => string;
}) {
  const visibleTeams = teams.filter(team => {
    if (!search.trim()) return true;
    const teamPerson = toPerson(team);
    if (matchesQuery(teamPerson, search)) return true;
    return team.members?.some((m, i) => matchesQuery(toPerson(team, m, i), search));
  });

  if (visibleTeams.length === 0) return null;

  return (
    <div className="flex flex-col items-center mt-8">
      {visibleTeams.length > 1 ? (
        <HorizontalConnector childCount={visibleTeams.length} />
      ) : (
        <ConnectorDown height={28} />
      )}
      <div className="h-4" />
      <div className="flex flex-wrap gap-8 justify-center">
        {visibleTeams.map(team => {
          const teamExpanded = !collapsedTeams.has(team.id);
          const teamPerson = toPerson(team);
          const teamDimmed = search.trim() !== '' && !matchesQuery(teamPerson, search) &&
            !team.members?.some((m, i) => matchesQuery(toPerson(team, m, i), search));

          return (
            <div key={team.id} className="flex flex-col items-center gap-4">
              <OrgCard
                id={team.id}
                name={team.name}
                subtitle={`${team.position} · ${team.department}`}
                email={team.info.email}
                phone={team.info.phone}
                isHighlighted={team.isHighlighted}
                selected={selectedId === team.id}
                dimmed={teamDimmed}
                hasChildren={(team.members?.length ?? 0) > 0}
                expanded={teamExpanded}
                onSelect={e => onSelect(teamPerson, e)}
                onToggle={() => onToggleTeam(team.id)}
                t={t}
              />

              {teamExpanded && (team.members?.length ?? 0) > 0 && (
                <>
                  <ConnectorDown height={24} />
                  <div className="flex flex-wrap gap-3 justify-center">
                    {team.members!.map((m, i) => {
                      const memberPerson = toPerson(team, m, i);
                      const memberDimmed = search.trim() !== '' && !matchesQuery(memberPerson, search);
                      return (
                        <OrgCard
                          key={memberPerson.id}
                          id={memberPerson.id}
                          name={m.name}
                          subtitle={m.rank}
                          email={m.email}
                          phone={m.phone}
                          isHighlighted={team.isHighlighted}
                          selected={selectedId === memberPerson.id}
                          dimmed={memberDimmed}
                          onSelect={e => onSelect(memberPerson, e)}
                          t={t}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function anchorFromClick(e: React.MouseEvent) {
  const el = (e.currentTarget as HTMLElement).closest('[data-node-id]') as HTMLElement | null;
  return (el ?? e.currentTarget as HTMLElement).getBoundingClientRect();
}

function PersonDetailPopover({
  person, anchor, onClose, t,
}: {
  person: PersonRecord;
  anchor: DOMRect;
  onClose: () => void;
  t: (key: TranslationKey) => string;
}) {
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: anchor.bottom + 8, left: anchor.left + anchor.width / 2 });

  useEffect(() => {
    const pop = popoverRef.current;
    if (!pop) return;
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    const gap = 8;
    let top = anchor.bottom + gap;
    let left = anchor.left + anchor.width / 2 - pw / 2;
    if (top + ph > window.innerHeight - 8) top = anchor.top - ph - gap;
    left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - ph - 8));
    setPos({ top, left });
  }, [anchor, person.id]);

  useEffect(() => {
    const handleScroll = () => onClose();
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [onClose]);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(person.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleMail = () => {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(person.email)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const deptLabel = person.team === person.branch ? person.team : `${person.team} · ${person.branch}`;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/5 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={popoverRef}
        className="fixed z-50 w-72 rounded-2xl border border-white/80 dark:border-white/10 bg-white/55 dark:bg-surface-elevated/30 backdrop-blur-md shadow-lg shadow-blue-500/10 overflow-hidden"
        style={{ top: pos.top, left: pos.left }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-3 py-2.5 flex items-center gap-2.5 border-b border-white/50 dark:border-white/10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[12px] font-semibold bg-linear-to-br ${avatarGradient(person.name)} shadow-sm`}>
            {person.rank === 'CEO' ? <Building2 size={14} /> : person.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-app truncate">{person.name}</span>
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50/80 dark:bg-blue-950/35 backdrop-blur-sm border border-blue-200/60 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 shrink-0">
                {person.rank}
              </span>
            </div>
            <div className="text-[10px] text-app-muted truncate mt-0.5">{deptLabel}</div>
          </div>
          <button
            onClick={onClose}
            className="p-0.5 text-app-muted hover:text-blue-500 cursor-pointer border-none bg-transparent shrink-0 transition-colors"
            aria-label="close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-3 py-2.5 space-y-1.5">
          <DetailRow icon={<Mail size={12} />} iconClass="text-blue-500/80" label={t('orgChart.email')} value={person.email} />
          <DetailRow icon={<Phone size={12} />} iconClass="text-emerald-500/80" label={t('orgChart.phone')} value={person.phone} />
          {person.joinYear && (
            <DetailRow icon={<Calendar size={12} />} iconClass="text-violet-500/80" label={t('orgChart.join')} value={`${person.joinYear}${t('common.yearSuffix')}`} />
          )}
          {person.location && (
            <DetailRow icon={<Briefcase size={12} />} iconClass="text-amber-500/80" label={t('orgChart.location')} value={person.location} />
          )}
        </div>

        {person.bio && (
          <p className="px-3 pb-2 text-[11px] text-app-muted leading-relaxed line-clamp-2 border-l-2 border-blue-200/60 dark:border-blue-800/40 ml-3 mr-3 pl-2">
            {person.bio}
          </p>
        )}

        <div className="px-3 pb-3 flex gap-2">
          <button
            type="button"
            onClick={handleMail}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full bg-blue-500/75 backdrop-blur-sm border border-blue-300/40 text-white text-[11px] font-medium hover:bg-blue-500/90 transition-colors cursor-pointer shadow-sm shadow-blue-500/15"
          >
            <Mail size={12} /> {t('common.mail')}
          </button>
          <button
            type="button"
            onClick={handleCopyPhone}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full border border-white/80 dark:border-white/15 bg-white/40 dark:bg-white/5 backdrop-blur-sm text-app-secondary text-[11px] font-medium hover:border-blue-200/60 hover:text-blue-600 cursor-pointer transition-all duration-300"
          >
            {copied ? (
              <><Check size={12} className="org-check-pop text-emerald-500" /> {t('common.copied')}</>
            ) : (
              <><Copy size={12} /> {t('common.copyPhone')}</>
            )}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}

function DetailRow({ icon, iconClass, label, value }: { icon: React.ReactNode; iconClass: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0 py-0.5">
      <span className={`shrink-0 ${iconClass}`}>{icon}</span>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="text-[9px] text-app-muted">{label}</div>
        <div className="text-[11px] text-app-secondary font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

const OrgChart: React.FC = () => {
  const { t } = useSettings();
  const [selection, setSelection] = useState<{ person: PersonRecord; anchor: DOMRect } | null>(null);

  const handleSelect = (person: PersonRecord, e: React.MouseEvent) => {
    setSelection({ person, anchor: anchorFromClick(e) });
  };
  const [search, setSearch] = useState('');
  const [collapsedBranches, setCollapsedBranches] = useState<Set<string>>(new Set());
  const [collapsedTeams, setCollapsedTeams] = useState<Set<string>>(new Set());
  const [ceoExpanded, setCeoExpanded] = useState(true);

  const rootPerson: PersonRecord = useMemo(() => ({
    id: 'root', name: ORG.name, rank: 'CEO', tier: 'executive',
    email: ORG.info.email, phone: ORG.info.phone, team: ORG.department, branch: ORG.department,
    joinYear: ORG.info.joinYear, location: ORG.info.location, bio: ORG.info.bio,
  }), []);

  const toPerson = (team: TeamNode, member?: Member, memberIdx?: number): PersonRecord => {
    if (member !== undefined && memberIdx !== undefined) {
      const branch = ORG.branches.find(b => b.teams.some(t => t.id === team.id))!;
      return {
        id: `${team.id}m${memberIdx}`, name: member.name, rank: member.rank,
        tier: inferTier(undefined, member.rank), email: member.email, phone: member.phone,
        team: team.department, branch: branch.department, isHighlighted: team.isHighlighted,
      };
    }
    const branch = ORG.branches.find(b => b.teams.some(t => t.id === team.id))!;
    return {
      id: team.id, name: team.name, rank: team.position, tier: inferTier(team.position),
      email: team.info.email, phone: team.info.phone, team: team.department, branch: branch.department,
      joinYear: team.info.joinYear, location: team.info.location, isHighlighted: team.isHighlighted,
    };
  };

  const branchToPerson = (branch: BranchNode): PersonRecord => ({
    id: branch.id, name: branch.name, rank: branch.position, tier: 'executive',
    email: branch.info.email, phone: branch.info.phone, team: branch.department, branch: branch.department,
    joinYear: branch.info.joinYear, location: branch.info.location, bio: branch.info.bio,
    isHighlighted: branch.isHighlighted,
  });

  const visibleBranches = useMemo(() => {
    if (!search.trim()) return ORG.branches;
    return ORG.branches.filter(branch => {
      if (matchesQuery(branchToPerson(branch), search)) return true;
      return branch.teams.some(team => {
        if (matchesQuery(toPerson(team), search)) return true;
        return team.members?.some((m, i) => matchesQuery(toPerson(team, m, i), search));
      });
    });
  }, [search]);

  const toggleBranch = (id: string) => {
    setCollapsedBranches(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTeam = (id: string) => {
    setCollapsedTeams(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const rootDimmed = search.trim() !== '' && !matchesQuery(rootPerson, search) &&
    visibleBranches.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <span className="flex items-center gap-1.5 text-[12px] text-app-muted">
          <Users size={14} />
          {ALL_PEOPLE.length}{t('orgChart.total')}
          <span className="text-app-muted/40 mx-1">·</span>
          {ORG.branches.length}{t('orgChart.branches')}
        </span>
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('orgChart.search')}
            className="w-full pl-9 pr-3 py-2 text-[12px] rounded-full border border-white/70 dark:border-white/15 bg-white/50 dark:bg-surface-elevated/25 backdrop-blur-md focus:outline-none focus:border-blue-300/80 focus:bg-white/70 transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="py-2">
        <div className="flex flex-col items-center w-max mx-auto pb-8">
          <OrgCard
            id="root"
            name={ORG.name}
            subtitle={ORG.position}
            email={ORG.info.email}
            phone={ORG.info.phone}
            selected={selection?.person.id === 'root'}
            dimmed={rootDimmed}
            hasChildren={ORG.branches.length > 0}
            expanded={ceoExpanded}
            onSelect={e => handleSelect(rootPerson, e)}
            onToggle={() => setCeoExpanded(v => !v)}
            t={t}
          />

          {ceoExpanded && visibleBranches.length > 0 && (
            <>
              <div className="h-6" />
              <HorizontalConnector childCount={visibleBranches.length} />
              <div className="h-4" />

              <div className="flex items-start justify-center gap-6 lg:gap-10">
                {visibleBranches.map(branch => {
                  const branchPerson = branchToPerson(branch);
                  const branchExpanded = !collapsedBranches.has(branch.id);
                  const branchDimmed = search.trim() !== '' && !matchesQuery(branchPerson, search) &&
                    !branch.teams.some(team => {
                      if (matchesQuery(toPerson(team), search)) return true;
                      return team.members?.some((m, i) => matchesQuery(toPerson(team, m, i), search));
                    });

                  return (
                    <div key={branch.id} className="flex flex-col items-center">
                      <OrgCard
                        id={branch.id}
                        name={branch.name}
                        subtitle={`${branch.position} · ${branch.department}`}
                        email={branch.info.email}
                        phone={branch.info.phone}
                        isHighlighted={branch.isHighlighted}
                        selected={selection?.person.id === branch.id}
                        dimmed={branchDimmed}
                        hasChildren={branch.teams.length > 0}
                        expanded={branchExpanded}
                        onSelect={e => handleSelect(branchPerson, e)}
                        onToggle={() => toggleBranch(branch.id)}
                        t={t}
                      />

                      {branchExpanded && (
                        <TeamGroup
                          teams={branch.teams}
                          selectedId={selection?.person.id ?? null}
                          search={search}
                          collapsedTeams={collapsedTeams}
                          onSelect={handleSelect}
                          onToggleTeam={toggleTeam}
                          toPerson={toPerson}
                          t={t}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {search.trim() && visibleBranches.length === 0 && !matchesQuery(rootPerson, search) && (
            <div className="mt-8 text-[12px] text-app-muted">{t('common.noResults')}</div>
          )}
        </div>
      </div>

      {selection && (
        <PersonDetailPopover
          person={selection.person}
          anchor={selection.anchor}
          onClose={() => setSelection(null)}
          t={t}
        />
      )}
    </div>
  );
};

export default OrgChart;
