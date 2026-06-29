/* 
   ==========================================================================
   PAVITHRA J - PORTFOLIO INTERACTION & ANIMATION ENGINE
   ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initTypewriter();
    initScrollReveals();
    initCardTilts();
    initLaptopCodeSimulator();
});

/* ==========================================================================
   1. CUSTOM CURSOR GLOW TRACKER
   ========================================================================== */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    const dot = document.getElementById('cursor-dot');
    if (!glow || !dot) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Smooth cursor trailing
    setInterval(() => {
        posX += (mouseX - posX) * 0.1;
        posY += (mouseY - posY) * 0.1;
        
        glow.style.left = `${posX}px`;
        glow.style.top = `${posY}px`;
        
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    }, 10);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Expand dot on hover of interactive items
    const clickables = document.querySelectorAll('a, button, .tilt-card, input, textarea, .hamburger-menu');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(2.5)';
            dot.style.backgroundColor = 'var(--cream)';
            glow.style.width = '500px';
            glow.style.height = '500px';
        });
        item.addEventListener('mouseleave', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
            dot.style.backgroundColor = 'var(--brown-accent)';
            glow.style.width = '400px';
            glow.style.height = '400px';
        });
    });

    // Hide cursor when leaving viewport
    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
        dot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
        dot.style.opacity = '1';
    });
}

/* ==========================================================================
   2. HERO TEXT TYPEWRITER SEQUENCE
   ========================================================================== */
function initTypewriter() {
    const typingSpan = document.getElementById('typing-text');
    if (!typingSpan) return;

    const words = ["Full Stack Developer", "Software Engineer", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50; // Deleting is faster
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 120;
        }

        // Handle word completion
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingDelay = 2000; // Delay on full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingDelay = 500; // Pause before typing next word
        }

        setTimeout(type, typingDelay);
    }

    // Start typewriter sequence
    setTimeout(type, 1000);
}

/* ==========================================================================
   3. SCROLL-TRIGGERED REVEALS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveals() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Specific trigger actions if needed
                if (entry.target.classList.contains('skills-card')) {
                    animateProgressBars(entry.target);
                }
                
                // Trigger stats counters in about section
                if (entry.target.classList.contains('about-content-col')) {
                    animateCounters();
                }
                
                // Trigger education timelines lines active state
                if (entry.target.classList.contains('timeline-item')) {
                    const timeline = document.querySelector('.timeline-container');
                    if (timeline) timeline.classList.add('active');
                }

                // Trigger certifications timeline lines active state
                if (entry.target.classList.contains('cert-item')) {
                    const certTimeline = document.querySelector('.certifications-timeline');
                    if (certTimeline) certTimeline.classList.add('active');
                }

                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Fills the skill bar progress lines
function animateProgressBars(card) {
    const bars = card.querySelectorAll('.skill-bar-inner');
    bars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth;
    });
}

// Animates numerical counting stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        if (counter.classList.contains('counted')) return;
        
        const target = parseFloat(counter.getAttribute('data-count'));
        const duration = 1500; // 1.5s
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Linear progression
            const currentValue = progress * target;
            
            // Display matching decimals or full integers
            if (target % 1 === 0) {
                counter.textContent = Math.floor(currentValue);
            } else {
                counter.textContent = currentValue.toFixed(2);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                counter.classList.add('counted');
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

/* ==========================================================================
   4. 3D CARD TILT & CORNER GLOW POSITION
   ========================================================================== */
function initCardTilts() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse coordinates relative to card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set css variables for custom radial glow hover highlights
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Tilt calculations
            const width = rect.width;
            const height = rect.height;
            const midX = width / 2;
            const midY = height / 2;
            
            // Rotation ranges (max 8 degrees)
            const rotateY = ((x - midX) / midX) * 8;
            const rotateX = -((y - midY) / midY) * 8;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

/* ==========================================================================
   5. LAPTOP ILLUSTRATION LIVE CODE TYPING SIMULATOR
   ========================================================================== */
function initLaptopCodeSimulator() {
    const codeContainer = document.getElementById('live-code');
    if (!codeContainer) return;

    const codeSnippet = `const developer = {
  name: "Pavithra J",
  title: "Full Stack Dev",
  skills: [
    "React", "Svelte", 
    "Firebase", "Python", 
    "Java", "MongoDB"
  ],
  mcaPursuing: true,
  status: "Open to Work",
  code() {
    return "Scale high-performance apps";
  }
};

console.log("Ready to build!");`;

    let charIndex = 0;
    
    function simulateTyping() {
        if (charIndex < codeSnippet.length) {
            codeContainer.textContent += codeSnippet.charAt(charIndex);
            charIndex++;
            // Scroll screen body to bottom to mimic terminal output
            const parent = codeContainer.closest('.screen-body-code');
            if (parent) {
                parent.scrollTop = parent.scrollHeight;
            }
            // Add slight speed variability to feel like typing
            const speed = codeSnippet.charAt(charIndex - 1) === '\n' ? 250 : 25 + Math.random() * 30;
            setTimeout(simulateTyping, speed);
        } else {
            // Wait 5 seconds, clear and repeat
            setTimeout(() => {
                codeContainer.textContent = '';
                charIndex = 0;
                simulateTyping();
            }, 5000);
        }
    }

    setTimeout(simulateTyping, 2000);
}
