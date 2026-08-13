import React from "react";

function Footer({ className = "", compact = false }) {
  return (
    <footer className={`border-t border-mid/70 bg-mid/45 px-4 py-8 text-ink/75 backdrop-blur-xl ${className}`}>
      <div className={`mx-auto flex max-w-7xl flex-col gap-6 ${compact ? "md:items-end" : "md:flex-row md:items-center md:justify-between"}`}>
        <div>
          <p className={`text-sm ${compact ? "text-right" : ""}`}>
            Crafted by <span className="font-semibold text-ink">Sarfaraz</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
