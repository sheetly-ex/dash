import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { MainCategory, SubView } from './types';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import OrgChart from './pages/OrgChart';
import Vacation from './pages/Vacation';
import WorkSpec from './pages/WorkSpec';
import Profile from './pages/Profile';
import OKR from './pages/OKR';
import VacationRequest from './pages/VacationRequest';
import ReservationHome from './pages/ReservationHome';
import ReservationDetail from './pages/ReservationDetail';
import BoardHome from './pages/BoardHome';
import BoardList from './pages/BoardList';
import RequestHome from './pages/RequestHome';
import PurchaseRequest from './pages/PurchaseRequest';
import CertificateRequest from './pages/CertificateRequest';
import PurchaseRequestDetail from './pages/PurchaseRequestDetail';
import CertificateRequestDetail from './pages/CertificateRequestDetail';
import ContactHome from './pages/ContactHome';
import ContactRetired from './pages/ContactRetired';
import ContactClient from './pages/ContactClient';
import ApprovalWrite from './pages/ApprovalWrite';
import ApprovalList from './pages/ApprovalList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MainCategory>('MY_A9');
  const [currentView, setCurrentView] = useState<SubView>('DASHBOARD');

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleCategoryChange = (cat: MainCategory) => {
    setActiveCategory(cat);
    // Reset to category's Home/Dashboard view
    if (cat === 'MY_A9') setCurrentView('DASHBOARD');
    else if (cat === 'APPROVAL') setCurrentView('APPROVAL_WRITE');
    else if (cat === 'RESERVATION') setCurrentView('RESERVATION_HOME');
    else if (cat === 'BOARD') setCurrentView('BOARD_HOME');
    else if (cat === 'REQUEST') setCurrentView('REQUEST_HOME');
    else if (cat === 'CONTACT') setCurrentView('CONTACT_EMPLOYEE');
  };

  const getCategoryTitle = (category: MainCategory): string => {
    const titles: Record<MainCategory, string> = {
      MY_A9: 'My A9',
      APPROVAL: '전자 결재',
      RESERVATION: '자원 예약',
      BOARD: '사내 게시판',
      REQUEST: '구매/발급 요청',
      CONTACT: '연락처'
    };
    return titles[category];
  };

  const renderMainContent = () => {
    // MY_A9
    if (currentView === 'DASHBOARD') return <Dashboard setCurrentView={setCurrentView} />;
    if (currentView === 'PROFILE') return <Profile />;
    if (currentView === 'CALENDAR') return <Calendar />;
    if (currentView === 'VACATION') return <Vacation />;
    if (currentView === 'VACATION_REQUEST') return <VacationRequest />;
    if (currentView === 'ORG_CHART') return <OrgChart />;
    if (currentView === 'WORK_SPEC') return <WorkSpec />;
    if (currentView === 'OKR') return <OKR />;

    // APPROVAL
    if (currentView === 'APPROVAL_WRITE') return <ApprovalWrite />;
    if (currentView === 'APPROVAL_RECEIVED') return <ApprovalList mode="received" />;
    if (currentView === 'APPROVAL_SENT') return <ApprovalList mode="sent" />;

    // RESERVATION
    if (currentView === 'RESERVATION_HOME') return <ReservationHome />;
    if (currentView === 'HEALTHCARE') return <ReservationDetail facilityKey="HEALTHCARE" />;
    if (currentView === 'MEETING_ROOM') return <ReservationDetail facilityKey="MEETING_ROOM" />;
    if (currentView === 'VEHICLE') return <ReservationDetail facilityKey="VEHICLE" />;
    if (currentView === 'RESORT') return <ReservationDetail facilityKey="RESORT" />;
    if (currentView === 'CAFETERIA') return <ReservationDetail facilityKey="CAFETERIA" />;
    if (currentView === 'CAMPING') return <ReservationDetail facilityKey="CAMPING" />;

    // BOARD
    if (currentView === 'BOARD_HOME') return <BoardHome />;
    if (currentView === 'COLLECTIVE') return <BoardList boardKey="COLLECTIVE" />;
    if (currentView === 'ION') return <BoardList boardKey="ION" />;
    if (currentView === 'SUBSIDIARY_B') return <BoardList boardKey="SUBSIDIARY_B" />;
    if (currentView === 'SUBSIDIARY_C') return <BoardList boardKey="SUBSIDIARY_C" />;

    // REQUEST
    if (currentView === 'REQUEST_HOME') return <RequestHome setCurrentView={setCurrentView} />;
    if (currentView === 'PURCHASE') return <PurchaseRequest />;
    if (currentView === 'CERTIFICATE') return <CertificateRequest />;
    if (currentView === 'PURCHASE_DETAIL') return <PurchaseRequestDetail setCurrentView={setCurrentView} />;
    if (currentView === 'CERTIFICATE_DETAIL') return <CertificateRequestDetail setCurrentView={setCurrentView} />;

    // CONTACT
    if (currentView === 'CONTACT_EMPLOYEE') return <ContactHome />;
    if (currentView === 'CONTACT_RETIRED') return <ContactRetired />;
    if (currentView === 'CONTACT_CLIENT') return <ContactClient />;

    return null;
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      DASHBOARD: '대시보드',
      PROFILE: '개인 정보',
      CALENDAR: '회사 달력',
      VACATION: '연차 현황',
      VACATION_REQUEST: '휴가 신청',
      ORG_CHART: '전사 조직도',
      WORK_SPEC: '업무 명세표',
      OKR: '부서 목표',
      APPROVAL_WRITE: '기안서 작성',
      APPROVAL_RECEIVED: '내가 받은 결재',
      APPROVAL_SENT: '내가 올린 결재',
      RESERVATION_HOME: '자원 예약 Home',
      HEALTHCARE: '헬스 케어',
      MEETING_ROOM: '회의실 예약',
      VEHICLE: '법인 차량 예약',
      RESORT: '속초 휴양소',
      CAFETERIA: '카페테리아',
      CAMPING: '옥상 캠핑장',
      BOARD_HOME: '게시판 Home',
      COLLECTIVE: 'I-ON Collective',
      ION: 'I-ON 게시판',
      SUBSIDIARY_B: 'B 회사 게시판',
      SUBSIDIARY_C: 'C 회사 게시판',
      REQUEST_HOME: '요청 관리 Home',
      PURCHASE: '구매 신청',
      CERTIFICATE: '발급 신청',
      PURCHASE_DETAIL: '구매 요청 상세',
      CERTIFICATE_DETAIL: '발급 요청 상세',
      CONTACT_EMPLOYEE: '직원 연락처',
      CONTACT_RETIRED: '퇴사자 연락처',
      CONTACT_CLIENT: '거래처 연락처'
    };
    return titles[currentView] || getCategoryTitle(activeCategory);
  };

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] text-[#1e293b] font-sans overflow-hidden">
      <Header
        activeCategory={activeCategory}
        currentView={currentView}
        onCategoryChange={handleCategoryChange}
        onLogout={() => setIsLoggedIn(false)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeCategory={activeCategory}
          currentView={currentView}
          setCurrentView={setCurrentView}
          getCategoryTitle={getCategoryTitle}
        />

        <main className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 scrollbar-hide">
            <div className="max-w-screen-2xl mx-auto">
              {/* Context Header */}
              <div className="mb-10">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  <span>워크스페이스</span>
                  <ChevronRight size={10} />
                  <span className="text-blue-600 uppercase">{activeCategory}</span>
                  {currentView !== 'DASHBOARD' && (
                    <>
                      <ChevronRight size={10} />
                      <span className="text-blue-600 uppercase">{currentView}</span>
                    </>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-6">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                      {getPageTitle()}
                    </h2>
                  </div>
                  <div className="flex gap-3">
                    {activeCategory === 'MY_A9' && currentView === 'DASHBOARD' && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">나의 재직 정보</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-sm">경영지원팀</span>
                          <span className="text-sm font-black text-slate-800">과장</span>
                          <span className="text-sm font-black text-blue-600">재직 5년차</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic View Rendering */}
              {renderMainContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
