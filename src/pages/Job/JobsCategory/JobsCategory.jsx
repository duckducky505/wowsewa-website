import React, { useState } from 'react';
import { FaFaucet, FaBolt, FaNetworkWired, FaSnowflake, FaLaptop, FaVideo } from 'react-icons/fa6';
import { MdAdd, MdClose } from 'react-icons/md';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { fetchHook } from '../../../hooks/fetchHook';
import { fetchAPI } from '../../../utils/fetchAPI';
import './JobsCategory.css';

/* ── Icon mapping ────────────────────────────────────────── */
const ICONS = {
  'Plumbing': <FaFaucet />,
  'Electrician': <FaBolt />,
  'Laptop Servicing': <FaLaptop />,
  'AC Installation and Repair': <FaSnowflake />,
  'IT & Networking': <FaNetworkWired />,
  'Security': <FaVideo />,
};

const blankForm = { jobsName: '' };

const rs = (n) => (n ? `Rs ${Number(n).toLocaleString()}` : '—');

function normalizeSummaryRow(raw) {
  return {
    id: raw.id ?? raw.Id,
    name: raw.name ?? raw.Name ?? raw.industryName ?? raw.IndustryName ?? '',
    income: Number(raw.income ?? raw.Income ?? 0),
    expense: Number(raw.expense ?? raw.Expense ?? 0),
    transactions: Number(raw.transactions ?? raw.Transactions ?? raw.transactionCount ?? 0),
  };
}

export default function JobsCategory() {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);

  const { data: jobsCategory, loading: jobsLoading } = fetchHook('https://localhost:7011/api/Industry/getIndustryData');
  const { data: rawSummary, loading: summaryLoading } = fetchHook('https://localhost:7011/api/Industry/detailed-industry-summary');

  const jobsList = Array.isArray(jobsCategory) ? jobsCategory : [];
  const categorySummary = (rawSummary || []).map(normalizeSummaryRow);

  const filteredJobs = jobsList.filter(
    (j) =>
      j &&
      ((j.industryName?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (j.industryCompanyCode?.toLowerCase() || '').includes(search.toLowerCase()))
  );

  const summaryTotals = categorySummary.reduce(
    (acc, row) => ({
      income: acc.income + (row.income || 0),
      expense: acc.expense + (row.expense || 0),
      transactions: acc.transactions + (row.transactions || 0),
    }),
    { income: 0, expense: 0, transactions: 0 }
  );

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setForm(blankForm);
    setMode('add');
  };

  const openEdit = (job) => {
    setSelected(job);
    setForm({ jobsName: job.industryName || '' });
    setMode('edit');
  };

  const openDelete = (job) => {
    setSelected(job);
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

    const res = await fetchAPI('https://localhost:7011/api/Industry/addIndustryData', 'POST', { jobsName: form.jobsName });
    setSubmitting(false);

    if (res) {
      window.alert('New job category added successfully.');
      window.location.reload();
    } else {
      window.alert('Error from the API. Please try again later.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const currentValue = (form.jobsName || '').trim();
    const originalValue = (selected.industryName || '').trim();

    if (currentValue === originalValue) {
      window.alert('No changes detected.');
      closeAll();
      return;
    }

    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Industry/patch/update-a-industry-data/${selected.industryId}`, 'PATCH', [
      { op: 'replace', path: '/industryName', value: currentValue },
    ]);
    setSubmitting(false);

    if (res) {
      window.alert('Job category updated successfully.');
      window.location.reload();
    } else {
      window.alert('Error updating the job category. Please try again later.');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);

    const res = await fetchAPI(`https://localhost:7011/api/Industry/delete/remove-industry-data/${selected.industryId}`, 'DELETE');
    setSubmitting(false);

    if (res) {
      window.alert('Job category deleted successfully.');
      window.location.reload();
    } else {
      window.alert('Error deleting the job category. Please try again later.');
    }
  };

  return (
    <div className="wsw-job-categories">
      <header className="wsw-job-categories__header">
        <div className="wsw-job-categories__header-inner">
          <div>
            <span className="wsw-job-categories__eyebrow">Service catalog</span>
            <h1 className="wsw-job-categories__title">Job categories</h1>
            <p className="wsw-job-categories__sub">Manage the service categories WowSewa offers to customers.</p>
          </div>
          <button type="button" className="wsw-job-categories__add-btn" onClick={openAdd}>
            <MdAdd size={18} /> Add category
          </button>
        </div>
      </header>

      <div className="wsw-job-categories__body">
        <section className="wsw-job-categories__stats" aria-label="Overview">
          <div className="wsw-job-categories__stat-card">
            <span className="wsw-job-categories__stat-value">{jobsList.length}</span>
            <span className="wsw-job-categories__stat-label">Total registered categories</span>
          </div>
        </section>

        <div className="wsw-job-categories__toolbar">
          <input
            type="search"
            className="wsw-job-categories__search"
            placeholder="Search by job code or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search job categories"
          />
        </div>

        <section className="wsw-job-categories__panel" aria-label="Job categories">
          <div className="wsw-job-categories__table-wrap">
            <table className="wsw-job-categories__table">
              <thead>
                <tr>
                  <th>Company code</th>
                  <th>Job category</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {jobsLoading ? (
                  <tr>
                    <td colSpan={3}>
                      <p className="wsw-job-categories__loading-note">Loading job categories…</p>
                    </td>
                  </tr>
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr className="wsw-job-categories__row" key={job.industryId}>
                      <td>
                        <span className="wsw-job-categories__code-tag">{job.industryCompanyCode}</span>
                      </td>
                      <td>
                        <div className="wsw-job-categories__job">
                          <span className="wsw-job-categories__job-icon">{ICONS[job.industryName] || <FaBolt />}</span>
                          <span className="wsw-job-categories__job-name">{job.industryName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="wsw-job-categories__row-actions">
                          <button type="button" className="wsw-job-categories__icon-action" onClick={() => openEdit(job)}>
                            <FaEdit /> Edit
                          </button>
                          <button
                            type="button"
                            className="wsw-job-categories__icon-action wsw-job-categories__icon-action--danger"
                            onClick={() => openDelete(job)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>
                      <div className="wsw-job-categories__empty">
                        <p className="wsw-job-categories__empty-title">No categories found</p>
                        <p className="wsw-job-categories__empty-body">Try a different search term, or add a new one.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- Cash flow by category ---------- */}
        <div className="wsw-job-categories__section-head">
          <h2 className="wsw-job-categories__section-title">Cash flow by category</h2>
          <p className="wsw-job-categories__section-sub">Income, expense and net position for every category this period.</p>
        </div>

        <section className="wsw-job-categories__panel" aria-label="Cash flow by category">
          <div className="wsw-job-categories__table-wrap">
            <table className="wsw-job-categories__summary-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="wsw-job-categories__num-col">Income</th>
                  <th className="wsw-job-categories__num-col">Expense</th>
                  <th className="wsw-job-categories__num-col">Net</th>
                  <th className="wsw-job-categories__num-col">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {summaryLoading ? (
                  <tr>
                    <td colSpan={5}>
                      <p className="wsw-job-categories__loading-note">Loading category summary…</p>
                    </td>
                  </tr>
                ) : categorySummary.length > 0 ? (
                  categorySummary.map((row) => {
                    const net = (row.income || 0) - (row.expense || 0);
                    return (
                      <tr className="wsw-job-categories__row" key={row.id || row.name}>
                        <td className="wsw-job-categories__cat-name">{row.name}</td>
                        <td className="wsw-job-categories__num-col">{rs(row.income)}</td>
                        <td className="wsw-job-categories__num-col">{rs(row.expense)}</td>
                        <td
                          className={
                            'wsw-job-categories__num-col' + (net < 0 ? ' wsw-job-categories__net-negative' : '')
                          }
                        >
                          {net === 0 ? '—' : net < 0 ? `(Rs ${Math.abs(net).toLocaleString()})` : rs(net)}
                        </td>
                        <td className="wsw-job-categories__num-col">{row.transactions || '—'}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="wsw-job-categories__empty">
                        <p className="wsw-job-categories__empty-title">No cash flow recorded yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="wsw-job-categories__total-row">
                  <td>Total</td>
                  <td className="wsw-job-categories__num-col">{rs(summaryTotals.income)}</td>
                  <td className="wsw-job-categories__num-col">{rs(summaryTotals.expense)}</td>
                  <td className="wsw-job-categories__num-col">{rs(summaryTotals.income - summaryTotals.expense)}</td>
                  <td className="wsw-job-categories__num-col">{summaryTotals.transactions}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>

      {(mode === 'add' || mode === 'edit') && (
        <div className="wsw-job-categories__modal-backdrop" role="dialog" aria-modal="true" aria-label={mode === 'add' ? 'Add job category' : 'Edit job category'}>
          <div className="wsw-job-categories__modal">
            <div className="wsw-job-categories__modal-head">
              <h2 className="wsw-job-categories__modal-title">{mode === 'add' ? 'Add job category' : 'Edit job category'}</h2>
              <button type="button" className="wsw-job-categories__modal-close" onClick={closeAll} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>

            <form className="wsw-job-categories__form" onSubmit={mode === 'add' ? handleAdd : handleEdit}>
              <div className="wsw-job-categories__field">
                <label className="wsw-job-categories__label" htmlFor="job-name">
                  Job name
                </label>
                <input
                  id="job-name"
                  type="text"
                  name="jobsName"
                  className="wsw-job-categories__input"
                  placeholder="e.g. Carpentry"
                  value={form.jobsName}
                  onChange={onField}
                  required
                />
              </div>

              <div className="wsw-job-categories__modal-actions">
                <button type="submit" className="wsw-job-categories__primary-btn" disabled={submitting}>
                  {submitting ? 'Saving…' : mode === 'add' ? 'Add category' : 'Save changes'}
                </button>
                <button type="button" className="wsw-job-categories__ghost-btn" onClick={closeAll}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mode === 'delete' && (
        <div className="wsw-job-categories__modal-backdrop" role="dialog" aria-modal="true" aria-label="Delete job category">
          <div className="wsw-job-categories__modal wsw-job-categories__modal--narrow">
            <div className="wsw-job-categories__modal-head">
              <h2 className="wsw-job-categories__modal-title">Delete job category</h2>
              <button type="button" className="wsw-job-categories__modal-close" onClick={closeAll} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>
            <p className="wsw-job-categories__confirm-copy">
              Are you sure you want to delete <strong>{selected?.industryName}</strong>? This can't be undone.
            </p>
            <div className="wsw-job-categories__modal-actions">
              <button type="button" className="wsw-job-categories__danger-btn" onClick={handleDelete} disabled={submitting}>
                {submitting ? 'Deleting…' : 'Confirm delete'}
              </button>
              <button type="button" className="wsw-job-categories__ghost-btn" onClick={closeAll}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}