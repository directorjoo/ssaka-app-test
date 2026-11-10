/* vCard 3.0 생성 — 한글 이름 지원 (UTF-8) */
(function (global) {
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function build(c) {
    if (!c || !c.name) throw new Error('contact.name 이 필요합니다');
    var lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N;CHARSET=UTF-8:' + esc(c.name) + ';;;;',
      'FN;CHARSET=UTF-8:' + esc(c.name)
    ];
    if (c.org) lines.push('ORG;CHARSET=UTF-8:' + esc(c.org));
    if (c.title) lines.push('TITLE;CHARSET=UTF-8:' + esc(c.title));
    if (c.phone) lines.push('TEL;TYPE=CELL:' + String(c.phone).replace(/[^\d+]/g, ''));
    if (c.email) lines.push('EMAIL;TYPE=INTERNET:' + esc(c.email));
    if (c.address && c.address.street) {
      // ADR: 사서함;확장주소;도로명주소;시/구;도;우편번호;국가
      lines.push('ADR;TYPE=WORK;CHARSET=UTF-8:;;' + esc(c.address.street) + ';;;' + esc(c.address.zip || '') + ';대한민국');
    }
    if (c.url) lines.push('URL:' + esc(c.url));
    if (c.note) lines.push('NOTE;CHARSET=UTF-8:' + esc(c.note));
    lines.push('END:VCARD');
    return lines.join('\r\n') + '\r\n';
  }

  // 휴대폰 종류에 따라 저장 방식이 다름
  //  - 아이폰(사파리·카톡): 파일 내려받기를 막으므로, 연락처 화면을 바로 여는 data: 주소로 이동
  //  - 안드로이드·PC: .vcf 파일 내려받기 → 열면 연락처 앱으로 저장
  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function download(c) {
    var text = build(c);
    if (isIOS()) {
      location.href = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(text);
      return 'ios';
    }
    // 맨 앞 BOM(\uFEFF): 맥 연락처 앱이 한글을 깨뜨리지 않게 UTF-8임을 표시
    var blob = new Blob(['\uFEFF' + text], { type: 'text/vcard;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (c.name || 'contact') + '.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    return 'file';
  }

  var api = { build: build, download: download };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.SsakaVCard = api;
})(typeof window !== 'undefined' ? window : globalThis);
