import React, { useEffect, useRef } from "react";

export default function CalmingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Dynamic high-end soft energy particles mimicking fog and bio-motion
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      pulseDirection: number;
    }

    const particles: Particle[] = [];
    const particleCount = 28;

    const colors = [
      "rgba(56, 189, 248, ", // Cyan glow
      "rgba(192, 132, 252, ", // Muted lavender
      "rgba(252, 250, 246, ", // Warm ivory/fog
      "rgba(20, 184, 166, "  // Muted emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 80 + 40, // Huge soft circular glows
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        color: colors[i % colors.length],
        alpha: Math.random() * 0.08 + 0.03,
        pulseDirection: Math.random() > 0.5 ? 1 : -1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft moonlight background color-mix vignette
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      gradient.addColorStop(0, "rgba(9, 12, 24, 0.5)");
      gradient.addColorStop(0.5, "rgba(5, 7, 14, 0.9)");
      gradient.addColorStop(1, "#030408");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // Draw particle layers
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce from border
        if (p.x < -p.size) p.x = width + p.size;
        if (p.x > width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = height + p.size;
        if (p.y > height + p.size) p.y = -p.size;

        // Breathe the particle size and opacity
        p.alpha += p.pulseDirection * 0.0004;
        if (p.alpha > 0.15) {
          p.pulseDirection = -1;
        } else if (p.alpha < 0.03) {
          p.pulseDirection = 1;
        }

        // Slight slide reaction to user's cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let offsetX = 0;
        let offsetY = 0;

        if (dist < 400) {
          const force = (400 - dist) / 400;
          offsetX = -dx * force * 0.01;
          offsetY = -dy * force * 0.01;
        }

        // Draw soft orbital radial glow
        const radGrad = ctx.createRadialGradient(
          p.x + offsetX,
          p.y + offsetY,
          0,
          p.x + offsetX,
          p.y + offsetY,
          p.size
        );
        radGrad.addColorStop(0, `${p.color}${p.alpha})`);
        radGrad.addColorStop(0.5, `${p.color}${p.alpha * 0.4})`);
        radGrad.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x + offsetX, p.y + offsetY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle fog grid lines in background for linear alignment metaphor
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const step = 200;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      id="calming_background_particles"
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none"
    />
  );
}
