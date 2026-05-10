/* ============================================================
   script.js — Feliz Día, Mamá 🌸
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   FOTOS DE LA CINTA
   ✏️  Reemplaza cada 'RUTA/foto1.jpg' con la ruta real
       de tu imagen (relativa al index.html o URL completa).
       Puedes añadir o quitar objetos de este array.
   ══════════════════════════════════════════════════════════ */
const PHOTOS = [
  { src: 'Resources/1.png' },
  { src: 'Resources/2.jpg' },
  { src: 'Resources/3.jpg' },
  { src: 'Resources/4.jpg' },
  { src: 'Resources/5.jpg' },
  { src: 'Resources/6.jpg' },
  { src: 'Resources/7.jpg' },
  { src: 'Resources/8.png' },
  { src: 'Resources/9.jpg' },
  { src: 'Resources/10.jpg' },
  { src: 'Resources/11.jpg' },
  { src: 'Resources/12.jpg' },
  { src: 'Resources/13.jpg' },
  { src: 'Resources/14.png' },
  { src: 'Resources/15.jpg' },
  { src: 'Resources/16.jpg' },
  { src: 'Resources/17.jpg' },
  { src: 'Resources/18.jpg' },
  { src: 'Resources/19.jpg' },
  { src: 'Resources/20.jpg' },
  { src: 'Resources/21.jpg' },
  { src: 'Resources/22.jpg' },
  { src: 'Resources/23.jpg' },
  { src: 'Resources/24.jpg' },
  { src: 'Resources/25.jpg' },
  { src: 'Resources/26.png' },
  { src: 'Resources/27.jpeg' },
  { src: 'Resources/28.jpg' },
  { src: 'Resources/29.jpg' },
  { src: 'Resources/30.jpg' },
  { src: 'Resources/31.jpg' },
  { src: 'Resources/32.jpg' },
  { src: 'Resources/33.jpg' },
  { src: 'Resources/34.jpg' },
  { src: 'Resources/35.jpg' },
  { src: 'Resources/36.jpg' },
  { src: 'Resources/37.jpg' },
  { src: 'Resources/38.jpg' },
  { src: 'Resources/39.jpg' },
  { src: 'Resources/40.jpg' },
  { src: 'Resources/41.jpg' },
];

/* ══════════════════════════════════════════════════════════
   RENDERIZADO DE LA CINTA
   ══════════════════════════════════════════════════════════ */
function renderStrip() {
  const strip = document.getElementById('filmStrip');
  strip.innerHTML = '';

  PHOTOS.forEach((photo, i) => {
    const num = String(i + 1).padStart(3, '0');

    const frame = document.createElement('div');
    frame.className = 'film-frame';

    const numEl = document.createElement('span');
    numEl.className = 'film-number';
    numEl.textContent = `▸ ${num}`;

    const img = document.createElement('img');
    img.className = 'film-photo';
    img.src = photo.src;
    img.alt = '';
    img.draggable = false;

    frame.appendChild(numEl);
    frame.appendChild(img);
    strip.appendChild(frame);
  });
}

/* ══════════════════════════════════════════════════════════
   AUTO-SCROLL DE LA CINTA
   Se mueve solo; se pausa al interactuar; botones de control
   ══════════════════════════════════════════════════════════ */
let autoScrollTimer   = null;
let isAutoScrolling   = true;
const SCROLL_SPEED    = 1.2;    // px por tick (ajusta velocidad)
const SCROLL_INTERVAL = 20;     // ms entre ticks

function startAutoScroll() {
  if (autoScrollTimer) return;
  autoScrollTimer = setInterval(() => {
    const track = document.getElementById('filmTrack');
    if (!track) return;
    // Si llegó al final, vuelve al inicio suavemente
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
      track.scrollLeft = 0;
    } else {
      track.scrollLeft += SCROLL_SPEED;
    }
  }, SCROLL_INTERVAL);
}

function stopAutoScroll() {
  clearInterval(autoScrollTimer);
  autoScrollTimer = null;
  isAutoScrolling = false;
  document.getElementById('btnPlay').style.display  = 'flex';
  document.getElementById('btnPause').style.display = 'none';
}

function resumeAutoScroll() {
  isAutoScrolling = true;
  document.getElementById('btnPlay').style.display  = 'none';
  document.getElementById('btnPause').style.display = 'flex';
  startAutoScroll();
}

/* ── Avanzar / retroceder un frame manualmente ── */
function scrollByFrame(direction) {
  const track     = document.getElementById('filmTrack');
  const frameWidth = 210; // ancho aprox de un fotograma + gap
  track.scrollBy({ left: direction * frameWidth, behavior: 'smooth' });
}

function initControls() {
  document.getElementById('btnPause').addEventListener('click', stopAutoScroll);
  document.getElementById('btnPlay').addEventListener('click', resumeAutoScroll);
  document.getElementById('btnPrev').addEventListener('click', () => {
    stopAutoScroll();
    scrollByFrame(-1);
  });
  document.getElementById('btnNext').addEventListener('click', () => {
    stopAutoScroll();
    scrollByFrame(1);
  });
}

/* ══════════════════════════════════════════════════════════
   DRAG-TO-SCROLL (desktop) + TOUCH (móvil)
   ══════════════════════════════════════════════════════════ */
function initDragScroll() {
  const track = document.getElementById('filmTrack');
  let isDragging = false;
  let startX     = 0;
  let scrollStart = 0;

  /* — Mouse (PC) — */
  track.addEventListener('mousedown', (e) => {
    isDragging  = true;
    startX      = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
    track.classList.add('grabbing');
    stopAutoScroll();
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    track.classList.remove('grabbing');
  });
  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollStart - (x - startX);
  });

  /* — Touch (Android / iPhone) — */
  let touchStartX   = 0;
  let touchScrollStart = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX      = e.touches[0].clientX;
    touchScrollStart = track.scrollLeft;
    stopAutoScroll();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    const dx = touchStartX - e.touches[0].clientX;
    track.scrollLeft = touchScrollStart + dx;
  }, { passive: true });

  /* Hover (desktop): pausa mientras el puntero está encima */
  track.addEventListener('mouseenter', stopAutoScroll);
  track.addEventListener('mouseleave', () => {
    if (!isDragging) resumeAutoScroll();
  });
}

/* ══════════════════════════════════════════════════════════
   PÉTALOS
   ══════════════════════════════════════════════════════════ */
function initPetals() {
  const container = document.getElementById('petals');
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left              = Math.random() * 100 + '%';
    p.style.animationDuration = (5 + Math.random() * 7) + 's';
    p.style.animationDelay    = (Math.random() * 9) + 's';
    p.style.transform         = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
    container.appendChild(p);
  }
}

/* ══════════════════════════════════════════════════════════
   MÁQUINA DE ESCRIBIR
   ══════════════════════════════════════════════════════════ */
function initTypewriter() {
  const phrases = [
    'Mamá, eres la razón por la que creo en el amor incondicional.',
    'Tu voz es el sonido más reconfortante que conozco.',
    'Cada vez que necesité fuerza, te miré a ti.',
    'Eres mi hogar, no importa dónde estemos.',
    'Gracias por creer en mí incluso cuando yo no creía.',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const el = document.getElementById('typewriter-text');

  function tick() {
    const phrase = phrases[phraseIdx];
    el.innerHTML = phrase.substring(0, charIdx) + '<span class="cursor"></span>';
    if (!deleting) {
      if (charIdx < phrase.length) { charIdx++; setTimeout(tick, 48); }
      else { setTimeout(() => { deleting = true; tick(); }, 2400); }
    } else {
      if (charIdx > 0) { charIdx--; setTimeout(tick, 26); }
      else { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(tick, 500); }
    }
  }
  tick();
}

/* ══════════════════════════════════════════════════════════
   CONTADOR DE TIEMPO
   ✏️  Cambia la fecha de nacimiento:
       new Date(año, mes-1, día)
   ══════════════════════════════════════════════════════════ */
function initCounter() {
  const birthDate = new Date(2008, 5, 3); // ← EDITA ESTA LÍNEA
  const today     = new Date();
  let y = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth()    - birthDate.getMonth();
  let d = today.getDate()     - birthDate.getDate();
  if (d < 0) { m--; d += 30; }
  if (m < 0) { y--; m += 12; }
  document.getElementById('cnt-years').textContent  = y;
  document.getElementById('cnt-months').textContent = m;
  document.getElementById('cnt-days').textContent   = d;
}

/* ══════════════════════════════════════════════════════════
   ANIMACIONES DE SCROLL
   ══════════════════════════════════════════════════════════ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.tl-item, .thing-card').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   BOTÓN SORPRESA
   ══════════════════════════════════════════════════════════ */
function initSurprise() {
  document.getElementById('surpriseBtn').addEventListener('click', () => {
    document.getElementById('surprise-msg').style.display = 'block';
    document.getElementById('surpriseBtn').style.display  = 'none';
  });
}

/* ══════════════════════════════════════════════════════════
   ARRANQUE
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderStrip();
  initControls();
  initDragScroll();
  startAutoScroll();           // arranca el movimiento automático
  initPetals();
  initTypewriter();
  initCounter();
  initScrollAnimations();
  initSurprise();
});
