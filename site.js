const lb = document.getElementById('lb');
const lbImg = document.getElementById('lb-img');
const lbTitle = document.getElementById('lb-title');
const isEn = document.documentElement.lang === 'en';

document.querySelectorAll('[data-shot]').forEach(el => {
  el.addEventListener('click', () => {
    const name = el.dataset.name;
    lbImg.src = `/img/${el.dataset.shot}.jpg`;
    lbImg.alt = isEn ? `${name} store screenshots` : `Capturas de la tienda ${name}`;
    lbTitle.textContent = name;
    lb.showModal();
  });
});
document.getElementById('lb-close').addEventListener('click', () => lb.close());
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const prev = btn.textContent;
      btn.textContent = isEn ? 'copied ✓' : 'copiado ✓';
      setTimeout(() => (btn.textContent = prev), 1800);
    } catch { location.href = `mailto:${btn.dataset.copy}`; }
  });
});

// expandable stores
const moreBtn = document.querySelector('.more-btn');
if (moreBtn) {
  const grid = document.getElementById('stores');
  moreBtn.addEventListener('click', () => {
    const open = grid.classList.toggle('collapsed') === false;
    moreBtn.setAttribute('aria-expanded', String(open));
    moreBtn.textContent = open ? moreBtn.dataset.less : moreBtn.dataset.more;
    if (!open) grid.scrollIntoView({ block: 'nearest' });
  });
}

// AI carousel
const car = document.querySelector('.carousel');
if (car) {
  const track = car.querySelector('.track');
  const slides = [...car.querySelectorAll('.slide')];
  const dots = [...car.querySelectorAll('.dots button')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, timer;
  const go = n => {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
    slides.forEach((s, k) => s.setAttribute('aria-hidden', k === i ? 'false' : 'true'));
  };
  const start = () => { if (!reduce) { clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); } };
  const stop = () => clearInterval(timer);
  car.querySelectorAll('.arrow').forEach(b => b.addEventListener('click', () => { go(i + Number(b.dataset.dir)); start(); }));
  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); start(); }));
  car.addEventListener('mouseenter', stop);
  car.addEventListener('mouseleave', start);
  car.addEventListener('focusin', stop);
  car.addEventListener('focusout', start);
  let x0 = null;
  car.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  car.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    x0 = null; start();
  });
  go(0); start();
}
