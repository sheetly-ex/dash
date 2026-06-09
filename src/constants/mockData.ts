export const MAILS = [
  { sender: "김철수 부장", title: "[긴급] 2분기 경영 실적 보고서 검토 요청", time: "10:24", isNew: true },
  { sender: "HR 시스템", title: "2026년 하반기 승진 대상자 안내", time: "09:15", isNew: true },
  { sender: "Google Cloud", title: "프로젝트 청구서 발행 알림", time: "어제", isStarred: true },
  { sender: "이영희 팀장", title: "다음 주 주간 전략 회의 안건 공유", time: "어제" },
  { sender: "No-reply", title: "사내 보안 교육 이수 완료 안내", time: "2일 전" },
];

export const NOTICES = [
  { category: "필독", title: "본사 건물 전기 설비 정기 점검 안내 (6/13)", date: "2026.06.01", important: true },
  { category: "인사", title: "2026년 하계 단체 휴가 일정 확정 안내", date: "2026.05.30" },
  { category: "복지", title: "카페테리아 메뉴 개편 및 가격 조정 안내", date: "2026.05.28" },
  { category: "IT", title: "사내 보안 위협 증가에 따른 비밀번호 변경 권고", date: "2026.05.25" },
];

export const APPROVALS = [
  { label: "결재 대기", value: "08건", urgent: true },
  { label: "검토 중", value: "14건" },
];

export const ORG_CHART_DATA = {
  ceo: { name: "이대리", position: "CEO / 대표이사", department: "이사회" },
  branches: [
    {
      title: "전략기획본부",
      head: "김철수",
      teams: [
        { name: "경영지원팀", lead: "박민수" },
        { name: "인사기획팀", lead: "최지우" },
      ],
    },
    {
      title: "기술개발본부",
      head: "박영희",
      teams: [
        { name: "플랫폼개발팀", lead: "정우성" },
        { name: "인프라운영팀", lead: "한가인" },
      ],
      isHighlighted: true,
    },
    {
      title: "영업마케팅본부",
      head: "홍길동",
      teams: [
        { name: "국내영업팀", lead: "손예진" },
        { name: "글로벌마케팅팀", lead: "현빈" },
      ],
    },
  ],
};

export const CALENDAR_EVENTS = [4, 12, 18, 25];

export const NOTIFICATION_MOCKS = [
  { id: 1, type: 'APPROVAL', title: '결재 요청', message: '김철수 부장이 2분기 성과 보고서 결재를 요청했습니다.', time: '10분 전', isRead: false },
  { id: 2, type: 'NOTICE', title: '전사 공지', message: '본사 건물 전기 설비 정기 점검 안내가 등록되었습니다.', time: '1시간 전', isRead: false },
  { id: 3, type: 'SCHEDULE', title: '일정 알림', message: '30분 후 "주간 전략 회의"가 시작됩니다.', time: '2시간 전', isRead: true },
  { id: 4, type: 'MAIL', title: '새 메일', message: '이영희 팀장이 보낸 메일이 도착했습니다.', time: '어제', isRead: true },
];
