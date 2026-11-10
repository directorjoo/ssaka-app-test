# 싸바 통합 빌드 안내

## 기준 소스
이 패키지는 기존 싸바/싸카 프로젝트의 `SSAKA_RESTAURANT_48_DESIGNS_v32_1.zip`을 기준으로 구성했습니다.
기존 `app/`, `make/`, `c/`, `js/`, `functions/`, `admin/` 및 업종별 디자인 자산을 보존하고,
Canva OAuth 및 디자이너 마켓 모듈을 `marketplace-service/`에 추가했습니다.

## 폴더
- `/` : 기존 Cloudflare Pages 정적 웹앱 및 Functions
- `/make/` : 기존 카드·홍보물 제작기
- `/app/` : 기존 사용자 앱
- `/c/` : 콘텐츠 뷰어
- `/js/designs.js` : 기존 디자인 엔진
- `/functions/api/` : Cloudflare Pages Functions API
- `/marketplace-service/` : 별도 Node.js 서비스 (Canva OAuth/디자이너/템플릿 상품)

## 실행
1. 기존 웹앱은 기존 Cloudflare Pages 방식으로 배포합니다.
2. `marketplace-service/`에서 `npm install`을 실행합니다.
3. `.env.example`을 `.env`로 복사하고 Canva Developer Portal에서 발급한 실제 값을 입력합니다.
4. `npm start`로 마켓 서비스를 실행합니다.
5. Canva Redirect URL은 Canva Developer Portal에 등록한 값과 `.env`의 `CANVA_REDIRECT_URI`가 정확히 일치해야 합니다.

필수 환경 변수:
- `CANVA_CLIENT_ID`
- `CANVA_CLIENT_SECRET`
- `CANVA_REDIRECT_URI`
- `SESSION_SECRET`

## 현재 포함된 구현
- Canva OAuth 2.0 Authorization Code + PKCE 흐름의 서버 모듈
- Canva 연결 및 연결된 계정의 디자인 메타데이터 조회 골격
- 디자이너 입점 신청, 관리자 승인/거절
- 템플릿 상품 등록 및 검수 상태 관리
- 판매 수익 배분 계산: 디자이너 70%, 싸바 30%

## 운영 전 반드시 완료할 항목
- 실제 Canva 앱 자격증명 등록 및 승인된 scope/앱 권한 검증
- HTTPS, 보안 쿠키, 세션 저장소, CSRF 및 요청 제한 적용
- 디자이너 계정 인증/권한 및 관리자 인증 강화
- PG 결제 승인·웹훅·환불·정산 송금 연동
- 개인정보 처리방침, 저작권/라이선스 증빙, 판매자 계약 및 세무 검토
- Cloudflare Pages 웹앱과 마켓 서비스 간 도메인/CORS/로그인 연동
- 통합 테스트 및 실제 운영 환경 보안 점검

## 중요
이 패키지는 통합 개발용 소스 번들입니다. Canva 실계정 인증, PG 결제, 환불, 자동 송금,
외부 SNS 자동 게시가 이미 운영 중이라고 의미하지 않습니다. 실제 Canva Client ID/Secret과
결제사 계약 정보는 포함하지 않았습니다.
