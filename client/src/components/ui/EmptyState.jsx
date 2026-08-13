import React from "react";

const EmptyState = ({ eyebrow, title, description, action }) => {
  return (
    <div className="rounded-3xl border border-mid bg-white/76 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-mid bg-deep/10 text-2xl text-ink">
        +
      </div>
      {eyebrow && (
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-ink">
          {eyebrow}
        </p>
      )}
      <h3 className="mt-3 text-xl font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/75">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
