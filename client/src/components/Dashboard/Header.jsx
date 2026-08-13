import React from "react";
import { useSelector } from "react-redux";
import { FaBars, FaSearch } from "react-icons/fa";

const Header = ({ sidebarOpen, setSidebarOpen, sidebarCollapsed, globalSearchTerm, setGlobalSearchTerm }) => {
  const { user } = useSelector((state) => state.auth);
  const userInitial = user?.fullname?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className={`fixed right-0 top-0 z-50 border-b border-mid/70 bg-light/90 px-4 py-4 text-ink backdrop-blur-xl transition-[left] duration-300 ${sidebarCollapsed ? "md:left-[72px]" : "md:left-[248px]"} left-0`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-mid bg-deep/15 text-ink md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          <label className="relative hidden max-w-xl flex-1 lg:block">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/70" />
            <input
              type="text"
              value={globalSearchTerm}
              onChange={(event) => setGlobalSearchTerm(event.target.value)}
              placeholder="Search files by name"
              className="w-full rounded-2xl border border-mid bg-white/75 py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/45"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-mid bg-deep/15 text-sm font-black text-ink">
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
