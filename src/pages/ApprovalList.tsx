import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import SearchInput from '../components/ui/SearchInput';
import EmptyState from '../components/ui/EmptyState';
import { useSettings } from '../contexts/SettingsContext';
import type { TranslationKey } from '../i18n';

interface Props {
  mode: 'received' | 'sent';
}

type StatusKey = 'pending' | 'inProgress' | 'reviewing' | 'approved' | 'rejected';

interface ApprovalItem {
  id: number;
  type: string;
  title: string;
  from: string;
  dept: string;
  date: string;
  status: StatusKey;
  urgent: boolean;
}

const receivedData: ApprovalItem[] = [
  { id: 1, type: '기안서', title: '2026 하반기 팀 교육 예산 편성 계획', from: '이대리', dept: '경영지원팀', date: '2026.06.03', status: 'pending', urgent: true },
  { id: 2, type: '구매요청서', title: '개발팀 맥북 프로 16인치 3대 구매 요청', from: '박주임', dept: 'IT운영팀', date: '2026.06.02', status: 'pending', urgent: false },
  { id: 3, type: '출장신청서', title: '6월 부산 고객사 방문 출장 신청', from: '최과장', dept: '사업팀', date: '2026.05.30', status: 'reviewing', urgent: false },
  { id: 4, type: '휴가신청서', title: '연차 신청 (06.10 ~ 06.11)', from: '정사원', dept: '경영지원팀', date: '2026.05.28', status: 'approved', urgent: false },
  { id: 5, type: '기안서', title: '팀 워크샵 장소 및 예산 승인 요청', from: '한주임', dept: '마케팅팀', date: '2026.05.25', status: 'approved', urgent: false },
  { id: 6, type: '품의서', title: '사무용 소모품 일괄 구매 품의', from: '장대리', dept: '총무팀', date: '2026.05.20', status: 'rejected', urgent: false },
];

const sentData: ApprovalItem[] = [
  { id: 1, type: '구매요청서', title: 'JetBrains 전체 라이선스 갱신 요청', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.06.01', status: 'inProgress', urgent: false },
  { id: 2, type: '기안서', title: '팀 내 신규 인력 채용 계획서', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.28', status: 'approved', urgent: false },
  { id: 3, type: '교육신청서', title: 'AWS 클라우드 자격증 교육 수강 신청', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.20', status: 'approved', urgent: false },
  { id: 4, type: '출장신청서', title: '서울 본사 주요 회의 참석 출장 신청', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.15', status: 'rejected', urgent: false },
  { id: 5, type: '휴가신청서', title: '연차 사용 신청 (05.05 ~ 05.06)', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.01', status: 'approved', urgent: false },
];

const FILTER_STATUSES: (StatusKey | 'all')[] = ['all', 'pending', 'inProgress', 'reviewing', 'approved', 'rejected'];

const ApprovalList: React.FC<Props> = ({ mode }) => {
  const { t } = useSettings();
  const data = mode === 'received' ? receivedData : sentData;
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusKey | 'all'>('all');

  const statusLabel = (key: StatusKey | 'all') =>
    key === 'all' ? t('status.all' as TranslationKey) : t(`status.${key}` as TranslationKey);

  const filtered = data.filter(item => {
    const matchSearch = item.title.includes(search) || item.from.includes(search);
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    pending: data.filter(d => d.status === 'pending' || d.status === 'inProgress' || d.status === 'reviewing').length,
    done: data.filter(d => d.status === 'approved').length,
    rejected: data.filter(d => d.status === 'rejected').length,
  };

  const pendingLabel = mode === 'received' ? t('approval.processing') : t('approval.inProgress');
  const countSuffix = t('approval.count');

  return (
    <div className="space-y-4">
      <Widget
        title={mode === 'received' ? t('approval.received') : t('approval.sent')}
        headerRight={
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-app-muted">{pendingLabel} <span className="font-black text-rose-500">{counts.pending}{countSuffix}</span></span>
            <span className="text-app-muted">·</span>
            <span className="text-[11px] font-bold text-app-muted">{t('approval.approved')} <span className="font-black text-emerald-500">{counts.done}{countSuffix}</span></span>
            <span className="text-app-muted">·</span>
            <span className="text-[11px] font-bold text-app-muted">{t('approval.rejected')} <span className="font-black text-app-muted">{counts.rejected}{countSuffix}</span></span>
          </div>
        }>
        <div className="flex items-center gap-3 mb-6 mt-2">
          <SearchInput value={search} onChange={setSearch} placeholder={t('approval.searchPlaceholder')} size="sm" className="flex-1" />
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as StatusKey | 'all')}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-app text-[12px] font-black text-app-secondary bg-surface-elevated cursor-pointer hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              {FILTER_STATUSES.map(s => (
                <option key={s} value={s}>{statusLabel(s)}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && <EmptyState message={t('common.noResults')} size="lg" />}
          {filtered.map(item => (
            <Card key={item.id} noPadding className="flex items-center gap-4 p-4 hover:border-blue-100 hover:shadow-sm transition-all group cursor-pointer">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black text-app-muted uppercase tracking-widest shrink-0">{item.type}</span>
                  {item.urgent && <Badge variant="rose">{t('approval.urgent')}</Badge>}
                </div>
                <div className="text-[14px] font-black text-app truncate group-hover:text-blue-700 transition-colors">{item.title}</div>
                <div className="text-[11px] font-bold text-app-muted mt-0.5">{item.from} · {item.dept}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] font-bold text-app-muted italic">{item.date}</span>
                <Badge variant={STATUS_VARIANT[item.status] ?? 'slate'} size="sm">{statusLabel(item.status)}</Badge>
                <ChevronRight size={16} className="text-app-muted group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Card>
          ))}
        </div>
      </Widget>
    </div>
  );
};

export default ApprovalList;
