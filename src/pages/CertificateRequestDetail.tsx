import React from 'react';
import {
  ChevronLeft, Download, Printer, CheckCircle2, Clock,
  User, MessageSquare, RotateCcw, FileText
} from 'lucide-react';
import Card from '../components/ui/Card';
import Widget from '../components/ui/Widget';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import { MetaGrid, MetaRow } from '../components/ui/MetaRow';
import type { SubView } from '../types';

interface Props {
  setCurrentView: (v: SubView) => void;
}

const certData = {
  id: 'CR-2026-0018',
  docType: '재직증명서',
  docTypeDesc: '현재 재직 중임을 증명하는 서류',
  status: '완료',
  submittedAt: '2026.05.30',
  completedAt: '2026.05.30',
  requester: '홍길동',
  dept: '경영지원팀',
  rank: '과장',
  copies: 2,
  language: '한국어',
  receiveMethod: '출력물 수령',
  purpose: '은행 대출 신청',
  issuedBy: '인사총무팀',
  files: [
    { name: '재직증명서_홍길동_20260530.pdf', size: '128 KB' },
  ],
  approvers: [
    { step: 1, name: '김팀장', role: '팀장', dept: '경영지원팀', status: '승인', approvedAt: '2026.05.30 09:44', comment: null },
    { step: 2, name: '이인사', role: '인사담당', dept: '인사총무팀', status: '발급완료', approvedAt: '2026.05.30 10:02', comment: '출력 후 총무 데스크에서 수령 가능합니다.' },
  ],
  history: [
    { date: '2026.05.30 09:22', action: '발급 신청', actor: '홍길동 과장' },
    { date: '2026.05.30 09:44', action: '팀장 승인', actor: '김팀장' },
    { date: '2026.05.30 10:02', action: '발급 완료', actor: '이인사 (인사총무팀)' },
    { date: '2026.05.30 10:02', action: '수령 안내 문자 발송', actor: '시스템' },
  ],
};

const CertificateRequestDetail: React.FC<Props> = ({ setCurrentView }) => (
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
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{certData.id}</span>
        <Badge variant={STATUS_VARIANT[certData.status] ?? 'slate'} size="sm">{certData.status}</Badge>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fafafa] border border-slate-200 rounded text-[11px] font-black text-slate-500 hover:border-slate-300 transition-all cursor-pointer">
          <Printer size={13} /> 인쇄
        </button>
      </div>
    </div>

    {/* Title */}
    <div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{certData.docType}</h2>
      <p className="text-[13px] font-bold text-slate-400">서류 발급 신청 · {certData.submittedAt} 신청</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
      {/* Left */}
      <div className="lg:col-span-2 space-y-6">
        {/* Request Info */}
        <MetaGrid columns={4} items={[
          { label: '신청자',   value: `${certData.requester} ${certData.rank}` },
          { label: '소속',     value: certData.dept },
          { label: '신청일',   value: certData.submittedAt },
          { label: '완료일',   value: certData.completedAt },
        ]} />

        {/* Document Spec */}
        <Card noPadding hoverable={false}>
          <div className="p-5 border-b border-slate-50">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">발급 명세</span>
          </div>
          <div className="p-6 space-y-3">
            <MetaRow label="서류 종류"  value={certData.docType} />
            <MetaRow label="발급 부수"  value={`${certData.copies}부`} />
            <MetaRow label="언어"       value={certData.language} />
            <MetaRow label="수령 방법"  value={certData.receiveMethod} />
            <MetaRow label="제출 용도"  value={certData.purpose} />
            <MetaRow label="발급 부서"  value={certData.issuedBy} />
          </div>
        </Card>

        {/* Issued File */}
        {certData.status === '완료' && (
          <Card noPadding hoverable={false} className="border-emerald-100">
            <div className="p-5 border-b border-emerald-50 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">발급 완료 서류</span>
            </div>
            <div className="p-4 space-y-2">
              {certData.files.map(f => (
                <div key={f.name} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded border border-emerald-100 group">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[13px] font-black text-slate-700">{f.name}</div>
                      <div className="text-[10px] font-bold text-slate-400">{f.size}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded text-[11px] font-black hover:bg-emerald-700 transition-all cursor-pointer border-none shadow-sm shadow-emerald-500/20">
                    <Download size={13} /> 다운로드
                  </button>
                </div>
              ))}
            </div>
            <div className="px-5 pb-4 text-[11px] font-bold text-slate-400">
              * 발급 서류는 30일간 다운로드 가능합니다.
            </div>
          </Card>
        )}
      </div>

      {/* Right */}
      <div className="space-y-6">
        {/* Approval Flow */}
        <Widget title="처리 결재선" color="emerald">
          <div className="space-y-4 mt-2">
            {certData.approvers.map((a, idx) => (
              <div key={a.step}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    a.status === '승인' || a.status === '발급완료' ? 'bg-emerald-50 text-emerald-500' :
                    a.status === '검토중' ? 'bg-blue-50 text-blue-500' :
                    'bg-slate-50 text-slate-300'
                  }`}>
                    {a.status === '승인' || a.status === '발급완료'
                      ? <CheckCircle2 size={16} />
                      : a.status === '검토중' ? <Clock size={16} />
                      : <User size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[13px] font-black text-slate-700">{a.name}</span>
                        <span className="text-[11px] font-bold text-slate-400 ml-2">{a.role}</span>
                      </div>
                      <Badge variant={a.status === '발급완료' ? 'emerald' : STATUS_VARIANT[a.status] ?? 'slate'} size="xs">
                        {a.status}
                      </Badge>
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
                {idx < certData.approvers.length - 1 && (
                  <div className="ml-4 mt-1 mb-1 h-4 w-px bg-slate-100" />
                )}
              </div>
            ))}
          </div>
        </Widget>

        {/* History */}
        <Widget title="처리 이력" color="slate">
          <div className="space-y-3 mt-2">
            {certData.history.map((h, i) => (
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

        <button
          onClick={() => setCurrentView('CERTIFICATE')}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-200 rounded text-[11px] font-black text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition-all cursor-pointer bg-transparent"
        >
          <RotateCcw size={13} /> 동일 서류 재신청
        </button>
      </div>
    </div>
  </div>
);

export default CertificateRequestDetail;
