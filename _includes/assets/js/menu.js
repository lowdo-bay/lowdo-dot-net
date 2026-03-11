// Header menu drawer toggle
(function() {
  const header = document.querySelector('header');
  const button = document.querySelector('.header-menu__button');
  const drawer = document.querySelector('.header-menu__drawer');

  if (!button || !drawer) return;

  button.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('is-open');
    button.setAttribute('aria-expanded', isOpen);
    drawer.setAttribute('aria-hidden', !isOpen);
  });

  document.addEventListener('click', function(e) {
    if (!header.contains(e.target) && !drawer.contains(e.target)) {
      drawer.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      drawer.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      button.focus();
    }
  });
})();
