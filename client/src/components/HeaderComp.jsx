import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const close = () => setSidebarVisible(false);

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-mid/70 bg-light/90 px-4 py-4 text-ink backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2" aria-label="PasteBox home">
            <img src="/logo.png" alt="" className="h-10 w-10 rounded-2xl object-contain" />
            <div>
              <span className="block text-2xl font-black tracking-tight text-ink">PasteBox</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 lg:flex" aria-label="Primary navigation">
            <a href="#features" className="text-sm text-ink hover:text-ink">
              Features
            </a>
            <a href="#files" className="text-sm text-ink hover:text-ink">
              Recent uploads
            </a>
          </nav>

          <nav className="hidden items-center gap-3 sm:flex" aria-label="Auth actions">
            <Link to="/login" className="premium-button premium-button-secondary px-3 py-1.5 text-[11px] sm:text-xs">
              Log In
            </Link>
            <Link to="/signup" className="premium-button gap-1.5 px-3 py-1.5 text-[11px] sm:text-xs">
              Sign Up
              <FaArrowRight />
            </Link>
          </nav>

          <button
            onClick={() => setSidebarVisible(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-mid bg-white/85 text-ink sm:hidden"
            aria-label="Open navigation"
          >
            <FaBars />
          </button>
        </div>
      </header>

      {sidebarVisible && (
        <button
          className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-sm sm:hidden"
          onClick={close}
          aria-label="Close navigation overlay"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-72 border-l border-mid bg-light p-5 text-ink shadow-2xl transition-transform duration-300 sm:hidden ${
          sidebarVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" onClick={close} className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-9 w-9 rounded-xl object-contain" />
            <span className="font-black">PasteBox</span>
          </Link>
          <button
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-mid bg-white/80 text-ink"
            aria-label="Close navigation"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-6 rounded-3xl border border-mid bg-white/70 p-4 text-sm text-ink/75">
          Share files instantly without forcing sign-up, then upgrade to keep a persistent library.
        </div>

        <div className="grid gap-3">
          <a href="#features" onClick={close} className="rounded-2xl border border-mid bg-white/80 px-4 py-3 text-sm font-medium text-ink">
            Features
          </a>
          <a href="#files" onClick={close} className="rounded-2xl border border-mid bg-white/80 px-4 py-3 text-sm font-medium text-ink">
            Recent uploads
          </a>
          <Link to="/login" onClick={close} className="premium-button premium-button-secondary px-3 py-2 text-xs">
            Log In
          </Link>
          <Link to="/signup" onClick={close} className="premium-button gap-1.5 px-3 py-2 text-xs">
            Sign Up
            <FaArrowRight />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Header;
