// src/components/RequireAuth.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const { isLoggedIn, initialized } = useSelector((state) => state.auth);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-light px-6 py-10 text-ink">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-12 w-48 rounded-2xl bg-deep/20" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-40 rounded-3xl border border-mid bg-white/80" />
            <div className="h-40 rounded-3xl border border-mid bg-white/80" />
            <div className="h-40 rounded-3xl border border-mid bg-white/80" />
          </div>
          <div className="h-96 rounded-3xl border border-mid bg-white/80" />
        </div>
      </div>
    );
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
