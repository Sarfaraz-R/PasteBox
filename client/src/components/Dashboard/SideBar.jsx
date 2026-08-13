import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaChevronLeft, FaCog, FaHome, FaSignOutAlt, FaUpload } from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed, setActiveTab, activeTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const tabs = [
    { name: "Home", icon: FaHome, id: "home" },
    { name: "Upload Files", icon: FaUpload, id: "upload" },
    { name: "Profile", icon: FaCog, id: "profile" },
    { name: "Logout", icon: FaSignOutAlt, id: "logout" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 overflow-y-auto border-r border-mid bg-light/88 pb-5 pt-4 text-ink shadow-2xl backdrop-blur-xl transition-[width,transform] duration-300 md:translate-x-0 ${
        sidebarCollapsed ? "md:w-[72px]" : "md:w-[248px]"
      } ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className={`flex items-center ${sidebarCollapsed ? "justify-center px-2" : "justify-between px-3"} gap-3`}>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-mid bg-white/80 text-ink md:hidden"
          aria-label="Close sidebar"
        >
          <FaBars />
        </button>
        {!sidebarCollapsed && (
          <Link to="/" className="flex min-w-0 flex-1 items-center gap-2">
            <img src="/logo.png" alt="PasteBox logo" className="h-10 w-10 rounded-2xl object-contain" />
            <span className="truncate text-sm font-black tracking-[0.12em] text-ink">Workspace</span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-mid bg-white/80 text-ink md:inline-flex"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaChevronLeft className={`transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="mt-6 grid gap-2 px-2.5" aria-label="Dashboard navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              title={sidebarCollapsed ? tab.name : undefined}
              className={`flex w-full items-center rounded-2xl px-3 py-3 text-left text-sm font-semibold ${
                active
                  ? "border border-mid bg-deep/20 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                  : "border border-transparent text-ink hover:border-mid hover:bg-white/80 hover:text-ink"
              }`}
            >
              <span className={`flex items-center ${sidebarCollapsed ? "w-full justify-center" : "gap-3"}`}>
                <Icon className="text-base" />
                {!sidebarCollapsed && <span>{tab.name}</span>}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
