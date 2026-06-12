import React from 'react';
import { Bell, ChevronRight, MessageCircle } from 'lucide-react';
import Widget from '../../components/ui/Widget';
import Card from '../../components/ui/Card';
import { useSettings } from '../../contexts/SettingsContext';

type BoardView = 'COLLECTIVE' | 'ION';

interface BoardHomeProps {
  setCurrentView: (v: BoardView) => void;
  onNavigateBoard: (view: BoardView, category?: string) => void;
}

const BOARD_SHORTCUTS: { label: string; count: string; board: BoardView; category: string }[] = [
  { label: '사내 안내 사항', count: '12', board: 'ION', category: '사내안내' },
  { label: '업무 매뉴얼', count: '45', board: 'ION', category: '업무매뉴얼' },
  { label: '자유 게시판', count: '128', board: 'ION', category: '자유게시판' },
  { label: '업무 자료실', count: '89', board: 'ION', category: '자료실' },
  { label: '마케팅 자료실', count: '34', board: 'COLLECTIVE', category: '경영소식' },
];

const BoardHome: React.FC<BoardHomeProps> = ({ setCurrentView, onNavigateBoard }) => {
  const { t } = useSettings();

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BoardCard
          title="I-ON Collective"
          desc={t('board.collectiveDesc')}
          icon={<Bell size={24} className="text-rose-500" />}
          color="rose"
          onClick={() => setCurrentView('COLLECTIVE')}
        />
        <BoardCard
          title="I-ON"
          desc={t('board.ionDesc')}
          icon={<MessageCircle size={24} className="text-blue-500" />}
          color="blue"
          onClick={() => setCurrentView('ION')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2">
          <Widget title={t('board.recentPosts')} color="blue">
            <div className="space-y-2 mt-2">
              <PostItem category="전사공지" title="2026년 하반기 경영전략 회의 결과 공유" date="1시간 전" author="경영전략팀" isNew />
              <PostItem category="인사안내" title="사내 보안 교육 이수 및 평가 안내" date="3시간 전" author="인사총무팀" isNew />
              <PostItem category="업무매뉴얼" title="차세대 ERP 시스템 모바일 앱 사용 가이드" date="어제" author="IT운영팀" />
              <PostItem category="자유게시판" title="오늘 점심 메뉴 투표 결과입니다!" date="어제" author="이대리" />
              <PostItem category="행사소식" title="6월 사내 세미나: AI 기술 트렌드 및 응용" date="2일 전" author="기술연구소" />
            </div>
          </Widget>
        </div>

        <div className="space-y-8">
          <Widget title={t('board.shortcuts')} color="indigo">
            <div className="grid grid-cols-1 gap-2">
              {BOARD_SHORTCUTS.map(shortcut => (
                <ShortcutItem
                  key={shortcut.label}
                  label={shortcut.label}
                  count={shortcut.count}
                  onClick={() => onNavigateBoard(shortcut.board, shortcut.category)}
                />
              ))}
            </div>
          </Widget>

          <Widget title={t('board.feedback')} color="rose">
            <Card className="p-4 bg-rose-50 border-rose-100 shadow-none" noPadding hoverable={false}>
              <p className="text-[12px] font-bold text-rose-700 leading-relaxed mb-4">
                {t('board.feedbackDesc')}
              </p>
              <button className="w-full py-3 bg-rose-600 text-white text-[11px] font-black uppercase tracking-widest rounded-md hover:bg-rose-700 transition-all cursor-pointer border-none shadow-lg shadow-rose-500/20">
                {t('board.feedbackBtn')}
              </button>
            </Card>
          </Widget>
        </div>
      </div>
    </div>
  );
};

interface BoardCardProps { title: string; desc: string; icon: React.ReactNode; color: 'rose' | 'blue'; onClick: () => void; }
function BoardCard({ title, desc, icon, color, onClick }: BoardCardProps) {
  const borderColors: Record<BoardCardProps['color'], string> = {
    rose: 'border-rose-100 hover:border-rose-300',
    blue: 'border-blue-100 hover:border-blue-300'
  };
  return (
    <Card className={`group flex items-center justify-between cursor-pointer ${borderColors[color]}`} onClick={onClick}>
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-surface-muted rounded-[0.75rem] flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-black text-app mb-1">{title}</h3>
          <p className="text-[13px] font-bold text-app-muted">{desc}</p>
        </div>
      </div>
      <ChevronRight size={20} className="text-app-muted group-hover:text-app-muted group-hover:translate-x-1 transition-all" />
    </Card>
  );
}

interface PostItemProps { category: string; title: string; date: string; author: string; isNew?: boolean; }
function PostItem({ category, title, date, author, isNew = false }: PostItemProps) {
  return (
    <div className="flex items-center gap-4 py-4 px-2 border-b border-app-muted last:border-0 hover:bg-surface-muted/50 rounded-md transition-colors cursor-pointer group">
      <span className="text-[10px] font-black text-app-muted uppercase tracking-widest w-20 shrink-0">{category}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={`text-[14px] truncate ${isNew ? 'font-black text-app' : 'font-bold text-app-secondary'}`}>
            {title}
          </h4>
          {isNew && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[11px] font-bold text-app-muted">{author}</span>
        <span className="text-[10px] font-bold text-app-muted italic">{date}</span>
      </div>
    </div>
  );
}

function ShortcutItem({ label, count, onClick }: { label: string; count: string | number; onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      className="flex items-center justify-between p-3 bg-surface-muted/50 border border-gray-200 rounded-lg hover:bg-surface-elevated hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group"
    >
      <span className="text-[13px] font-black text-app-secondary group-hover:text-blue-600 transition-colors">{label}</span>
      <span className="text-[10px] font-black text-app-muted group-hover:text-blue-400 transition-colors">{count}</span>
    </div>
  );
}

export default BoardHome;
