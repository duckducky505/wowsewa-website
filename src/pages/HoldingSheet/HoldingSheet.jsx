// pages/AdminDashboard/HoldingSheetPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdFileDownload, MdAdd, MdClose } from 'react-icons/md';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { fetchHook } from '../../hooks/fetchHook';
import { fetchAPI } from '../../utils/fetchAPI';
import './HoldingSheet.css';

const blankForm = {
  createdDate: '',
  fromHolderName: '',
  toHolderName: '',
  entryType: '',
  paymentMethod: '',
  amount: '',
  status: '',
  note: '',
};

const HoldingSheet = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);

  const { data: holdingData } = fetchHook("https://localhost:7011/api/HoldingSheet/get/holding-sheet-data");
  const { data: statusValues } = fetchHook("https://localhost:7011/api/Categories/get/Status");
  const { data: paymentType } = fetchHook("https://localhost:7011/api/Categories/get/Payment-Method-Values");
  const { data: entryType } = fetchHook("https://localhost:7011/api/Categories/get/Entry-Types");

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setForm(blankForm);
    setMode('add');
  };

  const openEdit = (entry) => {
    setSelected(entry);
    setForm({
      createdDate: entry.createdDate || '',
      fromHolderName: entry.fromHolderName || '',
      toHolderName: entry.toHolderName || '',
      entryType: entry.entryType || entryType?.[0] || 'Collection',
      paymentMethod: entry.paymentMethod || paymentType?.[0] || 'Cash',
      amount: entry.amount ?? '',
      status: entry.status || statusValues?.[0] || 'Pending',
      note: entry.note || '',
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

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      createdDate: form.createdDate,
      fromHolderName: form.fromHolderName,
      toHolderName: form.toHolderName,
      entryType: form.entryType || entryType?.[0] || 'Collection',
      paymentMethod: form.paymentMethod || paymentType?.[0] || 'Cash',
      amount: Number(form.amount) || 0,
      status: form.status || statusValues?.[0] || 'Pending',
      note: form.note,
    };

    const addRes = await fetchAPI("https://localhost:7011/api/HoldingSheet/add/holding-Sheet-Data", "POST", payload);
    setSubmitting(false);

    if (addRes) {
      window.alert("New holding sheet entry added successfully.");
      window.location.reload();
    } else {
      window.alert("Error adding the data. Please try again later.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);

    const patchPayload = [];

    const fields = [
      { key: 'createdDate', path: '/CreatedDate', isNumber: false },
      { key: 'fromHolderName', path: '/FromHolderName', isNumber: false },
      { key: 'toHolderName', path: '/ToHolderName', isNumber: false },
      { key: 'entryType', path: '/EntryType', isNumber: false },
      { key: 'paymentMethod', path: '/PaymentMethod', isNumber: false },
      { key: 'amount', path: '/Amount', isNumber: true },
      { key: 'status', path: '/Status', isNumber: false },
      { key: 'note', path: '/Note', isNumber: false },
    ];

    fields.forEach(({ key, path, isNumber }) => {
      const currentValue = isNumber ? (Number(form[key]) || 0) : form[key];
      const originalValue = isNumber ? (Number(selected[key]) || 0) : (selected[key] || '');

      if (currentValue !== originalValue) {
        patchPayload.push({
          op: "replace",
          path,
          value: currentValue,
        });
      }
    });

    if (patchPayload.length === 0) {
      window.alert("No changes detected.");
      setSubmitting(false);
      closeAll();
      return;
    }

    const editRes = await fetchAPI(`https://localhost:7011/api/HoldingSheet/update-holding-sheet-data/${selected.id}`, "PATCH", patchPayload);
    setSubmitting(false);

    if (editRes) {
      window.alert("Entry edited successfully.");
      window.location.reload();
    } else {
      window.alert("Some error occurred. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);

    const delRes = await fetchAPI(`https://localhost:7011/api/HoldingSheet/delete/${selected.id}`, "DELETE");
    setSubmitting(false);

    if (delRes) {
      window.alert("Entry deleted successfully.");
      window.location.reload();
    } else {
      window.alert("Some error occurred. Please try again.");
    }
  };

  const HoldingForm = ({ onSubmit, submitLabel }) => (
    <form className="wsw-holding__form" onSubmit={onSubmit}>
      <div className="wsw-holding__field">
        <label className="wsw-holding__label" htmlFor="hs-date">Date</label>
        <input id="hs-date" type="date" name="createdDate" className="wsw-holding__input" value={form.createdDate} onChange={onField} required />
      </div>

      <div className="wsw-holding__field-row">
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-from">From (Source)</label>
          <input
            id="hs-from"
            type="text"
            name="fromHolderName"
            className="wsw-holding__input"
            placeholder="e.g. Sita Kumari"
            value={form.fromHolderName}
            onChange={onField}
          />
        </div>
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-to">To (Target)</label>
          <input
            id="hs-to"
            type="text"
            name="toHolderName"
            className="wsw-holding__input"
            placeholder="e.g. Arjun Thapa"
            value={form.toHolderName}
            onChange={onField}
          />
        </div>
      </div>

      <div className="wsw-holding__field-row">
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-entry-type">Entry type</label>
          <select id="hs-entry-type" name="entryType" className="wsw-holding__select" value={form.entryType} onChange={onField}>
            {entryType?.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-payment">Payment method</label>
          <select id="hs-payment" name="paymentMethod" className="wsw-holding__select" value={form.paymentMethod} onChange={onField}>
            {paymentType?.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="wsw-holding__field-row">
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-amount">Amount (Rs)</label>
          <input
            id="hs-amount"
            type="number"
            name="amount"
            className="wsw-holding__input"
            placeholder="0"
            value={form.amount}
            onChange={onField}
            min="0"
            required
          />
        </div>
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-status">Status</label>
          <select id="hs-status" name="status" className="wsw-holding__select" value={form.status} onChange={onField}>
            {statusValues?.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="wsw-holding__field">
        <label className="wsw-holding__label" htmlFor="hs-note">System note</label>
        <textarea
          id="hs-note"
          name="note"
          className="wsw-holding__textarea"
          rows="3"
          placeholder="Optional note"
          value={form.note}
          onChange={onField}
        />
      </div>

      <div className="wsw-holding__modal-actions">
        <button type="submit" className="wsw-holding__primary-btn" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <button type="button" className="wsw-holding__ghost-btn" onClick={closeAll}>
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="wsw-holding">
      <header className="wsw-holding__header">
        <div className="wsw-holding__header-inner">
          <div>
            <button type="button" className="wsw-holding__back-btn" onClick={() => navigate(-1)}>
              <MdArrowBack /> Back to dashboard
            </button>
            <span className="wsw-holding__eyebrow">Ledger audits</span>
            <h1 className="wsw-holding__title">Holding sheet</h1>
            <p className="wsw-holding__sub">Track active hand-to-hand collections and balances.</p>
          </div>
          <div className="wsw-holding__header-actions">
            <button type="button" className="wsw-holding__add-btn" onClick={openAdd}>
              <MdAdd size={18} /> Add entry
            </button>
            <button type="button" className="wsw-holding__icon-btn">
              <MdFileDownload size={18} /> Export
            </button>
          </div>
        </div>
      </header>

      <div className="wsw-holding__body">
        <section className="wsw-holding__panel" aria-label="Holding sheet entries">
          <div className="wsw-holding__table-wrap">
            <table className="wsw-holding__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source (From)</th>
                  <th>Target (To)</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>System note</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {holdingData?.length > 0 ? holdingData.map((sheet) => (
                  <tr className="wsw-holding__row" key={sheet.id}>
                    <td>{sheet.createdDate}</td>
                    <td className="wsw-holding__cell-strong">{sheet.fromHolderName}</td>
                    <td className="wsw-holding__cell-strong">{sheet.toHolderName}</td>
                    <td>
                      <span className="wsw-holding__tag">{sheet.entryType}</span>
                    </td>
                    <td className="wsw-holding__cell-muted">{sheet.paymentMethod}</td>
                    <td className="wsw-holding__cell-amount">Rs. {Number(sheet.amount).toLocaleString()}</td>
                    <td>
                      <span
                        className={
                          "wsw-holding__status-pill wsw-holding__status-pill--" +
                          (sheet.status || "").toLowerCase()
                        }
                      >
                        {sheet.status}
                      </span>
                    </td>
                    <td className="wsw-holding__cell-muted">{sheet.note}</td>
                    <td>
                      <div className="wsw-holding__row-actions">
                        <button type="button" className="wsw-holding__icon-action" onClick={() => openEdit(sheet)}>
                          <FaEdit /> Edit
                        </button>
                        <button
                          type="button"
                          className="wsw-holding__icon-action wsw-holding__icon-action--danger"
                          onClick={() => openDelete(sheet)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9}>
                      <div className="wsw-holding__empty">
                        <p className="wsw-holding__empty-title">No entries yet</p>
                        <p className="wsw-holding__empty-body">Add the first holding sheet entry to get started.</p>
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
        <div className="wsw-holding__modal-backdrop" role="dialog" aria-modal="true" aria-label={mode === 'add' ? 'Add holding sheet entry' : 'Edit holding sheet entry'}>
          <div className="wsw-holding__modal">
            <div className="wsw-holding__modal-head">
              <h2 className="wsw-holding__modal-title">
                {mode === 'add' ? 'Add holding sheet entry' : 'Edit holding sheet entry'}
              </h2>
              <button type="button" className="wsw-holding__modal-close" onClick={closeAll} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>
            <HoldingForm onSubmit={mode === 'add' ? handleAdd : handleEdit} submitLabel={mode === 'add' ? 'Add entry' : 'Save changes'} />
          </div>
        </div>
      )}

      {mode === 'delete' && (
        <div className="wsw-holding__modal-backdrop" role="dialog" aria-modal="true" aria-label="Delete entry">
          <div className="wsw-holding__modal wsw-holding__modal--narrow">
            <div className="wsw-holding__modal-head">
              <h2 className="wsw-holding__modal-title">Delete entry</h2>
              <button type="button" className="wsw-holding__modal-close" onClick={closeAll} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>
            <p className="wsw-holding__confirm-copy">
              Are you sure you want to delete the entry from <strong>{selected?.fromHolderName}</strong> to{' '}
              <strong>{selected?.toHolderName}</strong>? This can't be undone.
            </p>
            <div className="wsw-holding__modal-actions">
              <button type="button" className="wsw-holding__danger-btn" onClick={handleDelete} disabled={submitting}>
                {submitting ? 'Deleting…' : 'Confirm delete'}
              </button>
              <button type="button" className="wsw-holding__ghost-btn" onClick={closeAll}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoldingSheet;