import React, { useState } from 'react';
import { FileText, Send, CheckCircle2, Clock } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';

interface DocType {
  id: string;
  label: string;
  desc: string;
  period: string;
}

const docTypes: DocType[] = [
  { id: 'employment', label: '재직증명서', desc: '현재 재직 중임을 증명하는 서류', period: '즉시 발급' },
  { id: 'career', label: '경력증명서', desc: '업무 경력 및 직위를 증명하는 서류', period: '1~2 영업일' },
  { id: 'income', label: '원천징수영수증', desc: '연간 소득세 납부 현황 서류', period: '1~2 영업일' },
  { id: 'salary', label: '급여명세서', desc: '월 급여 지급 내역 명세서', period: '즉시 발급' },
  { id: 'retirement', label: '퇴직예정증명서', desc: '퇴직 예정 사실을 증명하는 서류', period: '3 영업일' },
  { id: 'health', label: '건강보험료 확인서', desc: '건강보험 가입 및 납부 확인', period: '즉시 발급' },
];

const myHistory = [
  { id: 1, type: '재직증명서', purpose: '은행 제출', date: '2026.05.30', status: '완료' },
  { id: 2, type: '원천징수영수증', purpose: '대출 신청', date: '2026.05.20', status: '완료' },
  { id: 3, type: '경력증명서', purpose: '개인 보관', date: '2026.04.15', status: '완료' },
];

const CertificateRequest: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState('employment');
  const [copies, setCopies] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [language, setLanguage] = useState('한국어');
  const [submitMethod, setSubmitMethod] = useState('출력물 수령');

  const selected = docTypes.find(d => d.id === selectedDoc)!;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Type Selection */}
          <Widget title="발급 서류 선택" color="emerald">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {docTypes.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id)}
                  className={`p-4 rounded border text-left transition-all cursor-pointer ${
                    selectedDoc === doc.id
                      ? 'border-2 border-emerald-400 ring-4 ring-emerald-500/10 bg-[#fafafa]'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-[#fafafa] hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`text-[13px] font-black mb-1 ${selectedDoc === doc.id ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {doc.label}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 leading-snug">{doc.desc}</div>
                    </div>
                    {selectedDoc === doc.id && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 ml-2" />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Clock size={10} className="text-slate-300" />
                    <span className="text-[10px] font-black text-slate-400">{doc.period}</span>
                  </div>
                </button>
              ))}
            </div>
          </Widget>

          {/* Options */}
          <Card noPadding className="p-6 border-slate-100 shadow-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Copies */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">발급 부수</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCopies(Math.max(1, copies - 1))}
                    className="w-9 h-9 rounded border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 font-black cursor-pointer bg-[#fafafa] flex items-center justify-center transition-all">
                    -
                  </button>
                  <span className="text-xl font-black text-slate-800 w-8 text-center">{copies}</span>
                  <button onClick={() => setCopies(copies + 1)}
                    className="w-9 h-9 rounded border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 font-black cursor-pointer bg-[#fafafa] flex items-center justify-center transition-all">
                    +
                  </button>
                  <span className="text-[12px] font-bold text-slate-400">부</span>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">발급 언어</label>
                <div className="flex gap-2">
                  {['한국어', 'English'].map(lang => (
                    <button key={lang} onClick={() => setLanguage(lang)}
                      className={`flex-1 py-2.5 rounded text-[12px] font-black border transition-all cursor-pointer ${
                        language === lang
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                          : 'bg-[#fafafa] text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                      }`}>
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Receive Method */}
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">수령 방법</label>
                <div className="flex gap-2 flex-wrap">
                  {['출력물 수령', '이메일 발송', '공문 발송'].map(method => (
                    <button key={method} onClick={() => setSubmitMethod(method)}
                      className={`px-5 py-2.5 rounded text-[12px] font-black border transition-all cursor-pointer ${
                        submitMethod === method
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : 'bg-[#fafafa] text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                      }`}>
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Purpose */}
          <Card noPadding className="p-6 border-slate-100 shadow-none">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">제출 용도</label>
            <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)}
              placeholder="예) 은행 대출 신청, 비자 발급, 개인 보관 등"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-[#fafafa] transition-all" />
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-emerald-600 text-white text-[12px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer border-none">
              <Send size={16} /> 발급 신청하기
            </button>
            <button className="px-8 py-4 bg-slate-100 text-slate-600 text-[12px] font-black uppercase tracking-widest rounded hover:bg-slate-200 transition-all cursor-pointer border-none">
              취소
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <Card noPadding className="p-6 border-emerald-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">발급 요약</div>
            <div className="space-y-3 mb-6">
              <SummaryRow label="서류 종류" value={selected.label} />
              <SummaryRow label="발급 언어" value={language} />
              <SummaryRow label="발급 부수" value={`${copies}부`} />
              <SummaryRow label="수령 방법" value={submitMethod} />
              <SummaryRow label="예상 소요" value={selected.period} />
            </div>
            <div className="p-3 bg-emerald-50 rounded border border-emerald-100 mb-4">
              <div className="text-[11px] font-black text-emerald-600">
                {submitMethod === '출력물 수령' ? '준비 완료 시 문자 알림 발송' : '신청 후 이메일로 전송됩니다'}
              </div>
            </div>
          </Card>

          {/* History */}
          <Widget title="발급 내역" color="slate">
            <div className="space-y-3 mt-2">
              {myHistory.map(h => (
                <div key={h.id} className="flex items-start justify-between p-3 bg-slate-50 rounded border border-slate-100">
                  <div>
                    <div className="text-[12px] font-black text-slate-700">{h.type}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{h.purpose} · {h.date}</div>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{h.status}</span>
                </div>
              ))}
            </div>
          </Widget>

          {/* Notice */}
          <Card noPadding className="p-5 bg-slate-50 border-slate-100 shadow-none">
            <div className="flex items-start gap-3">
              <FileText size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[12px] font-black text-slate-600 mb-2">발급 안내</div>
                <ul className="space-y-1.5">
                  {['원천징수영수증은 전년도 기준 발급', '영문 서류는 추가 1~2일 소요', '분실 재발급 시 동일 절차로 신청'].map(tip => (
                    <li key={tip} className="text-[11px] font-bold text-slate-400 flex items-start gap-1.5">
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
      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-[13px] font-bold text-slate-700">{value}</span>
    </div>
  );
}

export default CertificateRequest;
