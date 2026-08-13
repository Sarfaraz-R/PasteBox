import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaAt, FaEnvelope, FaIdBadge, FaPen, FaTrashAlt, FaUserCircle } from "react-icons/fa";
import { deleteUser, updateUser } from "../../redux/slice/auth/authThunk";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userInitial = user?.fullname?.trim()?.charAt(0)?.toUpperCase() || "U";

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");

  const detailCards = useMemo(
    () => [
      {
        label: "Display name",
        value: user?.fullname || "Not available",
        icon: FaUserCircle,
      },
      {
        label: "Username",
        value: `@${user?.username || "workspace"}`,
        icon: FaAt,
      },
      {
        label: "Email",
        value: user?.email || "Not available",
        icon: FaEnvelope,
      },
      {
        label: "User ID",
        value: user?._id || "Not available",
        icon: FaIdBadge,
      },
    ],
    [user]
  );

  const handleUpdate = async () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    await dispatch(updateUser({ userId: user._id, username: newUsername.trim() }));
    toast.success("Profile updated");
    setEditModalOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteUser(user._id));
    toast.success("Account deleted");
    setDeleteModalOpen(false);
  };

  return (
    <section className="mx-auto mt-4 max-w-5xl rounded-[32px] border border-mid bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(149,189,215,0.22))] p-6 sm:p-8">
      <div className="flex flex-col gap-8">
        <div className="overflow-hidden rounded-[30px] border border-mid bg-white/62">
          <div className="h-28 bg-[radial-gradient(circle_at_left,rgba(249,232,162,0.35),transparent_30%),linear-gradient(90deg,rgba(149,189,215,0.42),rgba(180,225,235,0.18))]" />
          <div className="px-6 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex h-28 w-28 items-center justify-center rounded-[30px] border-4 border-white bg-[linear-gradient(180deg,rgba(149,189,215,0.95),rgba(120,164,203,0.9))] text-4xl font-black text-ink shadow-[0_18px_40px_rgba(60,93,120,0.16)]">
                  {userInitial}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink/55">User Profile</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-ink">{user?.fullname || "PasteBox user"}</h2>
                  <p className="mt-2 text-sm font-medium text-ink/75">@{user?.username || "workspace"}</p>
                  <p className="mt-1 text-sm text-ink/70">{user?.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#95bdd7,#78a4cb)] px-5 py-3 text-sm font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] hover:brightness-105"
                >
                  <FaPen className="text-xs" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-ink hover:bg-rose-400/15"
                >
                  <FaTrashAlt className="text-xs" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {detailCards.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-[26px] border border-mid bg-white/72 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-mid bg-deep/12 text-ink">
                  <Icon />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55">{label}</p>
                  <p className="mt-2 break-all text-base font-semibold text-ink">{value}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-[26px] border border-mid bg-white/62 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/55">Account controls</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink/75">
            <p>Update your username whenever you want a cleaner public identity for shared files.</p>
            <p>Deleting the account signs you out and permanently removes your profile access.</p>
          </div>
        </div>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-[28px] border border-mid bg-white p-6">
            <h3 className="text-xl font-semibold text-ink">Update Username</h3>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full rounded-2xl border border-mid bg-light/35 px-4 py-3 text-ink"
              placeholder="Enter your username"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-2xl border border-mid bg-light/35 px-3 py-2 text-xs text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="rounded-2xl bg-[linear-gradient(180deg,#95bdd7,#78a4cb)] px-4 py-2 text-xs font-semibold text-ink"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-[28px] border border-mid bg-white p-6">
            <h3 className="text-xl font-semibold text-ink">Confirm Deletion</h3>
            <p className="text-sm text-ink/75">Are you sure you want to permanently delete your account?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-2xl border border-mid bg-light/35 px-3 py-2 text-xs text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-2 text-xs font-semibold text-ink"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfile;
