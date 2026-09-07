// pages/AdminDashboard/ReceivablePayablePage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHead, Card, Pill, SectionLabel, LimeButton, GhostButton, Tabs,
  Field, Modal, inputCls, useToast, ToastHost, CountUp, TONES,
  BackIc, PlusIc, EditIc, TrashIc,
} from "../../ui/ui";
import { fetchHook } from "../../hooks/fetchHook";
import { fetchAPI } from "../../utils/fetchAPI";

const blankForm = { date: "", name: "", type: "", totalAmount: "", paidAmount: "", method: "", status: "", note: "" };

function normalizeEntry(raw) {
  const total = Number(raw.totalAmount ?? raw.TotalAmount ?? 0);
  const paid = Number(raw.paidAmount ?? raw.PaidAmount ?? 0);
  const rawDate = raw.createdDate ?? raw.CreatedDate ?? "";
  return {
    id: raw.guidId ?? raw.GuidId,
    date: rawDate ? rawDate.split("T")[0] : "",
    name: raw.name ?? raw.Name ?? "",
    type: raw.recPay ?? raw.RecPay ?? "",
    totalAmount: total,
    paidAmount: paid,
    remaining: total - paid,
    method: raw.paymentMethod ?? raw.PaymentMethod ?? "",
    status: raw.status ?? raw.Status ?? deriveStatus(total, paid),
    note: raw.note ?? raw.Note ?? "",
  };
}
function deriveStatus(total, paid) {
  const remaining = Number(total || 0) - Number(paid || 0);
  if (remaining <= 0 && Number(total) > 0) return "Paid";
  if (Number(paid) > 0) return "Partial";
  return "Pending";
}
function rs(v) { return `Rs. ${Number(v || 0).toLocaleString()}`; }
const STATUS_TONE = { Paid: "pine", Partial: "amber", Pending: "red" };

export default function ReceivablePayablePage() {
  const navigate = useNavigate();
  const { toasts, push } = useToast();

  const { data: rawEntries, loading: entriesLoading } = fetchHook("https://localhost:7011/api/Receivable/getEntries");
  const { data: paymentType } = fetchHook("https://localhost:7011/api/Categories/get/Payment-Method-Values");
  const { data: typeOptions } = fetchHook("https://localhost:7011/api/Categories/get/RecPay-Type");
  const { data: statusOptions } = fetchHook("https://localhost:7011/api/Categories/get/Status");

  const entries = useMemo(() => (rawEntries || []).map(normalizeEntry), [rawEntries]);

  const [showAll, setShowAll] = useState(false);
  const [mode, setMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);

  const receivable = entries.filter((e) => e.type === "Receivable" && (showAll || e.remaining > 0));
  const payable = entries.filter((e) => e.type === "Payable" && (showAll || e.remaining > 0));
  const recTotal = receivable.reduce((s, e) => s + e.totalAmount, 0);
  const payTotal = payable.reduce((s, e) => s + e.totalAmount, 0);
  const net = recTotal - payTotal;

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = (type) => { setForm({ ...blankForm, type: type || typeOptions?.[0] || "", status: statusOptions?.[0] || "" }); setMode("add"); };
  const openEdit = (entry) => {
    setSelected(entry);
    setForm({ date: entry.date || "", name: entry.name || "", type: entry.type || typeOptions?.[0] || "", totalAmount: String(entry.totalAmount ?? ""), paidAmount: String(entry.paidAmount ?? ""), method: entry.method || paymentType?.[0] || "", status: entry.status || statusOptions?.[0] || "", note: entry.note || "" });
    setMode("edit");
  };
  const openDelete = (entry) => { setSelected(entry); setMode("delete"); };
  const closeAll = () => { setMode(null); setSelected(null); setForm(blankForm); setSubmitting(false); };

  const previewRemaining = Number(form.totalAmount || 0) - Number(form.paidAmount || 0);
  const previewStatus = deriveStatus(form.totalAmount, form.paidAmount);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { createdDate: form.date, name: form.name, recPay: form.type, totalAmount: Number(form.totalAmount) || 0, paidAmount: Number(form.paidAmount) || 0, paymentMethod: form.method, status: form.status || previewStatus, note: form.note };
    const res = await fetchAPI("https://localhost:7011/api/Receivable/AddRecPayData", "POST", payload);
    setSubmitting(false);
    if (res) { push("Entry added"); window.location.reload(); } else push("Error adding the entry. Please try again.", "red");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    const patchPayload = [
      { op: "replace", path: "/createdDate", value: form.date },
      { op: "replace", path: "/name", value: form.name },
      { op: "replace", path: "/recPay", value: form.type },
      { op: "replace", path: "/totalAmount", value: Number(form.totalAmount) || 0 },
      { op: "replace", path: "/paidAmount", value: Number(form.paidAmount) || 0 },
      { op: "replace", path: "/paymentMethod", value: form.method },
      { op: "replace", path: "/status", value: form.status || previewStatus },
      { op: "replace", path: "/note", value: form.note },
    ];
    const res = await fetchAPI(`https://localhost:7011/api/Receivable/UpdateRecPayData/${selected.id}`, "PATCH", patchPayload);
    setSubmitting(false);
    if (res) { push("Entry updated"); window.location.reload(); } else push("Some error occurred. Please try again.", "red");
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Receivable/deleteARecPayData/${selected.id}`, "DELETE");
    setSubmitting(false);
    if (res) { push("Entry deleted"); window.location.reload(); } else push("Some error occurred. Please try again.", "red");
  };

  const Panel = ({ title, rows, total, tone, actionLabel, onAdd }) => (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E3E5D6] px-5 py-4">
        <div>
          <p className={`font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] ${tone === "pine" ? "text-[#074C3A]" : "text-[#C0392B]"}`}>{title}</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-[#010A08]">Rs. <CountUp to={total} /></p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone={tone}>{rows.length} parties</Pill>
          <button onClick={onAdd} className="grid h-8 w-8 place-items-center rounded-lg border border-[#E3E5D6] text-[#074C3A] transition-colors hover:border-[#074C3A]" aria-label={`Add ${title}`}>
            <PlusIc className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ul>
        {rows.length === 0 && <li className="px-5 py-10 text-center text-sm text-[#5C6B60]">Nothing here right now.</li>}
        {rows.map((r) => (
          <li key={r.id} className="border-b border-[#E3E5D6] px-5 py-4 transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#010A08]">{r.name}</p>
                <p className="text-[12px] text-[#5C6B60]">{r.note || r.method || "—"} · {r.date}</p>
              </div>
              <span className="font-mono text-sm font-bold text-[#010A08]">{rs(r.totalAmount)}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F0F2E2]">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.totalAmount ? (r.paidAmount / r.totalAmount) * 100 : 0}%`, background: TONES[STATUS_TONE[r.status]]?.bar || "#9aa89d" }} />
              </div>
              <Pill tone={STATUS_TONE[r.status] || "muted"}>{r.status}</Pill>
              <GhostButton onClick={() => openEdit(r)} className="px-2.5 py-1"><EditIc className="h-3.5 w-3.5" /></GhostButton>
              <button onClick={() => openDelete(r)} className="grid h-8 w-8 place-items-center rounded-lg text-[#C0392B] transition-colors hover:bg-[rgba(192,57,43,0.07)]" aria-label={`Delete ${r.name}`}>
                <TrashIc className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#5C6B60] transition-colors hover:text-[#074C3A]">
        <BackIc className="h-4 w-4" /> Back to dashboard
      </button>

      <PageHead eyebrow="Finance · Position" title="Receivable Payable" sub="What's owed to WowSewa against what WowSewa owes.">
        <GhostButton onClick={() => setShowAll((v) => !v)}>{showAll ? "Hide settled" : "Show settled"}</GhostButton>
      </PageHead>

      <div className="relative mb-6 overflow-hidden rounded-xl bg-[#074C3A] p-6 text-[#F8FAEA]">
        <span className="absolute inset-y-0 left-0 w-1.5 bg-[#D1FE17]" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#F8FAEA]/60">Net working position</p>
            <p className={`mt-1 font-display text-3xl font-extrabold ${net >= 0 ? "text-[#D1FE17]" : "text-[#ffb4ab]"}`}>
              {net >= 0 ? "+" : "−"}Rs. <CountUp to={Math.abs(net)} />
            </p>
          </div>
          <div className="flex gap-6 font-mono text-[12.5px]">
            <span className="text-[#D1FE17]">▲ {rs(recTotal)} in</span>
            <span className="text-[#ffb4ab]">▼ {rs(payTotal)} out</span>
          </div>
        </div>
      </div>

      {entriesLoading ? (
        <Card className="px-6 py-16 text-center"><p className="font-bold text-[#010A08]">Loading entries…</p></Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Receivable · owed to us" rows={receivable} total={recTotal} tone="pine" onAdd={() => openAdd("Receivable")} />
          <Panel title="Payable · we owe" rows={payable} total={payTotal} tone="red" onAdd={() => openAdd("Payable")} />
        </div>
      )}

      {(mode === "add" || mode === "edit") && (
        <Modal title={mode === "add" ? "Add entry" : "Edit entry"} onClose={closeAll}>
          <form className="space-y-4" onSubmit={mode === "add" ? handleAdd : handleEdit}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <input type="date" name="date" className={inputCls} value={form.date} onChange={onField} required />
              </Field>
              <Field label="Type">
                <select name="type" className={inputCls} value={form.type} onChange={onField} required>
                  <option value="">-- Select --</option>
                  {typeOptions?.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Name">
              <input name="name" className={inputCls} value={form.name} onChange={onField} placeholder="e.g. Ramesh Sharma" required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Total amount (Rs)">
                <input type="number" name="totalAmount" min="0" step="0.01" className={inputCls} value={form.totalAmount} onChange={onField} required />
              </Field>
              <Field label="Paid amount (Rs)">
                <input type="number" name="paidAmount" min="0" step="0.01" className={inputCls} value={form.paidAmount} onChange={onField} />
              </Field>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#F8FAEA] px-3.5 py-2.5 text-[13px]">
              <span>Remaining: <strong>{rs(previewRemaining)}</strong></span>
              <Pill tone={STATUS_TONE[form.status || previewStatus] || "muted"}>{form.status || previewStatus}</Pill>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Method">
                <select name="method" className={inputCls} value={form.method} onChange={onField}>
                  <option value="">-- Select --</option>
                  {paymentType?.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select name="status" className={inputCls} value={form.status || previewStatus} onChange={onField}>
                  <option value="">-- Select --</option>
                  {statusOptions?.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Note" optional>
              <textarea name="note" className={`${inputCls} min-h-[70px]`} value={form.note} onChange={onField} placeholder="Optional note" />
            </Field>
            <div className="flex items-center gap-2.5 pt-1">
              <LimeButton type="submit" disabled={submitting}>{submitting ? "Saving…" : mode === "add" ? "Add entry" : "Save changes"}</LimeButton>
              <GhostButton onClick={closeAll}>Cancel</GhostButton>
            </div>
          </form>
        </Modal>
      )}

      {mode === "delete" && (
        <Modal title="Delete entry" onClose={closeAll} narrow>
          <p className="text-sm text-[#5C6B60]">
            Delete the {String(selected?.type).toLowerCase()} entry for <strong className="text-[#010A08]">{selected?.name}</strong>? This can't be undone.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            <button onClick={handleDelete} disabled={submitting} className="rounded-lg bg-[#C0392B] px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
              {submitting ? "Deleting…" : "Confirm delete"}
            </button>
            <GhostButton onClick={closeAll}>Cancel</GhostButton>
          </div>
        </Modal>
      )}

      <ToastHost toasts={toasts} />
    </div>
  );
}