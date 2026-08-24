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
  });
});

// 콘텐츠 링크 유무에 따라 링크 입력창 / 콘텐츠 선택 그리드 전환
const contentLinkField = document.getElementById('contentLinkField');
const contentPickField = document.getElementById('contentPickField');
document.getElementById('contentHasLinkPick').addEventListener('click', (e) => {
  const pick = e.target.closest('.pick');
  if (!pick) return;
  const hasLink = pick.dataset.value.startsWith('있음');
  contentLinkField.style.display = hasLink ? 'block' : 'none';
  contentPickField.style.display = hasLink ? 'none' : 'block';
  if (hasLink) document.getElementById('contentLink').focus();
});

// file upload filename display
document.getElementById('designFile').addEventListener('change', (e) => {
  const f = e.target.files[0];
  document.getElementById('uploadFilename').textContent = f ? `선택됨: ${f.name}` : '';
});

// 필요 시점 — 지난 날짜는 선택 불가. 정적 사이트라 min을 마크업에 박으면 하루만 지나도 낡으므로 실행 시점에 계산한다.
const needDate = document.getElementById('needDate');
const setNeedDateMin = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  // toISOString()은 UTC라 한국 시간대에선 자정 무렵 하루가 밀린다 — 로컬 날짜로 조립
  needDate.min = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
setNeedDateMin();
needDate.addEventListener('focus', setNeedDateMin);  // 페이지를 열어둔 채 자정을 넘긴 경우

function buildSummary() {
  const val = (id) => document.getElementById(id).value.trim();
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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const requiredIds = ['companyName', 'managerName', 'phone', 'email'];
  for (const id of requiredIds) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
      return;
    }
  }
  if (!document.querySelector('#qtyPick .pick.selected')) {
    document.getElementById('qtyPick').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (needDate.value && needDate.value < needDate.min) {
    needDate.scrollIntoView({ behavior: 'smooth', block: 'center' });
    needDate.focus();
    return;
  }
  const summary = buildSummary();
  form.querySelectorAll('.form-section').forEach(s => s.style.display = 'none');
  document.getElementById('formSuccess').classList.add('show');

  const subject = encodeURIComponent(`[굿즈 제작 문의] ${document.getElementById('companyName').value || '문의'}`);
  const body = encodeURIComponent(summary);
  window.location.href = `mailto:contact@bigglz.com?subject=${subject}&body=${body}`;

  document.getElementById('copyBtn').onclick = () => {
    navigator.clipboard.writeText(summary).then(() => {
      const btn = document.getElementById('copyBtn');
      const original = btn.textContent;
      btn.textContent = '복사 완료!';
      setTimeout(() => btn.textContent = original, 1800);
    });
  };
});
