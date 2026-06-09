# A9 그룹웨어 - React 프로젝트 폴더 구조

## 기술 스택
- **Frontend**: React 18 + TypeScript
- **상태관리**: Zustand (전역) + React Query (서버 상태)
- **스타일링**: Tailwind CSS + shadcn/ui
- **라우팅**: React Router v6
- **빌드**: Vite

---

## 폴더 구조

```
a9-groupware/
├── public/
│
├── src/
│   ├── assets/                         # 정적 리소스
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/                     # 공통 컴포넌트
│   │   ├── ui/                         # 기본 UI 컴포넌트 (Button, Input, Modal 등)
│   │   ├── layout/                     # 레이아웃 컴포넌트
│   │   │   ├── Sidebar/                # 사이드바 (메뉴 트리)
│   │   │   ├── Header/                 # 상단 헤더
│   │   │   ├── Footer/
│   │   │   └── PageLayout/             # 페이지 공통 래퍼
│   │   ├── charts/                     # 차트 공통 컴포넌트
│   │   ├── tables/                     # 테이블 공통 컴포넌트
│   │   └── forms/                      # 폼 공통 컴포넌트
│   │
│   ├── pages/                          # 페이지 단위 컴포넌트 (라우트 매핑)
│   │   ├── Auth/                       # 로그인
│   │   ├── Home/                       # 홈 대시보드
│   │   ├── MyA9/                       # My A9 (개인정보, 연차, 조직도 등)
│   │   ├── Approval/                   # 전자결재
│   │   ├── Board/                      # 사내게시판
│   │   ├── Survey/                     # 설문조사
│   │   ├── Reservation/                # 자원예약
│   │   ├── HRM/                        # 인적자원관리
│   │   ├── Finance/                    # 자금관리
│   │   ├── Sales/                      # 영업활동관리
│   │   ├── Transaction/                # 거래내역
│   │   ├── Equipment/                  # 장비관리
│   │   ├── Software/                   # S/W 관리
│   │   ├── RnD/                        # R&D 과제관리
│   │   ├── AccessInfo/                 # 공용접속정보
│   │   ├── CorporateCard/              # 법인카드
│   │   ├── DesignatedDriver/           # 법인대리운전
│   │   ├── IP/                         # 지적재산권
│   │   ├── Shareholders/               # 주주명부
│   │   ├── OfficialDoc/                # 공문서관리
│   │   ├── Purchase/                   # 구매/발급요청
│   │   ├── Contacts/                   # 연락처
│   │   ├── Attendance/                 # 근태관리
│   │   ├── Vision/                     # 비전&목표
│   │   ├── Meeting/                    # 회의록
│   │   ├── ProjectPL/                  # 프로젝트손익관리
│   │   ├── Financial/                  # 재무제표
│   │   ├── CRM/                        # CRM 활동관리
│   │   ├── IoT/                        # IoT
│   │   └── Settings/                   # 시스템 설정
│   │
│   ├── features/                       # 도메인별 비즈니스 로직
│   │   ├── auth/
│   │   │   ├── components/             # 해당 도메인 전용 컴포넌트
│   │   │   ├── hooks/                  # 도메인 전용 커스텀 훅
│   │   │   ├── api/                    # API 호출 함수
│   │   │   ├── store/                  # Zustand 스토어
│   │   │   └── types/                  # 타입 정의
│   │   ├── approval/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   ├── store/
│   │   │   └── types/
│   │   ├── hrm/
│   │   ├── finance/
│   │   ├── sales/
│   │   └── ...                         # 나머지 도메인 동일 구조
│   │
│   ├── hooks/                          # 전역 공통 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── usePermission.ts
│   │   ├── usePagination.ts
│   │   └── useModal.ts
│   │
│   ├── api/                            # API 클라이언트 공통 설정
│   │   ├── client.ts                   # axios 인스턴스, 인터셉터
│   │   └── endpoints.ts                # API URL 상수
│   │
│   ├── store/                          # 전역 Zustand 스토어
│   │   ├── authStore.ts
│   │   ├── uiStore.ts                  # 사이드바 열림/닫힘 등 UI 상태
│   │   └── notificationStore.ts
│   │
│   ├── router/                         # 라우팅 설정
│   │   ├── index.tsx                   # 라우트 정의
│   │   ├── PrivateRoute.tsx            # 인증 가드
│   │   └── PermissionRoute.tsx         # 권한 가드
│   │
│   ├── types/                          # 전역 공통 타입
│   │   ├── common.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── utils/                          # 유틸리티 함수
│   │   ├── date.ts
│   │   ├── format.ts                   # 숫자/금액 포맷
│   │   ├── excel.ts                    # 엑셀 다운로드
│   │   └── validator.ts
│   │
│   ├── constants/                      # 상수 정의
│   │   ├── menu.ts                     # 사이드바 메뉴 구조
│   │   ├── permissions.ts              # 권한 코드
│   │   └── codes.ts                    # 공통 코드 (직급, 직책 등)
│   │
│   ├── styles/                         # 전역 스타일
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   └── main.tsx                        # 앱 진입점
│
├── .env
├── .env.development
├── .env.production
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## 핵심 설계 원칙

### 1. `pages/` vs `features/` 분리
| 폴더 | 역할 |
|------|------|
| `pages/` | 라우트와 1:1 매핑되는 페이지 진입점. 레이아웃 조합만 담당 |
| `features/` | 도메인별 비즈니스 로직, API, 상태, 전용 컴포넌트 |

### 2. 컴포넌트 계층
```
pages (라우트 진입점)
  └── features/[domain]/components (도메인 전용)
        └── components/ui, tables, charts (공통 UI)
```

### 3. 권한 처리
- `router/PermissionRoute.tsx`에서 메뉴 접근 권한 제어
- `constants/permissions.ts`에서 권한 코드 중앙 관리
- HQ 인사/총무/회계 담당자의 자회사 접근은 `store/authStore.ts`에서 관리

### 4. 환경 분리
- `.env.development` : 개발 API 서버
- `.env.production` : 운영 API 서버1