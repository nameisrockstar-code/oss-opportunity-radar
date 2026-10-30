'use client';

import { useEffect, useRef } from 'react';

type GridDot = {
  x: number;
  y: number;
  direction: 'horizontal' | 'vertical';
  speed: number;
  size: number;
  opacity: number;
  targetX: number;
  targetY: number;
  trail: { x: number; y: number }[];
};

export function GridPulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gridSize = 64;
    const colors = ['rgba(255, 255, 255, 0.5)', 'rgba(242, 138, 69, 0.55)'];
    let width = 0;
    let height = 0;
    let dots: GridDot[] = [];
    let animationId = 0;
    let lastTime = 0;
    const frameInterval = 1000 / 30;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const snapToGrid = (value: number) => Math.round(value / gridSize) * gridSize;

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const dotCount = width < 640 ? 12 : 24;
      dots = Array.from({ length: dotCount }, () => {
        const x = snapToGrid(Math.random() * width);
        const y = snapToGrid(Math.random() * height);
        return {
          x,
          y,
          direction: Math.random() > 0.5 ? 'horizontal' : 'vertical',
          speed: Math.random() * 4 + 3,
          size: Math.random() * 1.4 + 1.4,
          opacity: Math.random() * 0.4 + 0.25,
          targetX: x,
          targetY: y,
          trail: [],
        };
      });
    };

    const animate = (currentTime: number) => {
      animationId = window.requestAnimationFrame(animate);
      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      lastTime = currentTime - (deltaTime % frameInterval);
      const stepScale = Math.min(deltaTime / frameInterval, 2);

      context.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        dot.trail.unshift({ x: dot.x, y: dot.y });
        if (dot.trail.length > 10) dot.trail.pop();

        if (dot.direction === 'horizontal') {
          if (Math.abs(dot.x - dot.targetX) < dot.speed * stepScale) {
            dot.x = dot.targetX;
            if (Math.random() > 0.72) {
              dot.direction = 'vertical';
              const steps = Math.floor(Math.random() * 5) + 1;
              dot.targetY = dot.y + (Math.random() > 0.5 ? 1 : -1) * steps * gridSize;
            } else {
              const steps = Math.floor(Math.random() * 8) + 2;
              dot.targetX = dot.x + (Math.random() > 0.5 ? 1 : -1) * steps * gridSize;
            }
          } else {
            dot.x += dot.x < dot.targetX ? dot.speed * stepScale : -dot.speed * stepScale;
          }
        } else if (Math.abs(dot.y - dot.targetY) < dot.speed * stepScale) {
          dot.y = dot.targetY;
          if (Math.random() > 0.72) {
            dot.direction = 'horizontal';
            const steps = Math.floor(Math.random() * 8) + 2;
            dot.targetX = dot.x + (Math.random() > 0.5 ? 1 : -1) * steps * gridSize;
          } else {
            const steps = Math.floor(Math.random() * 5) + 1;
            dot.targetY = dot.y + (Math.random() > 0.5 ? 1 : -1) * steps * gridSize;
          }
        } else {
          dot.y += dot.y < dot.targetY ? dot.speed * stepScale : -dot.speed * stepScale;
        }

        if (dot.x < -gridSize) {
          dot.x = width + gridSize;
          dot.targetX = dot.x;
          dot.trail = [];
        } else if (dot.x > width + gridSize) {
          dot.x = -gridSize;
          dot.targetX = dot.x;
          dot.trail = [];
        }
        if (dot.y < -gridSize) {
          dot.y = height + gridSize;
          dot.targetY = dot.y;
          dot.trail = [];
        } else if (dot.y > height + gridSize) {
          dot.y = -gridSize;
          dot.targetY = dot.y;
          dot.trail = [];
        }

        if (dot.trail.length > 1) {
          context.beginPath();
          context.moveTo(dot.x, dot.y);
          dot.trail.forEach((point) => context.lineTo(point.x, point.y));
          context.strokeStyle = colors[dot.opacity > 0.48 ? 1 : 0];
          context.globalAlpha = dot.opacity * 0.34;
          context.lineWidth = dot.size;
          context.lineCap = 'round';
          context.stroke();
        }

        context.beginPath();
        context.arc(dot.x, dot.y, dot.size * 4, 0, Math.PI * 2);
        context.fillStyle = colors[dot.opacity > 0.48 ? 1 : 0];
        context.globalAlpha = dot.opacity * 0.13;
        context.fill();

        context.beginPath();
        context.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        context.fillStyle = colors[dot.opacity > 0.48 ? 1 : 0];
        context.globalAlpha = dot.opacity;
        context.fill();
      });

      context.globalAlpha = 1;
    };

    resizeCanvas();
    animationId = window.requestAnimationFrame(animate);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="grid-pulse-canvas" aria-hidden="true" />;
}
