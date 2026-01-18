// Header menu dropdown toggle
(function() {
  const menu = document.querySelector('.header-menu');
  const button = document.querySelector('.header-menu__button');
  const dropdown = document.querySelector('.header-menu__dropdown');

  if (!menu || !button || !dropdown) return;

  // Toggle menu on button click
  button.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('is-open');
    button.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!menu.contains(e.target)) {
      menu.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    }
  });
})();
