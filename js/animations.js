/* 
   ==========================================================================
   PAVITHRA J - PORTFOLIO INTERACTION & ANIMATION ENGINE
   Aesthetic: Clean, scalable, modular, granular production-ready animations.
   ==========================================================================
*/

// ==========================================================================
// 1. CUSTOM INTERACTIVE CURSOR TRAIL SERVICE
// ==========================================================================
const CustomCursor = (() => {
    const glow = document.getElementById('cursor-glow');
    const dot = document.getElementById('cursor-dot');
    
    // Position state variables
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    const setupTrailingInterval = () => {
        setInterval(() => {
            // Easing / interpolation calculation (10% step)
            posX += (mouseX - posX) * 0.1;
            posY += (mouseY - posY) * 0.1;
            
            if (glow) {
                glow.style.left = `${posX}px`;
                glow.style.top = `${posY}px`;
            }
            
            if (dot) {
                dot.style.left = `${mouseX}px`;
                dot.style.top = `${mouseY}px`;
            }
        }, 10);
    };

    const updateMouseCoords = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    const handleMouseEnterClickable = () => {
        if (!dot || !glow) return;
        dot.style.transform = 'translate(-50%, -50%) scale(2.5)';
        dot.style.backgroundColor = 'var(--cream)';
        glow.style.width = '500px';
        glow.style.height = '500px';
    };

    const handleMouseLeaveClickable = () => {
        if (!dot || !glow) return;
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        dot.style.backgroundColor = 'var(--brown-accent)';
        glow.style.width = '400px';
        glow.style.height = '400px';
    };

    const configureClickableHoverTriggers = () => {
        const hoverables = document.querySelectorAll('a, button, .tilt-card, input, textarea, .hamburger-menu');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', handleMouseEnterClickable);
            item.addEventListener('mouseleave', handleMouseLeaveClickable);
        });
    };

    const handleWindowLeave = () => {
        if (!glow || !dot) return;
        glow.style.opacity = '0';
        dot.style.opacity = '0';
    };

    const handleWindowEnter = () => {
        if (!glow || !dot) return;
        glow.style.opacity = '1';
        dot.style.opacity = '1';
    };

    const init = () => {
        if (!glow || !dot) return;
        
        setupTrailingInterval();
        document.addEventListener('mousemove', updateMouseCoords);
        configureClickableHoverTriggers();
        
        document.addEventListener('mouseleave', handleWindowLeave);
        document.addEventListener('mouseenter', handleWindowEnter);
    };

    return { init };
})();

// ==========================================================================
// 2. HERO HEADER TYPING CAROUSEL
// ==========================================================================
const TypewriterText = (() => {
    const targetSpan = document.getElementById('typing-text');
    const wordsList = ["Full Stack Developer", "Software Engineer", "Problem Solver"];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const performTypingStep = () => {
        if (!targetSpan) return;

        const currentFullWord = wordsList[wordIndex];
        let delay = 120;

        if (isDeleting) {
            targetSpan.textContent = currentFullWord.substring(0, charIndex - 1);
            charIndex--;
            delay = 50; // Deletion goes faster
        } else {
            targetSpan.textContent = currentFullWord.substring(0, charIndex + 1);
            charIndex++;
            delay = 120;
        }

        // Logic check: finished typing word
        if (!isDeleting && charIndex === currentFullWord.length) {
            isDeleting = true;
            delay = 2000; // Pause at typed word
        } 
        // Logic check: finished deleting word
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % wordsList.length;
            delay = 500; // Pause before starting new word
        }

        setTimeout(performTypingStep, delay);
    };

    const init = () => {
        if (targetSpan) {
            setTimeout(performTypingStep, 1000);
        }
    };

    return { init };
})();

// ==========================================================================
// 3. SCROLL REVEALS & DYNAMIC TRIGGER EVENTS
// ==========================================================================
const ScrollReveals = (() => {
    const revealSelector = '[data-reveal]';

    const animateSkillProgressBars = (cardElement) => {
        const bars = cardElement.querySelectorAll('.skill-bar-inner');
        bars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    };

    const animateCountingNumbers = () => {
        const counterFields = document.querySelectorAll('.stat-number');
        
        counterFields.forEach(counter => {
            if (counter.classList.contains('counted')) return;
            
            const targetVal = parseFloat(counter.getAttribute('data-count'));
            const animDuration = 1500; // 1.5s
            const startTimestamp = performance.now();

            const updateStep = (currentTime) => {
                const elapsed = currentTime - startTimestamp;
                const progressRatio = Math.min(elapsed / animDuration, 1);
                const currentCalculatedVal = progressRatio * targetVal;
                
                // Keep integers vs decimal matching
                if (targetVal % 1 === 0) {
                    counter.textContent = Math.floor(currentCalculatedVal);
                } else {
                    counter.textContent = currentCalculatedVal.toFixed(2);
                }
                
                if (progressRatio < 1) {
                    requestAnimationFrame(updateStep);
                } else {
                    counter.textContent = targetVal;
                    counter.classList.add('counted');
                }
            };
            
            requestAnimationFrame(updateStep);
        });
    };

    const toggleTimelineIndicators = (timelineSelector) => {
        const container = document.querySelector(timelineSelector);
        if (container) {
            container.classList.add('active');
        }
    };

    const handleIntersectionEvent = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('revealed');
                
                // Specific dynamic animations triggers
                if (element.classList.contains('skills-card')) {
                    animateSkillProgressBars(element);
                }
                if (element.classList.contains('about-content-col')) {
                    animateCountingNumbers();
                }
                if (element.classList.contains('timeline-item')) {
                    toggleTimelineIndicators('.timeline-container');
                }
                if (element.classList.contains('cert-item')) {
                    toggleTimelineIndicators('.certifications-timeline');
                }

                observer.unobserve(element); // Trigger once
            }
        });
    };

    const init = () => {
        const items = document.querySelectorAll(revealSelector);
        if (items.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observerInstance = new IntersectionObserver(handleIntersectionEvent, observerOptions);
        items.forEach(el => observerInstance.observe(el));
    };

    return { init };
})();

// ==========================================================================
// 4. 3D PARALLAX CARD TILTING MECHANICS
// ==========================================================================
const ParallaxTilts = (() => {
    const targetCards = document.querySelectorAll('.tilt-card');

    const handleMouseMoveTilt = (e, card) => {
        const boundsRect = card.getBoundingClientRect();
        
        // Mouse coordinate mapping
        const localX = e.clientX - boundsRect.left;
        const localY = e.clientY - boundsRect.top;
        
        card.style.setProperty('--mouse-x', `${localX}px`);
        card.style.setProperty('--mouse-y', `${localY}px`);
        
        const width = boundsRect.width;
        const height = boundsRect.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate degree rotations (Max 8 degrees limit)
        const rotationY = ((localX - centerX) / centerX) * 8;
        const rotationX = -((localY - centerY) / centerY) * 8;
        
        card.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const resetTiltTransform = (card) => {
        card.style.transform = 'rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    const init = () => {
        targetCards.forEach(card => {
            card.addEventListener('mousemove', (e) => handleMouseMoveTilt(e, card));
            card.addEventListener('mouseleave', () => resetTiltTransform(card));
        });
    };

    return { init };
})();

// ==========================================================================
// 5. MOCKUP LAPTOP TERMINAL TYPING SIMULATOR
// ==========================================================================
const LaptopCodeSimulator = (() => {
    const codeOutputBox = document.getElementById('live-code');
    
    const codeToSimulate = `const developer = {
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

    let charCursorIndex = 0;

    const performSimulatedTypingStep = () => {
        if (!codeOutputBox) return;

        if (charCursorIndex < codeToSimulate.length) {
            codeOutputBox.textContent += codeToSimulate.charAt(charCursorIndex);
            charCursorIndex++;
            
            // Keeps screen output scrolled down
            const scrollContainer = codeOutputBox.closest('.screen-body-code');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
            
            // Varied keyboard press speeds
            const speed = codeToSimulate.charAt(charCursorIndex - 1) === '\n' ? 250 : 25 + Math.random() * 30;
            setTimeout(performSimulatedTypingStep, speed);
        } else {
            // Loop code simulation after delay
            setTimeout(restartSimulation, 5000);
        }
    };

    const restartSimulation = () => {
        if (codeOutputBox) {
            codeOutputBox.textContent = '';
            charCursorIndex = 0;
            performSimulatedTypingStep();
        }
    };

    const init = () => {
        if (codeOutputBox) {
            setTimeout(performSimulatedTypingStep, 2000);
        }
    };

    return { init };
})();

// ==========================================================================
// INITIALIZE ANIMATION ENGINE
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    CustomCursor.init();
    TypewriterText.init();
    ScrollReveals.init();
    ParallaxTilts.init();
    LaptopCodeSimulator.init();
});
