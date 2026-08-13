import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCopy, FaDownload, FaEye, FaSearch, FaShareAlt, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { deleteFile, getUserFiles } from "../../redux/slice/file/fileThunk";
import EmptyState from "../ui/EmptyState";
import ExpirationBadge from "../ui/ExpirationBadge";
import FilePreviewModal from "../ui/FilePreviewModal";
import ShareModal from "../ui/ShareModal";
import { formatFileSize, formatUploadedAt, getFileCategory, getFileDownloadUrl, getPrimarySharePath, truncateFileName } from "../ui/fileHelpers";

const FileShow = ({ globalSearchTerm, setGlobalSearchTerm }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { files, loading } = useSelector((state) => state.file);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserFiles(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [globalSearchTerm, filterType, filterStatus]);

  useEffect(() => {
    setSelectedFileIds([]);
  }, [globalSearchTerm, filterType, filterStatus, files]);

  const filteredFiles = useMemo(() => {
    return (files || []).filter((file) => {
      const matchesGlobalSearch = file.name?.toLowerCase().includes((globalSearchTerm || "").toLowerCase());
      const category = getFileCategory(file.type || "");
      const matchesType = filterType ? category === filterType : true;
      const isExpired = file.expiresAt ? new Date(file.expiresAt) <= new Date() : false;
      const matchesStatus =
        filterStatus === "expired" ? isExpired : filterStatus === "active" ? !isExpired : true;

      return matchesGlobalSearch && matchesType && matchesStatus;
    });
  }, [files, globalSearchTerm, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / 8));
  const pageFiles = filteredFiles.slice((currentPage - 1) * 8, currentPage * 8);
  const fileTypes = [...new Set((files || []).map((file) => getFileCategory(file.type || "")))];
  const selectedPageFiles = pageFiles.filter((file) => selectedFileIds.includes(file._id));
  const areAllPageFilesSelected = pageFiles.length > 0 && selectedPageFiles.length === pageFiles.length;

  const handleDelete = async (fileId) => {
    try {
      await dispatch(deleteFile(fileId)).unwrap();
      toast.success("File deleted");
      dispatch(getUserFiles(user._id));
    } catch (error) {
      toast.error(error?.message || error?.error || "Delete failed");
    }
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

  const toggleSelectAllPageFiles = () => {
    if (areAllPageFilesSelected) {
      setSelectedFileIds((current) => current.filter((id) => !pageFiles.some((file) => file._id === id)));
      return;
    }

    setSelectedFileIds((current) => [
      ...new Set([...current, ...pageFiles.map((file) => file._id)]),
    ]);
  };

  const openBundleShare = (filesToShare, label) => {
    if (!filesToShare.length) {
      toast.info("Select files to share first.");
      return;
    }

    if (filesToShare.length === 1) {
      setShareFile({
        ...filesToShare[0],
        name: filesToShare[0].name,
        shortUrl: filesToShare[0].bundleShortUrl || filesToShare[0].shortUrl,
      });
      return;
    }

    const bundleLinks = [...new Set(filesToShare.map((file) => file.bundleShortUrl).filter(Boolean))];

    if (bundleLinks.length !== 1) {
      toast.info("These files need to be uploaded together in one batch to share with one common link.");
      return;
    }

    setShareFile({
      name: `${filesToShare.length} files`,
      shortUrl: bundleLinks[0],
      bundleShortUrl: bundleLinks[0],
      type: "bundle",
    });
    toast.success(`${label} ready to share`);
  };

  return (
    <section className="mt-6 rounded-[28px] border border-[rgba(120,164,203,0.6)] bg-[rgba(233,247,251,0.74)] p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink">File library</p>
          <h3 className="mt-1.5 text-xl font-semibold text-ink">Manage uploaded files</h3>
          <p className="mt-1.5 text-xs text-ink/80 sm:text-sm">
            Filter by type or status, preview any file, and share or remove items in one place.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => openBundleShare(pageFiles, "Visible files")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(120,164,203,0.5)] bg-white px-3 py-2 text-[11px] font-semibold text-ink hover:bg-[rgba(233,247,251,0.88)]"
          >
            <FaShareAlt className="text-[11px]" />
            Share all once
          </button>
          <button
            type="button"
            onClick={() => openBundleShare(selectedPageFiles, "Selected files")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(120,164,203,0.5)] bg-[linear-gradient(180deg,#9cc6dc,#84afd1)] px-3 py-2 text-[11px] font-semibold text-ink"
          >
            <FaShareAlt className="text-[11px]" />
            Share selected once
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_168px_168px_auto]">
        <label className="relative block">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/80" />
          <input
            value={globalSearchTerm}
            onChange={(event) => setGlobalSearchTerm(event.target.value)}
            placeholder="Search by file name"
            className="w-full rounded-xl border border-[rgba(120,164,203,0.5)] bg-white px-11 py-2.5 text-sm text-ink placeholder:text-ink/45"
          />
        </label>

        <select
          value={filterType}
          onChange={(event) => setFilterType(event.target.value)}
          className="rounded-xl border border-[rgba(120,164,203,0.5)] bg-white px-4 py-2.5 text-sm text-ink"
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
          className="rounded-xl border border-[rgba(120,164,203,0.5)] bg-white px-4 py-2.5 text-sm text-ink"
        >
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>

        <div className="rounded-xl border border-[rgba(120,164,203,0.5)] bg-[rgba(180,225,235,0.3)] px-4 py-2.5 text-sm text-ink/75">
          Showing <span className="font-semibold text-ink">{filteredFiles.length}</span> files
          {selectedFileIds.length > 0 ? (
            <span className="ml-2 text-ink/60">· {selectedFileIds.length} selected</span>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4">
          <div className="h-20 rounded-3xl skeleton-shimmer" />
          <div className="h-20 rounded-3xl skeleton-shimmer" />
          <div className="h-20 rounded-3xl skeleton-shimmer" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            eyebrow="Nothing here yet"
            title="Your workspace is empty"
            description="Upload your first file to start generating secure links, previews, and expiry-controlled shares."
          />
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-[26px] border border-[rgba(120,164,203,0.58)] bg-[rgba(214,236,244,0.88)]">
          <div className="overflow-x-auto">
            <div className="min-w-[940px] w-full">
              <div className="hidden w-full grid-cols-[38px_minmax(260px,2.2fr)_minmax(80px,0.68fr)_minmax(80px,0.68fr)_minmax(92px,0.72fr)_minmax(116px,0.9fr)_minmax(236px,1.35fr)] gap-3 border-b border-[rgba(120,164,203,0.42)] bg-transparent px-4 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-ink md:grid">
                <label className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={areAllPageFilesSelected}
                    onChange={toggleSelectAllPageFiles}
                    className="h-4 w-4 rounded border-mid bg-white"
                    aria-label="Select all visible files"
                  />
                </label>
                <span>File</span>
                <span>Type</span>
                <span>Size</span>
                <span>Downloads</span>
                <span>Expiry</span>
                <span>Actions</span>
              </div>
              <div className="divide-y divide-[rgba(120,164,203,0.42)] bg-white">
                {pageFiles.map((file) => (
                  <div key={file._id} className="grid w-full gap-3 bg-white px-4 py-4 md:grid-cols-[38px_minmax(260px,2.2fr)_minmax(80px,0.68fr)_minmax(80px,0.68fr)_minmax(92px,0.72fr)_minmax(116px,0.9fr)_minmax(236px,1.35fr)] md:items-center">
                    <label className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedFileIds.includes(file._id)}
                        onChange={() => toggleFileSelection(file._id)}
                        className="h-3.5 w-3.5 rounded border-mid bg-white"
                        aria-label={`Select ${file.name}`}
                      />
                    </label>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[13px] font-semibold text-ink" title={file.name}>
                        {truncateFileName(file.name, 38)}
                      </p>
                      <p className="mt-1 text-[11px] text-ink/85">Uploaded {formatUploadedAt(file.createdAt)}</p>
                    </div>
                    <div className="text-[13px] font-medium text-ink/85">{getFileCategory(file.type || "")}</div>
                    <div className="text-[13px] font-medium text-ink/85">{formatFileSize(file.size)}</div>
                    <div className="text-[13px] font-medium text-ink/85">{file.downloadedContent || 0}</div>
                    <ExpirationBadge expiresAt={file.expiresAt} />
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setPreviewFile(file)} className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-[16px] border border-[rgba(120,164,203,0.56)] bg-white px-2.5 py-2 text-[11px] font-semibold text-ink hover:bg-[rgba(233,247,251,0.88)]">
                        <FaEye className="text-[11px]" />
                        Preview
                      </button>
                      <button type="button" onClick={() => setShareFile(file)} className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-[16px] border border-[rgba(120,164,203,0.56)] bg-white px-2.5 py-2 text-[11px] font-semibold text-ink hover:bg-[rgba(233,247,251,0.88)]">
                        <FaShareAlt className="text-[11px]" />
                        Share
                      </button>
                      <button type="button" onClick={() => handleCopyLink(getPrimarySharePath(file))} className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-[16px] border border-[rgba(120,164,203,0.56)] bg-white px-2.5 py-2 text-[11px] font-semibold text-ink hover:bg-[rgba(233,247,251,0.88)]">
                        <FaCopy className="text-[11px]" />
                        Copy link
                      </button>
                      <a href={getFileDownloadUrl(file)} download={file.name} target="_blank" rel="noreferrer" className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-[16px] border border-[rgba(120,164,203,0.56)] bg-white px-2.5 py-2 text-[11px] font-semibold text-ink hover:bg-[rgba(233,247,251,0.88)]">
                        <FaDownload className="text-[11px]" />
                        Download
                      </a>
                      <button type="button" onClick={() => handleDelete(file._id)} className="col-span-2 inline-flex min-w-0 items-center justify-center gap-1.5 rounded-[16px] border border-[rgba(234,168,168,0.42)] bg-[rgba(252,236,236,0.92)] px-2.5 py-2 text-[11px] font-semibold text-ink hover:bg-[rgba(250,228,228,0.98)]">
                        <FaTrashAlt className="text-[11px]" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredFiles.length > 8 ? (
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-2xl border border-mid bg-light/35 px-4 py-2 text-sm text-ink disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm text-ink">
            Page <span className="text-ink">{currentPage}</span> of {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-2xl border border-mid bg-light/35 px-4 py-2 text-sm text-ink disabled:opacity-50"
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

export default FileShow;
