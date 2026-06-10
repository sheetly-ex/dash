import React, { useState } from 'react';
import { FileText, Send, CheckCircle2, Clock } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import { useSettings } from '../contexts/SettingsContext';
import type { TranslationKey } from '../i18n';

const DOC_IDS = ['employment', 'career', 'income', 'salary', 'retirement', 'health'] as const;
type DocId = (typeof DOC_IDS)[number];

const myHistory = [
  { id: 1, type: '재직증명서', purpose: '은행 제출', date: '2026.05.30', status: 'completed' as const },
  { id: 2, type: '원천징수영수증', purpose: '대출 신청', date: '2026.05.20', status: 'completed' as const },
  { id: 3, type: '경력증명서', purpose: '개인 보관', date: '2026.04.15', status: 'completed' as const },
];

const CertificateRequest: React.FC = () => {
  const { t, tArray } = useSettings();
  const languages = tArray('certificate.languages');
  const submitMethods = tArray('certificate.submitMethods');

  const [selectedDoc, setSelectedDoc] = useState<DocId>('employment');
  const [copies, setCopies] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [languageIdx, setLanguageIdx] = useState(0);
  const [submitMethodIdx, setSubmitMethodIdx] = useState(0);

  const docLabel = (id: DocId) => t(`certificate.docs.${id}.label` as TranslationKey);
  const docDesc = (id: DocId) => t(`certificate.docs.${id}.desc` as TranslationKey);
  const docPeriod = (id: DocId) => t(`certificate.docs.${id}.period` as TranslationKey);
  const statusLabel = (key: 'completed') => t(`status.${key}` as TranslationKey);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <Widget title={t('certificate.selectDoc')} color="emerald">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {DOC_IDS.map(id => (
                <button
                  key={id}
                  onClick={() => setSelectedDoc(id)}
                  className={`p-4 rounded border text-left transition-all cursor-pointer ${
                    selectedDoc === id
                      ? 'border-2 border-emerald-400 ring-4 ring-emerald-500/10 bg-surface-elevated'
                      : 'border-app-muted bg-surface-muted/50 hover:bg-surface-elevated hover:border-app'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`text-[13px] font-black mb-1 ${selectedDoc === id ? 'text-emerald-600' : 'text-app-secondary'}`}>
                        {docLabel(id)}
                      </div>
                      <div className="text-[11px] font-bold text-app-muted leading-snug">{docDesc(id)}</div>
                    </div>
                    {selectedDoc === id && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 ml-2" />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Clock size={10} className="text-app-muted" />
                    <span className="text-[10px] font-black text-app-muted">{docPeriod(id)}</span>
                  </div>
                </button>
              ))}
            </div>
          </Widget>

          <Card noPadding className="p-6 border-app-muted shadow-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block mb-3">{t('certificate.copies')}</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCopies(Math.max(1, copies - 1))}
                    className="w-9 h-9 rounded border border-app text-app-muted hover:border-blue-300 hover:text-blue-600 font-black cursor-pointer bg-surface-elevated flex items-center justify-center transition-all">
                    -
                  </button>
                  <span className="text-xl font-black text-app w-8 text-center">{copies}</span>
                  <button onClick={() => setCopies(copies + 1)}
                    className="w-9 h-9 rounded border border-app text-app-muted hover:border-blue-300 hover:text-blue-600 font-black cursor-pointer bg-surface-elevated flex items-center justify-center transition-all">
                    +
                  </button>
                  <span className="text-[12px] font-bold text-app-muted">부</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block mb-3">{t('certificate.language')}</label>
                <div className="flex gap-2">
                  {languages.map((lang, idx) => (
                    <button key={idx} onClick={() => setLanguageIdx(idx)}
                      className={`flex-1 py-2.5 rounded text-[12px] font-black border transition-all cursor-pointer ${
                        languageIdx === idx
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                          : 'bg-surface-elevated text-app-muted border-app hover:border-emerald-300 hover:text-emerald-600'
                      }`}>
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block mb-3">{t('certificate.submitMethod')}</label>
                <div className="flex gap-2 flex-wrap">
                  {submitMethods.map((method, idx) => (
                    <button key={idx} onClick={() => setSubmitMethodIdx(idx)}
                      className={`px-5 py-2.5 rounded text-[12px] font-black border transition-all cursor-pointer ${
                        submitMethodIdx === idx
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : 'bg-surface-elevated text-app-muted border-app hover:border-blue-300 hover:text-blue-600'
                      }`}>
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card noPadding className="p-6 border-app-muted shadow-none">
            <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block mb-3">{t('certificate.submitPurpose')}</label>
            <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)}
              placeholder={t('certificate.purposePlaceholder')}
              className="w-full px-4 py-3 bg-surface-muted border border-app rounded text-sm font-bold text-app placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-surface-elevated transition-all" />
          </Card>

          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-emerald-600 text-white text-[12px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer border-none">
              <Send size={16} /> {t('certificate.submit')}
            </button>
            <button className="px-8 py-4 bg-surface-muted text-app-secondary text-[12px] font-black uppercase tracking-widest rounded hover:bg-surface-muted transition-all cursor-pointer border-none">
              {t('common.cancel')}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <Card noPadding className="p-6 border-emerald-100">
            <div className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-4">{t('certificate.issueSummary')}</div>
            <div className="space-y-3 mb-6">
              <SummaryRow label={t('certificate.docType')} value={docLabel(selectedDoc)} />
              <SummaryRow label={t('certificate.language')} value={languages[languageIdx] ?? ''} />
              <SummaryRow label={t('certificate.copies')} value={`${copies}부`} />
              <SummaryRow label={t('certificate.submitMethod')} value={submitMethods[submitMethodIdx] ?? ''} />
              <SummaryRow label={t('certificate.issueSpec')} value={docPeriod(selectedDoc)} />
            </div>
            <div className="p-3 bg-emerald-50 rounded border border-emerald-100 mb-4">
              <div className="text-[11px] font-black text-emerald-600">
                {submitMethodIdx === 0 ? t('certificate.smsNotify') : t('certificate.emailNotify')}
              </div>
            </div>
          </Card>

          <Widget title={t('certificate.myHistory')} color="slate">
            <div className="space-y-3 mt-2">
              {myHistory.map(h => (
                <div key={h.id} className="flex items-start justify-between p-3 bg-surface-muted rounded border border-app-muted">
                  <div>
                    <div className="text-[12px] font-black text-app-secondary">{h.type}</div>
                    <div className="text-[10px] font-bold text-app-muted mt-0.5">{h.purpose} · {h.date}</div>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{statusLabel(h.status)}</span>
                </div>
              ))}
            </div>
          </Widget>

          <Card noPadding className="p-5 bg-surface-muted border-app-muted shadow-none">
            <div className="flex items-start gap-3">
              <FileText size={16} className="text-app-muted shrink-0 mt-0.5" />
              <div>
                <div className="text-[12px] font-black text-app-secondary mb-2">{t('certificate.issueGuide')}</div>
                <ul className="space-y-1.5">
                  {tArray('certificate.guideTips').map(tip => (
                    <li key={tip} className="text-[11px] font-bold text-app-muted flex items-start gap-1.5">
                      <span className="shrink-0">·</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-black text-app-muted uppercase tracking-widest">{label}</span>
      <span className="text-[13px] font-bold text-app-secondary">{value}</span>
    </div>
  );
}

export default CertificateRequest;
