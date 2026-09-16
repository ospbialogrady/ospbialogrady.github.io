document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.site-mobile-menu');
  const menu = document.querySelector('.site-nav-links');
  if (!button || !menu) return;
  const links = [...menu.querySelectorAll('a')];
  let lastFocus = button;
  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    button.innerHTML = open ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    if (open) { lastFocus = document.activeElement || button; (links[0] || menu).focus(); }
    else if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };
  menu.setAttribute('aria-hidden', 'true');
  button.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (!menu.classList.contains('open')) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
    if (event.key === 'Tab') {
      const focusable = [button, ...links];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
});
