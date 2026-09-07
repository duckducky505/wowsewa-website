// pages/StaffManagement/StaffPage.jsx
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { fetchHook } from "../../hooks/fetchHook";
import { fetchAPI } from "../../utils/fetchAPI";
import {
  PageHead, Card, StatTile, Pill, Avatar, GhostButton, LimeButton,
  Field, Modal, Tabs, inputCls, StarIc, ClockIc, WalletIc, PlusIc, SearchIc,
} from "../../ui/ui";

function normalizeEmployee(raw) {
  return {
    id: raw.guidId ?? raw.GuidId,
    fullName: raw.fullName ?? raw.FullName ?? raw.name ?? raw.Name ?? "",
    phone: raw.phoneNumber ?? raw.PhoneNumber ?? "",
    industryId: raw.industryId ?? raw.IndustryId,
    industryName: raw.industry?.industryName ?? raw.Industry?.IndustryName ?? raw.IndustryName ?? "Unassigned",
    joinedDate: raw.joinedDate ?? raw.JoinedDate,
    isActive: raw.isActive ?? raw.IsActive ?? true,
    baseSalary: raw.baseSalary ?? raw.BaseSalary ?? 0,
    salaryStartDate: raw.salaryStartDate ?? raw.SalaryStartDate ?? "",
    salaryDueDate: raw.salaryDueDate ?? raw.SalaryDueDate ?? "",
  };
}
function normalizeIndustry(raw) {
  return { id: raw.industryId ?? raw.IndustryId ?? raw.id ?? raw.Id, name: raw.industryName ?? raw.IndustryName ?? raw.name ?? raw.Name ?? "" };
}
function formatCurrency(n) { return `Rs. ${(Number(n) || 0).toLocaleString()}`; }
function emptyDraft() {
  return { name: "", phone: "", industryId: "", joinedDate: "", isActive: true, baseSalary: "", salaryStartDate: "", salaryDueDate: "" };
}

export default function StaffPage() {
  const { data: rawEmployeeData, loading: staffLoading } = fetchHook("https://localhost:7011/api/Employee/getEmployeesDetail");
  const { data: rawIndustryData, loading: industriesLoading } = fetchHook("https://localhost:7011/api/industry/getIndustryData");

  const [activeIndustryId, setActiveIndustryId] = useState("All");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [errors, setErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const industries = useMemo(() => (rawIndustryData || []).map(normalizeIndustry), [rawIndustryData]);
  const staff = useMemo(() => (rawEmployeeData || []).map(normalizeEmployee), [rawEmployeeData]);
  const isLoading = staffLoading || industriesLoading;

  const filteredStaff = useMemo(() => staff.filter((s) => {
    const matchesActive = showAll || s.isActive;
    const matchesCategory = activeIndustryId === "All" || s.industryId === activeIndustryId;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || s.fullName.toLowerCase().includes(q) || s.phone.toLowerCase().includes(q);
    return matchesActive && matchesCategory && matchesSearch;
  }), [staff, activeIndustryId, search, showAll]);

  const visibleStaff = showAll ? staff : staff.filter((s) => s.isActive);
  const online = staff.filter((s) => s.isActive).length;
  const payroll = visibleStaff.reduce((sum, s) => sum + (Number(s.baseSalary) || 0), 0);

  function openAddForm() { setEditingId(null); setDraft(emptyDraft()); setErrors({}); setShowForm(true); }
  function openEditForm(person) {
    setEditingId(person.id);
    setDraft({ name: person.fullName, phone: person.phone, industryId: person.industryId ?? "", joinedDate: person.joinedDate, isActive: person.isActive, baseSalary: person.baseSalary ?? "", salaryStartDate: person.salaryStartDate ?? "", salaryDueDate: person.salaryDueDate ?? "" });
    setErrors({}); setShowForm(true);
  }
  function closeForm() { setShowForm(false); setEditingId(null); setErrors({}); }
  function updateDraft(field, value) { setDraft((p) => ({ ...p, [field]: value })); if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined })); }

  function validateDraft() {
    const next = {};
    if (!draft.name.trim()) next.name = "Enter the staff member's name";
    if (!/^[0-9+\s-]{7,15}$/.test(draft.phone.trim())) next.phone = "Enter a valid phone number";
    if (!draft.industryId) next.industryId = "Choose a category";
    if (!draft.baseSalary || Number(draft.baseSalary) <= 0) next.baseSalary = "Enter a valid base salary";
    if (!draft.salaryStartDate) next.salaryStartDate = "Choose the salary start date";
    if (!draft.salaryDueDate) next.salaryDueDate = "Choose the salary due date";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateDraft()) return;
    setSubmitting(true);
    const payload = {
      name: draft.name.trim(), phoneNumber: draft.phone.trim(), industryId: parseInt(draft.industryId, 10),
      joinedDate: draft.joinedDate || new Date().toISOString().split("T")[0], isActive: draft.isActive,
      baseSalary: Number(draft.baseSalary), salaryStartDate: draft.salaryStartDate, salaryDueDate: draft.salaryDueDate,
    };
    const editPayload = [
      { op: "replace", path: "/fullName", value: payload.name },
      { op: "replace", path: "/phoneNumber", value: payload.phoneNumber },
      { op: "replace", path: "/industryId", value: payload.industryId },
      { op: "replace", path: "/joinedDate", value: payload.joinedDate },
      { op: "replace", path: "/isActive", value: payload.isActive },
      { op: "replace", path: "/baseSalary", value: payload.baseSalary },
      { op: "replace", path: "/salaryStartDate", value: payload.salaryStartDate },
      { op: "replace", path: "/salaryDueDate", value: payload.salaryDueDate },
    ];
    const res = editingId
      ? await fetchAPI(`https://localhost:7011/api/Employee/UpdateEmployee/${editingId}`, "PATCH", editPayload)
      : await fetchAPI("https://localhost:7011/api/Employee/AddEmployee", "POST", payload);
    setSubmitting(false);
    if (res) { toast.success(editingId ? "Staff member updated successfully." : "Staff member added successfully."); closeForm(); window.location.reload(); }
    else toast.error("Some error occurred. Please try again.");
  }

  async function handleDelete(id) {
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Employee/deleteEmployee/${id}`, "DELETE");
    setSubmitting(false);
    setConfirmDeleteId(null);
    if (res) { toast.success("Staff member removed."); window.location.reload(); }
    else toast.error("Couldn't remove this staff member. Please try again.");
  }

  const tabList = ["All", ...industries.map((i) => i.name)];
  const activeTabName = activeIndustryId === "All" ? "All" : industries.find((i) => i.id === activeIndustryId)?.name || "All";
  const onTabChange = (name) => setActiveIndustryId(name === "All" ? "All" : industries.find((i) => i.name === name)?.id ?? "All");

  return (
    <div>
      <PageHead eyebrow="Operations · People" title="Staffs" sub="Everyone on the payroll — field technicians and front desk.">
        <GhostButton onClick={() => setShowAll((v) => !v)}>{showAll ? "Show active only" : "Show all staff"}</GhostButton>
        <LimeButton onClick={openAddForm} disabled={isLoading}><PlusIc className="h-4 w-4" /> Add staff</LimeButton>
      </PageHead>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Total staff" value={staff.length} icon={StarIc} tone="pine" count={false} />
        <StatTile label="Available now" value={online} icon={ClockIc} tone="lime" count={false} />
        <StatTile label="Categories" value={industries.length} icon={ClockIc} tone="amber" count={false} />
        <StatTile label="Monthly payroll" value={payroll} prefix="Rs. " icon={WalletIc} tone="teal" />
      </div>

      <Card className="mb-5 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Tabs tabs={tabList} active={activeTabName} onChange={onTabChange} />
        <div className="relative w-full max-w-xs">
          <SearchIc className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa89d]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or phone…" className={`${inputCls} pl-9`} />
        </div>
      </Card>

      {isLoading ? (
        <Card className="px-6 py-16 text-center"><p className="font-bold text-[#010A08]">Loading staff…</p></Card>
      ) : filteredStaff.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStaff.map((s) => (
            <Card key={s.id} className="group p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(1,10,8,0.35)]">
              <div className="flex items-start gap-3.5">
                <div className="relative">
                  <Avatar name={s.fullName} tone="pine" size="h-12 w-12 text-[15px]" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white" style={{ background: s.isActive ? "#9db800" : "#9aa89d" }} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[16.5px] font-extrabold text-[#010A08]">{s.fullName}</p>
                  <p className="text-[12.5px] text-[#5C6B60]">{s.phone || "No phone on file"}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Pill tone="lime">{s.industryName}</Pill>
                    <Pill tone={s.isActive ? "pine" : "muted"} pulse={s.isActive}>{s.isActive ? "Active" : "Inactive"}</Pill>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#E3E5D6] pt-3.5 text-[12.5px]">
                <span className="font-mono text-[#5C6B60]">{formatCurrency(s.baseSalary)}/mo</span>
                <span className="font-mono text-[#9aa89d]">{s.salaryDueDate ? `due ${s.salaryDueDate}` : "no due date"}</span>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2 border-t border-[#E3E5D6] pt-3">
                <GhostButton onClick={() => openEditForm(s)} className="px-3 py-1.5">Edit</GhostButton>
                {confirmDeleteId === s.id ? (
                  <span className="flex items-center gap-1.5">
                    <button onClick={() => handleDelete(s.id)} disabled={submitting} className="rounded-md bg-[#C0392B] px-2.5 py-1.5 text-[12.5px] font-bold text-white disabled:opacity-50">{submitting ? "…" : "Confirm"}</button>
                    <button onClick={() => setConfirmDeleteId(null)} className="rounded-md px-2.5 py-1.5 text-[12.5px] font-bold text-[#5C6B60] hover:bg-[#F8FAEA]">Cancel</button>
                  </span>
                ) : (
                  <button onClick={() => setConfirmDeleteId(s.id)} className="rounded-md px-2.5 py-1.5 text-[12.5px] font-bold text-[#C0392B] hover:bg-[rgba(192,57,43,0.07)]">Delete</button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="px-6 py-16 text-center">
          <p className="font-bold text-[#010A08]">No staff found</p>
          <p className="mt-1 text-sm text-[#5C6B60]">Try a different category or search term, or add a new staff member.</p>
        </Card>
      )}

      {showForm && (
        <Modal title={editingId ? "Edit staff member" : "Add a new staff member"} onClose={closeForm}>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <Field label="Full name">
              <input className={inputCls} value={draft.name} onChange={(e) => updateDraft("name", e.target.value)} placeholder="e.g. Bikash Rai" />
              {errors.name && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.name}</span>}
            </Field>
            <Field label="Phone number">
              <input type="tel" className={inputCls} value={draft.phone} onChange={(e) => updateDraft("phone", e.target.value)} placeholder="+977 98-XXXX-XXXX" />
              {errors.phone && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.phone}</span>}
            </Field>
            <Field label="Category">
              <select className={inputCls} value={draft.industryId} onChange={(e) => updateDraft("industryId", e.target.value)}>
                <option value="">-- Select category --</option>
                {industries.map((ind) => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
              </select>
              {errors.industryId && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.industryId}</span>}
            </Field>
            <Field label="Joined date">
              <input type="date" className={inputCls} value={draft.joinedDate} onChange={(e) => updateDraft("joinedDate", e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-4 border-t border-[#E3E5D6] pt-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Base salary">
                  <input type="number" min="0" className={inputCls} value={draft.baseSalary} onChange={(e) => updateDraft("baseSalary", e.target.value)} placeholder="e.g. 25000" />
                  {errors.baseSalary && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.baseSalary}</span>}
                </Field>
              </div>
              <Field label="Salary start date">
                <input type="date" className={inputCls} value={draft.salaryStartDate} onChange={(e) => updateDraft("salaryStartDate", e.target.value)} />
                {errors.salaryStartDate && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.salaryStartDate}</span>}
              </Field>
              <Field label="Salary due date">
                <input type="date" className={inputCls} value={draft.salaryDueDate} onChange={(e) => updateDraft("salaryDueDate", e.target.value)} />
                {errors.salaryDueDate && <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.salaryDueDate}</span>}
              </Field>
            </div>
            {editingId && (
              <Field label="Status">
                <select className={inputCls} value={draft.isActive ? "active" : "inactive"} onChange={(e) => updateDraft("isActive", e.target.value === "active")}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
            )}
            <div className="flex items-center gap-2.5 pt-1">
              <LimeButton type="submit" disabled={submitting}>{submitting ? "Saving…" : editingId ? "Save changes" : "Add staff"}</LimeButton>
              <GhostButton onClick={closeForm}>Cancel</GhostButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}