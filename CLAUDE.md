# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

관리자용 주문 관리 웹 애플리케이션. Next.js App Router 기반, 레이어드 아키텍처로 구성. DB는 Supabase(PostgreSQL) 사용.

**테스트 계정**: ID: `admin` / PW: `admin1234`

## 개발 명령어

```bash
npm run dev          # 개발 서버 실행 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 타입 검사 (tsc --noEmit)
```

## 기술 스택

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: 세션 기반 (Next.js middleware + httpOnly cookie), Supabase 사용 안 함 — 자체 관리자 계정만 존재
- **Supabase Client**: `@supabase/supabase-js` (서버 사이드 전용, anon key 사용)

## 환경 변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=        # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # anon/public 키 (RLS 비활성화 상태이므로 충분)
```

## 레이어드 아키텍처

```
src/
├── app/                        # Next.js App Router (라우팅 + UI 진입점)
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/            # 인증 필요 라우트 그룹
│   │   ├── layout.tsx          # 인증 가드 레이아웃
│   │   └── orders/             # 주문 목록, 상세, 등록, 수정
│   ├── api/                    # Route Handlers (컨트롤러 역할)
│   │   ├── auth/
│   │   └── orders/
│   └── proxy.ts                # 미인증 접근 차단 (Next.js 16: middleware → proxy)
├── services/                   # 비즈니스 로직 레이어
│   ├── authService.ts
│   └── orderService.ts
├── repositories/               # 데이터 접근 레이어 (Supabase)
│   ├── authRepository.ts
│   └── orderRepository.ts
├── lib/
│   ├── supabase.ts             # Supabase 클라이언트 싱글톤 (서버 전용)
│   ├── constants.ts            # ORDER_STATUSES 등 공유 상수
│   └── utils.ts
├── types/
│   └── order.ts                # Order, OrderStatus 타입
└── components/
    ├── orders/
    └── ui/
```

## 핵심 설계 결정

### 인증
- `middleware.ts`에서 보호 경로(`/orders/*` 등)에 대해 세션 쿠키 유무 확인 후 미인증 시 `/login`으로 리다이렉트.
- Supabase Auth 미사용 — 하드코딩된 관리자 계정(admin/admin1234)을 `authRepository`에서 검증.
- 세션은 서버에서만 검증.

### Supabase 연동
- `src/lib/supabase.ts`에 서버 전용 클라이언트를 싱글톤으로 생성.
- DB 접근은 항상 `repositories/` 레이어를 통해서만.
- 클라이언트 컴포넌트에서 직접 Supabase 호출 금지.

### DB 테이블: `orders`
| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | uuid | PK, default gen_random_uuid() |
| customer_name | text | NOT NULL |
| contact | text | NOT NULL |
| product_name | text | NOT NULL |
| quantity | integer | NOT NULL, >= 1 |
| amount | numeric | NOT NULL, >= 0 |
| address | text | NOT NULL |
| status | text | NOT NULL, CHECK 제약 |
| memo | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### 주문 상태값 (OrderStatus)
`접수 | 확인중 | 입금완료 | 배송준비 | 완료 | 취소`
— `src/lib/constants.ts`의 `ORDER_STATUSES` 배열로 관리. 컴포넌트·유효성 검사·DB CHECK 제약 모두 이 값을 기준으로.

### 유효성 검사 규칙
| 필드 | 규칙 |
|------|------|
| 고객명, 연락처, 상품명, 주소 | 필수 (빈값 불가) |
| 수량 | 1 이상 정수 |
| 주문금액 | 0 이상 숫자 |
| 주문상태 | `ORDER_STATUSES` 중 하나 |
| 메모 | 선택 |

## 주요 기능 목록

1. **인증**: 로그인 / 로그아웃 / 미인증 접근 차단
2. **주문 CRUD**: 목록(페이지네이션, 정렬) / 상세 조회 / 등록 / 수정 / 삭제·취소
3. **검색 & 필터**: 고객명·상품명·주문상태 검색, 상태별 탭 필터
4. **통계**: 전체·접수·입금완료·완료·취소 건수, 총 주문금액
5. **CSV 다운로드**: 현재 목록 기준 다운로드
6. **정렬**: 등록일시·주문금액·주문상태 기준

## 코드 컨벤션

- **주석**: 한국어
- **변수명·함수명**: 영어 (camelCase), 컴포넌트명 PascalCase
- API Route Handler는 HTTP 처리만, 비즈니스 로직은 `services/`로 위임
- `repositories/`는 순수 데이터 접근만 (비즈니스 규칙 포함 금지)
