/* 
   ==========================================================================
   PAVITHRA J - PORTFOLIO CANVAS PARTICLES SYSTEM
   ==========================================================================
*/

class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleColor = 'rgba(243, 228, 201, 0.25)'; // Light cream low opacity
        this.lineColor = 'rgba(211, 212, 192, 0.08)'; // Sage green ultra-low opacity
        this.accentColor = 'rgba(139, 94, 60, 0.3)'; // Brown accent for mouse lines
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }

    createParticles() {
        this.particles = [];
        // Scale particle count based on canvas width
        const density = Math.floor((this.canvas.width * this.canvas.height) / 11000);
        const count = Math.min(Math.max(density, 30), 120); // Bounds check [30, 120]
        
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 2 + 1; // 1 to 3px
            const x = Math.random() * (this.canvas.width - size * 2) + size;
            const y = Math.random() * (this.canvas.height - size * 2) + size;
            
            // Random velocities
            const directionX = (Math.random() * 0.8) - 0.4;
            const directionY = (Math.random() * 0.8) - 0.4;
            
            this.particles.push({
                x: x,
                y: y,
                vx: directionX,
                vy: directionY,
                size: size
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        const parent = this.canvas.parentElement;
        parent.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        parent.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Loop through and update particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Move particle
            p.x += p.vx;
            p.y += p.vy;
            
            // Wall collisions (bounce)
            if (p.x < 0 || p.x > this.canvas.width) p.vx = -p.vx;
            if (p.y < 0 || p.y > this.canvas.height) p.vy = -p.vy;
            
            // Mouse interact (push away slightly)
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += (dx / dist) * force * 1.5;
                    p.y += (dy / dist) * force * 1.5;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.particleColor;
            this.ctx.fill();
        }

        // Draw connections
        this.drawConnections();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const maxDist = 110;
                
                if (dist < maxDist) {
                    const alpha = (maxDist - dist) / maxDist * 0.15;
                    this.ctx.strokeStyle = `rgba(211, 212, 192, ${alpha})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
            
            // Mouse interactions with particles (connect particles to mouse)
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const p = this.particles[i];
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.mouse.radius) {
                    const alpha = (this.mouse.radius - dist) / this.mouse.radius * 0.2;
                    this.ctx.strokeStyle = `rgba(139, 94, 60, ${alpha})`; // Accent color lines to mouse
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Instantiate particles when window loads
window.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork('hero-particles');
});
