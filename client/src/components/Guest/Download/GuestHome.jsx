import Header from "../../HeaderComp";
import GuestDownload from "./GuestDownload";

const GuestHome = () => {
  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--text-color)]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6">
        <div className="mb-6 rounded-[30px] border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.9),rgba(248,226,186,0.24))] px-6 py-6 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/70">Guest Download</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Open a shared file</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ink/75 sm:text-base">
            Review the shared file details, unlock protected content when needed, and download it with confidence.
          </p>
        </div>
        <GuestDownload />
      </main>
    </div>
  );
};

export default GuestHome;
