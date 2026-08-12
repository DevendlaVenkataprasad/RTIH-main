// Mobile nav + submenu a11y
(function(){
  const nav = document.getElementById('primary-nav');
  const toggle = document.querySelector('.nav-toggle');
  const subToggles = document.querySelectorAll('.sub-toggle');

  function setOpen(open){
    nav.setAttribute('data-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') !== 'true';
    setOpen(open);
  });

  subToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.has-sub');
      const isOpen = parent.classList.contains('open');
      parent.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){ setOpen(false) }
  });
})();