import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, CheckSquare, AlertTriangle,
  Mail, MailOpen, ChevronRight, Users, Briefcase,
  CalendarCheck, Plus, File, Folder, AlertCircle,
} from 'lucide-react';
import Widget from '../../components/ui/Widget';
import FloatingTeamButton from '../../components/ui/FloatingTeamButton';
import { useSettings } from '../../contexts/SettingsContext';
import type { TranslationKey } from '../../i18n';
import { useLocalizedData, NOTICE_TAG_COLORS } from '../../data/localized';
import type { SubView } from '../../types';

// ── Widget IDs ──────────────────────────────────────────────────
const ALL_WIDGET_IDS = ['schedule', 'mail', 'notice', 'approval', 'drive', 'empty'] as const;
type WidgetId = typeof ALL_WIDGET_IDS[number];

const LS_KEY = 'dashboard-widget-order-v1';

function loadOrder(): WidgetId[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed: unknown[] = JSON.parse(raw);
      const valid = (id: unknown): id is WidgetId => ALL_WIDGET_IDS.includes(id as WidgetId);
      if (
        Array.isArray(parsed) &&
        parsed.length === ALL_WIDGET_IDS.length &&
        parsed.every(valid) &&
        ALL_WIDGET_IDS.every(id => parsed.includes(id))
      ) return parsed as WidgetId[];
    }
  } catch { /* ignore */ }
  try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  return [...ALL_WIDGET_IDS];
}

function saveOrder(order: WidgetId[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(order)); } catch { /* ignore */ }
}

// ── Sortable wrapper ────────────────────────────────────────────
interface SortableItemProps {
  id: WidgetId;
  children: (dragListeners: React.HTMLAttributes<HTMLElement>, isDragging: boolean) => React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const dragListeners = { ...attributes, ...listeners };
  return (
    <div
      ref={setNodeRef}
      className="h-full"
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0 : 1 }}
    >
      {children(dragListeners, isDragging)}
    </div>
  );
}

type Localized = ReturnType<typeof useLocalizedData>;

type WidgetProps = {
  dragListeners: React.HTMLAttributes<HTMLElement>;
  isDragging?: boolean;
  onMore?: () => void;
  className?: string;
  t: (key: TranslationKey) => string;
  ld: Localized;
};

// ── 주요 업무 일정 ──────────────────────────────────────────────
function ScheduleWidget({ dragListeners, isDragging, onMore, className, t, ld }: WidgetProps) {
  return (
    <Widget title={t('dashboard.schedule')} dragListeners={dragListeners} isDragging={isDragging} onMoreClick={onMore} className={className}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-1 space-y-3 overflow-hidden">
          {ld.scheduleItems.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-surface-muted/60 rounded-md hover:bg-surface-muted/60 cursor-pointer group transition-colors">
              <div className={`w-1 h-8 rounded-full ${s.color} shrink-0`} />
              <div>
                <div className="text-[13px] font-black text-app group-hover:text-blue-600 transition-colors">{s.title}</div>
                <div className="text-[11px] font-bold text-app-muted italic">{s.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3 bg-surface-muted rounded-md border border-app-muted">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckSquare size={12} className="text-app-muted" />
              <span className="text-[9px] font-black text-app-muted uppercase tracking-widest">{t('dashboard.tasks')}</span>
            </div>
            <span className="text-xl font-black text-app">12<span className="text-xs ml-1 font-bold text-app-muted">{t('dashboard.count')}</span></span>
          </div>
          <div className="p-3 bg-rose-50/60 rounded-md border border-rose-100/60">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={12} className="text-rose-400" />
              <span className="text-[9px] font-black text-app-muted uppercase tracking-widest">{t('dashboard.deadline')}</span>
            </div>
            <span className="text-xl font-black text-rose-500">03<span className="text-xs ml-1 font-bold text-app-muted">{t('dashboard.count')}</span></span>
          </div>
        </div>
      </div>
    </Widget>
  );
}

// ── 최근 메일 ───────────────────────────────────────────────────
function MailWidget({ dragListeners, isDragging, onMore, className, t, ld }: WidgetProps) {
  return (
    <Widget title={t('dashboard.mail')} dragListeners={dragListeners} isDragging={isDragging} onMoreClick={onMore} className={className}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden space-y-0.5">
          {ld.mails.slice(0, 4).map((mail, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-app-muted last:border-0 hover:bg-surface-muted/50 -mx-2 px-2 rounded-md transition-colors cursor-pointer group">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${mail.isNew ? 'bg-blue-50' : 'bg-surface-muted'}`}>
                {mail.isNew ? <Mail size={13} className="text-blue-500" /> : <MailOpen size={13} className="text-app-muted" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[12px] ${mail.isNew ? 'font-black' : 'font-bold'} text-app truncate group-hover:text-blue-600 transition-colors`}>{mail.sender}</span>
                  <span className="text-[10px] font-bold text-app-muted shrink-0">{mail.time}</span>
                </div>
                <p className="text-[11px] font-bold text-app-muted truncate">{mail.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-app-muted flex justify-center shrink-0">
          <button className="flex items-center gap-1 text-[11px] font-black text-app-muted hover:text-blue-600 transition-colors uppercase tracking-widest cursor-pointer border-none bg-transparent">
            {t('dashboard.mailViewAll')} <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </Widget>
  );
}

// ── 전사 공지사항 ───────────────────────────────────────────────
function NoticeWidget({ dragListeners, isDragging, onMore, className, t, ld }: WidgetProps) {
  return (
    <Widget title={t('dashboard.notice')} dragListeners={dragListeners} isDragging={isDragging} onMoreClick={onMore} className={className}>
      <div className="space-y-0.5 overflow-hidden h-full">
        {ld.notices.map((notice, idx) => (
          <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-app-muted last:border-0 hover:bg-surface-muted/50 -mx-2 px-2 rounded-md transition-colors cursor-pointer group">
            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shrink-0 ${NOTICE_TAG_COLORS[notice.category] ?? 'bg-surface-muted text-app-muted'}`}>
              {notice.category}
            </span>
            <p className="text-[12px] font-bold text-app-secondary truncate flex-1 group-hover:text-blue-600 transition-colors">{notice.title}</p>
            {notice.important && <AlertCircle size={12} className="text-rose-400 shrink-0" />}
          </div>
        ))}
      </div>
    </Widget>
  );
}

// ── 결재 및 예약 현황 ───────────────────────────────────────────
function ApprovalWidget({ dragListeners, isDragging, onMore, className, t, ld }: WidgetProps) {
  return (
    <Widget title={t('dashboard.approval')} dragListeners={dragListeners} isDragging={isDragging} onMoreClick={onMore} className={className}>
      <div className="flex flex-col gap-3 h-full overflow-hidden">
        <div>
          <div className="text-[9px] font-black text-app-muted uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>{t('dashboard.todaySchedule')}</span><CalendarCheck size={11} className="text-app-muted" />
          </div>
          <div className="space-y-1.5">
            {ld.todaySchedule.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] font-bold text-app-secondary hover:text-blue-600 cursor-pointer transition-colors">
                <div className={`w-1.5 h-1.5 rounded-full ${s.color} shrink-0`} />
                <span className="flex-1 truncate">{s.title}</span>
                <span className="text-[10px] text-app-muted shrink-0">{s.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-app-muted" />
        <div>
          <div className="text-[9px] font-black text-app-muted uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>{t('dashboard.approvalStatus')}</span><Briefcase size={11} className="text-app-muted" />
          </div>
          <div className="space-y-1.5">
            {ld.approvals.map((a, idx) => (
              <div key={idx} className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.urgent ? 'bg-rose-400' : 'bg-surface-muted'}`} />
                <span className="text-[12px] font-bold text-app-secondary group-hover:text-blue-600 transition-colors flex-1">{a.label}</span>
                <span className={`text-[11px] font-black ${a.urgent ? 'text-rose-500' : 'text-app-muted'}`}>{a.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-app-muted" />
        <div>
          <div className="text-[9px] font-black text-app-muted uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>{t('dashboard.todayReservation')}</span><Users size={11} className="text-app-muted" />
          </div>
          <div className="space-y-1.5">
            {ld.todayReservations.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] font-bold text-app-secondary hover:text-blue-600 cursor-pointer transition-colors group">
                <div className={`w-1.5 h-1.5 rounded-full ${s.color} shrink-0`} />
                <span className="flex-1 truncate">{s.title}</span>
                <span className="text-[10px] text-app-muted shrink-0">{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Widget>
  );
}

// ── Google Drive ────────────────────────────────────────────────
const FILE_ICON_COLOR: Record<string, string> = {
  ppt:    'text-orange-400',
  xls:    'text-emerald-500',
  doc:    'text-blue-500',
  pdf:    'text-rose-400',
  folder: 'text-yellow-400',
};

function DriveWidget({ dragListeners, isDragging, onMore, className, t, ld }: WidgetProps) {
  return (
    <Widget title={t('dashboard.drive')} dragListeners={dragListeners} isDragging={isDragging} onMoreClick={onMore} className={className}>
      <div className="space-y-0.5 overflow-y-auto h-full">
        {ld.driveFiles.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-surface-muted cursor-pointer transition-colors group border-b border-app-muted last:border-0"
          >
            {f.type === 'folder'
              ? <Folder size={17} className={`${FILE_ICON_COLOR[f.type]} shrink-0`} />
              : <File   size={17} className={`${FILE_ICON_COLOR[f.type] ?? 'text-app-muted'} shrink-0`} />
            }
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-app-secondary truncate group-hover:text-blue-600 transition-colors">{f.name}</p>
              <p className="text-[10px] text-app-muted">{f.updated} · {f.size}</p>
            </div>
            <ChevronRight size={13} className="text-app-muted group-hover:text-blue-400 shrink-0 transition-colors" />
          </div>
        ))}
      </div>
    </Widget>
  );
}

// ── 빈 섹션 ─────────────────────────────────────────────────────
function EmptyWidget({ dragListeners, isDragging, className, t }: WidgetProps) {
  return (
    <Widget title={t('dashboard.empty')} dragListeners={dragListeners} isDragging={isDragging} headerRight={<span />} className={className}>
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-14 h-14 bg-surface-muted border-2 border-dashed border-app rounded-xl flex items-center justify-center mb-3">
          <Plus size={22} className="text-app-muted" />
        </div>
        <p className="text-[12px] font-black text-app-muted mb-1">{t('dashboard.emptyDesc')}</p>
        <p className="text-[11px] font-bold text-app-muted whitespace-pre-line">{t('dashboard.emptyHint')}</p>
      </div>
    </Widget>
  );
}

// ── 위젯 맵 ─────────────────────────────────────────────────────
const WIDGET_TITLE_KEYS: Record<WidgetId, TranslationKey> = {
  schedule: 'dashboard.schedule',
  mail:     'dashboard.mail',
  notice:   'dashboard.notice',
  approval: 'dashboard.approval',
  drive:    'dashboard.drive',
  empty:    'dashboard.empty',
};

function DragOverlayCard({ id, t }: { id: WidgetId; t: (key: TranslationKey) => string }) {
  return (
    <div className="bg-surface-elevated border-2 border-blue-200 rounded-[0.5rem] p-6 shadow-2xl shadow-blue-500/10 opacity-95 rotate-1 scale-[1.02]">
      <div className="flex items-center gap-2 mb-3">
        <GripVertical size={14} className="text-blue-400" />
        <span className="text-[12px] font-black text-blue-600 uppercase tracking-widest">{t(WIDGET_TITLE_KEYS[id])}</span>
      </div>
      <div className="h-20 bg-surface-muted rounded-md animate-pulse" />
    </div>
  );
}

// ── Dashboard ───────────────────────────────────────────────────
interface DashboardProps {
  setCurrentView: (v: SubView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
  const { t } = useSettings();
  const ld = useLocalizedData();
  const [order, setOrder] = useState<WidgetId[]>(loadOrder);
  const [activeId, setActiveId] = useState<WidgetId | null>(null);

  const widgetProps = { t, ld };

  const widgetComponents: Record<WidgetId, (p: WidgetProps) => React.ReactNode> = {
    schedule: p => <ScheduleWidget {...p} {...widgetProps} />,
    mail:     p => <MailWidget {...p} {...widgetProps} />,
    notice:   p => <NoticeWidget {...p} {...widgetProps} />,
    approval: p => <ApprovalWidget {...p} {...widgetProps} />,
    drive:    p => <DriveWidget {...p} {...widgetProps} />,
    empty:    p => <EmptyWidget {...p} t={t} ld={ld} />,
  };

  const widgetNavMap: Partial<Record<WidgetId, () => void>> = {
    schedule: () => setCurrentView('CALENDAR'),
    mail:     () => window.open('https://mail.google.com', '_blank'),
    notice:   () => setCurrentView('BOARD_HOME'),
    approval: () => setCurrentView('APPROVAL_RECEIVED'),
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 300, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(e.active.id as WidgetId);
  }, []);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (over && active.id !== over.id) {
      setOrder(prev => {
        const next = arrayMove(prev, prev.indexOf(active.id as WidgetId), prev.indexOf(over.id as WidgetId));
        saveOrder(next);
        return next;
      });
    }
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ gridAutoRows: '360px' }}
        >
          {order.map(id => (
            <SortableItem key={id} id={id}>
              {(dragListeners, isDragging) => widgetComponents[id]({ dragListeners, isDragging, onMore: widgetNavMap[id], className: 'h-full', t, ld })}
            </SortableItem>
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease-out' }}>
        {activeId ? <DragOverlayCard id={activeId} t={t} /> : null}
      </DragOverlay>

      <FloatingTeamButton />
    </DndContext>
  );
};

export default Dashboard;
