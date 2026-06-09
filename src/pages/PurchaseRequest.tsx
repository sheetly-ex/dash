import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Send, ShoppingCart, ChevronDown, ChevronRight, User, X, Search } from 'lucide-react';
import Widget from '../components/ui/Widget';
import { MetaGrid } from '../components/ui/MetaRow';
import FormSection, { FormLabel, TextAreaField } from '../components/ui/FormField';
import Button from '../components/ui/Button';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import Callout from '../components/ui/Callout';
import { currentUser, getApprovalLine } from '../data/user';

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


const categories = ['IT 장비', '소프트웨어/라이선스', '사무용품', '가구/인테리어', '교육/도서', '기타'];

const myRequests = [
  { id: 1, title: 'MacBook Pro 16인치 외 2건', date: '2026.06.01', status: '검토중' },
  { id: 2, title: '허먼밀러 에어론 의자', date: '2026.05.28', status: '승인완료' },
  { id: 3, title: 'JetBrains All Products Pack', date: '2026.05.20', status: '완료' },
];


const PurchaseRequest: React.FC = () => {
  const [category, setCategory] = useState('IT 장비');
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [urgency, setUrgency] = useState('일반');
  const [purpose, setPurpose] = useState('');
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: '', spec: '', qty: 1, price: '', reason: '' }
  ]);
  const totalAmount = useMemo(
    () => items.reduce((s, i) => s + (parseFloat(i.price.replace(/,/g, '')) || 0) * i.qty, 0),
    [items]
  );
  const baseApprovers = useMemo(() => getApprovalLine(totalAmount), [totalAmount]);
  const [extraApprovers, setExtraApprovers] = useState<ExtraApprover[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = SEARCH_CANDIDATES.filter(
    c => !extraApprovers.some(e => e.name === c.name) &&
         (c.name.includes(searchQuery) || c.role.includes(searchQuery))
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
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <MetaGrid items={[
            { label: '신청자', value: `${currentUser.name} ${currentUser.rank}` },
            { label: '소속',   value: currentUser.dept },
            { label: '신청일', value: '2026. 06. 08' },
          ]} columns={3} />

          {/* Category & Urgency */}
          <FormSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <FormLabel>구매 분류</FormLabel>
                <div className="relative">
                  <button
                    onClick={() => setShowCatDrop(!showCatDrop)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm font-black text-slate-800 hover:bg-[#fafafa] hover:border-blue-300 transition-all cursor-pointer"
                  >
                    {category}
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${showCatDrop ? 'rotate-180' : ''}`} />
                  </button>
                  {showCatDrop && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#fafafa] border border-slate-200 rounded shadow-xl z-10 overflow-hidden">
                      {categories.map(c => (
                        <button key={c} onClick={() => { setCategory(c); setShowCatDrop(false); }}
                          className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer border-none ${category === c ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-700'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <FormLabel>긴급도</FormLabel>
                <div className="flex gap-2">
                  {['일반', '보통', '긴급'].map(u => (
                    <button key={u} onClick={() => setUrgency(u)}
                      className={`flex-1 py-3 rounded text-[12px] font-black transition-all cursor-pointer border ${
                        urgency === u
                          ? u === '긴급' ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                            : u === '보통' ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-slate-700 text-white border-slate-700'
                          : 'bg-[#fafafa] text-slate-400 border-slate-200 hover:border-slate-300'
                      }`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FormSection>

          {/* Items */}
          <Widget title="구매 품목" color="blue">
            <div className="space-y-4 mt-2">
              {items.map((item, idx) => (
                <div key={item.id} className="p-5 bg-slate-50 rounded border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">품목 {idx + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-400 transition-colors cursor-pointer border-none bg-transparent">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="품목명" value={item.name}
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                      className="px-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded text-[13px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                    <input type="text" placeholder="규격/사양" value={item.spec}
                      onChange={e => updateItem(item.id, 'spec', e.target.value)}
                      className="px-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded text-[13px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                    <input type="number" placeholder="수량" min={1} value={item.qty}
                      onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
                      className="px-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded text-[13px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                    <input type="text" placeholder="예상 단가 (원)" value={item.price}
                      onChange={e => updateItem(item.id, 'price', e.target.value)}
                      className="px-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded text-[13px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                    <input type="text" placeholder="구매 사유" value={item.reason}
                      onChange={e => updateItem(item.id, 'reason', e.target.value)}
                      className="col-span-2 px-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded text-[13px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all" />
                  </div>
                </div>
              ))}
              <button onClick={addItem}
                className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded text-[12px] font-black text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all cursor-pointer bg-transparent">
                <Plus size={14} /> 품목 추가
              </button>
            </div>
          </Widget>

          <TextAreaField label="구매 목적 및 비고" value={purpose} onChange={e => setPurpose(e.target.value)} rows={4} placeholder="구매가 필요한 이유와 기타 특이사항을 입력해 주세요." wrapInCard />

          {/* 결재선 */}
          <div className="bg-[#fafafa] border border-slate-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">결재선</span>
                <span className="ml-2 text-[10px] font-bold text-slate-400">직급·소속 기준 자동 배정</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSearch(s => !s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg bg-[#fafafa] cursor-pointer transition-all"
                >
                  <Plus size={12} /> 결재자 추가
                </button>

                {/* 검색 드롭다운 */}
                {showSearch && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#fafafa] border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100">
                      <Search size={13} className="text-slate-300 shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="이름 또는 직급 검색"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="flex-1 text-[12px] font-bold text-slate-700 bg-transparent border-none outline-none placeholder:text-slate-300"
                      />
                    </div>
                    <ul className="max-h-44 overflow-y-auto py-1">
                      {filtered.length === 0 && (
                        <li className="px-4 py-3 text-[11px] font-bold text-slate-300">검색 결과 없음</li>
                      )}
                      {filtered.map(c => (
                        <li key={c.name}>
                          <button
                            onClick={() => addExtraApprover(c)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-none bg-transparent text-left transition-colors"
                          >
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <User size={13} className="text-slate-400" />
                            </div>
                            <div>
                              <div className="text-[12px] font-black text-slate-700">{c.name}</div>
                              <div className="text-[10px] font-bold text-slate-400">{c.role}</div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 결재자 카드 목록 */}
            <div className="flex items-center flex-wrap gap-1">
              {/* 자동 배정 결재자 — X 없음 */}
              {baseApprovers.map((a, idx) => (
                <React.Fragment key={a.step}>
                  <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-[#fafafa] shrink-0">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <User size={12} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-[12px] font-black text-slate-700 leading-tight">{a.name}</div>
                      <div className="text-[9px] font-bold text-slate-400">{a.role}</div>
                    </div>
                  </div>
                  {(idx < baseApprovers.length - 1 || extraApprovers.length > 0) && (
                    <ChevronRight size={13} className="text-slate-300 shrink-0" />
                  )}
                </React.Fragment>
              ))}

              {/* 추가 결재자 — X 있음 */}
              {extraApprovers.map((a, idx) => (
                <React.Fragment key={a.id}>
                  <div className="flex items-center gap-2 pl-3 pr-1.5 py-2 border border-blue-200 bg-blue-50 rounded-lg shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <User size={12} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[12px] font-black text-slate-700 leading-tight">{a.name}</div>
                      <div className="text-[9px] font-bold text-slate-400">{a.role}</div>
                    </div>
                    <button
                      onClick={() => removeExtraApprover(a.id)}
                      className="ml-1 p-0.5 rounded text-blue-300 hover:text-rose-400 hover:bg-rose-50 cursor-pointer border-none bg-transparent transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  {idx < extraApprovers.length - 1 && (
                    <ChevronRight size={13} className="text-slate-300 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {totalAmount > 0 && (
              <p className="mt-4 text-[10px] font-bold text-slate-300">
                {totalAmount >= 1_000_000 ? '100만원 이상 — 이사 결재 포함' :
                 totalAmount >= 500_000  ? '50만원 이상 — 부장 결재 포함' :
                 '기본 결재선'}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Button fullWidth icon={<Send size={16} />}>구매 신청하기</Button>
            <Button variant="secondary">임시저장</Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Widget title="최근 신청 내역" color="slate">
            <div className="space-y-3 mt-2">
              {myRequests.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100 hover:bg-[#fafafa] transition-all cursor-pointer group">
                  <div>
                    <div className="text-[12px] font-black text-slate-700 group-hover:text-blue-600 transition-colors">{r.title}</div>
                    <div className="text-[10px] font-bold text-slate-400 italic mt-0.5">{r.date}</div>
                  </div>
                  <Badge variant={STATUS_VARIANT[r.status] ?? 'slate'}>{r.status}</Badge>
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
