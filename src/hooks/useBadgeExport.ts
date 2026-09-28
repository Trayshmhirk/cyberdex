"use client";

import { useRef, useState, useCallback } from "react";
import { StaffProfile } from "@/data/staff";

export interface UseBadgeExportReturn {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<HTMLDivElement | null>;
  isCopied: boolean;
  isExporting: boolean;
  isExportingFront: boolean;
  isExportingBack: boolean;
  copyUrl: (url: string) => Promise<boolean>;
  downloadCardFront: (staff: StaffProfile) => Promise<boolean>;
  downloadCardBack: (staff: StaffProfile) => Promise<boolean>;
  downloadHighResPng: (staffId: string) => boolean;
  downloadVectorSvg: (staffId: string) => boolean;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function useBadgeExport(): UseBadgeExportReturn {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isExportingFront, setIsExportingFront] = useState<boolean>(false);
  const [isExportingBack, setIsExportingBack] = useState<boolean>(false);
  const isExporting = isExportingFront || isExportingBack;

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

  const downloadCardFront = useCallback(
    async (staff: StaffProfile): Promise<boolean> => {
      if (!staff) return false;
      setIsExportingFront(true);
      try {
        const width = 1200;
        const height = 1900;
        const scale = 2; // Ultra-HD 2400 x 3800 px (711 DPI industrial grade)
        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return false;

        // Ensure all web fonts are loaded for vector typographic clarity
        if (typeof document !== "undefined" && document.fonts) {
          await document.fonts.ready;
        }

        // Enable 2x scaling for ultra-high resolution rasterization
        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Base card surface (pure white with rounded clip)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, 48);
        ctx.fill();

        // Card border hairline
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Load and draw official Logo at Top (centered, clean, no punch hole)
        try {
          const logo = await loadImage("/cyberdex-logo-main.png");
          const logoWidth = 360;
          const logoHeight = (logo.height / logo.width) * logoWidth;
          ctx.drawImage(
            logo,
            width / 2 - logoWidth / 2,
            110,
            logoWidth,
            logoHeight
          );
        } catch {
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 44px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("CYBERDEX", width / 2, 190);
        }

        // Circular Employee Portrait
        const photoY = 620;
        const photoRadius = 180;

        // Photo Outer Accent Ring
        ctx.beginPath();
        ctx.arc(width / 2, photoY, photoRadius + 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(29, 78, 216, 0.15)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(width / 2, photoY, photoRadius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 8;
        ctx.stroke();

        try {
          const photo = await loadImage(staff.avatarUrl);
          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, photoY, photoRadius, 0, Math.PI * 2);
          ctx.clip();

          // True object-fit: cover center-crop to prevent vertical stretching/shrinking
          const cropSize = Math.min(photo.width, photo.height);
          const sx = (photo.width - cropSize) / 2;
          const sy = (photo.height - cropSize) / 2;

          ctx.drawImage(
            photo,
            sx,
            sy,
            cropSize,
            cropSize,
            width / 2 - photoRadius,
            photoY - photoRadius,
            photoRadius * 2,
            photoRadius * 2
          );
          ctx.restore();
        } catch {
          ctx.beginPath();
          ctx.arc(width / 2, photoY, photoRadius, 0, Math.PI * 2);
          ctx.fillStyle = "#e2e8f0";
          ctx.fill();
        }

        // Employee Full Name
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 52px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(staff.fullName, width / 2, 935);

        // Employee Position
        ctx.fillStyle = "#1d4ed8";
        ctx.font = "600 32px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(staff.position, width / 2, 1010);

        // Verified Status Badge Pill
        const pillWidth = 500;
        const pillHeight = 60;
        const pillY = 1075;
        ctx.fillStyle = "#ecfdf5";
        ctx.strokeStyle = "#a7f3d0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(
          width / 2 - pillWidth / 2,
          pillY,
          pillWidth,
          pillHeight,
          30
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#047857";
        ctx.font = "bold 22px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("● ACTIVE — VERIFIED STAFF", width / 2, pillY + 39);

        // Metadata Card Box
        const metaBoxY = 1220;
        const metaBoxWidth = 920;
        const metaBoxHeight = staff.email ? 310 : 210;
        ctx.fillStyle = "#f8fafc";
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(
          width / 2 - metaBoxWidth / 2,
          metaBoxY,
          metaBoxWidth,
          metaBoxHeight,
          24
        );
        ctx.fill();
        ctx.stroke();

        // Staff ID Row
        ctx.fillStyle = "#64748b";
        ctx.font = "600 24px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(
          "Staff ID:",
          width / 2 - metaBoxWidth / 2 + 50,
          metaBoxY + 64
        );

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 28px 'JetBrains Mono', monospace";
        ctx.textAlign = "right";
        ctx.fillText(
          staff.id,
          width / 2 + metaBoxWidth / 2 - 50,
          metaBoxY + 64
        );

        // Divider
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - metaBoxWidth / 2 + 40, metaBoxY + 112);
        ctx.lineTo(width / 2 + metaBoxWidth / 2 - 40, metaBoxY + 112);
        ctx.stroke();

        // Email or Certifications Row
        if (staff.email) {
          ctx.fillStyle = "#64748b";
          ctx.font = "600 24px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(
            "Email:",
            width / 2 - metaBoxWidth / 2 + 50,
            metaBoxY + 160
          );

          ctx.fillStyle = "#0f172a";
          ctx.font = "600 24px 'JetBrains Mono', monospace";
          ctx.textAlign = "right";
          ctx.fillText(
            staff.email,
            width / 2 + metaBoxWidth / 2 - 50,
            metaBoxY + 160
          );

          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(width / 2 - metaBoxWidth / 2 + 40, metaBoxY + 208);
          ctx.lineTo(width / 2 + metaBoxWidth / 2 - 40, metaBoxY + 208);
          ctx.stroke();

          ctx.fillStyle = "#64748b";
          ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(
            "Registry Portal:",
            width / 2 - metaBoxWidth / 2 + 50,
            metaBoxY + 256
          );

          ctx.fillStyle = "#1d4ed8";
          ctx.font = "600 22px 'JetBrains Mono', monospace";
          ctx.textAlign = "right";
          ctx.fillText(
            "verify.cyberdex.com.ng",
            width / 2 + metaBoxWidth / 2 - 50,
            metaBoxY + 256
          );
        } else if (staff.certifications && staff.certifications.length > 0) {
          ctx.fillStyle = "#64748b";
          ctx.font = "600 24px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(
            "Credentials:",
            width / 2 - metaBoxWidth / 2 + 50,
            metaBoxY + 160
          );

          ctx.fillStyle = "#1d4ed8";
          ctx.font = "bold 24px 'JetBrains Mono', monospace";
          ctx.textAlign = "right";
          ctx.fillText(
            staff.certifications[0],
            width / 2 + metaBoxWidth / 2 - 50,
            metaBoxY + 160
          );
        }

        // Authorized Signature Block (centered, ending ~42px above footer)
        try {
          const sig = await loadImage("/authorize-signature.png");
          const sigWidth = 270;
          const sigHeight = (sig.height / sig.width) * sigWidth;
          ctx.drawImage(
            sig,
            width / 2 - sigWidth / 2,
            1580,
            sigWidth,
            sigHeight
          );
        } catch (sigErr) {
          console.warn("Failed to load authorized signature:", sigErr);
        }

        // Signature Rule Line
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 160, 1705);
        ctx.lineTo(width / 2 + 160, 1705);
        ctx.stroke();

        // Signature Labels (bold, high contrast, +2px)
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Authorized Signature", width / 2, 1740);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 28px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("CEO", width / 2, 1775);

        // Bottom Accent Strip (matching preview card footer)
        const bottomGrad = ctx.createLinearGradient(
          0,
          height - 120,
          width,
          height
        );
        bottomGrad.addColorStop(0, "#1d4ed8");
        bottomGrad.addColorStop(0.5, "#0284c7");
        bottomGrad.addColorStop(1, "#d97706");
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, height - 100, width, 100);

        // Footer Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("www.cyberdex.com.ng", width / 2, height - 42);

        // Download result
        const dataUrl = canvas.toDataURL("image/png");
        triggerDownload(
          dataUrl,
          `cyberdex-${staff.id.toLowerCase()}-badge-front-600dpi.png`
        );
        return true;
      } catch (err) {
        console.error("Failed to generate front badge:", err);
        return false;
      } finally {
        setIsExportingFront(false);
      }
    },
    []
  );

  const downloadCardBack = useCallback(
    async (staff: StaffProfile): Promise<boolean> => {
      if (!staff) return false;
      setIsExportingBack(true);
      try {
        const width = 1200;
        const height = 1900;
        const scale = 2; // Ultra-HD 2400 x 3800 px (711 DPI industrial grade)
        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return false;

        // Ensure all web fonts are loaded for vector typographic clarity
        if (typeof document !== "undefined" && document.fonts) {
          await document.fonts.ready;
        }

        // Enable 2x scaling for ultra-high resolution rasterization
        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Base card surface (pure white with rounded clip)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, 48);
        ctx.fill();

        // Card border hairline
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Load and draw official Logo at Top (identical position and dimensions to Front Card)
        try {
          const logo = await loadImage("/cyberdex-logo-main.png");
          const logoWidth = 360;
          const logoHeight = (logo.height / logo.width) * logoWidth;
          const logoY = 110;
          ctx.drawImage(
            logo,
            width / 2 - logoWidth / 2,
            logoY,
            logoWidth,
            logoHeight
          );
        } catch {
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 44px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("CYBERDEX", width / 2, 190);
        }

        // Terms & Conditions Title
        ctx.fillStyle = "#d97706";
        ctx.font = "bold 32px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("TERMS & CONDITIONS", width / 2, 490);

        // Terms Bullet Points
        const terms = [
          "This ID card is the official property of Cyberdex.",
          "Must be worn at all times while on company premises.",
          "This credential pass is strictly non-transferable.",
          "If found, please return to Cyberdex or scan below.",
        ];

        ctx.fillStyle = "#334155";
        ctx.font = "500 24px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "left";
        const termsX = width / 2 - 440;
        let termsY = 560;
        for (const term of terms) {
          ctx.fillStyle = "#d97706";
          ctx.beginPath();
          ctx.arc(termsX + 10, termsY - 8, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#334155";
          ctx.fillText(term, termsX + 35, termsY);
          termsY += 54;
        }

        // High-Contrast QR Code Section (Centered, Expanded QR with reduced container padding)
        const qrBoxY = 820;
        const qrBoxSize = 560;
        const qrPadding = 16;
        const qrDrawSize = qrBoxSize - qrPadding * 2; // 528px

        ctx.fillStyle = "#f8fafc";
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(
          width / 2 - qrBoxSize / 2,
          qrBoxY,
          qrBoxSize,
          qrBoxSize,
          28
        );
        ctx.fill();
        ctx.stroke();

        // Draw High-Res QR from offscreen canvasRef
        const qrCanvas = canvasRef.current?.querySelector("canvas");
        if (qrCanvas) {
          ctx.drawImage(
            qrCanvas,
            width / 2 - qrDrawSize / 2,
            qrBoxY + qrPadding,
            qrDrawSize,
            qrDrawSize
          );
        }

        // Instruction under QR
        ctx.fillStyle = "#64748b";
        ctx.font = "600 22px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          "Scan with camera to verify credentials",
          width / 2,
          qrBoxY + qrBoxSize + 48
        );

        // Contact info box
        const contactY = 1490;
        ctx.fillStyle = "#0f172a";
        ctx.font = "600 24px 'JetBrains Mono', monospace";
        ctx.fillText("verify.cyberdex.com.ng", width / 2, contactY);
        ctx.fillStyle = "#64748b";
        ctx.font = "500 22px 'JetBrains Mono', monospace";
        ctx.fillText("info@cyberdex.com.ng", width / 2, contactY + 46);

        // Bottom Accent Strip (matching Front Card)
        const bottomGrad = ctx.createLinearGradient(
          0,
          height - 120,
          width,
          height
        );
        bottomGrad.addColorStop(0, "#1d4ed8");
        bottomGrad.addColorStop(0.5, "#0284c7");
        bottomGrad.addColorStop(1, "#d97706");
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, height - 100, width, 100);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("OFFICIAL SECURITY PROPERTY", width / 2, height - 42);

        // Download result
        const dataUrl = canvas.toDataURL("image/png");
        triggerDownload(
          dataUrl,
          `cyberdex-${staff.id.toLowerCase()}-badge-back-600dpi.png`
        );
        return true;
      } catch (err) {
        console.error("Failed to generate back badge:", err);
        return false;
      } finally {
        setIsExportingBack(false);
      }
    },
    [canvasRef]
  );

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
    isExporting,
    isExportingFront,
    isExportingBack,
    copyUrl,
    downloadCardFront,
    downloadCardBack,
    downloadHighResPng,
    downloadVectorSvg,
  };
}
