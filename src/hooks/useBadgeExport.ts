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
  generateCardFrontDataUrl: (staff: StaffProfile) => Promise<string | null>;
  generateCardBackDataUrl: (staff: StaffProfile) => Promise<string | null>;
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

  const generateCardFrontDataUrl = useCallback(
    async (staff: StaffProfile): Promise<string | null> => {
      if (!staff) return null;
      try {
        const width = 1200;
        const height = 1900;
        const scale = 2; // Ultra-HD 2400 x 3800 px (711 DPI industrial grade)
        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

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
        ctx.font = "bold 58px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(staff.fullName, width / 2, 920);

        // Employee Position
        ctx.fillStyle = "#1d4ed8";
        ctx.font = "bold 35px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(staff.position, width / 2, 985);

        // Verified Status Badge Pill
        const pillWidth = 520;
        const pillHeight = 64;
        const pillY = 1035;
        ctx.fillStyle = "#ecfdf5";
        ctx.strokeStyle = "#a7f3d0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(
          width / 2 - pillWidth / 2,
          pillY,
          pillWidth,
          pillHeight,
          32
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#047857";
        ctx.font = "bold 28px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("ACTIVE — VERIFIED STAFF", width / 2, pillY + 41);

        // Metadata Card Box Rows Configuration
        const metaRows: { label: string; value: string; isBlue?: boolean }[] = [
          { label: "Staff ID:", value: staff.id },
        ];
        if (staff.email) {
          metaRows.push({ label: "Email:", value: staff.email });
        }
        if (staff.phone) {
          metaRows.push({ label: "Phone:", value: staff.phone });
        }
        if (
          staff.certifications &&
          staff.certifications.length > 0 &&
          !staff.email
        ) {
          metaRows.push({
            label: "Credentials:",
            value: staff.certifications[0],
            isBlue: true,
          });
        }
        metaRows.push({
          label: "Registry Portal:",
          value: "verify.cyberdex.com.ng",
          isBlue: true,
        });

        const rowStep = 64;
        const metaBoxY = 1150;
        const metaBoxWidth = 920;
        const metaBoxHeight = 32 + metaRows.length * rowStep;
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

        metaRows.forEach((row, index) => {
          const currentY = metaBoxY + 50 + index * rowStep;

          ctx.fillStyle = "#64748b";
          ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(row.label, width / 2 - metaBoxWidth / 2 + 50, currentY);

          ctx.fillStyle = row.isBlue ? "#1d4ed8" : "#0f172a";
          ctx.font = "bold 30px 'JetBrains Mono', monospace";
          ctx.textAlign = "right";
          ctx.fillText(row.value, width / 2 + metaBoxWidth / 2 - 50, currentY);

          if (index < metaRows.length - 1) {
            ctx.strokeStyle = "#e2e8f0";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width / 2 - metaBoxWidth / 2 + 40, currentY + 19);
            ctx.lineTo(width / 2 + metaBoxWidth / 2 - 40, currentY + 19);
            ctx.stroke();
          }
        });

        // Authorized Signature Block (centered, ending ~45px above footer)
        try {
          const sig = await loadImage("/authorize-signature.png");
          const sigWidth = 300;
          const sigHeight = (sig.height / sig.width) * sigWidth;
          ctx.drawImage(
            sig,
            width / 2 - sigWidth / 2,
            1500,
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
        ctx.moveTo(width / 2 - 160, 1630);
        ctx.lineTo(width / 2 + 160, 1630);
        ctx.stroke();

        // Signature Labels (bold, high contrast, enlarged)
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 35px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Authorized Signature", width / 2, 1680);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 40px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CEO", width / 2, 1732);

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
        ctx.font = "bold 35px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("www.cyberdex.com.ng", width / 2, height - 40);

        return canvas.toDataURL("image/png");
      } catch (err) {
        console.error("Failed to generate front badge data URL:", err);
        return null;
      }
    },
    []
  );

  const downloadCardFront = useCallback(
    async (staff: StaffProfile): Promise<boolean> => {
      if (!staff) return false;
      setIsExportingFront(true);
      try {
        const dataUrl = await generateCardFrontDataUrl(staff);
        if (!dataUrl) return false;
        triggerDownload(
          dataUrl,
          `cyberdex-${staff.id.toLowerCase()}-badge-front-600dpi.png`
        );
        return true;
      } catch (err) {
        console.error("Failed to download front badge:", err);
        return false;
      } finally {
        setIsExportingFront(false);
      }
    },
    [generateCardFrontDataUrl]
  );

  const generateCardBackDataUrl = useCallback(
    async (staff: StaffProfile): Promise<string | null> => {
      if (!staff) return null;
      try {
        const width = 1200;
        const height = 1900;
        const scale = 2; // Ultra-HD 2400 x 3800 px (industrial grade)
        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

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

        // Load and draw official Logo at Top (100% symmetric with Front Card position and dimensions)
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
        ctx.font = "bold 40px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("TERMS & CONDITIONS", width / 2, 460);

        // Terms Bullet Points
        const terms = [
          "This ID card is the official property of Cyberdex.",
          "Must be worn at all times while on company premises.",
          "This credential pass is strictly non-transferable.",
          "If found, return to Head Office or call hotline below.",
        ];

        ctx.font = "600 32px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "left";
        const termsX = width / 2 - 440;
        let termsY = 530;
        for (const term of terms) {
          ctx.fillStyle = "#d97706";
          ctx.beginPath();
          ctx.arc(termsX + 10, termsY - 8, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#334155";
          ctx.fillText(term, termsX + 35, termsY);
          termsY += 54;
        }

        // High-Contrast QR Code Section (Centered)
        const qrBoxY = 740;
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
        ctx.font = "bold 30px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          "Scan with camera to verify credentials",
          width / 2,
          qrBoxY + qrBoxSize + 48
        );

        // Head Office & Lost Card Hotline & Inquiries Card
        const infoBoxY = 1380;
        const infoBoxWidth = 920;
        const infoBoxHeight = 370;
        ctx.fillStyle = "#f8fafc";
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(
          width / 2 - infoBoxWidth / 2,
          infoBoxY,
          infoBoxWidth,
          infoBoxHeight,
          24
        );
        ctx.fill();
        ctx.stroke();

        // Head Office Header (+3px)
        ctx.fillStyle = "#d97706";
        ctx.font = "bold 30px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("HEAD OFFICE", width / 2, infoBoxY + 46);

        // Address Lines (+3px)
        ctx.fillStyle = "#1e293b";
        ctx.font = "600 32px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(
          "6, Aina Street, Inity Estates, Obawole, Ogba,",
          width / 2,
          infoBoxY + 90
        );
        ctx.fillText("Ikeja, Lagos, Nigeria", width / 2, infoBoxY + 130);

        // Divider 1
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 380, infoBoxY + 152);
        ctx.lineTo(width / 2 + 380, infoBoxY + 152);
        ctx.stroke();

        // Recovery Hotline (+3px)
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 32px 'JetBrains Mono', monospace";
        ctx.fillText(
          "If Lost, Call: +234 803 216 4197",
          width / 2,
          infoBoxY + 205
        );

        // Divider 2
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 380, infoBoxY + 234);
        ctx.lineTo(width / 2 + 380, infoBoxY + 234);
        ctx.stroke();

        // Official Registry & Inquiries (+3px)
        ctx.fillStyle = "#1d4ed8";
        ctx.font = "bold 32px 'JetBrains Mono', monospace";
        ctx.fillText("verify.cyberdex.com.ng", width / 2, infoBoxY + 290);
        ctx.fillStyle = "#64748b";
        ctx.font = "600 32px 'JetBrains Mono', monospace";
        ctx.fillText("info@cyberdex.com.ng", width / 2, infoBoxY + 338);

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
        ctx.font = "bold 35px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("OFFICIAL SECURITY PROPERTY", width / 2, height - 40);

        return canvas.toDataURL("image/png");
      } catch (err) {
        console.error("Failed to generate back badge data URL:", err);
        return null;
      }
    },
    [canvasRef]
  );

  const downloadCardBack = useCallback(
    async (staff: StaffProfile): Promise<boolean> => {
      if (!staff) return false;
      setIsExportingBack(true);
      try {
        const dataUrl = await generateCardBackDataUrl(staff);
        if (!dataUrl) return false;
        triggerDownload(
          dataUrl,
          `cyberdex-${staff.id.toLowerCase()}-badge-back-600dpi.png`
        );
        return true;
      } catch (err) {
        console.error("Failed to download back badge:", err);
        return false;
      } finally {
        setIsExportingBack(false);
      }
    },
    [generateCardBackDataUrl]
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
    generateCardFrontDataUrl,
    generateCardBackDataUrl,
    downloadHighResPng,
    downloadVectorSvg,
  };
}
