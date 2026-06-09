import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  LogOut,
  LayoutDashboard,
  CheckSquare,
  MapPin,
  MessageSquare,
  ShoppingCart,
  Contact2,
  User,
} from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TopNavItem from '../ui/TopNavItem';
import NotificationModal from '../ui/NotificationModal';
import { NOTIFICATION_MOCKS } from '../../constants/mockData';
import type { MainCategory, SubView } from '../../types';

interface HeaderProps {
  activeCategory: MainCategory;
  currentView: SubView;
  onCategoryChange: (cat: MainCategory) => void;
  onLogout: () => void;
}

// ── Nav 항목 정의 ──────────────────────────────────────────────
interface NavItemConfig {
  id: MainCategory;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS_DEFAULT: NavItemConfig[] = [
  { id: 'MY_PAGE', label: '마이페이지', icon: <LayoutDashboard size={20} /> },
  { id: 'APPROVAL', label: '전자 결재', icon: <CheckSquare size={20} /> },
  { id: 'RESERVATION', label: '자원 예약', icon: <MapPin size={20} /> },
  { id: 'BOARD', label: '사내 게시판', icon: <MessageSquare size={20} /> },
  { id: 'REQUEST', label: '구매/발급 요청', icon: <ShoppingCart size={20} /> },
  { id: 'CONTACT', label: '연락처', icon: <Contact2 size={20} /> },
];

const LS_KEY = 'header-nav-order';

function loadOrder(): MainCategory[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return NAV_ITEMS_DEFAULT.map(n => n.id);
    const parsed: MainCategory[] = JSON.parse(raw);
    const validIds = new Set(NAV_ITEMS_DEFAULT.map(n => n.id));
    if (parsed.length === NAV_ITEMS_DEFAULT.length && parsed.every(id => validIds.has(id))) {
      return parsed;
    }
    localStorage.removeItem(LS_KEY);
    return NAV_ITEMS_DEFAULT.map(n => n.id);
  } catch {
    return NAV_ITEMS_DEFAULT.map(n => n.id);
  }
}

// ── 정렬 가능한 Nav 아이템 ─────────────────────────────────────
interface SortableNavItemProps {
  config: NavItemConfig;
  active: boolean;
  onClick: () => void;
}

function GripIcon() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="text-slate-300">
      {[0, 4].map(x =>
        [0, 4, 8].map(y => (
          <circle key={`${x}-${y}`} cx={x + 1.5} cy={y + 3} r="1.2" fill="currentColor" />
        ))
      )}
    </svg>
  );
}

function SortableNavItem({ config, active, onClick }: SortableNavItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: config.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center group/drag h-full"
    >
      {/* 드래그 핸들 — 호버 시 나타남 */}
      <div
        {...listeners}
        className="flex items-center justify-center w-4 h-full opacity-0 group-hover/drag:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none mr-0.5"
        title="드래그해서 순서 변경"
      >
        <GripIcon />
      </div>
      <TopNavItem icon={config.icon} label={config.label} active={active} onClick={onClick} />
    </div>
  );
}

// ── 메인 Header ───────────────────────────────────────────────
const Header: React.FC<HeaderProps> = ({ activeCategory, onCategoryChange, onLogout }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [navOrder, setNavOrder] = useState<MainCategory[]>(loadOrder);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = NOTIFICATION_MOCKS.filter(n => !n.isRead).length;

  // 드래그 센서: 4px 이상 이동 시 활성화 (그립 핸들 전용)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = navOrder.indexOf(active.id as MainCategory);
      const newIdx = navOrder.indexOf(over.id as MainCategory);
      const next = arrayMove(navOrder, oldIdx, newIdx);
      setNavOrder(next);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    }
  };

  const orderedItems = navOrder
    .map(id => NAV_ITEMS_DEFAULT.find(n => n.id === id)!)
    .filter(Boolean);

  return (
    <header className="h-18 bg-[#fafafa] text-slate-800 flex items-center justify-between px-8 z-30 shrink-0 shadow-sm">
      <div className="flex items-center gap-12 h-full">
        {/* 로고 */}
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => onCategoryChange('MY_PAGE')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onCategoryChange('MY_PAGE')}
        >
          <div className="w-10 h-10 bg-[#fafafa] rounded-md flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span className="text-blue-600 text-xs font-bold italic">Dash</span>
          </div>
        </div>

        {/* 드래그 가능한 Nav */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={navOrder} strategy={horizontalListSortingStrategy}>
            <nav className="flex items-center gap-2 h-full py-2">
              <GoogleAppButton
                href="https://chat.google.com"
                label="Google Chat"
                icon={<IconGoogleChat />}
              />
              <GoogleAppButton href="https://mail.google.com" label="Gmail" icon={<IconGmail />} />
              <GoogleAppButton
                href="https://calendar.google.com"
                label="Google Calendar"
                icon={<IconGoogleCalendar />}
              />
              {orderedItems.map(item => (
                <SortableNavItem
                  key={item.id}
                  config={item}
                  active={activeCategory === item.id}
                  onClick={() => onCategoryChange(item.id)}
                />
              ))}
            </nav>
          </SortableContext>
        </DndContext>
      </div>

      {/* 우측 영역 */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative group">
          <div className="w-56 h-9 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 px-3 group-focus-within:border-blue-400 group-focus-within:ring-2 group-focus-within:ring-blue-500/10 transition-all">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="검색..."
              className="bg-transparent text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none w-full"
            />
          </div>
        </div>

        {/* 알림 */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(prev => !prev)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <NotificationModal
              notifications={NOTIFICATION_MOCKS}
              onClose={() => setIsNotificationOpen(false)}
            />
          )}
        </div>

        {/* 프로필 드롭다운 */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(v => !v)}
            className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200/50 hover:bg-slate-100 transition-colors cursor-pointer group border-none"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
              <User size={16} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-slate-800">홍길동</span>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                i-on
              </span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#fafafa] border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[13px] font-black text-slate-800">홍길동</p>
                <p className="text-[11px] font-bold text-slate-400">i-on</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer border-none bg-transparent"
              >
                <LogOut size={15} />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ── Google 앱 버튼 ─────────────────────────────────────────────
function GoogleAppButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-2 h-full flex items-center justify-center relative group"
      aria-label={label}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95 shadow-xs border bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:text-slate-800">
        {icon}
      </div>
      <div className="absolute top-18 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-top bg-slate-900/95 backdrop-blur-md text-slate-200 text-xs font-black py-2 px-3 rounded-md border border-slate-800 shadow-2xl pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </a>
  );
}

function IconGmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        fill="white"
        stroke="#E0E0E0"
        strokeWidth="0.5"
      />
      <rect x="2" y="4" width="20" height="2" rx="1" fill="white" />
      <path
        d="M2 6L12 13L22 6"
        stroke="#EA4335"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M2 7.5L12 14L22 7.5" stroke="#FBBC05" strokeWidth="0" fill="none" />
      <path
        d="M3 5.5L12 12.5L21 5.5"
        stroke="#EA4335"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGoogleChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
        fill="#00AC47"
      />
      <circle cx="8" cy="10" r="1.5" fill="white" />
      <circle cx="12" cy="10" r="1.5" fill="white" />
      <circle cx="16" cy="10" r="1.5" fill="white" />
    </svg>
  );
}

function IconGoogleCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="4"
        width="20"
        height="18"
        rx="2"
        fill="white"
        stroke="#E0E0E0"
        strokeWidth="0.5"
      />
      <rect x="2" y="4" width="20" height="5" rx="2" fill="#1A73E8" />
      <rect x="2" y="7" width="20" height="2" fill="#1A73E8" />
      <rect x="7" y="2" width="2" height="4" rx="1" fill="#1A73E8" />
      <rect x="15" y="2" width="2" height="4" rx="1" fill="#1A73E8" />
      <text x="12" y="18" textAnchor="middle" fontSize="7" fontWeight="900" fill="#1A73E8">
        31
      </text>
    </svg>
  );
}

export default Header;
