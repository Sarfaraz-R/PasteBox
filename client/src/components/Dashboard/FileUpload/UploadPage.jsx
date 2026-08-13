import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { uploadFile } from "../../../redux/slice/file/fileThunk";
import UploadPanel from "../../ui/UploadPanel";

const UploadPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.file);
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async ({ files, enablePassword, password, enableExpiry, expiryDate }) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("userId", user?._id || user?.id || "");
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
      const response = await dispatch(uploadFile(formData)).unwrap();
      toast.success("Files uploaded successfully");
      window.location.reload();
      return { ok: true, data: response };
    } catch (error) {
      toast.error(error?.error || "Upload failed");
      return { ok: false };
    }
  };

  return (
    <UploadPanel
      title="Upload new files with share-ready controls"
      subtitle="Queue multiple files, preview what is about to be sent, then add password protection or an expiration window before publishing the link."
      actionLabel="Upload to workspace"
      summaryLabel="Upload summary"
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default UploadPage;
