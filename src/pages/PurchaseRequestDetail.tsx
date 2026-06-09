import React from 'react';
import {
  ChevronLeft, Printer, XCircle, CheckCircle2, Clock,
  User, MessageSquare, RotateCcw
} from 'lucide-react';
import Card from '../components/ui/Card';
import Widget from '../components/ui/Widget';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import { MetaGrid } from '../components/ui/MetaRow';
import { currentUser, getApprovalLine } from '../data/user';
import type { SubView } from '../types';

interface Props {
  setCurrentView: (v: SubView) => void;
}

const requestData = {
  id: 'PR-2026-0042',
  title: 'MacBook Pro 16인치 외 2건',
  status: '검토중',
  category: 'IT 장비',
  urgency: '보통',
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
const total = requestData.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

// 금액 기반 자동 결재선 + 처리 상태 부여
const approvalStatuses = ['승인', '검토중', '대기'];
const approvers = getApprovalLine(total).map((a, idx) => ({
  ...a,
  status: approvalStatuses[idx] ?? '대기',
  approvedAt: idx === 0 ? '2026.06.02 10:14' : null,
  comment: idx === 0 ? '업무 필요성 확인. 승인합니다.' : null,
}));

const PurchaseRequestDetail: React.FC<Props> = ({ setCurrentView }) => (
  <div className="space-y-8">
    {/* Top Bar */}
    <div className="flex items-center justify-between">
      <button
        onClick={() => setCurrentView('REQUEST_HOME')}
        className="flex items-center gap-2 text-[12px] font-black text-slate-400 hover:text-blue-600 transition-colors cursor-pointer border-none bg-transparent uppercase tracking-widest"
      >
        <ChevronLeft size={15} /> 목록으로
      </button>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{requestData.id}</span>
        <Badge variant={STATUS_VARIANT[requestData.status] ?? 'slate'} size="sm">{requestData.status}</Badge>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fafafa] border border-slate-200 rounded text-[11px] font-black text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all cursor-pointer">
          <Printer size={13} /> 인쇄
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fafafa] border border-rose-200 rounded text-[11px] font-black text-rose-400 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer">
          <XCircle size={13} /> 취소 요청
        </button>
      </div>
    </div>

    {/* Title */}
    <div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{requestData.title}</h2>
      <p className="text-[13px] font-bold text-slate-400">구매 신청 · {requestData.submittedAt} 상신</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
      {/* Left */}
      <div className="lg:col-span-2 space-y-6">
        {/* Request Info */}
        <MetaGrid columns={4} items={[
          { label: '신청자', value: `${requestData.requester} ${requestData.rank}` },
          { label: '소속',   value: requestData.dept },
          { label: '분류',   value: requestData.category },
          { label: '긴급도', value: requestData.urgency },
        ]} />

        {/* Items Table */}
        <Card noPadding hoverable={false}>
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">구매 품목</span>
            <span className="text-[11px] font-black text-slate-400">{requestData.items.length}종</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  {['품목명', '규격/사양', '수량', '단가', '소계'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requestData.items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-[14px] font-black text-slate-800">{item.name}</td>
                    <td className="px-5 py-4 text-[12px] font-bold text-slate-500">{item.spec}</td>
                    <td className="px-5 py-4 text-[13px] font-black text-slate-700">{item.qty}개</td>
                    <td className="px-5 py-4 text-[13px] font-bold text-slate-600">{fmt(item.unitPrice)}</td>
                    <td className="px-5 py-4 text-[13px] font-black text-blue-600">{fmt(item.unitPrice * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-100 bg-slate-50/50">
                  <td colSpan={4} className="px-5 py-4 text-[12px] font-black text-slate-500 text-right uppercase tracking-widest">합계</td>
                  <td className="px-5 py-4 text-[16px] font-black text-slate-900">{fmt(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Purpose */}
        <Card noPadding className="p-6 border-slate-100 shadow-none" hoverable={false}>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">구매 목적 및 비고</div>
          <p className="text-[14px] font-bold text-slate-700 leading-relaxed">{requestData.purpose}</p>
        </Card>
      </div>

      {/* Right */}
      <div className="space-y-6">
        {/* Approval Flow */}
        <Widget title="결재 현황" color="blue">
          <div className="space-y-4 mt-2">
            {approvers.map((a, idx) => (
              <div key={a.step}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    a.status === '승인' ? 'bg-emerald-50 text-emerald-500' :
                    a.status === '검토중' ? 'bg-blue-50 text-blue-500' :
                    'bg-slate-50 text-slate-300'
                  }`}>
                    {a.status === '승인' ? <CheckCircle2 size={16} /> :
                     a.status === '검토중' ? <Clock size={16} /> :
                     <User size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[13px] font-black text-slate-700">{a.name}</span>
                        <span className="text-[11px] font-bold text-slate-400 ml-2">{a.role}</span>
                      </div>
                      <Badge variant={STATUS_VARIANT[a.status] ?? 'slate'} size="xs">{a.status}</Badge>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{a.dept}</div>
                    {a.approvedAt && (
                      <div className="text-[10px] font-bold text-slate-300 italic mt-0.5">{a.approvedAt}</div>
                    )}
                    {a.comment && (
                      <div className="mt-2 p-2.5 bg-slate-50 rounded border border-slate-100 flex items-start gap-2">
                        <MessageSquare size={11} className="text-slate-300 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-bold text-slate-500">{a.comment}</span>
                      </div>
                    )}
                  </div>
                </div>
                {idx < approvers.length - 1 && (
                  <div className="ml-4 mt-1 mb-1 h-4 w-px bg-slate-100" />
                )}
              </div>
            ))}
          </div>
        </Widget>

        {/* History */}
        <Widget title="처리 이력" color="slate">
          <div className="space-y-3 mt-2">
            {requestData.history.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                <div className="flex-1">
                  <div className="text-[12px] font-black text-slate-700">{h.action}</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">{h.actor} · {h.date}</div>
                </div>
              </div>
            ))}
          </div>
        </Widget>

        {/* Re-apply hint */}
        <button
          onClick={() => setCurrentView('PURCHASE')}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-200 rounded text-[11px] font-black text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all cursor-pointer bg-transparent"
        >
          <RotateCcw size={13} /> 동일 내용으로 재신청
        </button>
      </div>
    </div>
  </div>
);

export default PurchaseRequestDetail;
