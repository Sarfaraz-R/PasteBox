import React, { useState } from "react";
import { FaCheck, FaDownload, FaEnvelope, FaLink, FaQrcode, FaTelegramPlane, FaTimes, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import { getPrimarySharePath, getShareLinks } from "./fileHelpers";

const shareItems = [
  { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, iconClass: "text-ink" },
  { key: "telegram", label: "Telegram", icon: FaTelegramPlane, iconClass: "text-ink" },
  { key: "email", label: "Email", icon: FaEnvelope, iconClass: "text-ink" },
];

const ShareModal = ({ file, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!file) {
    return null;
  }

  const links = getShareLinks(getPrimarySharePath(file));

  const downloadQRCode = async () => {
    try {
      const response = await fetch(links.qr);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `${file.name || "pastebox"}-qr.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("QR download failed");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(links.copy);
    setCopied(true);
    toast.success("Share link copied");
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    /* Scroll the backdrop on short screens so the modal never overlaps off-canvas content. */
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-ink/35 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center py-2">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-mid bg-white shadow-[0_32px_120px_rgba(31,41,55,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-mid bg-[radial-gradient(circle_at_top,rgba(249,232,162,0.55),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(180,225,235,0.72))] p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-ink">Share modal</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">{file.name}</h3>
            <p className="mt-2 text-sm text-ink/80">Send a clean share link or export a QR code for quick access.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-mid bg-deep/10 text-ink hover:bg-deep/18"
            aria-label="Close share modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="rounded-3xl border border-mid bg-light/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">Share link</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <div className="flex-1 break-all rounded-2xl border border-mid bg-white px-4 py-3 font-mono text-sm text-ink">
                  {links.copy}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-deep px-3 py-1.5 text-[11px] font-semibold text-ink hover:bg-deep/90 sm:text-xs"
                >
                  {copied ? <FaCheck /> : <FaLink />}
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {shareItems.map(({ key, label, icon: Icon, iconClass }) => (
                <a
                  key={key}
                  href={links[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-3xl border border-mid bg-white/85 p-4 hover:bg-mid/35"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-mid bg-deep/10 ${iconClass}`}>
                    <Icon />
                  </div>
                  <h4 className="mt-4 font-semibold text-ink">{label}</h4>
                  <p className="mt-1 text-sm text-ink/75">Open {label.toLowerCase()} with the ready-to-send file URL.</p>
                </a>
              ))}
            </div>
          </div>

          <aside className="rounded-[24px] border border-mid bg-light/35 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-mid bg-deep/10 text-ink">
                <FaQrcode />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">QR code</p>
                <p className="text-xs text-ink/75">Scan from mobile or desktop.</p>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] bg-white p-4">
              <img src={links.qr} alt="QR code" className="mx-auto h-52 w-52 rounded-2xl" />
            </div>

            <button
              type="button"
              onClick={downloadQRCode}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-mid bg-deep/10 px-3 py-1.5 text-[11px] font-semibold text-ink hover:bg-deep/18 sm:text-xs"
            >
              <FaDownload />
              Download QR
            </button>
          </aside>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ShareModal;
