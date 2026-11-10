# 싸카 v14 — 매장 성과 통계

## 추가 기능
- `POST /api/analytics`: 매장 페이지 조회 및 CTA 클릭 이벤트 수집
- `GET /api/analytics?shop_key=...`: 매장 관리자 인증 후 최근 30일 요약 조회
- `js/analytics.js`: 공개 페이지의 `data-ssaka-shop` 및 `data-ssaka-track` 속성을 읽어 이벤트 전송
- `/admin/`: 오늘 조회, 최근 30일 조회, 전화·예약·길찾기·공유·메뉴 클릭 집계 표시

## 공개 페이지 연결
1. 매장 페이지의 최상위 요소에 `data-ssaka-shop="매장식별키"`를 추가합니다.
2. 페이지에 `<script src="/js/analytics.js" defer></script>`를 포함합니다.
3. 전화·예약·길찾기·공유·메뉴 링크에 각각 `data-ssaka-track="call"`, `reserve`, `directions`, `share`, `menu` 속성을 지정합니다.
4. 실제 배포 후 테스트 페이지에서 클릭하고 매장 관리자 통계 화면에서 집계 여부를 확인합니다.

## 이벤트
`view`, `call`, `reserve`, `directions`, `share`, `menu`만 허용합니다. 개인 식별 정보는 수집하지 않습니다. 현재는 단순 이벤트 카운트이며 고유 방문자, 매출 기여, 광고 전환율 분석은 포함하지 않습니다.

## 운영 전 확인
- Cloudflare Pages Functions와 D1 `DB` 바인딩 필요
- 공개 이벤트 엔드포인트에는 기본 입력 검증을 적용했으나 고도화된 봇 방지·속도 제한은 별도 적용 권장
- 관리자 조회는 기존 매장 관리자 키 인증을 사용
- 기존 공개 매장 페이지의 실제 버튼 DOM에 추적 속성과 스크립트를 연결해야 수치가 쌓입니다.
