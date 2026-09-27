import React from "react";
import Image from "next/image";
import { getStaffById } from "@/data/staff";
import { CopyCredentialButton } from "@/components/CopyCredentialButton";
import {
  AlertCircle,
  ShieldCheck,
  Shield,
  Award,
  Mail,
  Lock,
  KeyRound,
} from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const staff = getStaffById(id);
  if (!staff) {
    return {
      title: "Staff Verification Failed | CYBERDEX",
      description:
        "Invalid or unrecognized Cyberdex staff identification code.",
    };
  }
  return {
    title: `${staff.fullName} (${staff.id}) — Verified Cyberdex Staff Profile`,
    description: `Official staff identity verification for ${staff.fullName}, ${staff.position} at Cyberdex.`,
  };
}

export default async function VerificationPage({ params }: Props) {
  const { id } = await params;
  // Mimic authenticated security directory lookup delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  const staff = getStaffById(id);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-16">
      {staff ? (
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60">
          {/* Top Brand Cover Banner */}
          <div className="relative h-36 w-full bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-4 sm:h-40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-xs">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-white uppercase">
                  Cyberdex
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] font-medium text-slate-200 backdrop-blur-xs">
                <Lock className="h-3 w-3 text-emerald-400" />
                Official Registry
              </span>
            </div>

            {/* Subtle background decorative emblem */}
            <div className="pointer-events-none absolute -right-6 -bottom-6 text-white opacity-10">
              <Shield className="h-32 w-32" />
            </div>
          </div>

          {/* Overlapping Avatar Circle */}
          <div className="relative -mt-16 flex justify-center sm:-mt-18">
            <div className="relative">
              <div className="relative h-28 w-28 overflow-hidden rounded-full bg-slate-100 shadow-xl ring-4 ring-white sm:h-32 sm:w-32">
                <Image
                  src={staff.avatarUrl}
                  alt={staff.fullName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 112px, 128px"
                  priority
                />
              </div>
              <div
                className="absolute right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white"
                title="Verified Staff"
              >
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Name & Title Header */}
          <div className="px-6 pt-4 pb-6 text-center sm:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {staff.fullName}
            </h1>
            <p className="text-cyber-blue mt-1 text-sm font-semibold sm:text-base">
              {staff.position}
            </p>

            <div className="mt-3 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
                </span>
                {staff.status}
              </span>
            </div>
          </div>

          {/* Body Sections */}
          <div className="space-y-6 border-t border-slate-100 px-6 py-6 sm:px-8">
            {/* Quick Identifier Cards */}
            <div
              className={`grid grid-cols-1 gap-3 ${
                staff.email ? "sm:grid-cols-2" : "sm:grid-cols-1"
              }`}
            >
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                <div className="flex items-center gap-2 text-slate-500">
                  <KeyRound className="text-cyber-cyan size-4 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold uppercase">
                    Staff Identifier
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs font-bold text-slate-900">
                  {staff.id}
                </p>
              </div>

              {staff.email && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="text-cyber-cyan size-4 shrink-0" />
                    <span className="font-mono text-[11px] font-semibold uppercase">
                      Official Email
                    </span>
                  </div>
                  <a
                    href={`mailto:${staff.email}`}
                    className="text-cyber-cyan hover:text-cyber-blue mt-1 block truncate font-mono text-xs font-semibold hover:underline"
                  >
                    {staff.email}
                  </a>
                </div>
              )}
            </div>

            {/* Industry Certifications (Only if present) */}
            {staff.certifications && staff.certifications.length > 0 && (
              <div className="space-y-2">
                <h2 className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  Industry Certifications
                </h2>
                <div className="flex flex-wrap gap-2">
                  {staff.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 shadow-2xs"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Competencies & Areas */}
            <div className="space-y-2">
              <h2 className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">
                <span className="bg-cyber-cyan inline-block h-1.5 w-1.5 rounded-full" />
                Core Areas
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {staff.coreAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-100"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Professional Profile */}
            <div className="space-y-2">
              <h2 className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">
                <span className="bg-cyber-cyan inline-block h-1.5 w-1.5 rounded-full" />
                Professional Profile
              </h2>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">
                  {staff.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:px-8">
            <CopyCredentialButton url={staff.canonicalUrl} />

            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] text-slate-400">
                verify.cyberdex.com.ng
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Record Not Found State */
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-red-100 bg-red-50/50 px-6 py-4">
            <Shield className="h-4 w-4 text-red-600" />
            <span className="font-mono text-xs font-bold tracking-widest text-slate-900 uppercase">
              Cyberdex Identity Verification
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Record Not Verified
              </h2>
              <span className="mt-2 inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 font-mono text-xs font-semibold text-red-700">
                Invalid or Unregistered Staff ID
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              No active Cyberdex personnel record matches ID{" "}
              <span className="font-mono font-bold text-slate-900">{id}</span>.
              Please ensure the identifier was scanned accurately from an
              official Cyberdex physical card.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
