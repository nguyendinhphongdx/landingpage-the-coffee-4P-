// The Coffee 4P+ — landing page interactions
(function () {
    'use strict';

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ---------- Năm hiện tại trong footer ---------- */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Sticky header style khi cuộn ---------- */
    const header = $('#header');
    const onScroll = () => {
        if (window.scrollY > 20) header.classList.add('is-scrolled');
        else header.classList.remove('is-scrolled');

        // Back to top
        if (backToTop) {
            if (window.scrollY > 500) backToTop.classList.add('is-visible');
            else backToTop.classList.remove('is-visible');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile nav toggle ---------- */
    const navToggle = $('#navToggle');
    const nav       = $('#nav');
    const navLinks  = $$('#nav a');

    const closeNav = () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    const openNav = () => {
        nav.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            if (nav.classList.contains('is-open')) closeNav();
            else openNav();
        });
        navLinks.forEach(link => link.addEventListener('click', closeNav));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
        });
    }

    /* ---------- Reveal-on-scroll animation ---------- */
    const revealTargets = [
        '.section__header',
        '.about__media',
        '.about__text',
        '.menu-card',
        '.gallery__item',
        '.contact__info',
        '.contact__map',
        '.quote blockquote'
    ];
    const revealEls = revealTargets.flatMap(sel => $$(sel));
    revealEls.forEach(el => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    /* ---------- Back to top ---------- */
    const backToTop = $('#backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Active nav link on scroll (scroll-spy nhẹ) ---------- */
    const sections = ['about', 'menu', 'gallery', 'contact']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(a => {
                        if (a.getAttribute('href') === `#${id}`) a.style.color = 'var(--color-accent-dark)';
                        else a.style.color = '';
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        sections.forEach(s => spy.observe(s));
    }
})();

/* =========================================================
   LIGHTBOX — gallery viewer với prev/next, thumbnail strip,
   keyboard + touch swipe.
   ========================================================= */
(function () {
    'use strict';

    // Mảng tổng tất cả ảnh — 6 ảnh đầu trùng với gallery grid (theo thứ tự HTML),
    // các ảnh sau là bổ sung chỉ hiện trong lightbox.
    const GALLERY = [
        { src: 'images/fb-29.jpg', alt: 'Góc không gian 4P+ Coffee với ánh đèn ấm' },
        { src: 'images/fb-02.jpg', alt: 'Khách đông kín bên trong 4P+ Coffee — không gian gặp gỡ ấm cúng' },
        { src: 'images/fb-14.jpg', alt: 'Đèn lồng đỏ kiểu Hội An treo trên cửa kính 4P+ Coffee' },
        { src: 'images/fb-10.jpg', alt: 'Cửa kính lối vào với chữ Welcome to 4P+ Coffee — mở 7h sáng đến 11h tối' },
        { src: 'images/fb-19.jpg', alt: 'Bộ ba đồ uống mùa hè 4P+: Trà hoa quả nhiệt đới, Dừa tươi hạt sen, Olong xoài macchiato' },
        { src: 'images/fb-22.jpg', alt: 'Bức tường báo và cờ đỏ — điểm nhấn vintage đặc trưng' },
        // Thêm cho lightbox
        { src: 'images/fb-07.jpg', alt: 'Phòng riêng yên tĩnh — góc làm việc lý tưởng' },
        { src: 'images/fb-28.jpg', alt: 'Sân ngoài trời với bảng menu chalkboard' },
        { src: 'images/fb-11.jpg', alt: 'Dây cờ đỏ giăng dưới tán cây' },
        { src: 'images/fb-26.jpg', alt: 'Cây cảnh và cửa sổ nhìn ra phố' },
        { src: 'images/fb-12.jpg', alt: 'Một khoảnh khắc tại 4P+ Coffee' },
        { src: 'images/fb-13.jpg', alt: 'Một khoảnh khắc tại 4P+ Coffee' },
        { src: 'images/fb-08.jpg', alt: 'Một góc không gian 4P+' },
        { src: 'images/fb-15.jpg', alt: 'Một khoảnh khắc tại 4P+ Coffee' },
        { src: 'images/fb-20.jpg', alt: 'Một góc không gian 4P+' },
        { src: 'images/fb-27.jpg', alt: 'Một khoảnh khắc tại 4P+ Coffee' },
    ];

    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lbImage   = document.getElementById('lbImage');
    const lbCaption = document.getElementById('lbCaption');
    const lbCurrent = document.getElementById('lbCurrent');
    const lbTotal   = document.getElementById('lbTotal');
    const lbThumbs  = document.getElementById('lbThumbs');
    const lbPrev    = document.getElementById('lbPrev');
    const lbNext    = document.getElementById('lbNext');
    const lbClose   = document.getElementById('lbClose');

    let currentIndex = 0;

    // Render thumbnail strip
    GALLERY.forEach((img, i) => {
        const btn = document.createElement('button');
        btn.className = 'lightbox__thumb';
        btn.type = 'button';
        btn.setAttribute('aria-label', `Ảnh ${i + 1}`);
        btn.innerHTML = `<img src="${img.src}" alt="" loading="lazy">`;
        btn.addEventListener('click', () => showImage(i));
        lbThumbs.appendChild(btn);
    });
    lbTotal.textContent = GALLERY.length;

    function showImage(index) {
        currentIndex = (index + GALLERY.length) % GALLERY.length;
        const img = GALLERY[currentIndex];

        // Reset animation
        lbImage.style.animation = 'none';
        void lbImage.offsetWidth;
        lbImage.style.animation = '';

        lbImage.src = img.src;
        lbImage.alt = img.alt;
        lbCaption.textContent = img.alt;
        lbCurrent.textContent = currentIndex + 1;

        // Highlight active thumbnail + scroll into view
        Array.from(lbThumbs.children).forEach((thumb, i) => {
            const active = i === currentIndex;
            thumb.classList.toggle('is-active', active);
            thumb.setAttribute('aria-current', active ? 'true' : 'false');
        });
        const activeThumb = lbThumbs.children[currentIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    function openLightbox(index = 0) {
        showImage(index);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        // Focus close button for a11y
        requestAnimationFrame(() => lbClose.focus());
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
    }

    // Wire up: click trên ảnh trong grid → mở lightbox
    document.querySelectorAll('.gallery__item').forEach((item, i) => {
        item.classList.add('is-interactive');
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Mở ảnh ${i + 1} ở chế độ xem lớn`);
        item.addEventListener('click', () => openLightbox(i));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(i);
            }
        });
    });

    // Nút "Xem tất cả ảnh" — show đúng số lượng động
    const viewAllBtn = document.getElementById('galleryViewAll');
    if (viewAllBtn) {
        const span = viewAllBtn.querySelector('span');
        if (span) span.textContent = `Xem tất cả ${GALLERY.length} ảnh`;
        viewAllBtn.addEventListener('click', () => openLightbox(0));
    }

    // Nav buttons
    lbPrev.addEventListener('click', () => showImage(currentIndex - 1));
    lbNext.addEventListener('click', () => showImage(currentIndex + 1));
    lbClose.addEventListener('click', closeLightbox);

    // Click backdrop (không phải ảnh/nút) → đóng
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape')      { closeLightbox(); }
        else if (e.key === 'ArrowLeft')  { showImage(currentIndex - 1); }
        else if (e.key === 'ArrowRight') { showImage(currentIndex + 1); }
    });

    // Touch swipe trên mobile
    let touchStartX = null;
    let touchStartY = null;
    lightbox.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        // Chỉ trigger nếu swipe ngang rõ rệt
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            showImage(currentIndex + (dx < 0 ? 1 : -1));
        }
        touchStartX = null;
        touchStartY = null;
    });
})();
