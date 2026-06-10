import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface Event {
  id: number;
  title: string;
  time: string;
  location: string;
  category: string;
}

const CalendarPage: React.FC = () => {
  const { t, tArray } = useSettings();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const dayLabels = tArray('calendar.days');
  const eventTotal = 12;

  const events: Record<number, Event[]> = {
    4: [{ id: 1, title: '전사 타운홀 미팅', time: '10:00 - 11:30', location: '대강당', category: '전사' }],
    12: [{ id: 2, title: '2분기 경영 실적 보고', time: '14:00 - 15:30', location: '회의실 A', category: '경영' }],
    18: [
      { id: 3, title: '주간 전략 회의', time: '09:30 - 11:00', location: '회의실 B', category: '부서' },
      { id: 4, title: '파트너사 미팅', time: '15:00 - 16:30', location: '강남역 인근', category: '외부' }
    ],
    25: [{ id: 5, title: '사내 보안 교육', time: '13:00 - 14:00', location: '온라인', category: '교육' }]
  };

  const handleDayClick = (day: number) => {
    if (events[day]) {
      setSelectedDay(day);
    } else {
      setSelectedDay(null);
    }
  };

  return (
    <div className="bg-surface-elevated rounded-2xl border border-app p-10 shadow-sm relative">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <CalendarIcon size={24} />
          </div>
          <div>
            <span className="text-3xl font-black text-app tracking-tight">{t('calendar.monthYear')}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t('calendar.subtitle')}</span>
              <div className="w-1 h-1 bg-surface-muted rounded-full"></div>
              <span className="text-[10px] font-bold text-app-muted">{eventTotal}{t('calendar.eventCount')}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 bg-surface-muted p-2 rounded-lg border border-app-muted">
          <button className="w-10 h-10 flex items-center justify-center bg-surface-elevated border border-app rounded-md hover:bg-surface-muted transition-all shadow-sm cursor-pointer active:scale-95 text-app-secondary"><ChevronLeft size={20} /></button>
          <button className="px-6 text-sm font-black text-app-secondary hover:text-blue-600 transition-colors">{t('calendar.today')}</button>
          <button className="w-10 h-10 flex items-center justify-center bg-surface-elevated border border-app rounded-md hover:bg-surface-muted transition-all shadow-sm cursor-pointer active:scale-95 text-app-secondary"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 text-center mb-6">
        {dayLabels.map((d, i) => (
          <span key={i} className={`text-[11px] font-black tracking-widest ${i === 0 ? 'text-rose-500' : i === 6 ? 'text-blue-500' : 'text-app-muted'}`}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 30 }).map((_, i) => {
          const day = i + 1;
          const isToday = day === 1;
          const hasEvent = events[day];
          return (
            <div
              key={i}
              onClick={() => handleDayClick(day)}
              className={`min-h-24 p-3 flex flex-col items-start rounded-xl transition-all cursor-pointer relative border ${
                isToday ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/40 ring-4 ring-blue-50' :
                selectedDay === day ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' :
                'bg-surface-elevated border-app-muted hover:border-blue-200 hover:bg-blue-50/30'
              }`}
            >
              <span className={`text-base font-black ${isToday ? 'text-white' : day % 7 === 1 ? 'text-rose-400' : day % 7 === 0 ? 'text-blue-400' : 'text-app-secondary'}`}>{day}</span>
              {hasEvent && (
                <div className="mt-2 space-y-1 w-full">
                  {hasEvent.slice(0, 2).map(e => (
                    <div key={e.id} className={`text-[10px] font-black truncate w-full px-1.5 py-0.5 rounded ${isToday ? 'bg-surface-elevated/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
                      {e.title}
                    </div>
                  ))}
                  {hasEvent.length > 2 && (
                    <div className={`text-[9px] font-black ${isToday ? 'text-white/70' : 'text-app-muted'}`}>
                      +{hasEvent.length - 2}{t('calendar.moreEvents')}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDay && events[selectedDay] && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-surface-elevated rounded-xl shadow-2xl border border-app-muted z-50 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-5 border-b border-app-muted flex items-center justify-between bg-surface-muted/50">
            <span className="text-sm font-black text-app">6{selectedDay}{t('calendar.scheduleFor')}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedDay(null); }}
              className="p-1 hover:bg-surface-muted rounded transition-colors text-app-muted border-none bg-transparent cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-2 max-h-80 overflow-y-auto">
            {events[selectedDay].map((event) => (
              <div key={event.id} className="p-4 hover:bg-surface-muted rounded-lg transition-colors group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-sm border border-blue-100">
                    {event.category}
                  </span>
                </div>
                <h4 className="text-[14px] font-black text-app mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-app-muted">
                    <Clock size={12} className="text-app-muted" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-app-muted">
                    <MapPin size={12} className="text-app-muted" />
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDay && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/5 backdrop-blur-[1px]"
          onClick={() => setSelectedDay(null)}
        ></div>
      )}
    </div>
  );
};

export default CalendarPage;
