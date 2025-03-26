"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FractalDotGridProps {
  dotSize?: number;
  dotSpacing?: number;
  dotOpacity?: number;
  waveIntensity?: number;
  waveRadius?: number;
  dotColor?: string;
  glowColor?: string;
  enableNoise?: boolean;
  noiseOpacity?: number;
  enableMouseGlow?: boolean;
  initialPerformance?: "low" | "medium" | "high";
}

const usePerformance = (initialPerformance: "low" | "medium" | "high" = "medium") => {
  const [performance, setPerformance] = useState(initialPerformance);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = globalThis.performance.now();
    let framerId: number;

    const measureFps = (time: number) => {
      frameCount++;
      if (time - lastTime > 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)));
        frameCount = 0;
        lastTime = time;
      }
      framerId = requestAnimationFrame(measureFps);
    };

    framerId = requestAnimationFrame(measureFps);

    return () => cancelAnimationFrame(framerId);
  }, []);

  useEffect(() => {
    if (fps < 30 && performance !== "low") {
      setPerformance("low");
    } else if (fps >= 30 && fps < 50 && performance !== "medium") {
      setPerformance("medium");
    } else if (fps >= 50 && performance !== "high") {
      setPerformance("high");
    }
  }, [fps, performance]);

  return { performance, fps };
};

const DotCanvas: React.FC<{
  dotSize: number;
  dotSpacing: number;
  dotOpacity: number;
  waveIntensity: number;
  waveRadius: number;
  dotColor: string;
  glowColor: string;
  performance: "low" | "medium" | "high";
  mousePos: { x: number; y: number };
}> = React.memo(({ dotSize, dotSpacing, dotOpacity, waveIntensity, waveRadius, dotColor, glowColor, performance, mousePos }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const drawDots = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    const performanceSettings = {
      low: { skip: 4 }, // Skip more rows/columns for better performance
      medium: { skip: 2 },
      high: { skip: 1 },
    };

    const skip = performanceSettings[performance].skip;

    const cols = Math.ceil(width / dotSpacing);
    const rows = Math.ceil(height / dotSpacing);

    const centerX = mousePos.x * width;
    const centerY = mousePos.y * height;

    for (let i = 0; i < cols; i += skip) {
      for (let j = 0; j < rows; j += skip) {
        const x = i * dotSpacing;
        const y = j * dotSpacing;

        const distanceX = x - centerX;
        const distanceY = y - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        let dotX = x;
        let dotY = y;

        if (distance < waveRadius) {
          const waveStrength = Math.pow(1 - distance / waveRadius, 2);
          const angle = Math.atan2(distanceY, distanceX);
          const waveOffset = Math.sin(distance * 0.05 - time * 0.005) * waveIntensity * waveStrength;
          dotX += Math.cos(angle) * waveOffset;
          dotY += Math.sin(angle) * waveOffset;

          const glowRadius = dotSize * (1 + waveStrength);
          const gradient = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, glowRadius);
          gradient.addColorStop(0, glowColor.replace("1)", `${dotOpacity * (1 + waveStrength)})`));
          gradient.addColorStop(1, glowColor.replace("1)", "0)"));
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = dotColor.replace("1)", `${dotOpacity})`);
        }

        ctx.beginPath();
        ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [dotSize, dotSpacing, dotOpacity, waveIntensity, waveRadius, dotColor, glowColor, performance, mousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime > 16) {
        drawDots(ctx, time);
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawDots]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-gray-900" style={{ mixBlendMode: "normal" }} />;
});

DotCanvas.displayName = "DotCanvas";

export function FractalDotGrid({
  dotSize = 5, // Slightly larger dots
  dotSpacing = 40, // Increased spacing (reduces total dots)
  dotOpacity = 0.5,
  waveIntensity = 15, // Less intense wave effect
  waveRadius = 150, // Smaller interaction radius
  dotColor = "rgba(255, 255, 255, 1)",
  glowColor = "rgba(100, 100, 255, 1)",
  enableNoise = true,
  noiseOpacity = 0.03,
  enableMouseGlow = true,
  initialPerformance = "medium",
}: FractalDotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { performance } = usePerformance(initialPerformance);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = containerRef.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 };
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <AnimatePresence>
      <motion.div ref={containerRef} key="fractal-dot-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0 overflow-hidden w-full h-full">
        <DotCanvas dotSize={dotSize} dotSpacing={dotSpacing} dotOpacity={dotOpacity} waveIntensity={waveIntensity} waveRadius={waveRadius} dotColor={dotColor} glowColor={glowColor} performance={performance} mousePos={mousePos} />
      </motion.div>
    </AnimatePresence>
  );
}

export default FractalDotGrid;
