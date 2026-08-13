import React from "react";
import { getExpiryDetails } from "./fileHelpers";

const toneMap = {
  neutral: "border-mid bg-white/80 text-ink/75",
  success: "border-mid bg-deep/12 text-ink",
  warning: "border-mid bg-warm/60 text-ink",
  danger: "border-danger/40 bg-danger/15 text-ink",
};

const barMap = {
  neutral: "bg-mid",
  success: "bg-deep",
  warning: "bg-warm",
  danger: "bg-danger",
};

const ExpirationBadge = ({ expiresAt }) => {
  const details = getExpiryDetails(expiresAt);

  return (
    <div className={`min-w-[74px] rounded-lg border px-2 py-1.5 ${toneMap[details.tone]}`}>
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em]">Expiry</span>
        <span className="text-[11px] font-semibold">{details.label}</span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${barMap[details.tone]}`}
          style={{ width: `${details.percent}%` }}
        />
      </div>
    </div>
  );
};

export default ExpirationBadge;
