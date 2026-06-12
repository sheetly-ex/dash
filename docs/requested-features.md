

---

## 1. 편집 기능

### 요청 내용

- 상단 네비게이션 메뉴 순서를 사용자가 직접 편집할 수 있도록
- 대시보드 위젯 배치도 드래그로 재정렬 가능하게
- 상단 프로필 영역 정보 수정 (관리 → 사람 아이콘, administrator → 홍길동, 본사 사무실 → i-on)
- 사이드바의 불필요한 "현재 메뉴" 블록 제거

### 구현 내용

#### 상단 메뉴 순서 편집

- 헤더 상단 아이콘 메뉴(마이페이지, 전자 결재, 자원 예약 등)를 **길게 눌러(약 0.3초)** 드래그하면 순서 변경
- 변경된 순서는 `localStorage` 키 `header-nav-order`에 저장되어 새로고침 후에도 유지
- 잘못된 저장값이 있으면 자동으로 기본 순서로 복구

#### 대시보드 위젯 편집

- 대시보드 6개 위젯(업무 일정, 메일, 공지, 결재·예약, Drive, 빈 섹션)을 **길게 눌러** 드래그하여 그리드 순서 변경
- 순서는 `localStorage` 키 `dashboard-widget-order-v1`에 저장

#### 프로필·메뉴 UI 편집

- 프로필 버튼: 사람 아이콘 + **홍길동** + **i-on** 표시
- 사이드바 상단 "현재 메뉴" 카드 제거

### 관련 파일

| 파일 | 역할 |
|------|------|
| `src/components/layout/Header.tsx` | 상단 메뉴 드래그 정렬, 프로필 드롭다운 |
| `src/pages/my-page/Dashboard.tsx` | 위젯 드래그 정렬 |
| `src/components/layout/Sidebar.tsx` | 사이드바 메뉴 (현재 메뉴 블록 제거됨) |

### 사용 방법

1. **상단 메뉴**: 원하는 메뉴 아이콘을 길게 누른 뒤 좌우로 드래그
2. **대시보드**: 위젯 카드 아무 곳이나 길게 누른 뒤 원하는 위치로 드래그

---

## 2. 조직도

### 요청 내용

- 전사 조직도를 직관적으로 탐색할 수 있도록
- 본부/부서 트리보다 **직급(랭크) 기준**으로 사람을 볼 수 있도록
- 검색 및 상세 정보 확인 가능

### 구현 내용

- **직급 레인(티어) 기반 레이아웃**: 임원 → 팀장 → 과장·시니어 → 대리·미드 → 주임·주니어 → 사원 → 인턴
- 각 티어 안에서 인원을 좌→우로 배치
- **검색**: 이름, 직급, 팀 키워드 필터
- **티어 필터**: 특정 직급만 보기
- **상세 패널**: 클릭 시 이메일, 전화, 입사, 위치, 메일 보내기 등 표시
- 다국어 라벨 지원 (`orgChart.tiers.*`)

### 관련 파일

| 파일 | 역할 |
|------|------|
| `src/pages/my-page/OrgChart.tsx` | 조직도 메인 페이지 |
| `src/components/org-chart/OrgNode.tsx` | 인원 노드 UI |
| `src/i18n/translations.ts` | 조직도 UI 문구 (ko/en) |

### 사용 방법

1. 사이드바 **인적 네트워크 → 전사 조직도** 이동
2. 상단 검색창 또는 티어 탭으로 필터
3. 인원 카드 클릭 → 우측(또는 하단) 상세 패널 확인

---

## 3. 연락처 — 부서 그룹 필터

### 요청 내용

- 연락처 페이지 우측에 있던 **부서 그룹** 위젯을 별도 섹션으로 두지 말 것
- 검색과 함께 **필터링 기능**으로 통합 (검색바 옆 드롭다운)

### 구현 내용

- 우측 **부서 그룹** 위젯 제거
- 검색 입력 옆에 **본부 필터 드롭다운** 추가
  - 전체 본부
  - 경영관리본부
  - 기술개발본부
  - 영업마케팅본부
  - 디자인센터
- 검색어 + 본부 선택이 **동시에** 적용
- 필터 결과 인원 수 실시간 반영
- 결과 없을 시 안내 문구 표시
- 우측에는 **즐겨찾기** 위젯만 유지

### 관련 파일

| 파일 | 역할 |
|------|------|
| `src/pages/contact/ContactHome.tsx` | 연락처 메인, 검색·필터 UI |
| `src/i18n/translations.ts` | `contact.divisions`, `contact.divisionAll` 등 |

### 사용 방법

1. **연락처 → 직원 연락처** 이동
2. 검색창에 이름·부서·이메일 등 입력
3. 검색창 옆 드롭다운에서 본부 선택
4. 테이블에 필터된 결과 표시

### 추가 업데이트 (2026-06-10)

#### 더 보기 버튼 활성화

- 처음 **6명**만 표시, **더 보기** 클릭 시 6명씩 추가 로드
- 버튼 라벨: `더 보기 (현재페이지/전체페이지)` (예: `더 보기 (1/6)`)
- 전체 로드 완료 시 `모두 불러옴 · 36/36` 표시
- 검색·본부 필터 변경 시 목록 처음부터 다시 로드
- 목 데이터 36명으로 확장

#### 연락처 테이블 border 제거

다크모드/시맨틱 색상 일괄 적용 과정에서 아래 스타일이 들어갔고, 이후 제거함:

| 위치 | 이전 클래스 | 파일 |
|------|-------------|------|
| 행 구분선 | `tbody` → `divide-y divide-app-muted` | `ContactHome.tsx` |
| 헤더 하단선 | `thead tr` → `border-b border-app-muted` | `ContactHome.tsx` |
| 부서 태그 테두리 | `border border-app/50` | `ContactRow` 컴포넌트 |
| 더 보기 영역 상단선 | `border-t border-app-muted` | `ContactHome.tsx` |

- 부서 태그는 배경색(`bg-surface-muted`)만 유지, 테두리 없음
- 이름·직급·이메일 등 **font-black/font-bold** 남용 줄이고 `font-medium`/일반 굵기로 조정

---

## 4. 언어 변경 (한국어 / English)

### 요청 내용

- 프로필 메뉴에서 언어를 변경하면 **시스템 UI 전체**가 해당 언어로 전환

### 구현 내용

- `SettingsContext` + `i18n` 시스템으로 전역 언어 상태 관리
- 지원 언어: **한국어(ko)**, **English(en)**
- 선택값 `localStorage` 키 `dash-language`에 저장
- `document.documentElement.lang` 속성 자동 갱신
- 적용 범위:
  - 헤더·사이드바·브레드크럼
  - 모든 페이지 UI 라벨
  - 알림, 폼, 빈 상태 등 공통 컴포넌트
- 목(mock) 데이터 일부는 `src/data/localized.ts`에서 ko/en 병기 지원
  - 사용자 프로필, 대시보드 메일·공지·알림 등
  - 게시글 본문, 조직도 인명 등 **콘텐츠 데이터**는 한국어 유지 가능 (추가 번역 시 동일 패턴 확장)

### 관련 파일

| 파일 | 역할 |
|------|------|
| `src/contexts/SettingsContext.tsx` | `language`, `setLanguage`, `t()`, `tArray()` |
| `src/i18n/translations.ts` | ko/en 번역 사전 |
| `src/i18n/index.ts` | `createT`, `createTArray` 헬퍼 |
| `src/data/localized.ts` | 사용자·대시보드 목 데이터 다국어 |
| `src/components/layout/Header.tsx` | 프로필 드롭다운 언어 선택 UI |

### 사용 방법

1. 우측 상단 **프로필(홍길동)** 클릭
2. **LANGUAGE** 섹션에서 **한국어** 또는 **English** 선택
3. 즉시 UI 문구 전환 (새로고침 후에도 유지)

---

## 5. 테마 설정 (라이트 / 다크 모드)

### 요청 내용

- 다크모드 적용 시 배경만 바뀌지 않고 **사이트 전체** 색상이 일관되게 변경
- 프로필 메뉴에서 라이트·다크 테마 전환

### 구현 내용

- 지원 테마: **라이트(light)**, **다크(dark)**
- `document.documentElement`에 `dark` 클래스 토글
- 선택값 `localStorage` 키 `dash-theme`에 저장 (앱 로드 전 `main.tsx`에서 초기 적용)
- CSS 변수 기반 시맨틱 색상:
  - `bg-app`, `bg-surface`, `bg-surface-elevated`
  - `text-app`, `text-app-secondary`, `text-app-muted`
  - `border-app`, `border-app-muted`
- 카드, 입력, 버튼, 네비, 모든 페이지에 일괄 적용
- 로그인 화면도 다크모드 대응 (글래스모피즘 유지)
- 드롭다운 펼침 시 뒤 요소 비침 방지 (불투명 패널 처리)

### 관련 파일

| 파일 | 역할 |
|------|------|
| `src/contexts/SettingsContext.tsx` | `theme`, `setTheme` |
| `src/index.css` | CSS 변수, `@custom-variant dark` |
| `src/main.tsx` | 초기 테마 클래스 적용 |
| `src/components/layout/Header.tsx` | 프로필 드롭다운 테마 선택 UI |
| `src/pages/login/Login.tsx` | 로그인 화면 다크모드·드롭다운 스타일 |

### 사용 방법

1. 우측 상단 **프로필(홍길동)** 클릭
2. **THEME** 섹션에서 **라이트** 또는 **다크** 선택
3. 배경·카드·텍스트·테두리가 함께 전환 (새로고침 후에도 유지)

---

## 부록: 기타 함께 반영된 UI 개선

| 항목 | 설명 |
|------|------|
| 브레드크럼 | 페이지 상단 경로 표시 (`App.tsx`), `text-sm` 크기·적절한 굵기로 가독성 개선 |
| 로그인 화면 | 글래스모피즘 디자인, 자회사 드롭다운, Google 로그인, 드롭다운 펼침 시 뒤 요소 비침 방지 |
| hover lift 제거 | 일반 UI hover 시 들어올림 효과 제거 (드래그 시에만 scale 적용) |

---

## 프로젝트 구조: `src/pages/`

도메인(메뉴 카테고리)별로 폴더 분리:

```
src/pages/
├── login/          Login.tsx
├── my-page/        Dashboard, Profile, Calendar, Vacation, VacationRequest,
│                   OrgChart, WorkSpec, OKR
├── approval/       ApprovalWrite, ApprovalList
├── reservation/    ReservationHome, ReservationDetail
├── board/          BoardHome, BoardList
├── request/        RequestHome, PurchaseRequest, PurchaseRequestDetail,
│                   CertificateRequest, CertificateRequestDetail
└── contact/        ContactHome, ContactRetired, ContactClient
```

라우팅 진입점은 `src/App.tsx`에서 각 폴더 경로로 import.

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-10 | 조직도 레퍼런스 기반 트리 UI (필 카드, 블루 연결선, 점선 부서 그룹) |
| 2026-06-10 | 게시판 바로가기 클릭 시 해당 게시판·카테고리로 이동 |
| 2026-06-10 | 결재함(받은/보낸) 리스트 항목 클릭 → 상세 페이지 (`ApprovalDetail.tsx`) |
| 2026-06-10 | `src/pages/` 도메인별 폴더 구조로 재정리 |
| 2026-06-10 | 연락처 더 보기 페이지네이션, 테이블 border 제거, 문서 최초 작성 |
| 2026-06-10 | 연락처 본부 필터 드롭다운, 언어/테마 전역 적용, 조직도·편집 기능 등 정리 |

---

## 기술 스택 요약

| 기능 | 주요 기술 |
|------|-----------|
| 드래그 정렬 | `@dnd-kit/core`, `@dnd-kit/sortable` |
| 다국어 | 자체 i18n (`translations.ts` + `createT`) |
| 다크모드 | Tailwind v4 `@custom-variant dark` + CSS 변수 |
| 상태 영속 | `localStorage` |
