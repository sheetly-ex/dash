import React from 'react';
import { User, Mail, Phone, MapPin, Award } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';

const Profile: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Profile Section */}
      <Card hoverable={false} className="p-10 rounded-[1.5rem] flex flex-col md:flex-row items-center gap-10">
        <div className="w-40 h-40 bg-linear-to-br from-blue-500 to-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 relative group">
          <User size={80} />
          <div className="absolute inset-0 bg-black/20 rounded-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <span className="text-[10px] font-black uppercase tracking-widest">사진 변경</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest rounded-md border border-blue-100">IT 운영본부</span>
            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest rounded-md border border-slate-100">경영지원팀</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">홍길동 <span className="text-slate-400 font-bold ml-2 text-2xl">과장</span></h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500 text-sm font-bold">
            <div className="flex items-center gap-2"><Mail size={16} className="text-blue-500" /> gdhong@a9.com</div>
            <div className="flex items-center gap-2"><Phone size={16} className="text-emerald-500" /> 010-1234-5678</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-rose-500" /> 본사 사무실 (4F)</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info & Career */}
        <div className="lg:col-span-2 space-y-8">
          <Widget title="기본 정보" color="blue">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
              <InfoItem label="사원 번호" value="A9-20220101" />
              <InfoItem label="입사 일자" value="2022.01.01 (재직 4년차)" />
              <InfoItem label="생년 월일" value="1990.05.15 (만 36세)" />
              <InfoItem label="최종 학력" value="대학교 졸업 (컴퓨터공학)" />
            </div>
          </Widget>

          <Widget title="경력 사항" color="indigo">
            <div className="space-y-6">
              <TimelineItem 
                title="(주) A9" 
                period="2022.01 - 현재" 
                desc="클라우드 인프라 아키텍처 및 ERP 시스템 총괄 운영" 
                isCurrent 
              />
              <TimelineItem 
                title="(주) 글로벌 소프트웨어" 
                period="2018.03 - 2021.12" 
                desc="웹 서비스 백엔드 개발 및 API 설계" 
              />
              <TimelineItem 
                title="스타트업 랩스" 
                period="2015.01 - 2018.02" 
                desc="프론트엔드 UI/UX 개발 및 프로토타이핑" 
              />
            </div>
          </Widget>
        </div>

        {/* Right Column: Skills & Certs */}
        <div className="space-y-8">
          <Widget title="자격 & 면허" color="emerald">
            <div className="space-y-4">
              <CertItem title="정보처리기사" agency="한국산업인력공단" />
              <CertItem title="AWS Solution Architect" agency="Amazon" />
              <CertItem title="TOEIC 900" agency="YBM" />
            </div>
          </Widget>

          <Widget title="보유 기술" color="rose">
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'AWS', 'Docker', 'PostgreSQL', 'Python'].map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-[11px] font-black text-slate-600">
                  {skill}
                </span>
              ))}
            </div>
          </Widget>

          <Widget title="연봉 정보" color="rose">
            <div className="p-1 bg-[#fafafa] rounded-lg text-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">2026 연봉 협상 완료</div>
              <div className="text-xl font-black text-blue-400">₩ 75,000,000</div>
              <button className="mt-3 text-[10px] font-black text-white/50 hover:text-white transition-colors uppercase underline underline-offset-4 cursor-pointer border-none bg-transparent">연봉계약서 확인</button>
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
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-[15px] font-bold text-slate-800">{value}</div>
    </div>
  );
}

interface TimelineItemProps { title: string; period: string; desc: string; isCurrent?: boolean; }
function TimelineItem({ title, period, desc, isCurrent = false }: TimelineItemProps) {
  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1.5 ${isCurrent ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-200'}`}></div>
        <div className="w-px h-full bg-slate-100 mt-1"></div>
      </div>
      <div className="pb-4">
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-sm font-black ${isCurrent ? 'text-blue-600' : 'text-slate-800'}`}>{title}</span>
          <span className="text-[10px] font-bold text-slate-400 italic">{period}</span>
        </div>
        <p className="text-[12px] font-bold text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function CertItem({ title, agency }: { title: string; agency: string }) {
  return (
    <Card noPadding className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-lg border border-slate-100/50 hover:bg-[#fafafa] transition-all group">
      <div className="w-8 h-8 rounded bg-[#fafafa] flex items-center justify-center text-slate-400 shadow-sm group-hover:text-emerald-500 transition-colors">
        <Award size={18} />
      </div>
      <div>
        <div className="text-[13px] font-black text-slate-800">{title}</div>
        <div className="text-[10px] font-bold text-slate-400">{agency}</div>
      </div>
    </Card>
  );
}

export default Profile;
