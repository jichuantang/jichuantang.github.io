/* ── Apply saved theme immediately to prevent flash ── */
(function () {
  var saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ── Scroll-to-top button (debounced via rAF) ── */
  var topper = document.getElementById('topper');
  if (topper) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          topper.style.display =
            document.documentElement.scrollTop > 350 ? 'block' : 'none';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    topper.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Read-more toggle ── */
  var readMore = document.getElementById('read-more');
  var badgeMore = document.getElementById('badge-more');
  if (readMore && badgeMore) {
    readMore.style.display = 'none';
    badgeMore.addEventListener('click', function () {
      var hidden = readMore.style.display === 'none';
      readMore.style.display = hidden ? 'block' : 'none';
      badgeMore.textContent = hidden ? 'less' : 'more';
    });
  }

  /* ── Accordion show-all / hide-all ── */
  document.querySelectorAll('.expander').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var showAll = btn.textContent.trim() === 'show all';
      document.querySelectorAll('.panel-collapse').forEach(function (panel) {
        var inst = bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false });
        showAll ? inst.show() : inst.hide();
      });
      document.querySelectorAll('.accordion-plus-toggle').forEach(function (a) {
        a.setAttribute('aria-expanded', showAll ? 'true' : 'false');
        showAll ? a.classList.remove('collapsed') : a.classList.add('collapsed');
      });
      btn.textContent = showAll ? 'hide all' : 'show all';
    });
  });

  /* ── Fade-in on scroll (IntersectionObserver) ── */
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function (el) { observer.observe(el); });
  }

  /* ── Navbar shadow on scroll ── */
  var nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('navbar-scrolled', document.documentElement.scrollTop > 10);
    }, { passive: true });
  }

  /* ── News gallery click-to-open ── */
  document.querySelectorAll('.news-gallery img').forEach(function (img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
      window.open(img.src, '_blank');
    });
  });

});

/* ── Called by w3IncludeHTML callback after navbar/footer are loaded ── */
function initPage() {

  /* Active nav link based on current page */
  var page = location.pathname.split('/').pop() || 'index.html';
  var map = {
    'index.html': 'about',
    'news.html': 'news',
    'projects.html': 'projects',
    'publication.html': 'publication',
    'vitae.html': 'vitae'
  };
  var id = map[page];
  if (id) {
    var li = document.getElementById(id);
    if (li) {
      var a = li.querySelector('a');
      if (a) {
        a.classList.add('active');
        a.classList.add('hvr-bubble-bottom');
      }
    }
  }

  /* Dark-mode toggle button (lives inside included navbar) */
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var html = document.documentElement;
    function updateIcon() {
      var icon = toggle.querySelector('i');
      if (icon) {
        icon.className = html.getAttribute('data-theme') === 'dark'
          ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
    updateIcon();
    toggle.addEventListener('click', function () {
      var dark = html.getAttribute('data-theme') !== 'dark';
      html.setAttribute('data-theme', dark ? 'dark' : 'light');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      updateIcon();
    });
  }

  /* Bootstrap 5 tooltips */
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
    new bootstrap.Tooltip(el);
  });
}
