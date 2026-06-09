import React, { useState } from 'react';
import { Phone, Mail, ChevronRight, Calendar, Briefcase } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import SearchInput from '../components/ui/SearchInput';
import EmptyState from '../components/ui/EmptyState';

const retiredContacts = [
  { id: 1, name: '이민준', pos: '전 부장', dept: '영업팀', retiredDate: '2025.12.31', email: 'mj.lee@personal.com', phone: '010-2233-4455', years: 8 },
  { id: 2, name: '박수진', pos: '전 팀장', dept: '인사총무팀', retiredDate: '2025.10.15', email: 'sj.park@personal.com', phone: '010-3344-5566', years: 5 },
  { id: 3, name: '최동원', pos: '전 과장', dept: 'IT운영팀', retiredDate: '2025.08.01', email: 'dw.choi@personal.com', phone: '010-4455-6677', years: 3 },
  { id: 4, name: '정유라', pos: '전 대리', dept: '마케팅팀', retiredDate: '2025.06.30', email: 'yr.jung@personal.com', phone: '010-5566-7788', years: 4 },
  { id: 5, name: '강현우', pos: '전 이사', dept: '경영기획팀', retiredDate: '2025.02.28', email: 'hw.kang@personal.com', phone: '010-6677-8899', years: 12 },
  { id: 6, name: '윤지영', pos: '전 사원', dept: '디자인팀', retiredDate: '2024.11.15', email: 'jy.yoon@personal.com', phone: '010-7788-9900', years: 2 },
  { id: 7, name: '한상호', pos: '전 차장', dept: '재무팀', retiredDate: '2024.09.01', email: 'sh.han@personal.com', phone: '010-8899-0011', years: 9 },
];

const ContactRetired: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');

  const filtered = retiredContacts
    .filter(c => c.name.includes(search) || c.dept.includes(search) || c.pos.includes(search))
    .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : b.retiredDate.localeCompare(a.retiredDate));

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <Card hoverable={false}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="이름, 부서, 직급으로 검색..." className="flex-1 w-full" />
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2.5 rounded text-[10px] font-black uppercase tracking-widest cursor-pointer border transition-all ${sortBy === 'name' ? 'bg-blue-600 text-white border-blue-600' : 'bg-[#fafafa] border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500'}`}
            >
              성명순
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-4 py-2.5 rounded text-[10px] font-black uppercase tracking-widest cursor-pointer border transition-all ${sortBy === 'date' ? 'bg-blue-600 text-white border-blue-600' : 'bg-[#fafafa] border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500'}`}
            >
              퇴사일순
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Contact Table */}
        <div className="lg:col-span-2">
          <Card noPadding hoverable={false}>
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
              <h3 className="text-lg font-black text-slate-800">
                퇴사자 연락처 <span className="text-slate-400 text-sm ml-1">{filtered.length}명</span>
              </h3>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded border border-slate-100 uppercase tracking-widest">
                최근 2년 이내
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {filtered.length === 0 && <EmptyState message="검색 결과가 없습니다." size="lg" />}
              {filtered.map(c => (
                <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 cursor-pointer group transition-colors">
                  <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm shrink-0 group-hover:bg-slate-200 transition-colors">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-black text-slate-800 group-hover:text-blue-700 transition-colors">{c.name}</span>
                      <span className="text-[11px] font-bold text-slate-400">{c.pos}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <Briefcase size={11} className="text-slate-300" />{c.dept}
                      </div>
                      <span className="text-slate-200">·</span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <Calendar size={11} className="text-slate-300" />퇴사 {c.retiredDate}
                      </div>
                      <span className="text-[10px] font-black text-slate-300 italic">재직 {c.years}년</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <a href={`mailto:${c.email}`}
                      className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      onClick={e => e.stopPropagation()}>
                      <Mail size={14} />
                    </a>
                    <a href={`tel:${c.phone}`}
                      className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      onClick={e => e.stopPropagation()}>
                      <Phone size={14} />
                    </a>
                    <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Widget title="퇴사 현황" color="slate">
            <div className="space-y-3 mt-2">
              <StatRow label="2025년 퇴사" value="24명" />
              <StatRow label="2024년 퇴사" value="18명" />
              <StatRow label="평균 재직 기간" value="5.4년" />
            </div>
          </Widget>

          <Card noPadding className="p-5 bg-amber-50 border-amber-100 shadow-none">
            <div className="text-[12px] font-black text-amber-700 mb-2">개인정보 보호 안내</div>
            <p className="text-[11px] font-bold text-amber-600 leading-relaxed">
              퇴사자 연락처는 업무 목적에 한해서만 사용하여 주시기 바랍니다. 무단 활용 시 법적 책임이 발생할 수 있습니다.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-[12px] font-bold text-slate-500">{label}</span>
      <span className="text-[13px] font-black text-slate-700">{value}</span>
    </div>
  );
}

export default ContactRetired;
