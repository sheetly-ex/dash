import React from 'react';
import {
  ChevronLeft, Printer, CheckCircle2, Clock, User, MessageSquare,
  XCircle, Paperclip, Download,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Widget from '../../components/ui/Widget';
import Badge, { STATUS_VARIANT } from '../../components/ui/Badge';
import { MetaGrid } from '../../components/ui/MetaRow';
import { useSettings } from '../../contexts/SettingsContext';
import type { TranslationKey } from '../../i18n';
import type { ApprovalRecord, ApprovalStatusKey, LineStatus } from '../../data/approvals';

interface Props {
  item: ApprovalRecord;
  mode: 'received' | 'sent';
  onBack: () => void;
}

const ApprovalDetail: React.FC<Props> = ({ item, mode, onBack }) => {
  const { t } = useSettings();

  const statusLabel = (key: ApprovalStatusKey | LineStatus | 'all') =>
    key === 'all' ? t('status.all' as TranslationKey) : t(`status.${key}` as TranslationKey);

  const canAct = mode === 'received' && (item.status === 'pending' || item.status === 'reviewing');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[12px] font-medium text-app-muted hover:text-blue-600 transition-colors cursor-pointer border-none bg-transparent"
        >
          <ChevronLeft size={15} /> {t('common.back')}
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 bg-surface-elevated border border-app rounded text-[11px] font-medium text-app-muted hover:text-app-secondary transition-all cursor-pointer"
        >
          <Printer size={13} /> {t('common.print')}
        </button>
      </div>

      <div>
        <p className="text-[10px] font-medium text-app-muted uppercase tracking-widest mb-1">{item.type}</p>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h2 className="text-2xl font-medium text-app tracking-tight">{item.title}</h2>
          {item.urgent && <Badge variant="rose">{t('approval.urgent')}</Badge>}
          <Badge variant={STATUS_VARIANT[item.status] ?? 'slate'} size="sm">{statusLabel(item.status)}</Badge>
        </div>
        <p className="text-[13px] text-app-muted">{item.docId} · {item.from} · {item.dept} · {item.date}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <MetaGrid columns={3} items={[
            { label: t('approval.drafter'), value: item.from },
            { label: t('approval.department'), value: item.dept },
            { label: t('approval.draftDate'), value: item.date },
          ]} />

          <Card noPadding className="p-6" hoverable={false}>
            <div className="text-[10px] font-medium text-app-muted uppercase tracking-widest mb-3">{t('approval.contentLabel')}</div>
            <p className="text-[14px] text-app-secondary leading-relaxed whitespace-pre-line">{item.body}</p>
          </Card>

          {item.attachments && item.attachments.length > 0 && (
            <Card noPadding className="p-6" hoverable={false}>
              <div className="text-[10px] font-medium text-app-muted uppercase tracking-widest mb-3">{t('board.attachments')}</div>
              <div className="space-y-2">
                {item.attachments.map(f => (
                  <div key={f.name} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg group cursor-pointer hover:bg-surface-elevated transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <Paperclip size={14} className="text-app-muted shrink-0" />
                      <span className="text-[13px] font-medium text-app-secondary truncate">{f.name}</span>
                      <span className="text-[11px] text-app-muted shrink-0">{f.size}</span>
                    </div>
                    <Download size={14} className="text-app-muted group-hover:text-blue-600 shrink-0" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {canAct && (
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white text-[12px] font-medium rounded-lg hover:bg-blue-700 transition-all cursor-pointer border-none"
              >
                <CheckCircle2 size={16} /> {t('approval.approve')}
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-surface-elevated text-rose-500 text-[12px] font-medium rounded-lg border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <XCircle size={16} /> {t('approval.reject')}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Widget title={t('approval.approvalLine')} color="blue">
            <div className="space-y-4 mt-2">
              {item.line.map((step, idx) => (
                <div key={`${step.name}-${idx}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      step.status === 'approved' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40' :
                      step.status === 'rejected' ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/40' :
                      step.status === 'reviewing' || step.status === 'pending' ? 'bg-blue-50 text-blue-500 dark:bg-blue-950/40' :
                      'bg-surface-muted text-app-muted'
                    }`}>
                      {step.status === 'approved' ? <CheckCircle2 size={16} /> :
                       step.status === 'rejected' ? <XCircle size={16} /> :
                       step.status === 'reviewing' || step.status === 'pending' ? <Clock size={16} /> :
                       <User size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[13px] font-medium text-app-secondary">{step.name}</span>
                          <span className="text-[11px] text-app-muted ml-2">{step.role}</span>
                        </div>
                        <Badge variant={STATUS_VARIANT[step.status] ?? 'slate'} size="xs">{statusLabel(step.status)}</Badge>
                      </div>
                      <div className="text-[10px] text-app-muted mt-0.5">{step.dept}</div>
                      {step.date && <div className="text-[10px] text-app-muted italic mt-0.5">{step.date}</div>}
                      {step.comment && (
                        <div className="mt-2 p-2.5 bg-surface-muted rounded flex items-start gap-2">
                          <MessageSquare size={11} className="text-app-muted shrink-0 mt-0.5" />
                          <span className="text-[11px] text-app-muted">{step.comment}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {idx < item.line.length - 1 && (
                    <div className="ml-4 mt-1 mb-1 h-4 w-px bg-surface-muted" />
                  )}
                </div>
              ))}
            </div>
          </Widget>

          <Widget title={t('approval.processingHistory')} color="slate">
            <div className="space-y-3 mt-2">
              {item.history.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-surface-muted shrink-0 mt-1.5" />
                  <div className="flex-1">
                    <div className="text-[12px] font-medium text-app-secondary">{h.action}</div>
                    <div className="text-[10px] text-app-muted mt-0.5">{h.actor} · {h.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDetail;
