"use client";

import { useRef, useState, useCallback } from "react";

export interface UseBadgeExportReturn {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<HTMLDivElement | null>;
  isCopied: boolean;
  copyUrl: (url: string) => Promise<boolean>;
  downloadHighResPng: (staffId: string) => boolean;
  downloadVectorSvg: (staffId: string) => boolean;
}

export function useBadgeExport(): UseBadgeExportReturn {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyUrl = useCallback(async (url: string): Promise<boolean> => {
    if (!url) return false;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);

  const downloadHighResPng = useCallback((staffId: string): boolean => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas || !staffId) return false;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `cyberdex-${staffId.toLowerCase()}-badge-qr-2048px.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }, []);

  const downloadVectorSvg = useCallback((staffId: string): boolean => {
    const svgElement = svgRef.current?.querySelector("svg");
    if (!svgElement || !staffId) return false;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cyberdex-${staffId.toLowerCase()}-badge-qr-vector.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  }, []);

  return {
    canvasRef,
    svgRef,
    isCopied,
    copyUrl,
    downloadHighResPng,
    downloadVectorSvg,
  };
}
