import { FaFileAlt } from "react-icons/fa";
import {
  canUseEmbeddedDocumentViewer,
  getDocumentEmbedUrl,
  getFileCategory,
  getFileDownloadUrl,
  getFilePreviewUrl,
  getPreviewKind,
} from "./fileHelpers";

const FilePreviewContent = ({ file, className = "h-[72vh] w-full rounded-2xl bg-white" }) => {
  if (!file) {
    return null;
  }

  const previewUrl = getFilePreviewUrl(file);
  const previewKind = getPreviewKind(file);

  if (previewKind === "image") {
    return <img src={previewUrl} alt={file.name} className="max-h-[72vh] w-auto rounded-2xl object-contain" />;
  }

  if (previewKind === "video") {
    return (
      <video controls className="max-h-[72vh] w-full rounded-2xl">
        <source src={previewUrl} type={file.type} />
      </video>
    );
  }

  if (previewKind === "audio") {
    return (
      <div className="w-full max-w-xl rounded-3xl border border-mid bg-light/35 p-8">
        <audio controls className="w-full">
          <source src={previewUrl} type={file.type} />
        </audio>
      </div>
    );
  }

  if (previewKind === "pdf") {
    return <iframe src={previewUrl} title={file.name} className={className} />;
  }

  if (previewKind === "text") {
    return <iframe src={previewUrl} title={file.name} className={className} />;
  }

  if (previewKind === "office" || previewKind === "document") {
    const embedUrl = getDocumentEmbedUrl(file);
    const downloadUrl = getFileDownloadUrl(file);
    const canEmbed = canUseEmbeddedDocumentViewer(file) && Boolean(embedUrl);

    if (!canEmbed) {
      return (
        <div className="flex max-w-md flex-col items-center gap-3 rounded-[24px] border border-dashed border-mid bg-light/35 px-5 py-7 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-deep/10 text-ink">
            <FaFileAlt />
          </div>
          <div className="max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink">
              {getFileCategory(file.type || "")}
            </p>
            <h3 className="mt-1.5 line-clamp-2 text-base font-semibold text-ink">{file.name}</h3>
            <p className="mt-2 text-xs leading-5 text-ink/75">
              Preview is unavailable for this document link, but the file is still ready to open or download.
            </p>
          </div>
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-deep px-4 py-2 text-xs font-semibold text-white transition hover:bg-deep/90"
            >
              Open file
            </a>
          )}
        </div>
      );
    }

    return (
      <div className="w-full">
        <iframe
          src={embedUrl}
          title={file.name}
          className={className}
          allow="fullscreen"
        />
        <p className="mt-3 text-center text-xs text-ink/70">
          Document preview is rendered in an embedded viewer.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-mid bg-light/35 px-8 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-deep/10 text-ink">
        <FaFileAlt />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ink">
          {getFileCategory(file.type || "")}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-ink">{file.name}</h3>
      </div>
    </div>
  );
};

export default FilePreviewContent;
