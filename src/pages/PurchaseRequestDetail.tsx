import React, { useMemo } from 'react';
import {
  ChevronLeft, Printer, XCircle, CheckCircle2, Clock,
  User, MessageSquare, RotateCcw
} from 'lucide-react';
import Card from '../components/ui/Card';
import Widget from '../components/ui/Widget';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import { MetaGrid } from '../components/ui/MetaRow';
import { currentUser, getApprovalLine } from '../data/user';
import { useSettings } from '../contexts/SettingsContext';
import type { TranslationKey } from '../i18n';
import type { SubView } from '../types';

interface Props {
  setCurrentView: (v: SubView) => void;
}

type StatusKey = 'reviewing' | 'approved' | 'waiting';
type UrgencyKey = 'medium';

const requestData = {
  id: 'PR-2026-0042',
  title: 'MacBook Pro 16인치 외 2건',
  status: 'reviewing' as const,
  category: 'IT 장비',
  urgency: 'medium' as UrgencyKey,
  submittedAt: '2026.06.01',
  requester: currentUser.name,
  dept: currentUser.dept,
  rank: currentUser.rank,
  purpose: '노후 장비(4년 이상) 교체 및 업무 생산성 향상을 위한 신규 장비 도입.',
  items: [
    { id: 1, name: 'MacBook Pro 16인치 (M4 Pro)', spec: 'RAM 48GB / SSD 1TB', qty: 1, unitPrice: 4_200_000 },
    { id: 2, name: '사무용 모니터 27인치', spec: 'LG 27UQ850, 4K UHD', qty: 2, unitPrice: 650_000 },
    { id: 3, name: '매직 키보드 (한글)', spec: 'Touch ID 탑재 / 실버', qty: 1, unitPrice: 159_000 },
  ],
  history: [
    { date: '2026.06.01 14:22', action: '결재 상신', actor: `${currentUser.name} ${currentUser.rank}` },
    { date: '2026.06.02 10:14', action: '1차 결재 승인', actor: '김팀장' },
    { date: '2026.06.02 10:15', action: '2차 결재 요청', actor: '시스템' },
  ],
};

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

const PurchaseRequestDetail: React.FC<Props> = ({ setCurrentView }) => {
  const { t } = useSettings();
  const total = requestData.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  const statusLabel = (key: StatusKey | UrgencyKey | typeof requestData.status) =>
    t(`status.${key}` as TranslationKey);

  const approvalStatuses: StatusKey[] = ['approved', 'reviewing', 'waiting'];
  const approvers = useMemo(
    () => getApprovalLine(total).map((a, idx) => ({
      ...a,
      status: approvalStatuses[idx] ?? 'waiting',
      approvedAt: idx === 0 ? '2026.06.02 10:14' : null,
      comment: idx === 0 ? '업무 필요성 확인. 승인합니다.' : null,
    })),
    [total],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('REQUEST_HOME')}
          className="flex items-center gap-2 text-[12px] font-black text-app-muted hover:text-blue-600 transition-colors cursor-pointer border-none bg-transparent uppercase tracking-widest"
        >
          <ChevronLeft size={15} /> {t('common.back')}
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black text-app-muted uppercase tracking-widest">{requestData.id}</span>
          <Badge variant={STATUS_VARIANT[requestData.status] ?? 'slate'} size="sm">{statusLabel(requestData.status)}</Badge>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-elevated border border-app rounded text-[11px] font-black text-app-muted hover:border-app hover:text-app-secondary transition-all cursor-pointer">
            <Printer size={13} /> {t('common.print')}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-elevated border border-rose-200 rounded text-[11px] font-black text-rose-400 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer">
            <XCircle size={13} /> {t('purchase.cancelRequest')}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-app tracking-tight mb-1">{requestData.title}</h2>
        <p className="text-[13px] font-bold text-app-muted">{t('request.purchaseApply')} · {requestData.submittedAt} {t('purchase.submitted')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <MetaGrid columns={4} items={[
            { label: t('purchase.applicant'), value: `${requestData.requester} ${requestData.rank}` },
            { label: t('purchase.department'), value: requestData.dept },
            { label: t('purchase.category'), value: requestData.category },
            { label: t('purchase.urgency'), value: statusLabel(requestData.urgency) },
          ]} />

          <Card noPadding hoverable={false}>
            <div className="p-5 border-b border-app-muted flex items-center justify-between">
              <span className="text-[11px] font-black text-app-secondary uppercase tracking-widest">{t('purchase.items')}</span>
              <span className="text-[11px] font-black text-app-muted">{requestData.items.length}종</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-app-muted bg-surface-muted/50">
                    {[t('purchase.itemName'), t('purchase.itemSpec'), t('purchase.itemQty'), t('purchase.itemPrice'), t('purchase.totalAmount')].map(h => (
                      <th key={h} className="px-5 py-3 text-[10px] font-black text-app-muted uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requestData.items.map(item => (
                    <tr key={item.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="px-5 py-4 text-[14px] font-black text-app">{item.name}</td>
                      <td className="px-5 py-4 text-[12px] font-bold text-app-muted">{item.spec}</td>
                      <td className="px-5 py-4 text-[13px] font-black text-app-secondary">{item.qty}개</td>
                      <td className="px-5 py-4 text-[13px] font-bold text-app-secondary">{fmt(item.unitPrice)}</td>
                      <td className="px-5 py-4 text-[13px] font-black text-blue-600">{fmt(item.unitPrice * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-app-muted bg-surface-muted/50">
                    <td colSpan={4} className="px-5 py-4 text-[12px] font-black text-app-muted text-right uppercase tracking-widest">{t('purchase.totalAmount')}</td>
                    <td className="px-5 py-4 text-[16px] font-black text-app">{fmt(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          <Card noPadding className="p-6 border-app-muted shadow-none" hoverable={false}>
            <div className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-3">{t('purchase.purpose')}</div>
            <p className="text-[14px] font-bold text-app-secondary leading-relaxed">{requestData.purpose}</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Widget title={t('dashboard.approvalStatus')} color="blue">
            <div className="space-y-4 mt-2">
              {approvers.map((a, idx) => (
                <div key={a.step}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      a.status === 'approved' ? 'bg-emerald-50 text-emerald-500' :
                      a.status === 'reviewing' ? 'bg-blue-50 text-blue-500' :
                      'bg-surface-muted text-app-muted'
                    }`}>
                      {a.status === 'approved' ? <CheckCircle2 size={16} /> :
                       a.status === 'reviewing' ? <Clock size={16} /> :
                       <User size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-black text-app-secondary">{a.name}</span>
                          <span className="text-[11px] font-bold text-app-muted ml-2">{a.role}</span>
                        </div>
                        <Badge variant={STATUS_VARIANT[a.status] ?? 'slate'} size="xs">{statusLabel(a.status)}</Badge>
                      </div>
                      <div className="text-[10px] font-bold text-app-muted mt-0.5">{a.dept}</div>
                      {a.approvedAt && (
                        <div className="text-[10px] font-bold text-app-muted italic mt-0.5">{a.approvedAt}</div>
                      )}
                      {a.comment && (
                        <div className="mt-2 p-2.5 bg-surface-muted rounded border border-app-muted flex items-start gap-2">
                          <MessageSquare size={11} className="text-app-muted shrink-0 mt-0.5" />
                          <span className="text-[11px] font-bold text-app-muted">{a.comment}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {idx < approvers.length - 1 && (
                    <div className="ml-4 mt-1 mb-1 h-4 w-px bg-surface-muted" />
                  )}
                </div>
              ))}
            </div>
          </Widget>

          <Widget title={t('purchase.processingHistory')} color="slate">
            <div className="space-y-3 mt-2">
              {requestData.history.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-surface-muted shrink-0 mt-1.5" />
                  <div className="flex-1">
                    <div className="text-[12px] font-black text-app-secondary">{h.action}</div>
                    <div className="text-[10px] font-bold text-app-muted mt-0.5">{h.actor} · {h.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Widget>

          <button
            onClick={() => setCurrentView('PURCHASE')}
            className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-app rounded text-[11px] font-black text-app-muted hover:border-blue-300 hover:text-blue-500 transition-all cursor-pointer bg-transparent"
          >
            <RotateCcw size={13} /> {t('purchase.reapply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestDetail;
