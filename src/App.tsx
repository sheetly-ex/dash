import { useState } from 'react';
import type { MainCategory, SubView } from './types';
import { useSettings } from './contexts/SettingsContext';
import type { TranslationKey } from './i18n';
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

const BREADCRUMB_KEYS: Record<SubView, [TranslationKey, TranslationKey]> = {
  DASHBOARD:            ['breadcrumb.myPage', 'breadcrumb.dashboard'],
  PROFILE:              ['breadcrumb.myPage', 'breadcrumb.profile'],
  CALENDAR:             ['breadcrumb.myPage', 'breadcrumb.calendar'],
  VACATION:             ['breadcrumb.myPage', 'breadcrumb.vacation'],
  VACATION_REQUEST:     ['breadcrumb.myPage', 'breadcrumb.vacationRequest'],
  ORG_CHART:            ['breadcrumb.myPage', 'breadcrumb.orgChart'],
  WORK_SPEC:            ['breadcrumb.myPage', 'breadcrumb.workSpec'],
  OKR:                  ['breadcrumb.myPage', 'breadcrumb.okr'],
  APPROVAL_WRITE:       ['breadcrumb.approval', 'breadcrumb.approvalWrite'],
  APPROVAL_RECEIVED:    ['breadcrumb.approval', 'breadcrumb.approvalReceived'],
  APPROVAL_SENT:        ['breadcrumb.approval', 'breadcrumb.approvalSent'],
  RESERVATION_HOME:     ['breadcrumb.reservation', 'breadcrumb.reservationHome'],
  HEALTHCARE:           ['breadcrumb.reservation', 'breadcrumb.healthcare'],
  MEETING_ROOM:         ['breadcrumb.reservation', 'breadcrumb.meetingRoom'],
  VEHICLE:              ['breadcrumb.reservation', 'breadcrumb.vehicle'],
  RESORT:               ['breadcrumb.reservation', 'breadcrumb.resort'],
  CAFETERIA:            ['breadcrumb.reservation', 'breadcrumb.cafeteria'],
  CAMPING:              ['breadcrumb.reservation', 'breadcrumb.camping'],
  BOARD_HOME:           ['breadcrumb.board', 'breadcrumb.boardHome'],
  COLLECTIVE:           ['breadcrumb.board', 'breadcrumb.collective'],
  ION:                  ['breadcrumb.board', 'breadcrumb.ion'],
  SUBSIDIARY_B:         ['breadcrumb.board', 'breadcrumb.subsidiaryB'],
  SUBSIDIARY_C:         ['breadcrumb.board', 'breadcrumb.subsidiaryC'],
  REQUEST_HOME:         ['breadcrumb.request', 'breadcrumb.requestHome'],
  PURCHASE:             ['breadcrumb.request', 'breadcrumb.purchase'],
  CERTIFICATE:          ['breadcrumb.request', 'breadcrumb.certificate'],
  PURCHASE_DETAIL:      ['breadcrumb.request', 'breadcrumb.purchaseDetail'],
  CERTIFICATE_DETAIL:   ['breadcrumb.request', 'breadcrumb.certificateDetail'],
  CONTACT_EMPLOYEE:     ['breadcrumb.contact', 'breadcrumb.contactEmployee'],
  CONTACT_RETIRED:      ['breadcrumb.contact', 'breadcrumb.contactRetired'],
  CONTACT_CLIENT:       ['breadcrumb.contact', 'breadcrumb.contactClient'],
};

function App() {
  const { t } = useSettings();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MainCategory>('MY_PAGE');
  const [currentView, setCurrentView] = useState<SubView>('DASHBOARD');

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleCategoryChange = (cat: MainCategory) => {
    setActiveCategory(cat);
    if (cat === 'MY_PAGE') setCurrentView('DASHBOARD');
    else if (cat === 'APPROVAL') setCurrentView('APPROVAL_WRITE');
    else if (cat === 'RESERVATION') setCurrentView('RESERVATION_HOME');
    else if (cat === 'BOARD') setCurrentView('BOARD_HOME');
    else if (cat === 'REQUEST') setCurrentView('REQUEST_HOME');
    else if (cat === 'CONTACT') setCurrentView('CONTACT_EMPLOYEE');
  };

  const renderMainContent = () => {
    if (currentView === 'DASHBOARD') return <Dashboard setCurrentView={setCurrentView} />;
    if (currentView === 'PROFILE') return <Profile />;
    if (currentView === 'CALENDAR') return <Calendar />;
    if (currentView === 'VACATION') return <Vacation />;
    if (currentView === 'ORG_CHART') return <OrgChart />;
    if (currentView === 'WORK_SPEC') return <WorkSpec />;
    if (currentView === 'OKR') return <OKR />;
    if (currentView === 'APPROVAL_WRITE') return <ApprovalWrite />;
    if (currentView === 'APPROVAL_RECEIVED') return <ApprovalList mode="received" />;
    if (currentView === 'APPROVAL_SENT') return <ApprovalList mode="sent" />;
    if (currentView === 'RESERVATION_HOME') return <ReservationHome />;
    if (currentView === 'HEALTHCARE') return <ReservationDetail facilityKey="HEALTHCARE" />;
    if (currentView === 'MEETING_ROOM') return <ReservationDetail facilityKey="MEETING_ROOM" />;
    if (currentView === 'VEHICLE') return <ReservationDetail facilityKey="VEHICLE" />;
    if (currentView === 'RESORT') return <ReservationDetail facilityKey="RESORT" />;
    if (currentView === 'CAFETERIA') return <ReservationDetail facilityKey="CAFETERIA" />;
    if (currentView === 'CAMPING') return <ReservationDetail facilityKey="CAMPING" />;
    if (currentView === 'BOARD_HOME') return <BoardHome setCurrentView={setCurrentView} />;
    if (currentView === 'COLLECTIVE') return <BoardList boardKey="COLLECTIVE" />;
    if (currentView === 'ION') return <BoardList boardKey="ION" />;
    if (currentView === 'SUBSIDIARY_B') return <BoardList boardKey="SUBSIDIARY_B" />;
    if (currentView === 'SUBSIDIARY_C') return <BoardList boardKey="SUBSIDIARY_C" />;
    if (currentView === 'REQUEST_HOME') return <RequestHome setCurrentView={setCurrentView} />;
    if (currentView === 'PURCHASE') return <PurchaseRequest />;
    if (currentView === 'CERTIFICATE') return <CertificateRequest />;
    if (currentView === 'PURCHASE_DETAIL') return <PurchaseRequestDetail setCurrentView={setCurrentView} />;
    if (currentView === 'CERTIFICATE_DETAIL') return <CertificateRequestDetail setCurrentView={setCurrentView} />;
    if (currentView === 'CONTACT_EMPLOYEE') return <ContactHome />;
    if (currentView === 'CONTACT_RETIRED') return <ContactRetired />;
    if (currentView === 'CONTACT_CLIENT') return <ContactClient />;
    return null;
  };

  const [crumbA, crumbB] = BREADCRUMB_KEYS[currentView] ?? ['breadcrumb.myPage', 'breadcrumb.dashboard'];

  return (
    <div className="flex flex-col h-screen bg-app text-app font-sans overflow-hidden">
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
        />

        <main className="flex-1 flex flex-col overflow-hidden bg-app">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 scrollbar-hide">
            <div className="max-w-screen-2xl mx-auto space-y-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-app-muted select-none">
                <span>{t(crumbA)}</span>
                <span>/</span>
                <span className="text-app-muted">{t(crumbB)}</span>
              </div>
              {renderMainContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
