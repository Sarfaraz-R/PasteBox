import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaArrowRight, FaCalendarAlt, FaEye, FaFileAlt, FaImage, FaLock, FaTrashAlt, FaUpload, FaVideo } from "react-icons/fa";
import { toast } from "react-toastify";
import FilePreviewModal from "./FilePreviewModal";
import { formatFileSize, getFileCategory, truncateFileName } from "./fileHelpers";

const acceptedTypes = ".jpg,.jpeg,.webp,.png,.mp4,.avi,.mov,.mkv,.mk3d,.mks,.mka,.pdf,.txt";

const iconMap = {
  Image: FaImage,
  Video: FaVideo,
  Audio: FaFileAlt,
  PDF: FaFileAlt,
  Text: FaFileAlt,
  Document: FaFileAlt,
};

const UploadPanel = ({
  title,
  subtitle,
  actionLabel,
  loading,
  onSubmit,
  onUploadSuccess,
  summaryLabel = "Ready to send",
  compact = false,
}) => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);
  const capacityUsed = Math.min((totalSize / (10 * 1024 * 1024)) * 100, 100);

  useEffect(() => {
    return () => {
      if (previewFile?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(previewFile.url);
      }
    };
  }, [previewFile]);

  const handleFiles = (incoming) => {
    const next = Array.from(incoming);
    const accepted = next.filter((file) => file.size <= 10 * 1024 * 1024);
    const rejectedCount = next.length - accepted.length;

    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted]);
      toast.success(`${accepted.length} file${accepted.length > 1 ? "s" : ""} added`);
    }

    if (rejectedCount > 0) {
      toast.error("Files larger than 10MB were skipped");
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please add at least one file");
      return;
    }

    if (enableExpiry && expiryDate && new Date(expiryDate) <= new Date()) {
      toast.error("Expiry must be in the future");
      return;
    }

    const result = await onSubmit({
      files,
      enablePassword,
      password,
      enableExpiry,
      expiryDate,
    });

    if (result?.ok) {
      setFiles([]);
      setEnablePassword(false);
      setPassword("");
      setEnableExpiry(false);
      setExpiryDate("");
      onUploadSuccess?.(result.data);
    }
  };

  const handleOpenPreview = (file) => {
    if (previewFile?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(previewFile.url);
    }

    setPreviewFile({
      ...file,
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
    });
  };

  const handleClosePreview = () => {
    if (previewFile?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(previewFile.url);
    }
    setPreviewFile(null);
  };

  return (
    <section className="overflow-hidden">
      <div
        className={`grid gap-8 p-6 lg:p-8 ${
          compact ? "grid-cols-1" : "xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1.3fr)_360px]"
        }`}
      >
        <div className="min-w-0">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFiles(event.dataTransfer.files);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`rounded-[28px] border border-dashed px-6 py-10 text-center transition ${
                isDragging
                  ? "border-deep/50 bg-[linear-gradient(180deg,rgba(255,253,248,0.86),rgba(210,223,234,0.48))] shadow-[0_0_0_1px_rgba(154,178,200,0.22)]"
                  : "border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.72),rgba(226,236,244,0.28))] hover:bg-white/65"
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-mid bg-[linear-gradient(180deg,rgba(154,178,200,0.18),rgba(240,211,157,0.14))] text-ink shadow-sm">
                <FaUpload />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink sm:text-lg">Drag files here or browse from your device</h3>
              <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-ink/75 sm:text-sm">
                Upload images, PDFs, videos, and text files up to 10MB each. Password protection and expiry controls are available before sending.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-ink/70 sm:text-xs">
                <span className="rounded-full border border-mid bg-white/72 px-3 py-1">Images, PDF, video, text</span>
                <span className="rounded-full border border-mid bg-white/72 px-3 py-1">10MB max per file</span>
                <span className="rounded-full border border-mid bg-white/72 px-3 py-1">Preview before share</span>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  inputRef.current?.click();
                }}
                className="mt-5 inline-flex items-center justify-center rounded-2xl border border-mid bg-deep px-4 py-2 text-[11px] font-semibold text-ink hover:bg-deep/90 sm:text-xs"
              >
                Browse files
              </button>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={acceptedTypes}
                className="hidden"
                onChange={(event) => handleFiles(event.target.files)}
              />
            </div>

            <div className="grid gap-4">
              <label className="rounded-3xl border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.72),rgba(226,236,244,0.3))] p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink sm:text-sm">
                      <FaLock className="text-ink" />
                      Password protection
                    </div>
                    <p className="mt-2 text-xs text-ink/75 sm:text-sm">Add a password before a recipient can download the files.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enablePassword}
                    onChange={(event) => setEnablePassword(event.target.checked)}
                    className="h-5 w-5 rounded border-mid bg-white text-ink focus:ring-deep"
                  />
                </div>
                {enablePassword ? (
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create password"
                    className="mt-4 w-full rounded-2xl border border-mid bg-white px-4 py-2 text-xs text-ink placeholder:text-ink/45 sm:text-sm"
                  />
                ) : null}
              </label>

              <label className="rounded-3xl border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.72),rgba(248,226,186,0.22))] p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink sm:text-sm">
                      <FaCalendarAlt className="text-ink" />
                      Expiration window
                    </div>
                    <p className="mt-2 text-xs text-ink/75 sm:text-sm">Auto-expire the share after a specific date and time.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableExpiry}
                    onChange={(event) => setEnableExpiry(event.target.checked)}
                    className="h-5 w-5 rounded border-mid bg-white text-ink focus:ring-deep"
                  />
                </div>
                {enableExpiry ? (
                  <input
                    type="datetime-local"
                    value={expiryDate}
                    onChange={(event) => setExpiryDate(event.target.value)}
                    className="mt-4 w-full rounded-2xl border border-mid bg-white px-4 py-2 text-xs text-ink sm:text-sm"
                  />
                ) : null}
              </label>
            </div>
          </div>
        </div>

        <aside className="min-w-0 flex flex-col rounded-[26px] border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.76),rgba(214,226,236,0.42))] p-4 shadow-[0_20px_50px_rgba(31,41,55,0.08)] backdrop-blur-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">{summaryLabel}</p>
            <p className="mt-1 text-xs text-ink/70">Your share details update live as files are added.</p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <div className="rounded-2xl border border-mid bg-white/86 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-ink/60">Files</p>
                <p className="mt-1.5 text-xl font-bold text-ink transition-all duration-300">{files.length}</p>
              </div>

              <div className="rounded-2xl border border-mid bg-white/86 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-ink/60">Total size</p>
                <p className="mt-1.5 text-xl font-bold text-ink transition-all duration-300">{formatFileSize(totalSize)}</p>
              </div>

              <div className="rounded-2xl border border-mid bg-white/86 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-ink/60">Capacity used</p>
                    <p className="mt-1.5 text-xl font-bold text-ink transition-all duration-300">{Math.round(capacityUsed)}%</p>
                  </div>
                  <div className="relative h-10 w-10 shrink-0">
                    <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
                      <path
                        d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 1 1 0-31"
                        fill="none"
                        stroke="rgba(149,189,215,0.35)"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 1 1 0-31"
                        fill="none"
                        stroke="rgb(120, 164, 203)"
                        strokeWidth="3"
                        strokeDasharray={`${capacityUsed}, 100`}
                        pathLength="100"
                        className="transition-all duration-300"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-mid/35">
                  <div className="h-full rounded-full bg-deep transition-all duration-300" style={{ width: `${capacityUsed}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex-1">
            {files.length === 0 ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[24px] border border-dashed border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.68),rgba(226,236,244,0.26))] px-5 py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-mid bg-deep/10 text-ink">
                  <FaUpload />
                </div>
                <p className="mt-3 text-sm font-semibold text-ink">No files queued yet</p>
                <p className="mt-1.5 max-w-xs text-xs leading-5 text-ink/65 sm:text-sm">
                  Your selected files will appear here with previews and quick remove actions.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file, index) => {
                  const category = getFileCategory(file.type || "");
                  const Icon = iconMap[category] || FaFileAlt;
                  return (
                    <div key={`${file.name}-${index}`} className="flex items-center gap-2.5 rounded-[22px] border border-mid bg-white/78 p-2.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-mid bg-deep/10">
                        {file.type?.startsWith("image/") ? (
                          <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
                        ) : (
                          <Icon className="text-ink" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-[11px] text-ink sm:text-xs" title={file.name}>
                          {truncateFileName(file.name)}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-ink/80 sm:text-[11px]">
                          <span>{category}</span>
                          <span className="h-1 w-1 rounded-full bg-deep/60" />
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(file)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-mid bg-deep/10 text-ink hover:bg-deep/20"
                          aria-label={`Preview ${file.name}`}
                        >
                          <FaEye />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-danger/40 bg-danger/15 text-danger hover:bg-danger/25"
                          aria-label={`Remove ${file.name}`}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-mid/70 pt-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading || files.length === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-deep px-4 py-2.5 text-[11px] font-semibold text-ink hover:bg-deep/90 disabled:cursor-not-allowed disabled:opacity-45 sm:text-xs"
            >
              <span>{loading ? "Uploading..." : actionLabel}</span>
              <FaArrowRight />
            </button>
          </div>
        </aside>
      </div>

      <FilePreviewModal file={previewFile} onClose={handleClosePreview} />
    </section>
  );
};

export default UploadPanel;
