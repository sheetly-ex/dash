export type ApprovalStatusKey = 'pending' | 'inProgress' | 'reviewing' | 'approved' | 'rejected';

export type LineStatus = 'approved' | 'reviewing' | 'waiting' | 'rejected' | 'pending';

export interface ApprovalLineStep {
  name: string;
  role: string;
  dept: string;
  status: LineStatus;
  date?: string;
  comment?: string;
}

export interface ApprovalHistoryItem {
  date: string;
  action: string;
  actor: string;
}

export interface ApprovalRecord {
  id: number;
  docId: string;
  type: string;
  title: string;
  from: string;
  dept: string;
  date: string;
  status: ApprovalStatusKey;
  urgent: boolean;
  body: string;
  attachments?: { name: string; size: string }[];
  line: ApprovalLineStep[];
  history: ApprovalHistoryItem[];
}

export const RECEIVED_APPROVALS: ApprovalRecord[] = [
  {
    id: 1, docId: 'AP-2026-0142', type: '기안서', title: '2026 하반기 팀 교육 예산 편성 계획',
    from: '이대리', dept: '경영지원팀', date: '2026.06.03', status: 'pending', urgent: true,
    body: '2026년 하반기 팀 역량 강화를 위한 교육 예산 편성 계획을 상신합니다.\n\n■ 교육 대상: 경영지원팀 전원 (8명)\n■ 예상 비용: 4,800,000원\n■ 교육 기간: 2026.07 ~ 2026.11\n\n세부 일정 및 강사 섭외 계획은 첨부 자료를 참고해 주시기 바랍니다.',
    attachments: [{ name: '하반기_교육계획서.pdf', size: '312 KB' }],
    line: [
      { name: '홍길동', role: '과장', dept: '경영지원팀', status: 'reviewing' },
      { name: '김팀장', role: '팀장', dept: '경영지원팀', status: 'waiting' },
      { name: '이부장', role: '부장', dept: '경영지원본부', status: 'waiting' },
    ],
    history: [
      { date: '2026.06.03 09:12', action: '결재 상신', actor: '이대리' },
      { date: '2026.06.03 09:15', action: '1차 결재 요청', actor: '시스템' },
    ],
  },
  {
    id: 2, docId: 'AP-2026-0138', type: '구매요청서', title: '개발팀 맥북 프로 16인치 3대 구매 요청',
    from: '박주임', dept: 'IT운영팀', date: '2026.06.02', status: 'pending', urgent: false,
    body: '노후 장비 교체를 위해 MacBook Pro 16인치 3대 구매를 요청드립니다.\n\n■ 사양: M4 Pro / RAM 48GB / SSD 1TB\n■ 예상 단가: 4,200,000원 × 3대\n■ 필요 사유: 4년 이상 사용 장비로 업무 지연 발생',
    line: [
      { name: '홍길동', role: '과장', dept: '경영지원팀', status: 'pending' },
      { name: '김팀장', role: '팀장', dept: 'IT운영팀', status: 'waiting' },
    ],
    history: [{ date: '2026.06.02 14:30', action: '결재 상신', actor: '박주임' }],
  },
  {
    id: 3, docId: 'AP-2026-0131', type: '출장신청서', title: '6월 부산 고객사 방문 출장 신청',
    from: '최과장', dept: '사업팀', date: '2026.05.30', status: 'reviewing', urgent: false,
    body: '부산 소재 주요 고객사 미팅을 위한 출장을 신청합니다.\n\n■ 출장 기간: 2026.06.12 ~ 06.13 (1박 2일)\n■ 목적: 신규 프로젝트 제안 및 계약 협의\n■ 예상 비용: 850,000원',
    line: [
      { name: '홍길동', role: '과장', dept: '경영지원팀', status: 'reviewing', comment: '검토 중입니다.' },
      { name: '박이사', role: '이사', dept: '사업본부', status: 'waiting' },
    ],
    history: [
      { date: '2026.05.30 11:00', action: '결재 상신', actor: '최과장' },
      { date: '2026.05.31 09:20', action: '1차 결재 요청', actor: '시스템' },
    ],
  },
  {
    id: 4, docId: 'AP-2026-0125', type: '휴가신청서', title: '연차 신청 (06.10 ~ 06.11)',
    from: '정사원', dept: '경영지원팀', date: '2026.05.28', status: 'approved', urgent: false,
    body: '개인 사유로 연차 2일 사용을 신청합니다.\n\n■ 사용 일자: 2026.06.10(화), 06.11(수)\n■ 잔여 연차: 12일 → 10일',
    line: [
      { name: '홍길동', role: '과장', dept: '경영지원팀', status: 'approved', date: '2026.05.28 16:40', comment: '승인합니다.' },
    ],
    history: [
      { date: '2026.05.28 15:00', action: '결재 상신', actor: '정사원' },
      { date: '2026.05.28 16:40', action: '최종 승인', actor: '홍길동 과장' },
    ],
  },
  {
    id: 5, docId: 'AP-2026-0118', type: '기안서', title: '팀 워크샵 장소 및 예산 승인 요청',
    from: '한주임', dept: '마케팅팀', date: '2026.05.25', status: 'approved', urgent: false,
    body: '상반기 팀 워크샵 개최를 위한 장소 및 예산 승인을 요청합니다.\n\n■ 일정: 2026.07.18 ~ 07.19\n■ 장소: 가평 세미나 하우스\n■ 예산: 2,400,000원',
    line: [
      { name: '홍길동', role: '과장', dept: '경영지원팀', status: 'approved', date: '2026.05.26 10:00' },
      { name: '김팀장', role: '팀장', dept: '마케팅팀', status: 'approved', date: '2026.05.25 18:00' },
    ],
    history: [
      { date: '2026.05.25 17:30', action: '결재 상신', actor: '한주임' },
      { date: '2026.05.26 10:00', action: '최종 승인', actor: '홍길동 과장' },
    ],
  },
  {
    id: 6, docId: 'AP-2026-0102', type: '품의서', title: '사무용 소모품 일괄 구매 품의',
    from: '장대리', dept: '총무팀', date: '2026.05.20', status: 'rejected', urgent: false,
    body: '2분기 사무용 소모품 일괄 구매 품의서입니다.\n\n■ 품목: A4용지, 토너, 필기구 등\n■ 예상 금액: 1,200,000원',
    line: [
      { name: '홍길동', role: '과장', dept: '경영지원팀', status: 'rejected', date: '2026.05.21 11:20', comment: '예산 집행 시기 조정 후 재상신 부탁드립니다.' },
    ],
    history: [
      { date: '2026.05.20 13:00', action: '결재 상신', actor: '장대리' },
      { date: '2026.05.21 11:20', action: '반려', actor: '홍길동 과장' },
    ],
  },
];

export const SENT_APPROVALS: ApprovalRecord[] = [
  {
    id: 1, docId: 'AP-2026-0135', type: '구매요청서', title: 'JetBrains 전체 라이선스 갱신 요청',
    from: '나 (홍길동)', dept: '경영지원팀', date: '2026.06.01', status: 'inProgress', urgent: false,
    body: '개발팀 전체 IDE 라이선스 갱신을 요청합니다.\n\n■ 제품: IntelliJ IDEA Ultimate 외 3종\n■ 갱신 기간: 2026.07.01 ~ 2027.06.30\n■ 총액: 12,600,000원',
    attachments: [{ name: 'JetBrains_견적서.pdf', size: '156 KB' }],
    line: [
      { name: '김팀장', role: '팀장', dept: '경영지원팀', status: 'approved', date: '2026.06.02 10:14', comment: '업무 필요성 확인. 승인합니다.' },
      { name: '이부장', role: '부장', dept: '경영지원본부', status: 'reviewing' },
      { name: '박이사', role: '이사', dept: 'IT운영본부', status: 'waiting' },
    ],
    history: [
      { date: '2026.06.01 14:22', action: '결재 상신', actor: '홍길동 과장' },
      { date: '2026.06.02 10:14', action: '1차 결재 승인', actor: '김팀장' },
      { date: '2026.06.02 10:15', action: '2차 결재 요청', actor: '시스템' },
    ],
  },
  {
    id: 2, docId: 'AP-2026-0120', type: '기안서', title: '팀 내 신규 인력 채용 계획서',
    from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.28', status: 'approved', urgent: false,
    body: '하반기 업무 확대에 따른 신규 인력 1명 채용 계획을 상신합니다.\n\n■ 채용 직군: 경영지원 (인사/총무)\n■ 희망 입사일: 2026.08.01',
    line: [
      { name: '김팀장', role: '팀장', dept: '경영지원팀', status: 'approved', date: '2026.05.29 09:00' },
      { name: '이부장', role: '부장', dept: '경영지원본부', status: 'approved', date: '2026.05.30 14:30' },
    ],
    history: [
      { date: '2026.05.28 11:00', action: '결재 상신', actor: '홍길동 과장' },
      { date: '2026.05.30 14:30', action: '최종 승인', actor: '이부장' },
    ],
  },
  {
    id: 3, docId: 'AP-2026-0110', type: '교육신청서', title: 'AWS 클라우드 자격증 교육 수강 신청',
    from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.20', status: 'approved', urgent: false,
    body: 'AWS Solutions Architect Associate 자격증 취득을 위한 교육 수강을 신청합니다.\n\n■ 교육 기간: 2026.06.15 ~ 06.26\n■ 교육비: 1,800,000원',
    line: [
      { name: '김팀장', role: '팀장', dept: '경영지원팀', status: 'approved', date: '2026.05.21 16:00' },
    ],
    history: [
      { date: '2026.05.20 10:00', action: '결재 상신', actor: '홍길동 과장' },
      { date: '2026.05.21 16:00', action: '최종 승인', actor: '김팀장' },
    ],
  },
  {
    id: 4, docId: 'AP-2026-0098', type: '출장신청서', title: '서울 본사 주요 회의 참석 출장 신청',
    from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.15', status: 'rejected', urgent: false,
    body: '서울 본사 전략 회의 참석을 위한 출장 신청입니다.\n\n■ 일정: 2026.05.22 ~ 05.23',
    line: [
      { name: '김팀장', role: '팀장', dept: '경영지원팀', status: 'rejected', date: '2026.05.16 09:30', comment: '동일 일정 화상 회의로 대체 가능합니다.' },
    ],
    history: [
      { date: '2026.05.15 17:00', action: '결재 상신', actor: '홍길동 과장' },
      { date: '2026.05.16 09:30', action: '반려', actor: '김팀장' },
    ],
  },
  {
    id: 5, docId: 'AP-2026-0085', type: '휴가신청서', title: '연차 사용 신청 (05.05 ~ 05.06)',
    from: '나 (홍길동)', dept: '경영지원팀', date: '2026.05.01', status: 'approved', urgent: false,
    body: '가족 행사로 연차 2일 사용을 신청합니다.\n\n■ 사용 일자: 2026.05.05, 05.06',
    line: [
      { name: '김팀장', role: '팀장', dept: '경영지원팀', status: 'approved', date: '2026.05.01 15:00' },
    ],
    history: [
      { date: '2026.05.01 14:00', action: '결재 상신', actor: '홍길동 과장' },
      { date: '2026.05.01 15:00', action: '최종 승인', actor: '김팀장' },
    ],
  },
];

export function getApproval(mode: 'received' | 'sent', id: number): ApprovalRecord | undefined {
  const list = mode === 'received' ? RECEIVED_APPROVALS : SENT_APPROVALS;
  return list.find(a => a.id === id);
}
