// Small progressive enhancement: mobile nav toggle and year injector
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('siteNav');
  const btn = document.getElementById('navToggle');

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (nav) {
      const isHidden = nav.getAttribute('aria-hidden') === 'true' || nav.style.display === 'none';
      nav.setAttribute('aria-hidden', String(!isHidden));
    }
  });

  // Insert current year
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if (el) el.textContent = String(y);
});