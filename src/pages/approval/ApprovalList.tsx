import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Widget from '../../components/ui/Widget';
import Card from '../../components/ui/Card';
import Badge, { STATUS_VARIANT } from '../../components/ui/Badge';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import ApprovalDetail from './ApprovalDetail';
import { useSettings } from '../../contexts/SettingsContext';
import type { TranslationKey } from '../../i18n';
import {
  RECEIVED_APPROVALS, SENT_APPROVALS,
  type ApprovalStatusKey, type ApprovalRecord,
} from '../../data/approvals';

interface Props {
  mode: 'received' | 'sent';
}

const FILTER_STATUSES: (ApprovalStatusKey | 'all')[] = ['all', 'pending', 'inProgress', 'reviewing', 'approved', 'rejected'];

const ApprovalList: React.FC<Props> = ({ mode }) => {
  const { t } = useSettings();
  const data = mode === 'received' ? RECEIVED_APPROVALS : SENT_APPROVALS;
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApprovalStatusKey | 'all'>('all');
  const [selected, setSelected] = useState<ApprovalRecord | null>(null);

  const statusLabel = (key: ApprovalStatusKey | 'all') =>
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

  if (selected) {
    return (
      <ApprovalDetail
        item={selected}
        mode={mode}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Widget
        title={mode === 'received' ? t('approval.received') : t('approval.sent')}
        headerRight={
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-app-muted">{pendingLabel} <span className="font-medium text-rose-500">{counts.pending}{countSuffix}</span></span>
            <span className="text-app-muted">·</span>
            <span className="text-[11px] font-medium text-app-muted">{t('approval.approved')} <span className="font-medium text-emerald-500">{counts.done}{countSuffix}</span></span>
            <span className="text-app-muted">·</span>
            <span className="text-[11px] font-medium text-app-muted">{t('approval.rejected')} <span className="font-medium text-app-muted">{counts.rejected}{countSuffix}</span></span>
          </div>
        }>
        <div className="flex items-center gap-3 mb-6 mt-2">
          <SearchInput value={search} onChange={setSearch} placeholder={t('approval.searchPlaceholder')} size="sm" className="flex-1" />
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as ApprovalStatusKey | 'all')}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-app text-[12px] font-medium text-app-secondary bg-surface-elevated cursor-pointer hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
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
            <Card
              key={item.id}
              noPadding
              className="flex items-center gap-4 p-4 hover:shadow-sm transition-all group cursor-pointer"
              onClick={() => setSelected(item)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-medium text-app-muted uppercase tracking-widest shrink-0">{item.type}</span>
                  {item.urgent && <Badge variant="rose">{t('approval.urgent')}</Badge>}
                </div>
                <div className="text-[14px] font-medium text-app truncate group-hover:text-blue-700 transition-colors">{item.title}</div>
                <div className="text-[11px] text-app-muted mt-0.5">{item.from} · {item.dept}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] text-app-muted italic">{item.date}</span>
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
