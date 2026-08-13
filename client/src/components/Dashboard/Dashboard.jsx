import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import StatsGrid from "./StatesGrid";
import UserProfile from "./UserProfile";
import UploadPage from "./FileUpload/UploadPage";
import FileShow from "./FileShow";
import Logout from "./Logout";
import Footer from "../Footer";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--primary-bg)] px-6 py-10 text-[var(--text-color)]">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-14 w-56 rounded-2xl skeleton-shimmer" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-40 rounded-3xl skeleton-shimmer" />
            <div className="h-40 rounded-3xl skeleton-shimmer" />
            <div className="h-40 rounded-3xl skeleton-shimmer" />
          </div>
          <div className="h-[420px] rounded-[24px] skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--text-color)]">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      {sidebarOpen && (
        <button className="fixed inset-0 z-30 bg-ink/25 md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar overlay" />
      )}
      <div className={`flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ${sidebarCollapsed ? "md:pl-[72px]" : "md:pl-[248px]"}`}>
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          globalSearchTerm={globalSearchTerm}
          setGlobalSearchTerm={setGlobalSearchTerm}
        />
        <main className="flex-1 px-4 pb-8 pt-32 sm:px-6 lg:px-8">
          {activeTab === "upload" && <UploadPage />}
          {activeTab === "profile" && <UserProfile />}
          {activeTab === "settings" && <UserProfile />}
          {activeTab === "logout" && <Logout />}
          {activeTab === "home" && (
            <>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink">Overview</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">Dashboard</h2>
              </div>
              <StatsGrid />
              <FileShow globalSearchTerm={globalSearchTerm} setGlobalSearchTerm={setGlobalSearchTerm} />
            </>
          )}
        </main>
        <Footer className="mt-auto border-t-0 bg-transparent px-4 pb-6 pt-0 sm:px-6 lg:px-8" compact />
      </div>
    </div>
    </>
  );
};

export default Dashboard;
