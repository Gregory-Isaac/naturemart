import React, { useEffect, useState } from 'react';
import './MagicParticles.css';

/**
 * Enchanted Magic Particles Component
 * Creates floating, sparkling particles that follow the mouse and add magical ambiance
 * This feature enhances the entire website with enchanting visual effects
 */
export default function MagicParticles() {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = React.useRef(null);

  // Create floating particles on mount
  useEffect(() => {
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      type: Math.random() > 0.7 ? 'sparkle' : 'glow',
      duration: Math.random() * 3000 + 2000,
    }));
    setParticles(initialParticles);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId;

    const animate = () => {
      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(8, 8, 7, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let { x, y, vx, vy } = particle;

          // Move towards mouse with gravity
          const dx = mousePos.x - x;
          const dy = mousePos.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            vx += (dx / distance) * 0.01;
            vy += (dy / distance) * 0.01;
          }

          // Apply gravity
          vy += 0.02;

          x += vx;
          y += vy;

          // Bounce off edges
          if (x < 0 || x > canvas.width) vx *= -1;
          if (y < 0 || y > canvas.height) vy *= -1;

          x = Math.max(0, Math.min(canvas.width, x));
          y = Math.max(0, Math.min(canvas.height, y));

          return { ...particle, x, y, vx, vy };
        })
      );

      // Draw particles
      particles.forEach((particle) => {
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );

        if (particle.type === 'sparkle') {
          gradient.addColorStop(0, `rgba(167, 139, 250, ${particle.opacity})`);
          gradient.addColorStop(1, `rgba(167, 139, 250, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(53, 208, 127, ${particle.opacity * 0.8})`);
          gradient.addColorStop(1, `rgba(53, 208, 127, 0)`);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw sparkle point
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fillRect(particle.x - 0.5, particle.y - 0.5, 1, 1);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [particles, mousePos]);

  return <canvas ref={canvasRef} className="magic-particles-canvas" />;
}
