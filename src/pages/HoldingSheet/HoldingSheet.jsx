// pages/AdminDashboard/HoldingSheetPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHook } from "../../hooks/fetchHook";
import { fetchAPI } from "../../utils/fetchAPI";
import { useSignalR } from "../../hooks/signalR";
import {
  PageHead, Card, Pill, SectionLabel, GhostButton, LimeButton, Field, Modal,
  inputCls, useToast, ToastHost, StatTile, BackIc, PlusIc, EditIc, TrashIc, WalletIc,
} from "../../ui/ui";

const CancelIc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="9" /><path d="m8 8 8 8M16 8l-8 8" />
  </svg>
);

const blankForm = { createdDate: "", description: "", entryType: "", fromHolderId: "", toHolderId: "", amount: "", method: "", status: "", note: "" };

function normalizeHolder(raw) {
  return { id: raw.id ?? raw.Id, name: raw.name ?? raw.Name ?? "", type: raw.type ?? raw.Type ?? "", balance: raw.currentBalance ?? raw.CurrentBalance ?? 0 };
}
function normalizeEntry(raw) {
  return {
    id: raw.id ?? raw.Id,
    date: raw.createdDate ?? raw.CreatedDate ?? "",
    description: raw.description ?? raw.Description ?? "",
    entryType: raw.entryType ?? raw.EntryType ?? "",
    fromHolderId: raw.fromHolderId ?? raw.FromHolderId ?? "",
    fromHolderName: raw.fromHolderName ?? raw.FromHolderName ?? "",
    toHolderId: raw.toHolderId ?? raw.ToHolderId ?? "",
    toHolderName: raw.toHolderName ?? raw.ToHolderName ?? "",
    amount: raw.amount ?? raw.Amount ?? 0,
    method: raw.paymentMethod ?? raw.PaymentMethod ?? "",
    status: raw.status ?? raw.Status ?? "",
    note: raw.note ?? raw.Note ?? "",
    fromBalanceAfter: raw.fromBalanceAfter ?? raw.FromBalanceAfter ?? null,
    toBalanceAfter: raw.toBalanceAfter ?? raw.ToBalanceAfter ?? null,
  };
}
function rs(v) { return `Rs. ${Number(v || 0).toLocaleString()}`; }
const STATUS_TONE = { Completed: "pine", Pending: "amber", Cancelled: "muted" };

const HOLDING_SHEET_ENDPOINT = "https://localhost:7011/api/HoldingSheet/get/holding-sheet-data";
const HOLDERS_ENDPOINT = "https://localhost:7011/api/Holder/get/holders-data";

export default function HoldingSheet() {
  const navigate = useNavigate();
  const { toasts, push } = useToast();

  const [mode, setMode] = useState(null); // null | add | edit | cancel | delete
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [rawEntries, setRawEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [rawHolders, setRawHolders] = useState([]);
  const [holdersLoading, setHoldersLoading] = useState(true);

  const { data: statusValues } = fetchHook("https://localhost:7011/api/Categories/get/Status");
  const { data: paymentType } = fetchHook("https://localhost:7011/api/Categories/get/Payment-Method-Values");
  const { data: entryType } = fetchHook("https://localhost:7011/api/Categories/get/Entry-Types");

  const { connection, isConnected } = useSignalR() || {};

  const loadEntries = useCallback(async () => {
    setEntriesLoading(true);
    const res = await fetchAPI(HOLDING_SHEET_ENDPOINT, "GET");
    setRawEntries(Array.isArray(res) ? res : []);
    setEntriesLoading(false);
  }, []);
  const loadHolders = useCallback(async () => {
    setHoldersLoading(true);
    const res = await fetchAPI(HOLDERS_ENDPOINT, "GET");
    setRawHolders(Array.isArray(res) ? res : []);
    setHoldersLoading(false);
  }, []);
  const refreshData = useCallback(() => { loadEntries(); loadHolders(); }, [loadEntries, loadHolders]);

  useEffect(() => { refreshData(); }, [refreshData]);

  useEffect(() => {
    if (!connection || !isConnected) return;
    const handleUpdate = () => refreshData();
    connection.on("HoldingSheetUpdated", handleUpdate);
    return () => connection.off("HoldingSheetUpdated", handleUpdate);
  }, [connection, isConnected, refreshData]);

  const entries = useMemo(() => rawEntries.map(normalizeEntry), [rawEntries]);
  const holders = useMemo(() => rawHolders.map(normalizeHolder), [rawHolders]);

  const groupedHolders = useMemo(() => {
    const groups = new Map();
    holders.forEach((h) => {
      const label = h.type || "Other";
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(h);
    });
    return [...groups.entries()];
  }, [holders]);

  const totalHeld = holders.reduce((s, h) => s + Number(h.balance || 0), 0);
  const officeCash = holders.find((h) => h.type === "OfficeCash")?.balance ?? 0;

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(blankForm); setFormError(""); setMode("add"); };
  const openEdit = (entry) => {
    setSelected(entry);
    setForm({
      createdDate: entry.date || "", description: entry.description || "", entryType: entry.entryType || entryType?.[0] || "",
      fromHolderId: entry.fromHolderId || "", toHolderId: entry.toHolderId || "", amount: entry.amount ?? "",
      method: entry.method || paymentType?.[0] || "", status: entry.status || statusValues?.[0] || "", note: entry.note || "",
    });
    setFormError(""); setMode("edit");
  };
  const openCancel = (entry) => { setSelected(entry); setMode("cancel"); };
  const openDelete = (entry) => { setSelected(entry); setMode("delete"); };
  const closeAll = () => { setMode(null); setSelected(null); setForm(blankForm); setSubmitting(false); setFormError(""); };

  function validateForm() {
    if (!form.createdDate) return "Please pick a date.";
    if (!form.fromHolderId) return 'Please choose a "from" holder.';
    if (!form.toHolderId) return 'Please choose a "to" holder.';
    if (form.fromHolderId === form.toHolderId) return '"From" and "To" holders must be different.';
    if (!form.amount || Number(form.amount) <= 0) return "Enter a valid amount greater than zero.";
    return "";
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setFormError(validationError);
    setSubmitting(true); setFormError("");
    const payload = {
      createdDate: form.createdDate, description: form.description, entryType: form.entryType || entryType?.[0] || "",
      fromHolderId: form.fromHolderId, toHolderId: form.toHolderId, amount: Number(form.amount) || 0,
      paymentMethod: form.method || paymentType?.[0] || "", status: form.status || statusValues?.[0] || "Pending", note: form.note,
    };
    const res = await fetchAPI("https://localhost:7011/api/HoldingSheet/add/holder-sheet-data", "POST", payload);
    setSubmitting(false);
    if (res) { refreshData(); closeAll(); push("Entry added"); }
    else setFormError("Error adding the entry. Please try again later.");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    const validationError = validateForm();
    if (validationError) return setFormError(validationError);
    setSubmitting(true); setFormError("");
    const patchPayload = [
      { op: "replace", path: "/CreatedDate", value: form.createdDate },
      { op: "replace", path: "/Description", value: form.description },
      { op: "replace", path: "/EntryType", value: form.entryType },
      { op: "replace", path: "/FromHolderId", value: form.fromHolderId },
      { op: "replace", path: "/ToHolderId", value: form.toHolderId },
      { op: "replace", path: "/Amount", value: Number(form.amount) || 0 },
      { op: "replace", path: "/PaymentMethod", value: form.method },
      { op: "replace", path: "/Status", value: form.status },
      { op: "replace", path: "/Note", value: form.note },
    ];
    const res = await fetchAPI(`https://localhost:7011/api/HoldingSheet/update-holding-sheet-data/${selected.id}`, "PATCH", patchPayload);
    setSubmitting(false);
    if (res) { refreshData(); closeAll(); push("Entry updated"); }
    else setFormError("Some error occurred. Please try again.");
  };

  const handleCancel = async () => {
    if (!selected) return;
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/HoldingSheet/update-holding-sheet-data/${selected.id}`, "PATCH", [{ op: "replace", path: "/Status", value: "Cancelled" }]);
    setSubmitting(false);
    if (res) { refreshData(); closeAll(); push("Entry cancelled"); }
    else push("Some error occurred. Please try again.", "red");
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/HoldingSheet/delete/${selected.id}`, "DELETE");
    setSubmitting(false);
    if (res) { refreshData(); closeAll(); push("Entry deleted"); }
    else push("Some error occurred. Please try again.", "red");
  };

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#5C6B60] transition-colors hover:text-[#074C3A]">
        <BackIc className="h-4 w-4" /> Back to dashboard
      </button>

      <PageHead eyebrow="Finance · Custody" title="Holding sheet" sub="Track who's holding company money and where it moved.">
        {isConnected && <Pill tone="lime" pulse>Live</Pill>}
        <LimeButton onClick={openAdd}><PlusIc className="h-4 w-4" /> Add entry</LimeButton>
      </PageHead>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatTile label="Total held" value={totalHeld} prefix="Rs. " icon={WalletIc} tone="pine" />
        <StatTile label="Office cash" value={officeCash} prefix="Rs. " icon={WalletIc} tone="lime" />
        <StatTile label="Holder accounts" value={holders.length} icon={WalletIc} tone="teal" count={false} />
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="border-b border-[#E3E5D6] px-5 py-4"><SectionLabel>Holder balances</SectionLabel></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left">
            <thead>
              <tr className="border-b border-[#E3E5D6] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">
                <th className="px-5 py-3">Holder</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {holdersLoading ? (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-[#5C6B60]">Loading balances…</td></tr>
              ) : holders.map((h) => (
                <tr key={h.id} className="border-b border-[#E3E5D6] transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA]">
                  <td className="px-5 py-3 text-sm font-bold text-[#010A08]">{h.name}</td>
                  <td className="px-5 py-3"><Pill tone="muted">{h.type || "Other"}</Pill></td>
                  <td className={`px-5 py-3 text-right font-mono text-sm font-bold ${h.balance < 0 ? "text-[#C0392B]" : "text-[#074C3A]"}`}>{rs(h.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-[#E3E5D6] px-5 py-4"><SectionLabel>Ledger entries</SectionLabel></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              <tr className="border-b border-[#E3E5D6] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">From → To</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entriesLoading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#5C6B60]">Loading entries…</td></tr>
              ) : entries.length > 0 ? (
                entries.map((entry) => {
                  const isCompleted = entry.status === "Completed";
                  return (
                    <tr key={entry.id} className="border-b border-[#E3E5D6] transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA]">
                      <td className="px-5 py-3.5 text-sm text-[#5C6B60]">{entry.date}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-[#010A08]">{entry.description || "—"}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#5C6B60]">{entry.fromHolderName || "—"} → {entry.toHolderName || "—"}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-sm font-bold text-[#074C3A]">{rs(entry.amount)}</td>
                      <td className="px-5 py-3.5"><Pill tone={STATUS_TONE[entry.status] || "muted"}>{entry.status}</Pill></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <GhostButton onClick={() => openEdit(entry)} className="px-3 py-1.5"><EditIc className="h-3.5 w-3.5" /> Edit</GhostButton>
                          {isCompleted ? (
                            <button onClick={() => openCancel(entry)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold text-[#C0392B] transition-colors hover:bg-[rgba(192,57,43,0.07)]">
                              <CancelIc className="h-3.5 w-3.5" /> Cancel
                            </button>
                          ) : (
                            <button onClick={() => openDelete(entry)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold text-[#C0392B] transition-colors hover:bg-[rgba(192,57,43,0.07)]">
                              <TrashIc className="h-3.5 w-3.5" /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#5C6B60]">No entries yet. Add the first holding sheet entry to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {(mode === "add" || mode === "edit") && (
        <Modal title={mode === "add" ? "Add holding sheet entry" : "Edit holding sheet entry"} onClose={closeAll}>
          <form className="space-y-4" onSubmit={mode === "add" ? handleAdd : handleEdit}>
            <Field label="Date">
              <input type="date" name="createdDate" className={inputCls} value={form.createdDate} onChange={onField} required />
            </Field>
            <Field label="Description">
              <input name="description" className={inputCls} value={form.description} onChange={onField} placeholder="e.g. Laptop repair paid to Jiwan personal" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Entry type">
                <select name="entryType" className={inputCls} value={form.entryType} onChange={onField}>
                  <option value="">-- Select --</option>
                  {entryType?.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Method">
                <select name="method" className={inputCls} value={form.method} onChange={onField}>
                  <option value="">-- Select --</option>
                  {paymentType?.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="From holder">
                <select name="fromHolderId" className={inputCls} value={form.fromHolderId} onChange={onField} required>
                  <option value="">-- Select --</option>
                  {groupedHolders.map(([label, list]) => (
                    <optgroup label={label} key={label}>{list.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}</optgroup>
                  ))}
                </select>
              </Field>
              <Field label="To holder">
                <select name="toHolderId" className={inputCls} value={form.toHolderId} onChange={onField} required>
                  <option value="">-- Select --</option>
                  {groupedHolders.map(([label, list]) => (
                    <optgroup label={label} key={label}>{list.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}</optgroup>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount (Rs)">
                <input type="number" min="0" name="amount" className={inputCls} value={form.amount} onChange={onField} placeholder="0" required />
              </Field>
              <Field label="Status">
                <select name="status" className={inputCls} value={form.status} onChange={onField}>
                  <option value="">-- Select --</option>
                  {statusValues?.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {form.status === "Pending" && <span className="mt-1 block text-[11.5px] text-[#9aa89d]">Pending entries don't affect balances yet.</span>}
              </Field>
            </div>
            <Field label="Note" optional>
              <textarea name="note" className={`${inputCls} min-h-[70px]`} value={form.note} onChange={onField} placeholder="Optional note" />
            </Field>
            {formError && <p className="text-[12.5px] font-semibold text-[#C0392B]">{formError}</p>}
            <div className="flex items-center gap-2.5 pt-1">
              <LimeButton type="submit" disabled={submitting}>{submitting ? "Saving…" : mode === "add" ? "Add entry" : "Save changes"}</LimeButton>
              <GhostButton onClick={closeAll}>Cancel</GhostButton>
            </div>
          </form>
        </Modal>
      )}

      {mode === "cancel" && (
        <Modal title="Cancel entry" onClose={closeAll} narrow>
          <p className="text-sm text-[#5C6B60]">
            This entry already moved balances. Cancelling will mark it as <strong className="text-[#010A08]">Cancelled</strong> — confirm with backend that balance reversal is implemented before relying on this.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            <button onClick={handleCancel} disabled={submitting} className="rounded-lg bg-[#C0392B] px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
              {submitting ? "Cancelling…" : "Confirm cancel"}
            </button>
            <GhostButton onClick={closeAll}>Back</GhostButton>
          </div>
        </Modal>
      )}

      {mode === "delete" && (
        <Modal title="Delete entry" onClose={closeAll} narrow>
          <p className="text-sm text-[#5C6B60]">
            This entry never affected a balance, so it's safe to remove outright. Delete the entry from <strong className="text-[#010A08]">{selected?.fromHolderName}</strong> to <strong className="text-[#010A08]">{selected?.toHolderName}</strong>?
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