import React from "react";

const WelcomeSection = ({ user }) => {
  const userInitial = user?.fullname?.trim()?.charAt(0)?.toUpperCase() || "U";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const greeting = getGreeting();

  return (
    <section className="premium-card relative mb-6 overflow-hidden p-8 text-ink animate-fade-in">
      <div className="relative z-10 flex items-center gap-6 flex-wrap">
        <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-mid bg-deep/12 shadow-soft">
          <span className="text-3xl font-black text-ink">{userInitial}</span>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink">{greeting}</p>
          <h1 className="mt-2 text-3xl font-black text-ink">{user?.fullname || "PasteBox user"}</h1>
          <p className="mt-1 text-ink/80">{user?.email}</p>
          <p className="text-sm text-ink">@{user?.username || "workspace"}</p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
