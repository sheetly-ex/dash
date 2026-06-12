import React from 'react';
import { ShoppingCart, FileText, CheckCircle2, Clock, ChevronRight, Package } from 'lucide-react';
import Widget from '../../components/ui/Widget';
import Card from '../../components/ui/Card';
import StatusCard from '../../components/ui/StatusCard';
import Badge, { STATUS_VARIANT } from '../../components/ui/Badge';
import { useSettings } from '../../contexts/SettingsContext';
import type { TranslationKey } from '../../i18n';
import type { SubView } from '../../types';

type RequestTypeKey = 'purchase' | 'certificate';
type StatusKey = 'inProgress' | 'reviewing' | 'approved' | 'completed';

const RequestHome: React.FC<{ setCurrentView: (v: SubView) => void }> = ({ setCurrentView }) => {
  const { t } = useSettings();
  const caseSuffix = t('common.caseSuffix');

  const purchaseRequests = [
    { id: 1, title: 'MacBook Pro 16인치', date: '06.01' },
    { id: 2, title: '사무용 모니터 27인치', date: '05.28' },
    { id: 3, title: '매직 키보드 (한글)', date: '05.25' },
  ];

  const documentRequests = [
    { id: 1, title: '재직증명서 (은행제출)', date: '05.30' },
    { id: 2, title: '원천징수영수증', date: '05.20' },
  ];

  const inProgressRequests: { id: number; title: string; status: StatusKey }[] = [
    { id: 1, title: '허먼밀러 에어론 의자', status: 'inProgress' },
    { id: 2, title: 'JetBrains 라이선스', status: 'reviewing' },
    { id: 3, title: '명함 제작 (재주문)', status: 'approved' },
  ];

  const completedRequests = [
    { id: 1, title: '경력증명서', date: '05.15' },
    { id: 2, title: '무선 마우스 교체', date: '05.10' },
    { id: 3, title: '워크샵 용품 구매', date: '05.08' },
  ];

  const statusLabel = (key: StatusKey | RequestTypeKey) => t(`status.${key}` as TranslationKey);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatusCard title={t('request.purchase')} value={`05${caseSuffix}`} icon={<ShoppingCart size={18} />} color="blue" items={purchaseRequests.map(i => ({ ...i, secondary: i.date }))} />
        <StatusCard title={t('request.certificate')} value={`02${caseSuffix}`} icon={<FileText size={18} />} color="emerald" items={documentRequests.map(i => ({ ...i, secondary: i.date }))} />
        <StatusCard title={t('request.inProgress')} value={`03${caseSuffix}`} icon={<Clock size={18} />} color="indigo" items={inProgressRequests.map(i => ({ ...i, secondary: statusLabel(i.status) }))} />
        <StatusCard title={t('request.completed')} value={`12${caseSuffix}`} icon={<CheckCircle2 size={18} />} color="slate" items={completedRequests.map(i => ({ ...i, secondary: i.date }))} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Widget title={t('request.recentApplications')} color="blue">
            <div className="space-y-4 py-2">
              <ApplicationRow type="purchase" item="MacBook Pro 16인치 외 2건" date="2026.06.01" status="reviewing" typeLabel={statusLabel('purchase')} statusLabel={statusLabel('reviewing')} onClick={() => setCurrentView('PURCHASE_DETAIL')} />
              <ApplicationRow type="certificate" item="재직증명서 (은행 제출용)" date="2026.05.30" status="completed" typeLabel={statusLabel('certificate')} statusLabel={statusLabel('completed')} onClick={() => setCurrentView('CERTIFICATE_DETAIL')} />
              <ApplicationRow type="purchase" item="사무용 의자 (허먼밀러)" date="2026.05.28" status="approved" typeLabel={statusLabel('purchase')} statusLabel={statusLabel('approved')} onClick={() => setCurrentView('PURCHASE_DETAIL')} />
              <ApplicationRow type="purchase" item="JetBrains All Products Pack" date="2026.05.25" status="completed" typeLabel={statusLabel('purchase')} statusLabel={statusLabel('completed')} onClick={() => setCurrentView('PURCHASE_DETAIL')} />
              <ApplicationRow type="certificate" item="경력증명서" date="2026.05.20" status="completed" typeLabel={statusLabel('certificate')} statusLabel={statusLabel('completed')} onClick={() => setCurrentView('CERTIFICATE_DETAIL')} />
            </div>
          </Widget>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ActionCard
              title={t('request.purchaseApply')}
              desc={t('request.purchaseDesc')}
              icon={<Package size={24} className="text-blue-500" />}
              btnLabel={t('request.purchaseApplyBtn')}
              color="blue"
              onClick={() => setCurrentView('PURCHASE')}
            />
            <ActionCard
              title={t('request.certificateApply')}
              desc={t('request.certificateDesc')}
              icon={<FileText size={24} className="text-emerald-500" />}
              btnLabel={t('request.certificateApplyBtn')}
              color="emerald"
              onClick={() => setCurrentView('CERTIFICATE')}
            />
          </div>
        </div>

        <div className="space-y-8">
          <Widget title={t('request.notices')} color="rose">
            <div className="space-y-4">
              <Card className="p-4 bg-surface-muted border-app-muted group hover:bg-surface-elevated transition-all shadow-none hover:shadow-lg" noPadding>
                <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{t('request.important')}</div>
                <div className="text-[13px] font-black text-app mb-2 leading-tight">분기별 IT 장비 정기 교체 신청 안내</div>
                <div className="text-[11px] font-bold text-app-muted italic">마감: 2026.06.30</div>
              </Card>
              <Card className="p-4 bg-surface-muted border-app-muted group hover:bg-surface-elevated transition-all shadow-none hover:shadow-lg" noPadding>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{t('request.info')}</div>
                <div className="text-[13px] font-black text-app mb-2 leading-tight">온라인 증명서 발급 시스템 점검 안내</div>
                <div className="text-[11px] font-bold text-app-muted italic">2026.06.05 18:00 - 20:00</div>
              </Card>
            </div>
          </Widget>

          <Widget title={t('request.faq')} color="indigo">
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

interface ApplicationRowProps {
  type: RequestTypeKey;
  item: string;
  date: string;
  status: StatusKey;
  typeLabel: string;
  statusLabel: string;
  onClick?: () => void;
}
function ApplicationRow({ typeLabel, item, date, status, statusLabel, onClick }: ApplicationRowProps) {
  return (
    <Card className="flex items-center justify-between p-4 bg-surface-elevated border border-app-muted rounded-lg hover:border-app hover:shadow-sm transition-all group cursor-pointer" noPadding onClick={onClick}>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">{typeLabel}</span>
        <div>
          <div className="text-[14px] font-black text-app group-hover:text-blue-600 transition-colors">{item}</div>
          <div className="text-[11px] font-bold text-app-muted italic">{date}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={STATUS_VARIANT[status] ?? 'slate'}>{statusLabel}</Badge>
        <ChevronRight size={16} className="text-app-muted" />
      </div>
    </Card>
  );
}

interface ActionCardProps { title: string; desc: string; icon: React.ReactNode; btnLabel: string; color: 'blue' | 'emerald'; onClick?: () => void; }
function ActionCard({ title, desc, icon, btnLabel, color, onClick }: ActionCardProps) {
  const btnColors: Record<ActionCardProps['color'], string> = {
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
  };
  return (
    <Card className="group">
      <div className="w-14 h-14 bg-surface-muted rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-black text-app mb-2">{title}</h3>
      <p className="text-[13px] font-bold text-app-muted mb-6 leading-relaxed">{desc}</p>
      <button onClick={onClick} className={`w-full py-3 text-white text-[11px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer border-none shadow-lg ${btnColors[color]}`}>
        {btnLabel}
      </button>
    </Card>
  );
}

function FAQItem({ question }: { question: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-muted/50 border border-app-muted/50 rounded-lg hover:bg-surface-elevated hover:shadow-sm transition-all cursor-pointer group">
      <span className="text-[12px] font-bold text-app-secondary group-hover:text-blue-600">{question}</span>
      <ChevronRight size={14} className="text-app-muted" />
    </div>
  );
}

export default RequestHome;
