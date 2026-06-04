const NPURE_PRODUK = {
  sidebarImgSunscreen: "../../assets/sunscreen-hero.webp",
  sidebarImgToner:     "../../assets/toner-hero.webp",
};

// ── Helper: inject img ────────────────────────────────────
function injectImg(wrapId, src, alt, opts) {
  var wrap = document.getElementById(wrapId);
  if (!wrap || !src) return;
  var ph = wrap.querySelector('.ph');
  if (ph) ph.style.display = 'none';
  var phEmoji = wrap.querySelector('.ph-emoji');
  if (phEmoji) phEmoji.style.display = 'none';
  var img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  img.loading = (opts && opts.eager) ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (opts && opts.priority) img.setAttribute('fetchpriority', 'high');
  wrap.appendChild(img);
}

// ── Init sidebar images ───────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  console.log('artikelIsi src:', NPURE_MEDIA.artikelIsi);
  injectImg('sidebarImgSunscreen', NPURE_PRODUK.sidebarImgSunscreen, 'NPURE Cica Sunscreen');
  injectImg('sidebarImgToner', NPURE_PRODUK.sidebarImgToner, 'NPURE Cica Toner');
  if (NPURE_MEDIA.artikelHero) {
    injectImg('heroBg', NPURE_MEDIA.artikelHero, 'Hero Artikel', { eager: true, priority: true });
  }
  if (NPURE_MEDIA.artikelIsi) {
    injectImg('artikelInlineImg', NPURE_MEDIA.artikelIsi, 'Isi Artikel', { eager: true, priority: true });
  }
});

// ── NAV scroll ────────────────────────────────────────────
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

// ── Reading progress ──────────────────────────────────────
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
  document.getElementById('readingProgress').style.width = Math.min(scrolled, 100) + '%';
});

// ── Copy link ─────────────────────────────────────────────
function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const btn = document.getElementById('copyLink');
    btn.textContent = '✓';
    setTimeout(() => btn.textContent = '🔗', 2000);
  });
}

// ── Mobile nav ────────────────────────────────────────────
const menuBtn = document.querySelector('.nav-mobile-menu');
const navLinks = document.querySelector('.nav-links');
const closeBtn = document.getElementById('navCloseBtn');

function openMenu() {
  navLinks.classList.add('active');
  closeBtn && closeBtn.classList.add('active');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    navLinks.classList.add('open');
    menuBtn.classList.add('open');
  }));
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  navLinks.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  setTimeout(() => {
    navLinks.classList.remove('active');
    closeBtn && closeBtn.classList.remove('active');
  }, 350);
}
menuBtn.addEventListener('click', () => navLinks.classList.contains('open') ? closeMenu() : openMenu());
closeBtn && closeBtn.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
});

// ── WhatsApp share ────────────────────────────────────────
(function(){
  const shareURL  = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent('Baca artikel ini dari NPURE: ' + document.title.replace(' – NPURE Skin Journal',''));
  document.getElementById('shareWA').href = 'https://wa.me/?text=' + shareText + '%20' + shareURL;
})();

// ── Supabase View Counter ─────────────────────────────────
const SUPABASE_URL = "https://vfipmavzzeniossxrvev.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmaXBtYXZ6emVuaW9zc3hydmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MzA1NDIsImV4cCI6MjA5NjEwNjU0Mn0.9n4mVi4FRd-JmBck5rpt16u7haeudSTXVCmAEWGRcPU";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function recordAndFetchViews() {
  if (!sessionStorage.getItem('view_recorded_artikel')) {
    await _supabase.from('page_views').insert({ page: '/artikel' });
    sessionStorage.setItem('view_recorded_artikel', 'true');
  }
  const { data } = await _supabase.from('view_counts').select('*').single();
  if (!data) return;
  const fmt = n => Number(n).toLocaleString('id-ID');
  document.getElementById('vc-today').textContent = fmt(data.today);
  document.getElementById('vc-month').textContent = fmt(data.this_month);
  document.getElementById('vc-year').textContent = fmt(data.this_year);
  document.getElementById('vc-total').textContent = fmt(data.total);
}

document.addEventListener('DOMContentLoaded', recordAndFetchViews);