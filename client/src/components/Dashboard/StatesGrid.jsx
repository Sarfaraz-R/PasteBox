import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slice/auth/authThunk";
import { FaClock, FaDownload, FaFileAlt, FaImage, FaUpload, FaVideo } from "react-icons/fa";

const StatsGrid = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (user && user.id && !hasFetched.current) {
      dispatch(getUser(user.id));
      hasFetched.current = true;
    }
  }, [user, dispatch]);

  const cards = [
    {
      title: "Total Uploads",
      value: user?.totalUploads ?? 0,
      icon: FaUpload,
    },
    {
      title: "Total Downloads",
      value: user?.totalDownloads ?? 0,
      icon: FaDownload,
    },
    {
      title: "Videos Uploaded",
      value: user?.videoCount ?? 0,
      icon: FaVideo,
    },
    {
      title: "Images Uploaded",
      value: user?.imageCount ?? 0,
      icon: FaImage,
    },
    {
      title: "Documents Uploaded",
      value: user?.documentCount ?? 0,
      icon: FaFileAlt,
    },
    {
      title: "Last Login",
      value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A",
      icon: FaClock,
    },
  ].filter((card) => card.value !== undefined);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group rounded-[24px] border border-mid bg-white/72 p-5 transition hover:bg-mid/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">{card.title}</p>
                  <p className="mt-3 break-words text-2xl font-black text-ink">{card.value}</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-mid bg-deep/12 text-ink group-hover:text-ink">
                  <Icon />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsGrid;
