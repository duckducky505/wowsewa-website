// pages/AdminDashboard/CashFlowPage.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../../utils/fetchAPI";
import { useSignalR } from "../../hooks/signalR";
import {
  PageHead, Card, Pill, Field, Modal, GhostButton, LimeButton, inputCls,
  useToast, ToastHost, BackIc, PlusIc, EditIc, TrashIc, StatTile, WalletIc, ClockIc,
} from "../../ui/ui";

const blankForm = {
  createdDate: "", jobCategory: "", clientName: "", employeeName: "",
  cashType: "Income", paymentMethod: "Cash", cashIn: "", cashOut: "", description: "",
};

const CASHFLOW_ENDPOINT = "https://localhost:7011/api/CashFlow/get/allCashFlowData";
const INDUSTRY_ENDPOINT = "https://localhost:7011/api/industry/getIndustryData";
const EMPLOYEES_ENDPOINT = "https://localhost:7011/api/Employee/getEmployeesDetail";
const CASHTYPE_ENDPOINT = "https://localhost:7011/api/Categories/get/Cash-Type-Values";
const PAYMENT_ENDPOINT = "https://localhost:7011/api/Categories/get/Payment-Method-Values";

function rs(v) { return `Rs. ${Number(v || 0).toLocaleString()}`; }

export default function CashFlow() {
  const navigate = useNavigate();
  const { toasts, push } = useToast();

  const [cashFlowData, setCashFlowData] = useState([]);
  const [cashFlowLoading, setCashFlowLoading] = useState(true);
  const [industryData, setIndustryData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [cashType, setCashType] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);

  const { connection, isConnected } = useSignalR() || {};

  const [mode, setMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);

  const loadCashFlow = useCallback(async () => {
    setCashFlowLoading(true);
    const res = await fetchAPI(CASHFLOW_ENDPOINT, "GET");
    setCashFlowData(Array.isArray(res) ? res : []);
    setCashFlowLoading(false);
  }, []);

  const loadStaticLookups = useCallback(async () => {
    const [ind, emp, ct, pm] = await Promise.all([
      fetchAPI(INDUSTRY_ENDPOINT, "GET"),
      fetchAPI(EMPLOYEES_ENDPOINT, "GET"),
      fetchAPI(CASHTYPE_ENDPOINT, "GET"),
      fetchAPI(PAYMENT_ENDPOINT, "GET"),
    ]);
    setIndustryData(Array.isArray(ind) ? ind : []);
    setEmployeesData(Array.isArray(emp) ? emp : []);
    setCashType(Array.isArray(ct) ? ct : []);
    setPaymentMethod(Array.isArray(pm) ? pm : []);
  }, []);

  useEffect(() => { loadCashFlow(); loadStaticLookups(); }, [loadCashFlow, loadStaticLookups]);

  useEffect(() => {
    if (!connection || !isConnected) return;
    const handleUpdate = () => loadCashFlow();
    connection.on("CashFlowUpdated", handleUpdate);
    return () => connection.off("CashFlowUpdated", handleUpdate);
  }, [connection, isConnected, loadCashFlow]);

  const totalIn = cashFlowData.reduce((s, f) => s + (Number(f.cashIn) || 0), 0);
  const totalOut = cashFlowData.reduce((s, f) => s + (Number(f.cashOut) || 0), 0);

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    const today = new Date().toISOString().split("T")[0];
    setForm({ ...blankForm, createdDate: today });
    setMode("add");
  };
  const openEdit = (entry) => {
    setSelected(entry);
    setForm({
      createdDate: entry.createdDate || "",
      jobCategory: entry.industryId ? entry.industryId.toString() : "",
      clientName: entry.clientName || "",
      employeeName: entry.employeeId || entry.employee?.guidId || "",
      cashType: entry.cashType || "Income",
      paymentMethod: entry.paymentMethod || "Cash",
      cashIn: entry.cashIn ?? "",
      cashOut: entry.cashOut ?? "",
      description: entry.description || "",
    });
    setMode("edit");
  };
  const openDelete = (entry) => { setSelected(entry); setMode("delete"); };
  const closeAll = () => { setMode(null); setSelected(null); setForm(blankForm); setSubmitting(false); };

  const addFunc = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      createdDate: form.createdDate,
      industryId: parseInt(form.jobCategory),
      clientName: form.clientName,
      cashType: form.cashType,
      description: form.description || "",
      cashIn: parseFloat(form.cashIn) || 0,
      cashOut: parseFloat(form.cashOut) || 0,
      paymentMethod: form.paymentMethod,
      employeeId: form.employeeName,
    };
    const res = await fetchAPI("https://localhost:7011/api/CashFlow/add/CashFlowData", "POST", payload);
    setSubmitting(false);
    if (res) { loadCashFlow(); closeAll(); push("Entry added"); }
    else push("Some error occurred. Please try again later.", "red");
  };

  const deleteFunc = async () => {
    if (!selected) return;
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/CashFlow/delete/${selected.id}`, "DELETE");
    setSubmitting(false);
    if (res) { loadCashFlow(); closeAll(); push("Entry deleted"); }
    else push("Some error occurred. Please try again.", "red");
  };

  const editFunc = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);

    const patchPayload = [];
    const fields = [
      { key: "createdDate", path: "/createdDate", type: "string" },
      { key: "jobCategory", path: "/industryId", type: "int" },
      { key: "clientName", path: "/clientName", type: "string" },
      { key: "cashType", path: "/cashType", type: "string" },
      { key: "description", path: "/description", type: "string" },
      { key: "cashIn", path: "/cashIn", type: "float" },
      { key: "cashOut", path: "/cashOut", type: "float" },
      { key: "paymentMethod", path: "/paymentMethod", type: "string" },
      { key: "employeeName", path: "/employeeId", type: "nullableString" },
    ];
    fields.forEach(({ key, path, type }) => {
      let currentValue = form[key];
      let originalValue = selected[key];
      if (key === "jobCategory") originalValue = selected.industryId;
      else if (key === "employeeName") originalValue = selected.employee?.guidId;

      if (type === "int") { currentValue = parseInt(currentValue) || 0; originalValue = parseInt(originalValue) || 0; }
      else if (type === "float") { currentValue = parseFloat(currentValue) || 0; originalValue = parseFloat(originalValue) || 0; }
      else if (type === "nullableString") { currentValue = currentValue || null; originalValue = originalValue || null; }
      else { currentValue = currentValue || ""; originalValue = originalValue || ""; }

      if (currentValue !== originalValue) patchPayload.push({ op: "replace", path, value: currentValue });
    });

    if (patchPayload.length === 0) {
      push("No changes detected", "amber");
      setSubmitting(false);
      closeAll();
      return;
    }

    const res = await fetchAPI(`https://localhost:7011/api/CashFlow/update/${selected.id}`, "PATCH", patchPayload);
    setSubmitting(false);
    if (res) { loadCashFlow(); closeAll(); push("Entry updated"); }
    else push("Some error occurred. Please try again.", "red");
  };

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#5C6B60] transition-colors hover:text-[#074C3A]">
        <BackIc className="h-4 w-4" /> Back to dashboard
      </button>

      <PageHead eyebrow="Finance · Ledger" title="Cash flow" sub="Historic balance sheet for every income and expense entry.">
        {isConnected && <Pill tone="lime" pulse>Live</Pill>}
        <LimeButton onClick={openAdd}><PlusIc className="h-4 w-4" /> Add entry</LimeButton>
      </PageHead>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile label="Money in" value={totalIn} prefix="Rs. " icon={WalletIc} tone="pine" />
        <StatTile label="Money out" value={totalOut} prefix="Rs. " icon={WalletIc} tone="red" />
        <StatTile label="Net position" value={totalIn - totalOut} prefix="Rs. " icon={ClockIc} tone="lime" />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#E3E5D6] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3 text-right">Cash in</th>
                <th className="px-5 py-3 text-right">Cash out</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cashFlowLoading ? (
                <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-[#5C6B60]">Loading entries…</td></tr>
              ) : cashFlowData.length > 0 ? (
                cashFlowData.map((flow) => (
                  <tr key={flow.id} className="border-b border-[#E3E5D6] transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA]">
                    <td className="px-5 py-3.5 text-sm text-[#5C6B60]">{flow.createdDate}</td>
                    <td className="px-5 py-3.5 text-sm text-[#5C6B60]">
                      {industryData.find((job) => job.industryId === flow.industryId)?.industryName || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[#010A08]">{flow.clientName}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#010A08]">
                      {flow.employee?.fullName || employeesData.find((emp) => emp.guidId === flow.employeeId)?.fullName || "—"}
                    </td>
                    <td className="px-5 py-3.5"><Pill tone={flow.cashType?.toLowerCase() === "income" ? "pine" : "red"}>{flow.cashType}</Pill></td>
                    <td className="px-5 py-3.5 text-sm text-[#5C6B60]">{flow.paymentMethod}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm font-bold text-[#074C3A]">{flow.cashIn > 0 ? rs(flow.cashIn) : "—"}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm font-bold text-[#C0392B]">{flow.cashOut > 0 ? rs(flow.cashOut) : "—"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <GhostButton onClick={() => openEdit(flow)} className="px-3 py-1.5"><EditIc className="h-3.5 w-3.5" /> Edit</GhostButton>
                        <button onClick={() => openDelete(flow)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold text-[#C0392B] transition-colors hover:bg-[rgba(192,57,43,0.07)]">
                          <TrashIc className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-[#5C6B60]">No entries yet. Add the first cash flow entry to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {(mode === "add" || mode === "edit") && (
        <Modal title={mode === "add" ? "Add cash flow entry" : "Edit cash flow entry"} onClose={closeAll}>
          <form className="space-y-4" onSubmit={mode === "add" ? addFunc : editFunc}>
            <Field label="Date">
              <input type="date" name="createdDate" className={inputCls} value={form.createdDate} onChange={onField} required />
            </Field>
            <Field label="Job category">
              <select name="jobCategory" className={inputCls} value={form.jobCategory} onChange={onField}>
                <option value="">-- Select category --</option>
                {industryData.map((job) => <option key={job.industryId} value={job.industryId}>{job.industryName}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Client name">
                <input name="clientName" className={inputCls} value={form.clientName} onChange={onField} placeholder="e.g. Ramesh Sharma" />
              </Field>
              <Field label="Employee assignee">
                <select name="employeeName" className={inputCls} value={form.employeeName} onChange={onField}>
                  <option value="">-- Select employee --</option>
                  {employeesData.map((emp) => <option key={emp.guidId} value={emp.guidId}>{emp.fullName}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cash type">
                <select name="cashType" className={inputCls} value={form.cashType} onChange={onField}>
                  {cashType.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Payment method">
                <select name="paymentMethod" className={inputCls} value={form.paymentMethod} onChange={onField}>
                  {paymentMethod.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cash in (Rs)">
                <input type="number" min="0" name="cashIn" className={inputCls} value={form.cashIn} onChange={onField} placeholder="0" />
              </Field>
              <Field label="Cash out (Rs)">
                <input type="number" min="0" name="cashOut" className={inputCls} value={form.cashOut} onChange={onField} placeholder="0" />
              </Field>
            </div>
            <Field label="Description" optional>
              <textarea name="description" className={`${inputCls} min-h-[70px]`} value={form.description} onChange={onField} placeholder="Short note about the transaction" />
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
            Are you sure you want to delete the entry for <strong className="text-[#010A08]">{selected?.clientName || "this row"}</strong>? This can't be undone.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            <button onClick={deleteFunc} disabled={submitting} className="rounded-lg bg-[#C0392B] px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
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