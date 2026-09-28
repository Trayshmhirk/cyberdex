"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { getAllStaff } from "@/data/staff";
import { useBadgeExport } from "@/hooks/useBadgeExport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  CreditCard,
  Mail,
  ShieldCheck,
  Loader2,
  FileCode2,
} from "lucide-react";

export default function GeneratorPage() {
  const staffList = getAllStaff();
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [generated, setGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [badgeSide, setBadgeSide] = useState<"front" | "back">("front");
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const {
    canvasRef: highResCanvasRef,
    svgRef,
    isCopied,
    isExportingFront,
    isExportingBack,
    copyUrl,
    downloadCardFront,
    downloadCardBack,
    downloadVectorSvg,
  } = useBadgeExport();

  const currentStaff = staffList.find((s) => s.id === selectedStaffId);

  // Official production URL for the physical badge QR code
  const verificationUrl = currentStaff
    ? `https://verify.cyberdex.com.ng/verify/${currentStaff.id}`
    : "";

  const handleGenerate = async () => {
    if (!selectedStaffId) return;
    setIsGenerating(true);
    setGenerated(false);
    // Mimic cryptographic badge signing and print asset compilation
    await new Promise((resolve) => setTimeout(resolve, 750));
    setIsGenerating(false);
    setGenerated(true);
  };

  const handleStaffChange = (value: string | null) => {
    setSelectedStaffId(value || "");
    setGenerated(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-16">
      <div className="w-full max-w-4xl">
        {/* Trimmed & Balanced Split Studio */}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {/* Left Column: Staff Selector & Issuance Controls */}
          <div className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-7">
            {/* Header with Official Cyberdex Logo */}
            <div className="space-y-4 border-b border-slate-100 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/cyberdex-logo-main.svg"
                    alt="Cyberdex Logo"
                    width={90}
                    height={26}
                    className="h-15 w-auto object-cover"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Staff ID Generator
              </h1>
              <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
                Select a staff member to configure and preview their physical
                dual-sided verification badge.
              </p>
            </div>

            {/* Staff Selector using Shadcn Select */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Select Staff Personnel</span>
                <span className="font-mono text-[11px] font-normal text-slate-500">
                  {staffList.length} verified records
                </span>
              </label>

              <Select value={selectedStaffId} onValueChange={handleStaffChange}>
                <SelectTrigger className="focus-visible:border-cyber-blue focus-visible:ring-cyber-blue h-11! w-full border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 shadow-2xs hover:border-slate-300 focus-visible:ring-1">
                  <SelectValue placeholder="Select a staff member..." />
                </SelectTrigger>
                <SelectContent className="w-(--anchor-width) max-w-105 min-w-[320px] rounded-xl border border-slate-200 bg-white p-1 text-slate-900 shadow-xl">
                  {staffList.map((staff) => (
                    <SelectItem
                      key={staff.id}
                      value={staff.id}
                      className="cursor-pointer rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100 focus:bg-slate-100"
                    >
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="font-semibold text-slate-900">
                          {staff.fullName}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {staff.position}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Staff ID Input Display */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Staff Identifier Code
              </label>
              <div className="flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 font-mono text-sm text-slate-800">
                {currentStaff ? (
                  currentStaff.id
                ) : (
                  <span className="text-slate-400">---</span>
                )}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              disabled={!selectedStaffId || isGenerating}
              onClick={handleGenerate}
              className="bg-cyber-blue shadow-cyber-blue/20 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Generating cryptographic badge...</span>
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  <span>Generate Dual-Sided ID Badge</span>
                </>
              )}
            </button>

            {/* Actions Suite (Revealed once generated) */}
            {generated && currentStaff && (
              <div className="animate-in fade-in space-y-3 pt-1 duration-300">
                {/* 300 DPI High-Res Print Asset Downloads */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      disabled={isExportingFront || isExportingBack}
                      onClick={() => downloadCardFront(currentStaff)}
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-semibold text-slate-800 shadow-2xs transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                    >
                      {isExportingFront ? (
                        <Loader2 className="text-cyber-blue h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="text-cyber-blue h-4 w-4" />
                      )}
                      <span>Front Card (600 DPI)</span>
                    </button>
                    <button
                      type="button"
                      disabled={isExportingFront || isExportingBack}
                      onClick={() => downloadCardBack(currentStaff)}
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-semibold text-slate-800 shadow-2xs transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                    >
                      {isExportingBack ? (
                        <Loader2 className="text-cyber-amber h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="text-cyber-amber h-4 w-4" />
                      )}
                      <span>Back Card (600 DPI)</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadVectorSvg(currentStaff.id)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <FileCode2 className="text-cyber-cyan h-3.5 w-3.5" />
                    <span>Download Standalone Vector QR (.svg)</span>
                  </button>
                </div>

                {/* Verification URL row */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-600 select-all">
                    {verificationUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyUrl(verificationUrl)}
                    title="Copy Verification Link"
                    className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[11px] font-semibold text-emerald-700">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Link to Verified Profile */}
                <Link
                  href={`/verify/${currentStaff.id}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-800 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <span>View Public Verification Pass</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Dual-Sided Physical ID Badge Preview */}
          <div className="flex min-h-125 flex-col items-center justify-center rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50">
            {/* Header with Segmented Front / Back Switcher */}
            <div className="mb-5 flex w-full items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                Badge Preview
              </span>
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setBadgeSide("front")}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                    badgeSide === "front"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Front View
                </button>
                <button
                  type="button"
                  onClick={() => setBadgeSide("back")}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                    badgeSide === "back"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Back View
                </button>
              </div>
            </div>

            {isGenerating ? (
              /* Simulated Generating Shimmer State */
              <div className="flex min-h-95 w-full max-w-75 animate-pulse flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center">
                <Loader2 className="text-cyber-blue h-8 w-8 animate-spin" />
                <p className="mt-4 font-mono text-xs font-semibold text-slate-700">
                  Compiling 300 DPI badge assets...
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-400">
                  Rendering front and back print matrices
                </p>
              </div>
            ) : currentStaff && generated ? (
              badgeSide === "front" ? (
                /* FRONT VIEW: Executive Light PVC Badge (matching reference) */
                <div className="animate-in zoom-in-95 relative w-full max-w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl duration-300">
                  {/* Lanyard Cutout Slot */}
                  <div className="mx-auto mb-3 h-2.5 w-14 rounded-full border border-slate-200 bg-slate-100 shadow-inner" />

                  {/* Official Logo at Top */}
                  <div className="relative z-10 mb-3 flex justify-center">
                    <div className="relative h-10 w-32">
                      <Image
                        src="/cyberdex-logo-main.png"
                        alt="Cyberdex"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>

                  {/* Circular Employee Photo with Accent Ring */}
                  <div className="relative mx-auto my-3 flex justify-center">
                    <div className="ring-cyber-blue/25 relative h-24 w-24 overflow-hidden rounded-full border-2 border-white shadow-md ring-4">
                      <Image
                        src={currentStaff.avatarUrl}
                        alt={currentStaff.fullName}
                        fill
                        className="object-cover"
                        sizes="96px"
                        priority
                      />
                    </div>
                  </div>

                  {/* Personnel Identity */}
                  <div className="space-y-1 text-center">
                    <h2 className="text-base leading-tight font-bold text-slate-900">
                      {currentStaff.fullName}
                    </h2>
                    <p className="text-cyber-blue line-clamp-2 text-xs leading-snug font-semibold">
                      {currentStaff.position}
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        ACTIVE — VERIFIED STAFF
                      </span>
                    </div>
                  </div>

                  {/* Verified Metadata Box */}
                  <div className="mt-3 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-500">
                        Staff ID:
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {currentStaff.id}
                      </span>
                    </div>
                    {currentStaff.email && (
                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5 text-[11px]">
                        <span className="flex items-center gap-1 font-medium text-slate-500">
                          <Mail className="h-2.5 w-2.5" />
                          <span>Email:</span>
                        </span>
                        <span className="max-w-42.5 truncate font-mono text-slate-800">
                          {currentStaff.email}
                        </span>
                      </div>
                    )}
                    {currentStaff.certifications &&
                      currentStaff.certifications.length > 0 && (
                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5 text-[11px]">
                          <span className="font-medium text-slate-500">
                            Credentials:
                          </span>
                          <span className="text-cyber-blue max-w-42.5 truncate font-mono font-semibold">
                            {currentStaff.certifications[0]}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Authorized Signature Block */}
                  <div className="my-2.5 flex flex-col items-center justify-center">
                    <div className="relative h-7 w-20">
                      <Image
                        src="/authorize-signature.png"
                        alt="Authorized Signature"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div className="my-0.5 w-24 border-t border-slate-300" />
                    <span className="font-mono text-[8px] font-semibold tracking-wider text-slate-700 uppercase">
                      Authorized Signature
                    </span>
                    <span className="font-mono text-[7px] text-slate-400">
                      CEO
                    </span>
                  </div>

                  {/* Bottom Accent Footer */}
                  <div className="from-cyber-blue via-cyber-cyan to-cyber-amber -mx-5 mt-3 -mb-5 bg-linear-to-r py-2 text-center">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-white">
                      www.cyberdex.com.ng
                    </span>
                  </div>
                </div>
              ) : (
                /* BACK VIEW: Corporate Badge Terms, QR & Inquiries (matching reference) */
                <div className="animate-in zoom-in-95 relative w-full max-w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl duration-300">
                  {/* Lanyard Cutout Slot */}
                  <div className="mx-auto mb-3 h-2.5 w-14 rounded-full border border-slate-200 bg-slate-100 shadow-inner" />

                  {/* Official Logo at Top (identical position and dimensions to Front View) */}
                  <div className="relative z-10 mb-3 flex justify-center">
                    <div className="relative h-10 w-32">
                      <Image
                        src="/cyberdex-logo-main.png"
                        alt="Cyberdex"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>

                  {/* Terms & Conditions Notice */}
                  <div className="space-y-1 text-center">
                    <span className="text-cyber-amber font-mono text-[10px] font-bold tracking-wider uppercase">
                      Terms & Conditions
                    </span>
                    <ul className="space-y-1 pt-1 text-left text-[10px] leading-tight text-slate-600">
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyber-amber mt-0.5">•</span>
                        <span>
                          This ID card is the official property of Cyberdex.
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyber-amber mt-0.5">•</span>
                        <span>
                          Must be worn at all times while on company premises.
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyber-amber mt-0.5">•</span>
                        <span>
                          This credential pass is strictly non-transferable.
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyber-amber mt-0.5">•</span>
                        <span>
                          If found, please return to Cyberdex or scan below.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Centered High-Contrast QR Code (Expanded with reduced container padding) */}
                  <div className="my-3 flex flex-col items-center justify-center">
                    <div
                      ref={qrCanvasRef}
                      className="rounded-xl border border-slate-200 bg-slate-50/80 p-1.5 shadow-xs"
                    >
                      <QRCodeCanvas
                        value={verificationUrl}
                        size={144}
                        level="H"
                        marginSize={1}
                      />
                    </div>
                    <span className="mt-1.5 font-mono text-[9px] text-slate-400">
                      Scan with camera to verify credentials
                    </span>
                  </div>

                  {/* Contact & Verification Registry */}
                  <div className="space-y-0.5 text-center font-mono text-[9px] text-slate-500">
                    <p className="font-semibold text-slate-700">
                      verify.cyberdex.com.ng
                    </p>
                    <p>info@cyberdex.com.ng</p>
                  </div>

                  {/* Bottom Accent Footer */}
                  <div className="from-cyber-blue via-cyber-cyan to-cyber-amber -mx-5 mt-4 -mb-5 bg-linear-to-r py-2 text-center">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-white">
                      OFFICIAL SECURITY PROPERTY
                    </span>
                  </div>
                </div>
              )
            ) : (
              /* Blueprint Wireframe Initial State */
              <div className="flex min-h-95 w-full max-w-75 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Dual-Sided Badge Studio
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Select a staff member from the left panel and click
                  &ldquo;Generate Dual-Sided ID Badge&rdquo; to preview their
                  card.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offscreen 2048px Matrix & Vector SVG for Print Asset Compilation */}
      <div
        className="pointer-events-none fixed top-[-9999px] left-[-9999px] opacity-0"
        aria-hidden="true"
      >
        <div ref={highResCanvasRef}>
          {verificationUrl && (
            <QRCodeCanvas
              value={verificationUrl}
              size={2048}
              level="H"
              marginSize={1}
            />
          )}
        </div>
        <div ref={svgRef}>
          {verificationUrl && (
            <QRCodeSVG
              value={verificationUrl}
              size={2048}
              level="H"
              marginSize={1}
            />
          )}
        </div>
      </div>
    </main>
  );
}
