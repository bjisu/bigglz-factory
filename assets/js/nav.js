// ---------- Mobile nav (5개 페이지 공통) ----------
// 햄버거/모바일 메뉴가 없는 페이지에서도 안전하도록 null 체크 후 바인딩한다.
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );
}
