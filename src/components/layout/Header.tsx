import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import TopNavItem from "../ui/TopNavItem";
import NotificationModal from "../ui/NotificationModal";
import { NOTIFICATION_MOCKS } from "../../constants/mockData";
import type { MainCategory, SubView } from "../../types";

interface HeaderProps {
  activeCategory: MainCategory;
  currentView: SubView;
  onCategoryChange: (cat: MainCategory) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onCategoryChange,
  onLogout,
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = NOTIFICATION_MOCKS.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <header className="h-18 bg-[#fafafa] text-slate-800 flex items-center justify-between px-8 z-30 shrink-0 shadow-sm">
      <div className="flex items-center gap-12 h-full">
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => onCategoryChange("MY_A9")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onCategoryChange("MY_A9")}
        >
          <div className="w-10 h-10 bg-[#fafafa] rounded-md flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-slate-100">
            <span className="text-blue-600 text-xl font-black italic">A9</span>
          </div>
        </div>
        <nav className="flex items-center gap-2 h-full py-2">
          <GoogleAppButton
            href="https://chat.google.com"
            label="Google Chat"
            icon={<IconGoogleChat />}
          />
          <GoogleAppButton
            href="https://mail.google.com"
            label="Gmail"
            icon={<IconGmail />}
          />
          <GoogleAppButton
            href="https://calendar.google.com"
            label="Google Calendar"
            icon={<IconGoogleCalendar />}
          />
          <TopNavItem
            icon={<LayoutDashboard size={20} />}
            label="My A9"
            active={activeCategory === "MY_A9"}
            onClick={() => onCategoryChange("MY_A9")}
          />
          <TopNavItem
            icon={<CheckSquare size={20} />}
            label="전자 결재"
            active={activeCategory === "APPROVAL"}
            onClick={() => onCategoryChange("APPROVAL")}
          />
          <TopNavItem
            icon={<MapPin size={20} />}
            label="자원 예약"
            active={activeCategory === "RESERVATION"}
            onClick={() => onCategoryChange("RESERVATION")}
          />
          <TopNavItem
            icon={<MessageSquare size={20} />}
            label="사내 게시판"
            active={activeCategory === "BOARD"}
            onClick={() => onCategoryChange("BOARD")}
          />
          <TopNavItem
            icon={<ShoppingCart size={20} />}
            label="구매/발급 요청"
            active={activeCategory === "REQUEST"}
            onClick={() => onCategoryChange("REQUEST")}
          />
          <TopNavItem
            icon={<Contact2 size={20} />}
            label="연락처"
            active={activeCategory === "CONTACT"}
            onClick={() => onCategoryChange("CONTACT")}
          />
        </nav>
      </div>

      <div className="flex items-center gap-6 h-full">
        <div className="relative group hidden lg:block">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600"
            size={18}
          />
          <input
            type="text"
            placeholder="통합 검색..."
            className="bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-2 text-sm w-64 focus:w-80 focus:bg-[#fafafa] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none text-slate-800"
          />
        </div>
        <div
          className="flex items-center gap-4 border-l border-slate-200 pl-6 h-full py-4 relative"
          ref={notificationRef}
        >
          <div
            className="relative cursor-pointer hover:scale-110 transition-transform p-2"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Bell
              size={22}
              className={
                isNotificationOpen ? "text-blue-600" : "text-slate-500"
              }
            />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white text-[10px] font-black flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </div>

          {isNotificationOpen && (
            <NotificationModal
              notifications={NOTIFICATION_MOCKS}
              onClose={() => setIsNotificationOpen(false)}
            />
          )}

          <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200/50 hover:bg-slate-100 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-black shadow-lg text-white">
              관리
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800 uppercase">
                Administrator
              </span>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                본사 사무실
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-rose-600 transition-colors ml-2 cursor-pointer border-none bg-transparent"
          >
            <LogOut size={20} />
          </button>
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
      className="px-1.5 h-full flex items-center justify-center transition-all relative group rounded-full"
    >
      <div className="w-9 h-9 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95">
        {icon}
      </div>
      <div className="absolute top-18 left-1/2 -translate-x-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-top bg-slate-900/95 backdrop-blur-md text-slate-200 text-xs font-black py-2 px-3 rounded-md border border-slate-800 shadow-2xl pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </a>
  );
}

function IconGmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 6.5C2 5.4 2.9 4.5 4 4.5H20C21.1 4.5 22 5.4 22 6.5V17.5C22 18.6 21.1 19.5 20 19.5H4C2.9 19.5 2 18.6 2 17.5V6.5Z"
        fill="white"
        stroke="#E0E0E0"
        strokeWidth="0.5"
      />
      <path d="M2 6.5L12 13.5L22 6.5" stroke="none" />
      <path d="M4 6.5L12 12.5L20 6.5" fill="none" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 7.2L12 14L22 7.2V6.5C22 5.95 21.55 5.5 21 5.5H3C2.45 5.5 2 5.95 2 6.5V7.2Z"
        fill="#EA4335"
      />
      <path
        d="M2 8L2 17.5C2 18.05 2.45 18.5 3 18.5H21C21.55 18.5 22 18.05 22 17.5V8L12 14.8L2 8Z"
        fill="#34A853"
        opacity="0.15"
      />
      <path
        d="M2 8L12 14.8L22 8V17.5C22 18.05 21.55 18.5 21 18.5H3C2.45 18.5 2 18.05 2 17.5V8Z"
        fill="white"
      />
      <path
        d="M2 7.5L12 14L22 7.5"
        stroke="#FBBC05"
        strokeWidth="0"
        fill="none"
      />
      {/* Simplified M shape */}
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
      <text
        x="12"
        y="18"
        textAnchor="middle"
        fontSize="7"
        fontWeight="900"
        fill="#1A73E8"
      >
        31
      </text>
    </svg>
  );
}

export default Header;
