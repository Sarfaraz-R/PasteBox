import React from "react";
import { Link } from "react-router-dom";
import { FaLink, FaLock, FaUpload } from "react-icons/fa";
import { SiNodedotjs, SiReact, SiRedux, SiTailwindcss } from "react-icons/si";

const featureCards = [
  {
    icon: FaUpload,
    title: "Quick uploads",
    description: "Drop a file, add optional protection, and generate a share link in seconds.",
  },
  {
    icon: FaLock,
    title: "Protected sharing",
    description: "Use passwords and expiry controls when a file needs tighter access.",
  },
  {
    icon: FaLink,
    title: "Clean links",
    description: "Share short links with previews, QR codes, and simple download flows.",
  },
];

const stackItems = [
  { icon: SiReact, label: "React" },
  { icon: SiRedux, label: "Redux Toolkit" },
  { icon: SiTailwindcss, label: "Tailwind CSS" },
  { icon: SiNodedotjs, label: "Node.js" },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-light text-ink">
      <header className="border-b border-mid/70 bg-light/90 px-4 py-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PasteBox logo" className="h-11 w-11 rounded-2xl object-contain" />
            <div>
              <h1 className="text-2xl font-black tracking-tight">PasteBox</h1>
              <p className="text-xs text-ink">File sharing with previews and protected links</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="premium-button premium-button-secondary px-3 py-1.5 text-[11px] sm:text-xs">
              Log In
            </Link>
            <Link to="/signup" className="premium-button px-3 py-1.5 text-[11px] sm:text-xs">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink">Share files instantly</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Upload files and share a link instantly.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-ink/75 sm:text-base">
              No signup required. Add a password or expiry, then send the file in seconds.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/dashboard" className="premium-button px-3 py-1.5 text-[11px] sm:text-xs">
                Open Dashboard
              </Link>
              <Link to="/login" className="premium-button premium-button-secondary px-3 py-1.5 text-[11px] sm:text-xs">
                Account Access
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[28px] border border-mid bg-white/80 p-6 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-mid bg-deep/10 text-ink">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/75">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-mid bg-white/80 p-8 shadow-soft">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-ink">Built with modern tools</p>
                <h3 className="mt-3 text-2xl font-semibold text-ink">A clean MERN workflow behind the scenes.</h3>
              </div>
              <p className="max-w-xl text-sm leading-6 text-ink/75">
                PasteBox keeps the frontend fast and focused while the backend handles storage, sharing, and expiry logic.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stackItems.map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-3xl border border-mid bg-light/35 p-5 text-center">
                  <Icon className="mx-auto mb-3 text-3xl text-ink" />
                  <p className="text-sm font-semibold text-ink">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
