// pages/Unauthorized/Unauthorized.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLockOutline, MdArrowBack } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const ROLE_HOME = {
  admin: "/admin/dashboard",
  reception: "/reception/dashboard",
  customer: "/customer/dashboard",
};

export default function Unauthorized() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const homePath = ROLE_HOME[user?.role] || "/";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#074C3A] px-4 font-sans">
      {/* Subtle diagonal texture, same language as the sidebar */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(209,254,23,0.04) 0px, rgba(209,254,23,0.04) 1px, transparent 1px, transparent 14px)",
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#D1FE17]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#D1FE17]/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_-20px_rgba(1,10,8,0.6)] backdrop-blur-sm">
          {/* Top accent strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#D1FE17] via-[#A6C400] to-[#D1FE17]" />

          <div className="flex flex-col items-center px-8 py-10 text-center">
            {/* Icon badge */}
            <div className="mb-6 grid h-20 w-20 place-items-center rounded-2xl border border-[#D1FE17]/30 bg-[#D1FE17]/10 shadow-[0_0_0_8px_rgba(209,254,23,0.04)]">
              <MdLockOutline size={36} className="text-[#D1FE17]" />
            </div>

            <span className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#D1FE17]">
              Error
            </span>

            <h1 className="mb-3 text-2xl font-bold text-[#F8FAEA]">
              Access Denied
            </h1>

            <p className="mb-8 max-w-xs text-sm leading-relaxed text-[#F8FAEA]/60">
              You don't have permission to view this page. It's reserved for
              a different role than the one on your account.
            </p>

            {/* Actions */}
            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate(homePath)}
                className="w-full rounded-xl bg-[#D1FE17] px-5 py-3 text-sm font-bold text-[#074C3A] shadow-[0_8px_20px_-4px_rgba(209,254,23,0.4)] transition-all duration-150 hover:bg-[#A6C400] hover:shadow-[0_10px_24px_-4px_rgba(209,254,23,0.5)] active:scale-[0.98]"
              >
                Take me to my dashboard
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-[#F8FAEA]/80 transition-colors duration-150 hover:bg-white/[0.06] hover:text-[#F8FAEA]"
              >
                <MdArrowBack size={16} /> Go back
              </button>
            </div>

            <Link
              to="/login"
              className="mt-6 text-xs font-medium text-[#F8FAEA]/40 underline-offset-4 hover:text-[#D1FE17] hover:underline"
            >
              Not you? Switch account
            </Link>
          </div>
        </div>

        {/* Footer tag */}
        <p className="mt-6 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-[#F8FAEA]/25">
          WowSewa console · secure area
        </p>
      </div>
    </div>
  );
}