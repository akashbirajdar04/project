import React from "react";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-transparent">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800"></div>
        <p className="text-xs font-medium text-slate-500 tracking-wide">Loading content...</p>
      </div>
    </div>
  );
};
