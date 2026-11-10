# 기술 스펙

## 카드 데이터 형식 (cards/*.json)

```json
{
  "template": "actor",          // actor | kid | senior | club | shop
  "title": "배우 홍길동",
  "subtitle": "신인 배우 · 182cm · 서울",
  "theme": "dark",              // dark | light | contrast(고대비)
  "image": "https://...jpg",    // 메인 비주얼 (없으면 이니셜 배지)
  "video": "https://youtu.be/...", // 선택. 유튜브/인스타 링크
  "body": ["필모그래피 1", "필모그래피 2"],  // 본문 줄 목록
  "contact": {
    "name": "홍길동",
    "org": "OO엔터테인먼트",
    "phone": "010-0000-0000",
    "email": "a@b.com",
    "url": "https://instagram.com/...",
    "note": "캐스팅 문의"
  },
  "place": {                    // 선택. 길찾기 버튼
    "name": "북한산 우이역 2번 출구",
    "lat": 37.663, "lng": 127.012
  },
  "copy": {                     // 선택. 복사 버튼
    "label": "회비 계좌",
    "value": "카카오뱅크 3333-00-0000000 홍길동"
  },
  "buttons": ["call", "map", "save", "copy"],  // 표시할 버튼과 순서
  "sos": false                  // true면 초대형 SOS(통화) + 내 위치 보내기
}
```

## 4대 버튼 동작

| 버튼 | 구현 | 비고 |
|---|---|---|
| 바로 통화 | `tel:` 링크 | 모든 모바일 브라우저 지원 |
| 길찾기 | 카카오맵 `https://map.kakao.com/link/to/이름,위도,경도`, 네이버 `nmap://route/...` (실패 시 네이버지도 웹) | 앱 설치되어 있으면 앱으로 열림 |
| 주소록 저장 | vCard 3.0 텍스트 생성 → Blob → `.vcf` 다운로드 | iOS는 연락처 미리보기, 안드로이드는 연락처 앱으로 열기 |
| 복사 | `navigator.clipboard.writeText` → 실패 시 textarea + execCommand 대체 | 토스트 알림 표시 |

## 안심 카드 위치 보내기

1. `navigator.geolocation.getCurrentPosition` (사용자가 권한 허용해야 함)
2. 좌표로 지도 링크 생성: `https://map.kakao.com/link/map/내위치,위도,경도`
3. 보호자 번호로 `sms:번호?body=...` 열기 (iOS는 `&body=`)
4. 위치 권한 거부/실패 시 통화 버튼만 강조

## 카톡 미리보기 (3단계 과제)

카카오톡 미리보기는 서버가 내려주는 HTML의 Open Graph 태그(`og:title`, `og:description`, `og:image`)를 읽습니다.
지금처럼 `?card=actor`를 JS로 그리는 방식은 미리보기에 카드별 제목·사진이 반영되지 않습니다.
→ 3단계에서 카드마다 정적 HTML을 미리 생성(빌드 스크립트)하거나, 서버리스 함수로 OG 태그를 채워 내려주는 구조로 전환해야 합니다.
카카오 쪽 캐시 갱신은 카카오 개발자 사이트의 "공유 디버거"에서 할 수 있습니다.

## 카톡으로 보내기 (js/share.js)

| 순서 | 방식 | 조건 |
|---|---|---|
| 1 | 카카오 JS SDK `Kakao.Share.sendDefault` (feed) | `KAKAO_JS_KEY` 입력 + 카카오디벨로퍼스에 도메인 등록 |
| 2 | `navigator.share` 휴대폰 기본 공유창 | 키 없음, 모바일 브라우저 |
| 3 | 링크 복사 | 그 외 |

공유 메시지의 제목·설명·사진은 페이지의 og:title / og:description / og:image 를 그대로 씁니다.
SDK: https://t1.kakaocdn.net/kakao_js_sdk/2.8.4/kakao.min.js (2026-10 기준 최신)

## 만든 카드의 링크 (c/?d=…)

- 만들기 화면(make/)에서 적은 내용을 JSON으로 묶고, UTF-8 → base64url 로 바꿔 링크 뒤에 붙입니다 (js/codec.js).
- 서버·DB가 없으므로 비용 0원. 대신 카드를 고치면 링크가 새로 생기고, 이미 보낸 링크는 바뀌지 않습니다.
- 링크 안의 사진·영상 주소는 http/https 만 허용합니다 (javascript: 등 차단).
- 장소는 좌표 없이 이름만 있어도 됩니다 → 카카오맵 link/search, 네이버지도 검색으로 연결.
- 카톡으로 보내기 버튼은 카드의 제목·소개·사진을 공유 메시지에 직접 넣습니다. 사진이 없으면 img/ssaka-share.png.
