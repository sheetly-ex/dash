import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import type { TranslationKey } from '../../i18n';
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
import { useLocalizedData } from '../../data/localized';
import type { MainCategory, SubView } from '../../types';

interface HeaderProps {
  activeCategory: MainCategory;
  currentView: SubView;
  onCategoryChange: (cat: MainCategory) => void;
  onLogout: () => void;
}

interface NavItemConfig {
  id: MainCategory;
  labelKey: TranslationKey;
  icon: React.ReactNode;
}

const NAV_ITEMS_DEFAULT: NavItemConfig[] = [
  { id: 'MY_PAGE', labelKey: 'nav.myPage', icon: <LayoutDashboard size={20} /> },
  { id: 'APPROVAL', labelKey: 'nav.approval', icon: <CheckSquare size={20} /> },
  { id: 'RESERVATION', labelKey: 'nav.reservation', icon: <MapPin size={20} /> },
  { id: 'BOARD', labelKey: 'nav.board', icon: <MessageSquare size={20} /> },
  { id: 'REQUEST', labelKey: 'nav.request', icon: <ShoppingCart size={20} /> },
  { id: 'CONTACT', labelKey: 'nav.contact', icon: <Contact2 size={20} /> },
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

interface SortableNavItemProps {
  config: NavItemConfig;
  label: string;
  active: boolean;
  onClick: () => void;
  dragHint: string;
}

function SortableNavItem({ config, label, active, onClick, dragHint }: SortableNavItemProps) {
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
      {...listeners}
      className={`flex items-center h-full touch-none select-none cursor-grab active:cursor-grabbing transition-all ${isDragging ? 'scale-110' : ''}`}
      title={dragHint}
    >
      <TopNavItem icon={config.icon} label={label} active={active} onClick={onClick} />
    </div>
  );
}

function ProfileOptionBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-black transition-colors cursor-pointer border
        ${
          active
            ? 'bg-slate-800 text-white border-slate-800 dark:bg-blue-600 dark:border-blue-600'
            : 'bg-surface-muted text-app-secondary border-app hover-surface'
        }`}
    >
      {children}
    </button>
  );
}

const Header: React.FC<HeaderProps> = ({ activeCategory, onCategoryChange, onLogout }) => {
  const { theme, language, setTheme, setLanguage, t } = useSettings();
  const { user, notifications } = useLocalizedData();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [navOrder, setNavOrder] = useState<MainCategory[]>(loadOrder);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 300, tolerance: 8 },
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

  const orderedItems = useMemo(
    () => navOrder.map(id => NAV_ITEMS_DEFAULT.find(n => n.id === id)!).filter(Boolean),
    [navOrder]
  );

  return (
    <header className="h-18 bg-surface border-b border-app-muted text-app flex items-center justify-between px-8 z-30 shrink-0 shadow-sm">
      <div className="flex items-center gap-12 h-full">
        <div
          className="flex items-center gap-3 group cursor-pointer "
          onClick={() => onCategoryChange('MY_PAGE')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onCategoryChange('MY_PAGE')}
        >
          <span className="text-blue-600 text-sm font-bold italic">Dash</span>
        </div>

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
                  label={t(item.labelKey)}
                  active={activeCategory === item.id}
                  onClick={() => onCategoryChange(item.id)}
                  dragHint={t('header.dragNavHint')}
                />
              ))}
            </nav>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="w-56 h-9 bg-surface-muted border border-app rounded-lg flex items-center gap-3 px-3 group-focus-within:border-blue-400 group-focus-within:ring-2 group-focus-within:ring-blue-500/10 transition-all">
            <Search size={14} className="text-app-muted shrink-0" />
            <input
              type="text"
              placeholder={t('common.search')}
              className="bg-transparent text-sm font-bold text-app-secondary placeholder:text-app-muted dark:placeholder:text-app-muted outline-none w-full"
            />
          </div>
        </div>

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(prev => !prev)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-surface-muted border border-app text-app-muted dark:text-app-muted hover:text-app hover:border-app dark:hover:border-slate-600 transition-all cursor-pointer"
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
              notifications={notifications}
              onClose={() => setIsNotificationOpen(false)}
            />
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(v => !v)}
            className="flex items-center gap-3 bg-surface-muted px-4 py-1.5 rounded-lg border border-app/50 hover:bg-surface-muted transition-colors cursor-pointer group border-none"
          >
            <div className="w-8 h-8 rounded-full bg-surface-muted dark:bg-slate-600 flex items-center justify-center text-app-muted dark:text-app-muted">
              <User size={16} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-app">{user.name}</span>
              <span className="text-[10px] font-bold text-app-muted group-hover:text-blue-600 transition-colors">
                {user.company}
              </span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-surface-elevated border border-app rounded-xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-app-muted">
                <p className="text-[13px] font-black text-app">{user.name}</p>
                <p className="text-[11px] font-bold text-app-muted">{user.company}</p>
              </div>

              <div className="px-4 py-3 border-b border-app-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={13} className="text-app-muted" />
                  <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">
                    {t('common.language')}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <ProfileOptionBtn active={language === 'ko'} onClick={() => setLanguage('ko')}>
                    {t('common.korean')}
                  </ProfileOptionBtn>
                  <ProfileOptionBtn active={language === 'en'} onClick={() => setLanguage('en')}>
                    {t('common.english')}
                  </ProfileOptionBtn>
                </div>
              </div>

              <div className="px-4 py-3 border-b border-app-muted">
                <div className="flex items-center gap-2 mb-2">
                  {theme === 'light' ? (
                    <Sun size={13} className="text-app-muted" />
                  ) : (
                    <Moon size={13} className="text-app-muted" />
                  )}
                  <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">
                    {t('common.theme')}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <ProfileOptionBtn active={theme === 'light'} onClick={() => setTheme('light')}>
                    <Sun size={12} /> {t('common.light')}
                  </ProfileOptionBtn>
                  <ProfileOptionBtn active={theme === 'dark'} onClick={() => setTheme('dark')}>
                    <Moon size={12} /> {t('common.dark')}
                  </ProfileOptionBtn>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer border-none bg-transparent"
              >
                <LogOut size={15} />
                {t('common.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

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
      <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group-active:scale-95 shadow-xs border bg-surface-muted text-app-muted border-app-muted hover:bg-surface-muted hover:text-app">
        {icon}
      </div>
      <div className="absolute top-18 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-top bg-slate-900/95 backdrop-blur-md text-app-muted text-xs font-black py-2 px-3 rounded-md border border-slate-800 shadow-2xl pointer-events-none z-50">
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
