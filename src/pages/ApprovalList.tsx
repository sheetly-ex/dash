import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import SearchInput from '../components/ui/SearchInput';
import EmptyState from '../components/ui/EmptyState';

interface Props {
  mode: 'received' | 'sent';
}

const receivedData = [
  { id: 1, type: '기안서', title: '2026 하반기 팀 교육 예산 편성 계획', from: '이대리', dept: '경영지원팀', date: '2026.06.03', status: '결재대기', urgent: true },
  { id: 2, type: '구매요청서', title: '개발팀 맥북 프로 16인치 3대 구매 요청', from: '박주임', dept: 'IT운영팀', date: '2026.06.02', status: '결재대기', urgent: false },
  { id: 3, type: '출장신청서', title: '6월 부산 고객사 방문 출장 신청', from: '최과장', dept: '사업팀', date: '2026.05.30', status: '검토중', urgent: false },
  { id: 4, type: '휴가신청서', title: '연차 신청 (06.10 ~ 06.11)', from: '정사원', dept: '경영지원팀', date: '2026.05.28', status: '승인완료', urgent: false },
  { id: 5, type: '기안서', title: '팀 워크샵 장소 및 예산 승인 요청', from: '한주임', dept: '마케팅팀', date: '2026.05.25', status: '승인완료', urgent: false },
  { id: 6, type: '품의서', title: '사무용 소모품 일괄 구매 품의', from: '장대리', dept: '총무팀', date: '2026.05.20', status: '반려', urgent: false },
];

const sentData = [
  { id: 1, type: '구매요청서', title: 'JetBrains 전체 라이선스 갱신 요청', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.06.01', status: '결재중', urgent: false },
  { id: 2, type: '기안서', title: '팀 내 신규 인력 채용 계획서', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.28', status: '승인완료', urgent: false },
  { id: 3, type: '교육신청서', title: 'AWS 클라우드 자격증 교육 수강 신청', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.20', status: '승인완료', urgent: false },
  { id: 4, type: '출장신청서', title: '서울 본사 주요 회의 참석 출장 신청', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.15', status: '반려', urgent: false },
  { id: 5, type: '휴가신청서', title: '연차 사용 신청 (05.05 ~ 05.06)', from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.01', status: '승인완료', urgent: false },
];


const ApprovalList: React.FC<Props> = ({ mode }) => {
  const data = mode === 'received' ? receivedData : sentData;
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');

  const statuses = ['전체', '결재대기', '결재중', '검토중', '승인완료', '반려'];

  const filtered = data.filter(item => {
    const matchSearch = item.title.includes(search) || item.from.includes(search);
    const matchStatus = filterStatus === '전체' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    pending: data.filter(d => d.status === '결재대기' || d.status === '결재중' || d.status === '검토중').length,
    done: data.filter(d => d.status === '승인완료').length,
    rejected: data.filter(d => d.status === '반려').length,
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard label={mode === 'received' ? '처리 대기' : '진행 중'} value={counts.pending} color="rose" />
        <StatCard label="승인 완료" value={counts.done} color="emerald" />
        <StatCard label="반려" value={counts.rejected} color="slate" />
      </div>

      <Widget title={mode === 'received' ? '받은 결재함' : '보낸 결재함'} color="blue">
        {/* Search & Filter */}
        <div className="flex items-center gap-3 mb-6 mt-2">
          <SearchInput value={search} onChange={setSearch} placeholder="제목 또는 기안자 검색" size="sm" className="flex-1" />
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-[12px] font-black text-slate-600 bg-[#fafafa] cursor-pointer hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.length === 0 && <EmptyState message="검색 결과가 없습니다." size="lg" />}
          {filtered.map(item => (
            <Card key={item.id} noPadding className="flex items-center gap-4 p-4 hover:border-blue-100 hover:shadow-sm transition-all group cursor-pointer">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0">{item.type}</span>
                  {item.urgent && <Badge variant="rose">긴급</Badge>}
                </div>
                <div className="text-[14px] font-black text-slate-800 truncate group-hover:text-blue-700 transition-colors">{item.title}</div>
                <div className="text-[11px] font-bold text-slate-400 mt-0.5">{item.from} · {item.dept}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] font-bold text-slate-300 italic">{item.date}</span>
                <Badge variant={STATUS_VARIANT[item.status] ?? 'slate'} size="sm">{item.status}</Badge>
                <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Card>
          ))}
        </div>
      </Widget>
    </div>
  );
};

interface StatCardProps { label: string; value: number; color: 'rose' | 'emerald' | 'slate'; }
function StatCard({ label, value, color }: StatCardProps) {
  const colorMap: Record<StatCardProps['color'], string> = { rose: 'border-rose-100 text-rose-500', emerald: 'border-emerald-100 text-emerald-500', slate: 'border-slate-100 text-slate-400' };
  const [border, text] = colorMap[color].split(' ');
  return (
    <Card noPadding className={`p-5 border shadow-none ${border}`}>
      <div className={`text-3xl font-black ${text}`}>{value}건</div>
      <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider mt-1">{label}</div>
    </Card>
  );
}

export default ApprovalList;
