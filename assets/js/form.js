// ---------- Inquiry form (goods.html) ----------
const form = document.getElementById('inquiryForm');

const FORM_ENDPOINT = 'https://formspree.io/f/mdeobwwr';

// 버튼으로 고르는 항목은 FormData에 잡히지 않는다 — 선택값을 숨은 input에 복사해 같이 전송한다
const PICK_FIELDS = {
  goodsPick: 'goodsValue',
  hardwarePick: 'hardwareValue',
  qtyPick: 'qtyValue',
  contentHasLinkPick: 'contentHasLinkValue',
  packPick: 'packValue',
};

function syncPickValue(gridId) {
  const target = document.getElementById(PICK_FIELDS[gridId]);
  if (!target) return;
  const picked = document.querySelector(`#${gridId} .pick.selected`);
  target.value = picked ? picked.dataset.value : '';
}

// pick-grid single/multi select behavior
Object.keys(PICK_FIELDS).forEach(id => {
  const grid = document.getElementById(id);
  if (!grid) return;
  grid.addEventListener('click', (e) => {
    const pick = e.target.closest('.pick');
    if (!pick) return;
    [...grid.children].forEach(c => c.classList.remove('selected'));
    pick.classList.add('selected');
    syncPickValue(id);
    updateSubmitState();
  });
  syncPickValue(id);  // 마크업에 미리 selected가 박혀 있는 항목까지 채운다
});

// 콘텐츠 링크 유무에 따라 링크 입력창 / 콘텐츠 선택 그리드 전환
const contentLinkField = document.getElementById('contentLinkField');
const contentPickField = document.getElementById('contentPickField');
const contentHasLinkPick = document.getElementById('contentHasLinkPick');
if (contentHasLinkPick) {
  contentHasLinkPick.addEventListener('click', (e) => {
    const pick = e.target.closest('.pick');
    if (!pick) return;
    const hasLink = pick.dataset.value.startsWith('있음');
    if (contentLinkField) contentLinkField.style.display = hasLink ? 'block' : 'none';
    if (contentPickField) contentPickField.style.display = hasLink ? 'none' : 'block';
    if (hasLink) document.getElementById('contentLink')?.focus();
  });
}

// 필요 시점 — 지난 날짜는 선택 불가. 정적 사이트라 min을 마크업에 박으면 하루만 지나도 낡으므로 실행 시점에 계산한다.
const needDate = document.getElementById('needDate');
if (needDate) {
  const setNeedDateMin = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    // toISOString()은 UTC라 한국 시간대에선 자정 무렵 하루가 밀린다 — 로컬 날짜로 조립
    needDate.min = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  setNeedDateMin();
  needDate.addEventListener('focus', setNeedDateMin);  // 페이지를 열어둔 채 자정을 넘긴 경우
}

// ---------- 제출 버튼 활성화 조건 (필수 6개) ----------
function getMissingFields() {
  const missing = [];
  const val = (id) => (document.getElementById(id)?.value || '').trim();
  const hasPick = (gridId) => !!document.querySelector(`#${gridId} .pick.selected`);

  if (!val('companyName')) missing.push('회사/브랜드명');
  if (!val('managerName')) missing.push('담당자 성함');
  if (!val('phone')) missing.push('연락처');
  if (!val('email')) missing.push('이메일');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) missing.push('올바른 이메일 형식');
  if (!hasPick('goodsPick')) missing.push('제작 굿즈');
  if (!hasPick('qtyPick')) missing.push('제작 수량');
  if (!hasPick('packPick')) missing.push('포장 여부');

  return missing;
}

function updateSubmitState() {
  const btn = document.querySelector('#inquiryForm button[type="submit"]');
  const hint = document.getElementById('submitHint');
  if (!btn) return;

  const missing = getMissingFields();
  btn.disabled = missing.length > 0;

  if (hint) {
    hint.textContent = missing.length ? '필수 항목을 입력해주세요.' : '';
  }
}

['companyName', 'managerName', 'phone', 'email'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateSubmitState);
});

updateSubmitState();

let sending = false;

if (form) form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (sending) return;  // 같은 버튼을 두 번 눌러도 한 번만 보낸다
  const requiredIds = ['companyName', 'managerName', 'phone', 'email'];
  for (const id of requiredIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (!el.value.trim()) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
      return;
    }
  }
  if (!document.querySelector('#qtyPick .pick.selected')) {
    document.getElementById('qtyPick')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (needDate?.value && needDate.value < needDate.min) {
    needDate.scrollIntoView({ behavior: 'smooth', block: 'center' });
    needDate.focus();
    return;
  }
  const submitBtn = form.querySelector('button[type="submit"]');
  const hint = document.getElementById('submitHint');
  const originalLabel = submitBtn ? submitBtn.textContent : '';

  sending = true;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
  }
  if (hint) {
    hint.textContent = '';
    hint.classList.remove('is-error');
  }

  try {
    // Formspree는 multipart/urlencoded로 오는 한글 필드명을 400으로 거절한다 —
    // 한글 라벨을 그대로 쓰려면 JSON으로 직렬화해서 보내야 한다
    const payload = Object.fromEntries(new FormData(form).entries());
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
  } catch (err) {
    sending = false;
    if (submitBtn) submitBtn.textContent = originalLabel;
    updateSubmitState();
    if (hint) {
      hint.textContent = '전송에 실패했습니다. 잠시 후 다시 시도하거나 contact@bigglz.com 으로 보내주세요.';
      hint.classList.add('is-error');
    }
    return;
  }

  form.querySelectorAll('.form-section').forEach(s => s.style.display = 'none');
  document.getElementById('formSuccess')?.classList.add('show');

  // 제출 뒤에는 폼이 사라져 #goods-entry 앵커가 완료 화면만 다시 비춘다 —
  // 헤더와 하단 고정 버튼을 페이지 새로고침으로 바꿔 빈 폼이 열리게 한다.
  // 작성 중에 바꾸면 입력값이 날아가므로 성공한 뒤에만 손댄다.
  document.querySelectorAll('a[href="#goods-entry"]').forEach(a => { a.href = 'goods.html'; });
});
