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
  Shield,
  QrCode,
  CreditCard,
  Mail,
  ShieldCheck,
  Loader2,
  FileCode2,
} from "lucide-react";

export default function GeneratorPage() {
  const staffList = getAllStaff();
  // Starts empty — no staff pre-selected
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [generated, setGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const {
    canvasRef: highResCanvasRef,
    svgRef,
    isCopied,
    copyUrl,
    downloadHighResPng,
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
            {/* Header */}
            <div className="space-y-1.5 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2">
                <div className="text-cyber-navy flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 shadow-2xs">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-slate-900 uppercase">
                  Cyberdex
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {"//"} Badge Studio
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Staff ID Generator
              </h1>
              <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
                Select a staff member to configure and preview their physical
                verification badge.
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
                  <span>Generate QR Code & Print Asset</span>
                </>
              )}
            </button>

            {/* Actions Suite (Revealed once generated) */}
            {generated && currentStaff && (
              <div className="animate-in fade-in space-y-3 pt-1 duration-300">
                {/* Print Asset Download Suite (Ultra-HD PNG & Lossless Vector SVG) */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => downloadHighResPng(currentStaff.id)}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-semibold text-slate-800 shadow-2xs transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Download className="text-cyber-blue h-4 w-4" />
                    <span>Ultra-HD PNG (2048px)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadVectorSvg(currentStaff.id)}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-semibold text-slate-800 shadow-2xs transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <FileCode2 className="text-cyber-cyan h-4 w-4" />
                    <span>Vector SVG (Print Ready)</span>
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

          {/* Right Column: Light-Surface Physical ID Badge Preview */}
          <div className="flex min-h-125 flex-col items-center justify-center rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50">
            <div className="mb-5 flex w-full items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                Physical Badge Preview
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                CR80 PVC // 300 DPI
              </span>
            </div>

            {isGenerating ? (
              /* Simulated Generating Shimmer State */
              <div className="flex min-h-95 w-full max-w-75 animate-pulse flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center">
                <Loader2 className="text-cyber-blue h-8 w-8 animate-spin" />
                <p className="mt-4 font-mono text-xs font-semibold text-slate-700">
                  Compiling badge graphics...
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-400">
                  Generating 300 DPI print matrix
                </p>
              </div>
            ) : currentStaff && generated ? (
              /* Light-Surface PVC Physical ID Badge */
              <div className="animate-in zoom-in-95 relative w-full max-w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl duration-300">
                {/* Lanyard Hole Cutout Slot */}
                <div className="mx-auto mb-3.5 h-2.5 w-12 rounded-full border border-slate-200 bg-slate-100 shadow-inner" />

                {/* Badge Top Header Strip */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <Shield className="text-cyber-blue h-4 w-4" />
                    <span className="font-mono text-xs font-bold tracking-[0.2em] text-slate-900 uppercase">
                      Cyberdex
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    VERIFIED
                  </span>
                </div>

                {/* Photo & Personnel Info */}
                <div className="mt-4 flex items-center gap-3.5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-xs">
                    <Image
                      src={currentStaff.avatarUrl}
                      alt={currentStaff.fullName}
                      fill
                      className="object-cover"
                      sizes="80px"
                      priority
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-sm leading-tight font-bold text-slate-900">
                      {currentStaff.fullName}
                    </p>
                    <p className="text-cyber-blue line-clamp-2 text-[11px] leading-snug font-semibold">
                      {currentStaff.position}
                    </p>
                    <span className="inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800">
                      {currentStaff.id}
                    </span>
                    {currentStaff.email && (
                      <p className="flex items-center gap-1 truncate pt-0.5 text-[10px] text-slate-500">
                        <Mail className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                        <span className="truncate">{currentStaff.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Scannable High-Contrast QR Section */}
                <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5">
                  <div className="flex items-center justify-center">
                    <div
                      ref={qrCanvasRef}
                      className="rounded-lg border border-slate-200/80 bg-white p-2 shadow-2xs"
                    >
                      <QRCodeCanvas
                        value={verificationUrl}
                        size={140}
                        level="H"
                        marginSize={1}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-center font-mono text-[10px] text-slate-500">
                    Scan with any mobile device to verify
                  </p>
                </div>

                {/* Security Footer */}
                <div className="mt-3.5 border-t border-slate-100 pt-2.5 text-center">
                  <p className="font-mono text-[9px] leading-tight text-slate-400">
                    Official property of Cyberdex Security.
                    <br />
                    verify.cyberdex.com.ng
                  </p>
                </div>
              </div>
            ) : (
              /* Snug, Proportional Blueprint Wireframe State */
              <div className="flex min-h-95 w-full max-w-75 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Physical Badge Wireframe
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Select a staff member from the left panel and click
                  &ldquo;Generate QR Code&rdquo; to preview their card.
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
              marginSize={4}
            />
          )}
        </div>
        <div ref={svgRef}>
          {verificationUrl && (
            <QRCodeSVG
              value={verificationUrl}
              size={2048}
              level="H"
              marginSize={4}
            />
          )}
        </div>
      </div>
    </main>
  );
}
