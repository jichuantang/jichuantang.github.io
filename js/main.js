$(document).ready(function() {

  // Scroll to top button ----------------------------------------------------------
  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {
    scrollFunction()
  };

  function scrollFunction() {
    if (document.body.scrollTop > 350 || document.documentElement.scrollTop > 350) {
      document.getElementById("topper").style.display = "block";
    } else {
      document.getElementById("topper").style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  $("#topper").on("click", function() {
    $("html").animate({
      scrollTop: 0
    }, 400);
  });

  // tooltips function
  $(function() {
    $('[data-toggle="tooltip"]').tooltip()
  })

  // Initally hide the read more div
     $("#read-more").css("display", "none");

     // Show more on click
     $("#badge-more").on("click", function() {

        // Show/hide the div
        $("#read-more").fadeToggle("fast");

        // Change the button
        if ($("#badge-more").text() == "more") {
           $("#badge-more").text("less");
        } else {
           $("#badge-more").text("more");
        }

     });

     // popover function
     $('[data-toggle="popover"]').popover();

     // open all accordion panels for possible rinting
     $(".expander").on("click", function() {

        // Change the button
        if ($(".expander").text() == "show all") {
           $(".expander").text("hide all");
           $(".panel-collapse").addClass("in");
           $(".panel-default a").attr("aria-expanded", "true").removeClass("collapsed");
        } else {
           $(".expander").text("show all");
           $(".panel-collapse").removeClass("in");
           $(".panel-default a").attr("aria-expanded", "false").addClass("collapsed");
        }

     });

     $(".accordion-toggle").on("click", function() {

        $(".panel-collapse").removeClass("in");
        $(".panel-default a").attr("aria-expanded", "false").addClass("collapsed");
        $(".expander").text("show all");

     });

     // Project +/- toggle for descriptions
     $(document).on("click", ".project-toggle", function() {
        var $item = $(this).closest(".news-item");
        var $details = $item.find(".project-details");
        $details.slideToggle(200);
        $(this).text($(this).text() === "+" ? "\u2212" : "+");
     });

     // Dark mode toggle
     function updateThemeIcon() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        $("#theme-toggle i").attr("class", isDark ? "fas fa-sun" : "fas fa-moon");
     }

     // Periodic check to update icon because navbar is loaded asynchronously
     var checkNavbar = setInterval(function() {
        if ($("#theme-toggle i").length) {
           updateThemeIcon();
           clearInterval(checkNavbar);
        }
     }, 50);

     // Event delegation to handle dynamically loaded navbar
     $(document).on("click", "#theme-toggle", function(e) {
        e.preventDefault();
        var isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
     });


});

/* ===== Immersive layer ====================================================
   Scroll progress bar, IntersectionObserver-driven section reveals, and
   banner parallax. Lives outside the jQuery ready block so it can use
   native APIs and feature-detect cleanly. */
(function() {
  var prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Scroll progress strip at the very top of the viewport.
  if (!prefersReduced) {
    var bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);
    var rafProgress = false;
    function updateProgress() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop / max) : 0;
      bar.style.width = (Math.min(1, Math.max(0, pct)) * 100) + '%';
      rafProgress = false;
    }
    window.addEventListener('scroll', function() {
      if (!rafProgress) { requestAnimationFrame(updateProgress); rafProgress = true; }
    }, { passive: true });
    updateProgress();
  }

  // 2. Section reveal-on-scroll. The reveal class is added by JS only on
  //    below-the-fold elements — above-the-fold content stays static so
  //    there's no flash if JS executes after first paint.
  function setupReveal() {
    if (prefersReduced || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    function tag(el, className) {
      var rect = el.getBoundingClientRect();
      var inView = rect.top < window.innerHeight * 0.9;
      if (inView) return; // leave above-fold elements alone
      el.classList.add(className);
      io.observe(el);
    }

    document.querySelectorAll('main .section-card').forEach(function(el) {
      tag(el, 'reveal');
    });
    document.querySelectorAll(
      '.priority-cards, .news-cards, .school-logos, .news-images'
    ).forEach(function(el) {
      tag(el, 'reveal-stagger');
    });
  }

  // 3. Banner parallax. The banner sits inside navbar.html, which is
  //    injected via w3IncludeHTML — poll briefly until it appears.
  function setupBannerParallax() {
    if (prefersReduced) return;
    var band = document.getElementById('image-band');
    if (!band) return false;
    var img = band.querySelector('img');
    if (!img) return false;

    var rafBand = false;
    function updateBand() {
      var rect = band.getBoundingClientRect();
      // Only animate while the banner is anywhere near the viewport
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) {
        rafBand = false;
        return;
      }
      // Slow parallax: image drifts up at ~25% of scroll distance
      var offset = -rect.top * 0.25;
      // Clamp so the image never slips past its 1.08x scale buffer
      var max = rect.height * 0.08;
      if (offset > max) offset = max;
      if (offset < -max) offset = -max;
      img.style.setProperty('--parallax', offset.toFixed(1) + 'px');
      rafBand = false;
    }
    window.addEventListener('scroll', function() {
      if (!rafBand) { requestAnimationFrame(updateBand); rafBand = true; }
    }, { passive: true });
    updateBand();
    return true;
  }

  // Reveal can run once DOM is ready; navbar is injected synchronously
  // by w3IncludeHTML in the HTML, but parallax reads the included
  // markup, so we poll a few times for safety.
  if (document.readyState !== 'loading') {
    setupReveal();
  } else {
    document.addEventListener('DOMContentLoaded', setupReveal);
  }

  var tries = 0;
  function tryBanner() {
    if (setupBannerParallax()) return;
    if (++tries < 20) setTimeout(tryBanner, 50);
  }
  tryBanner();
})();
