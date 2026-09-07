// pages/JobsManagement/JobsCategory.jsx
import React, { useMemo, useState } from "react";
import { fetchHook } from "../../../hooks/fetchHook";
import { fetchAPI } from "../../../utils/fetchAPI";
import {
  PageHead, Card, StatTile, Pill, SectionLabel, LimeButton, GhostButton,
  Field, Modal, inputCls, useToast, ToastHost, TONES,
  SearchIc, PlusIc, EditIc, TrashIc, ReceiptIc, WalletIc, ClockIc,
} from "../../../ui/ui";

const TONE_CYCLE = ["pine", "teal", "amber", "lime", "muted", "red"];
const rs = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;

function normalizeSummaryRow(raw) {
  return {
    id: raw.id ?? raw.Id,
    name: raw.name ?? raw.Name ?? raw.industryName ?? raw.IndustryName ?? "",
    income: Number(raw.income ?? raw.Income ?? 0),
    expense: Number(raw.expense ?? raw.Expense ?? 0),
    transactions: Number(raw.transactions ?? raw.Transactions ?? raw.transactionCount ?? 0),
  };
}

export default function JobsCategory() {
  const { toasts, push } = useToast();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: jobsCategory, loading: jobsLoading } = fetchHook("https://localhost:7011/api/Industry/getIndustryData");
  const { data: rawSummary, loading: summaryLoading } = fetchHook("https://localhost:7011/api/Industry/detailed-industry-summary");

  const jobsList = Array.isArray(jobsCategory) ? jobsCategory : [];
  const categorySummary = useMemo(() => (rawSummary || []).map(normalizeSummaryRow), [rawSummary]);

  const totals = useMemo(
    () => categorySummary.reduce((a, r) => ({
      income: a.income + r.income,
      expense: a.expense + r.expense,
      transactions: a.transactions + r.transactions,
    }), { income: 0, expense: 0, transactions: 0 }),
    [categorySummary]
  );

  const filteredJobs = jobsList.filter(
    (j) => j && ((j.industryName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (j.industryCompanyCode?.toLowerCase() || "").includes(search.toLowerCase()))
  );

  const closeAll = () => { setMode(null); setSelected(null); setName(""); setSubmitting(false); };
  const openAdd = () => { setName(""); setMode("add"); };
  const openEdit = (job) => { setSelected(job); setName(job.industryName || ""); setMode("edit"); };
  const openDelete = (job) => { setSelected(job); setMode("delete"); };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetchAPI("https://localhost:7011/api/Industry/addIndustryData", "POST", { jobsName: name });
    setSubmitting(false);
    if (res) { push("New job category added"); window.location.reload(); }
    else push("Error from the API. Please try again later.", "red");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    const currentValue = name.trim();
    const originalValue = (selected.industryName || "").trim();
    if (currentValue === originalValue) { push("No changes detected", "amber"); closeAll(); return; }
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Industry/patch/update-a-industry-data/${selected.industryId}`, "PATCH", [
      { op: "replace", path: "/industryName", value: currentValue },
    ]);
    setSubmitting(false);
    if (res) { push("Category updated"); window.location.reload(); }
    else push("Error updating the category. Please try again.", "red");
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Industry/delete/remove-industry-data/${selected.industryId}`, "DELETE");
    setSubmitting(false);
    if (res) { push("Category deleted"); window.location.reload(); }
    else push("Error deleting the category. Please try again.", "red");
  };

  return (
    <div>
      <PageHead
        eyebrow="Service catalog"
        title="Job categories"
        sub="Manage the service categories WowSewa offers to customers, and see how each one contributes to cash flow."
      >
        <LimeButton onClick={openAdd}><PlusIc className="h-4 w-4" /> Add category</LimeButton>
      </PageHead>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Registered categories" value={jobsList.length} icon={ReceiptIc} tone="pine" count={false} />
        <StatTile label="Total income" value={totals.income} prefix="Rs. " icon={WalletIc} tone="lime" />
        <StatTile label="Total expense" value={totals.expense} prefix="Rs. " icon={WalletIc} tone="amber" />
        <StatTile label="Transactions" value={totals.transactions} icon={ClockIc} tone="teal" />
      </div>

      {categorySummary.length > 0 && (
        <Card className="mb-6 p-5">
          <SectionLabel>Revenue share by category</SectionLabel>
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-[#F0F2E2]">
            {categorySummary.filter((c) => c.income > 0).map((c, i) => (
              <div
                key={c.id ?? c.name}
                title={`${c.name} · ${rs(c.income)}`}
                className="h-full transition-all duration-500 hover:opacity-80"
                style={{ width: `${(c.income / (totals.income || 1)) * 100}%`, background: TONES[TONE_CYCLE[i % TONE_CYCLE.length]].bar }}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            {categorySummary.map((c, i) => (
              <span key={c.id ?? c.name} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#5C6B60]">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: TONES[TONE_CYCLE[i % TONE_CYCLE.length]].bar }} aria-hidden="true" />
                {c.name} <span className="font-mono text-[#010A08]">{rs(c.income)}</span>
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E5D6] px-5 py-4">
          <SectionLabel>Manage categories</SectionLabel>
          <div className="relative w-full max-w-xs">
            <SearchIc className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa89d]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code or name…" className={`${inputCls} pl-9`} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-[#E3E5D6] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">
                <th className="px-5 py-3">Company code</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobsLoading ? (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-sm text-[#5C6B60]">Loading job categories…</td></tr>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.industryId} className="border-b border-[#E3E5D6] transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA]">
                    <td className="px-5 py-3.5"><Pill tone="muted">{job.industryCompanyCode}</Pill></td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[#010A08]">{job.industryName}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <GhostButton onClick={() => openEdit(job)} className="px-3 py-1.5"><EditIc className="h-3.5 w-3.5" /> Edit</GhostButton>
                        <button onClick={() => openDelete(job)} className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-[13px] font-bold text-[#C0392B] transition-colors hover:border-[#C0392B]/30 hover:bg-[rgba(192,57,43,0.07)]">
                          <TrashIc className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-sm text-[#5C6B60]">No categories match "{search}".</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-[#E3E5D6] px-5 py-4">
          <SectionLabel>Cash flow by category</SectionLabel>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-[#E3E5D6] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Income</th>
                <th className="px-5 py-3 text-right">Expense</th>
                <th className="px-5 py-3 text-right">Net</th>
                <th className="px-5 py-3 text-right">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {summaryLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#5C6B60]">Loading category summary…</td></tr>
              ) : categorySummary.length > 0 ? (
                categorySummary.map((row) => {
                  const net = row.income - row.expense;
                  return (
                    <tr key={row.id || row.name} className="border-b border-[#E3E5D6] transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA]">
                      <td className="px-5 py-3.5 text-sm font-bold text-[#010A08]">{row.name}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-sm text-[#074C3A]">{rs(row.income)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-sm text-[#C0392B]">{rs(row.expense)}</td>
                      <td className={`px-5 py-3.5 text-right font-mono text-sm font-bold ${net < 0 ? "text-[#C0392B]" : "text-[#074C3A]"}`}>{net === 0 ? "—" : rs(net)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-sm text-[#5C6B60]">{row.transactions || "—"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#5C6B60]">No cash flow recorded yet.</td></tr>
              )}
            </tbody>
            {categorySummary.length > 0 && (
              <tfoot>
                <tr className="bg-[#F8FAEA] font-mono text-[12.5px] font-bold text-[#010A08]">
                  <td className="px-5 py-3">Total</td>
                  <td className="px-5 py-3 text-right">{rs(totals.income)}</td>
                  <td className="px-5 py-3 text-right">{rs(totals.expense)}</td>
                  <td className="px-5 py-3 text-right">{rs(totals.income - totals.expense)}</td>
                  <td className="px-5 py-3 text-right">{totals.transactions}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {(mode === "add" || mode === "edit") && (
        <Modal title={mode === "add" ? "Add job category" : "Edit job category"} onClose={closeAll}>
          <form className="space-y-4" onSubmit={mode === "add" ? handleAdd : handleEdit}>
            <Field label="Category name">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Painting" className={inputCls} required />
            </Field>
            <div className="flex items-center gap-2.5 pt-1">
              <LimeButton type="submit" disabled={submitting}>{submitting ? "Saving…" : mode === "add" ? "Add category" : "Save changes"}</LimeButton>
              <GhostButton onClick={closeAll}>Cancel</GhostButton>
            </div>
          </form>
        </Modal>
      )}

      {mode === "delete" && (
        <Modal title="Delete job category" onClose={closeAll} narrow>
          <p className="text-sm text-[#5C6B60]">
            Are you sure you want to delete <strong className="text-[#010A08]">{selected?.industryName}</strong>? This can't be undone.
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