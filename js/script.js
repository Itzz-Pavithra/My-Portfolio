/* 
   ==========================================================================
   PAVITHRA J - PORTFOLIO CORE SYSTEM SCRIPTS
   Aesthetic: Clean, scalable, modular, granular production-ready logic.
   ==========================================================================
*/

// ==========================================================================
// 1. PAGE LOADER CONTROLLER
// ==========================================================================
const PageLoader = (() => {
    const loader = document.getElementById('loader');

    const hide = () => {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    };

    const init = () => {
        window.addEventListener('load', hide);
    };

    return { init };
})();

// ==========================================================================
// 2. GLASSMORPHIC TOAST NOTIFICATION SERVICE
// ==========================================================================
const Toast = (() => {
    let container = null;

    const createContainer = () => {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    };

    const show = (title, message, type = 'success', duration = 4000) => {
        if (!container) {
            createContainer();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';

        const iconClass = type === 'success' ? 'fa-circle-check success' : 'fa-circle-exclamation error';
        
        toast.innerHTML = `
            <i class="fa-solid ${iconClass} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close Notification">&times;</button>
        `;

        container.appendChild(toast);

        // Trigger slide-in transition
        setTimeout(() => toast.classList.add('show'), 50);

        // Configure auto-dismiss timeout
        const autoCloseTimeout = setTimeout(() => dismiss(toast), duration);

        // Setup manual dismiss handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoCloseTimeout);
            dismiss(toast);
        });
    };

    const dismiss = (toast) => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    };

    return { show };
})();

// ==========================================================================
// 3. NAVIGATION CONTROLLER (Sticky header, Mobile toggle, Active links)
// ==========================================================================
const Navigation = (() => {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScrollSticky = () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    const toggleMobileMenu = (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    };

    const closeMobileMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
    };

    const handleOutsideClick = (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== hamburger) {
            closeMobileMenu();
        }
    };

    const updateActiveSection = () => {
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
    };

    const init = () => {
        window.addEventListener('scroll', handleScrollSticky);
        window.addEventListener('scroll', updateActiveSection);
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', toggleMobileMenu);
            navLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
            document.addEventListener('click', handleOutsideClick);
        }
    };

    return { init };
})();

// ==========================================================================
// 4. SCROLL TRACKER SERVICE (Progress bar & Back-to-top floating button)
// ==========================================================================
const ScrollTracker = (() => {
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    const handleScroll = () => {
        updateProgress();
        updateBackToTopButtonVisibility();
    };

    const updateProgress = () => {
        if (!progressBar) return;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        progressBar.style.width = `${scrolled}%`;
    };

    const updateBackToTopButtonVisibility = () => {
        if (!backToTopBtn) return;
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const init = () => {
        window.addEventListener('scroll', handleScroll);
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }
    };

    return { init };
})();

// ==========================================================================
// 5. BUTTON RIPPLE EFFECT SYSTEM
// ==========================================================================
const ButtonEffects = (() => {
    const rippleButtons = document.querySelectorAll('.ripple-btn');

    const createRipple = (e, button) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);

        // Remove element after keyframe completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    };

    const init = () => {
        rippleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => createRipple(e, btn));
        });
    };

    return { init };
})();

// ==========================================================================
// 6. CONTACT FORM CONTROLLER (EmailJS integration + validations)
// ==========================================================================
const ContactForm = (() => {
    const form = document.getElementById('portfolio-contact-form');
    const submitBtn = form?.querySelector('.form-submit-btn');
    const dummies = document.querySelectorAll('.live-demo-dummy');

    const setSendingState = (isSending) => {
        if (!submitBtn) return;
        if (isSending) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Transmitting...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const subject = document.getElementById('subject')?.value;
        const message = document.getElementById('message')?.value;

        setSendingState(true);

        try {
            // Attempt to send email through EmailJS module
            await EmailService.send({ name, email, subject, message });
            
            // On success
            Toast.show('Message Delivered', 'Your message has been sent successfully to Pavithra J.', 'success');
            form.reset();
        } catch (error) {
            // On error
            Toast.show('Sending Failed', error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            setSendingState(false);
        }
    };

    const handleDummyClick = (e) => {
        e.preventDefault();
        alert('This is a demonstrative link placeholder for this portfolio project.');
    };

    const init = () => {
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
        
        dummies.forEach(dummy => {
            dummy.addEventListener('click', handleDummyClick);
        });
    };

    return { init };
})();

// ==========================================================================
// INITIALIZE SYSTEM
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    PageLoader.init();
    Navigation.init();
    ScrollTracker.init();
    ButtonEffects.init();
    ContactForm.init();
});
