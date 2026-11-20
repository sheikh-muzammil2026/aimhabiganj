'use client';

import { useEffect, useRef } from 'react';

export default function CursorTrail() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        const particles = [];
        const colors = ['#0D47A1', '#2196F3', '#90CAF9', '#1976D2', '#64B5F6'];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 4 + 2;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.015;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.size *= 0.96;
                this.alpha -= this.decay;
            }

            draw(context) {
                context.save();
                context.globalAlpha = Math.max(this.alpha, 0);
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.shadowBlur = 10;
                context.shadowColor = this.color;
                context.fillStyle = this.color;
                context.fill();
                context.restore();
            }
        }

        const handleMouseMove = (e) => {
            for (let i = 0; i < 3; i++) {
                particles.push(new Particle(e.clientX, e.clientY));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(ctx);

                if (particles[i].alpha <= 0 || particles[i].size <= 0.3) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    );
}