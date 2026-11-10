# 싸바 다중 디자인 플랫폼 연결 허브

## 포함 어댑터
- Canva: 공식 Connect REST API OAuth 골격 및 디자인 목록/생성
- Adobe Express: 공식 Embed SDK / Express API 도입 지점 안내
- Figma: 공식 OAuth/REST API 도입 지점. 토큰 저장과 callback은 배포 전에 완료 필요
- 미리캔버스: 공개 범용 API가 확인되지 않아 파트너 API/승인 커넥터 대기 상태
- 망고보드: 공개 범용 API가 확인되지 않아 파트너 API/승인 커넥터 대기 상태

## 실행
```bash
cd design-hub
npm install
cp .env.example .env
# 실제 발급받은 자격증명을 .env에 입력
npm start
```
접속: http://localhost:4310

## 중요 제한
- `.env`의 비밀값을 브라우저에 노출하지 마세요.
- 현재 Canva OAuth 세션 저장은 개발용 메모리 Map입니다. 운영 전 암호화된 DB/세션 저장소, refresh token 회전, 사용자별 권한, CSRF/쿠키 보안, 로그 마스킹을 구현해야 합니다.
- Figma OAuth 토큰 저장/callback은 이 버전에서 활성화하지 않았습니다.
- Adobe Express는 공식 Embed SDK 프로젝트 등록 및 SDK 통합이 추가로 필요합니다.
- 미리캔버스·망고보드는 파트너/API 권한이 확보되기 전까지 직접 API 호출을 흉내 내거나 비공개 엔드포인트를 사용하지 않습니다.
- 외부 플랫폼의 템플릿/에셋을 싸바 마켓에서 재판매할 수 있는 권리가 자동으로 생기지 않습니다.
