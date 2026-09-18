"use client";

import "@google/model-viewer";

import { useEffect, useRef, useState } from "react";

export function CarModelViewer({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    setStatus("loading");
    setProgress(0);

    const viewer = document.createElement("model-viewer");
    viewer.setAttribute("src", src);
    viewer.setAttribute("alt", alt);
    viewer.setAttribute("camera-controls", "");
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("rotation-per-second", "24deg");
    viewer.setAttribute("shadow-intensity", "1");
    viewer.setAttribute("shadow-softness", "0.8");
    viewer.classList.add("model-preview");

    const onProgress = (event: Event) => {
      const detail = event as CustomEvent<{ totalProgress: number }>;
      setProgress(Math.round(detail.detail.totalProgress * 100));
    };
    const onLoad = () => setStatus("ready");
    const onError = () => setStatus("error");

    viewer.addEventListener("progress", onProgress);
    viewer.addEventListener("load", onLoad);
    viewer.addEventListener("error", onError);
    container.appendChild(viewer);

    return () => {
      viewer.removeEventListener("progress", onProgress);
      viewer.removeEventListener("load", onLoad);
      viewer.removeEventListener("error", onError);
      container.removeChild(viewer);
    };
  }, [src, alt]);

  return (
    <div ref={containerRef} className="model-preview-host">
      {status === "loading" ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-accent" />
          <p className="text-xs text-slate-500">
            Chargement du modèle 3D... {progress}%
          </p>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}
      {status === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
          Aperçu 3D indisponible pour le moment.
        </div>
      ) : null}
    </div>
  );
}