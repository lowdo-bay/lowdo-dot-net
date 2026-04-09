// Header menu drawer toggle
(function() {
  const header = document.querySelector('header');
  const button = document.querySelector('.header-menu__button');
  const drawer = document.querySelector('.header-menu__drawer');

  if (!button || !drawer) return;

  // Inject left-border line for index page (sibling to drawer, outside clip-path context)
  const line = document.createElement('span');
  line.className = 'header-menu__drawer-line';
  line.style.setProperty('--drawer-height', drawer.offsetHeight + 'px');
  header.appendChild(line);

  button.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('is-open');
    line.classList.toggle('is-open', isOpen);
    button.setAttribute('aria-expanded', isOpen);
    drawer.setAttribute('aria-hidden', !isOpen);
  });

  document.addEventListener('click', function(e) {
    if (!header.contains(e.target) && !drawer.contains(e.target)) {
      drawer.classList.remove('is-open');
      line.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      drawer.classList.remove('is-open');
      line.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      button.focus();
    }
  });
})();
