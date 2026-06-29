/* 
   ==========================================================================
   PAVITHRA J - PORTFOLIO CORE SYSTEM SCRIPTS
   ==========================================================================
*/

window.addEventListener('load', () => {
    // 1. Dismiss Loading Screen
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileNav();
    initScrollProgress();
    initActiveNavLinks();
    initButtonRipples();
    initBackToTop();
    initContactFormDummyHandler();
});

/* ==========================================================================
   1. STICKY HEADER SCROLL CLASS
   ========================================================================== */
function initStickyHeader() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   2. MOBILE NAV TOGGLER
   ========================================================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    // Toggle menu state
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        }
    });
}

/* ==========================================================================
   3. SCROLL PROGRESS INDICATOR
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

/* ==========================================================================
   4. ACTIVE NAV LINK ACCORDING TO VIEWPORT
   ========================================================================== */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // offset for sticky nav
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
    });
}

/* ==========================================================================
   5. BUTTON CLICK RIPPLE EFFECTS
   ========================================================================== */
function initButtonRipples() {
    const rippleButtons = document.querySelectorAll('.ripple-btn');

    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Only add ripple if button is directly clicked
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            // Remove ripple span after animation finishes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/* ==========================================================================
   6. BACK TO TOP BUTTON TRIGGERS
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   7. CONTACT FORM HANDLER (DEMONSTRATIVE & ATS-FRIENDLY ONLY)
   ========================================================================== */
function initContactFormDummyHandler() {
    const contactForm = document.getElementById('portfolio-contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show simulated send feedback modal
        const submitBtn = contactForm.querySelector('.form-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        
        setTimeout(() => {
            alert('Your message was successfully captured! (Simulated submission - data verified locally)');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    });

    // Dummy project demo buttons click alert
    const dummies = document.querySelectorAll('.live-demo-dummy');
    dummies.forEach(dummy => {
        dummy.addEventListener('click', (e) => {
            e.preventDefault();
            alert('This is a demonstrative link placeholder for this portfolio project.');
        });
    });
}
