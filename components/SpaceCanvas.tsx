"use client";

import React, { useEffect, useRef } from "react";

interface SpaceCanvasProps {
  cursorPos: { x: number; y: number };
  warpTrigger?: number;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  isGreen: boolean;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const SpaceCanvas: React.FC<SpaceCanvasProps> = ({ cursorPos, warpTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const dustRef = useRef<DustParticle[]>([]);
  const warpFactorRef = useRef<number>(0);
  const animFrameIdRef = useRef<number>(0);
  const prevWarpTriggerRef = useRef<number>(warpTrigger);

  useEffect(() => {
    if (warpTrigger > 0 && warpTrigger !== prevWarpTriggerRef.current) {
      prevWarpTriggerRef.current = warpTrigger;
      warpFactorRef.current = 1.0;
    }
  }, [warpTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const initParticles = () => {
      const numStars = Math.min(220, Math.floor((width * height) / 5000));
      const stars: Star[] = [];
      for (let i = 0; i < numStars; i++) {
        const isGreen = Math.random() < 0.14;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.8 + 0.2,
          size: Math.random() * 1.6 + 0.4,
          baseAlpha: Math.random() * 0.6 + 0.2,
          alpha: Math.random() * 0.6 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          isGreen,
        });
      }
      starsRef.current = stars;

      const numDust = 42;
      const dust: DustParticle[] = [];
      for (let i = 0; i < numDust; i++) {
        dust.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35 - 0.15,
          size: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.5 + 0.15,
          color: Math.random() > 0.3 ? "#00ff66" : "#39ff88",
        });
      }
      dustRef.current = dust;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    initParticles();

    let tick = 0;
    const render = () => {
      tick++;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      if (warpFactorRef.current > 0.01) {
        warpFactorRef.current *= 0.94;
      } else {
        warpFactorRef.current = 0;
      }

      const warp = warpFactorRef.current;
      const targetParallaxX = (cursorPos.x - width / 2) * 0.04;
      const targetParallaxY = (cursorPos.y - height / 2) * 0.04;

      // Center radial ambiance
      const grad = ctx.createRadialGradient(
        width / 2 + targetParallaxX * 0.2,
        height / 2 + targetParallaxY * 0.2,
        40,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65
      );
      grad.addColorStop(0, "rgba(0, 255, 102, 0.038)");
      grad.addColorStop(0.5, "rgba(0, 30, 15, 0.015)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Stars
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.alpha = s.baseAlpha + Math.sin(tick * s.twinkleSpeed) * 0.25;
        const currentAlpha = Math.max(0.1, Math.min(1, s.alpha + warp * 0.5));

        const px = s.x - targetParallaxX * s.z;
        const py = s.y - targetParallaxY * s.z;

        if (warp > 0.05) {
          const dx = px - width / 2;
          const dy = py - height / 2;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + dx * warp * 0.25, py + dy * warp * 0.25);
          ctx.strokeStyle = s.isGreen
            ? `rgba(0, 255, 102, ${currentAlpha})`
            : `rgba(220, 255, 235, ${currentAlpha})`;
          ctx.lineWidth = s.size * (1 + warp);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, s.size * s.z, 0, Math.PI * 2);
          ctx.fillStyle = s.isGreen
            ? `rgba(0, 255, 102, ${currentAlpha})`
            : `rgba(230, 245, 235, ${currentAlpha})`;
          ctx.fill();
        }
      }

      // Dust particles
      const dust = dustRef.current;
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        d.x += d.vx;
        d.y += d.vy;

        const mouseDx = d.x - cursorPos.x;
        const mouseDy = d.y - cursorPos.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        if (mouseDist < 140 && mouseDist > 0) {
          const force = ((140 - mouseDist) / 140) * 0.8;
          d.x += (mouseDx / mouseDist) * force;
          d.y += (mouseDy / mouseDist) * force;
        }

        if (d.x < -10) d.x = width + 10;
        if (d.x > width + 10) d.x = -10;
        if (d.y < -10) d.y = height + 10;
        if (d.y > height + 10) d.y = -10;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.alpha;
        ctx.shadowColor = "#00ff66";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [cursorPos]);

  return (
    <canvas
      ref={canvasRef}
      className="space-container pointer-events-none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
};
