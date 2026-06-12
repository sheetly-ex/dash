import React from 'react';
import { User, Mail, Phone, MapPin, Award } from 'lucide-react';
import Widget from '../../components/ui/Widget';
import Card from '../../components/ui/Card';
import { useSettings } from '../../contexts/SettingsContext';
import { useLocalizedData } from '../../data/localized';

const Profile: React.FC = () => {
  const { t } = useSettings();
  const { user } = useLocalizedData();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card hoverable={false} className="p-10 rounded-[1.5rem] flex flex-col md:flex-row items-center gap-10">
        <div className="w-40 h-40 bg-linear-to-br from-blue-500 to-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 relative group">
          <User size={80} />
          <div className="absolute inset-0 bg-black/20 rounded-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <span className="text-[10px] font-black uppercase tracking-widest">{t('profile.changePhoto')}</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest rounded-md border border-blue-100">{user.division}</span>
            <span className="px-4 py-1.5 bg-surface-muted text-app-muted text-[11px] font-black uppercase tracking-widest rounded-md border border-app-muted">{user.dept}</span>
          </div>
          <h2 className="text-4xl font-black text-app tracking-tight mb-2">{user.name} <span className="text-app-muted font-bold ml-2 text-2xl">{user.rank}</span></h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-app-muted text-sm font-bold">
            <div className="flex items-center gap-2"><Mail size={16} className="text-blue-500" /> {user.email}</div>
            <div className="flex items-center gap-2"><Phone size={16} className="text-emerald-500" /> {user.phone}</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-rose-500" /> {user.office}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Widget title={t('profile.basicInfo')} color="blue">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
              <InfoItem label={t('profile.employeeId')} value={user.empNo} />
              <InfoItem label={t('profile.joinDate')} value={user.joinDate} />
              <InfoItem label={t('profile.birthDate')} value={user.birthDate} />
              <InfoItem label={t('profile.education')} value={user.education} />
            </div>
          </Widget>

          <Widget title={t('profile.career')} color="indigo">
            <div className="space-y-6">
              <TimelineItem title="i-on" period="2022.01 - 현재" desc="클라우드 인프라 아키텍처 및 ERP 시스템 총괄 운영" isCurrent />
              <TimelineItem title="(주) 글로벌 소프트웨어" period="2018.03 - 2021.12" desc="웹 서비스 백엔드 개발 및 API 설계" />
              <TimelineItem title="스타트업 랩스" period="2015.01 - 2018.02" desc="프론트엔드 UI/UX 개발 및 프로토타이핑" />
            </div>
          </Widget>
        </div>

        <div className="space-y-8">
          <Widget title={t('profile.certs')} color="emerald">
            <div className="space-y-4">
              <CertItem title="정보처리기사" agency="한국산업인력공단" />
              <CertItem title="AWS Solution Architect" agency="Amazon" />
              <CertItem title="TOEIC 900" agency="YBM" />
            </div>
          </Widget>

          <Widget title={t('profile.salary')} color="rose">
            <div className="p-1 bg-surface-elevated rounded-lg text-center">
              <div className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-1">{t('profile.salaryDone')}</div>
              <div className="text-xl font-black text-blue-400">₩ 75,000,000</div>
              <button className="mt-3 text-[10px] font-black text-app-muted hover:text-blue-500 transition-colors uppercase underline underline-offset-4 cursor-pointer border-none bg-transparent">{t('profile.salaryContract')}</button>
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-1">{label}</div>
      <div className="text-[15px] font-bold text-app">{value}</div>
    </div>
  );
}

interface TimelineItemProps { title: string; period: string; desc: string; isCurrent?: boolean; }
function TimelineItem({ title, period, desc, isCurrent = false }: TimelineItemProps) {
  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1.5 ${isCurrent ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-surface-muted'}`}></div>
        <div className="w-px h-full bg-surface-muted mt-1"></div>
      </div>
      <div className="pb-4">
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-sm font-black ${isCurrent ? 'text-blue-600' : 'text-app'}`}>{title}</span>
          <span className="text-[10px] font-bold text-app-muted italic">{period}</span>
        </div>
        <p className="text-[12px] font-bold text-app-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function CertItem({ title, agency }: { title: string; agency: string }) {
  return (
    <Card noPadding className="flex items-center gap-4 p-4 bg-surface-muted/50 rounded-lg border border-app-muted/50 hover:bg-surface-elevated transition-all group">
      <div className="w-8 h-8 rounded bg-surface-elevated flex items-center justify-center text-app-muted shadow-sm group-hover:text-emerald-500 transition-colors">
        <Award size={18} />
      </div>
      <div>
        <div className="text-[13px] font-black text-app">{title}</div>
        <div className="text-[10px] font-bold text-app-muted">{agency}</div>
      </div>
    </Card>
  );
}

export default Profile;
