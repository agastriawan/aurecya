
/* ═══════════════════════════════════════════════════════
   🎬 NPURE VIDEO & MEDIA CONFIG
   Isi URL video/gambar di sini, lalu simpan file.
   ═══════════════════════════════════════════════════════

   FORMAT URL yang didukung:
   • File lokal  : "assets/nama-video.mp4"
   • URL absolut : "https://cdn.contoh.com/video.mp4"
   • YouTube     : "https://www.youtube.com/watch?v=XXXXXXX"
                   "https://youtu.be/XXXXXXX"
   • Vimeo       : "https://vimeo.com/XXXXXXX"

   Kosongkan string ("") untuk tetap tampilkan placeholder.
═══════════════════════════════════════════════════════ */

const NPURE_MEDIA = {

  // VIDEO
  heroVideo:             "assets/video-hero.mp4",
// scienceVideo: "https://youtu.be/Bm6OyBu4wj8
scienceVideo: "https://www.youtube.com/watch?v=6ztJORrNjSU&t=7s",


  // PRODUK DI HERO (kecil, melayang)
  heroImgSunscreen:      "assets/sunscreen-hero.png",
  heroImgToner:          "assets/toner-hero.png",

  // PRODUK SHOWCASE (besar)
  productImgSunscreen:   "assets/sunscreen-showcase.webp",
  productImgToner:       "assets/toner-showcase.png",

  // KONTEN
  brandImage:            "assets/brand-image.webp",
  beforeImage:           "assets/before.jpg",
  afterImage:            "assets/after.jpg",

  // BUNDLE CTA
  bundleImgSunscreen:    "assets/bundle-sunscreen.png",
  bundleImgSet:          "assets/bundle-set.png",
  bundleImgToner:        "assets/bundle-toner.png",

  // ARTIKEL
  artikelThumb1:         "assets/artikel-1-thumb.jpg",
  artikelThumb2:         "assets/artikel-2-thumb.jpg",
  artikelThumb3:         "assets/artikel-3-thumb.jpg",
  artikelHero1:          "assets/artikel-1-hero.jpg",
  artikelHero2:          "assets/artikel-2-hero.jpg",
  artikelHero3:          "assets/artikel-3-hero.jpg",

};

/* ─── JANGAN UBAH KODE DI BAWAH INI ─── */
(function applyNpureMedia() {
  document.addEventListener('DOMContentLoaded', function () {

    /* Helper: parse YouTube / Vimeo ke embed URL */
    function toEmbedUrl(url, opts) {
      if (!url) return null;
      // YouTube
      let yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
      if (yt) {
        let params = 'autoplay=' + (opts.autoplay ? 1 : 0) +
                     '&mute=' + (opts.mute ? 1 : 0) +
                     '&loop=' + (opts.loop ? 1 : 0) +
                     (opts.loop && yt[1] ? '&playlist=' + yt[1] : '') +
                     '&controls=' + (opts.controls ? 1 : 0) +
                     '&playsinline=1&rel=0&modestbranding=1';
        return { type: 'iframe', src: 'https://www.youtube.com/embed/' + yt[1] + '?' + params };
      }
      // Vimeo
      let vm = url.match(/vimeo\.com\/(\d+)/);
      if (vm) {
        let params = 'autoplay=' + (opts.autoplay ? 1 : 0) +
                     '&muted=' + (opts.mute ? 1 : 0) +
                     '&loop=' + (opts.loop ? 1 : 0) +
                     '&controls=' + (opts.controls ? 1 : 0) +
                     '&background=' + (opts.background ? 1 : 0);
        return { type: 'iframe', src: 'https://player.vimeo.com/video/' + vm[1] + '?' + params };
      }
      // File lokal / URL langsung
      return { type: 'video', src: url };
    }

    /* ── 1. HERO VIDEO ── */
    (function() {
      var url = NPURE_MEDIA.heroVideo;
      var wrap = document.getElementById('heroVideoWrap');
      if (!wrap) return;
      if (!url) { wrap.querySelector('.npure-ph').style.display = 'flex'; return; }
      wrap.querySelector('.npure-ph').style.display = 'none';
      var info = toEmbedUrl(url, { autoplay:true, mute:true, loop:true, controls:false, background:true });
      if (info.type === 'iframe') {
        var fr = document.createElement('iframe');
        fr.src = info.src;
        fr.setAttribute('frameborder','0');
        fr.setAttribute('allow','autoplay; fullscreen');
        fr.setAttribute('allowfullscreen','');
        fr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;';
        wrap.appendChild(fr);
      } else {
        var vid = document.createElement('video');
        vid.src = info.src;
        vid.autoplay = true; vid.muted = true; vid.loop = true; vid.playsInline = true;
        vid.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
        wrap.appendChild(vid);
      }
    })();

    /* ── 2. SCIENCE VIDEO ── */
    (function() {
      var url = NPURE_MEDIA.scienceVideo;
      var wrap = document.getElementById('scienceVideoWrap');
      if (!wrap) return;
      if (!url) { wrap.querySelector('.npure-ph').style.display = 'flex'; return; }
      wrap.querySelector('.npure-ph').style.display = 'none';
      var info = toEmbedUrl(url, { autoplay:false, mute:false, loop:false, controls:true, background:false });
      if (info.type === 'iframe') {
        var fr = document.createElement('iframe');
        fr.src = info.src;
        fr.setAttribute('frameborder','0');
        fr.setAttribute('allow','autoplay; fullscreen; picture-in-picture');
        fr.setAttribute('allowfullscreen','');
        fr.style.cssText = 'width:100%;height:100%;border-radius:1.5rem;';
        wrap.appendChild(fr);
      } else {
        var vid = document.createElement('video');
        vid.src = info.src; vid.controls = true; vid.playsInline = true;
        vid.style.cssText = 'width:100%;height:100%;border-radius:1.5rem;object-fit:cover;background:#000;';
        wrap.appendChild(vid);
      }

      console.log(info);
    })();

    /* ── 3. BRAND IMAGE ── */
    (function() {
      var url = NPURE_MEDIA.brandImage;
      var wrap = document.getElementById('brandImageWrap');
      if (!wrap) return;
      if (!url) { wrap.querySelector('.npure-ph').style.display = 'flex'; return; }
      wrap.querySelector('.npure-ph').style.display = 'none';
      var img = document.createElement('img');
      img.src = url;
      img.alt = 'NPURE – Ladang Centella Asiatica';
    //   img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:2rem;display:block;';
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;border-radius:2rem;display:block;';
      wrap.insertBefore(img, wrap.firstChild);
    })();

    (function() {
      var url = NPURE_MEDIA.productImgSunscreen;
      var wrap = document.getElementById('productImgSunscreenWrap');
      if (!wrap) return;
      if (!url) { wrap.querySelector('.npure-ph').style.display = 'flex'; return; }
      wrap.querySelector('.npure-ph').style.display = 'none';
      var img = document.createElement('img');
      img.src = url;
      img.alt = 'NPURE – Ladang Centella Asiatica';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:2rem;display:block;';
      wrap.insertBefore(img, wrap.firstChild);
    })();

  });
})();
