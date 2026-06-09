import React, { useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';

type FacilityKey = 'HEALTHCARE' | 'MEETING_ROOM' | 'VEHICLE' | 'RESORT' | 'CAFETERIA' | 'CAMPING';

interface FacilityConfig {
  name: string;
  desc: string;
  color: string;
  capacity: string;
  location: string;
  rules: string[];
  timeSlots: string[];
  resources: Resource[];
}

interface Resource {
  id: string;
  label: string;
  sublabel?: string;
}

const facilityConfigs: Record<FacilityKey, FacilityConfig> = {
  HEALTHCARE: {
    name: '헬스 케어',
    desc: '사내 피트니스 센터 및 건강관리실',
    color: 'rose',
    capacity: '20명',
    location: 'B1 헬스센터',
    rules: ['예약 후 노쇼 시 3회 이상 당월 이용 제한', '운동복 및 운동화 착용 필수', '예약 30분 전까지 취소 가능'],
    timeSlots: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    resources: [
      { id: 'fitness', label: '피트니스 센터', sublabel: '자유 이용' },
      { id: 'pt', label: 'PT 룸', sublabel: '1:1 트레이닝' },
      { id: 'health', label: '건강관리실', sublabel: '혈압/체성분 측정' },
    ],
  },
  MEETING_ROOM: {
    name: '회의실',
    desc: '각 층별 회의실 및 화상회의실',
    color: 'blue',
    capacity: '최대 20명',
    location: '각 층 회의실',
    rules: ['예약 시간 초과 시 자동 반납', '음식물 반입 금지 (음료 제외)', '화이트보드 사용 후 반드시 지워주세요'],
    timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
    resources: [
      { id: 'room-a', label: '대회의실 A', sublabel: '2층 · 20인' },
      { id: 'room-b', label: '소회의실 B', sublabel: '3층 · 8인' },
      { id: 'room-c', label: '소회의실 C', sublabel: '3층 · 6인' },
      { id: 'video', label: '화상회의실', sublabel: '4층 · 10인' },
      { id: 'phone', label: '전화부스', sublabel: '각 층 · 1인' },
    ],
  },
  VEHICLE: {
    name: '법인 차량',
    desc: '출장 및 업무용 법인 차량 예약',
    color: 'indigo',
    capacity: '차종별 상이',
    location: 'B2 주차장',
    rules: ['면허증 지참 필수', '반납 시 주유 확인 (50% 이상)', '사고 발생 시 즉시 총무팀 연락'],
    timeSlots: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    resources: [
      { id: 'sonata1', label: '소나타 1호 (서울 12가 3456)', sublabel: '5인승' },
      { id: 'sonata2', label: '소나타 2호 (서울 34나 7890)', sublabel: '5인승' },
      { id: 'carnival', label: '카니발 (서울 56다 1234)', sublabel: '9인승' },
      { id: 'ev6', label: 'EV6 전기차 (서울 78라 5678)', sublabel: '5인승 · 전기' },
    ],
  },
  RESORT: {
    name: '속초 휴양소',
    desc: '동해 바다 뷰 임직원 전용 휴양소',
    color: 'emerald',
    capacity: '최대 10명',
    location: '강원도 속초시',
    rules: ['1인 연 2회 이용 가능', '반려동물 동반 불가', '체크인 15:00 / 체크아웃 11:00'],
    timeSlots: ['1박', '2박', '3박'],
    resources: [
      { id: 'room-ocean', label: '오션뷰 스위트', sublabel: '4인실 · 바다 전망' },
      { id: 'room-garden', label: '가든뷰 객실 A', sublabel: '2인실' },
      { id: 'room-garden2', label: '가든뷰 객실 B', sublabel: '2인실' },
    ],
  },
  CAFETERIA: {
    name: '카페테리아',
    desc: '구내식당 및 케이터링 서비스 예약',
    color: 'amber',
    capacity: '최대 100명',
    location: '1층 카페테리아',
    rules: ['단체 예약은 3일 전까지 신청', '식단 변경 불가 (알레르기 사전 고지 필요)', '잔반 처리 규정 준수'],
    timeSlots: ['11:30', '12:00', '12:30', '13:00', '18:00', '18:30'],
    resources: [
      { id: 'lunch', label: '단체 점심 예약', sublabel: '10인 이상' },
      { id: 'dinner', label: '단체 저녁 예약', sublabel: '10인 이상' },
      { id: 'catering', label: '케이터링 서비스', sublabel: '행사/미팅용' },
    ],
  },
  CAMPING: {
    name: '옥상 캠핑장',
    desc: '루프탑 캠핑 & 팀빌딩 공간',
    color: 'teal',
    capacity: '최대 30명',
    location: '건물 옥상 (R층)',
    rules: ['기상 악화 시 예약 자동 취소 (환불 처리)', '음주는 주류 반입 후 절제', '야간 소음 주의 (22:00 이후)'],
    timeSlots: ['14:00~18:00 (오후)', '18:00~22:00 (저녁)', '종일 (10:00~22:00)'],
    resources: [
      { id: 'zone-a', label: '캠핑 구역 A', sublabel: '텐트 4동 · 16인' },
      { id: 'zone-b', label: '캠핑 구역 B', sublabel: '텐트 2동 · 8인' },
      { id: 'bbq', label: 'BBQ 구역', sublabel: '그릴 3대 · 30인' },
    ],
  },
};

// Generate a simple calendar for June 2026
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
// June 1 2026 is actually a Monday
const june2026FirstDay = 1; // Monday
const june2026Days = 30;

const fullyBooked = new Set([7, 8, 15]);

interface Props {
  facilityKey: FacilityKey;
}

const ReservationDetail: React.FC<Props> = ({ facilityKey }) => {
  const config = facilityConfigs[facilityKey];
  const [selectedResource, setSelectedResource] = useState(config.resources[0].id);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [headCount, setHeadCount] = useState(1);

  const colorBg: Record<string, string> = {
    rose: 'bg-rose-500', blue: 'bg-blue-600', indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600', amber: 'bg-amber-500', teal: 'bg-teal-600',
  };
  const colorText: Record<string, string> = {
    rose: 'text-rose-600', blue: 'text-blue-600', indigo: 'text-indigo-600',
    emerald: 'text-emerald-600', amber: 'text-amber-600', teal: 'text-teal-600',
  };
  const colorBorder: Record<string, string> = {
    rose: 'border-rose-300 ring-rose-500/20', blue: 'border-blue-400 ring-blue-500/20',
    indigo: 'border-indigo-400 ring-indigo-500/20', emerald: 'border-emerald-400 ring-emerald-500/20',
    amber: 'border-amber-400 ring-amber-500/20', teal: 'border-teal-400 ring-teal-500/20',
  };

  return (
    <div className="space-y-8">
      {/* Info Bar */}
      <div className="grid grid-cols-3 gap-6">
        <Card noPadding className="p-5 border-slate-100 shadow-none">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">위치</div>
          <div className="text-[14px] font-black text-slate-800">{config.location}</div>
        </Card>
        <Card noPadding className="p-5 border-slate-100 shadow-none">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">수용 인원</div>
          <div className="text-[14px] font-black text-slate-800">{config.capacity}</div>
        </Card>
        <Card noPadding className="p-5 border-slate-100 shadow-none">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">운영 시간</div>
          <div className="text-[14px] font-black text-slate-800">{config.timeSlots[0]} ~ {config.timeSlots[config.timeSlots.length - 1]}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resource Selection */}
          <Widget title="공간 선택" color={config.color as any}>
            <div className="grid grid-cols-1 gap-3 mt-2">
              {config.resources.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedResource(r.id)}
                  className={`flex items-center justify-between p-4 rounded border transition-all cursor-pointer text-left ${
                    selectedResource === r.id
                      ? `border-2 ${colorBorder[config.color]} ring-4 bg-[#fafafa]`
                      : 'border-slate-100 bg-slate-50/50 hover:bg-[#fafafa] hover:border-slate-200'
                  }`}
                >
                  <div>
                    <div className={`text-[14px] font-black ${selectedResource === r.id ? colorText[config.color] : 'text-slate-700'}`}>
                      {r.label}
                    </div>
                    {r.sublabel && <div className="text-[11px] font-bold text-slate-400 mt-0.5">{r.sublabel}</div>}
                  </div>
                  {selectedResource === r.id && (
                    <CheckCircle2 size={18} className={colorText[config.color]} />
                  )}
                </button>
              ))}
            </div>
          </Widget>

          {/* Calendar */}
          <Widget title="날짜 선택 — 2026년 6월" color="slate">
            <div className="mt-4">
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className={`text-center text-[10px] font-black uppercase tracking-widest py-2 ${d === '일' ? 'text-rose-400' : d === '토' ? 'text-blue-400' : 'text-slate-400'}`}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Padding for first day */}
                {Array.from({ length: june2026FirstDay }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {Array.from({ length: june2026Days }, (_, i) => i + 1).map(day => {
                  const dayOfWeek = (june2026FirstDay + day - 1) % 7;
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const isBooked = fullyBooked.has(day);
                  const isPast = day < 4;
                  const isSelected = selectedDate === day;
                  const isDisabled = isWeekend || isBooked || isPast;

                  return (
                    <button
                      key={day}
                      disabled={isDisabled}
                      onClick={() => setSelectedDate(day)}
                      className={`aspect-square rounded text-[12px] font-black transition-all cursor-pointer border ${
                        isSelected
                          ? `${colorBg[config.color]} text-white border-transparent shadow-md`
                          : isBooked
                          ? 'bg-slate-50 text-slate-200 border-slate-100 cursor-not-allowed'
                          : isPast
                          ? 'text-slate-200 border-transparent cursor-not-allowed'
                          : isWeekend
                          ? 'text-slate-200 border-transparent cursor-not-allowed'
                          : 'text-slate-700 border-transparent hover:bg-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {day}
                      {isBooked && !isWeekend && (
                        <div className="text-[7px] font-black text-slate-300 leading-none">만석</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </Widget>

          {/* Time Slot */}
          {selectedDate && (
            <Widget title={`시간 선택 — 6월 ${selectedDate}일`} color={config.color as any}>
              <div className="flex flex-wrap gap-2 mt-3">
                {config.timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-4 py-2.5 rounded text-[12px] font-black transition-all cursor-pointer border ${
                      selectedSlot === slot
                        ? `${colorBg[config.color]} text-white border-transparent shadow-md`
                        : 'bg-[#fafafa] text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </Widget>
          )}
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <Widget title="예약 안내" color="slate">
            <div className="space-y-3 mt-2">
              {config.rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Info size={13} className="text-slate-300 shrink-0 mt-0.5" />
                  <span className="text-[12px] font-bold text-slate-500 leading-snug">{rule}</span>
                </div>
              ))}
            </div>
          </Widget>

          {/* Booking Summary */}
          <Card noPadding className="p-6 border-slate-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">예약 요약</div>
            <div className="space-y-3 mb-6">
              <SummaryRow label="시설" value={config.resources.find(r => r.id === selectedResource)?.label ?? '-'} />
              <SummaryRow label="날짜" value={selectedDate ? `2026. 06. ${String(selectedDate).padStart(2, '0')}` : '-'} />
              <SummaryRow label="시간" value={selectedSlot ?? '-'} />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">인원</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHeadCount(Math.max(1, headCount - 1))}
                    className="w-7 h-7 rounded border border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer bg-[#fafafa] flex items-center justify-center font-black"
                  >
                    -
                  </button>
                  <span className="text-[14px] font-black text-slate-800 w-6 text-center">{headCount}</span>
                  <button
                    onClick={() => setHeadCount(headCount + 1)}
                    className="w-7 h-7 rounded border border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer bg-[#fafafa] flex items-center justify-center font-black"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              className={`w-full py-4 text-white text-[12px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer border-none shadow-lg flex items-center justify-center gap-2 ${
                selectedDate && selectedSlot
                  ? `${colorBg[config.color]} hover:opacity-90`
                  : 'bg-slate-200 cursor-not-allowed'
              }`}
              disabled={!selectedDate || !selectedSlot}
            >
              <CheckCircle2 size={16} /> 예약 신청
            </button>
          </Card>

          {/* My Reservations */}
          <Widget title="나의 예약 현황" color="indigo">
            <div className="space-y-3 mt-2">
              <MyReservation date="06.10" slot="10:00" resource="소회의실 B" />
              <MyReservation date="06.18" slot="오후" resource="피트니스 센터" />
            </div>
          </Widget>
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

function MyReservation({ date, slot, resource }: { date: string; slot: string; resource: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
      <div>
        <div className="text-[12px] font-black text-slate-700">{resource}</div>
        <div className="text-[10px] font-bold text-slate-400 mt-0.5">{date} · {slot}</div>
      </div>
      <button className="text-[10px] font-black text-rose-400 hover:text-rose-600 cursor-pointer border-none bg-transparent">취소</button>
    </div>
  );
}

export default ReservationDetail;
