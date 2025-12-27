"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ShaderCanvas from "./ShaderCanvas";

type Props = {
  seconds?: number;
  fps?: number;
};

function pickSupportedMime(): string {
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) return c;
  }
  return "video/webm";
}

export default function ShaderCanvasRecorder({ seconds = 10, fps = 60 }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const stopTimerRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setReady(true);
    return () => {
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
      if (lastUrl) URL.revokeObjectURL(lastUrl);
    };
  }, [lastUrl]);

  const findCanvas = useCallback((): HTMLCanvasElement | null => {
    const host = hostRef.current;
    if (!host) return null;
    return host.querySelector("canvas");
  }, []);

  const stop = useCallback(() => {
    try {
      recorderRef.current?.stop();
    } catch {}
  }, []);

  const start10s = useCallback(async () => {
    setErr(null);

    const canvas = findCanvas();
    if (!canvas) {
      setErr("No canvas found. ShaderCanvas must render a <canvas> inside the host.");
      return;
    }

    if (recording) return;

    try {
      chunksRef.current = [];

      const stream = canvas.captureStream(fps);

      const mimeType = pickSupportedMime();
      const rec = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 12_000_000,
      });

      recorderRef.current = rec;

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      rec.onerror = () => {
        setErr("MediaRecorder error. Try a different browser or lower fps.");
        setRecording(false);
      };

      rec.onstop = () => {
        setRecording(false);

        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "video/webm" });
        const url = URL.createObjectURL(blob);

        if (lastUrl) URL.revokeObjectURL(lastUrl);
        setLastUrl(url);

        const a = document.createElement("a");
        a.href = url;
        a.download = "shadercanvas-10s.webm";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };

      setRecording(true);
      rec.start(250);

      stopTimerRef.current = window.setTimeout(() => {
        stop();
      }, seconds * 1000);
    } catch (e: any) {
      setRecording(false);
      setErr(e?.message ? String(e.message) : "Failed to start recording.");
    }
  }, [findCanvas, fps, lastUrl, recording, seconds, stop]);

  if (!ready) return null;

  return (
    <div className="w-full h-screen relative bg-black">
      <div ref={hostRef} className="absolute inset-0">
        <ShaderCanvas />
      </div>

      <div className="absolute left-4 bottom-4 flex flex-col gap-2 z-50">
        <button
          onClick={start10s}
          disabled={recording}
          className="px-4 py-2 border border-white text-white text-sm bg-black/40"
        >
          {recording ? "recording..." : `record ${seconds}s`}
        </button>

        <button
          onClick={stop}
          disabled={!recording}
          className="px-4 py-2 border border-white text-white text-sm bg-black/40"
        >
          stop
        </button>

        {err && <div className="text-xs text-red-400 max-w-xs">{err}</div>}
      </div>
    </div>
  );
}
