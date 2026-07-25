// pages/AdminDashboard/HoldingSheetPage.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdFileDownload, MdAdd, MdClose } from 'react-icons/md';
import { FaEdit, FaTrash, FaBan } from 'react-icons/fa';
import { fetchHook } from '../../hooks/fetchHook';
import { fetchAPI } from '../../utils/fetchAPI';
import './HoldingSheet.css';

// ---- Holder type grouping --------------------------------------------------------------
// Mirrors the "Holders" list in the sheet: Cash/Bank/Personal/Client/Vendor are
// fixed system accounts; Staff is the only type meant to grow (linked to an
// actual Employee record).

const HOLDER_GROUP_LABEL = {
  Cash: 'Cash & bank',
  Bank: 'Cash & bank',
  Personal: 'Personal holding',
  Staff: 'Staff',
  Client: 'External',
  Vendor: 'External',
};

const blankForm = {
  createdDate: '',
  refId: '',
  description: '',
  entryType: '',
  fromHolderId: '',
  toHolderId: '',
  amount: '',
  method: '',
  status: '',
  note: '',
};

// ---- Helpers --------------------------------------------------------------

function normalizeHolder(raw) {
  return {
    id: raw.holderId ?? raw.id ?? raw.Id,
    name: raw.name ?? raw.Name ?? '',
    type: raw.type ?? raw.Type ?? 'Client',
    balance: raw.currentBalance ?? raw.CurrentBalance ?? 0,
    isSystem: raw.isSystem ?? raw.IsSystem ?? true,
  };
}

function normalizeEntry(raw) {
  return {
    id: raw.id ?? raw.Id,
    date: raw.createdDate ?? raw.CreatedDate ?? '',
    refId: raw.refId ?? raw.RefId ?? '',
    description: raw.description ?? raw.Description ?? '',
    entryType: raw.entryType ?? raw.EntryType ?? '',
    fromHolderId: raw.fromHolderId ?? raw.FromHolderId ?? '',
    fromHolderName: raw.fromHolderName ?? raw.fromHolder?.name ?? '',
    toHolderId: raw.toHolderId ?? raw.ToHolderId ?? '',
    toHolderName: raw.toHolderName ?? raw.toHolder?.name ?? '',
    amount: raw.amount ?? raw.Amount ?? 0,
    method: raw.method ?? raw.Method ?? '',
    status: raw.status ?? raw.Status ?? 'Pending',
    note: raw.note ?? raw.Note ?? '',
    fromBalanceAfter: raw.fromBalanceAfter ?? raw.FromBalanceAfter ?? null,
    toBalanceAfter: raw.toBalanceAfter ?? raw.ToBalanceAfter ?? null,
  };
}

function isRowComplete(entry) {
  return Boolean(entry.fromHolderId && entry.toHolderId && Number(entry.amount) > 0 && entry.status);
}

function formatRs(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

const HoldingSheet = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null); // null | 'add' | 'edit' | 'cancel' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);

  const { data: rawEntries, loading: entriesLoading } = fetchHook('https://localhost:7011/api/HoldingSheet/getEntries');
  const { data: rawHolders, loading: holdersLoading } = fetchHook('https://localhost:7011/api/Holders/getHolders');
  const { data: statusValues } = fetchHook('https://localhost:7011/api/Categories/get/Status');
  const { data: paymentType } = fetchHook('https://localhost:7011/api/Categories/get/Payment-Method-Values');
  const { data: entryType } = fetchHook('https://localhost:7011/api/Categories/get/Entry-Types');

  const entries = useMemo(() => (rawEntries || []).map(normalizeEntry), [rawEntries]);
  const holders = useMemo(() => (rawHolders || []).map(normalizeHolder), [rawHolders]);

  const holderById = useMemo(() => {
    const map = new Map();
    holders.forEach((h) => map.set(h.id, h));
    return map;
  }, [holders]);

  // Groups holders under their sheet-style section labels for the dropdowns
  // and the balances panel — Cash/Bank together, Staff together, etc.
  const groupedHolders = useMemo(() => {
    const groups = new Map();
    holders.forEach((h) => {
      const label = HOLDER_GROUP_LABEL[h.type] || 'Other';
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(h);
    });
    return [...groups.entries()];
  }, [holders]);

  const summary = useMemo(() => {
    const byType = (type) => holders.filter((h) => h.type === type).reduce((sum, h) => sum + Number(h.balance || 0), 0);
    const officeCash = holders.find((h) => h.name === 'Office Cash')?.balance ?? byType('Cash');
    const companyBank = holders.find((h) => h.name === 'Company Bank')?.balance ?? byType('Bank');
    const personalHolding = byType('Personal');
    const staffHolding = byType('Staff');
    const totalBusinessMoney = Number(officeCash) + Number(companyBank);

    return [
      { label: 'Office Cash', value: officeCash },
      { label: 'Company Bank', value: companyBank },
      { label: 'Personal Holding', value: personalHolding },
      { label: 'Total Staff Holding', value: staffHolding },
      { label: 'Total Business Money', value: totalBusinessMoney },
    ];
  }, [holders]);

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setForm(blankForm);
    setMode('add');
  };

  const openEdit = (entry) => {
    setSelected(entry);
    setForm({
      createdDate: entry.date || '',
      refId: entry.refId || '',
      description: entry.description || '',
      entryType: entry.entryType || entryType?.[0] || '',
      fromHolderId: entry.fromHolderId || '',
      toHolderId: entry.toHolderId || '',
      amount: entry.amount ?? '',
      method: entry.method || paymentType?.[0] || '',
      status: entry.status || statusValues?.[0] || '',
      note: entry.note || '',
    });
    setMode('edit');
  };

  const openCancel = (entry) => {
    setSelected(entry);
    setMode('cancel');
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
      refId: form.refId,
      description: form.description,
      entryType: form.entryType || entryType?.[0] || '',
      fromHolderId: form.fromHolderId,
      toHolderId: form.toHolderId,
      amount: Number(form.amount) || 0,
      method: form.method || paymentType?.[0] || '',
      status: form.status || statusValues?.[0] || 'Pending',
      note: form.note,
    };

    // Balance snapshots (fromBalanceAfter/toBalanceAfter) are computed and
    // written server-side inside the same transaction that updates
    // Holder.currentBalance — the frontend never calculates them.
    const addRes = await fetchAPI('https://localhost:7011/api/HoldingSheet/addEntry', 'POST', payload);
    setSubmitting(false);

    if (addRes) {
      window.alert('New holding sheet entry added successfully.');
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
      { op: 'replace', path: '/createdDate', value: form.createdDate },
      { op: 'replace', path: '/refId', value: form.refId },
      { op: 'replace', path: '/description', value: form.description },
      { op: 'replace', path: '/entryType', value: form.entryType },
      { op: 'replace', path: '/fromHolderId', value: form.fromHolderId },
      { op: 'replace', path: '/toHolderId', value: form.toHolderId },
      { op: 'replace', path: '/amount', value: Number(form.amount) || 0 },
      { op: 'replace', path: '/method', value: form.method },
      { op: 'replace', path: '/status', value: form.status },
      { op: 'replace', path: '/note', value: form.note },
    ];

    const editRes = await fetchAPI(`https://localhost:7011/api/HoldingSheet/updateEntry/${selected.id}`, 'PATCH', patchPayload);
    setSubmitting(false);

    if (editRes) {
      window.alert('Entry updated successfully.');
      window.location.reload();
    } else {
      window.alert('Some error occurred. Please try again.');
    }
  };

  // Matches the sheet's own rule: "Mistake entry → Cancelled instead of
  // deleting." A completed entry already moved balances, so reversing it
  // needs a real backend operation, not a client-side delete.
  const handleCancel = async () => {
    if (!selected) return;
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/HoldingSheet/cancelEntry/${selected.id}`, 'PATCH', [
      { op: 'replace', path: '/status', value: 'Cancelled' },
    ]);
    setSubmitting(false);

    if (res) {
      window.alert('Entry cancelled and balances reversed.');
      window.location.reload();
    } else {
      window.alert('Some error occurred. Please try again.');
    }
  };

  // True delete is only offered for entries that never affected a balance
  // (Pending, or already Cancelled) — see row actions below.
  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    const delRes = await fetchAPI(`https://localhost:7011/api/HoldingSheet/deleteEntry/${selected.id}`, 'DELETE');
    setSubmitting(false);

    if (delRes) {
      window.alert('Entry deleted successfully.');
      window.location.reload();
    } else {
      window.alert('Some error occurred. Please try again.');
    }
  };

  const HoldingForm = ({ onSubmit, submitLabel }) => (
    <form className="wsw-holding__form" onSubmit={onSubmit}>
      <div className="wsw-holding__field-row">
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-date">Date</label>
          <input id="hs-date" type="date" name="createdDate" className="wsw-holding__input" value={form.createdDate} onChange={onField} required />
        </div>
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-ref">Ref / Job ID</label>
          <input id="hs-ref" type="text" name="refId" className="wsw-holding__input" placeholder="e.g. J001" value={form.refId} onChange={onField} />
        </div>
      </div>

      <div className="wsw-holding__field">
        <label className="wsw-holding__label" htmlFor="hs-desc">Description</label>
        <input id="hs-desc" type="text" name="description" className="wsw-holding__input" placeholder="e.g. Laptop repair paid to Jiwan personal" value={form.description} onChange={onField} />
      </div>

      <div className="wsw-holding__field-row">
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-entry-type">Entry type</label>
          <select id="hs-entry-type" name="entryType" className="wsw-holding__select" value={form.entryType} onChange={onField}>
            <option value="">-- Select --</option>
            {entryType?.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-method">Method</label>
          <select id="hs-method" name="method" className="wsw-holding__select" value={form.method} onChange={onField}>
            <option value="">-- Select --</option>
            {paymentType?.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="wsw-holding__field-row">
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-from">From holder</label>
          <select id="hs-from" name="fromHolderId" className="wsw-holding__select" value={form.fromHolderId} onChange={onField} required>
            <option value="">-- Select --</option>
            {groupedHolders.map(([label, list]) => (
              <optgroup label={label} key={label}>
                {list.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-to">To holder</label>
          <select id="hs-to" name="toHolderId" className="wsw-holding__select" value={form.toHolderId} onChange={onField} required>
            <option value="">-- Select --</option>
            {groupedHolders.map(([label, list]) => (
              <optgroup label={label} key={label}>
                {list.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="wsw-holding__field-row">
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-amount">Amount (Rs)</label>
          <input id="hs-amount" type="number" name="amount" className="wsw-holding__input" placeholder="0" value={form.amount} onChange={onField} min="0" required />
        </div>
        <div className="wsw-holding__field">
          <label className="wsw-holding__label" htmlFor="hs-status">Status</label>
          <select id="hs-status" name="status" className="wsw-holding__select" value={form.status} onChange={onField}>
            <option value="">-- Select --</option>
            {statusValues?.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {form.status === 'Pending' && (
            <span className="wsw-holding__field-hint">Pending entries don't affect balances yet.</span>
          )}
        </div>
      </div>

      <div className="wsw-holding__field">
        <label className="wsw-holding__label" htmlFor="hs-note">Note</label>
        <textarea id="hs-note" name="note" className="wsw-holding__textarea" rows="3" placeholder="Optional note" value={form.note} onChange={onField} />
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
            <p className="wsw-holding__sub">Track who's holding company money and where it moved.</p>
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
        {/* ---------- Balances dashboard ---------- */}
        <section className="wsw-holding__balances" aria-label="Holder balances">
          <div className="wsw-holding__balances-table-wrap">
            <h2 className="wsw-holding__panel-heading">Holder balances</h2>
            {holdersLoading ? (
              <p className="wsw-holding__loading-note">Loading balances…</p>
            ) : (
              <table className="wsw-holding__balances-table">
                <thead>
                  <tr>
                    <th>Holder</th>
                    <th>Current balance</th>
                  </tr>
                </thead>
                <tbody>
                  {holders.map((h) => (
                    <tr key={h.id}>
                      <td>{h.name}</td>
                      <td className={h.balance < 0 ? 'wsw-holding__cell-negative' : 'wsw-holding__cell-amount'}>
                        {formatRs(h.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="wsw-holding__summary-cards">
            {summary.map((s) => (
              <div className="wsw-holding__summary-card" key={s.label}>
                <span className="wsw-holding__summary-label">{s.label}</span>
                <span className={s.value < 0 ? 'wsw-holding__summary-value wsw-holding__summary-value--negative' : 'wsw-holding__summary-value'}>
                  {formatRs(s.value)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Ledger ---------- */}
        <section className="wsw-holding__panel" aria-label="Holding sheet entries">
          <div className="wsw-holding__table-wrap">
            <table className="wsw-holding__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Ref / Job ID</th>
                  <th>Description</th>
                  <th>Entry type</th>
                  <th>From holder</th>
                  <th>To holder</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th>Check</th>
                  <th>From bal. after</th>
                  <th>To bal. after</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {entriesLoading ? (
                  <tr>
                    <td colSpan={14}>
                      <p className="wsw-holding__loading-note">Loading entries…</p>
                    </td>
                  </tr>
                ) : entries.length > 0 ? (
                  entries.map((entry) => {
                    const complete = isRowComplete(entry);
                    const isCompleted = entry.status === 'Completed';
                    return (
                      <tr className="wsw-holding__row" key={entry.id}>
                        <td>{entry.date}</td>
                        <td className="wsw-holding__cell-muted">{entry.refId || '—'}</td>
                        <td className="wsw-holding__cell-strong">{entry.description}</td>
                        <td><span className="wsw-holding__tag">{entry.entryType}</span></td>
                        <td>{entry.fromHolderName || holderById.get(entry.fromHolderId)?.name || '—'}</td>
                        <td>{entry.toHolderName || holderById.get(entry.toHolderId)?.name || '—'}</td>
                        <td className="wsw-holding__cell-amount">{formatRs(entry.amount)}</td>
                        <td className="wsw-holding__cell-muted">{entry.method}</td>
                        <td>
                          <span className={`wsw-holding__status-pill wsw-holding__status-pill--${(entry.status || '').toLowerCase()}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="wsw-holding__cell-muted">{entry.note}</td>
                        <td>
                          <span className={complete ? 'wsw-holding__check-ok' : 'wsw-holding__check-missing'}>
                            {complete ? 'OK' : 'Missing'}
                          </span>
                        </td>
                        <td className="wsw-holding__cell-muted">
                          {entry.fromBalanceAfter !== null ? formatRs(entry.fromBalanceAfter) : '—'}
                        </td>
                        <td className="wsw-holding__cell-muted">
                          {entry.toBalanceAfter !== null ? formatRs(entry.toBalanceAfter) : '—'}
                        </td>
                        <td>
                          <div className="wsw-holding__row-actions">
                            <button type="button" className="wsw-holding__icon-action" onClick={() => openEdit(entry)}>
                              <FaEdit /> Edit
                            </button>
                            {isCompleted ? (
                              <button type="button" className="wsw-holding__icon-action wsw-holding__icon-action--danger" onClick={() => openCancel(entry)}>
                                <FaBan /> Cancel
                              </button>
                            ) : (
                              <button type="button" className="wsw-holding__icon-action wsw-holding__icon-action--danger" onClick={() => openDelete(entry)}>
                                <FaTrash /> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={14}>
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

      {mode === 'cancel' && (
        <div className="wsw-holding__modal-backdrop" role="dialog" aria-modal="true" aria-label="Cancel entry">
          <div className="wsw-holding__modal wsw-holding__modal--narrow">
            <div className="wsw-holding__modal-head">
              <h2 className="wsw-holding__modal-title">Cancel entry</h2>
              <button type="button" className="wsw-holding__modal-close" onClick={closeAll} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>
            <p className="wsw-holding__confirm-copy">
              This entry already moved balances. Cancelling will reverse it on{' '}
              <strong>{selected?.fromHolderName}</strong> and <strong>{selected?.toHolderName}</strong>, rather than
              deleting the record — matching the "mistake entry" rule.
            </p>
            <div className="wsw-holding__modal-actions">
              <button type="button" className="wsw-holding__danger-btn" onClick={handleCancel} disabled={submitting}>
                {submitting ? 'Cancelling…' : 'Confirm cancel'}
              </button>
              <button type="button" className="wsw-holding__ghost-btn" onClick={closeAll}>
                Back
              </button>
            </div>
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
              This entry never affected a balance, so it's safe to remove outright. Delete the entry from{' '}
              <strong>{selected?.fromHolderName}</strong> to <strong>{selected?.toHolderName}</strong>?
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