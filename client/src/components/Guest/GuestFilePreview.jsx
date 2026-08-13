import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCopy,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaFilePdf,
  FaFolder,
  FaImage,
  FaInfoCircle,
  FaMusic,
  FaShareAlt,
  FaTrashAlt,
  FaTimes,
  FaVideo,
  FaFileWord,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";
import EmptyState from "../ui/EmptyState";
import ExpirationBadge from "../ui/ExpirationBadge";
import FilePreviewModal from "../ui/FilePreviewModal";
import ShareModal from "../ui/ShareModal";
import { formatFileSize, formatUploadedAt, getFileCategory, getPrimarySharePath, truncateFileName } from "../ui/fileHelpers";

const typeBadgeMap = {
  PDF: {
    icon: FaFilePdf,
    badgeClass: "bg-rose-400/15 text-rose-700 border-rose-300/60",
  },
  Image: {
    icon: FaImage,
    badgeClass: "bg-fuchsia-400/15 text-fuchsia-700 border-fuchsia-300/60",
  },
  Video: {
    icon: FaVideo,
    badgeClass: "bg-orange-400/15 text-orange-700 border-orange-300/60",
  },
  Audio: {
    icon: FaMusic,
    badgeClass: "bg-teal-400/15 text-teal-700 border-teal-300/60",
  },
  Archive: {
    icon: FaFolder,
    badgeClass: "bg-amber-400/15 text-amber-700 border-amber-300/60",
  },
  Docs: {
    icon: FaFileWord,
    badgeClass: "bg-blue-400/15 text-blue-700 border-blue-300/60",
  },
  Document: {
    icon: FaFileAlt,
    badgeClass: "bg-slate-400/15 text-slate-700 border-slate-300/60",
  },
};

const getGuestTypeMeta = (file) => {
  const extension = file?.name?.split(".").pop()?.toLowerCase() || "";
  const category = getFileCategory(file.type || "");

  if (extension === "zip" || extension === "rar" || extension === "7z") {
    return typeBadgeMap.Archive;
  }
  if (extension === "doc" || extension === "docx") {
    return typeBadgeMap.Docs;
  }
  if (category === "PDF") {
    return typeBadgeMap.PDF;
  }
  if (category === "Image") {
    return typeBadgeMap.Image;
  }
  if (category === "Video") {
    return typeBadgeMap.Video;
  }
  if (category === "Audio") {
    return typeBadgeMap.Audio;
  }

  return typeBadgeMap.Document;
};

const truncateMiddle = (name = "", front = 6, back = 10) => {
  if (name.length <= front + back + 3) {
    return name;
  }

  return `${name.slice(0, front)}...${name.slice(-back)}`;
};

const GuestFilePreview = ({ guestFiles }) => {
  const [files, setFiles] = useState(guestFiles || []);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showStorageBanner, setShowStorageBanner] = useState(true);

  useEffect(() => {
    setFiles(guestFiles || []);
  }, [guestFiles]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus]);

  useEffect(() => {
    setSelectedFileIds([]);
  }, [guestFiles, searchTerm, filterType, filterStatus]);

  const filteredFiles = useMemo(() => {
    return (files || []).filter((file) => {
      const matchesSearch = file.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const category = getFileCategory(file.type || "");
      const matchesType = filterType ? category === filterType : true;
      const isExpired = file.expiresAt ? new Date(file.expiresAt) <= new Date() : false;
      const matchesStatus =
        filterStatus === "expired" ? isExpired : filterStatus === "active" ? !isExpired : true;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [files, filterStatus, filterType, searchTerm]);

  const fileTypes = [...new Set((files || []).map((file) => getFileCategory(file.type || "")))];
  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / 8));
  const pageFiles = filteredFiles.slice((currentPage - 1) * 8, currentPage * 8);

  const handleDelete = (fileId) => {
    const nextFiles = files.filter((file) => (file._id || file.id) !== fileId);
    setFiles(nextFiles);
    setSelectedFileIds((current) => current.filter((id) => id !== fileId));
    localStorage.setItem("guestFiles", JSON.stringify(nextFiles));
    toast.success("File removed");
  };

  const handleCopyLink = async (shortUrl) => {
    const fullUrl = shortUrl?.startsWith("http") ? shortUrl : `${window.location.origin}${shortUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied");
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFileIds((current) =>
      current.includes(fileId)
        ? current.filter((id) => id !== fileId)
        : [...current, fileId]
    );
  };

  const openBundleShare = async (filesToShare, label) => {
    if (!filesToShare.length) {
      toast.info("Select guest files to share first.");
      return;
    }

    if (filesToShare.length === 1) {
      setShareFile({
        ...filesToShare[0],
        shortUrl: filesToShare[0].bundleShortUrl || filesToShare[0].shortUrl,
      });
      return;
    }

    const bundleLinks = [...new Set(filesToShare.map((file) => file.bundleShortUrl).filter(Boolean))];

    if (bundleLinks.length === 1) {
      setShareFile({
        name: `${filesToShare.length} guest files`,
        shortUrl: bundleLinks[0],
        bundleShortUrl: bundleLinks[0],
        type: "bundle",
      });
      toast.success(`${label} ready to share`);
      return;
    }

    try {
      const response = await axiosInstance.post("/files/createGuestBundleShare", {
        fileIds: filesToShare.map((file) => file._id || file.id),
      });

      const updatedFiles = response?.data?.files || [];
      const nextFiles = files.map((file) => {
        const match = updatedFiles.find((updated) => (updated._id || updated.id) === (file._id || file.id));
        return match ? { ...file, ...match } : file;
      });

      setFiles(nextFiles);
      localStorage.setItem("guestFiles", JSON.stringify(nextFiles));

      const sharedUrl = response?.data?.bundleShortUrl
        || updatedFiles[0]?.bundleShortUrl
        || updatedFiles[0]?.shortUrl
        || filesToShare[0]?.shortUrl;

      setShareFile({
        name: `${filesToShare.length} guest files`,
        shortUrl: sharedUrl,
        bundleShortUrl: sharedUrl,
        type: "bundle",
      });
      toast.success(`${label} ready to share`);
    } catch (error) {
      toast.info(error?.response?.data?.error || "Unable to create one guest share link for these files.");
    }
  };

  const selectedPageFiles = pageFiles.filter((file) => selectedFileIds.includes(file._id || file.id));

  return (
    <section className="rounded-[24px] border border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.86),rgba(214,226,236,0.28))] p-3.5 shadow-soft sm:p-4">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink">Guest dashboard</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">Recent guest uploads on this device</h2>
            <p className="mt-1 max-w-2xl text-[11px] text-ink/75 sm:text-xs">
              Review locally stored uploads, filter by status, and manage guest links before they leave this device.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <button
              type="button"
              onClick={() => openBundleShare(pageFiles, "Visible guest files")}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-mid bg-white/88 px-3 py-2 text-[11px] font-semibold text-ink hover:bg-light/35"
            >
              <FaShareAlt className="h-3 w-3" />
              Share all once
            </button>
            <button
              type="button"
              onClick={() => openBundleShare(selectedPageFiles, "Selected guest files")}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-mid bg-[linear-gradient(180deg,#9cc6dc,#84afd1)] px-3 py-2 text-[11px] font-semibold text-ink"
            >
              <FaShareAlt className="h-3 w-3" />
              Share selected once
            </button>
          </div>
        </div>

        {showStorageBanner ? (
          <div className="relative rounded-[18px] border border-mid/70 bg-[linear-gradient(180deg,rgba(255,253,248,0.68),rgba(248,226,186,0.18))] px-3 py-3">
            <button
              type="button"
              onClick={() => setShowStorageBanner(false)}
                className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-ink/50 hover:bg-white/70 hover:text-ink"
              aria-label="Dismiss storage notice"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-start gap-3 pr-8">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl border border-mid/70 bg-white/70 text-ink/75">
                <FaInfoCircle />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink sm:text-sm">Stored on this device only</p>
                <p className="mt-1 text-xs leading-5 text-ink/65 sm:text-sm">
                  Guest uploads are tracked in LocalStorage. Create an account when you want persistent access across browsers and devices.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-md">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search guest files"
              className="w-full rounded-full border border-mid bg-white/88 px-4 py-2 text-[11px] text-ink placeholder:text-ink/45 sm:text-xs"
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              className="rounded-full border border-mid bg-white/88 px-4 py-2 text-[11px] text-ink sm:text-xs"
            >
              <option value="">All types</option>
              {fileTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="rounded-full border border-mid bg-white/88 px-4 py-2 text-[11px] text-ink sm:text-xs"
            >
              <option value="">All status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            eyebrow="Guest mode"
            title="No guest files yet"
            description="Upload a file above to generate a link, preview it, and keep it visible here on this device."
          />
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {pageFiles.map((file) => {
            const fileId = file._id || file.id;
            const isExpired = file.expiresAt ? new Date(file.expiresAt) <= new Date() : false;
            const downloads = file.downloadedContent || 0;
            const { icon: TypeIcon, badgeClass } = getGuestTypeMeta(file);
            const isSelected = selectedFileIds.includes(fileId);

            return (
              <article
                key={fileId}
                className={`rounded-[20px] border p-3 shadow-sm transition ${
                  isExpired ? "opacity-70" : "opacity-100"
                } ${isSelected ? "border-[rgba(120,164,203,0.8)] bg-[linear-gradient(180deg,rgba(236,247,251,0.95),rgba(214,226,236,0.28))]" : "border-mid bg-[linear-gradient(180deg,rgba(255,253,248,0.82),rgba(226,236,244,0.2))]"}`}
              >
                <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 gap-2.5">
                    <label className="mt-1 inline-flex shrink-0 items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFileSelection(fileId)}
                        className="h-3.5 w-3.5 rounded border-mid bg-white"
                        aria-label={`Select ${file.name}`}
                      />
                    </label>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${badgeClass}`}>
                      <TypeIcon className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="max-w-[220px] truncate text-[13px] font-semibold text-ink sm:max-w-[320px]" title={file.name}>
                        {truncateMiddle(file.name, 8, 12)}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-ink/60 sm:text-xs">
                        {formatFileSize(file.size)} · Uploaded {formatUploadedAt(file.createdAt)} · {downloads} downloads
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
                    {isExpired ? (
                      <span className="rounded-full border border-mid bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70">
                        Expired
                      </span>
                    ) : (
                      <ExpirationBadge expiresAt={file.expiresAt} />
                    )}
                    <button
                      type="button"
                      onClick={() => setPreviewFile(file)}
                      className="inline-flex items-center gap-1 rounded-full border border-mid bg-white/88 px-2.5 py-1 text-[10px] font-semibold text-ink hover:bg-light/35"
                      title={`Preview ${file.name}`}
                    >
                      <FaEye className="h-3 w-3" />
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareFile(file)}
                      className="inline-flex items-center gap-1 rounded-full border border-mid bg-white/88 px-2.5 py-1 text-[10px] font-semibold text-ink hover:bg-light/35"
                    >
                      <FaShareAlt className="h-3 w-3" />
                      Share
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(getPrimarySharePath(file))}
                      className="inline-flex items-center gap-1 rounded-full border border-mid bg-white/88 px-2.5 py-1 text-[10px] font-semibold text-ink hover:bg-light/35"
                    >
                      <FaCopy className="h-3 w-3" />
                      Copy link
                    </button>
                    <a
                      href={file.path}
                      download={file.name}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-mid bg-white/88 px-2.5 py-1 text-[10px] font-semibold text-ink hover:bg-light/35"
                    >
                      <FaDownload className="h-3 w-3" />
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(fileId)}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 text-[10px] font-semibold text-ink hover:bg-rose-400/15"
                    >
                      <FaTrashAlt className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-5 rounded-[20px] border border-mid bg-[linear-gradient(180deg,rgba(248,226,186,0.34),rgba(255,253,248,0.76))] p-3.5 shadow-sm">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold text-ink">Keep these files beyond this browser</p>
            <p className="mt-1 text-[11px] text-ink/70 sm:text-xs">
              Create an account for persistent storage, sharing history, and access across sessions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/signup" className="premium-button">
              Create account
            </Link>
            <Link to="/login" className="premium-button premium-button-secondary">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {filteredFiles.length > 8 ? (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-2xl border border-mid bg-light/35 px-3 py-1.5 text-xs text-ink disabled:opacity-50 sm:text-sm"
          >
            Previous
          </button>
          <p className="text-xs text-ink sm:text-sm">
            Page <span className="font-semibold">{currentPage}</span> of {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-2xl border border-mid bg-light/35 px-3 py-1.5 text-xs text-ink disabled:opacity-50 sm:text-sm"
          >
            Next
          </button>
        </div>
      ) : null}

      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      <ShareModal file={shareFile} onClose={() => setShareFile(null)} />
    </section>
  );
};

export default GuestFilePreview;
