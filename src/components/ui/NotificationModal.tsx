import React from 'react';
import { X, Bell, CheckCircle2, Info, Calendar, Mail } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationModalProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notifications, onClose }) => {

  return (
    <div className="absolute top-16 right-0 w-96 bg-[#fafafa] rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-800 uppercase tracking-tight">알림 센터</span>
          <span className="bg-blue-600 text-[10px] font-black text-white px-2 py-0.5 rounded-full">
            {notifications.filter(n => !n.isRead).length}
          </span>
        </div>
      </div>
      <div className="max-h-120 overflow-y-auto scrollbar-hide">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!n.isRead ? 'bg-blue-50/20' : ''}`}
            >
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-black text-slate-800">{n.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 italic">{n.time}</span>
                  </div>
                  <p className="text-[12px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                </div>
              </div>
              {!n.isRead && (
                <div className="absolute top-5 right-5 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-slate-200" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">새로운 알림이 없습니다</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-slate-50/50 text-center">
        <button className="text-[11px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest border-none bg-transparent cursor-pointer">
          모든 알림 읽음 처리
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
