# 비글즈 팩토리 (bigglz factory)

NFC 카드·굿즈 제작 서비스 소개 웹사이트. 빌드 도구 없이 브라우저가 바로 읽는 **순수 정적 사이트**(HTML/CSS/Vanilla JS)입니다.

- 운영 도메인: https://bigglzfactory.com
- 배포: Vercel(`bigglz-factory`) / Netlify 연결됨

---

## 폴더 구조

```
비글즈 팩토리/
├─ index.html            메인 (히어로 · 파트너 · 포트폴리오 · FAQ · 문의)
├─ about.html            회사소개
├─ goods.html            NFC 굿즈·콘텐츠 제작 문의 폼
├─ event.html            이벤트 솔루션
├─ support.html          고객지원 (NFC 가이드 · Q&A)
│
├─ assets/
│  ├─ css/
│  │  └─ styles.css      전체 스타일 (디자인 토큰 → 컴포넌트 → 페이지 순)
│  ├─ js/
│  │  ├─ script.js       공통 스크립트 (헤더/모바일 내비 · 파트너 로고 · 포트폴리오 · FAQ)
│  │  └─ form.js         goods.html 문의 폼 전용 로직
│  └─ images/
│     ├─ logo-bigglz.png
│     ├─ cards/          제품 카드 이미지 (포트폴리오 썸네일)
│     └─ news/           보도자료 썸네일 (news1~7)
│
├─ .vscode/              에디터 설정 · 확장 추천
├─ .editorconfig         들여쓰기·인코딩 통일
└─ .gitignore
```

**모든 페이지는 루트에 둡니다.** 정적 호스팅에서 `/about.html` 형태의 주소가 그대로 유지되어야 하기 때문입니다. 페이지를 하위 폴더로 옮기면 기존 링크가 깨집니다.

---

## 로컬에서 미리보기

`file://`로 HTML을 직접 열면 일부 스크립트가 동작하지 않습니다. 반드시 로컬 서버로 실행하세요.

**방법 1 — Live Server (권장)**

1. 커서에서 이 폴더를 엽니다.
2. 추천 확장 알림이 뜨면 설치(또는 확장 탭에서 `Live Server` 검색 후 설치).
3. `index.html`에서 마우스 우클릭 → **Open with Live Server**.
4. 파일을 저장하면 브라우저가 자동으로 새로고침됩니다.

**방법 2 — 터미널 한 줄**

```bash
python3 -m http.server 5500
```

브라우저에서 http://localhost:5500 접속.

---

## 수정할 때 어디를 보면 되는지

| 하고 싶은 일 | 파일 | 위치 |
| --- | --- | --- |
| 색상·폰트·여백 등 전체 톤 변경 | `assets/css/styles.css` | 파일 최상단 `:root` 변수 |
| 포트폴리오 항목 추가/삭제 | `assets/js/script.js` | `portfolioItems` 배열 |
| 포트폴리오 상세 내용 수정 | `assets/js/script.js` | `Portfolio detail modal` 섹션 |
| 파트너 로고 교체 | `assets/js/script.js` | `partnerLogoHashes` 배열 |
| FAQ 문구 수정 | `assets/js/script.js` | `FAQ` 섹션 |
| 문의 폼 항목 추가/수정 | `goods.html` + `assets/js/form.js` | 폼 마크업과 `buildSummary()` |
| 보도자료 추가 | `index.html` + `assets/images/news/` | 뉴스 카드 마크업 |

새 이미지를 넣을 때는 용도에 맞는 폴더(`assets/images/cards/`, `assets/images/news/`)에 저장하고, HTML에서는 `assets/images/...` 경로로 참조합니다.

---

## 외부 의존성

코드에 하드코딩된 외부 리소스입니다. 링크가 끊기면 화면에 이미지가 비어 보일 수 있습니다.

- **Pretendard 폰트** — jsDelivr CDN (`styles.css` 최상단)
- **파트너 로고 / 포트폴리오 썸네일 일부** — imweb CDN (`cdn.imweb.me`)
- **일부 포트폴리오 이미지** — `admin.bigglz.com`

---

## 배포

`.vercel/`, `.netlify/`는 각 서비스가 로컬에 만든 연결 정보이며 `.gitignore`에 포함되어 있습니다. 폴더를 다른 PC로 옮기면 `vercel link` / `netlify link`로 다시 연결하면 됩니다.

빌드 단계가 없으므로 배포 설정은 다음과 같습니다.

- Build Command: 없음
- Output Directory: 프로젝트 루트(`.`)
