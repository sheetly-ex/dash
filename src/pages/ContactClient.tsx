import React, { useState } from 'react';
import { Phone, Mail, ChevronRight, Globe, Building2, Star, UserPlus } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import SearchInput from '../components/ui/SearchInput';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';

const clients = [
  { id: 1, company: '삼성 SDS', name: '박진혁', pos: '수석 매니저', dept: '클라우드사업부', email: 'jh.park@sds.samsung.com', phone: '010-1122-3344', website: 'www.samsungsds.com', category: 'IT 파트너', starred: true },
  { id: 2, company: 'LG CNS', name: '이수현', pos: '팀장', dept: 'AI솔루션팀', email: 'sh.lee@lgcns.com', phone: '010-2233-4455', website: 'www.lgcns.com', category: 'IT 파트너', starred: true },
  { id: 3, company: '현대자동차', name: '최지훈', pos: '과장', dept: 'ICT기획팀', email: 'jh.choi@hyundai.com', phone: '010-3344-5566', website: 'www.hyundai.com', category: '고객사', starred: false },
  { id: 4, company: 'KB국민은행', name: '정미래', pos: '대리', dept: 'IT운영부', email: 'mr.jung@kbstar.com', phone: '010-4455-6677', website: 'www.kbstar.com', category: '금융', starred: false },
  { id: 5, company: '카카오', name: '강하늘', pos: 'PM', dept: '플랫폼사업팀', email: 'hn.kang@kakao.com', phone: '010-5566-7788', website: 'www.kakao.com', category: 'IT 파트너', starred: true },
  { id: 6, company: 'SK 텔레콤', name: '윤성호', pos: '부장', dept: '엔터프라이즈사업', email: 'sh.yoon@sktelecom.com', phone: '010-6677-8899', website: 'www.sktelecom.com', category: '통신', starred: false },
  { id: 7, company: '네이버', name: '한예진', pos: '리드', dept: '기업솔루션팀', email: 'yj.han@naver.com', phone: '010-7788-9900', website: 'www.naver.com', category: 'IT 파트너', starred: false },
  { id: 8, company: '롯데정보통신', name: '오재현', pos: '차장', dept: '시스템사업부', email: 'jh.oh@lotteinformatics.com', phone: '010-8899-0011', website: '', category: 'IT 파트너', starred: false },
];

const categories = ['전체', 'IT 파트너', '고객사', '금융', '통신'];

const categoryVariant: Record<string, any> = { 'IT 파트너': 'blue', '고객사': 'indigo', '금융': 'emerald', '통신': 'amber' };

const ContactClient: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [showStarred, setShowStarred] = useState(false);

  const filtered = clients.filter(c => {
    const matchSearch = c.company.includes(search) || c.name.includes(search) || c.dept.includes(search);
    const matchCat = activeCategory === '전체' || c.category === activeCategory;
    const matchStar = !showStarred || c.starred;
    return matchSearch && matchCat && matchStar;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <Card hoverable={false}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <SearchInput value={search} onChange={setSearch} placeholder="회사명, 담당자, 부서 검색..." className="flex-1" />
            <button className="shrink-0 flex items-center gap-2 px-6 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 cursor-pointer border-none">
              <UserPlus size={16} /> 거래처 추가
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded text-[11px] font-black uppercase tracking-wide border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[#fafafa] text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-500'
                }`}>
                {cat}
              </button>
            ))}
            <button
              onClick={() => setShowStarred(!showStarred)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded text-[11px] font-black uppercase tracking-wide border transition-all cursor-pointer ml-auto ${
                showStarred ? 'bg-amber-500 text-white border-amber-500' : 'bg-[#fafafa] text-slate-400 border-slate-200 hover:border-amber-300 hover:text-amber-500'
              }`}>
              <Star size={12} /> 즐겨찾기
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Client List */}
        <div className="lg:col-span-2">
          <Card noPadding hoverable={false}>
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
              <h3 className="text-lg font-black text-slate-800">
                거래처 연락처 <span className="text-slate-400 text-sm ml-1">{filtered.length}개사</span>
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {filtered.length === 0 && <EmptyState message="검색 결과가 없습니다." size="lg" />}
              {filtered.map(c => (
                <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 cursor-pointer group transition-colors">
                  <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Building2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[15px] font-black text-slate-800 group-hover:text-blue-700 transition-colors">{c.company}</span>
                      {c.starred && <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />}
                      <Badge variant={categoryVariant[c.category] ?? 'slate'}>{c.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                      <span>{c.name}</span>
                      <span className="text-slate-300">·</span>
                      <span>{c.pos}</span>
                      <span className="text-slate-300">·</span>
                      <span>{c.dept}</span>
                    </div>
                    {c.website && (
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] font-bold text-slate-300">
                        <Globe size={10} />{c.website}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
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
          <Widget title="카테고리별 현황" color="blue">
            <div className="space-y-3 mt-2">
              {categories.filter(c => c !== '전체').map(cat => {
                const count = clients.filter(c => c.category === cat).length;
                return (
                  <div key={cat} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <Badge variant={categoryVariant[cat] ?? 'slate'} size="sm">{cat}</Badge>
                    <span className="text-[13px] font-black text-slate-500">{count}개사</span>
                  </div>
                );
              })}
            </div>
          </Widget>

          <Widget title="즐겨찾기" color="amber">
            <div className="space-y-3 mt-2">
              {clients.filter(c => c.starred).map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-100 hover:bg-[#fafafa] transition-all cursor-pointer group">
                  <Star size={13} className="text-amber-400 fill-amber-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-black text-slate-700 group-hover:text-blue-600 transition-colors truncate">{c.company}</div>
                    <div className="text-[10px] font-bold text-slate-400 truncate">{c.name} {c.pos}</div>
                  </div>
                </div>
              ))}
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
};

export default ContactClient;
