import React, { useState } from 'react';
import { ChevronRight, Pin, Paperclip } from 'lucide-react';
import Widget from '../components/ui/Widget';
import SearchInput from '../components/ui/SearchInput';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';

interface BoardConfig {
  title: string;
  categories: string[];
  color: 'blue' | 'rose' | 'indigo' | 'emerald';
  posts: Post[];
}

interface Post {
  id: number;
  category: string;
  title: string;
  author: string;
  dept: string;
  date: string;
  views: number;
  pinned?: boolean;
  hasAttachment?: boolean;
  isNew?: boolean;
}

const boardConfigs: Record<string, BoardConfig> = {
  COLLECTIVE: {
    title: 'I-ON Collective',
    color: 'rose',
    categories: ['전체', '전사공지', '경영소식', '인사안내', '행사소식'],
    posts: [
      { id: 1, category: '전사공지', title: '2026년 하반기 경영 목표 및 전략 방향 공유', author: '경영전략팀', dept: 'I-ON 본사', date: '06.03', views: 312, pinned: true, isNew: true },
      { id: 2, category: '인사안내', title: '6월 정기 인사이동 발령 공지', author: '인사팀', dept: 'I-ON 본사', date: '06.02', views: 289, pinned: true, hasAttachment: true },
      { id: 3, category: '경영소식', title: '1분기 실적 결산 및 2분기 목표 달성 현황', author: '재무팀', dept: 'I-ON 본사', date: '06.01', views: 201, hasAttachment: true },
      { id: 4, category: '행사소식', title: '창립 15주년 기념 행사 안내 및 참가 신청', author: '총무팀', dept: 'I-ON 본사', date: '05.30', views: 178, isNew: true },
      { id: 5, category: '전사공지', title: '정보보안 강화 조치 시행 안내 (전자기기 반출 관련)', author: '보안팀', dept: 'I-ON 본사', date: '05.28', views: 142 },
      { id: 6, category: '인사안내', title: '하반기 사내 공모 채용 접수 안내', author: '인사팀', dept: 'I-ON 본사', date: '05.26', views: 130, hasAttachment: true },
      { id: 7, category: '경영소식', title: '신규 전략 파트너사 MOU 체결 소식', author: '사업개발팀', dept: 'I-ON 본사', date: '05.23', views: 105 },
    ],
  },
  ION: {
    title: 'I-ON 게시판',
    color: 'blue',
    categories: ['전체', '사내안내', '업무매뉴얼', '자유게시판', '자료실', '질문/답변'],
    posts: [
      { id: 1, category: '사내안내', title: '7월 사내 카페테리아 메뉴 개편 안내', author: '총무팀', dept: '경영지원', date: '06.04', views: 98, isNew: true },
      { id: 2, category: '업무매뉴얼', title: 'A9 ERP 시스템 모바일 앱 사용 매뉴얼 v2.0', author: 'IT운영팀', dept: 'IT', date: '06.03', views: 145, pinned: true, hasAttachment: true },
      { id: 3, category: '자유게시판', title: '이번 주 점심 같이 드실 분 구해요 (을지로 쪽)', author: '김대리', dept: '개발팀', date: '06.03', views: 67, isNew: true },
      { id: 4, category: '질문/답변', title: '연차 계산 기준일 질문드립니다', author: '박주임', dept: '마케팅팀', date: '06.02', views: 54 },
      { id: 5, category: '자료실', title: '2026년 표준 계약서 양식 모음 (최신본)', author: '법무팀', dept: '경영지원', date: '06.01', views: 89, hasAttachment: true },
      { id: 6, category: '사내안내', title: '냉난방 시스템 점검 일정 안내 (6/15)', author: '총무팀', dept: '경영지원', date: '05.30', views: 44 },
      { id: 7, category: '자유게시판', title: '도서 공유 신청받습니다 - 개발 관련 도서 위주', author: '이과장', dept: 'IT운영팀', date: '05.28', views: 36 },
    ],
  },
  SUBSIDIARY_B: {
    title: 'B 회사 게시판',
    color: 'indigo',
    categories: ['전체', '공지사항', '협업안내', '자료공유'],
    posts: [
      { id: 1, category: '공지사항', title: 'B사 2분기 파트너십 미팅 일정 확정 안내', author: 'B사 경영지원', dept: 'B Company', date: '06.03', views: 42, pinned: true },
      { id: 2, category: '협업안내', title: '공동 프로젝트 "Alpha" 킥오프 미팅 결과 공유', author: 'B사 PO', dept: 'B Company', date: '06.01', views: 38, hasAttachment: true, isNew: true },
      { id: 3, category: '자료공유', title: '통합 API 명세서 v1.3 (2026 Q2)', author: 'B사 개발팀', dept: 'B Company', date: '05.29', views: 61, hasAttachment: true },
      { id: 4, category: '공지사항', title: 'B사 사무실 이전 및 연락처 변경 안내', author: 'B사 총무', dept: 'B Company', date: '05.25', views: 29 },
      { id: 5, category: '협업안내', title: '하반기 공동 마케팅 캠페인 기획안 검토 요청', author: 'B사 마케팅', dept: 'B Company', date: '05.20', views: 25, hasAttachment: true },
    ],
  },
  SUBSIDIARY_C: {
    title: 'C 회사 게시판',
    color: 'emerald',
    categories: ['전체', '공지사항', '업무공유', '자료실'],
    posts: [
      { id: 1, category: '공지사항', title: 'C사 신규 서비스 론칭 소식 및 협업 제안', author: 'C사 사업팀', dept: 'C Company', date: '06.04', views: 55, isNew: true },
      { id: 2, category: '업무공유', title: '데이터 연동 이슈 해결 완료 보고', author: 'C사 IT팀', dept: 'C Company', date: '06.02', views: 33, hasAttachment: true },
      { id: 3, category: '자료실', title: '2026 상반기 공동 보고서 최종본', author: 'C사 기획팀', dept: 'C Company', date: '05.30', views: 48, hasAttachment: true },
      { id: 4, category: '공지사항', title: 'C사 조직 변경 및 담당자 안내', author: 'C사 인사팀', dept: 'C Company', date: '05.22', views: 19 },
    ],
  },
};

interface Props {
  boardKey: 'COLLECTIVE' | 'ION' | 'SUBSIDIARY_B' | 'SUBSIDIARY_C';
}

const BoardList: React.FC<Props> = ({ boardKey }) => {
  const config = boardConfigs[boardKey];
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');

  const filtered = config.posts.filter(p => {
    const matchCat = activeCategory === '전체' || p.category === activeCategory;
    const matchSearch = p.title.includes(search) || p.author.includes(search);
    return matchCat && matchSearch;
  });

  const colorMap: Record<string, string> = {
    blue: 'blue', rose: 'rose', indigo: 'indigo', emerald: 'emerald',
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {config.categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer border ${
              activeCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-[#fafafa] text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {cat}
          </button>
        ))}
        <SearchInput value={search} onChange={setSearch} placeholder="게시글 검색" size="sm" className="ml-auto w-52" />
      </div>

      <Widget title={`${config.title} 게시글`} color={colorMap[config.color] as any}>
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2 mt-2 border-b border-slate-100">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest w-16">분류</span>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">제목</span>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest w-24 text-right">작성자</span>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest w-12 text-right">조회</span>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest w-12 text-right">날짜</span>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 && <EmptyState message="게시글이 없습니다." size="lg" />}
          {filtered.map(post => (
            <div
              key={post.id}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-4 hover:bg-slate-50/70 cursor-pointer group transition-colors"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-16 self-center">{post.category}</span>
              <div className="flex items-center gap-2 min-w-0 self-center">
                {post.pinned && <Pin size={12} className="text-rose-400 shrink-0" />}
                <span className={`text-[14px] truncate group-hover:text-blue-700 transition-colors ${post.pinned ? 'font-black text-slate-800' : 'font-bold text-slate-700'}`}>
                  {post.title}
                </span>
                {post.hasAttachment && <Paperclip size={12} className="text-slate-300 shrink-0" />}
                {post.isNew && <Badge variant="rose" className="shrink-0">N</Badge>}
              </div>
              <div className="w-24 text-right self-center">
                <div className="text-[11px] font-bold text-slate-500 truncate">{post.author}</div>
                <div className="text-[9px] font-bold text-slate-300">{post.dept}</div>
              </div>
              <span className="text-[11px] font-bold text-slate-300 w-12 text-right self-center">{post.views}</span>
              <span className="text-[11px] font-bold text-slate-300 italic w-12 text-right self-center">{post.date}</span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          {[1, 2, 3, 4, 5].map(page => (
            <button
              key={page}
              className={`w-8 h-8 rounded text-[11px] font-black transition-all cursor-pointer border ${
                page === 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[#fafafa] text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-500'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-8 h-8 rounded text-[11px] font-black text-slate-300 border border-slate-200 hover:border-slate-300 cursor-pointer bg-[#fafafa]">
            <ChevronRight size={14} className="mx-auto" />
          </button>
        </div>
      </Widget>
    </div>
  );
};

export default BoardList;
