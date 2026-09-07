import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { fetchHook } from "../../../hooks/fetchHook";
import { fetchAPI } from "../../../utils/fetchAPI";
import { PageHead, Card, Pill, Avatar, useToast, ToastHost } from "../../../ui/ui";

// ---- Icons (from ReceptionPages.jsx) ---------------------------------------

const Ic = (d) => (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {d}
  </svg>
);
const PinIc = Ic(<><path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>);

// ---- Helpers (real-data normalizers) ---------------------------------------

function initials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function normalizeIndustry(raw) {
  return {
    id: raw.industryId ?? raw.IndustryId ?? raw.id ?? raw.Id,
    name: raw.industryName ?? raw.IndustryName ?? raw.name ?? raw.Name ?? "",
  };
}

function normalizeEmployee(raw) {
  return {
    id: raw.guidId ?? raw.GuidId ?? raw.id ?? raw.Id,
    name: raw.fullName ?? raw.FullName ?? raw.name ?? raw.Name ?? "",
    industryId: raw.industryId ?? raw.IndustryId ?? raw.industry?.industryId ?? null,
    industryName: raw.industryName ?? raw.IndustryName ?? raw.industry?.industryName ?? "Unassigned",
    employeeStatus: raw.employeeStatus ?? raw.EmployeeStatus,
  };
}

// Derives the kanban stage straight from the raw BookingStatus value that
// comes back on every SignalR "BookingUpdated" push and every initial fetch,
// so a single normalizer now covers both — no more per-endpoint "stage" tag.
function stageFromStatus(status) {
  if (status === "Completed" || status === 2) return "Done";
  if (status === "InProcess" || status === 1) return "In progress";
  return "New"; // Pending / 0
}

function normalizeBooking(raw) {
  const status = raw.bookingStatus ?? raw.BookingStatus ?? raw.status ?? raw.Status;
  return {
    id: raw.bookingId ?? raw.BookingId,
    code: raw.bookingCode ?? raw.BookingCode,
    customer: raw.customerName ?? raw.CustomerName,
    phone: raw.phoneNumber ?? raw.PhoneNumber,
    category: raw.industry?.industryName ?? raw.Industry?.IndustryName ?? "",
    industryId: raw.industryId ?? raw.IndustryId,
    service: raw.duty?.dutyName ?? raw.Duty?.DutyName ?? "",
    address: raw.address ?? raw.Address,
    date: raw.preferredDate ?? raw.PreferredDate,
    slot: raw.preferredTime ?? raw.PreferredTime,
    source: raw.source ?? raw.Source ?? "App",
    status,
    priority: raw.priority ?? raw.Priority ?? "normal",
    technicianId: raw.employeeId ?? raw.EmployeeId ?? raw.technicianId ?? raw.TechnicianId ?? null,
    technicianName:
      raw.technicianName ?? raw.TechnicianName ?? raw.employee?.fullName ?? raw.Employee?.FullName ?? null,
    stage: stageFromStatus(status),
  };
}

const COLS = [
  { key: "New", dot: "#C0392B" },
  { key: "In progress", dot: "#4E9C7F" },
  { key: "Done", dot: "#9db800" },
];

// Real BookingStatus enum member name the "Advance" button PATCHes to.
function nextRealStatus(stage) {
  if (stage === "In progress") return "Completed";
  return null;
}

const STATUS_LABEL = {
  available: "Available",
  "on-job": "On a job",
};

const HUB_URL = "https://localhost:7011/hub/notification"; // update to match Program.cs MapHub route

// ---- Component --------------------------------------------------------------

export default function ReceptionistPage() {
  const { toasts, push } = useToast();
  const [view, setView] = useState("queue");
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [advancingId, setAdvancingId] = useState(null);
  const [dismissingId, setDismissingId] = useState(null);

  // Bookings now live in local state, seeded once from the three status
  // endpoints and kept in sync live via SignalR — no reload() needed after
  // any mutation, since the server pushes the same update back to us.
  const [bookings, setBookings] = useState([]);
  const [bookingsSeeded, setBookingsSeeded] = useState(false);

  const { data: rawPending, loading: pendingLoading } = fetchHook(
    "https://localhost:7011/api/Booking/getAllPendingBookings"
  );
  const { data: rawInProgress, loading: inProgressLoading } = fetchHook(
    "https://localhost:7011/api/Booking/getAllInProgressBookings"
  );
  const { data: rawCompletedToday, loading: completedLoading } = fetchHook(
    "https://localhost:7011/api/Booking/todaysCompletedBookings"
  );
  const { data: rawEmployees, loading: staffLoading } = fetchHook(
    "https://localhost:7011/api/Employee/getEmployeesDetail"
  );
  const { data: rawIndustries, loading: industriesLoading } = fetchHook(
    "https://localhost:7011/api/industry/getIndustryData"
  );

  // Seed local booking state once all three lists have arrived. After this,
  // SignalR events are the only thing that mutate `bookings`.
  useEffect(() => {
    if (bookingsSeeded) return;
    if (pendingLoading || inProgressLoading || completedLoading) return;

    const seeded = [
      ...(rawPending || []),
      ...(rawInProgress || []),
      ...(rawCompletedToday || []),
    ].map(normalizeBooking);

    setBookings(seeded);
    setBookingsSeeded(true);
  }, [bookingsSeeded, pendingLoading, inProgressLoading, completedLoading, rawPending, rawInProgress, rawCompletedToday]);

  // ---- SignalR live sync ----------------------------------------------------
  const connectionRef = useRef(null);

  const upsertBooking = useCallback((raw) => {
    const updated = normalizeBooking(raw);
    setBookings((prev) => {
      const exists = prev.some((b) => b.id === updated.id);
      if (exists) return prev.map((b) => (b.id === updated.id ? updated : b));
      return [...prev, updated];
    });
    return updated;
  }, []);

  const removeBooking = useCallback((id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem("Token"),
      })
      .withAutomaticReconnect()
      .build()

    connection.on("BookingUpdated", (raw) => {
      const updated = upsertBooking(raw);
      push(`${updated.code} → ${updated.stage}`);
    });

    connection.on("BookingDeleted", (id) => {
      removeBooking(id);
    });

    connection.on("BookingNotification", (n) => {
      push(n?.message ?? "New booking received");
    });

    connection.start().catch((err) => {
      console.error("SignalR connection failed:", err);
    });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [upsertBooking, removeBooking, push]);

  const industries = useMemo(() => (rawIndustries || []).map(normalizeIndustry), [rawIndustries]);

  const todaysSchedule = useMemo(
    () => bookings.filter((b) => (b.stage === "In progress" && isToday(b.date)) || b.stage === "Done"),
    [bookings]
  );

  const technicians = useMemo(() => {
    const employees = (rawEmployees || []).map(normalizeEmployee);
    return employees.map((emp) => {
      const status =
        emp.employeeStatus === "Available" || emp.employeeStatus === 1
          ? "available"
          : "on-job";
      return {
        id: emp.id,
        name: emp.name,
        skill: emp.industryName,
        industryId: emp.industryId,
        status,
      };
    });
  }, [rawEmployees]);

  const availableTechs = useMemo(
    () => technicians.filter((t) => t.status === "available"),
    [technicians]
  );

  const counts = useMemo(
    () =>
      Object.fromEntries(
        COLS.map((c) => [c.key, bookings.filter((b) => b.stage === c.key).length])
      ),
    [bookings]
  );

  const toggleAssign = (id) => setOpenId((p) => (p === id ? null : id));


  async function assign(booking, technicianId) {
    setAssigningId(booking.id);
    const res = await fetchAPI(
      `https://localhost:7011/api/Booking/assignTechnician/${booking.id}?technicianId=${technicianId}`,
      "PATCH"
    );
    setAssigningId(null);
    setOpenId(null);

    if (!res) {
      window.alert("Couldn't assign this technician. Please try again.");
    }
  }

  async function advance(booking) {
    const next = nextRealStatus(booking.stage);
    if (!next) return;

    setAdvancingId(booking.id);
    const patchPayload = [{ op: "replace", path: "/BookingStatus", value: next }];
    const res = await fetchAPI(
      `https://localhost:7011/api/Booking/updateBookingDetails/${booking.id}`,
      "PATCH",
      patchPayload
    );
    setAdvancingId(null);

    if (!res) {
      window.alert("Couldn't advance this job. Please try again.");
    }
  }

  async function handleCancel(booking) {
    if (!window.confirm(`Cancel the booking for ${booking.customer}?`)) return;
    setDismissingId(booking.id);
    const res = await fetchAPI(`https://localhost:7011/api/Booking/deleteBooking/${booking.id}`, "DELETE");
    setDismissingId(null);

    if (!res) {
      window.alert("Couldn't cancel this booking. Please try again.");
    }
    // On success, "BookingDeleted" arrives over SignalR and removeBooking()
    // takes it out of state — no local removal needed here.
  }

  async function handleCreateBooking(form) {
    const payload = {
      dutyId: form.dutyId ? Number(form.dutyId) : null,
      industryId: form.industryId ? Number(form.industryId) : null,
      customerName: form.customer,
      phoneNumber: form.phone,
      address: form.address,
      preferredDate: form.date,
      preferredTime: form.slot,
      bookingDescription: form.notes || "",
      userId: null, // phone bookings have no logged-in customer account
    };

    const res = await fetchAPI("https://localhost:7011/api/Booking/addBooking", "POST", payload);

    if (!res) {
      window.alert("Couldn't create this booking. Please try again.");
      return;
    }

    const newBookingId = res?.bookingId ?? res?.BookingId ?? null;

    if (newBookingId && form.technicianId) {
      const assignRes = await fetchAPI(
        `https://localhost:7011/api/Booking/assignTechnician/${newBookingId}?technicianId=${form.technicianId}`,
        "PATCH"
      );
      if (!assignRes) {
        window.alert("Booking was created, but assigning the technician failed. You can assign them from the queue.");
        return;
      }
    }

    // AddBooking's controller currently doesn't broadcast the new booking's
    // full payload over SignalR (only a "BookingNotification" toast) — see
    // note below the code block for the one-line backend fix this needs.
    setShowNewBooking(false);
  }

  const isLoading = !bookingsSeeded || staffLoading || industriesLoading;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <PageHead
        eyebrow="Operations · Triage"
        title="Booking queue"
        sub="Assign a free technician to move a job into progress, then mark it complete when it's done."
      >
        <div className="flex items-center gap-2">
          <Pill tone="lime" pulse>
            {counts["New"] + counts["In progress"]} active
          </Pill>
          <button
            type="button"
            onClick={() => setShowNewBooking(true)}
            className="rounded-lg bg-[#074C3A] px-4 py-2 text-[13px] font-bold text-[#D1FE17] transition-transform duration-150 hover:-translate-y-0.5"
          >
            + Phone booking
          </button>
        </div>
      </PageHead>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex gap-2" role="tablist">
            {[
              { key: "queue", label: "Assignment queue" },
              { key: "schedule", label: "Today's schedule" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={view === t.key}
                onClick={() => setView(t.key)}
                className={`rounded-lg px-4 py-2 text-[13px] font-bold transition-colors ${
                  view === t.key ? "bg-[#074C3A] text-[#D1FE17]" : "bg-[#074C3A]/5 text-[#5C6B60] hover:bg-[#074C3A]/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <Card className="p-6">
              <p className="text-sm text-[#5C6B60]">Loading bookings…</p>
            </Card>
          ) : view === "queue" ? (
            <>
              <div className="mb-6 grid grid-cols-3 gap-4">
                {COLS.map((c) => (
                  <div key={c.key} className="relative overflow-hidden rounded-xl border border-[#E3E5D6] bg-white p-4">
                    <span className="absolute inset-y-0 left-0 w-1" style={{ background: c.dot }} aria-hidden="true" />
                    <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#5C6B60]">{c.key}</p>
                    <p className="mt-1.5 font-display text-2xl font-extrabold text-[#010A08]">{counts[c.key]}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {COLS.map((col) => {
                  const rows = bookings.filter((b) => b.stage === col.key);
                  return (
                    <div key={col.key} className="flex flex-col gap-3">
                      <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#5C6B60]">
                        <span className="h-2 w-2 rounded-full" style={{ background: col.dot }} aria-hidden="true" />
                        {col.key}
                      </p>
                      {rows.map((r) => {
                        const next = nextRealStatus(col.key);
                        return (
                          <Card
                            key={r.id}
                            className={`p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(1,10,8,0.35)] ${
                              openId === r.id ? "relative z-30" : "relative z-0"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[11px] font-bold text-[#9aa89d]">{r.code}</span>
                              {r.priority === "urgent" && <Pill tone="red">Urgent</Pill>}
                            </div>
                            <p className="mt-1.5 font-display text-[15.5px] font-extrabold text-[#010A08]">
                              {r.service} · {r.category}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#5C6B60]">
                              <PinIc className="h-3.5 w-3.5" /> {r.address} · {r.customer}
                            </p>
                            <p className="mt-0.5 text-[11.5px] text-[#5C6B60]">
                              {r.date} · {r.slot}
                            </p>

                            {col.key === "New" && (
                              <div className="relative mt-2">
                                <button
                                  onClick={() => toggleAssign(r.id)}
                                  className={`flex w-full items-center justify-center gap-1.5 rounded-md border-2 border-dashed px-2 py-1.5 text-[11.5px] font-bold transition-all duration-150 ${
                                    openId === r.id
                                      ? "border-[#074C3A] bg-[#074C3A] text-[#D1FE17]"
                                      : "border-[#E3E5D6] text-[#5C6B60] hover:border-[#074C3A] hover:text-[#074C3A]"
                                  }`}
                                >
                                  + Assign technician
                                </button>

                                {openId === r.id && (
                                  <div className="absolute left-0 top-full z-30 mt-1.5 w-60 overflow-hidden rounded-xl border border-[#E3E5D6] bg-white shadow-[0_24px_50px_-16px_rgba(1,10,8,0.35)]">
                                    <p className="flex items-center justify-between border-b border-[#E3E5D6] bg-[#F8FAEA]/60 px-3 py-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#5C6B60]">
                                      Assign {r.code} to
                                    </p>
                                    <div className="max-h-52 overflow-y-auto py-1">
                                      {availableTechs.length === 0 && (
                                        <p className="px-3 py-2 text-[12px] text-[#5C6B60]">No available technicians</p>
                                      )}
                                      {availableTechs.map((t) => (
                                        <button
                                          key={t.id}
                                          onClick={() => assign(r, t.id)}
                                          disabled={assigningId === r.id}
                                          className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors duration-150 hover:bg-[#F8FAEA]"
                                        >
                                          <Avatar name={t.name} size="h-7 w-7 text-[10px]" />
                                          <span className="min-w-0 flex-1">
                                            <span className="block truncate text-[12.5px] font-bold text-[#010A08]">{t.name}</span>
                                            <span className="block text-[10.5px] text-[#5C6B60]">{t.skill}</span>
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {col.key !== "New" && r.technicianName && (
                              <p className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-[#074C3A]">
                                <Avatar name={r.technicianName} size="h-6 w-6 text-[9px]" /> {r.technicianName}
                              </p>
                            )}

                            <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#E3E5D6] pt-3">
                              <button
                                type="button"
                                onClick={() => handleCancel(r)}
                                disabled={dismissingId === r.id}
                                className="text-[11px] font-bold text-[#C0392B] transition-colors hover:underline disabled:opacity-50"
                              >
                                {dismissingId === r.id ? "…" : "Cancel"}
                              </button>
                              {next && (
                                <button
                                  onClick={() => advance(r)}
                                  disabled={advancingId === r.id}
                                  className="rounded-md bg-[#074C3A] px-2.5 py-1 text-[11px] font-bold text-[#D1FE17] transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                                >
                                  {advancingId === r.id ? "…" : `Advance → ${next}`}
                                </button>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                      {counts[col.key] === 0 && (
                        <div className="grid h-24 place-items-center rounded-xl border-2 border-dashed border-[#E3E5D6] font-mono text-[11px] uppercase tracking-widest text-[#9aa89d]">
                          Empty
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {openId && <div className="fixed inset-0 z-20" onClick={() => setOpenId(null)} aria-hidden="true" />}
            </>
          ) : (
            <Card className="overflow-x-auto !p-0">
              {todaysSchedule.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#E3E5D6]">
                      {["Slot", "Service", "Customer / Technician", "Status", ""].map((h) => (
                        <th key={h} className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#5C6B60]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {todaysSchedule.map((row) => {
                      const next = nextRealStatus(row.stage);
                      return (
                        <tr key={row.id} className="border-b border-[#E3E5D6] transition-colors last:border-0 hover:bg-[#F8FAEA]">
                          <td className="px-5 py-3.5 font-mono text-[13px] font-bold text-[#074C3A]">{row.slot}</td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-[#010A08]">{row.service}</td>
                          <td className="px-5 py-3.5 text-sm text-[#5C6B60]">
                            {row.customer} · {row.technicianName || "Unassigned"}
                          </td>
                          <td className="px-5 py-3.5">
                            <Pill tone={row.stage === "Done" ? "lime" : "amber"}>{row.stage === "Done" ? "Completed" : "In progress"}</Pill>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {next && (
                              <button
                                type="button"
                                onClick={() => advance(row)}
                                disabled={advancingId === row.id}
                                className="rounded-lg bg-[#074C3A] px-3.5 py-1.5 text-[12px] font-bold text-[#D1FE17] transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                              >
                                {advancingId === row.id ? "…" : `→ ${next}`}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-10 text-center">
                  <p className="mb-1.5 font-display text-base font-bold text-[#074C3A]">Nothing in progress yet</p>
                  <p className="text-sm text-[#5C6B60]">Jobs that are in progress or completed today will show up here.</p>
                </div>
              )}
            </Card>
          )}
        </div>

        <aside>
          <Card className="py-5 px-3">
            <h2 className="font-display text-base font-bold text-[#010A08]">Technicians</h2>
            {staffLoading ? (
              <p className="mt-3 text-sm text-[#5C6B60]">Loading roster…</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2.5">
                {technicians.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 border-b border-dashed border-[#E3E5D6] pb-2.5 last:border-0 last:pb-0"
                  >
                    <Avatar name={t.name} size="h-9 w-9 text-[11px]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-[#010A08]">{t.name}</p>
                      <p className="truncate text-[11.5px] text-[#5C6B60]">{t.skill}</p>
                    </div>
                    <Pill tone={t.status === "available" ? "lime" : "muted"}>{STATUS_LABEL[t.status]}</Pill>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>

      {showNewBooking && (
        <NewBookingModal
          industries={industries}
          technicians={technicians}
          onClose={() => setShowNewBooking(false)}
          onCreate={handleCreateBooking}
        />
      )}

      <ToastHost toasts={toasts} />
    </div>
  );
}

// ---- Phone booking modal (unchanged real-API flow) -------------------------

function NewBookingModal({ industries, technicians, onClose, onCreate }) {
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    industryId: industries[0]?.id ?? "",
    dutyId: "",
    address: "",
    date: "",
    slot: "",
    priority: "normal",
    technicianId: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.customer.trim() || !form.phone.trim() || !form.address.trim() || !form.slot.trim()) {
      return;
    }
    setSubmitting(true);
    await onCreate(form);
    setSubmitting(false);
  }

  const availableTechs = technicians.filter((t) => t.status === "available");
  const inputClass =
    "w-full rounded-lg border border-[#E3E5D6] bg-white px-3.5 py-2.5 text-[13.5px] font-semibold text-[#010A08] outline-none transition-colors focus:border-[#074C3A]";
  const labelClass =
    "mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#5C6B60]";

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-[#010A08]/55 p-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Create phone booking"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#E3E5D6] bg-[#F8FAEA] shadow-[0_24px_60px_-20px_rgba(1,10,8,0.4)]">
        <div className="flex items-center justify-between bg-[#074C3A] px-6 py-5">
          <h2 className="font-display text-base font-bold text-[#F8FAEA]">New phone booking</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-[#F8FAEA]">
            ×
          </button>
        </div>

        <form className="flex flex-col gap-4.5 p-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="m-customer">Customer name</label>
              <input id="m-customer" className={inputClass} value={form.customer} onChange={(e) => update("customer", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="m-phone">Phone number</label>
              <input id="m-phone" type="tel" className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="m-category">Category</label>
              <select id="m-category" className={inputClass} value={form.industryId} onChange={(e) => update("industryId", e.target.value)}>
                {industries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="m-notes">Service notes</label>
              <input
                id="m-notes"
                className={inputClass}
                value={form.notes}
                placeholder="e.g. Leak repair — kitchen sink"
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="m-address">Service address</label>
            <input id="m-address" className={inputClass} value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="m-date">Date</label>
              <input id="m-date" type="date" className={inputClass} value={form.date} onChange={(e) => update("date", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="m-slot">Requested slot</label>
              <input
                id="m-slot"
                className={inputClass}
                value={form.slot}
                placeholder="e.g. 4:00 PM – 6:00 PM"
                onChange={(e) => update("slot", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="m-priority">Priority</label>
              <select id="m-priority" className={inputClass} value={form.priority} onChange={(e) => update("priority", e.target.value)}>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="m-technician">
                Assign technician <span className="font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <select id="m-technician" className={inputClass} value={form.technicianId} onChange={(e) => update("technicianId", e.target.value)}>
                <option value="">Leave unassigned</option>
                {availableTechs.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — {t.skill}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#074C3A] px-5 py-2.5 text-[13.5px] font-bold text-[#D1FE17] transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitting ? "Adding…" : "Add to queue"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E3E5D6] px-5 py-2.5 text-[13.5px] font-bold text-[#074C3A] transition-colors hover:border-[#074C3A]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}