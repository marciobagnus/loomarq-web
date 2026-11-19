(function () {
  const button = document.querySelector('[data-menu]');
  const nav = document.querySelector('[data-nav]');

  if (button && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Abrir menú');
    };

    button.hidden = false;
    nav.classList.add('nav--collapsible');
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        button.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !button.contains(event.target)) closeMenu();
    });
    const mobile = window.matchMedia('(max-width: 900px)');
    mobile.addEventListener('change', closeMenu);
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
