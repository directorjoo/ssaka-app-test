# SSAKA v30.0.2 배포 준비 체크리스트

## 코드 변경
- `/joo/` 연락처 저장의 iOS 직접 이동 경로를 `../joo.vcf`로 수정했습니다.
- 배포물에 포함되던 `admin/admin.js.tmp`, `functions/lib_entitlements.tmp` 임시 파일을 제거했습니다.
- Cloudflare Pages 설정 기본 파일 `wrangler.toml`을 추가했습니다.

## Cloudflare Pages 설정
1. Pages 프로젝트의 배포 루트(빌드 출력 디렉터리)를 저장소 루트 `.`로 지정합니다.
2. Pages 프로젝트 설정의 Functions > D1 database bindings에서 변수명 `DB`로 D1 데이터베이스를 연결합니다.
3. 결제 기능을 사용할 경우 Toss 관련 환경변수/Secret을 서버 환경에 등록합니다. 값은 소스코드나 저장소에 넣지 않습니다.
4. Preview 환경과 Production 환경 각각에 필요한 바인딩/Secret을 설정합니다.
5. 배포 후 `/api/plans`, `/api/shops` 등 API를 테스트하고, 신규 테스트 매장으로 CRUD 흐름을 검증합니다.

## 주의
- D1 데이터베이스 ID를 알 수 없어 `wrangler.toml`에 임의 값을 넣지 않았습니다. 실제 DB 바인딩은 Cloudflare 대시보드에서 `DB` 이름으로 설정해야 합니다.
- 이 설정 파일 추가는 배포 설정의 시작점이며, 실제 Cloudflare 배포/DB 연결 성공을 의미하지 않습니다.
- SNS 자동 게시에는 각 플랫폼의 앱 등록, 권한 승인, 토큰/Secret 설정이 별도로 필요합니다.
