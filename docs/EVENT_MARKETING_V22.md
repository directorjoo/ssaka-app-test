# 싸카 v22 — 매장 이벤트 홍보

## 추가 기능
- 프로 요금제 권한을 서버에서 확인하는 이벤트 캠페인 CRUD API
- 이벤트 제목, 한 줄 소개, 상세 안내, HTTPS 홍보 이미지, 시작·종료일 관리
- 고객용 `/event/?shop_key=...` 공유 페이지
- 이벤트별 익명 조회 및 공유 횟수 집계
- 관리자 화면에서 게시 중지/재게시/삭제 및 조회·공유 수 확인
- 공개 매장 API 응답에 현재 진행 중 이벤트 최대 5건 제공

## API
- `GET /api/events?shop_key=...` 관리자 이벤트 목록
- `POST /api/events?shop_key=...` 이벤트 등록
- `PATCH /api/events/:id?shop_key=...` 게시 상태 변경
- `DELETE /api/events/:id?shop_key=...` 이벤트 삭제
- `GET /api/public/events?shop_key=...` 공개 이벤트 목록
- `POST /api/public/events?shop_key=...` `{id, action: "view"|"share"}` 익명 집계

## 운영 주의
- Cloudflare Pages Functions와 D1 바인딩 `DB`가 필요합니다.
- 이벤트 홍보 API는 `getEntitlement(...).limits.promotion`을 확인하므로 프로 요금제 권한이 필요합니다.
- 홍보 이미지 파일 업로드는 포함하지 않습니다. HTTPS 이미지 URL을 등록합니다.
- 조회/공유 집계는 공개 엔드포인트 기반이며 익명 집계값으로 실제 사람 수와 다를 수 있고, 자동화 트래픽이 완전히 제거되는 보장도 없습니다.
- 실제 운영 D1 및 모바일 브라우저 테스트는 배포 후 수행해야 합니다.
