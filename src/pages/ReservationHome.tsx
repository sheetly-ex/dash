import React from 'react';
import { LayoutDashboard, Users, Clock, CheckCircle2, AlertCircle, MapPin, Briefcase } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import StatusCard from '../components/ui/StatusCard';
import Badge from '../components/ui/Badge';
import type { BadgeVariant } from '../components/ui/Badge';

const ReservationHome: React.FC = () => {
  const todayReservations = [
    { id: 1, title: '402호 회의실', time: '14:00 - 15:30' },
    { id: 2, title: '법인차량-04', time: '16:00 - 18:00' },
    { id: 3, title: '헬스케어 1실', time: '17:00 - 18:00' },
  ];

  const myReservations = [
    { id: 1, title: '301호 소회의실', time: '내일 10:00' },
  ];

  const cancelledReservations = [
    { id: 1, title: '대회의실 A', time: '어제 (취소됨)' },
  ];

  return (
    <div className="space-y-10">
      {/* Quick Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatusCard title="오늘의 예약" value="03건" color="blue" icon={<Clock size={18} />} items={todayReservations.map(i => ({ ...i, secondary: i.time }))} emptyMessage="예약 내역이 없습니다" />
        <StatusCard title="나의 예약" value="01건" color="emerald" icon={<CheckCircle2 size={18} />} items={myReservations.map(i => ({ ...i, secondary: i.time }))} emptyMessage="예약 내역이 없습니다" />
        <StatusCard title="취소/변경" value="01건" color="slate" icon={<AlertCircle size={18} />} items={cancelledReservations.map(i => ({ ...i, secondary: i.time }))} emptyMessage="예약 내역이 없습니다" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Reservation Categories */}
        <Widget title="자원 카테고리" color="blue">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-2">
            <CategoryItem icon={<Users size={24} />} label="회의실" count="12개" />
            <CategoryItem icon={<Briefcase size={24} />} label="법인 차량" count="08대" />
            <CategoryItem icon={<MapPin size={24} />} label="속초 휴양소" count="04실" />
            <CategoryItem icon={<Clock size={24} />} label="헬스 케어" count="02개소" />
            <CategoryItem icon={<LayoutDashboard size={24} />} label="카페테리아" count="01개소" />
            <CategoryItem icon={<AlertCircle size={24} />} label="기타 자산" count="15개" />
          </div>
        </Widget>

        {/* Recent Notifications */}
        <Widget title="자원별 공지사항" color="rose">
          <div className="space-y-4">
            <NoticeItem 
              tag="회의실" 
              title="대회의실 A 빔프로젝터 수리 완료 안내" 
              date="2026.06.01" 
            />
            <NoticeItem 
              tag="법인차량" 
              title="차량 정기 점검에 따른 이용 제한 안내 (6/15)" 
              date="2026.05.30" 
              important 
            />
            <NoticeItem 
              tag="속초휴양소" 
              title="하계 성수기 추첨 예약 접수 시작 안내" 
              date="2026.05.28" 
            />
          </div>
        </Widget>

        {/* Real-time Usage Status */}
        <div className="lg:col-span-2">
          <Widget title="실시간 예약 현황" color="emerald">
            <div className="space-y-6 mt-2">
              <UsageRow resource="402호 회의실" user="박민수 과장" time="14:00 - 15:30" status="사용중" />
              <UsageRow resource="법인차량-04" user="이영희 팀장" time="16:00 - 18:00" status="예약됨" />
              <UsageRow resource="헬스케어 1실" user="김철수 부장" time="17:00 - 18:00" status="예약됨" />
              <UsageRow resource="301호 소회의실" user="정우성 대리" time="13:00 - 14:00" status="완료" isLast />
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
};


interface CategoryItemProps { icon: React.ReactNode; label: string; count: string; }
function CategoryItem({ icon, label, count }: CategoryItemProps) {
  return (
    <Card noPadding className="flex flex-col items-center p-6 bg-slate-50 border border-slate-100/50 rounded-xl hover:bg-[#fafafa] hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all cursor-pointer group">
      <div className="w-14 h-14 bg-[#fafafa] rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm mb-4 transition-colors">
        {icon}
      </div>
      <div className="text-[13px] font-black text-slate-800 mb-1">{label}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count}</div>
    </Card>
  );
}

interface NoticeItemProps { tag: string; title: string; date: string; important?: boolean; }
function NoticeItem({ tag, title, date, important = false }: NoticeItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 group cursor-pointer">
      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${important ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
        {tag}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{title}</div>
      </div>
      <span className="text-[10px] font-bold text-slate-300 shrink-0">{date}</span>
    </div>
  );
}

const USAGE_VARIANT: Record<string, string> = { '사용중': 'blue', '예약됨': 'emerald', '완료': 'slate' };

interface UsageRowProps { resource: string; user: string; time: string; status: string; isLast?: boolean; }
function UsageRow({ resource, user, time, status, isLast = false }: UsageRowProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isLast ? '' : 'border-b border-slate-50 pb-6'}`}>
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 rounded-full bg-slate-100"></div>
        <div>
          <div className="text-[14px] font-black text-slate-800">{resource}</div>
          <div className="text-[12px] font-bold text-slate-400">{user}</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-[13px] font-black text-slate-700 flex items-center gap-2">
          <Clock size={14} className="text-slate-300" />{time}
        </div>
        <Badge variant={(USAGE_VARIANT[status] ?? 'slate') as BadgeVariant} size="sm">{status}</Badge>
      </div>
    </div>
  );
}

export default ReservationHome;
