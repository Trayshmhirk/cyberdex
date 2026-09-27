import React from "react";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-16">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60">
        {/* Shimmering Cover Banner */}
        <div className="relative flex h-36 w-full animate-pulse items-center justify-between bg-slate-200 px-6 py-4 sm:h-40">
          <div className="h-6 w-28 animate-pulse rounded-md bg-slate-300" />
          <div className="h-6 w-32 animate-pulse rounded-full bg-slate-300" />
        </div>

        {/* Shimmering Overlapping Avatar Circle */}
        <div className="relative -mt-16 flex justify-center sm:-mt-18">
          <div className="relative h-28 w-28 animate-pulse rounded-full bg-slate-300 shadow-xl ring-4 ring-white sm:h-32 sm:w-32" />
        </div>

        {/* Shimmering Name & Title Header */}
        <div className="space-y-2 px-6 pt-4 pb-6 text-center sm:px-8">
          <div className="mx-auto h-7 w-48 animate-pulse rounded-md bg-slate-300" />
          <div className="mx-auto h-4 w-64 animate-pulse rounded-md bg-slate-200" />
          <div className="mx-auto mt-3 h-6 w-36 animate-pulse rounded-full bg-slate-200" />
        </div>

        {/* Body Sections Skeleton */}
        <div className="space-y-6 border-t border-slate-100 px-6 py-6 sm:px-8">
          {/* Quick Identifier Cards Skeleton */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="h-16 animate-pulse rounded-2xl border border-slate-100 bg-slate-100" />
            <div className="h-16 animate-pulse rounded-2xl border border-slate-100 bg-slate-100" />
          </div>

          {/* Core Areas Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded-md bg-slate-200" />
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
              <div className="h-7 w-32 animate-pulse rounded-full bg-slate-100" />
              <div className="h-7 w-28 animate-pulse rounded-full bg-slate-100" />
              <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>

          {/* About / Professional Profile Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded-md bg-slate-200" />
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
              <div className="h-4 w-full animate-pulse rounded-md bg-slate-200" />
              <div className="h-4 w-5/6 animate-pulse rounded-md bg-slate-200" />
              <div className="h-4 w-4/6 animate-pulse rounded-md bg-slate-200" />
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:px-8">
          <div className="h-8 w-36 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-28 animate-pulse rounded-md bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
