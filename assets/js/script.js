// ---------- Header scroll ----------
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 10;
  header.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Partner logos (bigglzfactory.com Partners 섹션 실제 로고) ----------
const PARTNER_LOGO_CDN = 'https://cdn.imweb.me/thumbnail/20251219/';
const partnerLogoHashes = [
  'cd71cc1c1090b', '0f666a8db4628', 'ff60466ba1a40', '75143a386bfbd', 'dead4637c30c3',
  '026983cba4435', '1a91e61bfbd50', '4efd1c113698c', 'd18b7de72657b', '2de29eba049ad',
  'c288b9e410dcc', '4b0629d738f0b', '7001d75fbfe0e', 'bac46d44cb331', '0ab669d2b2091',
  'c57a53d2e8af3', 'd50a6f8ea1b4a', '704cd7a26817d', 'dc17578526526', 'f08df18c7ea33',
  'b888ff053baf5', '0be5458980213', '28ad528855c1d', '68eb5f671ecfe', '79c9e5b033e65',
  '8d8912a24d3a6', '659d136cfdf54', 'f2a7ad08ba78a', 'cec3d5ecbb29c', '9475759c75fcb',
  '6fc87ac5949c9', 'b0451c5fe68dc', 'a039d31d559b3', 'ac5e265e8a0ce', 'd2d0a955df2b0',
  'a1d48e16dde0f', '08fb74433cf2b', '21474cc7922fa', '947f6b0695ba6', 'dbd1fb805b3c6',
  'fc9ff32d263e5',
];

const logoTrack = document.getElementById('logoTrack');
if (logoTrack) {
  const logosHtml = partnerLogoHashes.map((h, i) =>
    `<div class="logo-chip logo-chip-${i % 6}"><img src="${PARTNER_LOGO_CDN}${h}.png" alt="협업 파트너사 로고" loading="lazy"></div>`
  ).join('');
  logoTrack.innerHTML = logosHtml + logosHtml; // 이음매 없는 마퀴를 위해 2배 반복
}

// ---------- Portfolio data (bigglz factory 실제 포트폴리오) ----------
const CDN = 'https://cdn.imweb.me/thumbnail/20251217/';
const portfolioItems = [
  // NFC 포토카드
  { img: 'assets/images/cards/card-front-namecard.png', title: '비글즈 NFC 포토카드', cat: 'photocard', tag: 'NFC 포토카드' },
  { img: 'assets/images/cards/card-membership.png', title: '청리움 프리미엄 멤버십 NFC 카드', cat: 'photocard', tag: 'NFC 포토카드' },
  // 팬포스트 / 챗봇
  { hash: '8f32256b4d054', title: '안양 정관장 X bigglz AI 팬 포스트', cat: ['fanpost', 'chatbot'], tag: '팬포스트' },
  // 타로
  { img: 'assets/images/cards/card-front-tarot.png', title: '비글즈 NFC 타로 카드', cat: 'tarot', tag: '타로' },
  // 운세 / 타로 / 챗봇
  { hash: 'dcae230333160', title: 'ncDinos X bigglz 운세·타로 콘텐츠', cat: ['fortune', 'tarot', 'chatbot'], tag: '운세·타로' },
  { hash: '5e52e47efb641', title: 'NameX Ent X bigglz 운세 콘텐츠', cat: ['fortune', 'chatbot'], tag: '운세' },
  { hash: 'f2ab010306f2a', title: 'FC안양 X bigglz 운세 콘텐츠', cat: ['fortune', 'chatbot'], tag: '운세' },
  { img: 'https://admin.bigglz.com/images/news/96047510-2373-4dff-bfbd-e7d57d4734f6.png', title: 'KURA SUSHI USA X bigglz 운세 콘텐츠', cat: ['fortune', 'chatbot'], tag: '운세' },
  { hash: 'b09baef9e23ed', title: 'NFC 운세 · 망고 데일리 포춘', cat: ['fortune', 'chatbot'], tag: '운세' },
  { hash: '07eccebb2855b', title: 'NFC 운세 · 포그니 행운 부적', cat: ['fortune', 'chatbot'], tag: '운세' },
  // 미니게임
  { hash: 'e329462c55a83', title: 'NFC 미니게임 · 젤리 러버 레이', cat: 'minigame', tag: '미니게임' },
  { hash: 'f01b709b0bff8', title: '오로라월드 X bigglz 수집형 미니게임', cat: 'minigame', tag: '미니게임' },
];

const pfGrid = document.getElementById('pfGrid');
const pfMore = document.getElementById('pfMore');
const pfMoreBtn = document.getElementById('pfMoreBtn');
const PF_LIMIT = 8;
let pfCurrentFilter = 'all';
let pfShowAll = false;

function pfMatch(item, filter) {
  return filter === 'all' || item.cat === filter || (Array.isArray(item.cat) && item.cat.includes(filter));
}

function renderPortfolio(filter) {
  pfCurrentFilter = filter;
  const items = portfolioItems.filter(item => pfMatch(item, filter));
  const visible = pfShowAll ? items : items.slice(0, PF_LIMIT);
  pfGrid.innerHTML = visible.map(item => {
    const src = item.img || `${CDN}${item.hash}.png`;
    return `
      <div class="pf-card" data-idx="${portfolioItems.indexOf(item)}" role="button" tabindex="0" aria-label="${item.title} 상세 보기">
        <div class="pf-thumb"><img src="${src}" alt="${item.title}" loading="lazy"></div>
        <div class="pf-body">
          <span class="pf-tag">${item.tag}</span>
          <h4>${item.title}</h4>
        </div>
      </div>
    `;
  }).join('');
  pfMore.style.display = (!pfShowAll && items.length > PF_LIMIT) ? '' : 'none';
}
renderPortfolio('all');

document.getElementById('pfFilters').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#pfFilters button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  pfShowAll = false;
  renderPortfolio(btn.dataset.filter);
});

pfMoreBtn.addEventListener('click', () => {
  pfShowAll = true;
  renderPortfolio(pfCurrentFilter);
});

// ---------- Portfolio detail modal (case study) ----------
const pfModal = document.getElementById('pfModal');
const pfModalBody = document.getElementById('pfModalBody');

// 타이틀에서 클라이언트명 추출 (예: "KURA SUSHI USA X bigglz ..." → "KURA SUSHI USA")
function pfClient(item) {
  if (item.client) return item.client;
  const m = item.title.match(/^(.+?)\s*[xX×]\s*bigglz/);
  return m ? m[1].trim() : 'bigglz factory';
}

// 카테고리별 태그라인 (한 줄 요약)
function pfPrimaryCat(item) {
  return Array.isArray(item.cat) ? item.cat[0] : item.cat;
}
function pfTagline(item) {
  return ({
    photocard: '카드를 태그하면, 브랜드 콘텐츠가 열립니다',
    minigame: '굿즈에서 시작되는 플레이, 다시 찾게 되는 재미',
    tarot: '태그 한 번으로 열리는 나만의 타로 리딩',
    fortune: '매일 다시 꺼내보고 싶은 오늘의 운세',
    fanpost: '팬과 브랜드가 만나는 AI 팬 포스트 경험',
  })[pfPrimaryCat(item)] || '태그 한 번으로 이어지는 브랜드 경험';
}

// 카테고리별 케이스 스터디 본문
function pfStory(item) {
  const t = item.title;
  return ({
    photocard: [
      `${t}은(는) NFC를 담은 포토카드 프로젝트입니다. 카드를 스마트폰에 태그하면 브랜드·아티스트의 페이지가 즉시 열립니다.`,
      `포토카드에 NFC 칩과 QR을 함께 담아, 앱 설치 없이 태그만으로 영상·SNS·이벤트 콘텐츠로 연결됩니다. 소장 가치와 디지털 경험을 동시에 전합니다.`,
      `비글즈는 카드 디자인부터 연결 페이지 기획·개발까지 한 번에 진행해, 포토카드 한 장이 지속되는 팬 접점이 되도록 설계했습니다.`,
    ],
    minigame: [
      `${t}은(는) NFC 굿즈를 플레이의 시작점으로 만든 미니게임 콘텐츠입니다. 태그 한 번으로 게임이 열리고, 굿즈를 다시 집어 들 이유를 만드는 반복 접점을 설계했습니다.`,
      `비글즈는 캐릭터 IP를 활용한 게임 기획·개발과 실물 굿즈 제작을 함께 진행했습니다. 사용자는 앱 설치 없이 웹에서 바로 플레이하며 브랜드 캐릭터와 상호작용합니다.`,
      `한 번의 이벤트로 끝나지 않고, 콘텐츠 업데이트를 통해 지속적으로 즐길 거리를 더할 수 있는 확장형 구조로 만들었습니다.`,
    ],
    tarot: [
      `${t}은(는) NFC 태그로 즉시 열리는 타로 리딩 콘텐츠입니다. 카드를 태그하면 오늘의 카드와 해석이 스마트폰 화면에 펼쳐집니다.`,
      `캐릭터 IP와 감성 AI를 결합해 매번 다른 리딩 경험을 제공하고, 실물 타로 굿즈의 수집 가치를 높였습니다.`,
      `비글즈는 타로 콘텐츠 기획부터 굿즈 제작까지 함께 진행해, 태그할 때마다 브랜드와의 교감이 이어지도록 만들었습니다.`,
    ],
    fortune: [
      `${t}은(는) 매일 다시 꺼내보게 만드는 운세 콘텐츠입니다. NFC 태그 한 번으로 오늘의 운세가 열려, 굿즈가 일상 속 반복 접점이 됩니다.`,
      `캐릭터 감성의 운세·부적 콘텐츠를 감성 AI로 설계해, 사용자마다 다른 결과와 메시지를 전합니다.`,
      `실물 굿즈를 다시 만들지 않아도 콘텐츠를 업데이트할 수 있어, 시즌·이벤트에 맞춰 유연하게 운영할 수 있습니다.`,
    ],
    fanpost: [
      `${t}은(는) 팬과 브랜드가 만나는 AI 팬 포스트 경험입니다. NFC 굿즈를 태그하면 나만의 팬 콘텐츠가 생성되어, 팬덤의 참여를 이끌어냅니다.`,
      `캐릭터 IP와 감성 AI로 팬 인터랙션을 설계하고, 실물 굿즈 제작까지 한 번에 진행했습니다. 앱 설치 없이 태그만으로 참여합니다.`,
      `한 번 받고 끝나는 굿즈가 아니라, 다시 태그해 공유하고 싶은 반복 접점으로 확장한 사례입니다.`,
    ],
  })[pfPrimaryCat(item)] || [];
}

function openPfModal(item) {
  const src = item.img || `${CDN}${item.hash}.png`;
  const body = pfStory(item).map(p => `<p>${p}</p>`).join('');
  pfModalBody.innerHTML = `
    <div class="pf-d-hero">
      <img src="${src}" alt="${item.title}">
      <div class="pf-d-hero-copy">
        <span class="pf-d-eyebrow">${item.tag}</span>
        <h2>${item.title}</h2>
      </div>
    </div>
    <div class="pf-d-wrap">
      <div class="pf-d-meta">
        <div><div class="k">CLIENT</div><div class="v">${pfClient(item)}</div></div>
        <div><div class="k">CONTENT</div><div class="v">${item.tag}</div></div>
        <div><div class="k">SERVICE</div><div class="v">NFC 굿즈 제작 · 콘텐츠 기획</div></div>
      </div>
      <p class="pf-d-tagline">${pfTagline(item)}</p>
      <div class="pf-d-body">${body}</div>
      <div class="pf-d-cta">
        <h3>${pfClient(item)}처럼, 비슷한 경험을 원하시나요?</h3>
        <p>비글즈가 기획부터 굿즈 제작·콘텐츠까지 한 번에 완성해드립니다.</p>
        <a href="goods.html" class="btn btn-primary btn-lg" data-close>NFC 제작 문의</a>
      </div>
    </div>
  `;
  pfModal.classList.add('open');
  pfModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('pf-locked');
  pfModal.querySelector('.pf-modal-panel').scrollTop = 0;
}

function closePfModal() {
  pfModal.classList.remove('open');
  pfModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('pf-locked');
}

pfGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.pf-card');
  if (!card) return;
  openPfModal(portfolioItems[+card.dataset.idx]);
});
pfGrid.addEventListener('keydown', (e) => {
  const card = e.target.closest('.pf-card');
  if (!card || (e.key !== 'Enter' && e.key !== ' ')) return;
  e.preventDefault();
  openPfModal(portfolioItems[+card.dataset.idx]);
});
pfModal.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closePfModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pfModal.classList.contains('open')) closePfModal();
});
