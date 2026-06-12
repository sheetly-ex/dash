import React, { useState } from 'react';
import { Send, Plus, X, ChevronDown, User, Search } from 'lucide-react';
import { MetaGrid } from '../../components/ui/MetaRow';
import FormSection, { TextField, TextAreaField } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { useSettings } from '../../contexts/SettingsContext';
import { useLocalizedData } from '../../data/localized';

const sampleApprovers = [
  { id: 1, name: '김팀장', dept: '경영지원팀', role: '팀장' },
  { id: 2, name: '이부장', dept: '경영지원팀', role: '부장' },
  { id: 3, name: '박이사', dept: '경영지원본부', role: '이사' },
];

const ApprovalWrite: React.FC = () => {
  const { t, tArray } = useSettings();
  const { user } = useLocalizedData();
  const docTypes = tArray('approval.docTypes');
  const [docType, setDocType] = useState(docTypes[0] ?? '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [approvers, setApprovers] = useState([sampleApprovers[0], sampleApprovers[1]]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const removeApprover = (id: number) => {
    setApprovers(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <MetaGrid items={[
        { label: t('approval.drafter'), value: user.displayName },
        { label: t('approval.department'), value: user.dept },
        { label: t('approval.draftDate'), value: '2026. 06. 04' },
      ]} columns={3} />

      <FormSection label={t('approval.docType')}>
        <div className="relative">
          <button
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 bg-surface-muted border border-app rounded text-sm font-black text-app hover:bg-surface-elevated hover:border-blue-300 transition-all cursor-pointer"
          >
            {docType}
            <ChevronDown size={16} className={`text-app-muted transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTypeDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-app rounded shadow-xl z-10 overflow-hidden">
              {docTypes.map(type => (
                <button
                  key={type}
                  onClick={() => { setDocType(type); setShowTypeDropdown(false); }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer border-none ${docType === type ? 'bg-blue-50 text-blue-600 font-black' : 'text-app-secondary'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      <FormSection
        label={t('approval.approvalLine')}
        action={
          <button className="flex items-center gap-1.5 text-[11px] font-black text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent">
            <Plus size={14} /> {t('approval.addApprover')}
          </button>
        }
      >
        <div className="flex items-center gap-3 flex-wrap">
          {approvers.map((a, idx) => (
            <div key={a.id} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1.5 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-md bg-surface-muted flex items-center justify-center text-app-muted group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <User size={20} />
                  </div>
                  <button
                    onClick={() => removeApprover(a.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-400 hover:bg-rose-500 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer border-none"
                  >
                    <X size={10} />
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-[11px] font-black text-app-secondary">{a.name}</div>
                  <div className="text-[9px] font-bold text-app-muted">{a.role}</div>
                </div>
              </div>
              {idx < approvers.length - 1 && <div className="w-6 h-px bg-surface-muted mb-5" />}
            </div>
          ))}
          <button className="flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent">
            <div className="w-12 h-12 rounded-md border-2 border-dashed border-app flex items-center justify-center text-app-muted hover:border-blue-300 hover:text-blue-400 transition-colors">
              <Search size={18} />
            </div>
            <span className="text-[9px] font-bold text-app-muted">{t('common.search')}</span>
          </button>
        </div>
      </FormSection>

      <TextField label={t('approval.titleLabel')} value={title} onChange={e => setTitle(e.target.value)} placeholder={t('approval.titlePlaceholder')} wrapInCard />

      <TextAreaField label={t('approval.contentLabel')} value={content} onChange={e => setContent(e.target.value)} placeholder={t('approval.contentPlaceholder')} rows={12} showCharCount wrapInCard />

      <div className="flex items-center gap-4">
        <Button fullWidth icon={<Send size={16} />}>{t('approval.submitDraft')}</Button>
        <Button variant="secondary">{t('approval.saveDraft')}</Button>
        <Button variant="outline">{t('common.cancel')}</Button>
      </div>
    </div>
  );
};

export default ApprovalWrite;
