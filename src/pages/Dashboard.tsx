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
  Mail, MailOpen, ChevronRight, Clock, Users, Briefcase,
  CalendarCheck, Plus, File, Folder, AlertCircle,
} from 'lucide-react';
import Widget from '../components/ui/Widget';
import FloatingTeamButton from '../components/ui/FloatingTeamButton';
import { MAILS, NOTICES, APPROVALS } from '../constants/mockData';
import type { SubView } from '../types';

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
  children: (handleProps: React.HTMLAttributes<HTMLElement>) => React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      className="h-full"
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0 : 1 }}
    >
      {children({ ...attributes, ...listeners })}
    </div>
  );
}

function DragHandle(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <button
      {...props}
      className="p-1.5 rounded text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-all cursor-grab active:cursor-grabbing touch-none border-none bg-transparent"
      title="드래그하여 이동"
    >
      <GripVertical size={14} />
    </button>
  );
}

// ── 주요 업무 일정 ──────────────────────────────────────────────
function ScheduleWidget({ handleProps, onMore, className }: WidgetProps) {
  return (
    <Widget title="주요 업무 일정" headerExtra={<DragHandle {...handleProps} />} onMoreClick={onMore} className={className}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-1 space-y-3 overflow-hidden">
          {[
            { color: 'bg-blue-600', title: '주간 전략 회의', time: '09:30 · 대회의실 A' },
            { color: 'bg-indigo-400', title: '파트너사 비즈니스 미팅', time: '14:00 · 외부 (강남역 인근)' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/60 rounded-md hover:bg-slate-100/60 cursor-pointer group transition-colors">
              <div className={`w-1 h-8 rounded-full ${s.color} shrink-0`} />
              <div>
                <div className="text-[13px] font-black text-slate-800 group-hover:text-blue-600 transition-colors">{s.title}</div>
                <div className="text-[11px] font-bold text-slate-400 italic">{s.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckSquare size={12} className="text-slate-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">진행중 과업</span>
            </div>
            <span className="text-xl font-black text-slate-800">12<span className="text-xs ml-1 font-bold text-slate-400">개</span></span>
          </div>
          <div className="p-3 bg-rose-50/60 rounded-md border border-rose-100/60">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={12} className="text-rose-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">예정 마감</span>
            </div>
            <span className="text-xl font-black text-rose-500">03<span className="text-xs ml-1 font-bold text-slate-400">개</span></span>
          </div>
        </div>
      </div>
    </Widget>
  );
}

// ── 최근 메일 ───────────────────────────────────────────────────
function MailWidget({ handleProps, onMore, className }: WidgetProps) {
  return (
    <Widget title="최근 메일 수신함" headerExtra={<DragHandle {...handleProps} />} onMoreClick={onMore} className={className}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden space-y-0.5">
          {MAILS.slice(0, 4).map((mail, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 -mx-2 px-2 rounded-md transition-colors cursor-pointer group">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${mail.isNew ? 'bg-blue-50' : 'bg-slate-50'}`}>
                {mail.isNew ? <Mail size={13} className="text-blue-500" /> : <MailOpen size={13} className="text-slate-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[12px] ${mail.isNew ? 'font-black' : 'font-bold'} text-slate-800 truncate group-hover:text-blue-600 transition-colors`}>{mail.sender}</span>
                  <span className="text-[10px] font-bold text-slate-300 shrink-0">{mail.time}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 truncate">{mail.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-slate-50 flex justify-center shrink-0">
          <button className="flex items-center gap-1 text-[11px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest cursor-pointer border-none bg-transparent">
            메일함 전체보기 <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </Widget>
  );
}

// ── 전사 공지사항 ───────────────────────────────────────────────
const NOTICE_TAG_COLORS: Record<string, string> = {
  '필독': 'bg-rose-50 text-rose-600',
  '인사': 'bg-blue-50 text-blue-600',
  '복지': 'bg-emerald-50 text-emerald-600',
  'IT':   'bg-indigo-50 text-indigo-600',
};

function NoticeWidget({ handleProps, onMore, className }: WidgetProps) {
  return (
    <Widget title="전사 공지사항" headerExtra={<DragHandle {...handleProps} />} onMoreClick={onMore} className={className}>
      <div className="space-y-0.5 overflow-hidden h-full">
        {NOTICES.map((notice, idx) => (
          <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 -mx-2 px-2 rounded-md transition-colors cursor-pointer group">
            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shrink-0 ${NOTICE_TAG_COLORS[notice.category] ?? 'bg-slate-50 text-slate-500'}`}>
              {notice.category}
            </span>
            <p className="text-[12px] font-bold text-slate-700 truncate flex-1 group-hover:text-blue-600 transition-colors">{notice.title}</p>
            {notice.important && <AlertCircle size={12} className="text-rose-400 shrink-0" />}
          </div>
        ))}
      </div>
    </Widget>
  );
}

// ── 결재 및 예약 현황 ───────────────────────────────────────────
function ApprovalWidget({ handleProps, onMore, className }: WidgetProps) {
  return (
    <Widget title="결재 및 예약 현황" headerExtra={<DragHandle {...handleProps} />} onMoreClick={onMore} className={className}>
      <div className="flex flex-col gap-3 h-full overflow-hidden">
        <div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>오늘의 일정</span><CalendarCheck size={11} className="text-slate-300" />
          </div>
          <div className="space-y-1.5">
            {[['bg-blue-500', '주간 전략 회의', '09:30'], ['bg-indigo-400', '파트너사 미팅', '14:00']].map(([c, t, tm], i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] font-bold text-slate-700 hover:text-blue-600 cursor-pointer transition-colors">
                <div className={`w-1.5 h-1.5 rounded-full ${c} shrink-0`} />
                <span className="flex-1 truncate">{t}</span>
                <span className="text-[10px] text-slate-400 shrink-0">{tm}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-50" />
        <div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>결재 파이프라인</span><Briefcase size={11} className="text-slate-300" />
          </div>
          <div className="space-y-1.5">
            {APPROVALS.map((a, idx) => (
              <div key={idx} className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.urgent ? 'bg-rose-400' : 'bg-slate-200'}`} />
                <span className="text-[12px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors flex-1">{a.label}</span>
                <span className={`text-[11px] font-black ${a.urgent ? 'text-rose-500' : 'text-slate-400'}`}>{a.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-50" />
        <div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>오늘의 예약</span><Users size={11} className="text-slate-300" />
          </div>
          <div className="space-y-1.5">
            {[['bg-blue-100', '402호 회의실', '14:00'], ['bg-slate-100', '법인차량-04', '16:00']].map(([c, t, tm], i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] font-bold text-slate-700 hover:text-blue-600 cursor-pointer transition-colors group">
                <div className={`w-1.5 h-1.5 rounded-full ${c} shrink-0`} />
                <span className="flex-1 truncate">{t}</span>
                <span className="text-[10px] text-slate-400 shrink-0">{tm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Widget>
  );
}

// ── Google Drive ────────────────────────────────────────────────
const DRIVE_FILES = [
  { name: '2026 Q2 사업계획서.pptx', type: 'ppt',    updated: '어제',   size: '4.2 MB' },
  { name: '경영지원팀',              type: 'folder', updated: '2일 전', size: '—' },
  { name: '2026 예산안_최종.xlsx',   type: 'xls',    updated: '3일 전', size: '1.8 MB' },
  { name: '인사 규정 개정안.docx',   type: 'doc',    updated: '1주 전', size: '890 KB' },
  { name: '팀 워크샵 사진 모음',     type: 'folder', updated: '2주 전', size: '—' },
  { name: '온보딩 가이드_v3.pdf',    type: 'pdf',    updated: '3주 전', size: '2.1 MB' },
];

const FILE_ICON_COLOR: Record<string, string> = {
  ppt:    'text-orange-400',
  xls:    'text-emerald-500',
  doc:    'text-blue-500',
  pdf:    'text-rose-400',
  folder: 'text-yellow-400',
};

function DriveWidget({ handleProps, onMore, className }: WidgetProps) {
  return (
    <Widget title="Google Drive" headerExtra={<DragHandle {...handleProps} />} onMoreClick={onMore} className={className}>
      <div className="space-y-0.5 overflow-y-auto h-full">
        {DRIVE_FILES.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group border-b border-slate-50 last:border-0"
          >
            {f.type === 'folder'
              ? <Folder size={17} className={`${FILE_ICON_COLOR[f.type]} shrink-0`} />
              : <File   size={17} className={`${FILE_ICON_COLOR[f.type] ?? 'text-slate-300'} shrink-0`} />
            }
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">{f.name}</p>
              <p className="text-[10px] text-slate-300">{f.updated} · {f.size}</p>
            </div>
            <ChevronRight size={13} className="text-slate-200 group-hover:text-blue-400 shrink-0 transition-colors" />
          </div>
        ))}
      </div>
    </Widget>
  );
}

// ── 빈 섹션 ─────────────────────────────────────────────────────
function EmptyWidget({ handleProps, className }: WidgetProps) {
  return (
    <Widget title="빈 섹션" headerExtra={<DragHandle {...handleProps} />} headerRight={<span />} className={className}>
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-14 h-14 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center mb-3">
          <Plus size={22} className="text-slate-300" />
        </div>
        <p className="text-[12px] font-black text-slate-400 mb-1">비어있는 섹션</p>
        <p className="text-[11px] font-bold text-slate-300">위젯을 드래그하여 배치하거나<br/>새 위젯을 추가할 수 있습니다</p>
      </div>
    </Widget>
  );
}

// ── 위젯 맵 ─────────────────────────────────────────────────────
type WidgetProps = { handleProps: React.HTMLAttributes<HTMLElement>; onMore?: () => void; className?: string };

const WIDGET_COMPONENTS: Record<WidgetId, (p: WidgetProps) => React.ReactNode> = {
  schedule: p => <ScheduleWidget {...p} />,
  mail:     p => <MailWidget {...p} />,
  notice:   p => <NoticeWidget {...p} />,
  approval: p => <ApprovalWidget {...p} />,
  drive:    p => <DriveWidget {...p} />,
  empty:    p => <EmptyWidget {...p} />,
};

const WIDGET_TITLES: Record<WidgetId, string> = {
  schedule: '주요 업무 일정',
  mail:     '최근 메일 수신함',
  notice:   '전사 공지사항',
  approval: '결재 및 예약 현황',
  drive:    'Google Drive',
  empty:    '빈 섹션',
};

// ── 드래그 ghost ────────────────────────────────────────────────
function DragOverlayCard({ id }: { id: WidgetId }) {
  return (
    <div className="bg-[#fafafa] border-2 border-blue-200 rounded-[0.5rem] p-6 shadow-2xl shadow-blue-500/10 opacity-95 rotate-1 scale-[1.02]">
      <div className="flex items-center gap-2 mb-3">
        <GripVertical size={14} className="text-blue-400" />
        <span className="text-[12px] font-black text-blue-600 uppercase tracking-widest">{WIDGET_TITLES[id]}</span>
      </div>
      <div className="h-20 bg-slate-50 rounded-md animate-pulse" />
    </div>
  );
}

// ── Dashboard ───────────────────────────────────────────────────
interface DashboardProps {
  setCurrentView: (v: SubView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
  const [order, setOrder] = useState<WidgetId[]>(loadOrder);
  const [activeId, setActiveId] = useState<WidgetId | null>(null);

  const widgetNavMap: Partial<Record<WidgetId, () => void>> = {
    schedule: () => setCurrentView('CALENDAR'),
    mail:     () => window.open('https://mail.google.com', '_blank'),
    notice:   () => setCurrentView('BOARD_HOME'),
    approval: () => setCurrentView('APPROVAL_RECEIVED'),
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
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
              {handleProps => WIDGET_COMPONENTS[id]({ handleProps, onMore: widgetNavMap[id], className: 'h-full' })}
            </SortableItem>
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease-out' }}>
        {activeId ? <DragOverlayCard id={activeId} /> : null}
      </DragOverlay>

      <FloatingTeamButton />
    </DndContext>
  );
};

export default Dashboard;
