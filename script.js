// Navigation Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollTop = 0;
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Skills Animation
const skillBars = document.querySelectorAll('.progress');
const animateSkills = () => {
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });

    // New: Animate technical and soft skills progress
    const techSkills = document.querySelectorAll('.tech-skill');
    const softSkills = document.querySelectorAll('.soft-skill');

    techSkills.forEach(skill => {
        skill.style.transform = 'scaleX(0)';
        setTimeout(() => {
            skill.style.transform = 'scaleX(1)';
        }, 100);
    });

    softSkills.forEach(skill => {
        skill.style.opacity = '0';
        setTimeout(() => {
            skill.style.opacity = '1';
        }, 100);
    });
};

// Intersection Observer for Section Animations
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.2
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (entry.target.id === 'skills') {
                animateSkills();
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Add your form submission logic here
    console.log('Form submitted:', formData);
    
    // Reset form after submission
    contactForm.reset();
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
});

// Typing Animation for Home Section
const typeText = (element, text, speed = 100) => {
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, speed);
};

// Initialize Typing Animation
window.addEventListener('load', () => {
    const titleElement = document.querySelector('.home h1');
    const originalText = titleElement.textContent;
    titleElement.textContent = '';
    typeText(titleElement, originalText);
});

// Scroll Progress Indicator
const createScrollIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--secondary-color);
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.width = scrolled + '%';
    });
};

createScrollIndicator();

// Animated Counter for Experience Numbers
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / target));
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = start;
        if (start === target) {
            clearInterval(timer);
        }
    }, stepTime);
};

// Lazy Loading for Profile Image
const lazyLoadImages = () => {
    const images = document.querySelectorAll('[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// Parallax Effect for Profile Shape
const profileShape = document.querySelector('.profile-shape');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (profileShape) {
        profileShape.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});

// Active Navigation Link Highlight
const highlightActiveNavLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
};

highlightActiveNavLink();

// Skills Cards Hover Effect
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    });
    
    card.addEventListener('mouseout', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
});

// Theme Toggle
const createThemeToggle = () => {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        border-radius: 50%;
        background: var(--secondary-color);
        color: white;
        border: none;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    document.body.appendChild(toggleBtn);

    let isDark = false;
    toggleBtn.addEventListener('click', () => {
        isDark = !isDark;
        document.body.classList.toggle('dark-theme');
        toggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
};

createThemeToggle();

// Form Validation
const validateForm = () => {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const showError = (element, message) => {
        const formGroup = element.parentElement;
        const error = formGroup.querySelector('.error-message') || document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
    };

    const removeError = (element) => {
        const formGroup = element.parentElement;
        const error = formGroup.querySelector('.error-message');
        if (error) {
            formGroup.removeChild(error);
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    form.addEventListener('submit', (e) => {
        let isValid = true;

        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else {
            removeError(nameInput);
        }

        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            removeError(emailInput);
        }

        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else {
            removeError(messageInput);
        }

        if (!isValid) {
            e.preventDefault();
        }
    });
};

validateForm();

// Initialize All Animations
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    createScrollIndicator();
    highlightActiveNavLink();
    
    // Animate elements when they come into view
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animateOnScroll.observe(element);
    });
});

// Add Loading Animation
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);

    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loader);
        }, 500);
    }, 1000);
});

// Handle Mobile Navigation
const handleMobileNav = () => {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    let isOpen = false;

    menuBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        navLinks.style.transform = isOpen ? 'translateX(0)' : 'translateX(100%)';
        menuBtn.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !e.target.closest('.nav-content')) {
            isOpen = false;
            navLinks.style.transform = 'translateX(100%)';
            menuBtn.classList.remove('active');
        }
    });
};

handleMobileNav();
