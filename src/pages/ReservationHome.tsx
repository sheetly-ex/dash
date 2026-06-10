import React from 'react';
import { LayoutDashboard, Users, Clock, CheckCircle2, AlertCircle, MapPin, Briefcase } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import StatusCard from '../components/ui/StatusCard';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import { useSettings } from '../contexts/SettingsContext';
import type { TranslationKey } from '../i18n';

type UsageStatusKey = 'inUse' | 'reserved' | 'completed';

const ReservationHome: React.FC = () => {
  const { t } = useSettings();
  const caseSuffix = t('common.caseSuffix');

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

  const statusLabel = (key: UsageStatusKey) => t(`status.${key}` as TranslationKey);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatusCard title={t('reservation.todayReservations')} value={`03${caseSuffix}`} color="blue" icon={<Clock size={18} />} items={todayReservations.map(i => ({ ...i, secondary: i.time }))} emptyMessage={t('reservation.noReservations')} />
        <StatusCard title={t('reservation.myReservations')} value={`01${caseSuffix}`} color="emerald" icon={<CheckCircle2 size={18} />} items={myReservations.map(i => ({ ...i, secondary: i.time }))} emptyMessage={t('reservation.noReservations')} />
        <StatusCard title={t('reservation.cancelled')} value={`01${caseSuffix}`} color="slate" icon={<AlertCircle size={18} />} items={cancelledReservations.map(i => ({ ...i, secondary: i.time }))} emptyMessage={t('reservation.noReservations')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <Widget title={t('reservation.resourceCategories')} color="blue">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-2">
            <CategoryItem icon={<Users size={24} />} label={t('sidebar.meetingRoom')} count={`12${t('common.countSuffix')}`} />
            <CategoryItem icon={<Briefcase size={24} />} label={t('sidebar.vehicle')} count="08대" />
            <CategoryItem icon={<MapPin size={24} />} label={t('sidebar.resort')} count="04실" />
            <CategoryItem icon={<Clock size={24} />} label={t('sidebar.healthcare')} count={`02${t('common.countSuffix')}`} />
            <CategoryItem icon={<LayoutDashboard size={24} />} label={t('sidebar.cafeteria')} count={`01${t('common.countSuffix')}`} />
            <CategoryItem icon={<AlertCircle size={24} />} label={t('reservation.otherAssets')} count={`15${t('common.countSuffix')}`} />
          </div>
        </Widget>

        <Widget title={t('reservation.facilityNotices')} color="rose">
          <div className="space-y-4">
            <NoticeItem tag={t('sidebar.meetingRoom')} title="대회의실 A 빔프로젝터 수리 완료 안내" date="2026.06.01" />
            <NoticeItem tag={t('sidebar.vehicle')} title="차량 정기 점검에 따른 이용 제한 안내 (6/15)" date="2026.05.30" important />
            <NoticeItem tag={t('sidebar.resort')} title="하계 성수기 추첨 예약 접수 시작 안내" date="2026.05.28" />
          </div>
        </Widget>

        <div className="lg:col-span-2">
          <Widget title={t('reservation.realtimeStatus')} color="emerald">
            <div className="space-y-6 mt-2">
              <UsageRow resource="402호 회의실" user="박민수 과장" time="14:00 - 15:30" status="inUse" statusLabel={statusLabel('inUse')} />
              <UsageRow resource="법인차량-04" user="이영희 팀장" time="16:00 - 18:00" status="reserved" statusLabel={statusLabel('reserved')} />
              <UsageRow resource="헬스케어 1실" user="김철수 부장" time="17:00 - 18:00" status="reserved" statusLabel={statusLabel('reserved')} />
              <UsageRow resource="301호 소회의실" user="정우성 대리" time="13:00 - 14:00" status="completed" statusLabel={statusLabel('completed')} isLast />
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
    <Card noPadding className="flex flex-col items-center p-6 bg-surface-muted border border-app-muted/50 rounded-xl hover:bg-surface-elevated hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all cursor-pointer group">
      <div className="w-14 h-14 bg-surface-elevated rounded-lg flex items-center justify-center text-app-muted group-hover:text-blue-600 shadow-sm mb-4 transition-colors">
        {icon}
      </div>
      <div className="text-[13px] font-black text-app mb-1">{label}</div>
      <div className="text-[10px] font-bold text-app-muted uppercase tracking-widest">{count}</div>
    </Card>
  );
}

interface NoticeItemProps { tag: string; title: string; date: string; important?: boolean; }
function NoticeItem({ tag, title, date, important = false }: NoticeItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-app-muted last:border-0 group cursor-pointer">
      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${important ? 'bg-rose-50 text-rose-600' : 'bg-surface-muted text-app-muted'}`}>
        {tag}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-app truncate group-hover:text-blue-600 transition-colors">{title}</div>
      </div>
      <span className="text-[10px] font-bold text-app-muted shrink-0">{date}</span>
    </div>
  );
}

interface UsageRowProps { resource: string; user: string; time: string; status: UsageStatusKey; statusLabel: string; isLast?: boolean; }
function UsageRow({ resource, user, time, status, statusLabel, isLast = false }: UsageRowProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isLast ? '' : 'border-b border-app-muted pb-6'}`}>
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 rounded-full bg-surface-muted"></div>
        <div>
          <div className="text-[14px] font-black text-app">{resource}</div>
          <div className="text-[12px] font-bold text-app-muted">{user}</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-[13px] font-black text-app-secondary flex items-center gap-2">
          <Clock size={14} className="text-app-muted" />{time}
        </div>
        <Badge variant={STATUS_VARIANT[status] ?? 'slate'} size="sm">{statusLabel}</Badge>
      </div>
    </div>
  );
}

export default ReservationHome;
