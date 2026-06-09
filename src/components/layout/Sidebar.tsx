import React from 'react';
import { 
  LayoutDashboard, CheckSquare, Calendar, Users, 
  MapPin, Heart, Bell, MessageSquare, 
  ShoppingCart, Contact2, Star, User2, Briefcase,
  FileText, Mail,
  Map, ClipboardList, TrendingUp, PlaneTakeoff
} from 'lucide-react';
import NavItem from '../ui/NavItem';
import NavGroup from '../ui/NavGroup';
import type { MainCategory, SubView } from '../../types';

interface SidebarProps {
  activeCategory: MainCategory;
  currentView: SubView;
  setCurrentView: (v: SubView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, currentView, setCurrentView }) => {
  const renderSidebarContent = () => {
    switch (activeCategory) {
      case 'MY_A9':
        return (
          <>
            <NavGroup title="내 정보">
              <NavItem icon={<LayoutDashboard size={18} />} label="Home" active={currentView === 'DASHBOARD'} onClick={() => setCurrentView('DASHBOARD')} />
              <NavItem icon={<User2 size={18} />} label="개인 정보" active={currentView === 'PROFILE'} onClick={() => setCurrentView('PROFILE')} />
              <NavItem icon={<Calendar size={18} />} label="회사 달력" active={currentView === 'CALENDAR'} onClick={() => setCurrentView('CALENDAR')} />
              <NavItem icon={<PlaneTakeoff size={18} />} label="연차 / 휴가" active={currentView === 'VACATION'} onClick={() => setCurrentView('VACATION')} />
            </NavGroup>
            <NavGroup title="인적 네트워크">
              <NavItem icon={<Map size={18} />} label="전사 조직도" active={currentView === 'ORG_CHART'} onClick={() => setCurrentView('ORG_CHART')} />
              <NavItem icon={<ClipboardList size={18} />} label="업무 명세표" active={currentView === 'WORK_SPEC'} onClick={() => setCurrentView('WORK_SPEC')} />
              <NavItem icon={<TrendingUp size={18} />} label="부서 목표" active={currentView === 'OKR'} onClick={() => setCurrentView('OKR')} />
            </NavGroup>
          </>
        );
      case 'APPROVAL':
        return (
          <NavGroup title="결재함">
            <NavItem icon={<FileText size={18} />} label="기안서 작성" active={currentView === 'APPROVAL_WRITE'} onClick={() => setCurrentView('APPROVAL_WRITE')} />
            <NavItem icon={<CheckSquare size={18} />} label="내가 받은 결재" active={currentView === 'APPROVAL_RECEIVED'} onClick={() => setCurrentView('APPROVAL_RECEIVED')} />
            <NavItem icon={<Mail size={18} />} label="내가 올린 결재" active={currentView === 'APPROVAL_SENT'} onClick={() => setCurrentView('APPROVAL_SENT')} />
          </NavGroup>
        );
      case 'RESERVATION':
        return (
          <NavGroup title="시설 예약">
            <NavItem icon={<LayoutDashboard size={18} />} label="Home" active={currentView === 'RESERVATION_HOME'} onClick={() => setCurrentView('RESERVATION_HOME')} />
            <NavItem icon={<Heart size={18} />} label="헬스 케어" active={currentView === 'HEALTHCARE'} onClick={() => setCurrentView('HEALTHCARE')} />
            <NavItem icon={<Users size={18} />} label="회의실" active={currentView === 'MEETING_ROOM'} onClick={() => setCurrentView('MEETING_ROOM')} />
            <NavItem icon={<Briefcase size={18} />} label="법인 차량" active={currentView === 'VEHICLE'} onClick={() => setCurrentView('VEHICLE')} />
            <NavItem icon={<MapPin size={18} />} label="속초 휴양소" active={currentView === 'RESORT'} onClick={() => setCurrentView('RESORT')} />
            <NavItem icon={<Star size={18} />} label="카페테리아" active={currentView === 'CAFETERIA'} onClick={() => setCurrentView('CAFETERIA')} />
            <NavItem icon={<MapPin size={18} />} label="옥상 캠핑장" active={currentView === 'CAMPING'} onClick={() => setCurrentView('CAMPING')} />
          </NavGroup>
        );
      case 'BOARD':
        return (
          <NavGroup title="게시판">
            <NavItem icon={<LayoutDashboard size={18} />} label="Home" active={currentView === 'BOARD_HOME'} onClick={() => setCurrentView('BOARD_HOME')} />
            <NavItem icon={<Bell size={18} />} label="I-ON Collective" active={currentView === 'COLLECTIVE'} onClick={() => setCurrentView('COLLECTIVE')} />
            <NavItem icon={<MessageSquare size={18} />} label="I-ON" active={currentView === 'ION'} onClick={() => setCurrentView('ION')} />
            <NavItem icon={<Briefcase size={18} />} label="B 회사 (자회사)" active={currentView === 'SUBSIDIARY_B'} onClick={() => setCurrentView('SUBSIDIARY_B')} />
            <NavItem icon={<Briefcase size={18} />} label="C 회사 (자회사)" active={currentView === 'SUBSIDIARY_C'} onClick={() => setCurrentView('SUBSIDIARY_C')} />
          </NavGroup>
        );
      case 'REQUEST':
        return (
          <NavGroup title="요청 관리">
            <NavItem icon={<LayoutDashboard size={18} />} label="Home" active={currentView === 'REQUEST_HOME'} onClick={() => setCurrentView('REQUEST_HOME')} />
            <NavItem icon={<ShoppingCart size={18} />} label="구매 신청" active={currentView === 'PURCHASE'} onClick={() => setCurrentView('PURCHASE')} />
            <NavItem icon={<FileText size={18} />} label="발급 신청" active={currentView === 'CERTIFICATE'} onClick={() => setCurrentView('CERTIFICATE')} />
          </NavGroup>
        );
      case 'CONTACT':
        return (
          <NavGroup title="연락처">
            <NavItem icon={<Contact2 size={18} />} label="직원 연락처" active={currentView === 'CONTACT_EMPLOYEE'} onClick={() => setCurrentView('CONTACT_EMPLOYEE')} />
            <NavItem icon={<Contact2 size={18} />} label="퇴사자 연락처" active={currentView === 'CONTACT_RETIRED'} onClick={() => setCurrentView('CONTACT_RETIRED')} />
            <NavItem icon={<Contact2 size={18} />} label="거래처 연락처" active={currentView === 'CONTACT_CLIENT'} onClick={() => setCurrentView('CONTACT_CLIENT')} />
          </NavGroup>
        );
      default:
        return <div className="px-6 py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">모듈 로딩 중</div>;
    }
  };

  return (
    <aside className="w-64 bg-[#fafafa] flex flex-col shrink-0 z-20 shadow-sm">
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
        {renderSidebarContent()}
      </nav>
    </aside>
  );
};

export default Sidebar;
