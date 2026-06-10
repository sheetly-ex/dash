import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Pin, Paperclip, Eye, Calendar, User, Download, MessageSquare, ThumbsUp, CornerDownRight } from 'lucide-react';
import Widget from '../components/ui/Widget';
import SearchInput from '../components/ui/SearchInput';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import { useSettings } from '../contexts/SettingsContext';

interface BoardConfig {
  title: string;
  categories: string[];
  color: 'blue' | 'rose' | 'indigo' | 'emerald';
  posts: Post[];
}

interface Comment {
  id: number;
  author: string;
  dept: string;
  date: string;
  body: string;
  reply?: { author: string; dept: string; date: string; body: string };
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
  body?: string;
  attachments?: { name: string; size: string }[];
  comments?: Comment[];
}

const boardConfigs: Record<string, BoardConfig> = {
  COLLECTIVE: {
    title: 'I-ON Collective',
    color: 'rose',
    categories: ['전체', '전사공지', '경영소식', '인사안내', '행사소식'],
    posts: [
      {
        id: 1, category: '전사공지', title: '2026년 하반기 경영 목표 및 전략 방향 공유', author: '경영전략팀', dept: 'I-ON 본사', date: '06.03', views: 312, pinned: true, isNew: true,
        body: `안녕하세요, i-on 임직원 여러분.\n\n2026년 상반기를 성공적으로 마무리하며, 하반기 경영 목표 및 전략 방향을 공유드립니다.\n\n■ 하반기 핵심 목표\n1. 매출 목표 달성률 105% 초과 달성\n2. 신규 플랫폼 서비스 론칭 및 안정화 (3Q)\n3. 글로벌 파트너사 2개사 추가 확보\n4. 전사 ESG 경영 체계 고도화\n\n■ 부서별 집중 과제\n- 기술개발본부: 차세대 AI 플랫폼 베타 릴리즈\n- 영업마케팅본부: 동남아 신규 시장 진출 준비\n- 경영지원본부: 내부 프로세스 자동화 확대\n\n임직원 모두의 적극적인 참여와 협력을 부탁드립니다.\n감사합니다.`,
        comments: [
          { id: 1, author: '박영희', dept: '기술개발본부', date: '06.03 14:22', body: '명확한 방향 공유 감사합니다. 기술본부는 AI 플랫폼 목표 달성을 위해 최선을 다하겠습니다!', reply: { author: '경영전략팀', dept: 'I-ON 본사', date: '06.03 15:10', body: '감사합니다 박본부장님. 기술본부의 역할이 핵심입니다 🙏' } },
          { id: 2, author: '홍길동', dept: '영업마케팅본부', date: '06.03 16:45', body: '동남아 시장 진출 관련 상세 계획은 언제 공유될 예정인지 문의드립니다.' },
        ],
      },
      {
        id: 2, category: '인사안내', title: '6월 정기 인사이동 발령 공지', author: '인사팀', dept: 'I-ON 본사', date: '06.02', views: 289, pinned: true, hasAttachment: true,
        body: `6월 정기 인사이동 발령을 아래와 같이 공지합니다.\n\n■ 발령일: 2026년 6월 15일(월)\n\n■ 주요 인사 내용\n- 기술개발본부 플랫폼개발팀 → 인프라운영팀 발령 (3명)\n- 영업마케팅본부 국내영업팀 신규 채용 합류 (2명)\n- 경영혁신본부 디지털혁신팀장 직무 변경\n\n■ 유의사항\n발령 대상자는 6월 12일(금)까지 인사팀에 업무 인수인계 계획을 제출해 주시기 바랍니다.\n\n문의: 인사팀 (내선 1200)`,
        attachments: [{ name: '2026_06_인사발령_공문.pdf', size: '245 KB' }, { name: '인수인계_양식.docx', size: '38 KB' }],
        comments: [
          { id: 1, author: '김유진', dept: '기술개발본부', date: '06.02 10:15', body: '발령 대상자 명단도 별도로 공유되나요?' , reply: { author: '인사팀', dept: 'I-ON 본사', date: '06.02 11:30', body: '발령 대상자에게는 개별 연락드릴 예정입니다. 감사합니다.' } },
        ],
      },
      { id: 3, category: '경영소식', title: '1분기 실적 결산 및 2분기 목표 달성 현황', author: '재무팀', dept: 'I-ON 본사', date: '06.01', views: 201, hasAttachment: true,
        body: `1분기 실적 결산 및 2분기 현황을 공유드립니다.\n\n■ 1분기 주요 실적\n- 매출액: 342억 원 (전년 동기 대비 +18%)\n- 영업이익: 41억 원 (영업이익률 12.0%)\n- 신규 계약: 27건\n\n■ 2분기 현재 진행 현황 (5월 말 기준)\n- 목표 대비 달성률: 68%\n- 주요 대형 계약 3건 협의 진행 중\n\n자세한 내용은 첨부 자료를 참고해 주세요.`,
        attachments: [{ name: '2026_Q1_실적보고서.pdf', size: '1.2 MB' }],
        comments: [],
      },
      { id: 4, category: '행사소식', title: '창립 15주년 기념 행사 안내 및 참가 신청', author: '총무팀', dept: 'I-ON 본사', date: '05.30', views: 178, isNew: true,
        body: `i-on 창립 15주년을 맞이하여 기념 행사를 개최합니다. 임직원 여러분의 많은 참여 바랍니다.\n\n■ 행사 개요\n- 일시: 2026년 7월 5일(토) 17:00 ~ 21:00\n- 장소: 그랜드 인터컨티넨탈 서울 파르나스 그랜드볼룸\n- 대상: 전 임직원 및 동반 1인\n\n■ 행사 내용\n- 15주년 기념식 및 우수사원 시상\n- 팀별 장기자랑 공연\n- 뷔페 만찬 및 경품 추첨\n\n■ 참가 신청\n6월 20일(금)까지 총무팀(내선 1050)으로 신청해 주세요.`,
        comments: [
          { id: 1, author: '이수빈', dept: '전략기획본부', date: '05.30 14:00', body: '벌써 15주년이네요! 기대됩니다 😊' },
          { id: 2, author: '최동욱', dept: '기술개발본부', date: '05.30 15:30', body: '동반자 신청도 같이 하면 되나요?', reply: { author: '총무팀', dept: 'I-ON 본사', date: '05.30 16:00', body: '네, 신청 시 동반자 성함도 함께 알려주시면 됩니다!' } },
        ],
      },
      { id: 5, category: '전사공지', title: '정보보안 강화 조치 시행 안내 (전자기기 반출 관련)', author: '보안팀', dept: 'I-ON 본사', date: '05.28', views: 142,
        body: `전사 정보보안 강화 조치를 아래와 같이 시행합니다. 임직원 여러분의 협조를 부탁드립니다.\n\n■ 시행일: 2026년 6월 1일(월)부터\n\n■ 주요 조치 내용\n1. 노트북·태블릿 등 전자기기 사외 반출 시 보안팀 사전 승인 필수\n2. USB 외부 저장 장치 사용 제한 (보안 USB 지급 예정)\n3. 사내망 VPN 접속 시 2단계 인증 의무화\n\n■ 위반 시 제재\n보안 규정 위반 시 사규에 따라 경고 및 징계 처리될 수 있습니다.\n\n문의: 보안팀 (내선 1300, security@i-on.kr)`,
        comments: [],
      },
      { id: 6, category: '인사안내', title: '하반기 사내 공모 채용 접수 안내', author: '인사팀', dept: 'I-ON 본사', date: '05.26', views: 130, hasAttachment: true,
        body: `2026년 하반기 사내 공모 채용을 실시합니다.\n\n■ 공모 부서 및 인원\n- AI/ML팀: 시니어 개발자 1명\n- 글로벌마케팅팀: 마케터 2명\n- 재무회계팀: 회계 담당 1명\n\n■ 지원 자격: 재직 1년 이상 (2025년 6월 이전 입사자)\n\n■ 접수 기간: 2026년 6월 1일 ~ 6월 14일\n\n첨부 양식 작성 후 인사팀 메일로 제출해 주세요.`,
        attachments: [{ name: '사내공모_지원서_양식.docx', size: '52 KB' }],
        comments: [],
      },
      { id: 7, category: '경영소식', title: '신규 전략 파트너사 MOU 체결 소식', author: '사업개발팀', dept: 'I-ON 본사', date: '05.23', views: 105,
        body: `i-on이 글로벌 AI 솔루션 기업 'Nexora Inc.'와 전략적 파트너십 MOU를 체결했습니다.\n\n■ 체결일: 2026년 5월 22일\n■ 상대사: Nexora Inc. (미국 샌프란시스코 소재)\n\n■ 협력 내용\n- AI 기반 데이터 분석 솔루션 공동 개발\n- 아시아 태평양 지역 공동 영업망 구축\n- 기술 인재 교류 프로그램 운영\n\n이번 MOU 체결을 통해 i-on의 글로벌 사업 확장에 중요한 발판이 마련되었습니다.`,
        comments: [{ id: 1, author: '정우성', dept: '기술개발본부', date: '05.23 10:00', body: '축하드립니다! 기술협력 측면에서 기대가 큽니다.' }],
      },
    ],
  },
  ION: {
    title: 'I-ON 게시판',
    color: 'blue',
    categories: ['전체', '사내안내', '업무매뉴얼', '자유게시판', '자료실', '질문/답변'],
    posts: [
      { id: 1, category: '사내안내', title: '7월 사내 카페테리아 메뉴 개편 안내', author: '총무팀', dept: '경영지원', date: '06.04', views: 98, isNew: true,
        body: `7월부터 사내 카페테리아 메뉴가 개편됩니다.\n\n■ 주요 변경 사항\n- 건강식 옵션 확대 (샐러드 바 신설)\n- 비건 메뉴 2종 추가\n- 운영 시간 조정: 점심 11:30 ~ 13:30 (기존 12:00~13:00)\n\n■ 가격 안내\n기본 식사: 6,000원 (기존 5,500원)\n샐러드 바: 5,000원\n\n임직원 여러분의 많은 이용 바랍니다.`,
        comments: [{ id: 1, author: '김유진', dept: '플랫폼개발팀', date: '06.04 09:30', body: '샐러드 바 생겨서 너무 좋아요! 감사합니다 🥗' }],
      },
      { id: 2, category: '업무매뉴얼', title: 'A9 ERP 시스템 모바일 앱 사용 매뉴얼 v2.0', author: 'IT운영팀', dept: 'IT', date: '06.03', views: 145, pinned: true, hasAttachment: true,
        body: `A9 ERP 모바일 앱 v2.0 사용 매뉴얼을 배포합니다.\n\n■ 주요 업데이트 내역\n- 전자결재 모바일 서명 기능 추가\n- 연차/휴가 신청 UI 개선\n- 지문/Face ID 로그인 지원\n- 푸시 알림 설정 기능 신설\n\n■ 설치 방법\nApp Store / Google Play에서 'i-on ERP' 검색 후 업데이트\n\n기존 v1.x 앱은 6월 30일부로 서비스가 종료됩니다. 빠른 업데이트를 권장합니다.`,
        attachments: [{ name: 'A9_ERP_모바일앱_매뉴얼_v2.0.pdf', size: '3.4 MB' }],
        comments: [{ id: 1, author: '나채원', dept: '디지털혁신팀', date: '06.03 11:00', body: '모바일 서명 기능 정말 편리하겠네요!' }, { id: 2, author: '이준수', dept: 'CS운영팀', date: '06.03 14:22', body: '매뉴얼 감사합니다. QR코드로 설치 링크도 제공해주시면 좋겠어요.', reply: { author: 'IT운영팀', dept: 'IT', date: '06.03 15:00', body: '좋은 의견 감사합니다! 다음 공지에 반영하겠습니다.' } }],
      },
      { id: 3, category: '자유게시판', title: '이번 주 점심 같이 드실 분 구해요 (을지로 쪽)', author: '김대리', dept: '개발팀', date: '06.03', views: 67, isNew: true,
        body: `안녕하세요! 이번 주 목요일(6/5) 점심을 을지로 쪽에서 먹으려고 하는데 같이 드실 분 계신가요?\n\n후보 식당:\n1. 을지OB베어 (독일식 소시지)\n2. 미진 (냉면)\n3. 조선옥 (설렁탕)\n\n댓글로 의사 표시 부탁드립니다 😄\n12시 로비 집합 예정!`,
        comments: [{ id: 1, author: '이하나', dept: '플랫폼개발팀', date: '06.03 10:05', body: '저 가고 싶어요! 냉면 한 표요 🙋' }, { id: 2, author: '최준서', dept: '플랫폼개발팀', date: '06.03 10:30', body: '저도 참여할게요. 조선옥 한 표!' }],
      },
      { id: 4, category: '질문/답변', title: '연차 계산 기준일 질문드립니다', author: '박주임', dept: '마케팅팀', date: '06.02', views: 54,
        body: `안녕하세요, 마케팅팀 박주임입니다.\n\n2024년 12월에 입사했는데, 올해 사용 가능한 연차 일수 계산이 헷갈려서 문의드립니다.\n\n- 입사일 기준으로 계산하나요, 아니면 회계연도 기준인가요?\n- 작년에 발생한 연차를 올해도 사용할 수 있나요?\n\n인사팀이나 아는 분 계시면 답변 부탁드립니다. 감사합니다!`,
        comments: [{ id: 1, author: '인사팀', dept: 'I-ON 본사', date: '06.02 14:00', body: 'i-on은 입사일 기준으로 연차를 산정합니다. 2024년 12월 입사 시 2025년 12월까지 11일이 부여되며, 올해 추가로 15일이 발생합니다. 전년도 미사용 연차는 최대 10일까지 이월됩니다. 자세한 사항은 내선 1200으로 문의해 주세요!' }],
      },
      { id: 5, category: '자료실', title: '2026년 표준 계약서 양식 모음 (최신본)', author: '법무팀', dept: '경영지원', date: '06.01', views: 89, hasAttachment: true,
        body: `2026년 개정 법령을 반영한 표준 계약서 양식 최신본을 배포합니다.\n\n■ 포함 서식\n1. 용역 계약서 (일반형 / 간이형)\n2. 비밀유지계약서 (NDA)\n3. 업무위탁계약서\n4. 파견근로자 계약서\n5. 소프트웨어 라이선스 계약서\n\n■ 유의사항\n기존 구버전 양식 사용 금지. 계약 체결 전 반드시 법무팀 검토를 받아주시기 바랍니다.\n\n문의: 법무팀 (내선 1400)`,
        attachments: [{ name: '2026_표준계약서_모음.zip', size: '2.1 MB' }],
        comments: [],
      },
      { id: 6, category: '사내안내', title: '냉난방 시스템 점검 일정 안내 (6/15)', author: '총무팀', dept: '경영지원', date: '05.30', views: 44,
        body: `하절기 대비 냉난방 시스템 정기 점검을 실시합니다.\n\n■ 점검 일시: 2026년 6월 15일(일) 09:00 ~ 18:00\n■ 대상 구역: 본사 전 층\n\n점검 시간 동안 냉방 운영이 중단되오니 양해 부탁드립니다.\n긴급 상황 발생 시 총무팀(내선 1050)으로 연락 바랍니다.`,
        comments: [],
      },
      { id: 7, category: '자유게시판', title: '도서 공유 신청받습니다 - 개발 관련 도서 위주', author: '이과장', dept: 'IT운영팀', date: '05.28', views: 36,
        body: `안녕하세요! IT운영팀 이과장입니다.\n\n개인 소장 기술 서적을 사내 공유 도서로 등록하려고 합니다. 함께 읽고 싶은 책이 있으신 분들 신청해 주세요.\n\n현재 보유 목록:\n- Clean Code (로버트 마틴)\n- 데이터 중심 애플리케이션 설계\n- 쿠버네티스 인 액션\n- 오브젝트 (조영호)\n\n희망 도서는 댓글로 남겨주시면 구매 검토하겠습니다!`,
        comments: [{ id: 1, author: '강현지', dept: '플랫폼개발팀', date: '05.28 11:00', body: '좋은 취지 감사합니다! "파친코" 같은 비개발 도서도 추가해주시면 좋겠어요 ㅎㅎ' }],
      },
    ],
  },
  SUBSIDIARY_B: {
    title: 'B 회사 게시판',
    color: 'indigo',
    categories: ['전체', '공지사항', '협업안내', '자료공유'],
    posts: [
      { id: 1, category: '공지사항', title: 'B사 2분기 파트너십 미팅 일정 확정 안내', author: 'B사 경영지원', dept: 'B Company', date: '06.03', views: 42, pinned: true,
        body: `2분기 파트너십 정례 미팅 일정이 확정되었습니다.\n\n■ 일시: 2026년 6월 18일(수) 14:00\n■ 장소: i-on 본사 21F 대회의실 (화상 병행)\n■ 참석 대상: 양사 사업개발/기획 담당자\n\n아젠다는 미팅 3일 전 별도 공유 예정입니다.`,
        comments: [],
      },
      { id: 2, category: '협업안내', title: '공동 프로젝트 "Alpha" 킥오프 미팅 결과 공유', author: 'B사 PO', dept: 'B Company', date: '06.01', views: 38, hasAttachment: true, isNew: true,
        body: `6월 1일 진행된 Alpha 프로젝트 킥오프 미팅 결과를 공유합니다.\n\n■ 프로젝트 개요\n- 목표: 양사 데이터 연동 기반 통합 대시보드 개발\n- 기간: 2026년 7월 ~ 12월\n- 인원: i-on 3명, B사 2명\n\n■ 주요 결정 사항\n- 주간 스탠드업 미팅 매주 화요일 10시\n- 협업 채널: Slack 'project-alpha'\n- 마일스톤 및 상세 일정은 첨부 참고`,
        attachments: [{ name: 'Alpha_프로젝트_킥오프_결과보고.pptx', size: '4.2 MB' }],
        comments: [{ id: 1, author: '정민성', dept: '인프라운영팀', date: '06.01 17:00', body: '자료 공유 감사합니다. Slack 채널 초대 부탁드립니다!' }],
      },
      { id: 3, category: '자료공유', title: '통합 API 명세서 v1.3 (2026 Q2)', author: 'B사 개발팀', dept: 'B Company', date: '05.29', views: 61, hasAttachment: true,
        body: `통합 API 명세서 v1.3을 공유합니다.\n\n■ 변경 내역\n- /auth/token 엔드포인트 응답 포맷 변경\n- 신규 /analytics/report API 추가\n- Deprecated 항목 3건 제거\n\n구버전(v1.2) 사용 시 오류가 발생할 수 있으니 빠른 마이그레이션 부탁드립니다.`,
        attachments: [{ name: 'API_Spec_v1.3.pdf', size: '890 KB' }, { name: 'API_Spec_v1.3.yaml', size: '124 KB' }],
        comments: [],
      },
      { id: 4, category: '공지사항', title: 'B사 사무실 이전 및 연락처 변경 안내', author: 'B사 총무', dept: 'B Company', date: '05.25', views: 29,
        body: `B사 사무실이 아래와 같이 이전합니다.\n\n■ 이전일: 2026년 6월 9일(월)\n■ 新주소: 서울특별시 강남구 테헤란로 123, 12F\n■ 대표전화: 02-1234-5679 (변경)\n\n방문 시 참고 바랍니다.`,
        comments: [],
      },
      { id: 5, category: '협업안내', title: '하반기 공동 마케팅 캠페인 기획안 검토 요청', author: 'B사 마케팅', dept: 'B Company', date: '05.20', views: 25, hasAttachment: true,
        body: `하반기 공동 디지털 마케팅 캠페인 기획안 검토를 요청드립니다.\n\n■ 캠페인 개요\n- 기간: 2026년 8월 ~ 10월\n- 채널: SNS, 온라인 광고, 이메일\n- 예산: 양사 각 5,000만원\n\n6월 15일까지 의견 주시면 감사하겠습니다.`,
        attachments: [{ name: '공동마케팅_기획안_초안.pptx', size: '6.1 MB' }],
        comments: [],
      },
    ],
  },
  SUBSIDIARY_C: {
    title: 'C 회사 게시판',
    color: 'emerald',
    categories: ['전체', '공지사항', '업무공유', '자료실'],
    posts: [
      { id: 1, category: '공지사항', title: 'C사 신규 서비스 론칭 소식 및 협업 제안', author: 'C사 사업팀', dept: 'C Company', date: '06.04', views: 55, isNew: true,
        body: `C사의 신규 SaaS 서비스 "CloudSync Pro"가 정식 론칭되었습니다.\n\n■ 서비스 개요\n- 실시간 다중 플랫폼 데이터 동기화\n- 월 구독 기준 기업 요금제 제공\n\n■ 협업 제안\ni-on 고객사 대상 공동 제안 기회가 있을 것으로 판단됩니다. 관심 있는 담당자분들의 연락을 기다립니다.\n\n연락처: bd@c-company.kr`,
        comments: [{ id: 1, author: '손예진', dept: '국내영업팀', date: '06.04 11:00', body: '론칭 축하드립니다! 공동 제안 관련 미팅 요청드려도 될까요?' }],
      },
      { id: 2, category: '업무공유', title: '데이터 연동 이슈 해결 완료 보고', author: 'C사 IT팀', dept: 'C Company', date: '06.02', views: 33, hasAttachment: true,
        body: `지난주 보고된 데이터 연동 이슈(티켓 #2044)가 해결되었습니다.\n\n■ 원인: API Gateway 타임아웃 설정 오류\n■ 조치: 타임아웃 값 30s → 60s 조정, 재시도 로직 추가\n■ 검증: 6월 2일 오전 정상 동작 확인\n\n향후 모니터링 강화하겠습니다.`,
        attachments: [{ name: '이슈_해결_보고서.pdf', size: '310 KB' }],
        comments: [],
      },
      { id: 3, category: '자료실', title: '2026 상반기 공동 보고서 최종본', author: 'C사 기획팀', dept: 'C Company', date: '05.30', views: 48, hasAttachment: true,
        body: `2026년 상반기 양사 협업 성과 공동 보고서 최종본을 공유합니다.\n\n■ 주요 성과\n- 공동 프로젝트 3건 완료\n- 통합 고객사 6개사 신규 확보\n- 기술 이슈 공동 대응 체계 구축\n\n하반기에도 긴밀한 협력 기대합니다.`,
        attachments: [{ name: '2026_상반기_공동보고서_최종.pdf', size: '5.6 MB' }],
        comments: [],
      },
      { id: 4, category: '공지사항', title: 'C사 조직 변경 및 담당자 안내', author: 'C사 인사팀', dept: 'C Company', date: '05.22', views: 19,
        body: `C사 조직 개편에 따른 담당자 변경을 안내드립니다.\n\n■ 변경 내용\n- IT팀 → 기술본부로 개편\n- i-on 협업 담당: 기존 김팀장 → 이본부장으로 변경\n\n■ 신규 담당자 연락처\n이본부장 / tech@c-company.kr / 010-2000-0001\n\n향후 협업 시 참고 부탁드립니다.`,
        comments: [],
      },
    ],
  },
};

const ALL_CATEGORY = '전체';

// ── 게시글 상세 ────────────────────────────────────────────────
function PostDetail({ post, boardTitle, onBack }: { post: Post; boardTitle: string; onBack: () => void }) {
  const { t } = useSettings();
  const [commentText, setCommentText] = useState('');
  const lines = (post.body ?? '').split('\n');

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[11px] font-black text-app-muted hover:text-app-secondary transition-colors cursor-pointer border-none bg-transparent">
        <ChevronLeft size={14} /> {boardTitle} {t('board.backToList')}
      </button>

      {/* 헤더 */}
      <div className="bg-surface-muted rounded-xl border border-app p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-app-muted bg-surface-muted px-2 py-0.5 rounded uppercase tracking-widest">{post.category}</span>
          {post.pinned && <Pin size={12} className="text-rose-400" />}
          {post.isNew && <Badge variant="rose">NEW</Badge>}
        </div>
        <h1 className="text-xl font-black text-app leading-snug">{post.title}</h1>
        <div className="flex items-center gap-4 text-[11px] font-bold text-app-muted flex-wrap">
          <span className="flex items-center gap-1"><User size={11} /> {post.author} · {post.dept}</span>
          <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
          <span className="flex items-center gap-1"><Eye size={11} /> {t('board.viewCount')} {post.views}</span>
          {post.hasAttachment && <span className="flex items-center gap-1"><Paperclip size={11} /> {t('board.attachmentCount')} {post.attachments?.length ?? 0}{t('common.countSuffix')}</span>}
        </div>
      </div>

      {/* 본문 */}
      <div className="bg-surface-muted rounded-xl border border-app p-6">
        <div className="text-[14px] font-medium text-app-secondary leading-relaxed space-y-2">
          {lines.map((line, i) =>
            line === '' ? <br key={i} /> :
            line.startsWith('■') ? <p key={i} className="font-black text-app mt-4 first:mt-0">{line}</p> :
            line.startsWith('-') ? <p key={i} className="pl-3 text-app-secondary">{line}</p> :
            /^\d+\./.test(line) ? <p key={i} className="pl-3 text-app-secondary">{line}</p> :
            <p key={i}>{line}</p>
          )}
        </div>
      </div>

      {/* 첨부파일 */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="bg-surface-elevated rounded-xl border border-app p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-black text-app-muted mb-3">
            <Paperclip size={12} /> {t('board.attachments')} {post.attachments.length}{t('common.countSuffix')}
          </div>
          {post.attachments.map((file, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface-muted border border-app-muted hover:border-app transition-colors group">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center shrink-0">
                  <Paperclip size={12} className="text-blue-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-app-secondary truncate">{file.name}</div>
                  <div className="text-[10px] font-bold text-app-muted">{file.size}</div>
                </div>
              </div>
              <button className="flex items-center gap-1 text-[10px] font-black text-app-muted hover:text-blue-600 transition-colors cursor-pointer border-none bg-transparent shrink-0">
                <Download size={12} /> {t('board.download')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 */}
      <div className="bg-surface-muted rounded-xl border border-app p-5 space-y-4">
        <div className="flex items-center gap-1.5 text-[12px] font-black text-app-secondary">
          <MessageSquare size={13} /> {t('board.comments')} {post.comments?.length ?? 0}
        </div>

        {(!post.comments || post.comments.length === 0) && (
          <p className="text-[12px] font-bold text-app-muted text-center py-4">{t('board.firstComment')}</p>
        )}

        <div className="space-y-3">
          {post.comments?.map(c => (
            <div key={c.id} className="space-y-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-[11px] font-black text-app-muted shrink-0">
                  {c.author[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[12px] font-black text-app-secondary">{c.author}</span>
                    <span className="text-[9px] font-bold text-app-muted">{c.dept}</span>
                    <span className="text-[9px] font-bold text-app-muted ml-auto">{c.date}</span>
                  </div>
                  <div className="text-[13px] font-medium text-app-secondary leading-relaxed bg-surface-muted rounded-lg px-3 py-2">{c.body}</div>
                  <button className="mt-1 flex items-center gap-1 text-[10px] font-black text-app-muted hover:text-blue-500 transition-colors cursor-pointer border-none bg-transparent">
                    <ThumbsUp size={10} /> {t('board.like')}
                  </button>
                </div>
              </div>
              {c.reply && (
                <div className="flex gap-3 pl-11">
                  <CornerDownRight size={12} className="text-app-muted mt-2 shrink-0" />
                  <div className="flex gap-3 flex-1">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 shrink-0">
                      {c.reply.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[11px] font-black text-app-secondary">{c.reply.author}</span>
                        <span className="text-[9px] font-bold text-app-muted">{c.reply.dept}</span>
                        <span className="text-[9px] font-bold text-app-muted ml-auto">{c.reply.date}</span>
                      </div>
                      <div className="text-[12px] font-medium text-app-secondary leading-relaxed bg-blue-50 rounded-lg px-3 py-2">{c.reply.body}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="flex gap-2 pt-2 border-t border-app-muted">
          <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-[11px] font-black text-white shrink-0">홍</div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder={t('board.commentPlaceholder')}
              className="flex-1 px-3 py-2 text-[12px] font-medium rounded-lg border border-app bg-surface-muted focus:outline-none focus:border-blue-400 focus:bg-surface-elevated transition-colors"
            />
            <button
              onClick={() => setCommentText('')}
              className="px-4 py-2 rounded-lg bg-surface-elevated text-white text-[11px] font-black hover:bg-surface-elevated transition-colors cursor-pointer border-none"
            >
              {t('board.commentSubmit')}
            </button>
          </div>
        </div>
      </div>

      {/* 이전/다음 */}
      <div className="bg-surface-elevated rounded-xl border border-app divide-y divide-slate-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-[10px] font-black text-app-muted w-8 shrink-0">{t('board.prev')}</span>
          <button onClick={onBack} className="text-[13px] font-bold text-app-muted hover:text-blue-600 transition-colors cursor-pointer border-none bg-transparent text-left">
            {post.id > 1 ? '← 이전 글로 이동' : '이전 글이 없습니다'}
          </button>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-[10px] font-black text-app-muted w-8 shrink-0">{t('board.next')}</span>
          <button onClick={onBack} className="text-[13px] font-bold text-app-muted hover:text-blue-600 transition-colors cursor-pointer border-none bg-transparent text-left">
            다음 글로 이동 →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 게시글 목록 ────────────────────────────────────────────────
interface Props {
  boardKey: 'COLLECTIVE' | 'ION' | 'SUBSIDIARY_B' | 'SUBSIDIARY_C';
}

const BoardList: React.FC<Props> = ({ boardKey }) => {
  const { t } = useSettings();
  const config = boardConfigs[boardKey];
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const categoryLabel = (cat: string) => cat === ALL_CATEGORY ? t('board.all') : cat;

  const filtered = config.posts.filter(p => {
    const matchCat = activeCategory === ALL_CATEGORY || p.category === activeCategory;
    const matchSearch = p.title.includes(search) || p.author.includes(search);
    return matchCat && matchSearch;
  });

  const colorMap: Record<string, string> = {
    blue: 'blue', rose: 'rose', indigo: 'indigo', emerald: 'emerald',
  };

  if (selectedPost) {
    return <PostDetail post={selectedPost} boardTitle={config.title} onBack={() => setSelectedPost(null)} />;
  }

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
                : 'bg-surface-elevated text-app-muted border-app hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {categoryLabel(cat)}
          </button>
        ))}
        <SearchInput value={search} onChange={setSearch} placeholder={t('common.searchPosts')} size="sm" className="ml-auto w-52" />
      </div>

      <Widget title={`${config.title} ${t('board.postsTitle')}`} color={colorMap[config.color] as 'blue' | 'rose' | 'indigo' | 'emerald'}>
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2 mt-2 border-b border-app-muted">
          <span className="text-[9px] font-black text-app-muted uppercase tracking-widest w-16">{t('board.category')}</span>
          <span className="text-[9px] font-black text-app-muted uppercase tracking-widest">{t('board.title')}</span>
          <span className="text-[9px] font-black text-app-muted uppercase tracking-widest w-24 text-right">{t('board.author')}</span>
          <span className="text-[9px] font-black text-app-muted uppercase tracking-widest w-12 text-right">{t('board.views')}</span>
          <span className="text-[9px] font-black text-app-muted uppercase tracking-widest w-12 text-right">{t('board.date')}</span>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 && <EmptyState message={t('board.noPosts')} size="lg" />}
          {filtered.map(post => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-4 hover:bg-surface-muted/70 cursor-pointer group transition-colors"
            >
              <span className="text-[10px] font-black text-app-muted uppercase tracking-widest w-16 self-center">{post.category}</span>
              <div className="flex items-center gap-2 min-w-0 self-center">
                {post.pinned && <Pin size={12} className="text-rose-400 shrink-0" />}
                <span className={`text-[14px] truncate group-hover:text-blue-700 transition-colors ${post.pinned ? 'font-black text-app' : 'font-bold text-app-secondary'}`}>
                  {post.title}
                </span>
                {post.hasAttachment && <Paperclip size={12} className="text-app-muted shrink-0" />}
                {post.isNew && <Badge variant="rose" className="shrink-0">N</Badge>}
              </div>
              <div className="w-24 text-right self-center">
                <div className="text-[11px] font-bold text-app-muted truncate">{post.author}</div>
                <div className="text-[9px] font-bold text-app-muted">{post.dept}</div>
              </div>
              <span className="text-[11px] font-bold text-app-muted w-12 text-right self-center">{post.views}</span>
              <span className="text-[11px] font-bold text-app-muted italic w-12 text-right self-center">{post.date}</span>
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
                  : 'bg-surface-elevated text-app-muted border-app hover:border-blue-300 hover:text-blue-500'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-8 h-8 rounded text-[11px] font-black text-app-muted border border-app hover:border-app cursor-pointer bg-surface-elevated">
            <ChevronRight size={14} className="mx-auto" />
          </button>
        </div>
      </Widget>
    </div>
  );
};

export default BoardList;
