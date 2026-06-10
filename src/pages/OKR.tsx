import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Circle, Clock } from 'lucide-react';
import Widget from '../components/ui/Widget';
import Card from '../components/ui/Card';
import Badge, { STATUS_VARIANT } from '../components/ui/Badge';
import { useSettings } from '../contexts/SettingsContext';
import type { TranslationKey } from '../i18n';

type KRStatus = 'onTrack' | 'achieved' | 'delayed';

interface KeyResult { id: number; title: string; progress: number; status: KRStatus; }
interface Objective { id: number; title: string; owner: string; progress: number; color: string; keyResults: KeyResult[]; }

const objectives: Objective[] = [
  {
    id: 1,
    title: '고객 경험 품질 혁신',
    owner: '경영지원팀',
    progress: 72,
    color: 'blue',
    keyResults: [
      { id: 1, title: '고객 NPS 점수 45점 → 65점 달성', progress: 80, status: 'onTrack' },
      { id: 2, title: '서비스 응답 시간 평균 2초 이내 유지', progress: 95, status: 'achieved' },
      { id: 3, title: '월간 고객 불만 건수 30% 감소', progress: 60, status: 'onTrack' },
      { id: 4, title: '만족도 조사 응답률 60% 이상 확보', progress: 45, status: 'delayed' },
    ]
  },
  {
    id: 2,
    title: '조직 내부 운영 효율화',
    owner: '경영지원팀',
    progress: 58,
    color: 'indigo',
    keyResults: [
      { id: 1, title: '업무 자동화 도구 도입으로 반복 업무 40% 절감', progress: 70, status: 'onTrack' },
      { id: 2, title: '결재 처리 평균 소요 시간 48시간 → 24시간 단축', progress: 55, status: 'onTrack' },
      { id: 3, title: '사내 시스템 사용 교육 이수율 95% 달성', progress: 88, status: 'onTrack' },
    ]
  },
  {
    id: 3,
    title: '데이터 기반 의사결정 문화 정착',
    owner: '경영지원팀',
    progress: 40,
    color: 'emerald',
    keyResults: [
      { id: 1, title: '주요 KPI 대시보드 3종 구축 및 전사 배포', progress: 50, status: 'onTrack' },
      { id: 2, title: '데이터 분석 역량 강화 교육 전 팀원 이수', progress: 30, status: 'delayed' },
    ]
  }
];

const OKR: React.FC = () => {
  const { t } = useSettings();
  const [expandedObj, setExpandedObj] = useState<number | null>(1);

  const overallProgress = Math.round(
    objectives.reduce((sum, o) => sum + o.progress, 0) / objectives.length
  );

  const statusLabel = (key: KRStatus) => t(`status.${key}` as TranslationKey);
  const countSuffix = t('common.countSuffix');

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <SummaryCard label={t('okr.overallProgress')} value={`${overallProgress}%`} sub="Q2 2026" color="blue" />
        <SummaryCard label={t('okr.objectives')} value={`${objectives.length}${countSuffix}`} sub={t('okr.thisQuarter')} color="indigo" />
        <SummaryCard label={t('okr.keyResults')} value={`9${countSuffix}`} sub={t('okr.totalKr')} color="emerald" />
        <SummaryCard label={t('okr.completedKr')} value={`1${countSuffix}`} sub={t('okr.achieved')} color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <Widget title={t('okr.deptGoals')} color="blue">
            <div className="space-y-4 mt-2">
              {objectives.map(obj => (
                <div key={obj.id}>
                  <div
                    className="p-4 bg-surface-muted/50 border border-app-muted rounded-md hover:bg-surface-elevated hover:border-blue-100 hover:shadow-sm transition-all cursor-pointer group"
                    onClick={() => setExpandedObj(expandedObj === obj.id ? null : obj.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full bg-${obj.color}-500`}></div>
                        <span className="text-[14px] font-black text-app group-hover:text-blue-700 transition-colors">
                          O{obj.id}. {obj.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black text-app-muted">{obj.progress}%</span>
                        <ChevronRight
                          size={14}
                          className={`text-app-muted transition-transform ${expandedObj === obj.id ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-${obj.color}-500 transition-all`}
                        style={{ width: `${obj.progress}%` }}
                      />
                    </div>
                  </div>

                  {expandedObj === obj.id && (
                    <div className="mt-2 ml-4 space-y-2">
                      {obj.keyResults.map((kr, idx) => (
                        <KRItem key={kr.id} index={idx + 1} {...kr} statusLabel={statusLabel(kr.status)} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Widget>
        </div>

        <div className="space-y-8">
          <Widget title={t('okr.achievementSummary')} color="indigo">
            <div className="space-y-4 mt-2">
              <LegendItem color="emerald" label={statusLabel('achieved')} count={1} countSuffix={countSuffix} />
              <LegendItem color="blue" label={statusLabel('onTrack')} count={6} countSuffix={countSuffix} />
              <LegendItem color="rose" label={statusLabel('delayed')} count={2} countSuffix={countSuffix} />
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{t('okr.quarterDeadline')}</div>
              <div className="text-[22px] font-black text-blue-700">D-27</div>
              <div className="text-[11px] font-bold text-blue-400 mt-1">{t('okr.deadlineDate')}</div>
            </div>
          </Widget>

          <Widget title={t('okr.weeklyUpdates')} color="slate">
            <div className="space-y-3 mt-2">
              <UpdateItem date="06.02" text="고객 NPS 조사 결과 업데이트 (+5점)" />
              <UpdateItem date="05.28" text="자동화 도구 파일럿 테스트 완료" />
              <UpdateItem date="05.20" text="KPI 대시보드 1차 시안 검토" />
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
};

interface SummaryCardProps { label: string; value: string | number; sub: string; color: 'blue' | 'indigo' | 'emerald' | 'slate'; }
function SummaryCard({ label, value, sub, color }: SummaryCardProps) {
  const colorMap: Record<SummaryCardProps['color'], string> = { blue: 'border-blue-100 text-blue-600', indigo: 'border-indigo-100 text-indigo-600', emerald: 'border-emerald-100 text-emerald-600', slate: 'border-app-muted text-app-muted' };
  const [border, text] = colorMap[color].split(' ');
  return (
    <Card className={`p-5 border ${border} shadow-none hover:shadow-md transition-all`} noPadding>
      <div className={`text-3xl font-black mb-1 ${text}`}>{value}</div>
      <div className="text-[12px] font-black text-app-secondary uppercase tracking-wider">{label}</div>
      <div className="text-[10px] font-bold text-app-muted italic mt-1">{sub}</div>
    </Card>
  );
}

interface KRItemProps { index: number; title: string; progress: number; status: KRStatus; statusLabel: string; }
function KRItem({ index, title, progress, status, statusLabel }: KRItemProps) {
  const iconMap: Record<KRStatus, React.ReactNode> = {
    achieved: <CheckCircle2 size={14} className="text-emerald-500" />,
    onTrack: <Clock size={14} className="text-blue-500" />,
    delayed: <Circle size={14} className="text-rose-400" />,
  };
  return (
    <div className="p-3 bg-surface-elevated border border-app-muted rounded hover:border-app transition-all group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 flex-1">
          {iconMap[status]}
          <span className="text-[12px] font-bold text-app-secondary group-hover:text-app leading-tight">
            KR{index}. {title}
          </span>
        </div>
        <Badge variant={STATUS_VARIANT[status] ?? 'slate'} className="shrink-0">{statusLabel}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-surface-muted rounded-full overflow-hidden">
          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] font-black text-app-muted">{progress}%</span>
      </div>
    </div>
  );
}

interface LegendItemProps { color: 'emerald' | 'blue' | 'rose'; label: string; count: number; countSuffix: string; }
function LegendItem({ color, label, count, countSuffix }: LegendItemProps) {
  const colors: Record<LegendItemProps['color'], string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    rose: 'bg-rose-400',
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${colors[color]}`}></div>
        <span className="text-[12px] font-bold text-app-secondary">{label}</span>
      </div>
      <span className="text-[12px] font-black text-app-muted">{count}{countSuffix}</span>
    </div>
  );
}

interface UpdateItemProps { date: string; text: string; }
function UpdateItem({ date, text }: UpdateItemProps) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-app-muted last:border-0">
      <span className="text-[10px] font-black text-app-muted shrink-0 mt-0.5">{date}</span>
      <span className="text-[12px] font-bold text-app-secondary">{text}</span>
    </div>
  );
}

export default OKR;
