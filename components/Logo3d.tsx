"use client";

import React, { useEffect } from "react";

export default function Logo3D() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!customElements.get("model-viewer")) {
      import("@google/model-viewer").catch(() => {
        // ignore, prevents crash in case of race
      });
    }
  }, []);

  return (
    <model-viewer
      src="/models/logo.glb"
      ar
      auto-rotate
      auto-rotate-delay="0"
      auto-rotate-speed="10"
      camera-controls
      exposure="1"
      aria-label="spectra 3d logo"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1
      }}
    />
  );
}
