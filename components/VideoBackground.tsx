"use client";

import React, { useEffect, useRef } from "react";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force all required attributes
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto";

    const attemptPlay = () => {
      video.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
      });
    };

    // Try immediately
    attemptPlay();

    // Retry on any user interaction (critical for iOS/Android)
    const handleInteraction = () => {
      attemptPlay();
      // Remove listeners after first interaction (no need to keep)
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("keydown", handleInteraction); // Keyboard too

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="/video/spectra-bg.mp4"
      poster="/poster.jpg"
      className="fixed inset-0 w-full h-full object-cover -z-30 pointer-events-none"
      style={{ background: "black" }}
    >
      Your browser does not support the video tag.
    </video>
  );
}