import { FaDownload, FaTimes } from "react-icons/fa";
import FilePreviewContent from "./FilePreviewContent";
import { formatFileSize, formatUploadedAt, getFileCategory, getFileDownloadUrl } from "./fileHelpers";

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) {
    return null;
  }

  const downloadUrl = getFileDownloadUrl(file);
  const category = getFileCategory(file.type || "");

  return (
    /* Make the modal scrollable and keep preview/sidebar inside the viewport on smaller screens. */
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-ink/35 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center py-2">
      <div className="grid max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-hidden rounded-[24px] border border-mid bg-white shadow-[0_24px_90px_rgba(31,41,55,0.16)] lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-h-[260px] items-center justify-center overflow-auto bg-[radial-gradient(circle_at_top,rgba(249,232,162,0.45),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(180,225,235,0.55))] p-4">
          <FilePreviewContent file={file} />
        </div>

        <aside className="flex max-h-full flex-col overflow-y-auto border-t border-mid bg-light/35 p-4 lg:border-l lg:border-t-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink">File preview</p>
              <h3 className="mt-1.5 line-clamp-2 text-lg font-semibold text-ink">{file.name}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mid bg-deep/10 text-ink hover:bg-deep/18"
              aria-label="Close preview"
            >
              <FaTimes />
            </button>
          </div>

          <div className="mt-4 grid gap-2.5">
            {[
              ["Type", category],
              ["Format", file.type || "Unknown"],
              ["Size", formatFileSize(file.size)],
              ["Uploaded", formatUploadedAt(file.createdAt)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-mid bg-white/80 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">{label}</p>
                <p className="mt-1 break-all font-mono text-xs text-ink">{value}</p>
              </div>
            ))}
          </div>

          <a
            href={downloadUrl}
            download={file.name}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-deep px-3 py-2 text-[11px] font-semibold text-ink hover:bg-deep/90 sm:text-xs"
          >
            <FaDownload />
            Download file
          </a>
        </aside>
      </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
