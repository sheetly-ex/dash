import React from 'react';
import { ShoppingCart, FileText, CheckCircle2, Clock, ChevronRight, Package } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import StatusCard from '../components/ui/StatusCard';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import type { SubView } from '../types';

const RequestHome: React.FC<{ setCurrentView: (v: SubView) => void }> = ({ setCurrentView }) => {
  const purchaseRequests = [
    { id: 1, title: 'MacBook Pro 16인치', date: '06.01' },
    { id: 2, title: '사무용 모니터 27인치', date: '05.28' },
    { id: 3, title: '매직 키보드 (한글)', date: '05.25' },
  ];

  const documentRequests = [
    { id: 1, title: '재직증명서 (은행제출)', date: '05.30' },
    { id: 2, title: '원천징수영수증', date: '05.20' },
  ];

  const inProgressRequests = [
    { id: 1, title: '허먼밀러 에어론 의자', status: '결재중' },
    { id: 2, title: 'JetBrains 라이선스', status: '검토중' },
    { id: 3, title: '명함 제작 (재주문)', status: '승인완료' },
  ];

  const completedRequests = [
    { id: 1, title: '경력증명서', date: '05.15' },
    { id: 2, title: '무선 마우스 교체', date: '05.10' },
    { id: 3, title: '워크샵 용품 구매', date: '05.08' },
  ];

  return (
    <div className="space-y-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatusCard title="구매 요청" value="05건" icon={<ShoppingCart size={18} />} color="blue" items={purchaseRequests.map(i => ({ ...i, secondary: i.date }))} />
        <StatusCard title="서류 발급" value="02건" icon={<FileText size={18} />} color="emerald" items={documentRequests.map(i => ({ ...i, secondary: i.date }))} />
        <StatusCard title="진행 중" value="03건" icon={<Clock size={18} />} color="indigo" items={inProgressRequests.map(i => ({ ...i, secondary: i.status }))} />
        <StatusCard title="처리 완료" value="12건" icon={<CheckCircle2 size={18} />} color="slate" items={completedRequests.map(i => ({ ...i, secondary: i.date }))} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Main Application Sections */}
        <div className="lg:col-span-2 space-y-8">
          <Widget title="최근 신청 현황" color="blue">
            <div className="space-y-4 py-2">
              <ApplicationRow type="구매" item="MacBook Pro 16인치 외 2건" date="2026.06.01" status="검토중" onClick={() => setCurrentView('PURCHASE_DETAIL')} />
              <ApplicationRow type="발급" item="재직증명서 (은행 제출용)" date="2026.05.30" status="완료" onClick={() => setCurrentView('CERTIFICATE_DETAIL')} />
              <ApplicationRow type="구매" item="사무용 의자 (허먼밀러)" date="2026.05.28" status="승인완료" onClick={() => setCurrentView('PURCHASE_DETAIL')} />
              <ApplicationRow type="구매" item="JetBrains All Products Pack" date="2026.05.25" status="완료" onClick={() => setCurrentView('PURCHASE_DETAIL')} />
              <ApplicationRow type="발급" item="경력증명서" date="2026.05.20" status="완료" onClick={() => setCurrentView('CERTIFICATE_DETAIL')} />
            </div>
          </Widget>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ActionCard 
              title="구매 신청" 
              desc="사무용품, IT 장비, 소프트웨어 등" 
              icon={<Package size={24} className="text-blue-500" />}
              btnLabel="구매 신청하기"
              color="blue"
              onClick={() => setCurrentView('PURCHASE')}
            />
            <ActionCard 
              title="발급 신청" 
              desc="재직/경력증명서, 원천징수영수증 등" 
              icon={<FileText size={24} className="text-emerald-500" />}
              btnLabel="서류 발급하기"
              color="emerald"
              onClick={() => setCurrentView('CERTIFICATE')}
            />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <Widget title="공지 사항" color="rose">
            <div className="space-y-4">
              <Card className="p-4 bg-slate-50 border-slate-100 group hover:bg-[#fafafa] transition-all shadow-none hover:shadow-lg" noPadding>
                <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">중요</div>
                <div className="text-[13px] font-black text-slate-800 mb-2 leading-tight">분기별 IT 장비 정기 교체 신청 안내</div>
                <div className="text-[11px] font-bold text-slate-400 italic">마감: 2026.06.30</div>
              </Card>
              <Card className="p-4 bg-slate-50 border-slate-100 group hover:bg-[#fafafa] transition-all shadow-none hover:shadow-lg" noPadding>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">안내</div>
                <div className="text-[13px] font-black text-slate-800 mb-2 leading-tight">온라인 증명서 발급 시스템 점검 안내</div>
                <div className="text-[11px] font-bold text-slate-400 italic">2026.06.05 18:00 - 20:00</div>
              </Card>
            </div>
          </Widget>

          <Widget title="자주 묻는 질문" color="indigo">
            <div className="space-y-3">
              <FAQItem question="명함 신청은 어디서 하나요?" />
              <FAQItem question="모니터 추가 지급 기준은?" />
              <FAQItem question="원천징수 영수증 발급 방법" />
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
};


function ApplicationRow({ type, item, date, status, onClick }: any) {
  return (
    <Card className="flex items-center justify-between p-4 bg-[#fafafa] border border-slate-50 rounded-lg hover:border-slate-200 hover:shadow-sm transition-all group cursor-pointer" noPadding onClick={onClick}>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{type}</span>
        <div>
          <div className="text-[14px] font-black text-slate-800 group-hover:text-blue-600 transition-colors">{item}</div>
          <div className="text-[11px] font-bold text-slate-400 italic">{date}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={STATUS_VARIANT[status] ?? 'slate'}>{status}</Badge>
        <ChevronRight size={16} className="text-slate-200" />
      </div>
    </Card>
  );
}

function ActionCard({ title, desc, icon, btnLabel, color, onClick }: any) {
  const btnColors: any = {
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
  };
  return (
    <Card className="group">
      <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-black text-slate-800 mb-2">{title}</h3>
      <p className="text-[13px] font-bold text-slate-400 mb-6 leading-relaxed">{desc}</p>
      <button onClick={onClick} className={`w-full py-3 text-white text-[11px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer border-none shadow-lg ${btnColors[color]}`}>
        {btnLabel}
      </button>
    </Card>
  );
}

function FAQItem({ question }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100/50 rounded-lg hover:bg-[#fafafa] hover:shadow-sm transition-all cursor-pointer group">
      <span className="text-[12px] font-bold text-slate-600 group-hover:text-blue-600">{question}</span>
      <ChevronRight size={14} className="text-slate-300" />
    </div>
  );
}

export default RequestHome;
