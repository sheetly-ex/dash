import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Send, ShoppingCart, ChevronDown, ChevronRight, User, X, Search } from 'lucide-react';
import Widget from '../components/ui/Widget';
import { MetaGrid } from '../components/ui/MetaRow';
import FormSection, { FormLabel, TextAreaField } from '../components/ui/FormField';
import Button from '../components/ui/Button';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import Callout from '../components/ui/Callout';
import { currentUser, getApprovalLine } from '../data/user';
import { useSettings } from '../contexts/SettingsContext';
import type { TranslationKey } from '../i18n';

interface Item {
  id: number;
  name: string;
  spec: string;
  qty: number;
  price: string;
  reason: string;
}

interface ExtraApprover {
  id: number;
  name: string;
  role: string;
}

const SEARCH_CANDIDATES = [
  { name: '최대리', role: '대리' },
  { name: '정과장', role: '과장' },
  { name: '윤차장', role: '차장' },
  { name: '강본부장', role: '본부장' },
  { name: '한전무', role: '전무' },
];

const URGENCY_KEYS = ['normal', 'medium', 'urgent'] as const;
type UrgencyKey = (typeof URGENCY_KEYS)[number];
type RequestStatusKey = 'reviewing' | 'approved' | 'completed';

const myRequests: { id: number; title: string; date: string; status: RequestStatusKey }[] = [
  { id: 1, title: 'MacBook Pro 16인치 외 2건', date: '2026.06.01', status: 'reviewing' },
  { id: 2, title: '허먼밀러 에어론 의자', date: '2026.05.28', status: 'approved' },
  { id: 3, title: 'JetBrains All Products Pack', date: '2026.05.20', status: 'completed' },
];

const PurchaseRequest: React.FC = () => {
  const { t, tArray } = useSettings();
  const categories = tArray('purchase.categories');
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [urgency, setUrgency] = useState<UrgencyKey>('normal');
  const [purpose, setPurpose] = useState('');
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: '', spec: '', qty: 1, price: '', reason: '' },
  ]);
  const totalAmount = useMemo(
    () => items.reduce((s, i) => s + (parseFloat(i.price.replace(/,/g, '')) || 0) * i.qty, 0),
    [items],
  );
  const baseApprovers = useMemo(() => getApprovalLine(totalAmount), [totalAmount]);
  const [extraApprovers, setExtraApprovers] = useState<ExtraApprover[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const statusLabel = (key: RequestStatusKey | UrgencyKey) => t(`status.${key}` as TranslationKey);

  const filtered = SEARCH_CANDIDATES.filter(
    c => !extraApprovers.some(e => e.name === c.name) &&
         (c.name.includes(searchQuery) || c.role.includes(searchQuery)),
  );

  const addExtraApprover = (c: { name: string; role: string }) => {
    setExtraApprovers(prev => [...prev, { id: Date.now(), ...c }]);
    setSearchQuery('');
    setShowSearch(false);
  };

  const removeExtraApprover = (id: number) => {
    setExtraApprovers(prev => prev.filter(a => a.id !== id));
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now(), name: '', spec: '', qty: 1, price: '', reason: '' }]);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: number, field: keyof Item, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <MetaGrid items={[
            { label: t('purchase.applicant'), value: `${currentUser.name} ${currentUser.rank}` },
            { label: t('purchase.department'), value: currentUser.dept },
            { label: t('purchase.applyDate'), value: '2026. 06. 08' },
          ]} columns={3} />

          <FormSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <FormLabel>{t('purchase.category')}</FormLabel>
                <div className="relative">
                  <button
                    onClick={() => setShowCatDrop(!showCatDrop)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-surface-muted border border-app rounded text-sm font-black text-app hover:bg-surface-elevated hover:border-blue-300 transition-all cursor-pointer"
                  >
                    {categories[categoryIdx]}
                    <ChevronDown size={16} className={`text-app-muted transition-transform ${showCatDrop ? 'rotate-180' : ''}`} />
                  </button>
                  {showCatDrop && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-app rounded shadow-xl z-10 overflow-hidden">
                      {categories.map((c, idx) => (
                        <button key={idx} onClick={() => { setCategoryIdx(idx); setShowCatDrop(false); }}
                          className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer border-none ${categoryIdx === idx ? 'bg-blue-50 text-blue-600 font-black' : 'text-app-secondary'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <FormLabel>{t('purchase.urgency')}</FormLabel>
                <div className="flex gap-2">
                  {URGENCY_KEYS.map(key => (
                    <button key={key} onClick={() => setUrgency(key)}
                      className={`flex-1 py-3 rounded text-[12px] font-black transition-all cursor-pointer border ${
                        urgency === key
                          ? key === 'urgent' ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                            : key === 'medium' ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-surface-elevated text-white border-app'
                          : 'bg-surface-elevated text-app-muted border-app hover:border-app'
                      }`}>
                      {statusLabel(key)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FormSection>

          <Widget title={t('purchase.items')} color="blue">
            <div className="space-y-4 mt-2">
              {items.map((item, idx) => (
                <div key={item.id} className="p-5 bg-surface-muted rounded border border-app-muted">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black text-app-muted uppercase tracking-widest">{t('purchase.items')} {idx + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-app-muted hover:text-rose-400 transition-colors cursor-pointer border-none bg-transparent">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder={t('purchase.itemName')} value={item.name}
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                      className="px-3 py-2.5 bg-surface-elevated border border-app rounded text-[13px] font-bold text-app placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                    <input type="text" placeholder={t('purchase.itemSpec')} value={item.spec}
                      onChange={e => updateItem(item.id, 'spec', e.target.value)}
                      className="px-3 py-2.5 bg-surface-elevated border border-app rounded text-[13px] font-bold text-app placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                    <input type="number" placeholder={t('purchase.itemQty')} min={1} value={item.qty}
                      onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
                      className="px-3 py-2.5 bg-surface-elevated border border-app rounded text-[13px] font-bold text-app placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                    <input type="text" placeholder={t('purchase.itemPrice')} value={item.price}
                      onChange={e => updateItem(item.id, 'price', e.target.value)}
                      className="px-3 py-2.5 bg-surface-elevated border border-app rounded text-[13px] font-bold text-app placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                    <input type="text" placeholder={t('purchase.itemReason')} value={item.reason}
                      onChange={e => updateItem(item.id, 'reason', e.target.value)}
                      className="col-span-2 px-3 py-2.5 bg-surface-elevated border border-app rounded text-[13px] font-bold text-app placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                  </div>
                </div>
              ))}
              <button onClick={addItem}
                className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-app rounded text-[12px] font-black text-app-muted hover:border-blue-300 hover:text-blue-500 transition-all cursor-pointer bg-transparent">
                <Plus size={14} /> {t('purchase.addItem')}
              </button>
            </div>
          </Widget>

          <TextAreaField label={t('purchase.purpose')} value={purpose} onChange={e => setPurpose(e.target.value)} rows={4} placeholder={t('purchase.purposePlaceholder')} wrapInCard />

          <div className="bg-surface-elevated border border-app-muted rounded-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[11px] font-black text-app-secondary uppercase tracking-widest">{t('purchase.approvalLine')}</span>
                <span className="ml-2 text-[10px] font-bold text-app-muted">직급·소속 기준 자동 배정</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSearch(s => !s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-app-muted hover:text-app-secondary border border-app hover:border-app rounded-lg bg-surface-elevated cursor-pointer transition-all"
                >
                  <Plus size={12} /> {t('purchase.addApprover')}
                </button>

                {showSearch && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-surface-elevated border border-app rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-app-muted">
                      <Search size={13} className="text-app-muted shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        placeholder={t('purchase.search')}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="flex-1 text-[12px] font-bold text-app-secondary bg-transparent border-none outline-none placeholder:text-app-muted"
                      />
                    </div>
                    <ul className="max-h-44 overflow-y-auto py-1">
                      {filtered.length === 0 && (
                        <li className="px-4 py-3 text-[11px] font-bold text-app-muted">{t('common.noResults')}</li>
                      )}
                      {filtered.map(c => (
                        <li key={c.name}>
                          <button
                            onClick={() => addExtraApprover(c)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-muted cursor-pointer border-none bg-transparent text-left transition-colors"
                          >
                            <div className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center shrink-0">
                              <User size={13} className="text-app-muted" />
                            </div>
                            <div>
                              <div className="text-[12px] font-black text-app-secondary">{c.name}</div>
                              <div className="text-[10px] font-bold text-app-muted">{c.role}</div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-1">
              {baseApprovers.map((a, idx) => (
                <React.Fragment key={a.step}>
                  <div className="flex items-center gap-2 px-3 py-2 border border-app rounded-lg bg-surface-elevated shrink-0">
                    <div className="w-6 h-6 bg-surface-muted rounded-full flex items-center justify-center shrink-0">
                      <User size={12} className="text-app-muted" />
                    </div>
                    <div>
                      <div className="text-[12px] font-black text-app-secondary leading-tight">{a.name}</div>
                      <div className="text-[9px] font-bold text-app-muted">{a.role}</div>
                    </div>
                  </div>
                  {(idx < baseApprovers.length - 1 || extraApprovers.length > 0) && (
                    <ChevronRight size={13} className="text-app-muted shrink-0" />
                  )}
                </React.Fragment>
              ))}

              {extraApprovers.map((a, idx) => (
                <React.Fragment key={a.id}>
                  <div className="flex items-center gap-2 pl-3 pr-1.5 py-2 border border-blue-200 bg-blue-50 rounded-lg shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <User size={12} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[12px] font-black text-app-secondary leading-tight">{a.name}</div>
                      <div className="text-[9px] font-bold text-app-muted">{a.role}</div>
                    </div>
                    <button
                      onClick={() => removeExtraApprover(a.id)}
                      className="ml-1 p-0.5 rounded text-blue-300 hover:text-rose-400 hover:bg-rose-50 cursor-pointer border-none bg-transparent transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  {idx < extraApprovers.length - 1 && (
                    <ChevronRight size={13} className="text-app-muted shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {totalAmount > 0 && (
              <p className="mt-4 text-[10px] font-bold text-app-muted">
                {totalAmount >= 1_000_000 ? '100만원 이상 — 이사 결재 포함' :
                 totalAmount >= 500_000  ? '50만원 이상 — 부장 결재 포함' :
                 '기본 결재선'}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Button fullWidth icon={<Send size={16} />}>{t('purchase.submit')}</Button>
            <Button variant="secondary">{t('approval.saveDraft')}</Button>
          </div>
        </div>

        <div className="space-y-6">
          <Widget title={t('purchase.myRequests')} color="slate">
            <div className="space-y-3 mt-2">
              {myRequests.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-surface-muted rounded border border-app-muted hover:bg-surface-elevated transition-all cursor-pointer group">
                  <div>
                    <div className="text-[12px] font-black text-app-secondary group-hover:text-blue-600 transition-colors">{r.title}</div>
                    <div className="text-[10px] font-bold text-app-muted italic mt-0.5">{r.date}</div>
                  </div>
                  <Badge variant={STATUS_VARIANT[r.status] ?? 'slate'}>{statusLabel(r.status)}</Badge>
                </div>
              ))}
            </div>
          </Widget>

          <Callout
            variant="info"
            icon={<ShoppingCart size={16} />}
            title="구매 신청 가이드"
            items={['50만원 이상은 팀장 결재 필요', '100만원 이상은 본부장 결재', '수입품은 구매팀 사전 협의 필수']}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequest;
