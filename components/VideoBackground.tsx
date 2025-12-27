"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  src?: string;
  poster?: string;
  className?: string;
};

export default function VideoBackground({
  src = "/video/spectra-bg.mp4",
  poster = "/poster.jpg",
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        // Autoplay blocked — silent fail
      }
    };

    playVideo();

    // Retry on user interaction (mobile fix)
    const retry = () => playVideo();
    document.addEventListener("click", retry, { once: true });
    document.addEventListener("touchstart", retry, { once: true });

    return () => {
      document.removeEventListener("click", retry);
      document.removeEventListener("touchstart", retry);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={`fixed inset-0 w-full h-full object-cover -z-20 pointer-events-none ${className}`}
    >
      Your browser does not support video.
    </video>
  );
}