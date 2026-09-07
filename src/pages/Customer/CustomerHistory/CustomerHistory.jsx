import React, { useMemo, useState } from "react";
import { PageHead, Card, Pill, Tabs, useToast, ToastHost } from "../../../ui/ui";
import { fetchHook } from "../../../hooks/fetchHook";
import { useAuth } from "../../../context/AuthContext";

const StarIc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="m12 3 2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9 6.4 19.8l1.2-6.1L3 9.4l6.3-.8L12 3z" />
  </svg>
);

/* ---- helpers ------------------------------------------------------------ */
function normalizeBooking(raw) {
  return {
    id: raw.bookingId,
    code: raw.bookingCode,
    service: raw.duty?.dutyName ?? "",
    category: raw.industry?.industryName ?? "",
    date: raw.preferredDate,
    slot: raw.preferredTime,
    address: raw.address,
    price: raw.price,
    status: raw.bookingStatus ?? raw.status ?? "Completed",
    rated: raw.rating ?? raw.Rating ?? null,
    technicianName: raw.technicianName ?? raw.TechnicianName ?? "",
    notes: raw.notes ?? raw.Notes ?? "",
  };
}
function formatRs(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}
function HIST_TONE(status) {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "lime";
  if (s === "cancelled") return "red";
  return "amber";
}
function dayLabel(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CustomerBookingHistory() {
  const { user } = useAuth();
  const guidId = user?.guidId ?? null;
  const { toasts, push } = useToast();

  const { data: rawHistory, loading: historyLoading } = fetchHook(
    guidId ? `https://localhost:7011/api/Booking/history/getUserSpecificBooking/${guidId}` : null
  );
  const { data: rawCancelled, loading: cancelledLoading } = fetchHook(
    guidId ? `https://localhost:7011/api/Booking/cancelled/getUserSpecificBooking/${guidId}` : null
  );

  const [tab, setTab] = useState("All");
  const isLoading = historyLoading || cancelledLoading;

  const bookings = useMemo(() => {
    const completed = (rawHistory || []).map(normalizeBooking);
    const cancelled = (rawCancelled || []).map(normalizeBooking);
    return [...completed, ...cancelled].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rawHistory, rawCancelled]);

  const list = useMemo(() => {
    if (tab === "All") return bookings;
    return bookings.filter((b) => (b.status || "").toLowerCase() === tab.toLowerCase());
  }, [bookings, tab]);

  return (
    <div className="mx-auto w-full max-w-[40rem] px-4 py-6 sm:px-6">
      <PageHead
        eyebrow="Workspace · History"
        title="Booking history"
        sub="Every job WowSewa has run for you. Rate completed work to help your favourite technicians."
      />

      <div className="mb-6">
        <Tabs tabs={["All", "Completed", "Cancelled"]} active={tab} onChange={setTab} />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => <div key={i} className="ml-12 h-24 animate-pulse rounded-xl bg-[#ECEEE0]" />)}
        </div>
      ) : list.length > 0 ? (
        <div className="relative space-y-4 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-[2px] before:bg-[#E3E5D6]">
          {list.map((r) => {
            const tone = HIST_TONE(r.status);
            return (
              <Card key={r.code} className="relative ml-12 p-5 transition-all duration-200 hover:-translate-y-0.5">
                <span
                  className="absolute -left-[37px] top-6 grid h-9 w-9 place-items-center rounded-full border-4 border-[#F8FAEA]"
                  style={{ background: { lime: "#9db800", amber: "#E8A33D", red: "#C0392B" }[tone] }}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-extrabold text-[#010A08]">{r.service}</p>
                    <p className="font-mono text-[11.5px] text-[#5C6B60]">
                      {r.code} · {r.technicianName || "Unassigned"} · {dayLabel(r.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#074C3A]">{formatRs(r.price)}</span>
                    <Pill tone={tone}>{r.status}</Pill>
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-2 gap-x-6 gap-y-1.5 border-t border-dashed border-[#E3E5D6] pt-3.5 text-[12.5px] sm:grid-cols-4">
                  <div>
                    <p className="text-[#9aa89d]">Category</p>
                    <p className="font-bold text-[#010A08]">{r.category || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[#9aa89d]">Time slot</p>
                    <p className="font-bold text-[#010A08]">{r.slot || "—"}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <p className="text-[#9aa89d]">Address</p>
                    <p className="truncate font-bold text-[#010A08]">{r.address || "—"}</p>
                  </div>
                  {r.notes && (
                    <div className="col-span-2 sm:col-span-4">
                      <p className="text-[#9aa89d]">Notes</p>
                      <p className="font-bold text-[#010A08]">{r.notes}</p>
                    </div>
                  )}
                </div>

                {r.status?.toLowerCase() === "completed" && (
                  <div className="mt-3.5 flex items-center gap-2 border-t border-dashed border-[#E3E5D6] pt-3.5">
                    {r.rated != null ? (
                      <span className="text-[12.5px] font-bold text-[#074C3A]">★ You rated this {r.rated}/5</span>
                    ) : (
                      <>
                        <span className="text-[12.5px] font-semibold text-[#5C6B60]">Rate this job:</span>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => push("Rating coming soon from the dashboard")}
                            aria-label={`${n} star`}
                            className="transition-transform duration-150 hover:scale-125"
                          >
                            <StarIc className="h-5 w-5 text-[#d8dcc8]" />
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-14 text-center">
          <p className="font-display text-lg font-extrabold text-[#010A08]">Nothing here yet</p>
          <p className="mt-1 max-w-xs text-[13px] text-[#5C6B60]">
            Once you complete or cancel a booking, it'll show up in this list.
          </p>
        </Card>
      )}

      <ToastHost toasts={toasts} />
    </div>
  );
}