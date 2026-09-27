"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyCredentialButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span className="font-semibold text-emerald-700">Link Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-slate-500" />
          <span>Copy Verification Link</span>
        </>
      )}
    </button>
  );
}
