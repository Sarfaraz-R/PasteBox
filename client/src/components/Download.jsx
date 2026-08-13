import DownloadPage from "./DownloadPage";
import Header from "./HeaderComp";

const Download = () => {
  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--text-color)]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6">
        <div className="mb-6 rounded-[30px] border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.9),rgba(226,236,244,0.38))] px-6 py-6 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/70">Download Page</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Secure file access</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ink/75 sm:text-base">
            Preview the shared file, review its details, and download it safely from one place.
          </p>
        </div>
        <DownloadPage />
      </main>
    </div>
  );
};

export default Download;
