import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaDownload, FaEye, FaFileAlt, FaLock, FaUser } from "react-icons/fa";
import { formatFileSize, getApiBaseUrl, getFileCategory, truncateFileName } from "../../ui/fileHelpers";

const GuestBundleDownload = () => {
  const { bundleCode } = useParams();
  const [bundle, setBundle] = useState(null);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const apiBaseUrl = getApiBaseUrl();

  useEffect(() => {
    const controller = new AbortController();

    const fetchBundle = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/files/guest-bundle/${bundleCode}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Shared bundle not found");
        }

        const data = await res.json();
        setBundle(data);
        setIsLoading(false);

        if (data.isPasswordProtected) {
          toast.info("🔒 This shared bundle is password protected. Please enter the password.");
        } else {
          setIsVerified(true);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      }
    };

    fetchBundle();
    return () => controller.abort();
  }, [apiBaseUrl, bundleCode]);

  const detailItems = useMemo(
    () => [
      {
        label: "Uploaded by",
        value: bundle?.uploadedBy || "Unknown",
        icon: FaUser,
      },
      {
        label: "Shared on",
        value: bundle?.createdAt ? new Date(bundle.createdAt).toLocaleDateString() : "Unknown",
        icon: FaCalendarAlt,
      },
      {
        label: "Files included",
        value: `${bundle?.files?.length || 0}`,
        icon: FaFileAlt,
      },
      {
        label: "Total size",
        value: formatFileSize((bundle?.files || []).reduce((sum, file) => sum + (file.size || 0), 0)),
        icon: FaDownload,
      },
    ],
    [bundle]
  );

  const verifyBundle = async () => {
    if (!password) {
      toast.warn("Please enter a password.");
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/files/verifyGuestBundlePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleCode, password }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("✅ Password verified! You can now access the files.");
        setIsVerified(true);
      } else {
        toast.error("❌ Incorrect password. Try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (error) {
    return <div className="rounded-[28px] border border-mid bg-white/80 px-6 py-8 text-center text-ink">{error}</div>;
  }

  if (isLoading || !bundle) {
    return <div className="rounded-[28px] border border-mid bg-white/80 px-6 py-8 text-center text-ink">Loading...</div>;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="rounded-[32px] border border-mid bg-white/82 p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/65">Bundle details</p>
        <div className="mt-4 grid gap-3">
          {detailItems.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-[22px] border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.9),rgba(248,226,186,0.18))] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-mid bg-deep/10 text-ink">
                  <Icon className="text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-ink">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {bundle.isPasswordProtected && !isVerified ? (
          <div className="mt-6 rounded-[24px] border border-mid bg-[linear-gradient(180deg,rgba(248,226,186,0.25),rgba(255,253,248,0.86))] p-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Enter password</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-mid bg-white px-4 py-3 text-sm text-ink"
              />
            </label>
            <button
              onClick={verifyBundle}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#95bdd7,#78a4cb)] px-4 py-3 text-sm font-semibold text-ink"
            >
              <FaLock className="text-xs" />
              Verify password
            </button>
          </div>
        ) : null}
      </aside>

      <article className="rounded-[32px] border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.86),rgba(248,226,186,0.24))] p-5 sm:p-6">
        <div className="border-b border-mid pb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/65">Files in this share</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">Guest file bundle</h2>
          <p className="mt-3 text-sm text-ink/75">
            {bundle.isPasswordProtected && !isVerified
              ? "Verify the shared password to reveal the files in this bundle."
              : "Every guest file from this upload is listed below and ready to open or download."}
          </p>
        </div>

        {bundle.isPasswordProtected && !isVerified ? (
          <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-mid bg-white/70 px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-mid bg-deep/10 text-ink">
              <FaLock />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-ink">Bundle locked</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-ink/70">
              Enter the shared password to access all files in this common link.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {bundle.files.map((file) => (
              <div key={file._id || file.id} className="flex flex-col gap-4 rounded-[24px] border border-mid bg-white/78 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink" title={file.name}>
                    {truncateFileName(file.name, 52)}
                  </p>
                  <p className="mt-1 text-xs text-ink/70">
                    {formatFileSize(file.size)} · {file.type || getFileCategory(file.type || "")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={file.previewUrl || file.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-mid bg-white px-3 py-2 text-xs font-semibold text-ink"
                  >
                    <FaEye className="text-[11px]" />
                    Open
                  </a>
                  <a
                    href={file.downloadUrl || file.path}
                    download={file.name}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#95bdd7,#78a4cb)] px-3 py-2 text-xs font-semibold text-ink"
                  >
                    <FaDownload className="text-[11px]" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
};

export default GuestBundleDownload;
