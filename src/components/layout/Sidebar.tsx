import React from 'react';
import {
  LayoutDashboard, CheckSquare, Calendar, Users,
  MapPin, Heart, Bell, MessageSquare,
  ShoppingCart, Contact2, Star, User2, Briefcase,
  FileText, Mail,
  Map, ClipboardList, TrendingUp, PlaneTakeoff
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import NavItem from '../ui/NavItem';
import NavGroup from '../ui/NavGroup';
import type { MainCategory, SubView } from '../../types';

interface SidebarProps {
  activeCategory: MainCategory;
  currentView: SubView;
  setCurrentView: (v: SubView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, currentView, setCurrentView }) => {
  const { t } = useSettings();

  const renderSidebarContent = () => {
    switch (activeCategory) {
      case 'MY_PAGE':
        return (
          <>
            <NavGroup title={t('sidebar.myInfo')}>
              <NavItem icon={<LayoutDashboard size={18} />} label={t('common.home')} active={currentView === 'DASHBOARD'} onClick={() => setCurrentView('DASHBOARD')} />
              <NavItem icon={<User2 size={18} />} label={t('sidebar.profile')} active={currentView === 'PROFILE'} onClick={() => setCurrentView('PROFILE')} />
              <NavItem icon={<Calendar size={18} />} label={t('sidebar.calendar')} active={currentView === 'CALENDAR'} onClick={() => setCurrentView('CALENDAR')} />
              <NavItem icon={<PlaneTakeoff size={18} />} label={t('sidebar.vacation')} active={currentView === 'VACATION'} onClick={() => setCurrentView('VACATION')} />
            </NavGroup>
            <NavGroup title={t('sidebar.network')}>
              <NavItem icon={<Map size={18} />} label={t('sidebar.orgChart')} active={currentView === 'ORG_CHART'} onClick={() => setCurrentView('ORG_CHART')} />
              <NavItem icon={<ClipboardList size={18} />} label={t('sidebar.workSpec')} active={currentView === 'WORK_SPEC'} onClick={() => setCurrentView('WORK_SPEC')} />
              <NavItem icon={<TrendingUp size={18} />} label={t('sidebar.okr')} active={currentView === 'OKR'} onClick={() => setCurrentView('OKR')} />
            </NavGroup>
          </>
        );
      case 'APPROVAL':
        return (
          <NavGroup title={t('sidebar.approvalBox')}>
            <NavItem icon={<FileText size={18} />} label={t('sidebar.approvalWrite')} active={currentView === 'APPROVAL_WRITE'} onClick={() => setCurrentView('APPROVAL_WRITE')} />
            <NavItem icon={<CheckSquare size={18} />} label={t('sidebar.approvalReceived')} active={currentView === 'APPROVAL_RECEIVED'} onClick={() => setCurrentView('APPROVAL_RECEIVED')} />
            <NavItem icon={<Mail size={18} />} label={t('sidebar.approvalSent')} active={currentView === 'APPROVAL_SENT'} onClick={() => setCurrentView('APPROVAL_SENT')} />
          </NavGroup>
        );
      case 'RESERVATION':
        return (
          <NavGroup title={t('sidebar.facility')}>
            <NavItem icon={<LayoutDashboard size={18} />} label={t('common.home')} active={currentView === 'RESERVATION_HOME'} onClick={() => setCurrentView('RESERVATION_HOME')} />
            <NavItem icon={<Heart size={18} />} label={t('sidebar.healthcare')} active={currentView === 'HEALTHCARE'} onClick={() => setCurrentView('HEALTHCARE')} />
            <NavItem icon={<Users size={18} />} label={t('sidebar.meetingRoom')} active={currentView === 'MEETING_ROOM'} onClick={() => setCurrentView('MEETING_ROOM')} />
            <NavItem icon={<Briefcase size={18} />} label={t('sidebar.vehicle')} active={currentView === 'VEHICLE'} onClick={() => setCurrentView('VEHICLE')} />
            <NavItem icon={<MapPin size={18} />} label={t('sidebar.resort')} active={currentView === 'RESORT'} onClick={() => setCurrentView('RESORT')} />
            <NavItem icon={<Star size={18} />} label={t('sidebar.cafeteria')} active={currentView === 'CAFETERIA'} onClick={() => setCurrentView('CAFETERIA')} />
            <NavItem icon={<MapPin size={18} />} label={t('sidebar.camping')} active={currentView === 'CAMPING'} onClick={() => setCurrentView('CAMPING')} />
          </NavGroup>
        );
      case 'BOARD':
        return (
          <NavGroup title={t('sidebar.boardGroup')}>
            <NavItem icon={<LayoutDashboard size={18} />} label={t('common.home')} active={currentView === 'BOARD_HOME'} onClick={() => setCurrentView('BOARD_HOME')} />
            <NavItem icon={<Bell size={18} />} label="I-ON Collective" active={currentView === 'COLLECTIVE'} onClick={() => setCurrentView('COLLECTIVE')} />
            <NavItem icon={<MessageSquare size={18} />} label="I-ON" active={currentView === 'ION'} onClick={() => setCurrentView('ION')} />
            <NavItem icon={<Briefcase size={18} />} label={t('sidebar.subsidiaryB')} active={currentView === 'SUBSIDIARY_B'} onClick={() => setCurrentView('SUBSIDIARY_B')} />
            <NavItem icon={<Briefcase size={18} />} label={t('sidebar.subsidiaryC')} active={currentView === 'SUBSIDIARY_C'} onClick={() => setCurrentView('SUBSIDIARY_C')} />
          </NavGroup>
        );
      case 'REQUEST':
        return (
          <NavGroup title={t('sidebar.requestGroup')}>
            <NavItem icon={<LayoutDashboard size={18} />} label={t('common.home')} active={currentView === 'REQUEST_HOME'} onClick={() => setCurrentView('REQUEST_HOME')} />
            <NavItem icon={<ShoppingCart size={18} />} label={t('sidebar.purchase')} active={currentView === 'PURCHASE'} onClick={() => setCurrentView('PURCHASE')} />
            <NavItem icon={<FileText size={18} />} label={t('sidebar.certificate')} active={currentView === 'CERTIFICATE'} onClick={() => setCurrentView('CERTIFICATE')} />
          </NavGroup>
        );
      case 'CONTACT':
        return (
          <NavGroup title={t('sidebar.contactGroup')}>
            <NavItem icon={<Contact2 size={18} />} label={t('sidebar.contactEmployee')} active={currentView === 'CONTACT_EMPLOYEE'} onClick={() => setCurrentView('CONTACT_EMPLOYEE')} />
            <NavItem icon={<Contact2 size={18} />} label={t('sidebar.contactRetired')} active={currentView === 'CONTACT_RETIRED'} onClick={() => setCurrentView('CONTACT_RETIRED')} />
            <NavItem icon={<Contact2 size={18} />} label={t('sidebar.contactClient')} active={currentView === 'CONTACT_CLIENT'} onClick={() => setCurrentView('CONTACT_CLIENT')} />
          </NavGroup>
        );
      default:
        return <div className="px-6 py-10 text-center text-[10px] font-black text-app-muted uppercase tracking-widest">{t('common.loading')}</div>;
    }
  };

  return (
    <aside className="w-64 bg-surface flex flex-col shrink-0 z-20 shadow-sm border-r border-app-muted">
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
        {renderSidebarContent()}
      </nav>
    </aside>
  );
};

export default Sidebar;
