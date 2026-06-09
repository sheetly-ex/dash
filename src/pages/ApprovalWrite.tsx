import React, { useState } from 'react';
import { Send, Plus, X, ChevronDown, User, Search } from 'lucide-react';
import { MetaGrid } from '../components/ui/MetaRow';
import FormSection, { TextField, TextAreaField } from '../components/ui/FormField';
import Button from '../components/ui/Button';

const docTypes = ['기안서', '품의서', '출장신청서', '휴가신청서', '교육신청서', '구매요청서', '기타'];

const sampleApprovers = [
  { id: 1, name: '김팀장', dept: '경영지원팀', role: '팀장' },
  { id: 2, name: '이부장', dept: '경영지원팀', role: '부장' },
  { id: 3, name: '박이사', dept: '경영지원본부', role: '이사' },
];

const ApprovalWrite: React.FC = () => {
  const [docType, setDocType] = useState('기안서');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [approvers, setApprovers] = useState([sampleApprovers[0], sampleApprovers[1]]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const removeApprover = (id: number) => {
    setApprovers(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <MetaGrid items={[
        { label: '기안자', value: '홍길동 과장' },
        { label: '소속',   value: '경영지원팀' },
        { label: '기안일', value: '2026. 06. 04' },
      ]} columns={3} />

      {/* Document Type */}
      <FormSection label="문서 종류">
        <div className="relative">
          <button
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm font-black text-slate-800 hover:bg-[#fafafa] hover:border-blue-300 transition-all cursor-pointer"
          >
            {docType}
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTypeDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#fafafa] border border-slate-200 rounded shadow-xl z-10 overflow-hidden">
              {docTypes.map(type => (
                <button
                  key={type}
                  onClick={() => { setDocType(type); setShowTypeDropdown(false); }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer border-none ${docType === type ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-700'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      {/* Approvers */}
      <FormSection
        label="결재선"
        action={
          <button className="flex items-center gap-1.5 text-[11px] font-black text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent">
            <Plus size={14} /> 결재자 추가
          </button>
        }
      >
        <div className="flex items-center gap-3 flex-wrap">
          {approvers.map((a, idx) => (
            <div key={a.id} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1.5 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <User size={20} />
                  </div>
                  <button
                    onClick={() => removeApprover(a.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-400 hover:bg-rose-500 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer border-none"
                  >
                    <X size={10} />
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-[11px] font-black text-slate-700">{a.name}</div>
                  <div className="text-[9px] font-bold text-slate-400">{a.role}</div>
                </div>
              </div>
              {idx < approvers.length - 1 && <div className="w-6 h-px bg-slate-200 mb-5" />}
            </div>
          ))}
          <button className="flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent">
            <div className="w-12 h-12 rounded-md border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-blue-300 hover:text-blue-400 transition-colors">
              <Search size={18} />
            </div>
            <span className="text-[9px] font-bold text-slate-300">검색</span>
          </button>
        </div>
      </FormSection>

      <TextField label="제목" value={title} onChange={e => setTitle(e.target.value)} placeholder="문서 제목을 입력해 주세요." wrapInCard />

      <TextAreaField label="내용" value={content} onChange={e => setContent(e.target.value)} placeholder="기안 내용을 입력해 주세요." rows={12} showCharCount wrapInCard />

      <div className="flex items-center gap-4">
        <Button fullWidth icon={<Send size={16} />}>상신하기</Button>
        <Button variant="secondary">임시저장</Button>
        <Button variant="outline">취소</Button>
      </div>
    </div>
  );
};

export default ApprovalWrite;
