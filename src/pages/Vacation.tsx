import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Plane } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import StatusCard from '../components/ui/StatusCard';

const Vacation: React.FC = () => {
  const totalBreakdown = [
    { id: 1, title: '기본 발생 연차', value: '15일' },
    { id: 2, title: '전년 이월 연차', value: '10일' },
  ];

  const recentUses = [
    { id: 1, title: '연차 휴가 (3일)', value: '05.20' },
    { id: 2, title: '오전 반차 (0.5일)', value: '04.15' },
    { id: 3, title: '경조 휴가 (3일)', value: '03.10' },
  ];

  const remainingBreakdown = [
    { id: 1, title: '사용 가능 연차', value: '13일' },
    { id: 2, title: '승인 대기 중', value: '0일' },
  ];

  const expiringBreakdown = [
    { id: 1, title: '26년말 소멸 예정', value: '2일' },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatusCard title="총 연차" value="25일" icon={<Calendar size={18} className="text-blue-500" />} items={totalBreakdown.map(i => ({ ...i, secondary: i.value }))} color="blue" />
        <StatusCard title="사용 연차" value="12일" icon={<Clock size={18} className="text-emerald-500" />} items={recentUses.map(i => ({ ...i, secondary: i.value }))} color="emerald" />
        <StatusCard title="잔여 연차" value="13일" icon={<CheckCircle2 size={18} className="text-indigo-500" />} items={remainingBreakdown.map(i => ({ ...i, secondary: i.value }))} color="indigo" highlight />
        <StatusCard title="소멸 예정" value="2일" icon={<AlertCircle size={18} className="text-rose-500" />} items={expiringBreakdown.map(i => ({ ...i, secondary: i.value }))} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left: Vacation History */}
        <div className="lg:col-span-2">
          <Widget title="휴가 사용 내역" color="blue">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">종류</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">기간</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">일수</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <HistoryRow type="연차" date="2026.05.20 - 2026.05.22" days="3일" status="승인완료" />
                  <HistoryRow type="오전반차" date="2026.04.15" days="0.5일" status="승인완료" />
                  <HistoryRow type="경조휴가" date="2026.03.10 - 2026.03.12" days="3일" status="승인완료" />
                  <HistoryRow type="연차" date="2026.02.05" days="1일" status="승인완료" />
                </tbody>
              </table>
            </div>
          </Widget>
        </div>

        {/* Right: Quick Apply & Info */}
        <div className="space-y-8">
          <Widget title="휴가 신청" color="indigo">
            <div className="space-y-4">
              <button className="w-full py-4 px-6 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer border-none">
                <Plane size={18} />
                새 휴가 신청하기
              </button>
              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                * 휴가 신청은 최소 3일 전까지 완료해야 합니다.<br/>
                * 반차는 오전/오후로 구분하여 신청 가능합니다.
              </p>
            </div>
          </Widget>

          <Widget title="유의사항" color="rose">
            <ul className="space-y-3">
              <li className="flex gap-3 text-[12px] font-bold text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></div>
                미사용 연차는 연말에 자동 소멸됩니다.
              </li>
              <li className="flex gap-3 text-[12px] font-bold text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></div>
                병가 사용 시 증빙 서류 제출이 필요합니다.
              </li>
            </ul>
          </Widget>
        </div>
      </div>
    </div>
  );
};


interface HistoryRowProps { type: string; date: string; days: string; status: string; }
function HistoryRow({ type, date, days, status }: HistoryRowProps) {
  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="py-5">
        <span className="text-sm font-black text-slate-800">{type}</span>
      </td>
      <td className="py-5">
        <span className="text-sm font-bold text-slate-500">{date}</span>
      </td>
      <td className="py-5">
        <span className="text-sm font-black text-slate-800">{days}</span>
      </td>
      <td className="py-5">
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
          {status}
        </span>
      </td>
    </tr>
  );
}

export default Vacation;
