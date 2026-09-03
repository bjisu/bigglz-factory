// ---------- Inquiry form (goods.html) ----------
const form = document.getElementById('inquiryForm');

// pick-grid single/multi select behavior
['goodsPick', 'hardwarePick', 'qtyPick', 'contentHasLinkPick', 'packPick'].forEach(id => {
  const grid = document.getElementById(id);
  if (!grid) return;
  grid.addEventListener('click', (e) => {
    const pick = e.target.closest('.pick');
    if (!pick) return;
    [...grid.children].forEach(c => c.classList.remove('selected'));
    pick.classList.add('selected');
    updateSubmitState();
  });
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

// file upload filename display
const designFile = document.getElementById('designFile');
if (designFile) {
  designFile.addEventListener('change', (e) => {
    const f = e.target.files[0];
    const filename = document.getElementById('uploadFilename');
    if (filename) filename.textContent = f ? `선택됨: ${f.name}` : '';
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

function buildSummary() {
  const val = (id) => (document.getElementById(id)?.value || '').trim();
  const selected = (gridId) => [...document.querySelectorAll(`#${gridId} .pick.selected`)].map(p => p.dataset.value).join(', ') || '-';
  return [
    `[비글즈 팩토리 굿즈 제작 문의]`,
    ``,
    `회사/브랜드명: ${val('companyName') || '-'}`,
    `담당자: ${val('managerName') || '-'}`,
    `연락처: ${val('phone') || '-'}`,
    `이메일: ${val('email') || '-'}`,
    ``,
    `제작 굿즈: ${selected('goodsPick')}`,
    `키링고리(부자재): ${selected('hardwarePick')}`,
    `제작 수량: ${selected('qtyPick')}`,
    `NFC 콘텐츠: ${val('contentLink') ? `직접 제공 링크 - ${val('contentLink')}` : (val('contentDesc') || '-')}`,
    `포장 여부: ${selected('packPick')}`,
    `필요 시점: ${val('needDate') || '-'}`,
    ``,
    `추가 요청사항:`,
    `${val('message') || '-'}`,
  ].join('\n');
}

if (form) form.addEventListener('submit', (e) => {
  e.preventDefault();
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
  const summary = buildSummary();
  form.querySelectorAll('.form-section').forEach(s => s.style.display = 'none');
  document.getElementById('formSuccess')?.classList.add('show');

  const subject = encodeURIComponent(`[굿즈 제작 문의] ${document.getElementById('companyName')?.value || '문의'}`);
  const body = encodeURIComponent(summary);
  window.location.href = `mailto:contact@bigglz.com?subject=${subject}&body=${body}`;

  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) copyBtn.onclick = () => {
    navigator.clipboard.writeText(summary).then(() => {
      const btn = copyBtn;
      const original = btn.textContent;
      btn.textContent = '복사 완료!';
      setTimeout(() => btn.textContent = original, 1800);
    });
  };
});
