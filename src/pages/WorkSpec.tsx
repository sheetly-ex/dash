import React from 'react';
import { FileText, Tag, User, Layers, CheckCircle } from 'lucide-react';
import Widget from '../components/ui/Widget';

const WorkSpec: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Profile Summary */}
      <div className="bg-[#fafafa] rounded-[1.25rem] p-10 border border-slate-100 shadow-sm flex items-center gap-10">
        <div className="w-24 h-24 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
          <User size={40} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded">IT 운영본부</span>
            <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded">경영지원팀</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">홍길동 과장 <span className="text-slate-400 font-bold ml-2">Lead Developer</span></h2>
        </div>
      </div>

      {/* Main Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Widget title="주요 역할 (Key Roles)" color="blue">
          <div className="space-y-6 mt-2">
            <RoleItem icon={<Layers size={18} />} title="전사 시스템 아키텍처 설계" desc="차세대 ERP 시스템 전환 프로젝트 기술 리딩" />
            <RoleItem icon={<FileText size={18} />} title="기술 문서화 및 표준 수립" desc="코드 컨벤션 및 개발 가이드라인 작성" />
            <RoleItem icon={<Tag size={18} />} title="인프라 자산 관리" desc="Cloud 리소스 최적화 및 보안 정책 수립" />
          </div>
        </Widget>

        <Widget title="핵심 역량 (Core Skills)" color="emerald">
          <div className="flex flex-wrap gap-3 mt-2">
            <SkillBadge label="React / Next.js" />
            <SkillBadge label="TypeScript" />
            <SkillBadge label="Node.js" />
            <SkillBadge label="AWS Architecture" />
            <SkillBadge label="DevOps / CI/CD" />
            <SkillBadge label="PostgreSQL" />
            <SkillBadge label="System Design" />
          </div>
        </Widget>
      </div>

      {/* Detailed Responsibilities */}
      <Widget title="상세 업무 명세" color="indigo">
        <div className="space-y-8 mt-4">
          <Section title="01. 프로젝트 관리">
            <TaskItem text="분기별 기술 로드맵 수립 및 마일스톤 관리" />
            <TaskItem text="개발 팀 내 코드 리뷰 및 기술 부채 관리" />
            <TaskItem text="협력 업체 기술 검토 및 협업 프로세스 최적화" />
          </Section>
          
          <Section title="02. 운영 및 유지보수">
            <TaskItem text="사내 통합 로그인 시스템(SSO) 고도화 및 운영" />
            <TaskItem text="대시보드 성능 최적화 및 데이터 시각화 라이브러리 관리" />
            <TaskItem text="보안 취약점 점검 및 정기 패치 업데이트 수행" />
          </Section>
        </div>
      </Widget>
    </div>
  );
};

interface RoleItemProps { icon: React.ReactNode; title: string; desc: string; }
function RoleItem({ icon, title, desc }: RoleItemProps) {
  return (
    <div className="flex gap-4 group">
      <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-[14px] font-black text-slate-800 mb-0.5">{title}</div>
        <div className="text-[12px] font-bold text-slate-400 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function SkillBadge({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-md text-[12px] font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-all cursor-default">
      {label}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TaskItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 bg-slate-50/50 p-4 rounded-lg border border-transparent hover:border-slate-100 hover:bg-[#fafafa] transition-all group">
      <CheckCircle size={16} className="text-blue-500 mt-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
      <span className="text-[13px] font-bold text-slate-700">{text}</span>
    </div>
  );
}

export default WorkSpec;
