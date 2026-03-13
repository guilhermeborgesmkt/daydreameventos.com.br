document.addEventListener('DOMContentLoaded', function () {

    // Mobile menu
    var menuBtn = document.getElementById('mobile-menu-btn');
    var nav = document.getElementById('nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
            menuBtn.setAttribute('aria-label', nav.classList.contains('active') ? 'Fechar menu' : 'Abrir menu');
        });
    }

    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(function (question) {
        question.addEventListener('click', function () {
            var item = this.closest('.faq-item');
            var wasActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(function (i) {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!wasActive) {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Smooth scroll + close mobile menu
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            var offset = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });

            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (menuBtn) { menuBtn.classList.remove('active'); menuBtn.setAttribute('aria-label', 'Abrir menu'); }
            }
        });
    });

    // Header scroll
    var header = document.querySelector('.header');
    function onScroll() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Scroll to top
    var scrollBtn = document.getElementById('scroll-top');
    function onScrollBtn() {
        if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }
    window.addEventListener('scroll', onScrollBtn, { passive: true });
    onScrollBtn();
    if (scrollBtn) scrollBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // Platform search
    var searchInput = document.getElementById('platform-search');
    var cards = document.querySelectorAll('.showcase, .rank-item');
    var noResults = document.getElementById('no-results');
    var timer;

    if (searchInput && cards.length) {
        searchInput.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var q = searchInput.value.toLowerCase().trim();
                var count = 0;
                cards.forEach(function (c) {
                    var name = (c.getAttribute('data-name') || '').toLowerCase();
                    var show = name.indexOf(q) !== -1;
                    c.style.display = show ? '' : 'none';
                    if (show) count++;
                });
                if (noResults) noResults.style.display = count === 0 ? 'block' : 'none';
            }, 200);
        });
    }

    // Stats counter
    var metricsBar = document.querySelector('.metrics-bar');
    var statsAnimated = false;

    if (metricsBar && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    document.querySelectorAll('.metric-val').forEach(function (el) {
                        var text = el.textContent;
                        var match = text.match(/[\d.]+/);
                        if (!match) return;
                        var raw = match[0];
                        var suffix = text.replace(raw, '');
                        var end = parseFloat(raw.replace('.', ''));
                        var useDot = raw.indexOf('.') !== -1;
                        animateNum(el, 0, end, 1800, suffix, useDot);
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 }).observe(metricsBar);
    }

    function animateNum(el, start, end, dur, suffix, useDot) {
        var range = end - start;
        var t0 = null;
        function step(ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var cur = Math.floor(start + range * eased);
            el.textContent = (useDot ? cur.toLocaleString('pt-BR') : String(cur)) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

});
