import React from 'react';
import { Bell } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

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

const NotificationModal: React.FC<NotificationModalProps> = ({ notifications }) => {
  const { t } = useSettings();

  return (
    <div className="absolute top-16 right-0 w-96 bg-surface-elevated rounded-xl shadow-2xl border border-app-muted overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-6 border-b border-app-muted flex items-center justify-between bg-surface-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-app uppercase tracking-tight">{t('notification.title')}</span>
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
              className={`p-5 border-b border-app-muted hover:bg-surface-muted transition-colors cursor-pointer group relative ${!n.isRead ? 'bg-blue-50/20' : ''}`}
            >
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-black text-app">{n.title}</span>
                    <span className="text-[10px] font-bold text-app-muted italic">{n.time}</span>
                  </div>
                  <p className="text-[12px] text-app-muted font-medium leading-relaxed line-clamp-2">
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
            <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-app-muted" />
            </div>
            <p className="text-sm font-bold text-app-muted uppercase tracking-widest">{t('notification.empty')}</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-surface-muted/50 text-center">
        <button className="text-[11px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest border-none bg-transparent cursor-pointer">
          {t('notification.markAllRead')}
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
