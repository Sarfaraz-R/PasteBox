import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";
import UploadPanel from "../ui/UploadPanel";

const GuestFileUpload = ({ guestFiles, updateFiles }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ files, enablePassword, password, enableExpiry, expiryDate }) => {
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("hasExpiry", enableExpiry);
    formData.append("isPassword", enablePassword);

    if (enableExpiry && expiryDate) {
      const hours = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60));
      formData.append("expiresAt", hours);
    }

    if (enablePassword && password) {
      formData.append("password", password);
    }

    try {
      const response = await axiosInstance.post("/files/upload-guest", formData);
      const uploadedFiles = response?.data?.files || [];
      const nextFiles = [...guestFiles, ...uploadedFiles];
      updateFiles(nextFiles);
      toast.success("Files uploaded successfully");
      setLoading(false);
      return { ok: true, data: nextFiles };
    } catch (error) {
      const message = error?.code === "ERR_NETWORK"
        ? "Guest upload failed because the backend on http://localhost:6600 is not running or not reachable."
        : error?.response?.data?.message || error?.error || "Upload failed";
      toast.error(message);
      setLoading(false);
      return { ok: false };
    }
  };

  return (
    <UploadPanel
      title="Share files instantly, no signup required"
      subtitle="Upload files, add optional password or expiry, and create a guest link in seconds."
      actionLabel="Create guest share"
      summaryLabel="Guest queue"
      compact
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default GuestFileUpload;
