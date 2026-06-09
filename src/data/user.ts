// 로그인된 사용자 프로필 (전역 mock)
export const currentUser = {
  name: '홍길동',
  rank: '과장',
  dept: '경영지원팀',
  division: 'IT 운영본부',
  empNo: 'A9-20220101',
  email: 'gdhong@a9.com',
};

// 결재선 규칙: 직급·금액 기준으로 결재 단계 반환
export interface Approver {
  step: number;
  name: string;
  role: string;
  dept: string;
}

export function getApprovalLine(totalAmount: number): Approver[] {
  const base: Approver[] = [
    { step: 1, name: '김팀장', role: '팀장', dept: currentUser.dept },
  ];

  if (totalAmount >= 500_000) {
    base.push({ step: 2, name: '이부장', role: '부장', dept: currentUser.dept });
  }
  if (totalAmount >= 1_000_000) {
    base.push({ step: 3, name: '박이사', role: '이사', dept: currentUser.division });
  }

  return base;
}
