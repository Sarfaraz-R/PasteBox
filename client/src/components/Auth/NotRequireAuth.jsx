// src/components/NoRequireAuth.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const NoRequireAuth = () => {
  const { isLoggedIn, initialized } = useSelector((state) => state.auth);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-light px-6 py-10 text-ink">
        <div className="mx-auto max-w-4xl animate-pulse space-y-6">
          <div className="h-12 w-44 rounded-2xl bg-deep/20" />
          <div className="h-[520px] rounded-[24px] border border-mid bg-white/80" />
        </div>
      </div>
    );
  }

  return !isLoggedIn ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default NoRequireAuth;
