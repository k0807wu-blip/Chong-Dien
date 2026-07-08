document.addEventListener('DOMContentLoaded', () => {
    refreshCartBadge();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const navbar = document.getElementById('navbar');
    const toTop = document.getElementById('to-top');
    window.onscroll = function() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled', 'py-2');
            if (toTop) toTop.classList.remove('hidden');
        } else {
            navbar.classList.remove('scrolled', 'py-2');
            if (toTop) toTop.classList.add('hidden');
        }
    };

    if (toTop) {
        toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });
        }
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });
        });
    }
});
