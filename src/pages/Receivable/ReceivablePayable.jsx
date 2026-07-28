// pages/AdminDashboard/ReceivablePayablePage.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdClose } from 'react-icons/md';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { fetchHook } from '../../hooks/fetchHook';
import { fetchAPI } from '../../utils/fetchAPI';
import './ReceivablePayable.css';

const blankForm = {
  date: '',
  name: '',
  type: '',
  totalAmount: '',
  paidAmount: '',
  method: '',
  status: '',
  note: '',
};

// ---- Helpers --------------------------------------------------------------

function normalizeEntry(raw) {
  const total = Number(raw.totalAmount ?? raw.TotalAmount ?? 0);
  const paid = Number(raw.paidAmount ?? raw.PaidAmount ?? 0);
  const rawDate = raw.createdDate ?? raw.CreatedDate ?? '';

  return {
    id: raw.guidId ?? raw.GuidId,
    date: rawDate ? rawDate.split('T')[0] : '',
    name: raw.name ?? raw.Name ?? '',
    type: raw.recPay ?? raw.RecPay ?? '',
    totalAmount: total,
    paidAmount: paid,
    remaining: total - paid,
    method: raw.paymentMethod ?? raw.PaymentMethod ?? '',
    status: raw.status ?? raw.Status ?? deriveStatus(total, paid),
    note: raw.note ?? raw.Note ?? '',
  };
}

function deriveStatus(total, paid) {
  const remaining = Number(total || 0) - Number(paid || 0);
  if (remaining <= 0 && Number(total) > 0) return 'Paid';
  if (Number(paid) > 0) return 'Partial';
  return 'Pending';
}

function formatRs(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

const EntryForm = ({
  form,
  onField,
  typeOptions,
  paymentType,
  statusOptions,
  previewRemaining,
  previewStatus,
  submitting,
  closeAll,
  onSubmit,
  submitLabel,
}) => (
  <form className="wsw-recpay__form" onSubmit={onSubmit}>
    <div className="wsw-recpay__field-row">
      <div className="wsw-recpay__field">
        <label className="wsw-recpay__label" htmlFor="rp-date">Date</label>
        <input
          id="rp-date"
          type="date"
          name="date"
          className="wsw-recpay__input"
          value={form.date}
          onChange={onField}
          required
        />
      </div>
      <div className="wsw-recpay__field">
        <label className="wsw-recpay__label" htmlFor="rp-type">Type</label>
        <select
          id="rp-type"
          name="type"
          className="wsw-recpay__select"
          value={form.type}
          onChange={onField}
          required
        >
          <option value="">-- Select --</option>
          {typeOptions?.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="wsw-recpay__field">
      <label className="wsw-recpay__label" htmlFor="rp-name">Name</label>
      <input
        id="rp-name"
        type="text"
        name="name"
        className="wsw-recpay__input"
        placeholder="e.g. Ramesh Sharma"
        value={form.name}
        onChange={onField}
        required
      />
    </div>

    <div className="wsw-recpay__field-row">
      <div className="wsw-recpay__field">
        <label className="wsw-recpay__label" htmlFor="rp-total">Total amount (Rs)</label>
        <input
          id="rp-total"
          type="number"
          name="totalAmount"
          className="wsw-recpay__input"
          placeholder="0"
          value={form.totalAmount}
          onChange={onField}
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="wsw-recpay__field">
        <label className="wsw-recpay__label" htmlFor="rp-paid">Paid amount (Rs)</label>
        <input
          id="rp-paid"
          type="number"
          name="paidAmount"
          className="wsw-recpay__input"
          placeholder="0"
          value={form.paidAmount}
          onChange={onField}
          min="0"
          step="0.01"
        />
      </div>
    </div>

    <div className="wsw-recpay__preview">
      <span>Remaining: <strong>{formatRs(previewRemaining)}</strong></span>
      <span className={`wsw-recpay__status-pill wsw-recpay__status-pill--${(form.status || previewStatus).toLowerCase()}`}>
        {form.status || previewStatus}
      </span>
    </div>

    <div className="wsw-recpay__field-row">
      <div className="wsw-recpay__field">
        <label className="wsw-recpay__label" htmlFor="rp-method">Method</label>
        <select
          id="rp-method"
          name="method"
          className="wsw-recpay__select"
          value={form.method}
          onChange={onField}
        >
          <option value="">-- Select --</option>
          {paymentType?.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="wsw-recpay__field">
        <label className="wsw-recpay__label" htmlFor="rp-status">Status</label>
        <select
          id="rp-status"
          name="status"
          className="wsw-recpay__select"
          value={form.status || previewStatus}
          onChange={onField}
        >
          <option value="">-- Select --</option>
          {statusOptions?.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="wsw-recpay__field">
      <label className="wsw-recpay__label" htmlFor="rp-note">Note</label>
      <textarea
        id="rp-note"
        name="note"
        className="wsw-recpay__textarea"
        rows="3"
        placeholder="Optional note"
        value={form.note}
        onChange={onField}
      />
    </div>

    <div className="wsw-recpay__modal-actions">
      <button type="submit" className="wsw-recpay__primary-btn" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
      <button type="button" className="wsw-recpay__ghost-btn" onClick={closeAll}>
        Cancel
      </button>
    </div>
  </form>
);

const ReceivablePayablePage = () => {
  const navigate = useNavigate();

  const { data: rawEntries, loading: entriesLoading } = fetchHook(
    'https://localhost:7011/api/Receivable/getEntries'
  );
  const { data: paymentType } = fetchHook('https://localhost:7011/api/Categories/get/Payment-Method-Values');
  const { data: typeOptions } = fetchHook('https://localhost:7011/api/Categories/get/RecPay-Type');
  const { data: statusOptions } = fetchHook('https://localhost:7011/api/Categories/get/Status');

  const entries = useMemo(() => (rawEntries || []).map(normalizeEntry), [rawEntries]);

  const [typeFilter, setTypeFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');

  const [mode, setMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchesType = typeFilter === 'All' || e.type === typeFilter;
      const matchesCompletion = showAll || e.remaining > 0;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.note.toLowerCase().includes(q);
      return matchesType && matchesCompletion && matchesSearch;
    });
  }, [entries, typeFilter, showAll, search]);

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setForm({
      ...blankForm,
      type: typeOptions?.[0] || '',
      status: statusOptions?.[0] || '',
    });
    setMode('add');
  };

  const openEdit = (entry) => {
    setSelected(entry);
    setForm({
      date: entry.date || '',
      name: entry.name || '',
      type: entry.type || typeOptions?.[0] || '',
      totalAmount: String(entry.totalAmount ?? ''),
      paidAmount: String(entry.paidAmount ?? ''),
      method: entry.method || paymentType?.[0] || '',
      status: entry.status || statusOptions?.[0] || '',
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

  const previewRemaining = Number(form.totalAmount || 0) - Number(form.paidAmount || 0);
  const previewStatus = deriveStatus(form.totalAmount, form.paidAmount);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      createdDate: form.date,
      name: form.name,
      recPay: form.type,
      totalAmount: Number(form.totalAmount) || 0,
      paidAmount: Number(form.paidAmount) || 0,
      paymentMethod: form.method,
      status: form.status || deriveStatus(form.totalAmount, form.paidAmount),
      note: form.note,
    };

    const res = await fetchAPI('https://localhost:7011/api/Receivable/AddRecPayData', 'POST', payload);
    setSubmitting(false);

    if (res) {
      window.alert('Entry added successfully.');
      window.location.reload();
    } else {
      window.alert('Error adding the entry. Please try again later.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);

    const patchPayload = [
      { op: 'replace', path: '/createdDate', value: form.date },
      { op: 'replace', path: '/name', value: form.name },
      { op: 'replace', path: '/recPay', value: form.type },
      { op: 'replace', path: '/totalAmount', value: Number(form.totalAmount) || 0 },
      { op: 'replace', path: '/paidAmount', value: Number(form.paidAmount) || 0 },
      { op: 'replace', path: '/paymentMethod', value: form.method },
      { op: 'replace', path: '/status', value: form.status || deriveStatus(form.totalAmount, form.paidAmount) },
      { op: 'replace', path: '/note', value: form.note },
    ];

    const res = await fetchAPI(`https://localhost:7011/api/Receivable/UpdateRecPayData/${selected.id}`, 'PATCH', patchPayload);
    setSubmitting(false);

    if (res) {
      window.alert('Entry updated successfully.');
      window.location.reload();
    } else {
      window.alert('Some error occurred. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Receivable/deleteARecPayData/${selected.id}`, 'DELETE');
    setSubmitting(false);

    if (res) {
      window.alert('Entry deleted successfully.');
      window.location.reload();
    } else {
      window.alert('Some error occurred. Please try again.');
    }
  };

  return (
    <div className="wsw-recpay">
      <header className="wsw-recpay__header">
        <div className="wsw-recpay__header-inner">
          <div>
            <button type="button" className="wsw-recpay__back-btn" onClick={() => navigate(-1)}>
              <MdArrowBack /> Back to dashboard
            </button>
            <span className="wsw-recpay__eyebrow">Ledger audits</span>
            <h1 className="wsw-recpay__title">Receivable / Payable tracker</h1>
            <p className="wsw-recpay__sub">Who owes the business, and who the business owes.</p>
          </div>
          <div className="wsw-recpay__header-actions">
            <button type="button" className="wsw-recpay__add-btn" onClick={openAdd}>
              <MdAdd size={18} /> Add entry
            </button>
          </div>
        </div>
      </header>

      <div className="wsw-recpay__body">
        <div className="wsw-recpay__toolbar">
          <div className="wsw-recpay__tabs" role="tablist" aria-label="Filter by type">
            {['All', ...(typeOptions || [])].map((t) => (
              <button
                type="button"
                role="tab"
                key={t}
                aria-selected={typeFilter === t}
                className={'wsw-recpay__tab' + (typeFilter === t ? ' wsw-recpay__tab--active' : '')}
                onClick={() => setTypeFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="wsw-recpay__toolbar-right">
            <label className="wsw-recpay__toggle-label">
              <input
                type="checkbox"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
              />
              Show settled too
            </label>
            <input
              type="search"
              className="wsw-recpay__search"
              placeholder="Search name or note"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search entries"
            />
          </div>
        </div>

        <section className="wsw-recpay__panel" aria-label="Receivable and payable entries">
          <div className="wsw-recpay__table-wrap">
            <table className="wsw-recpay__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Total amount</th>
                  <th>Paid amount</th>
                  <th>Remaining</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {entriesLoading ? (
                  <tr>
                    <td colSpan={10}>
                      <p className="wsw-recpay__loading-note">Loading entries…</p>
                    </td>
                  </tr>
                ) : filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => {
                    const status = entry.status || deriveStatus(entry.totalAmount, entry.paidAmount);
                    return (
                      <tr className="wsw-recpay__row" key={entry.id}>
                        <td>{entry.date}</td>
                        <td className="wsw-recpay__cell-strong">{entry.name}</td>
                        <td>
                          <span className={`wsw-recpay__type-tag wsw-recpay__type-tag--${String(entry.type).toLowerCase()}`}>
                            {entry.type}
                          </span>
                        </td>
                        <td className="wsw-recpay__cell-amount">{formatRs(entry.totalAmount)}</td>
                        <td className="wsw-recpay__cell-muted">{formatRs(entry.paidAmount)}</td>
                        <td className={entry.remaining > 0 ? 'wsw-recpay__cell-negative' : 'wsw-recpay__cell-amount'}>
                          {formatRs(entry.remaining)}
                        </td>
                        <td className="wsw-recpay__cell-muted">{entry.method || '—'}</td>
                        <td>
                          <span className={`wsw-recpay__status-pill wsw-recpay__status-pill--${String(status).toLowerCase()}`}>
                            {status}
                          </span>
                        </td>
                        <td className="wsw-recpay__cell-muted">{entry.note}</td>
                        <td>
                          <div className="wsw-recpay__row-actions">
                            <button type="button" className="wsw-recpay__icon-action" onClick={() => openEdit(entry)}>
                              <FaEdit /> Edit
                            </button>
                            <button
                              type="button"
                              className="wsw-recpay__icon-action wsw-recpay__icon-action--danger"
                              onClick={() => openDelete(entry)}
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10}>
                      <div className="wsw-recpay__empty">
                        <p className="wsw-recpay__empty-title">Nothing outstanding</p>
                        <p className="wsw-recpay__empty-body">
                          {showAll ? 'No entries match this filter.' : 'Every receivable and payable is settled.'}
                        </p>
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
        <div className="wsw-recpay__modal-backdrop" role="dialog" aria-modal="true" aria-label={mode === 'add' ? 'Add entry' : 'Edit entry'}>
          <div className="wsw-recpay__modal">
            <div className="wsw-recpay__modal-head">
              <h2 className="wsw-recpay__modal-title">{mode === 'add' ? 'Add entry' : 'Edit entry'}</h2>
              <button type="button" className="wsw-recpay__modal-close" onClick={closeAll} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>
            <EntryForm
              form={form}
              onField={onField}
              typeOptions={typeOptions}
              paymentType={paymentType}
              statusOptions={statusOptions}
              previewRemaining={previewRemaining}
              previewStatus={previewStatus}
              submitting={submitting}
              closeAll={closeAll}
              onSubmit={mode === 'add' ? handleAdd : handleEdit}
              submitLabel={mode === 'add' ? 'Add entry' : 'Save changes'}
            />
          </div>
        </div>
      )}

      {mode === 'delete' && (
        <div className="wsw-recpay__modal-backdrop" role="dialog" aria-modal="true" aria-label="Delete entry">
          <div className="wsw-recpay__modal wsw-recpay__modal--narrow">
            <div className="wsw-recpay__modal-head">
              <h2 className="wsw-recpay__modal-title">Delete entry</h2>
              <button type="button" className="wsw-recpay__modal-close" onClick={closeAll} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>
            <p className="wsw-recpay__confirm-copy">
              Delete the {String(selected?.type).toLowerCase()} entry for <strong>{selected?.name}</strong>? This can't be undone.
            </p>
            <div className="wsw-recpay__modal-actions">
              <button type="button" className="wsw-recpay__danger-btn" onClick={handleDelete} disabled={submitting}>
                {submitting ? 'Deleting…' : 'Confirm delete'}
              </button>
              <button type="button" className="wsw-recpay__ghost-btn" onClick={closeAll}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivablePayablePage;