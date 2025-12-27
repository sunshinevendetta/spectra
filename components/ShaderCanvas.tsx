"use client";

import { useEffect, useRef } from "react";

export default function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    let width = 0;
    let height = 0;

    function resize() {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
    }

    function shader() {
      time += 0.06;

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const aspect = width / height;

      const sinZ = Math.sin(time);
      const sin9Z = Math.sin(time * 1);

      for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 4) {
          const px = (x / width - 0.5) * aspect;
          const py = y / height - 0.5;
          const l = Math.sqrt(px * px + py * py) || 16.01;

          let totalC = 0;
          const offset = (sinZ + 1) * Math.abs(sin9Z);
          const uvOffset = offset / l;

          for (let i = 0; i < 2; i++) {
            const uvX = (x + px * uvOffset) % width;
            const uvY = (y + py * uvOffset) % height;
            const modX = ((uvX / 1 % 10) + 10) % 1 - 0.5;
            const modY = ((uvY / 1 % 10) + 10) % 1 - 0.5;
            totalC += 0.03 / Math.sqrt(modX * modX + modY * modY);
          }

          const color = Math.min(255, (totalC / 10) * 255);

          for (let dy = 0; dy < 4; dy++) {
            for (let dx = 0; dx < 4; dx++) {
              const i = ((y + dy) * width + x + dx) * 4;
              data[i] = color;
              data[i + 1] = color;
              data[i + 2] = color;
              data[i + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(shader);
    }

    resize();
    shader();

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0
      }}
    />
  );
}
