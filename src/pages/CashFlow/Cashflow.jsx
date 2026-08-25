import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdFileDownload, MdAdd, MdClose } from 'react-icons/md';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { fetchAPI } from '../../utils/fetchAPI';
import { useSignalR } from '../../hooks/signalR';
import './Cashflow.css';

const blankForm = {
  createdDate: '',
  jobCategory: '',
  clientName: '',
  employeeName: '',
  cashType: 'Income',
  paymentMethod: 'Cash',
  cashIn: '',
  cashOut: '',
  description: '',
};

const CashFlowForm = ({ onSubmit, submitLabel, form, onField, closeAll, industryData, cashTypes, paymentMethods, employeesData, submitting }) => (
  <form className="wsw-cashflow__form" onSubmit={(e) => e.preventDefault()}>
    <div className="wsw-cashflow__field">
      <label className="wsw-cashflow__label" htmlFor="cf-date">Date</label>
      <input id="cf-date" type="date" name="createdDate" className="wsw-cashflow__input" value={form.createdDate} onChange={onField} required />
    </div>

    <div className="wsw-cashflow__field">
      <label className="wsw-cashflow__label" htmlFor="cf-category">Job category</label>
      <select id="cf-category" name="jobCategory" className="wsw-cashflow__select" value={form.jobCategory} onChange={onField}>
        <option value="">-- Select category --</option>
        {industryData?.map((job) => (
          <option key={job.industryId} value={job.industryId}>{job.industryName}</option>
        ))}
      </select>
    </div>

    <div className="wsw-cashflow__field-row">
      <div className="wsw-cashflow__field">
        <label className="wsw-cashflow__label" htmlFor="cf-client">Client name</label>
        <input
          id="cf-client"
          type="text"
          name="clientName"
          className="wsw-cashflow__input"
          placeholder="e.g. Ramesh Sharma"
          value={form.clientName}
          onChange={onField}
        />
      </div>
      <div className="wsw-cashflow__field">
        <label className="wsw-cashflow__label" htmlFor="cf-employee">Employee assignee</label>
        <select id="cf-employee" name="employeeName" className="wsw-cashflow__select" value={form.employeeName} onChange={onField}>
          <option value="">-- Select employee --</option>
          {employeesData?.map((emp) => (
            <option key={emp.guidId} value={emp.guidId}>{emp.fullName}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="wsw-cashflow__field-row">
      <div className="wsw-cashflow__field">
        <label className="wsw-cashflow__label" htmlFor="cf-cashtype">Cash type</label>
        <select id="cf-cashtype" name="cashType" className="wsw-cashflow__select" value={form.cashType} onChange={onField}>
          {cashTypes?.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="wsw-cashflow__field">
        <label className="wsw-cashflow__label" htmlFor="cf-payment">Payment method</label>
        <select id="cf-payment" name="paymentMethod" className="wsw-cashflow__select" value={form.paymentMethod} onChange={onField}>
          {paymentMethods?.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </div>

    <div className="wsw-cashflow__field-row">
      <div className="wsw-cashflow__field">
        <label className="wsw-cashflow__label" htmlFor="cf-cashin">Cash in (Rs)</label>
        <input id="cf-cashin" type="number" name="cashIn" className="wsw-cashflow__input" placeholder="0" value={form.cashIn} onChange={onField} min="0" />
      </div>
      <div className="wsw-cashflow__field">
        <label className="wsw-cashflow__label" htmlFor="cf-cashout">Cash out (Rs)</label>
        <input id="cf-cashout" type="number" name="cashOut" className="wsw-cashflow__input" placeholder="0" value={form.cashOut} onChange={onField} min="0" />
      </div>
    </div>

    <div className="wsw-cashflow__field">
      <label className="wsw-cashflow__label" htmlFor="cf-description">Description</label>
      <textarea
        id="cf-description"
        name="description"
        className="wsw-cashflow__textarea"
        rows="3"
        placeholder="Short note about the transaction"
        value={form.description}
        onChange={onField}
      />
    </div>

    <div className="wsw-cashflow__modal-actions">
      <button type="button" className="wsw-cashflow__primary-btn" onClick={onSubmit} disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
      <button type="button" className="wsw-cashflow__ghost-btn" onClick={closeAll}>
        Cancel
      </button>
    </div>
  </form>
);

const CASHFLOW_ENDPOINT = "https://localhost:7011/api/CashFlow/get/allCashFlowData";
const INDUSTRY_ENDPOINT = "https://localhost:7011/api/industry/getIndustryData";
const EMPLOYEES_ENDPOINT = "https://localhost:7011/api/Employee/getEmployeesDetail";
const CASHTYPE_ENDPOINT = "https://localhost:7011/api/Categories/get/Cash-Type-Values";
const PAYMENT_ENDPOINT = "https://localhost:7011/api/Categories/get/Payment-Method-Values";

const CashFlow = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    loadCashFlow();
    loadStaticLookups();
  }, [loadCashFlow, loadStaticLookups]);

  // Live updates: refresh the ledger whenever any client adds/edits/deletes
  // a cash flow entry, or when a Holding Sheet completion auto-generates one.
  useEffect(() => {
    if (!connection || !isConnected) return;

    const handleUpdate = () => loadCashFlow();

    connection.on("CashFlowUpdated", handleUpdate);

    return () => {
      connection.off("CashFlowUpdated", handleUpdate);
    };
  }, [connection, isConnected, loadCashFlow]);

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setForm({ ...blankForm, createdDate: today });
    setMode('add');
  };

  const openEdit = (entry) => {
    setSelected(entry);
    setForm({
      createdDate: entry.createdDate || '',
      jobCategory: entry.industryId ? entry.industryId.toString() : '',
      clientName: entry.clientName || '',
      employeeName: entry.employeeId || entry.employee?.guidId || '',
      cashType: entry.cashType || 'Income',
      paymentMethod: entry.paymentMethod || 'Cash',
      cashIn: entry.cashIn ?? '',
      cashOut: entry.cashOut ?? '',
      description: entry.description || '',
    });
    setMode('edit');
  };

  const openDelete = (entry) => {
    setSelected(entry);
    setMode('delete');
  };

  const closeAll = () => {
    setMode(null);
    setSelected(null);
    setForm(blankForm);
    setSubmitting(false);
  };

  const addFunc = async () => {
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

    if (res) {
      loadCashFlow();
      closeAll();
    } else {
      window.alert("Some error occurred. Please try again later.");
    }
  };

  const deleteFunc = async () => {
    if (!selected) return;
    setSubmitting(true);

    const res = await fetchAPI(`https://localhost:7011/api/CashFlow/delete/${selected.id}`, "DELETE");
    setSubmitting(false);

    if (res) {
      loadCashFlow();
      closeAll();
    } else {
      window.alert("Some error occurred. Please try again.");
    }
  };

  const editFunc = async () => {
    if (!selected) return;
    setSubmitting(true);

    const patchPayload = [];

    const fields = [
      { key: 'createdDate', path: '/createdDate', type: 'string' },
      { key: 'jobCategory', path: '/industryId', type: 'int' },
      { key: 'clientName', path: '/clientName', type: 'string' },
      { key: 'cashType', path: '/cashType', type: 'string' },
      { key: 'description', path: '/description', type: 'string' },
      { key: 'cashIn', path: '/cashIn', type: 'float' },
      { key: 'cashOut', path: '/cashOut', type: 'float' },
      { key: 'paymentMethod', path: '/paymentMethod', type: 'string' },
      { key: 'employeeName', path: '/employeeId', type: 'nullableString' },
    ];

    fields.forEach(({ key, path, type }) => {
      let currentValue = form[key];
      let originalValue = selected[key];

      if (key === 'jobCategory') {
        originalValue = selected.industryId;
      } else if (key === 'employeeName') {
        originalValue = selected.employee?.guidId;
      }

      if (type === 'int') {
        currentValue = parseInt(currentValue) || 0;
        originalValue = parseInt(originalValue) || 0;
      } else if (type === 'float') {
        currentValue = parseFloat(currentValue) || 0;
        originalValue = parseFloat(originalValue) || 0;
      } else if (type === 'nullableString') {
        currentValue = currentValue || null;
        originalValue = originalValue || null;
      } else {
        currentValue = currentValue || '';
        originalValue = originalValue || '';
      }

      if (currentValue !== originalValue) {
        patchPayload.push({ op: "replace", path, value: currentValue });
      }
    });

    if (patchPayload.length === 0) {
      window.alert("No changes detected.");
      setSubmitting(false);
      closeAll();
      return;
    }

    const res = await fetchAPI(`https://localhost:7011/api/CashFlow/update/${selected.id}`, "PATCH", patchPayload);
    setSubmitting(false);

    if (res) {
      loadCashFlow();
      closeAll();
    } else {
      window.alert("Some error occurred. Please try again.");
    }
  };

  return (
    <div className="wsw-cashflow">
      <header className="wsw-cashflow__header">
        <div className="wsw-cashflow__header-inner">
          <div>
            <button type="button" className="wsw-cashflow__back-btn" onClick={() => navigate(-1)}>
              <MdArrowBack /> Back to dashboard
            </button>
            <span className="wsw-cashflow__eyebrow">Ledger audits</span>
            <h1 className="wsw-cashflow__title">Cash flow</h1>
            <p className="wsw-cashflow__sub">Historic balance sheets for platform workflow parameters.</p>
          </div>
          <div className="wsw-cashflow__header-actions">
            {isConnected && <span className="wsw-cashflow__live-indicator">● Live</span>}
            <button type="button" className="wsw-cashflow__add-btn" onClick={openAdd}>
              <MdAdd size={18} /> Add entry
            </button>
            <button type="button" className="wsw-cashflow__icon-btn">
              <MdFileDownload size={18} /> Export
            </button>
          </div>
        </div>
      </header>

      <div className="wsw-cashflow__body">
        <section className="wsw-cashflow__panel" aria-label="Cash flow entries">
          <div className="wsw-cashflow__table-wrap">
            <table className="wsw-cashflow__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Client</th>
                  <th>Employee assignee</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Cash in</th>
                  <th>Cash out</th>
                  <th>Description</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {cashFlowLoading ? (
                  <tr>
                    <td colSpan={10}>
                      <p className="wsw-cashflow__cell-muted">Loading entries…</p>
                    </td>
                  </tr>
                ) : cashFlowData?.length > 0 ? cashFlowData.map((flow) => (
                  <tr className="wsw-cashflow__row" key={flow.id}>
                    <td>{flow.createdDate}</td>
                    <td className="wsw-cashflow__cell-muted">
                      {industryData?.find((job) => job.industryId === flow.industryId)?.industryName}
                    </td>
                    <td className="wsw-cashflow__cell-strong">{flow.clientName}</td>
                    <td className="wsw-cashflow__cell-strong">
                      {flow.employee?.fullName || employeesData?.find((emp) => emp.guidId === flow.employeeId)?.fullName || '—'}
                    </td>
                    <td>
                      <span
                        className={
                          "wsw-cashflow__status-pill " +
                          (flow.cashType?.toLowerCase() === 'income'
                            ? "wsw-cashflow__status-pill--income"
                            : "wsw-cashflow__status-pill--expense")
                        }
                      >
                        {flow.cashType}
                      </span>
                    </td>
                    <td className="wsw-cashflow__cell-muted">{flow.paymentMethod}</td>
                    <td className="wsw-cashflow__cell-amount wsw-cashflow__cell-amount--in">
                      {flow.cashIn > 0 ? `Rs. ${flow.cashIn.toLocaleString()}` : '—'}
                    </td>
                    <td className="wsw-cashflow__cell-amount wsw-cashflow__cell-amount--out">
                      {flow.cashOut > 0 ? `Rs. ${flow.cashOut.toLocaleString()}` : '—'}
                    </td>
                    <td className="wsw-cashflow__cell-muted">{flow.description}</td>
                    <td>
                      <div className="wsw-cashflow__row-actions">
                        <button type="button" className="wsw-cashflow__icon-action" onClick={() => openEdit(flow)}>
                          <FaEdit /> Edit
                        </button>
                        <button
                          type="button"
                          className="wsw-cashflow__icon-action wsw-cashflow__icon-action--danger"
                          onClick={() => openDelete(flow)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={10}>
                      <div className="wsw-cashflow__empty">
                        <p className="wsw-cashflow__empty-title">No entries yet</p>
                        <p className="wsw-cashflow__empty-body">Add the first cash flow entry to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {(mode === 'add' || mode === 'edit') && (
        <div className="wsw-cashflow__modal-backdrop" role="dialog" aria-modal="true" aria-label={mode === 'add' ? 'Add cash flow entry' : 'Edit cash flow entry'}>
          <div className="wsw-cashflow__modal">
            <div className="wsw-cashflow__modal-head">
              <h2 className="wsw-cashflow__modal-title">
                {mode === 'add' ? 'Add cash flow entry' : 'Edit cash flow entry'}
              </h2>
              <button type="button" className="wsw-cashflow__modal-close" onClick={closeAll} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>
            <CashFlowForm
              submitLabel={mode === 'add' ? 'Add entry' : 'Save changes'}
              form={form}
              onField={onField}
              closeAll={closeAll}
              industryData={industryData}
              cashTypes={cashType}
              paymentMethods={paymentMethod}
              employeesData={employeesData}
              onSubmit={mode === 'add' ? addFunc : editFunc}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {mode === 'delete' && (
        <div className="wsw-cashflow__modal-backdrop" role="dialog" aria-modal="true" aria-label="Delete entry">
          <div className="wsw-cashflow__modal wsw-cashflow__modal--narrow">
            <div className="wsw-cashflow__modal-head">
              <h2 className="wsw-cashflow__modal-title">Delete entry</h2>
              <button type="button" className="wsw-cashflow__modal-close" onClick={closeAll} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>
            <p className="wsw-cashflow__confirm-copy">
              Are you sure you want to delete the entry for <strong>{selected?.clientName || 'this row'}</strong>? This can't be undone.
            </p>
            <div className="wsw-cashflow__modal-actions">
              <button type="button" className="wsw-cashflow__danger-btn" onClick={deleteFunc} disabled={submitting}>
                {submitting ? 'Deleting…' : 'Confirm delete'}
              </button>
              <button type="button" className="wsw-cashflow__ghost-btn" onClick={closeAll}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashFlow;