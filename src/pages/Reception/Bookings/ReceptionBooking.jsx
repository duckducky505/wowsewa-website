import React, { useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { fetchHook } from "../../../hooks/fetchHook";
import { fetchAPI } from "../../../utils/fetchAPI";
import {
  PageHead, Card, Pill, Field, Modal, GhostButton, LimeButton, inputCls,
  useToast, ToastHost, StatTile, EditIc, ClockIc, WalletIc,
} from "../../../ui/ui";

// ---- Helpers --------------------------------------------------------------

function normalizeIndustry(raw) {
  return {
    id: raw.industryId ?? raw.IndustryId ?? raw.id ?? raw.Id,
    name: raw.industryName ?? raw.IndustryName ?? raw.name ?? raw.Name ?? "",
  };
}

function normalizeBooking(raw) {
  return {
    id: raw.bookingId ?? raw.BookingId,
    code: raw.bookingCode ?? raw.BookingCode,
    customer: raw.customerName ?? raw.CustomerName,
    phone: raw.phoneNumber ?? raw.PhoneNumber,
    industryId: raw.industryId ?? raw.IndustryId,
    category: raw.industry?.industryName ?? raw.Industry?.IndustryName ?? "",
    service: raw.duty?.dutyName ?? raw.Duty?.DutyName ?? "",
    description: raw.description ?? raw.Description ?? raw.duty?.description ?? raw.duty?.Description ?? "",
    address: raw.address ?? raw.Address,
    date: raw.preferredDate ?? raw.PreferredDate,
    slot: raw.preferredTime ?? raw.PreferredTime,
    price: raw.duty?.price ?? raw.Duty?.Price ?? raw.price ?? 0,
    status: raw.bookingStatus ?? raw.BookingStatus,
    technicianName: raw.employee?.fullName ?? raw.Employee?.FullName ?? "Unassigned",
    notes: raw.notes ?? raw.Notes ?? "",
    createdAt: raw.createdDate ?? raw.CreatedDate,
  };
}

function normalizeStatus(raw, i) {
  if (typeof raw === "string") return raw;
  return raw.statusName ?? raw.StatusName ?? raw.name ?? raw.Name ?? `Status ${i + 1}`;
}

function emptyDraftFromBooking(b) {
  return {
    date: b.date,
    slot: b.slot,
    price: String(b.price ?? ""),
    status: b.status,
  };
}

function formatRs(value) {
  return `Rs ${Number(value || 0).toLocaleString()}`;
}

function statusTone(status) {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "lime";
  if (s === "cancelled") return "red";
  if (s === "inprocess" || s === "in progress") return "amber";
  return "muted";
}

const HUB_URL = "https://localhost:7011/hub/notification"; // must match Program.cs MapHub route

// ---- Component --------------------------------------------------------------

export default function ReceptionBookings() {
  const { toasts, push } = useToast();

  const { data: rawBookings, loading: bookingsLoading } = fetchHook(
    "https://localhost:7011/api/Booking/getBookings"
  );
  const { data: rawIndustries } = fetchHook("https://localhost:7011/api/industry/getIndustryData");
  const { data: rawStatuses } = fetchHook("https://localhost:7011/api/Booking/getBookingStatus");

  // Live updates (assignment, status changes, cancellations from other
  // screens) are layered over the fetched list as overrides keyed by id,
  // rather than reloading the whole page — same pattern as the booking
  // queue dashboard.
  const [overrides, setOverrides] = useState({});

  const bookings = useMemo(() => {
    return (rawBookings || []).map(normalizeBooking).map((b) => (overrides[b.id] ? { ...b, ...overrides[b.id] } : b));
  }, [rawBookings, overrides]);

  const industries = useMemo(() => (rawIndustries || []).map(normalizeIndustry), [rawIndustries]);
  const statusOptions = useMemo(() => (rawStatuses || []).map(normalizeStatus), [rawStatuses]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [viewingBooking, setViewingBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ---- SignalR live sync ------------------------------------------------
  useEffect(() => {
    // Must attach the auth token the same way every other authenticated
    // page's connection does — SignalR sends it as ?access_token=... on the
    // handshake since it can't set an Authorization header on a WebSocket
    // connection. Without this the hub rejects the connection with a 401
    // before any event can arrive.
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem("Token"),
      })
      .withAutomaticReconnect()
      .build();

    // Generic broadcast every BroadcastToRoles(...) call emits on the
    // backend — { entityType, action, message, data }. Only Booking events
    // are relevant here. VERIFY the actual event name/shape against a real
    // connected session — this is written against NotificationService's
    // call signature but hasn't been confirmed live.
    const handleEntityUpdate = (payload) => {
      const { entityType, action, message, data } = payload || {};
      if (entityType !== "Booking") return;

      if (action === "Deleted") {
        const id = data?.bookingId ?? data?.BookingId ?? data;
        setOverrides((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } else {
        const updated = normalizeBooking(data);
        setOverrides((prev) => ({ ...prev, [updated.id]: updated }));
      }
      if (message) push(message);
    };

    connection.on("EntityUpdated", handleEntityUpdate);

    connection.start().catch((err) => {
      console.error("SignalR connection failed:", err);
    });

    return () => {
      connection.stop();
    };
  }, [push]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (b.customer || "").toLowerCase().includes(q) ||
        (b.code || "").toLowerCase().includes(q) ||
        (b.phone || "").includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, search]);

  const statusCounts = useMemo(() => {
    const counts = { All: bookings.length };
    statusOptions.forEach((s) => {
      counts[s] = bookings.filter((b) => b.status === s).length;
    });
    return counts;
  }, [bookings, statusOptions]);

  const totalToday = useMemo(
    () => bookings.filter((b) => b.date === new Date().toISOString().split("T")[0]).length,
    [bookings]
  );
  const totalRevenue = useMemo(
    () => bookings.filter((b) => b.status === "Completed").reduce((s, b) => s + (Number(b.price) || 0), 0),
    [bookings]
  );

  function openView(booking) { setViewingBooking(booking); }
  function closeView() { setViewingBooking(null); }

  function openEdit(booking) {
    setEditingBooking(booking);
    setDraft(emptyDraftFromBooking(booking));
    setErrors({});
  }
  function closeEdit() {
    setEditingBooking(null);
    setDraft(null);
    setErrors({});
    setSubmitting(false);
  }

  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateDraft() {
    const next = {};
    if (!draft.date) next.date = "Choose a date";
    if (!draft.slot.trim()) next.slot = "Enter a time slot";
    const priceNum = Number(draft.price);
    if (draft.price === "" || Number.isNaN(priceNum) || priceNum < 0) {
      next.price = "Enter a valid price";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // A booking can't be marked Completed until a technician is assigned —
  // the backend posts a holding-sheet entry to that technician when a
  // booking completes, and rejects the transition if there's nobody to
  // post it to. Blocking it here avoids a round-trip that's guaranteed to
  // fail with an opaque error.
  const canMarkCompleted = Boolean(
    editingBooking?.technicianName && editingBooking.technicianName !== "Unassigned"
  );

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!validateDraft()) return;

    if (draft.status === "Completed" && !canMarkCompleted) {
      setErrors((prev) => ({ ...prev, status: "Assign a technician before marking this booking Completed" }));
      return;
    }

    setSubmitting(true);

    const patchPayload = [
      { op: "replace", path: "/PreferredDate", value: draft.date },
      { op: "replace", path: "/PreferredTime", value: draft.slot.trim() },
      { op: "replace", path: "/BookingStatus", value: draft.status },
    ];

    const res = await fetchAPI(
      `https://localhost:7011/api/Booking/updateBookingDetails/${editingBooking.id}`,
      "PATCH",
      patchPayload
    );
    setSubmitting(false);

    if (res) {
      // Apply locally too, don't rely solely on the SignalR round-trip —
      // and no full-page reload needed now that state updates in place.
      const updated = typeof res === "object" ? normalizeBooking(res) : { ...editingBooking, ...draft };
      setOverrides((prev) => ({ ...prev, [editingBooking.id]: updated }));
      push("Booking updated");
      closeEdit();
    } else {
      push("Couldn't update this booking. Please try again.", "red");
    }
  }

  return (
    <div>
      <PageHead
        eyebrow="Front desk · Bookings"
        title="All bookings"
        sub="Every booking on the platform, including cancelled ones."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile label="Total bookings" value={bookings.length} icon={ClockIc} tone="pine" />
        <StatTile label="Today" value={totalToday} icon={ClockIc} tone="lime" />
        <StatTile label="Completed revenue" value={totalRevenue} prefix="Rs. " icon={WalletIc} tone="pine" />
      </div>

      <Card className="mb-4 flex flex-col gap-3 !p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          className={`${inputCls} sm:max-w-xs`}
          placeholder="Search customer, phone or job code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search bookings"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("All")}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
              statusFilter === "All" ? "bg-[#074C3A] text-[#D1FE17]" : "bg-[#074C3A]/5 text-[#5C6B60] hover:bg-[#074C3A]/10"
            }`}
          >
            All ({statusCounts.All ?? 0})
          </button>
          {statusOptions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
                statusFilter === s ? "bg-[#074C3A] text-[#D1FE17]" : "bg-[#074C3A]/5 text-[#5C6B60] hover:bg-[#074C3A]/10"
              }`}
            >
              {s} ({statusCounts[s] ?? 0})
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#E3E5D6] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Date / Time</th>
                <th className="px-5 py-3">Technician</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingsLoading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-[#5C6B60]">Loading bookings…</td></tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#E3E5D6] transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA]">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-[#010A08]">{b.customer}</p>
                      <p className="text-xs text-[#5C6B60]">{b.phone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-[#010A08]">{b.service}</p>
                      <p className="text-xs text-[#5C6B60]">{b.code}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#5C6B60]">{b.category}</td>
                    <td className="px-5 py-3.5 text-sm text-[#5C6B60]">{b.date} · {b.slot}</td>
                    <td className="px-5 py-3.5 text-sm text-[#5C6B60]">{b.technicianName || "Unassigned"}</td>
                    <td className="px-5 py-3.5"><Pill tone={statusTone(b.status)}>{b.status}</Pill></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <GhostButton onClick={() => openView(b)} className="px-3 py-1.5">View</GhostButton>
                        <GhostButton onClick={() => openEdit(b)} className="px-3 py-1.5"><EditIc className="h-3.5 w-3.5" /> Edit</GhostButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-[#5C6B60]">No bookings found. Try a different status or search term.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {viewingBooking && (
        <Modal title={`Booking · ${viewingBooking.code}`} onClose={closeView} narrow>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">Work order</span>
            <Pill tone={statusTone(viewingBooking.status)}>{viewingBooking.status}</Pill>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-dashed border-[#E3E5D6] py-1.5"><dt className="text-[#5C6B60]">Customer</dt><dd className="font-semibold text-[#010A08]">{viewingBooking.customer || "—"}</dd></div>
            <div className="flex justify-between border-b border-dashed border-[#E3E5D6] py-1.5"><dt className="text-[#5C6B60]">Phone</dt><dd className="font-semibold text-[#010A08]">{viewingBooking.phone || "—"}</dd></div>
            <div className="flex justify-between border-b border-dashed border-[#E3E5D6] py-1.5"><dt className="text-[#5C6B60]">Address</dt><dd className="font-semibold text-[#010A08]">{viewingBooking.address || "—"}</dd></div>
            <div className="flex justify-between border-b border-dashed border-[#E3E5D6] py-1.5"><dt className="text-[#5C6B60]">Description</dt><dd className="font-semibold text-[#010A08]">{viewingBooking.description || "—"}</dd></div>
            <div className="flex justify-between border-b border-dashed border-[#E3E5D6] py-1.5"><dt className="text-[#5C6B60]">Technician</dt><dd className="font-semibold text-[#010A08]">{viewingBooking.technicianName || "Unassigned"}</dd></div>
            <div className="flex justify-between py-1.5"><dt className="text-[#5C6B60]">Price</dt><dd className="font-mono font-bold text-[#074C3A]">{formatRs(viewingBooking.price)}</dd></div>
          </dl>
        </Modal>
      )}

      {editingBooking && draft && (
        <Modal title={`Edit booking · ${editingBooking.code}`} onClose={closeEdit}>
          <form className="space-y-4" onSubmit={handleSaveEdit}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" error={errors.date}>
                <input type="date" className={inputCls} value={draft.date} onChange={(e) => updateDraft("date", e.target.value)} />
              </Field>
              <Field label="Time slot" error={errors.slot}>
                <input className={inputCls} value={draft.slot} onChange={(e) => updateDraft("slot", e.target.value)} placeholder="e.g. 4:00 PM – 6:00 PM" />
              </Field>
            </div>
            <Field label="Status" error={errors.status}>
              <select className={inputCls} value={draft.status} onChange={(e) => updateDraft("status", e.target.value)}>
                {statusOptions.map((s) => (
                  <option key={s} value={s} disabled={s === "Completed" && !canMarkCompleted}>
                    {s}{s === "Completed" && !canMarkCompleted ? " (assign a technician first)" : ""}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex items-center gap-2.5 pt-1">
              <LimeButton type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save changes"}</LimeButton>
              <GhostButton onClick={closeEdit}>Cancel</GhostButton>
            </div>
          </form>
        </Modal>
      )}

      <ToastHost toasts={toasts} />
    </div>
  );
}