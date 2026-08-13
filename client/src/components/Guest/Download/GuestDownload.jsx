import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaDownload, FaEye, FaFileAlt, FaLock, FaUser } from "react-icons/fa";
import FilePreviewContent from "../../ui/FilePreviewContent";
import { formatFileSize, getApiBaseUrl, getFileCategory } from "../../ui/fileHelpers";

const GuestDownload = () => {
  const { shortCode } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const downloadUrl = file?.downloadUrl || file?.path;
  const apiBaseUrl = getApiBaseUrl();

  useEffect(() => {
    const controller = new AbortController();

    const fetchFile = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/files/g/${shortCode}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("File not found");
        }

        const data = await res.json();
        setFile(data);
        setIsProtected(data.isPasswordProtected);
        setIsLoading(false);

        if (data.isPasswordProtected) {
          toast.info("🔒 This file is password protected. Please enter the password.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      }
    };

    fetchFile();
    return () => controller.abort();
  }, [apiBaseUrl, shortCode]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifyFile = async () => {
    if (!password) {
      toast.warn("Please enter a password.");
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/files/verifyGuestFilePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortCode, password }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("✅ Password verified! You can now download the file.");
        setIsVerified(true);
      } else {
        toast.error("❌ Incorrect password. Try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const detailItems = useMemo(
    () => [
      {
        label: "Uploaded by",
        value: file?.uploadedBy || "Unknown",
        icon: FaUser,
      },
      {
        label: "Uploaded on",
        value: file?.createdAt ? new Date(file.createdAt).toLocaleDateString() : "Unknown",
        icon: FaCalendarAlt,
      },
      {
        label: "File size",
        value: formatFileSize(file?.size || 0),
        icon: FaDownload,
      },
      {
        label: "File type",
        value: file?.type || getFileCategory(file || ""),
        icon: FaFileAlt,
      },
    ],
    [file]
  );

  if (error) {
    return <div className="rounded-[28px] border border-mid bg-white/80 px-6 py-8 text-center text-ink">{error}</div>;
  }

  if (isLoading || !file) {
    return <div className="rounded-[28px] border border-mid bg-white/80 px-6 py-8 text-center text-ink">Loading...</div>;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_360px]">
      <article className="overflow-hidden rounded-[32px] border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.86),rgba(248,226,186,0.24))]">
        <div className="border-b border-mid px-6 py-5 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/65">Guest file</p>
          <h2 className="mt-2 break-words text-2xl font-black tracking-tight text-ink sm:text-3xl">{file.name}</h2>
          <p className="mt-3 text-sm text-ink/75">
            {isProtected && !isVerified
              ? "Unlock this protected file to preview and download it."
              : "Preview the guest file before downloading it."}
          </p>
        </div>

        <div className="p-5 sm:p-6">
          {isProtected && !isVerified ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-mid bg-white/70 px-6 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-mid bg-deep/10 text-ink">
                <FaLock />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-ink">Password protected</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-ink/70">
                This guest file is protected. Enter the password below to unlock the preview and continue.
              </p>
            </div>
          ) : (
            <div className="rounded-[28px] border border-mid bg-white/78 p-3">
              <FilePreviewContent file={file} className="h-[420px] w-full rounded-[24px] bg-white" />
            </div>
          )}
        </div>
      </article>

      <aside className="rounded-[32px] border border-mid bg-white/82 p-5 sm:p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/65">File details</p>
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
        </div>

        {isProtected && !isVerified ? (
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
              onClick={verifyFile}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#95bdd7,#78a4cb)] px-4 py-3 text-sm font-semibold text-ink"
            >
              <FaLock className="text-xs" />
              Verify password
            </button>
          </div>
        ) : (
          <button
            onClick={handleDownload}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#95bdd7,#78a4cb)] px-4 py-3.5 text-sm font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
          >
            <FaDownload className="text-xs" />
            Download file
          </button>
        )}
      </aside>
    </section>
  );
};

export default GuestDownload;
