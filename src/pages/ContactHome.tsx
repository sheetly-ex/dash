import React from 'react';
import { Contact2, Search, Phone, Mail, ChevronRight, UserPlus, Globe, MoreHorizontal } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';

const ContactHome: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Search & Action Bar */}
      <Card className="flex flex-col md:flex-row gap-6 items-center" hoverable={false}>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="이름, 부서, 업무, 전화번호로 검색..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-4 pl-14 pr-6 text-sm focus:bg-[#fafafa] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 border-none cursor-pointer">
            <UserPlus size={18} />
            연락처 추가
          </button>
          <button className="flex-1 md:flex-none px-8 py-4 bg-slate-800 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2 border-none cursor-pointer">
            <Globe size={18} />
            조직도 보기
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Contact List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">전체 직원 <span className="text-blue-600 ml-1 text-sm">248</span></h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#fafafa] border border-slate-200 rounded text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50">성명순</span>
              <span className="px-3 py-1 bg-blue-600 border border-blue-600 rounded text-[10px] font-black text-white uppercase tracking-widest cursor-pointer">부서순</span>
            </div>
          </div>
          
          <Card className="overflow-hidden" noPadding hoverable={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">성명 / 직급</th>
                    <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">부서</th>
                    <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">이메일</th>
                    <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">휴대폰</th>
                    <th className="py-5 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <ContactRow 
                    name="김철수" 
                    pos="부장" 
                    dept="인사총무팀" 
                    email="csk@a9.com" 
                    phone="010-1111-2222" 
                  />
                  <ContactRow 
                    name="이영희" 
                    pos="팀장" 
                    dept="전략기획팀" 
                    email="yhlee@a9.com" 
                    phone="010-3333-4444" 
                  />
                  <ContactRow 
                    name="박민수" 
                    pos="과장" 
                    dept="경영지원팀" 
                    email="mspark@a9.com" 
                    phone="010-5555-6666" 
                  />
                  <ContactRow 
                    name="정우성" 
                    pos="대리" 
                    dept="플랫폼개발팀" 
                    email="wsjung@a9.com" 
                    phone="010-7777-8888" 
                  />
                  <ContactRow 
                    name="한가인" 
                    pos="대리" 
                    dept="인프라운영팀" 
                    email="gihan@a9.com" 
                    phone="010-9999-0000" 
                  />
                  <ContactRow 
                    name="손예진" 
                    pos="팀장" 
                    dept="국내영업팀" 
                    email="yjson@a9.com" 
                    phone="010-2222-3333" 
                  />
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/30 text-center border-t border-slate-50">
              <button className="text-[11px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest border-none bg-transparent cursor-pointer">더 보기 (1/42)</button>
            </div>
          </Card>
        </div>

        {/* Groups & Favorites */}
        <div className="space-y-8">
          <Widget title="즐겨찾기" color="rose">
            <div className="space-y-4">
              <FavoriteItem name="이대리 (CEO)" dept="이사회" />
              <FavoriteItem name="김철수 부장" dept="인사총무팀" />
              <FavoriteItem name="박민수 과장" dept="경영지원팀" />
            </div>
          </Widget>

          <Widget title="부서 그룹" color="indigo">
            <div className="space-y-3">
              <GroupItem label="경영관리본부" count="24" />
              <GroupItem label="기술개발본부" count="86" />
              <GroupItem label="영업마케팅본부" count="42" />
              <GroupItem label="디자인센터" count="15" />
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
};

function ContactRow({ name, pos, dept, email, phone }: any) {
  return (
    <tr className="group hover:bg-blue-50/30 transition-colors cursor-pointer">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Contact2 size={16} />
          </div>
          <div>
            <div className="text-[14px] font-black text-slate-800 group-hover:text-blue-600 transition-colors">{name}</div>
            <div className="text-[11px] font-bold text-slate-400">{pos}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-[12px] font-black text-slate-600 uppercase tracking-tighter bg-slate-100 px-2.5 py-1 rounded border border-slate-200/50 group-hover:bg-[#fafafa] transition-colors">{dept}</span>
      </td>
      <td className="py-4 px-6 text-[13px] font-bold text-slate-500">{email}</td>
      <td className="py-4 px-6 text-[13px] font-bold text-slate-500">{phone}</td>
      <td className="py-4 px-6 text-right">
        <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors border-none bg-transparent cursor-pointer">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}

function FavoriteItem({ name, dept }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all">
          <Contact2 size={14} />
        </div>
        <div>
          <div className="text-[13px] font-black text-slate-800 group-hover:text-rose-600 transition-colors">{name}</div>
          <div className="text-[10px] font-bold text-slate-400">{dept}</div>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
    </div>
  );
}

function GroupItem({ label, count }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100/50 rounded-lg hover:bg-[#fafafa] hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer group">
      <span className="text-[13px] font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{label}</span>
      <span className="text-[10px] font-black text-slate-300 group-hover:text-indigo-400 transition-colors">{count}</span>
    </div>
  );
}

export default ContactHome;
