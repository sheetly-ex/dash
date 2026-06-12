import React from 'react';
import {
  ChevronLeft, Download, Printer, CheckCircle2,
  User, MessageSquare, RotateCcw, FileText
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Widget from '../../components/ui/Widget';
import Badge, { STATUS_VARIANT } from '../../components/ui/Badge';
import { MetaGrid, MetaRow } from '../../components/ui/MetaRow';
import { useSettings } from '../../contexts/SettingsContext';
import type { TranslationKey } from '../../i18n';
import type { SubView } from '../../types';

interface Props {
  setCurrentView: (v: SubView) => void;
}

type ApproverStatusKey = 'approved' | 'completed';

const certData = {
  id: 'CR-2026-0018',
  docType: '재직증명서',
  docTypeDesc: '현재 재직 중임을 증명하는 서류',
  status: 'completed' as const,
  submittedAt: '2026.05.30',
  completedAt: '2026.05.30',
  requester: '홍길동',
  dept: '경영지원팀',
  rank: '과장',
  copies: 2,
  languageIdx: 0,
  submitMethodIdx: 0,
  purpose: '은행 대출 신청',
  issuedBy: '인사총무팀',
  files: [
    { name: '재직증명서_홍길동_20260530.pdf', size: '128 KB' },
  ],
  approvers: [
    { step: 1, name: '김팀장', role: '팀장', dept: '경영지원팀', status: 'approved' as ApproverStatusKey, approvedAt: '2026.05.30 09:44', comment: null },
    { step: 2, name: '이인사', role: '인사담당', dept: '인사총무팀', status: 'completed' as ApproverStatusKey, approvedAt: '2026.05.30 10:02', comment: '출력 후 총무 데스크에서 수령 가능합니다.' },
  ],
  history: [
    { date: '2026.05.30 09:22', action: '발급 신청', actor: '홍길동 과장' },
    { date: '2026.05.30 09:44', action: '팀장 승인', actor: '김팀장' },
    { date: '2026.05.30 10:02', action: '발급 완료', actor: '이인사 (인사총무팀)' },
    { date: '2026.05.30 10:02', action: '수령 안내 문자 발송', actor: '시스템' },
  ],
};

const CertificateRequestDetail: React.FC<Props> = ({ setCurrentView }) => {
  const { t, tArray } = useSettings();
  const languages = tArray('certificate.languages');
  const submitMethods = tArray('certificate.submitMethods');

  const statusLabel = (key: typeof certData.status | ApproverStatusKey) =>
    t(`status.${key}` as TranslationKey);

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
          <span className="text-[11px] font-black text-app-muted uppercase tracking-widest">{certData.id}</span>
          <Badge variant={STATUS_VARIANT[certData.status] ?? 'slate'} size="sm">{statusLabel(certData.status)}</Badge>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-elevated border border-app rounded text-[11px] font-black text-app-muted hover:border-app transition-all cursor-pointer">
            <Printer size={13} /> {t('common.print')}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-app tracking-tight mb-1">{certData.docType}</h2>
        <p className="text-[13px] font-bold text-app-muted">{t('certificate.submit')} · {certData.submittedAt}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <MetaGrid columns={4} items={[
            { label: t('purchase.applicant'), value: `${certData.requester} ${certData.rank}` },
            { label: t('purchase.department'), value: certData.dept },
            { label: t('purchase.applyDate'), value: certData.submittedAt },
            { label: t('status.completed'), value: certData.completedAt },
          ]} />

          <Card noPadding hoverable={false}>
            <div className="p-5 border-b border-app-muted">
              <span className="text-[11px] font-black text-app-secondary uppercase tracking-widest">{t('certificate.issueSpec')}</span>
            </div>
            <div className="p-6 space-y-3">
              <MetaRow label={t('certificate.docType')} value={certData.docType} />
              <MetaRow label={t('certificate.copies')} value={`${certData.copies}부`} />
              <MetaRow label={t('certificate.language')} value={languages[certData.languageIdx] ?? ''} />
              <MetaRow label={t('certificate.submitMethod')} value={submitMethods[certData.submitMethodIdx] ?? ''} />
              <MetaRow label={t('certificate.submitPurpose')} value={certData.purpose} />
              <MetaRow label={t('certificate.issuedBy')} value={certData.issuedBy} />
            </div>
          </Card>

          {certData.status === 'completed' && (
            <Card noPadding hoverable={false} className="border-emerald-100">
              <div className="p-5 border-b border-emerald-50 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">{t('certificate.issuedDocuments')}</span>
              </div>
              <div className="p-4 space-y-2">
                {certData.files.map(f => (
                  <div key={f.name} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded border border-emerald-100 group">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-[13px] font-black text-app-secondary">{f.name}</div>
                        <div className="text-[10px] font-bold text-app-muted">{f.size}</div>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded text-[11px] font-black hover:bg-emerald-700 transition-all cursor-pointer border-none shadow-sm shadow-emerald-500/20">
                      <Download size={13} /> {t('board.download')}
                    </button>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-4 text-[11px] font-bold text-app-muted">
                * 발급 서류는 30일간 다운로드 가능합니다.
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Widget title={t('certificate.processingLine')} color="emerald">
            <div className="space-y-4 mt-2">
              {certData.approvers.map((a, idx) => (
                <div key={a.step}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      a.status === 'approved' || a.status === 'completed' ? 'bg-emerald-50 text-emerald-500' :
                      'bg-surface-muted text-app-muted'
                    }`}>
                      {a.status === 'approved' || a.status === 'completed'
                        ? <CheckCircle2 size={16} />
                        : <User size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-black text-app-secondary">{a.name}</span>
                          <span className="text-[11px] font-bold text-app-muted ml-2">{a.role}</span>
                        </div>
                        <Badge
                          variant={a.status === 'completed' ? 'emerald' : STATUS_VARIANT[a.status] ?? 'slate'}
                          size="xs"
                        >
                          {statusLabel(a.status)}
                        </Badge>
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
                  {idx < certData.approvers.length - 1 && (
                    <div className="ml-4 mt-1 mb-1 h-4 w-px bg-surface-muted" />
                  )}
                </div>
              ))}
            </div>
          </Widget>

          <Widget title={t('certificate.processingHistory')} color="slate">
            <div className="space-y-3 mt-2">
              {certData.history.map((h, i) => (
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
            onClick={() => setCurrentView('CERTIFICATE')}
            className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-app rounded text-[11px] font-black text-app-muted hover:border-emerald-300 hover:text-emerald-500 transition-all cursor-pointer bg-transparent"
          >
            <RotateCcw size={13} /> {t('certificate.reapply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateRequestDetail;
