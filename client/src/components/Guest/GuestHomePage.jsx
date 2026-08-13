import { useEffect, useState } from "react";
import Header from "../HeaderComp";
import GuestFilePreview from "./GuestFilePreview";
import GuestFileUpload from "./GuestFileUpload";
import Footer from "../Footer";
import { FaClock, FaLink, FaShieldAlt } from "react-icons/fa";

const featureCards = [
  {
    icon: FaLink,
    title: "Shareable links",
    description: "Create a clean download link instantly and send it anywhere without extra setup.",
  },
  {
    icon: FaShieldAlt,
    title: "Protected access",
    description: "Add optional passwords and expiry controls before a file reaches someone else.",
  },
  {
    icon: FaClock,
    title: "Quick delivery",
    description: "Upload in a few clicks, preview the result, and keep the flow lightweight.",
  },
];

const GuestHomePage = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("guestFiles")) || [];
    setFiles(storedFiles);
  }, []);

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
    localStorage.setItem("guestFiles", JSON.stringify(newFiles));
  };

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--text-color)]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl rounded-[34px] border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.88),rgba(226,236,244,0.52))] px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/75">
              Share files instantly
            </p>
            <h1 className="mt-2 text-lg font-semibold tracking-tight text-ink sm:text-[1.75rem]">
              Upload files and share a link instantly.
            </h1>
            <p className="mt-2 text-xs leading-5 text-ink/70 sm:text-sm">
              No signup required. Add a password or expiry, then send the file in seconds.
            </p>
          </div>

          <div>
            <GuestFileUpload guestFiles={files} updateFiles={updateFiles} />
          </div>
        </section>

        <section id="features" className="mx-auto mt-12 max-w-6xl scroll-mt-28 rounded-[34px] border border-mid bg-[linear-gradient(180deg,rgba(255,251,245,0.82),rgba(248,226,186,0.18))] px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/75">
              Features
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink sm:text-[1.75rem]">
              Simple tools for fast, secure sharing.
            </h2>
            <p className="mt-2 text-xs leading-5 text-ink/70 sm:text-sm">
              PasteBox keeps file sharing quick while still giving you control over access and timing.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[28px] border border-mid bg-white/82 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-mid bg-[linear-gradient(180deg,rgba(154,178,200,0.2),rgba(240,211,157,0.16))] text-ink">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/75">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <div id="files" className="mx-auto mt-12 max-w-6xl">
          <GuestFilePreview guestFiles={files} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuestHomePage;
