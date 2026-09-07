// pages/SalaryRecords/SalaryRecordsPage.jsx
import React, { useMemo, useState } from "react";
import { MdClose, MdVisibility, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { fetchHook } from "../../hooks/fetchHook";
import { fetchAPI } from "../../utils/fetchAPI";

// ---- Helpers --------------------------------------------------------------

function normalizeRecord(raw) {
  return {
    id: raw.id ?? raw.Id,
    employeeId: raw.employeeId ?? raw.EmployeeId,
    employeeName:
      raw.employee?.fullName ?? raw.Employee?.FullName ?? raw.employeeName ?? raw.EmployeeName ?? "Unknown",
    baseSalary: raw.baseSalary ?? raw.BaseSalary ?? 0,
    advanceTaken: raw.advanceTaken ?? raw.AdvanceTaken ?? null,
    deduction: raw.deduction ?? raw.Deduction ?? null,
    netSalary: raw.netSalary ?? raw.NetSalary ?? 0,
    paymentDate: raw.paymentDate ?? raw.PaymentDate ?? "",
    paymentMethod: raw.paymentMethod ?? raw.PaymentMethod ?? "",
    remarks: raw.remarks ?? raw.Remarks ?? "",
    isPaid: raw.isPaid ?? raw.IsPaid ?? false,
  };
}

function formatCurrency(n) {
  const num = Number(n) || 0;
  return `Rs. ${num.toLocaleString()}`;
}

function emptyEditDraft() {
  return { advanceTaken: "", deduction: "", paymentMethod: "", remarks: "", isPaid: false };
}

const PAYMENT_METHODS = ["Cash", "BankTransfer", "Cheque", "MobileWallet"];

// ---- Component --------------------------------------------------------------

export default function SalaryRecordsPage() {
  const { data: rawRecords, loading, refetch } = fetchHook(
    "https://localhost:7011/api/SalaryRecord/getAllSalaryRecords"
  );

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [editDraft, setEditDraft] = useState(emptyEditDraft());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const records = useMemo(() => (rawRecords || []).map(normalizeRecord), [rawRecords]);

  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        if (statusFilter === "Paid") return r.isPaid;
        if (statusFilter === "Unpaid") return !r.isPaid;
        return true;
      })
      .filter((r) => {
        const q = search.trim().toLowerCase();
        return !q || r.employeeName.toLowerCase().includes(q);
      })
      .sort((a, b) => (a.paymentDate < b.paymentDate ? 1 : -1));
  }, [records, statusFilter, search]);

  const stats = useMemo(() => {
    const paid = records.filter((r) => r.isPaid);
    const unpaid = records.filter((r) => !r.isPaid);
    return [
      { label: "Total records", value: records.length },
      { label: "Paid", value: paid.length },
      { label: "Unpaid", value: unpaid.length },
      {
        label: "Unpaid amount",
        value: formatCurrency(unpaid.reduce((sum, r) => sum + (Number(r.netSalary) || 0), 0)),
      },
    ];
  }, [records]);

  function openView(record) {
    setViewRecord(record);
  }

  function closeView() {
    setViewRecord(null);
  }

  function openEdit(record) {
    setEditRecord(record);
    setEditDraft({
      advanceTaken: record.advanceTaken ?? "",
      deduction: record.deduction ?? "",
      paymentMethod: record.paymentMethod || "",
      remarks: record.remarks || "",
      isPaid: record.isPaid,
    });
    setErrors({});
  }

  function closeEdit() {
    setEditRecord(null);
    setErrors({});
  }

  function updateDraft(field, value) {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateDraft() {
    const next = {};
    if (editDraft.isPaid && !editDraft.paymentMethod) {
      next.paymentMethod = "Choose how this was paid";
    }
    if (editDraft.advanceTaken !== "" && Number(editDraft.advanceTaken) < 0) {
      next.advanceTaken = "Advance can't be negative";
    }
    if (editDraft.deduction !== "" && Number(editDraft.deduction) < 0) {
      next.deduction = "Deduction can't be negative";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editRecord || !validateDraft()) return;

    setSubmitting(true);

    const advance = editDraft.advanceTaken === "" ? 0 : Number(editDraft.advanceTaken);
    const deduction = editDraft.deduction === "" ? 0 : Number(editDraft.deduction);
    const netSalary = Number(editRecord.baseSalary) + advance - deduction;

    const patch = [
      { op: "replace", path: "/AdvanceTaken", value: editDraft.advanceTaken === "" ? null : advance },
      { op: "replace", path: "/Deduction", value: editDraft.deduction === "" ? null : deduction },
      { op: "replace", path: "/NetSalary", value: netSalary },
      { op: "replace", path: "/PaymentMethod", value: editDraft.paymentMethod },
      { op: "replace", path: "/Remarks", value: editDraft.remarks },
      { op: "replace", path: "/IsPaid", value: editDraft.isPaid },
    ];

    const res = await fetchAPI(
      `https://localhost:7011/api/SalaryRecord/updateSalaryRecord/${editRecord.id}`,
      "PATCH",
      patch
    );

    setSubmitting(false);

    if (res) {
      toast.success("Salary record updated successfully.");
      closeEdit();
      if (refetch) refetch();
      else window.location.reload();
    } else {
      toast.error("Some error occurred while updating. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-[84rem] px-5 py-8 lg:px-10">
      <header className="mb-8 border-b border-[#E3E5D6] pb-6">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">Payroll</span>
        <h1 className="mt-1 text-3xl font-extrabold text-[#010A08]">Salary Records</h1>
        <p className="mt-1 text-sm text-[#5C6B60]">Review and settle every employee's salary cycle.</p>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Payroll overview">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[#E3E5D6] bg-white p-4">
            <span className="block text-2xl font-extrabold text-[#010A08]">{s.value}</span>
            <span className="mt-1 block text-[12px] font-semibold text-[#5C6B60]">{s.label}</span>
          </div>
        ))}
      </section>

      <div className="mb-5 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
          {["All", "Paid", "Unpaid"].map((label) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={statusFilter === label}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold transition-colors ${
                statusFilter === label
                  ? "border-[#074C3A] bg-[#074C3A] text-[#D1FE17]"
                  : "border-[#E3E5D6] bg-white text-[#5C6B60] hover:border-[#074C3A]"
              }`}
              onClick={() => setStatusFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="search"
          className="w-full rounded-lg border border-[#E3E5D6] bg-white px-3.5 py-2 text-[13px] text-[#010A08] outline-none focus:border-[#074C3A] sm:w-64"
          placeholder="Search employee name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search salary records"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-[#E3E5D6] bg-white" aria-label="Salary records list">
        {loading ? (
          <div className="px-6 py-16 text-center">
            <p className="font-bold text-[#010A08]">Loading salary records…</p>
            <p className="mt-1 text-sm text-[#5C6B60]">Fetching the latest payroll data.</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E3E5D6] bg-[#F8FAEA]">
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#5C6B60]">Employee</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#5C6B60]">Base salary</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#5C6B60]">Net salary</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#5C6B60]">Payment date</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#5C6B60]">Status</th>
                  <th className="px-4 py-3" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr className="border-b border-[#E3E5D6] last:border-0 hover:bg-[#F8FAEA]/60" key={record.id}>
                    <td className="px-4 py-3 font-bold text-[#010A08]">{record.employeeName}</td>
                    <td className="px-4 py-3 text-[13px] text-[#5C6B60]">{formatCurrency(record.baseSalary)}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#010A08]">
                      {formatCurrency(record.netSalary)}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#5C6B60]">{record.paymentDate || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${
                          record.isPaid
                            ? "bg-[rgba(7,76,58,0.12)] text-[#074C3A]"
                            : "bg-[rgba(192,57,43,0.1)] text-[#C0392B]"
                        }`}
                      >
                        {record.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[12.5px] font-bold text-[#5C6B60] hover:bg-[#F8FAEA]"
                          onClick={() => openView(record)}
                        >
                          <MdVisibility size={16} /> View
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[12.5px] font-bold text-[#074C3A] hover:bg-[#F8FAEA]"
                          onClick={() => openEdit(record)}
                        >
                          <MdEdit size={16} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="font-bold text-[#010A08]">No salary records found</p>
            <p className="mt-1 text-sm text-[#5C6B60]">Try a different filter or search term.</p>
          </div>
        )}
      </section>

      {/* View modal */}
      {viewRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="View salary record"
        >
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E5D6] px-5 py-4">
              <h2 className="text-lg font-extrabold text-[#010A08]">Salary record</h2>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-md text-[#5C6B60] hover:bg-[#F8FAEA]"
                onClick={closeView}
                aria-label="Close"
              >
                <MdClose size={20} />
              </button>
            </div>
            <dl className="space-y-3 px-5 py-5 text-[13.5px]">
              <div className="flex justify-between">
                <dt className="text-[#5C6B60]">Employee</dt>
                <dd className="font-bold text-[#010A08]">{viewRecord.employeeName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#5C6B60]">Base salary</dt>
                <dd className="font-semibold text-[#010A08]">{formatCurrency(viewRecord.baseSalary)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#5C6B60]">Advance taken</dt>
                <dd className="font-semibold text-[#010A08]">
                  {viewRecord.advanceTaken != null ? formatCurrency(viewRecord.advanceTaken) : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#5C6B60]">Deduction</dt>
                <dd className="font-semibold text-[#010A08]">
                  {viewRecord.deduction != null ? formatCurrency(viewRecord.deduction) : "—"}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[#E3E5D6] pt-3">
                <dt className="font-bold text-[#074C3A]">Net salary</dt>
                <dd className="font-extrabold text-[#074C3A]">{formatCurrency(viewRecord.netSalary)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#5C6B60]">Payment date</dt>
                <dd className="font-semibold text-[#010A08]">{viewRecord.paymentDate || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#5C6B60]">Payment method</dt>
                <dd className="font-semibold text-[#010A08]">{viewRecord.paymentMethod || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#5C6B60]">Status</dt>
                <dd>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${
                      viewRecord.isPaid
                        ? "bg-[rgba(7,76,58,0.12)] text-[#074C3A]"
                        : "bg-[rgba(192,57,43,0.1)] text-[#C0392B]"
                    }`}
                  >
                    {viewRecord.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </dd>
              </div>
              {viewRecord.remarks && (
                <div>
                  <dt className="text-[#5C6B60]">Remarks</dt>
                  <dd className="mt-1 font-semibold text-[#010A08]">{viewRecord.remarks}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Edit salary record"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E5D6] px-5 py-4">
              <h2 className="text-lg font-extrabold text-[#010A08]">Edit — {editRecord.employeeName}</h2>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-md text-[#5C6B60] hover:bg-[#F8FAEA]"
                onClick={closeEdit}
                aria-label="Close"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form className="space-y-4 px-5 py-5" onSubmit={handleEditSubmit} noValidate>
              <div>
                <label className="mb-1 block text-[12.5px] font-bold text-[#074C3A]" htmlFor="edit-advance">
                  Advance taken
                </label>
                <input
                  id="edit-advance"
                  type="number"
                  min="0"
                  className={`w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none focus:border-[#074C3A] ${
                    errors.advanceTaken ? "border-[#C0392B]" : "border-[#E3E5D6]"
                  }`}
                  value={editDraft.advanceTaken}
                  onChange={(e) => updateDraft("advanceTaken", e.target.value)}
                  placeholder="0"
                />
                {errors.advanceTaken && (
                  <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.advanceTaken}</span>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[12.5px] font-bold text-[#074C3A]" htmlFor="edit-deduction">
                  Deduction
                </label>
                <input
                  id="edit-deduction"
                  type="number"
                  min="0"
                  className={`w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none focus:border-[#074C3A] ${
                    errors.deduction ? "border-[#C0392B]" : "border-[#E3E5D6]"
                  }`}
                  value={editDraft.deduction}
                  onChange={(e) => updateDraft("deduction", e.target.value)}
                  placeholder="0"
                />
                {errors.deduction && (
                  <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.deduction}</span>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[12.5px] font-bold text-[#074C3A]" htmlFor="edit-remarks">
                  Remarks
                </label>
                <textarea
                  id="edit-remarks"
                  rows={2}
                  className="w-full rounded-lg border border-[#E3E5D6] px-3 py-2 text-[13.5px] outline-none focus:border-[#074C3A]"
                  value={editDraft.remarks}
                  onChange={(e) => updateDraft("remarks", e.target.value)}
                  placeholder="Optional notes"
                />
              </div>

              <div className="flex items-center gap-2 border-t border-[#E3E5D6] pt-4">
                <input
                  id="edit-ispaid"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#E3E5D6] text-[#074C3A] focus:ring-[#074C3A]"
                  checked={editDraft.isPaid}
                  onChange={(e) => updateDraft("isPaid", e.target.checked)}
                />
                <label className="text-[13px] font-semibold text-[#010A08]" htmlFor="edit-ispaid">
                  Mark as paid
                </label>
              </div>

              {editDraft.isPaid && (
                <div>
                  <label className="mb-1 block text-[12.5px] font-bold text-[#074C3A]" htmlFor="edit-method">
                    Payment method
                  </label>
                  <select
                    id="edit-method"
                    className={`w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none focus:border-[#074C3A] ${
                      errors.paymentMethod ? "border-[#C0392B]" : "border-[#E3E5D6]"
                    }`}
                    value={editDraft.paymentMethod}
                    onChange={(e) => updateDraft("paymentMethod", e.target.value)}
                  >
                    <option value="">-- Select method --</option>
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  {errors.paymentMethod && (
                    <span className="mt-1 block text-[12px] text-[#C0392B]">{errors.paymentMethod}</span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#074C3A] px-4 py-2 text-[13.5px] font-bold text-[#D1FE17] transition-opacity hover:opacity-90 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[#E3E5D6] px-4 py-2 text-[13.5px] font-semibold text-[#5C6B60] hover:border-[#074C3A]"
                  onClick={closeEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}