import { useMemo } from 'react';
import type { Language } from '../i18n/translations';
import { useSettings } from '../contexts/SettingsContext';

type L<T> = Record<Language, T>;

function pick<T>(lang: Language, val: L<T>): T {
  return val[lang];
}

// ── 현재 로그인 사용자 ──────────────────────────────────────────
const USER: {
  name: L<string>;
  rank: L<string>;
  dept: L<string>;
  division: L<string>;
  empNo: string;
  email: string;
  phone: string;
  office: L<string>;
  joinDate: L<string>;
  birthDate: L<string>;
  education: L<string>;
  company: string;
} = {
  name: { ko: '홍길동', en: 'Gil-dong Hong' },
  rank: { ko: '과장', en: 'Manager' },
  dept: { ko: '경영지원팀', en: 'Management Support' },
  division: { ko: 'IT 운영본부', en: 'IT Operations' },
  empNo: 'A9-20220101',
  email: 'gdhong@a9.com',
  phone: '010-1234-5678',
  office: { ko: '본사 사무실 (4F)', en: 'HQ Office (4F)' },
  joinDate: { ko: '2022.01.01 (재직 4년차)', en: '2022.01.01 (4 years)' },
  birthDate: { ko: '1990.05.15 (만 36세)', en: '1990.05.15 (age 36)' },
  education: { ko: '대학교 졸업 (컴퓨터공학)', en: 'B.S. Computer Science' },
  company: 'i-on',
};

export function getCurrentUser(lang: Language) {
  return {
    name: pick(lang, USER.name),
    rank: pick(lang, USER.rank),
    dept: pick(lang, USER.dept),
    division: pick(lang, USER.division),
    empNo: USER.empNo,
    email: USER.email,
    phone: USER.phone,
    office: pick(lang, USER.office),
    joinDate: pick(lang, USER.joinDate),
    birthDate: pick(lang, USER.birthDate),
    education: pick(lang, USER.education),
    company: USER.company,
    displayName: `${pick(lang, USER.name)} ${pick(lang, USER.rank)}`,
  };
}

// ── 대시보드 목 데이터 ────────────────────────────────────────
const MAILS_RAW = [
  { sender: { ko: '김철수 부장', en: 'Dir. Kim Cheol-su' }, title: { ko: '[긴급] 2분기 경영 실적 보고서 검토 요청', en: '[Urgent] Q2 performance report review request' }, time: { ko: '10:24', en: '10:24' }, isNew: true },
  { sender: { ko: 'HR 시스템', en: 'HR System' }, title: { ko: '2026년 하반기 승진 대상자 안내', en: 'H2 2026 promotion candidates notice' }, time: { ko: '09:15', en: '09:15' }, isNew: true },
  { sender: { ko: 'Google Cloud', en: 'Google Cloud' }, title: { ko: '프로젝트 청구서 발행 알림', en: 'Project invoice issued' }, time: { ko: '어제', en: 'Yesterday' }, isStarred: true },
  { sender: { ko: '이영희 팀장', en: 'TL Lee Young-hee' }, title: { ko: '다음 주 주간 전략 회의 안건 공유', en: 'Weekly strategy meeting agenda for next week' }, time: { ko: '어제', en: 'Yesterday' } },
  { sender: { ko: 'No-reply', en: 'No-reply' }, title: { ko: '사내 보안 교육 이수 완료 안내', en: 'Security training completion notice' }, time: { ko: '2일 전', en: '2 days ago' } },
];

const NOTICES_RAW = [
  { category: { ko: '필독', en: 'Must Read' }, title: { ko: '본사 건물 전기 설비 정기 점검 안내 (6/13)', en: 'HQ electrical maintenance notice (6/13)' }, date: '2026.06.01', important: true },
  { category: { ko: '인사', en: 'HR' }, title: { ko: '2026년 하계 단체 휴가 일정 확정 안내', en: '2026 summer group vacation schedule confirmed' }, date: '2026.05.30' },
  { category: { ko: '복지', en: 'Welfare' }, title: { ko: '카페테리아 메뉴 개편 및 가격 조정 안내', en: 'Cafeteria menu and pricing update' }, date: '2026.05.28' },
  { category: { ko: 'IT', en: 'IT' }, title: { ko: '사내 보안 위협 증가에 따른 비밀번호 변경 권고', en: 'Password change recommended due to security threats' }, date: '2026.05.25' },
];

const APPROVALS_RAW = [
  { label: { ko: '결재 대기', en: 'Pending approval' }, value: { ko: '08건', en: '08' }, urgent: true },
  { label: { ko: '검토 중', en: 'Under review' }, value: { ko: '14건', en: '14' } },
];

const NOTIFICATIONS_RAW = [
  { id: 1, type: 'APPROVAL', title: { ko: '결재 요청', en: 'Approval request' }, message: { ko: '김철수 부장이 2분기 성과 보고서 결재를 요청했습니다.', en: 'Dir. Kim requested approval for the Q2 performance report.' }, time: { ko: '10분 전', en: '10 min ago' }, isRead: false },
  { id: 2, type: 'NOTICE', title: { ko: '전사 공지', en: 'Company notice' }, message: { ko: '본사 건물 전기 설비 정기 점검 안내가 등록되었습니다.', en: 'HQ electrical maintenance notice has been posted.' }, time: { ko: '1시간 전', en: '1 hr ago' }, isRead: false },
  { id: 3, type: 'SCHEDULE', title: { ko: '일정 알림', en: 'Schedule alert' }, message: { ko: '30분 후 "주간 전략 회의"가 시작됩니다.', en: 'Weekly strategy meeting starts in 30 minutes.' }, time: { ko: '2시간 전', en: '2 hrs ago' }, isRead: true },
  { id: 4, type: 'MAIL', title: { ko: '새 메일', en: 'New mail' }, message: { ko: '이영희 팀장이 보낸 메일이 도착했습니다.', en: 'A new email from TL Lee Young-hee has arrived.' }, time: { ko: '어제', en: 'Yesterday' }, isRead: true },
];

const SCHEDULE_ITEMS = [
  { color: 'bg-blue-600', title: { ko: '주간 전략 회의', en: 'Weekly strategy meeting' }, time: { ko: '09:30 · 대회의실 A', en: '09:30 · Main conf. room A' } },
  { color: 'bg-indigo-400', title: { ko: '파트너사 비즈니스 미팅', en: 'Partner business meeting' }, time: { ko: '14:00 · 외부 (강남역 인근)', en: '14:00 · Offsite (near Gangnam)' } },
];

const TODAY_SCHEDULE = [
  { color: 'bg-blue-500', title: { ko: '주간 전략 회의', en: 'Weekly strategy meeting' }, time: { ko: '09:30', en: '09:30' } },
  { color: 'bg-indigo-400', title: { ko: '파트너사 미팅', en: 'Partner meeting' }, time: { ko: '14:00', en: '14:00' } },
];

const TODAY_RESERVATIONS = [
  { color: 'bg-blue-100', title: { ko: '402호 회의실', en: 'Room 402' }, time: { ko: '14:00', en: '14:00' } },
  { color: 'bg-surface-muted', title: { ko: '법인차량-04', en: 'Corp. vehicle-04' }, time: { ko: '16:00', en: '16:00' } },
];

const DRIVE_FILES_RAW = [
  { name: { ko: '2026 Q2 사업계획서.pptx', en: '2026 Q2 Business Plan.pptx' }, type: 'ppt', updated: { ko: '어제', en: 'Yesterday' }, size: '4.2 MB' },
  { name: { ko: '경영지원팀', en: 'Management Support' }, type: 'folder', updated: { ko: '2일 전', en: '2 days ago' }, size: '—' },
  { name: { ko: '2026 예산안_최종.xlsx', en: '2026 Budget Final.xlsx' }, type: 'xls', updated: { ko: '3일 전', en: '3 days ago' }, size: '1.8 MB' },
  { name: { ko: '인사 규정 개정안.docx', en: 'HR Policy Revision.docx' }, type: 'doc', updated: { ko: '1주 전', en: '1 week ago' }, size: '890 KB' },
  { name: { ko: '팀 워크샵 사진 모음', en: 'Team workshop photos' }, type: 'folder', updated: { ko: '2주 전', en: '2 weeks ago' }, size: '—' },
  { name: { ko: '온보딩 가이드_v3.pdf', en: 'Onboarding Guide v3.pdf' }, type: 'pdf', updated: { ko: '3주 전', en: '3 weeks ago' }, size: '2.1 MB' },
];

export function getMails(lang: Language) {
  return MAILS_RAW.map(m => ({
    sender: pick(lang, m.sender),
    title: pick(lang, m.title),
    time: pick(lang, m.time),
    isNew: m.isNew,
    isStarred: m.isStarred,
  }));
}

export function getNotices(lang: Language) {
  return NOTICES_RAW.map(n => ({
    category: pick(lang, n.category),
    title: pick(lang, n.title),
    date: n.date,
    important: n.important,
  }));
}

export function getApprovals(lang: Language) {
  return APPROVALS_RAW.map(a => ({
    label: pick(lang, a.label),
    value: pick(lang, a.value),
    urgent: a.urgent,
  }));
}

export function getNotifications(lang: Language) {
  return NOTIFICATIONS_RAW.map(n => ({
    id: n.id,
    type: n.type,
    title: pick(lang, n.title),
    message: pick(lang, n.message),
    time: pick(lang, n.time),
    isRead: n.isRead,
  }));
}

export function getScheduleItems(lang: Language) {
  return SCHEDULE_ITEMS.map(s => ({
    color: s.color,
    title: pick(lang, s.title),
    time: pick(lang, s.time),
  }));
}

export function getTodaySchedule(lang: Language) {
  return TODAY_SCHEDULE.map(s => ({
    color: s.color,
    title: pick(lang, s.title),
    time: pick(lang, s.time),
  }));
}

export function getTodayReservations(lang: Language) {
  return TODAY_RESERVATIONS.map(s => ({
    color: s.color,
    title: pick(lang, s.title),
    time: pick(lang, s.time),
  }));
}

export function getDriveFiles(lang: Language) {
  return DRIVE_FILES_RAW.map(f => ({
    name: pick(lang, f.name),
    type: f.type,
    updated: pick(lang, f.updated),
    size: f.size,
  }));
}

export const NOTICE_TAG_COLORS: Record<string, string> = {
  '필독': 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
  'Must Read': 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
  '인사': 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
  'HR': 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
  '복지': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  'Welfare': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  'IT': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
};

export function useLocalizedData() {
  const { language } = useSettings();
  return useMemo(() => ({
    user: getCurrentUser(language),
    mails: getMails(language),
    notices: getNotices(language),
    approvals: getApprovals(language),
    notifications: getNotifications(language),
    scheduleItems: getScheduleItems(language),
    todaySchedule: getTodaySchedule(language),
    todayReservations: getTodayReservations(language),
    driveFiles: getDriveFiles(language),
  }), [language]);
}
