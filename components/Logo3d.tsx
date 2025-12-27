"use client";

import React, { useEffect } from "react";

export default function Logo3D() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!customElements.get("model-viewer")) {
      import("@google/model-viewer");
    }
  }, []);

  // Use React.createElement to avoid TypeScript JSX error for custom elements
  return React.createElement("model-viewer", {
    src: "/models/logo.glb",
    ar: true,
    "ar-modes": "webxr scene-viewer quick-look",
    "auto-rotate": true,
    "auto-rotate-delay": "0",
    "rotation-per-second": "30deg",
    "camera-controls": true,
    "touch-action": "pan-y",
    exposure: "1.2",
    "shadow-intensity": "1",
    "shadow-softness": "0.8",
    "aria-label": "SPECTRA 3D Logo",
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 20,
      pointerEvents: "auto",
      background: "transparent",
    },
    children: React.createElement("button", {
      slot: "ar-button",
      style: {
        position: "absolute",
        bottom: "8%",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "16px 40px",
        background: "rgba(255,255,255,0.95)",
        color: "black",
        border: "none",
        borderRadius: "50px",
        fontSize: "1.4rem",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
        zIndex: 100,
      },
      children: "👁️ View in Your Space"
    })
  });
}