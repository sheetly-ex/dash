import React, { useState } from 'react';
import { Send, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import Card from '../../components/ui/Card';
import Widget from '../../components/ui/Widget';
import { useSettings } from '../../contexts/SettingsContext';
import type { TranslationKey } from '../../i18n';

type VacationTypeId = 'annual' | 'half_am' | 'half_pm' | 'sick' | 'family' | 'special';

const VACATION_TYPE_IDS: VacationTypeId[] = ['annual', 'half_am', 'half_pm', 'sick', 'family', 'special'];
const DEDUCT_TYPES = new Set<VacationTypeId>(['annual', 'half_am', 'half_pm']);

const JUNE_FIRST_DAY = 1;
const JUNE_TOTAL = 30;
const WEEKENDS = new Set([1, 7, 8, 14, 15, 21, 22, 28, 29]);

const VacationRequest: React.FC = () => {
  const { t, tArray } = useSettings();
  const daysShort = tArray('vacation.daysShort');
  const applyTips = tArray('vacation.applyTips');

  const vacationTypes = VACATION_TYPE_IDS.map(id => ({
    id,
    label: t(`vacation.types.${id}.label` as TranslationKey),
    desc: t(`vacation.types.${id}.desc` as TranslationKey),
    deduct: DEDUCT_TYPES.has(id),
  }));

  const [selectedType, setSelectedType] = useState<VacationTypeId>('annual');
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [reason, setReason] = useState('');
  const [handover, setHandover] = useState('');

  const type = vacationTypes.find(vt => vt.id === selectedType)!;
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
    if (!startDate || !selectingEnd) {
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
        <div className="lg:col-span-2 space-y-6">
          <Card noPadding className="p-6 border-app-muted shadow-none">
            <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block mb-4">
              {t('vacation.typeLabel')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {vacationTypes.map(vt => (
                <button
                  key={vt.id}
                  onClick={() => {
                    setSelectedType(vt.id);
                    setStartDate(null);
                    setEndDate(null);
                    setSelectingEnd(false);
                  }}
                  className={`p-4 rounded border text-left transition-all cursor-pointer ${
                    selectedType === vt.id
                      ? 'border-2 border-blue-500 ring-4 ring-blue-500/10 bg-surface-elevated'
                      : 'border-app-muted bg-surface-muted/50 hover:bg-surface-elevated hover:border-app'
                  }`}
                >
                  <div className={`text-[13px] font-black mb-1 ${selectedType === vt.id ? 'text-blue-600' : 'text-app-secondary'}`}>
                    {vt.label}
                  </div>
                  <div className="text-[10px] font-bold text-app-muted leading-snug">{vt.desc}</div>
                  {vt.deduct && (
                    <div className="mt-2 text-[9px] font-black text-rose-400 uppercase tracking-wide">
                      {t('vacation.deductTag')}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          <Card noPadding className="p-6 border-app-muted shadow-none">
            <div className="flex items-center justify-between mb-5">
              <label className="text-[10px] font-black text-app-muted uppercase tracking-widest">
                {isHalfDay ? t('vacation.dateSelect') : t('vacation.periodSelect')}
              </label>
              <div className="flex items-center gap-3">
                <button className="w-7 h-7 flex items-center justify-center rounded border border-app text-app-muted hover:border-app transition-all cursor-pointer bg-surface-elevated">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[13px] font-black text-app-secondary">{t('calendar.monthYear')}</span>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-app text-app-muted hover:border-app transition-all cursor-pointer bg-surface-elevated">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {!isHalfDay && (
              <div className="flex items-center gap-4 mb-5 p-3 bg-surface-muted rounded border border-app-muted text-[12px] font-bold">
                <span className="text-app-muted uppercase tracking-widest text-[10px] font-black">{t('vacation.start')}</span>
                <span className="text-app-secondary">{formatDate(startDate)}</span>
                <span className="text-app-muted mx-1">→</span>
                <span className="text-app-muted uppercase tracking-widest text-[10px] font-black">{t('vacation.end')}</span>
                <span className="text-app-secondary">{formatDate(endDate)}</span>
                {requestedDays > 0 && (
                  <span className="ml-auto text-[12px] font-black text-blue-600">{requestedDays}일</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-7 mb-2">
              {daysShort.map((d, i) => (
                <div
                  key={i}
                  className={`text-center text-[10px] font-black uppercase tracking-widest py-1.5 ${
                    i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-app-muted'
                  }`}
                >
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
                        ? 'text-app-muted cursor-not-allowed'
                        : 'text-app-secondary hover:bg-surface-muted rounded'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card noPadding className="p-6 border-app-muted shadow-none">
            <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block mb-3">
              {t('vacation.reasonLabel')}
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={4}
              placeholder={t('vacation.reasonPlaceholder')}
              className="w-full px-4 py-3 bg-surface-muted border border-app rounded text-sm font-bold text-app-secondary placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-surface-elevated transition-all resize-none leading-relaxed"
            />
          </Card>

          <Card noPadding className="p-6 border-app-muted shadow-none">
            <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block mb-3">
              {t('vacation.handoverLabel')}{' '}
              <span className="text-app-muted normal-case tracking-normal">{t('common.optional')}</span>
            </label>
            <textarea
              value={handover}
              onChange={e => setHandover(e.target.value)}
              rows={3}
              placeholder={t('vacation.handoverPlaceholder')}
              className="w-full px-4 py-3 bg-surface-muted border border-app rounded text-sm font-bold text-app-secondary placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-surface-elevated transition-all resize-none leading-relaxed"
            />
          </Card>

          <div className="flex gap-4">
            <button
              className={`flex-1 py-4 text-[12px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer border-none ${
                startDate
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                  : 'bg-surface-muted text-app-muted cursor-not-allowed shadow-none'
              }`}
              disabled={!startDate}
            >
              <Send size={15} /> {t('vacation.submitRequest')}
            </button>
            <button className="px-8 py-4 bg-surface-muted text-app-secondary text-[12px] font-black uppercase tracking-widest rounded hover:bg-surface-muted transition-all cursor-pointer border-none">
              {t('common.cancel')}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <Card noPadding className="p-6 border-app-muted">
            <div className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-5">
              {t('vacation.myLeaveStatus')}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-app-muted">{t('vacation.totalLeave')}</span>
                <span className="text-[14px] font-black text-app-secondary">25일</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-app-muted">{t('vacation.usedLeave')}</span>
                <span className="text-[14px] font-black text-app-secondary">12일</span>
              </div>
              <div className="h-px bg-surface-muted" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-black text-app-secondary">{t('vacation.remainingLeave')}</span>
                <span className="text-[18px] font-black text-blue-600">{remaining}일</span>
              </div>
              {type.deduct && requestedDays > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
                  <span className="text-[11px] font-black text-blue-500">{t('vacation.afterApply')}</span>
                  <span className={`text-[16px] font-black ${afterUse < 0 ? 'text-rose-500' : 'text-blue-700'}`}>
                    {afterUse}일
                  </span>
                </div>
              )}
              {!type.deduct && (
                <div className="p-3 bg-emerald-50 rounded border border-emerald-100">
                  <span className="text-[11px] font-black text-emerald-600">{t('vacation.noDeduct')}</span>
                </div>
              )}
            </div>
          </Card>

          <Widget title={t('vacation.approvalLine')} color="blue">
            <div className="space-y-3">
              <ApproverItem step={1} name="김팀장" role="팀장" status={t('status.waiting')} />
              <ApproverItem step={2} name="이부장" role="부장" status={t('status.waiting')} />
            </div>
          </Widget>

          <Card noPadding className="p-5 border-app-muted shadow-none">
            <div className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-3">
              {t('vacation.applyNotices')}
            </div>
            <ul className="space-y-2.5">
              {applyTips.map(tip => (
                <li key={tip} className="flex items-start gap-2">
                  <Info size={12} className="text-app-muted shrink-0 mt-0.5" />
                  <span className="text-[11px] font-bold text-app-muted leading-snug">{tip}</span>
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
      <div className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-[10px] font-black text-app-muted shrink-0">
        {step}
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-black text-app-secondary">{name}</div>
        <div className="text-[10px] font-bold text-app-muted">{role}</div>
      </div>
      <span className="text-[10px] font-black text-app-muted bg-surface-muted px-2 py-1 rounded border border-app-muted">{status}</span>
    </div>
  );
}

export default VacationRequest;
