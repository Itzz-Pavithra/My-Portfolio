document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const contactForm = document.getElementById('contactForm');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav item
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission prevention (for demo)
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Form fields
                const formFields = this.querySelectorAll('input, textarea');
                formFields.forEach(field => field.value = '');
                
                // Reset button
                submitBtn.textContent = 'Message Sent!';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // Active navigation based on scroll position
    function setActiveNav() {
        let scrollPosition = window.scrollY;
        
        // Navbar color change on scroll
        if (scrollPosition > 50) {
            navbar.style.padding = '0.7rem 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';
        }
        
        // Highlight active nav item
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPosition >= top && scrollPosition < bottom) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.skill-item, .project-card, .timeline-item, .hobby-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize animations
    function initAnimations() {
        const elements = document.querySelectorAll('.skill-item, .project-card, .timeline-item, .hobby-item');
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Trigger initial animation check
        animateOnScroll();
    }

    // Skill hover effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Typing animation for hero section
    function typeEffect() {
        const heroTitle = document.querySelector('.hero-content h1');
        if (!heroTitle) return;
        
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        
        let i = 0;
        const speed = 100; // Adjust typing speed here
        
        function type() {
            if (i < text.length) {
                if (text.substring(i, i + 22) === "Hello, I'm <span>Pavithra J</span>") {
                    heroTitle.innerHTML += "Hello, I'm <span>Pavithra J</span>";
                    i += 22;
                } else {
                    heroTitle.innerHTML += text.charAt(i);
                    i++;
                }
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize
    window.addEventListener('scroll', setActiveNav);
    window.addEventListener('scroll', animateOnScroll);
    
    // Call initial functions
    setActiveNav();
    initAnimations();
    setTimeout(typeEffect, 500); // Start typing effect after 500ms
});