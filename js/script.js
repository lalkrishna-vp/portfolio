(() => {
  const btn = document.querySelector('.menu-btn'), menu = document.getElementById('menu');
  const setMenu = o => { menu.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); };
  btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });

  // Cards settle flat as they scroll into view; nav tab follows the section in view
  const links = [...menu.querySelectorAll('a')];
  const settle = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); settle.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll('.sheet').forEach(s => settle.observe(s));
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

  // Links without a real URL yet do nothing
  document.querySelectorAll('[data-placeholder]').forEach(a => a.addEventListener('click', e => { if (a.getAttribute('href') === '#') e.preventDefault(); }));

  // Contact and suggestion forms: front-end only
  document.querySelectorAll('form[data-form]').forEach(form => {
    const status = form.querySelector('.status');
    const isSuggest = form.closest('#suggest');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('label').forEach(l => {
        const f = l.querySelector('input,textarea'), err = l.querySelector('.err');
        if (!f || !err) return;
        let msg = '';
        if (f.required && !f.value.trim()) msg = 'Enter your ' + f.name + '.';
        else if (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)) msg = 'Enter a valid email address.';
        l.classList.toggle('bad', !!msg); err.textContent = msg; if (msg) ok = false;
      });
      if (!ok) return;
      form.reset();
      status.textContent = isSuggest ? 'Thanks. Connect this form to a service to receive suggestions.' : 'Message ready. Connect this form to a service to send it.';
    });
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
