// pages/JobsManagement/JobsPage.jsx
import React, { useMemo, useState } from "react";
import { fetchHook } from "../../../hooks/fetchHook";
import { fetchAPI } from "../../../utils/fetchAPI";
import {
  PageHead, Card, StatTile, Pill, SectionLabel, LimeButton, GhostButton,
  Field, Modal, Tabs, inputCls, useToast, ToastHost,
  SearchIc, PlusIc, EditIc, TrashIc, ReceiptIc, WalletIc, ClockIc, StarIc,
} from "../../../ui/ui";

function formatRs(v) { return `Rs ${Number(v || 0).toLocaleString()}`; }

function normalizeDuty(raw) {
  return {
    id: raw.dutyId ?? raw.DutyId ?? raw.id ?? raw.Id,
    name: raw.dutyName ?? raw.DutyName ?? raw.name ?? raw.Name ?? "",
    industryId: raw.industryId ?? raw.IndustryId ?? raw.industry?.industryId ?? null,
    industryName: raw.industryName ?? raw.IndustryName ?? raw.industry?.industryName ?? "Uncategorized",
    duration: raw.duration ?? raw.Duration ?? raw.estimatedDuration ?? "",
    price: raw.price ?? raw.Price ?? raw.rate ?? raw.Rate ?? 0,
    description: raw.description ?? raw.Description ?? "",
  };
}
function normalizeIndustry(raw) {
  return { id: raw.industryId ?? raw.IndustryId ?? raw.id ?? raw.Id, name: raw.industryName ?? raw.IndustryName ?? raw.name ?? raw.Name ?? "" };
}
function normalizeDutySummary(raw) {
  return {
    dutyId: raw.dutyId ?? raw.DutyId,
    dutyName: raw.dutyName ?? raw.DutyName ?? "",
    price: raw.price ?? raw.Price ?? 0,
    industryName: raw.industryName ?? raw.IndustryName ?? "",
    totalBookings: raw.totalBookings ?? raw.TotalBookings ?? 0,
    completedBookingsCount: raw.completedBookingsCount ?? raw.CompletedBookingsCount ?? 0,
    pendingBookingsCount: raw.pendingBookingsCount ?? raw.PendingBookingsCount ?? 0,
    totalIncomeGenerated: raw.totalIncomeGenerated ?? raw.TotalIncomeGenerated ?? 0,
  };
}
function emptyDraft(industryId) {
  return { name: "", industryId: industryId || "", duration: "", price: "", description: "" };
}

export default function JobsPage() {
  const { toasts, push } = useToast();

  const { data: rawIndustryData, loading: industriesLoading } = fetchHook("https://localhost:7011/api/industry/getIndustryData");
  const { data: rawDutyData, loading: dutiesLoading } = fetchHook("https://localhost:7011/api/Duty/getAllDutyData");
  const { data: rawSummaryData, loading: summaryLoading } = fetchHook("https://localhost:7011/api/Duty/detailed-duties-summary");

  const [activeIndustryId, setActiveIndustryId] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [errors, setErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const industries = useMemo(() => (rawIndustryData || []).map(normalizeIndustry), [rawIndustryData]);
  const jobs = useMemo(() => (rawDutyData || []).map(normalizeDuty), [rawDutyData]);
  const dutySummary = useMemo(() => (rawSummaryData || []).map(normalizeDutySummary), [rawSummaryData]);
  const isLoading = industriesLoading || dutiesLoading;

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const matchesCategory = activeIndustryId === "All" || job.industryId === activeIndustryId;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || job.name.toLowerCase().includes(q) || job.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  }), [jobs, activeIndustryId, search]);

  const avgPrice = jobs.length ? Math.round(jobs.reduce((s, j) => s + Number(j.price || 0), 0) / jobs.length) : 0;

  const summaryTotals = useMemo(() => dutySummary.reduce((a, r) => ({
    totalBookings: a.totalBookings + (r.totalBookings || 0),
    completed: a.completed + (r.completedBookingsCount || 0),
    pending: a.pending + (r.pendingBookingsCount || 0),
    income: a.income + (r.totalIncomeGenerated || 0),
  }), { totalBookings: 0, completed: 0, pending: 0, income: 0 }), [dutySummary]);

  function openAddForm() { setEditingId(null); setDraft(emptyDraft(activeIndustryId !== "All" ? activeIndustryId : industries[0]?.id)); setErrors({}); setShowForm(true); }
  function openEditForm(job) { setEditingId(job.id); setDraft({ name: job.name, industryId: job.industryId, duration: job.duration, price: String(job.price), description: job.description }); setErrors({}); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditingId(null); setErrors({}); }
  function updateDraft(field, value) { setDraft((p) => ({ ...p, [field]: value })); if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined })); }

  function validateDraft() {
    const next = {};
    if (!draft.name.trim()) next.name = "Enter a job name";
    if (!draft.industryId) next.industryId = "Choose a category";
    if (!draft.duration.trim()) next.duration = "Enter an estimated duration";
    const priceNum = Number(draft.price);
    if (!draft.price || Number.isNaN(priceNum) || priceNum <= 0) next.price = "Enter a valid price greater than 0";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateDraft()) return;
    setSubmitting(true);
    const payload = { dutyName: draft.name.trim(), industryId: draft.industryId, duration: draft.duration.trim(), price: Number(draft.price), description: draft.description.trim() };
    const editPayload = [
      { op: "replace", path: "/dutyName", value: draft.name.trim() },
      { op: "replace", path: "/industryId", value: draft.industryId },
      { op: "replace", path: "/duration", value: draft.duration.trim() },
      { op: "replace", path: "/price", value: Number(draft.price) },
      { op: "replace", path: "/description", value: draft.description.trim() },
    ];
    const res = editingId
      ? await fetchAPI(`https://localhost:7011/api/Duty/patch/update-a-duty-data/${editingId}`, "PATCH", editPayload)
      : await fetchAPI("https://localhost:7011/api/Duty/addNewDuty", "POST", payload);
    setSubmitting(false);
    if (res) { push(editingId ? "Job updated" : "Job added"); window.location.reload(); }
    else push("Some error occurred. Please try again.", "red");
  }

  async function handleDelete(id) {
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Duty/delete/remove-duty-data/${id}`, "DELETE");
    setSubmitting(false);
    setConfirmDeleteId(null);
    if (res) window.location.reload();
    else push("Couldn't delete this job. Please try again.", "red");
  }

  function openCategoryForm() { setCategoryDraft(""); setCategoryError(""); setShowCategoryForm(true); }
  function closeCategoryForm() { setShowCategoryForm(false); setCategoryDraft(""); setCategoryError(""); }

  async function handleAddCategory(e) {
    e.preventDefault();
    const name = categoryDraft.trim();
    if (!name) return setCategoryError("Enter a category name");
    if (industries.some((ind) => ind.name.toLowerCase() === name.toLowerCase())) return setCategoryError("This category already exists");
    setCategorySubmitting(true);
    const res = await fetchAPI("https://localhost:7011/api/Industry/addIndustryData", "POST", { industryName: name });
    setCategorySubmitting(false);
    if (res) { push("New category added"); window.location.reload(); }
    else push("Some error occurred while adding the category.", "red");
  }

  const tabList = ["All", ...industries.map((i) => i.name)];
  const activeTabName = activeIndustryId === "All" ? "All" : industries.find((i) => i.id === activeIndustryId)?.name || "All";
  const onTabChange = (name) => setActiveIndustryId(name === "All" ? "All" : industries.find((i) => i.name === name)?.id ?? "All");

  return (
    <div>
      <PageHead eyebrow="Operations · Jobs" title="Jobs & pricing" sub="Every service WowSewa offers, with its base price and category.">
        <GhostButton onClick={openCategoryForm}><PlusIc className="h-4 w-4" /> Add category</GhostButton>
        <LimeButton onClick={openAddForm} disabled={isLoading}><PlusIc className="h-4 w-4" /> Add job</LimeButton>
      </PageHead>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Total jobs" value={jobs.length} icon={ReceiptIc} tone="pine" count={false} />
        <StatTile label="Categories" value={industries.length} icon={ClockIc} tone="amber" count={false} />
        <StatTile label="Avg base price" value={avgPrice} prefix="Rs. " icon={StarIc} tone="teal" />
        <StatTile label="Total income" value={summaryTotals.income} prefix="Rs. " icon={WalletIc} tone="lime" />
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E5D6] px-5 py-4">
          <div className="relative w-full max-w-xs">
            <SearchIc className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa89d]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs…" className={`${inputCls} pl-9`} />
          </div>
          <Tabs tabs={tabList} active={activeTabName} onChange={onTabChange} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-[#E3E5D6] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">
                <th className="px-5 py-3">Job</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#5C6B60]">Loading jobs…</td></tr>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="border-b border-[#E3E5D6] transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA]">
                    <td className="px-5 py-3.5 text-sm font-bold text-[#010A08]">{job.name}</td>
                    <td className="px-5 py-3.5"><Pill tone="lime">{job.industryName}</Pill></td>
                    <td className="max-w-[220px] truncate px-5 py-3.5 text-[13px] text-[#5C6B60]" title={job.description || undefined}>{job.description || "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-[#5C6B60]">{job.duration ? `${job.duration} mins` : "—"}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm font-bold text-[#074C3A]">{formatRs(job.price)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <GhostButton onClick={() => openEditForm(job)} className="px-3 py-1.5"><EditIc className="h-3.5 w-3.5" /> Edit</GhostButton>
                        {confirmDeleteId === job.id ? (
                          <span className="flex items-center gap-1.5">
                            <button onClick={() => handleDelete(job.id)} disabled={submitting} className="rounded-md bg-[#C0392B] px-2.5 py-1.5 text-[12.5px] font-bold text-white disabled:opacity-50">{submitting ? "…" : "Confirm"}</button>
                            <button onClick={() => setConfirmDeleteId(null)} className="rounded-md px-2.5 py-1.5 text-[12.5px] font-bold text-[#5C6B60] hover:bg-[#F8FAEA]">Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(job.id)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold text-[#C0392B] transition-colors hover:bg-[rgba(192,57,43,0.07)]">
                            <TrashIc className="h-3.5 w-3.5" /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#5C6B60]">No jobs found. Try a different category or search term.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-[#E3E5D6] px-5 py-4">
          <SectionLabel>Duty performance summary</SectionLabel>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[#E3E5D6] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">
                <th className="px-5 py-3">Job</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Bookings</th>
                <th className="px-5 py-3 text-right">Completed</th>
                <th className="px-5 py-3 text-right">Pending</th>
                <th className="px-5 py-3 text-right">Income</th>
              </tr>
            </thead>
            <tbody>
              {summaryLoading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-[#5C6B60]">Loading performance summary…</td></tr>
              ) : dutySummary.length > 0 ? (
                dutySummary.map((row) => (
                  <tr key={row.dutyId} className="border-b border-[#E3E5D6] transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA]">
                    <td className="px-5 py-3.5 text-sm font-bold text-[#010A08]">{row.dutyName}</td>
                    <td className="px-5 py-3.5"><Pill tone="muted">{row.industryName}</Pill></td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm text-[#5C6B60]">{formatRs(row.price)}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm text-[#5C6B60]">{row.totalBookings}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm text-[#074C3A]">{row.completedBookingsCount}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm text-[#C0392B]">{row.pendingBookingsCount}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm font-bold text-[#074C3A]">{formatRs(row.totalIncomeGenerated)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-[#5C6B60]">No bookings recorded yet.</td></tr>
              )}
            </tbody>
            {dutySummary.length > 0 && (
              <tfoot>
                <tr className="bg-[#F8FAEA] font-mono text-[12.5px] font-bold text-[#010A08]">
                  <td className="px-5 py-3" colSpan={3}>Total</td>
                  <td className="px-5 py-3 text-right">{summaryTotals.totalBookings}</td>
                  <td className="px-5 py-3 text-right">{summaryTotals.completed}</td>
                  <td className="px-5 py-3 text-right">{summaryTotals.pending}</td>
                  <td className="px-5 py-3 text-right">{formatRs(summaryTotals.income)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {showForm && (
        <Modal title={editingId ? "Edit job" : "Add a new job"} onClose={closeForm}>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <Field label="Category">
              <select className={inputCls} value={draft.industryId} onChange={(e) => updateDraft("industryId", e.target.value)}>
                <option value="">-- Select category --</option>
                {industries.map((ind) => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
              </select>
              {errors.industryId && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.industryId}</span>}
            </Field>
            <Field label="Job name">
              <input className={inputCls} value={draft.name} onChange={(e) => updateDraft("name", e.target.value)} placeholder="e.g. Leak repair" />
              {errors.name && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.name}</span>}
            </Field>
            <Field label="Description" optional>
              <textarea className={`${inputCls} min-h-[80px]`} value={draft.description} onChange={(e) => updateDraft("description", e.target.value)} placeholder="What's included in this job, prerequisites, etc." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duration (mins)">
                <input className={inputCls} value={draft.duration} onChange={(e) => updateDraft("duration", e.target.value)} placeholder="e.g. 60" />
                {errors.duration && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.duration}</span>}
              </Field>
              <Field label="Price (Rs)">
                <input type="number" min="0" className={inputCls} value={draft.price} onChange={(e) => updateDraft("price", e.target.value)} placeholder="e.g. 800" />
                {errors.price && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.price}</span>}
              </Field>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <LimeButton type="submit" disabled={submitting}>{submitting ? "Saving…" : editingId ? "Save changes" : "Add job"}</LimeButton>
              <GhostButton onClick={closeForm}>Cancel</GhostButton>
            </div>
          </form>
        </Modal>
      )}

      {showCategoryForm && (
        <Modal title="Add a new category" onClose={closeCategoryForm} narrow>
          <form className="space-y-4" onSubmit={handleAddCategory} noValidate>
            <Field label="Category name">
              <input className={inputCls} value={categoryDraft} onChange={(e) => { setCategoryDraft(e.target.value); if (categoryError) setCategoryError(""); }} placeholder="e.g. Landscaping" autoFocus />
              {categoryError && <span className="mt-1 block text-[12px] text-[#C0392B]">{categoryError}</span>}
            </Field>
            <div className="flex items-center gap-2.5 pt-1">
              <LimeButton type="submit" disabled={categorySubmitting}>{categorySubmitting ? "Adding…" : "Add category"}</LimeButton>
              <GhostButton onClick={closeCategoryForm}>Cancel</GhostButton>
            </div>
          </form>
        </Modal>
      )}

      <ToastHost toasts={toasts} />
    </div>
  );
}