import React, { useState } from 'react';
import { Send, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Widget from '../components/ui/Widget';

const vacationTypes = [
  { id: 'annual', label: '연차', unit: '일', deduct: true, desc: '연간 부여된 연차 사용' },
  { id: 'half_am', label: '오전 반차', unit: '0.5일', deduct: true, desc: '오전 근무 후 퇴근 (오후 불출근)' },
  { id: 'half_pm', label: '오후 반차', unit: '0.5일', deduct: true, desc: '오전 근무 후 오후 휴가' },
  { id: 'sick', label: '병가', unit: '일', deduct: false, desc: '질병·부상으로 인한 휴가 (증빙 필요)' },
  { id: 'family', label: '경조 휴가', unit: '일', deduct: false, desc: '경조사 발생 시 부여 (관련 서류 첨부)' },
  { id: 'special', label: '특별 휴가', unit: '일', deduct: false, desc: '회사 지정 특별 휴가' },
];

// June 2026 calendar helpers
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const JUNE_FIRST_DAY = 1; // Monday
const JUNE_TOTAL = 30;
const WEEKENDS = new Set([1, 7, 8, 14, 15, 21, 22, 28, 29]);

const VacationRequest: React.FC = () => {
  const [selectedType, setSelectedType] = useState('annual');
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [reason, setReason] = useState('');
  const [handover, setHandover] = useState('');

  const type = vacationTypes.find(t => t.id === selectedType)!;
  const isHalfDay = selectedType === 'half_am' || selectedType === 'half_pm';

  const calcDays = () => {
    if (!startDate) return 0;
    if (isHalfDay) return 0.5;
    if (!endDate) return 1;
    let count = 0;
    for (let d = startDate; d <= endDate; d++) {
      if (!WEEKENDS.has(d)) count++;
    }
    return count;
  };

  const requestedDays = calcDays();
  const remaining = 13;
  const afterUse = remaining - (type.deduct ? requestedDays : 0);

  const handleDateClick = (day: number) => {
    if (WEEKENDS.has(day) || day < 4) return;
    if (isHalfDay) {
      setStartDate(day);
      setEndDate(day);
      return;
    }
    if (!startDate || selectingEnd === false) {
      setStartDate(day);
      setEndDate(null);
      setSelectingEnd(true);
    } else {
      if (day < startDate) {
        setStartDate(day);
        setEndDate(null);
      } else {
        setEndDate(day);
        setSelectingEnd(false);
      }
    }
  };

  const isInRange = (day: number) =>
    startDate && endDate && day >= startDate && day <= endDate;

  const formatDate = (d: number | null) =>
    d ? `2026. 06. ${String(d).padStart(2, '0')}` : '—';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Type Selection */}
          <Card noPadding className="p-6 border-slate-100 shadow-none">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">휴가 종류</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {vacationTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedType(t.id); setStartDate(null); setEndDate(null); setSelectingEnd(false); }}
                  className={`p-4 rounded border text-left transition-all cursor-pointer ${
                    selectedType === t.id
                      ? 'border-2 border-blue-500 ring-4 ring-blue-500/10 bg-[#fafafa]'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-[#fafafa] hover:border-slate-200'
                  }`}
                >
                  <div className={`text-[13px] font-black mb-1 ${selectedType === t.id ? 'text-blue-600' : 'text-slate-700'}`}>
                    {t.label}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 leading-snug">{t.desc}</div>
                  {t.deduct && (
                    <div className="mt-2 text-[9px] font-black text-rose-400 uppercase tracking-wide">연차 차감</div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Calendar */}
          <Card noPadding className="p-6 border-slate-100 shadow-none">
            <div className="flex items-center justify-between mb-5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {isHalfDay ? '날짜 선택' : '기간 선택'}
              </label>
              <div className="flex items-center gap-3">
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:border-slate-300 transition-all cursor-pointer bg-[#fafafa]">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[13px] font-black text-slate-700">2026년 6월</span>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:border-slate-300 transition-all cursor-pointer bg-[#fafafa]">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {!isHalfDay && (
              <div className="flex items-center gap-4 mb-5 p-3 bg-slate-50 rounded border border-slate-100 text-[12px] font-bold">
                <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">시작</span>
                <span className="text-slate-700">{formatDate(startDate)}</span>
                <span className="text-slate-200 mx-1">→</span>
                <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">종료</span>
                <span className="text-slate-700">{formatDate(endDate)}</span>
                {requestedDays > 0 && (
                  <span className="ml-auto text-[12px] font-black text-blue-600">{requestedDays}일</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className={`text-center text-[10px] font-black uppercase tracking-widest py-1.5 ${d === '일' ? 'text-rose-400' : d === '토' ? 'text-blue-400' : 'text-slate-400'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: JUNE_FIRST_DAY }).map((_, i) => <div key={`pad-${i}`} />)}
              {Array.from({ length: JUNE_TOTAL }, (_, i) => i + 1).map(day => {
                const isWeekend = WEEKENDS.has(day);
                const isPast = day < 4;
                const isStart = startDate === day;
                const isEnd = endDate === day;
                const inRange = isInRange(day);
                const disabled = isWeekend || isPast;

                return (
                  <button
                    key={day}
                    disabled={disabled}
                    onClick={() => handleDateClick(day)}
                    className={`h-9 text-[12px] font-black transition-all cursor-pointer border-none relative ${
                      (isStart || isEnd)
                        ? 'bg-blue-600 text-white rounded'
                        : inRange
                        ? 'bg-blue-50 text-blue-700 rounded-none'
                        : disabled
                        ? 'text-slate-200 cursor-not-allowed'
                        : 'text-slate-700 hover:bg-slate-100 rounded'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Reason */}
          <Card noPadding className="p-6 border-slate-100 shadow-none">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">휴가 사유</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={4}
              placeholder="휴가 사유를 간략히 입력해 주세요."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-[#fafafa] transition-all resize-none leading-relaxed"
            />
          </Card>

          {/* Handover */}
          <Card noPadding className="p-6 border-slate-100 shadow-none">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">업무 인수인계 사항 <span className="text-slate-300 normal-case tracking-normal">(선택)</span></label>
            <textarea
              value={handover}
              onChange={e => setHandover(e.target.value)}
              rows={3}
              placeholder="휴가 기간 중 처리가 필요한 업무나 인수인계 내용을 입력해 주세요."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-[#fafafa] transition-all resize-none leading-relaxed"
            />
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              className={`flex-1 py-4 text-[12px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer border-none ${
                startDate
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
              disabled={!startDate}
            >
              <Send size={15} /> 휴가 신청하기
            </button>
            <button className="px-8 py-4 bg-slate-100 text-slate-600 text-[12px] font-black uppercase tracking-widest rounded hover:bg-slate-200 transition-all cursor-pointer border-none">
              취소
            </button>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          {/* My Remaining */}
          <Card noPadding className="p-6 border-slate-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">나의 연차 현황</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-slate-500">총 연차</span>
                <span className="text-[14px] font-black text-slate-700">25일</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-slate-500">사용 연차</span>
                <span className="text-[14px] font-black text-slate-700">12일</span>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-black text-slate-600">잔여 연차</span>
                <span className="text-[18px] font-black text-blue-600">{remaining}일</span>
              </div>
              {type.deduct && requestedDays > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
                  <span className="text-[11px] font-black text-blue-500">신청 후 잔여</span>
                  <span className={`text-[16px] font-black ${afterUse < 0 ? 'text-rose-500' : 'text-blue-700'}`}>
                    {afterUse}일
                  </span>
                </div>
              )}
              {!type.deduct && (
                <div className="p-3 bg-emerald-50 rounded border border-emerald-100">
                  <span className="text-[11px] font-black text-emerald-600">연차 미차감 항목</span>
                </div>
              )}
            </div>
          </Card>

          {/* Approver */}
          <Widget title="결재선" color="blue">
            <div className="space-y-3">
              <ApproverItem step={1} name="김팀장" role="팀장" status="대기" />
              <ApproverItem step={2} name="이부장" role="부장" status="대기" />
            </div>
          </Widget>

          {/* Notice */}
          <Card noPadding className="p-5 border-slate-100 shadow-none">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">신청 유의사항</div>
            <ul className="space-y-2.5">
              {[
                '연차는 최소 3영업일 전 신청 필요',
                '반차는 전일까지 신청 가능',
                '병가는 진단서 등 증빙 서류 제출 필수',
                '경조휴가는 관련 서류 사후 제출 가능',
              ].map(tip => (
                <li key={tip} className="flex items-start gap-2">
                  <Info size={12} className="text-slate-300 shrink-0 mt-0.5" />
                  <span className="text-[11px] font-bold text-slate-500 leading-snug">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

function ApproverItem({ step, name, role, status }: { step: number; name: string; role: string; status: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
        {step}
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-black text-slate-700">{name}</div>
        <div className="text-[10px] font-bold text-slate-400">{role}</div>
      </div>
      <span className="text-[10px] font-black text-slate-300 bg-slate-50 px-2 py-1 rounded border border-slate-100">{status}</span>
    </div>
  );
}

export default VacationRequest;
