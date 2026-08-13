import { differenceInCalendarDays, formatDistanceToNowStrict } from "date-fns";

export const formatFileSize = (size = 0) => {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  if (size >= 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return `${size} B`;
};

export const truncateFileName = (name = "", limit = 28) => {
  if (name.length <= limit) {
    return name;
  }

  const dotIndex = name.lastIndexOf(".");
  if (dotIndex <= 0) {
    return `${name.slice(0, limit - 3)}...`;
  }

  const extension = name.slice(dotIndex);
  const baseName = name.slice(0, dotIndex);
  const sliceLength = Math.max(limit - extension.length - 3, 6);
  return `${baseName.slice(0, sliceLength)}...${extension}`;
};

export const getFileExtension = (name = "") => {
  const dotIndex = name.lastIndexOf(".");
  return dotIndex >= 0 ? name.slice(dotIndex + 1).toUpperCase() : "FILE";
};

export const getFileCategory = (type = "") => {
  if (type.startsWith("image/")) {
    return "Image";
  }
  if (type.startsWith("video/")) {
    return "Video";
  }
  if (type.startsWith("audio/")) {
    return "Audio";
  }
  if (type.includes("pdf")) {
    return "PDF";
  }
  if (type.startsWith("text/")) {
    return "Text";
  }
  return "Document";
};

export const getPrimarySharePath = (file = {}) => file?.bundleShortUrl || file?.shortUrl || "";

export const getShareLinks = (shortUrl) => {
  const frontendBaseUrl = window.location.origin;
  const fullUrl = shortUrl?.startsWith("http")
    ? shortUrl
    : `${frontendBaseUrl}${shortUrl?.startsWith("/") ? shortUrl : `/${shortUrl || ""}`}`;

  return {
    copy: fullUrl,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Download file: ${fullUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent("Download file")}`,
    email: `mailto:?subject=Shared File&body=${encodeURIComponent(`Here is your file: ${fullUrl}`)}`,
    qr: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(fullUrl)}&size=220x220`,
  };
};

export const getExpiryDetails = (expiresAt) => {
  if (!expiresAt) {
    return {
      daysLeft: null,
      label: "No expiry",
      tone: "neutral",
      percent: 100,
      isExpired: false,
    };
  }

  const now = new Date();
  const end = new Date(expiresAt);
  const daysLeft = differenceInCalendarDays(end, now);
  const isExpired = daysLeft <= 0;
  const percent = Math.max(8, Math.min(100, ((daysLeft + 1) / 30) * 100));

  return {
    daysLeft,
    isExpired,
    percent,
    tone: isExpired ? "danger" : daysLeft <= 3 ? "warning" : "success",
    label: isExpired ? "Expired" : `${daysLeft}d left`,
  };
};

export const formatUploadedAt = (createdAt) =>
  createdAt
    ? formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true })
    : "Unknown";

export const getFilePreviewUrl = (file) =>
  file?.previewUrl || file?.url || file?.downloadUrl || file?.path || "";

export const getFileDownloadUrl = (file) =>
  file?.downloadUrl || file?.path || file?.url || file?.previewUrl || "";

export const getApiBaseUrl = () => {
  const configuredBase = (import.meta.env.VITE_API_URL || "/api/").trim().replace(/\/+$/, "");

  if (!configuredBase) {
    return "/api";
  }

  return configuredBase.endsWith("/api") ? configuredBase : `${configuredBase}/api`;
};

const officeExtensions = new Set([
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "csv",
]);

const textExtensions = new Set([
  "txt",
  "md",
  "json",
  "js",
  "jsx",
  "ts",
  "tsx",
  "css",
  "html",
  "xml",
  "yml",
  "yaml",
  "log",
]);

export const getPreviewKind = (file = {}) => {
  const type = file?.type || "";
  const extension = (file?.name?.split(".").pop() || "").toLowerCase();

  if (type.startsWith("image/")) {
    return "image";
  }

  if (type.startsWith("video/")) {
    return "video";
  }

  if (type.startsWith("audio/")) {
    return "audio";
  }

  if (type === "application/pdf" || extension === "pdf") {
    return "pdf";
  }

  if (type.startsWith("text/") || textExtensions.has(extension)) {
    return "text";
  }

  if (officeExtensions.has(extension)) {
    return "office";
  }

  return "document";
};

const isPublicViewerUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }

    if (
      hostname === "localhost"
      || hostname === "127.0.0.1"
      || hostname === "::1"
      || hostname.endsWith(".local")
      || hostname.startsWith("10.")
      || hostname.startsWith("192.168.")
      || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const canUseEmbeddedDocumentViewer = (file) => isPublicViewerUrl(getFilePreviewUrl(file));

export const getDocumentEmbedUrl = (file) => {
  const previewUrl = getFilePreviewUrl(file);

  if (!canUseEmbeddedDocumentViewer(file)) {
    return "";
  }

  const encodedUrl = encodeURIComponent(previewUrl);
  const extension = (file?.name?.split(".").pop() || "").toLowerCase();

  if (officeExtensions.has(extension)) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
  }

  return `https://docs.google.com/gview?embedded=1&url=${encodedUrl}`;
};
