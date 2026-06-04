const NPURE_MEDIA = {
  heroVideo: "assets/video-hero.mp4",
  scienceVideo: "https://youtu.be/6ztJORrNjSU?si=XXD9qAEnWPaDChMq",
  heroImgSunscreen: "assets/sunscreen-hero.webp",
  heroImgToner: "assets/toner-hero.webp",
  productImgSunscreen: "assets/sunscreen-showcase.webp",
  productImgToner: "assets/toner-showcase.webp",
  brandImage: "assets/brand-image.webp",
  beforeImage: "assets/before-after-sunscreen.webp",
  afterImage: "assets/before-after-toner.webp",
  bundleImgSunscreen: "assets/toner-hero.webp",
  bundleImgSet: "",
  bundleImgToner: "assets/sunscreen-hero.webp",
  artikelThumb1: "assets/artikel-satu.webp",
  artikelThumb2: "assets/artikel-dua.webp",
  artikelThumb3: "assets/artikel-tiga.webp",
  artikelThumb4: "assets/artikel-empat.webp",
  artikelHero1: "",
  artikelHero2: "",
  artikelHero3: "",
  artikelHero4: "",
};

(function applyNpureMedia() {
  /* ── Helper: YouTube video ID ── */
  function getYtId(url) {
    if (!url) return null;
    var m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    return m ? m[1] : null;
  }

  /* ── Helper: Vimeo video ID ── */
  function getVimeoId(url) {
    if (!url) return null;
    var m = url.match(/vimeo\.com\/(\d+)/);
    return m ? m[1] : null;
  }

  /* ── YouTube Facade: thumbnail + play button, iframe hanya dibuat saat klik ── */
  function injectYtFacade(wrap, videoId) {
    var ph = wrap.querySelector(".ph");
    if (ph) ph.style.display = "none";

    /* Wrapper facade */
    var facade = document.createElement("div");
    facade.style.cssText =
      "position:relative;width:100%;height:100%;cursor:pointer;background:#000;border-radius:inherit;overflow:hidden;";

    /* Thumbnail dari YouTube */
    var thumb = document.createElement("img");
    thumb.src = "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
    thumb.alt = "Video thumbnail";
    thumb.loading = "lazy";
    thumb.style.cssText =
      "width:100%;height:100%;object-fit:cover;display:block;transition:opacity 0.3s;";
    facade.appendChild(thumb);

    /* Overlay gelap */
    var overlay = document.createElement("div");
    overlay.style.cssText =
      "position:absolute;inset:0;background:rgba(0,0,0,0.25);transition:background 0.3s;";
    facade.appendChild(overlay);

    /* Tombol play */
    var btn = document.createElement("div");
    btn.style.cssText = [
      "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);",
      "width:64px;height:64px;border-radius:50%;",
      "background:rgba(255,255,255,0.95);",
      "display:flex;align-items:center;justify-content:center;",
      "box-shadow:0 4px 24px rgba(0,0,0,0.35);",
      "transition:transform 0.2s,background 0.2s;",
    ].join("");
    /* Triangle play icon via SVG */
    btn.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polygon points="8,5 19,12 8,19" fill="#1b4332"/></svg>';
    facade.appendChild(btn);

    /* Hover effect */
    facade.addEventListener("mouseenter", function () {
      overlay.style.background = "rgba(0,0,0,0.15)";
      btn.style.transform = "translate(-50%,-50%) scale(1.1)";
      btn.style.background = "#95d5b2";
    });
    facade.addEventListener("mouseleave", function () {
      overlay.style.background = "rgba(0,0,0,0.25)";
      btn.style.transform = "translate(-50%,-50%) scale(1)";
      btn.style.background = "rgba(255,255,255,0.95)";
    });

    /* Klik → ganti facade dengan iframe */
    facade.addEventListener(
      "click",
      function () {
        var iframe = document.createElement("iframe");
        iframe.src =
          "https://www.youtube.com/embed/" +
          videoId +
          "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute(
          "allow",
          "autoplay; fullscreen; picture-in-picture",
        );
        iframe.setAttribute("allowfullscreen", "");
        iframe.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;";
        wrap.innerHTML = "";
        wrap.appendChild(iframe);
      },
      { once: true },
    );

    wrap.appendChild(facade);
  }

  /* ── Helper: inject video (MP4 lokal atau facade YouTube/Vimeo) ── */
  function injectVideo(wrapId, url, opts) {
    var wrap = document.getElementById(wrapId);
    if (!wrap || !url) return;

    var ytId = getYtId(url);
    var vimeoId = getVimeoId(url);

    if (ytId) {
      /* Science video: pakai facade */
      if (!opts.autoplay) {
        injectYtFacade(wrap, ytId);
        return;
      }
      /* Hero BG video YouTube: tidak dipakai (pakai MP4 saja) */
      return;
    }

    if (vimeoId) {
      var ph = wrap.querySelector(".ph");
      if (ph) ph.style.display = "none";
      var p =
        "autoplay=" +
        (opts.autoplay ? 1 : 0) +
        "&muted=" +
        (opts.mute ? 1 : 0) +
        "&loop=" +
        (opts.loop ? 1 : 0) +
        "&controls=" +
        (opts.controls ? 1 : 0) +
        "&background=" +
        (opts.background ? 1 : 0);
      var fr = document.createElement("iframe");
      fr.src = "https://player.vimeo.com/video/" + vimeoId + "?" + p;
      fr.setAttribute("frameborder", "0");
      fr.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
      fr.setAttribute("allowfullscreen", "");
      fr.style.cssText = "width:100%;height:100%;display:block;";
      wrap.appendChild(fr);
      return;
    }

    /* File lokal MP4 */
    var ph = wrap.querySelector(".ph");
    if (ph) ph.style.display = "none";
    var vid = document.createElement("video");
    vid.src = url;
    vid.autoplay = !!opts.autoplay;
    vid.muted = !!opts.mute;
    vid.loop = !!opts.loop;
    vid.controls = !!opts.controls;
    vid.playsInline = true;
    vid.style.cssText =
      "width:100%;height:100%;object-fit:cover;display:block;";
    wrap.appendChild(vid);
  }

  /* ── Helper: inject <img> ── */
  function injectImg(wrapId, src, alt, opts) {
    var wrap = document.getElementById(wrapId);
    if (!wrap || !src) return;
    var ph = wrap.querySelector(".ph");
    if (ph) ph.style.display = "none";
    var img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.loading = opts && opts.eager ? "eager" : "lazy";
    img.decoding = "async";
    if (opts && opts.priority) img.setAttribute("fetchpriority", "high");
    wrap.appendChild(img);
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectVideo("heroVideoBg", NPURE_MEDIA.heroVideo, {
      autoplay: true,
      mute: true,
      loop: true,
      controls: false,
      background: true,
    });
    injectVideo("scienceVideoWrap", NPURE_MEDIA.scienceVideo, {
      autoplay: false,
      mute: false,
      loop: false,
      controls: true,
      background: false,
    });

    injectImg(
      "heroImgSunscreen",
      NPURE_MEDIA.heroImgSunscreen,
      "NPURE Cica Sunscreen SPF 50+",
      { eager: true, priority: true },
    );
    injectImg(
      "heroImgToner",
      NPURE_MEDIA.heroImgToner,
      "NPURE Cica Hydrating Toner",
      { eager: true, priority: true },
    );
    injectImg(
      "productShowcaseSunscreen",
      NPURE_MEDIA.productImgSunscreen,
      "NPURE Cica Beat The Sun GLOW Sunscreen",
    );
    injectImg(
      "productShowcaseToner",
      NPURE_MEDIA.productImgToner,
      "NPURE Cica Hydrating & Calming Toner",
    );
    injectImg(
      "brandImgWrap",
      NPURE_MEDIA.brandImage,
      "Ladang Centella Asiatica NPURE",
    );
    injectImg(
      "beforeImgWrap",
      NPURE_MEDIA.beforeImage,
      "Sebelum – Kulit Hari 0",
    );
    injectImg(
      "afterImgWrap",
      NPURE_MEDIA.afterImage,
      "Sesudah – Kulit Hari 14",
    );
    injectImg(
      "bundleImgSunscreen",
      NPURE_MEDIA.bundleImgSunscreen,
      "Cica Sunscreen 35ml",
    );
    injectImg(
      "bundleImgSet",
      NPURE_MEDIA.bundleImgSet,
      "NPURE Starter Bundle Set",
    );
    injectImg("bundleImgToner", NPURE_MEDIA.bundleImgToner, "Cica Toner 150ml");
    injectImg(
      "artikelThumb1",
      NPURE_MEDIA.artikelThumb1,
      "Thumbnail: Mengenal Centella Asiatica",
    );
    injectImg(
      "artikelThumb2",
      NPURE_MEDIA.artikelThumb2,
      "Thumbnail: Cara Pakai Sunscreen",
    );
    injectImg(
      "artikelThumb3",
      NPURE_MEDIA.artikelThumb3,
      "Thumbnail: Rutinitas Kulit Berjerawat",
    );
    injectImg(
      "artikelThumb4",
      NPURE_MEDIA.artikelThumb4,
      "Thumbnail: SPF vs PA",
    );
    injectImg(
      "artikelHero1",
      NPURE_MEDIA.artikelHero1,
      "Hero: Mengenal Centella Asiatica",
    );
    injectImg(
      "artikelHero2",
      NPURE_MEDIA.artikelHero2,
      "Hero: Cara Pakai Sunscreen",
    );
    injectImg(
      "artikelHero3",
      NPURE_MEDIA.artikelHero3,
      "Hero: Rutinitas Kulit Berjerawat",
    );
    injectImg("artikelHero4", NPURE_MEDIA.artikelHero4, "Hero: SPF vs PA");
  });
})();

// NAV scroll
const nav = document.getElementById("mainNav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => observer.observe(el));

// FAQ
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  const isOpen = item.classList.contains("open");
  document
    .querySelectorAll(".faq-item.open")
    .forEach((i) => i.classList.remove("open"));
  if (!isOpen) item.classList.add("open");
}

// Nav Links
const menuBtn = document.querySelector(".nav-mobile-menu");
const navLinks = document.querySelector(".nav-links");
const closeBtn = document.getElementById("navCloseBtn");

function openMenu() {
  navLinks.classList.add("active");
  closeBtn && closeBtn.classList.add("active");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      navLinks.classList.add("open");
      menuBtn.classList.add("open");
    }),
  );
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navLinks.classList.remove("open");
  menuBtn.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  setTimeout(() => {
    navLinks.classList.remove("active");
    closeBtn && closeBtn.classList.remove("active");
  }, 350);
}

menuBtn.addEventListener("click", () =>
  navLinks.classList.contains("open") ? closeMenu() : openMenu(),
);
closeBtn && closeBtn.addEventListener("click", closeMenu);
navLinks
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) closeMenu();
});

// Supabase View Counter
const SUPABASE_URL = "https://vfipmavzzeniossxrvev.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmaXBtYXZ6emVuaW9zc3hydmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MzA1NDIsImV4cCI6MjA5NjEwNjU0Mn0.9n4mVi4FRd-JmBck5rpt16u7haeudSTXVCmAEWGRcPU";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function recordAndFetchViews() {
  if (!sessionStorage.getItem("view_recorded")) {
    await _supabase.from("page_views").insert({ page: "/" });
    sessionStorage.setItem("view_recorded", "true");
  }

  const { data } = await _supabase.from("view_counts").select("*").single();
  if (!data) return;

  const fmt = (n) => Number(n).toLocaleString("id-ID");
  document.getElementById("vc-today").textContent = fmt(data.today);
  document.getElementById("vc-month").textContent = fmt(data.this_month);
  document.getElementById("vc-year").textContent = fmt(data.this_year);
  document.getElementById("vc-total").textContent = fmt(data.total);
}

document.addEventListener("DOMContentLoaded", recordAndFetchViews);

// Review card stagger
document.querySelectorAll(".reviews-grid .review-card").forEach((card, i) => {
  card.style.transitionDelay = i * 0.1 + "s";
});
