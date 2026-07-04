import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import {
  FaFaucet, FaBolt, FaNetworkWired, FaSnowflake,
  FaLaptop, FaVideo,
} from 'react-icons/fa6';
import { PopupModal } from '../../components/Popup/PopupModal';
import './JobsCategory.css';
import { fetchHook } from '../../hooks/fetchHook';
import { fetchAPI } from '../../utils/fetchAPI';

/* ── Icon Mapping ────────────────────────────────────────── */
const ICONS = {
  'Plumbing': <FaFaucet />,
  'Electrician': <FaBolt />,
  'Laptop Servicing': <FaLaptop />,
  'AC Installation and Repair': <FaSnowflake />,
  'IT & Networking': <FaNetworkWired />,
  'Security': <FaVideo />,
};

const blankForm = { jobsName: '' };

/* ── Fallback data for the cash-flow-by-category summary, shown until the
   API below returns real numbers. Matches the shape { category, income,
   expense, net, transactions }. ── */
const MOCK_CATEGORY_SUMMARY = [
  { category: 'AC Service',        income: 3000, expense: 0,    transactions: 1 },
  { category: 'Electrical',        income: 0,    expense: 0,    transactions: 0 },
  { category: 'Plumbing',          income: 2000, expense: 0,    transactions: 1 },
  { category: 'CCTV / Networking', income: 6000, expense: 0,    transactions: 1 },
  { category: 'Repair Lab',        income: 0,    expense: 0,    transactions: 0 },
  { category: 'Training / Class',  income: 0,    expense: 0,    transactions: 0 },
  { category: 'Spare Parts',       income: 0,    expense: 2500, transactions: 1 },
  { category: 'Gas',               income: 0,    expense: 1500, transactions: 1 },
  { category: 'Transport',         income: 0,    expense: 300,  transactions: 1 },
  { category: 'Salary',            income: 0,    expense: 0,    transactions: 0 },
  { category: 'Rent',              income: 0,    expense: 0,    transactions: 0 },
  { category: 'Electricity',       income: 0,    expense: 0,    transactions: 0 },
  { category: 'Marketing',         income: 0,    expense: 0,    transactions: 0 },
  { category: 'Office Expense',    income: 0,    expense: 0,    transactions: 0 },
  { category: 'Other Income',      income: 0,    expense: 0,    transactions: 0 },
  { category: 'Other Expense',     income: 0,    expense: 0,    transactions: 0 },
];

const rs = (n) => (n ? `Rs ${n.toLocaleString()}` : '-');

/* ── CRITICAL FIX: Value tracking now uses form.jobsName to match name="jobsName" ── */
const JobForm = ({ form, onField, closeAll, onSubmit, submitLabel }) => (
  <form className="modal-form" onSubmit={onSubmit}>
    <label>Job Name</label>
    <input
      type="text" 
      name="jobsName" 
      placeholder="e.g. Carpentry"
      value={form.jobsName || ''} 
      onChange={onField} 
      required
    />

    <div className="modal-btns">
      <button type="button" className="btn btn-dark" onClick={closeAll}>Cancel</button>
      <button type="submit" className="btn btn-primary">{submitLabel}</button>
    </div>
  </form>
);

const JobsCategory = () => {
  const [search, setSearch] = useState('');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);

  const { data: jobsCategory } = fetchHook("https://localhost:7011/api/Jobs/getAllJobs");

  const jobsList = Array.isArray(jobsCategory) ? jobsCategory : [];
  const categorySummary =  MOCK_CATEGORY_SUMMARY;

  const filteredJobs = jobsList.filter(j => 
    j && (
      (j.jobName?.toLowerCase() || '').includes(search.toLowerCase()) || 
      (j.jobCompanyCode?.toLowerCase() || '').includes(search.toLowerCase())
    )
  );

  // running totals for the summary table's footer row
  const summaryTotals = categorySummary.reduce(
    (acc, row) => ({
      income: acc.income + (row.income || 0),
      expense: acc.expense + (row.expense || 0),
      transactions: acc.transactions + (row.transactions || 0),
    }),
    { income: 0, expense: 0, transactions: 0 }
  );

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(blankForm); setIsAddOpen(true); };
  
  /* ── CRITICAL FIX: Safely map backend data property (jobName) over to our form state key (jobsName) ── */
  const openEdit = (job) => { 
    setSelected(job); 
    setForm({ 
      jobsName: job.jobName || '' 
    }); 
    setIsEditOpen(true); 
  };
  
  const openDelete = (job) => { setSelected(job); setIsDeleteOpen(true); };
  const closeAll = () => {
    setIsAddOpen(false); setIsEditOpen(false); setIsDeleteOpen(false);
    setSelected(null); setForm(blankForm);
  };

  const handleAdd = (e) => { 
    e.preventDefault();
    const payload = {
      jobsName : form.jobsName
    }
    const addResponse = fetchAPI("https://localhost:7011/api/Jobs/addNewJob", "POST", payload);
    if(addResponse) {
      window.alert("New Job added successfully.");
      window.location.reload();
    }
    else{
      window.alert("Error from the api. Please try again later.");
    }
  };


  const handleEdit = (e) => { 
    e.preventDefault(); 
    if(!selected) return;

    const patchPayload = [];

    const currentValue = form.jobsName  || '';
    const originalValue = selected.jobName || '';

    if(currentValue.trim() !== originalValue.trim()){
      patchPayload.push({
        op: "replace",
        path: "/JobName", 
        value: currentValue,
      });
    }

    if (patchPayload.length === 0) {
      window.alert("No changes detected.");
      closeAll();
      return;
    }

    const editResponse = fetchAPI(`https://localhost:7011/api/Jobs/update-job/${selected.jobId}`, "PATCH", patchPayload);

    if (editResponse) {
      window.alert("Job edited successfully.");
      window.location.reload();
    } else {
      window.alert("Error updating the job. Please try again later.");
    }
    closeAll();
  };


  const handleDelete = () => { 
    if(!selected) return;
    try {
      const response = fetchAPI(
        `https://localhost:7011/api/Jobs/deleteJob/${selected.jobId}`, 
        "DELETE"
      );

      if (response) {
        window.alert("The job is deleted successfully.");
        window.location.reload();
      } else {
        window.alert("Error deleting the job. Please try again later.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      window.alert("An error occurred while deleting the job.");
    }
  };

  return (
    <div className="in-app-container jc-page">
      <header className="in-app-header">
        <div className="header-text">
          <h1 className="text-xl accent-text-white">
            Job <span className="accent-text-primary">Categories</span>
          </h1>
          <p className="text-md accent-text-white">
            Manage the services WowSewa offers to customers.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <FaPlus /> Add Job
        </button>
      </header>

      <div className="jc-stat-row">
        <div className="jc-stat">
          <span className="jc-stat__num">{jobsList.length}</span>
          <span className="jc-stat__lbl">Total Registered Categories</span>
        </div>
      </div>

      <div className="bookings-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by job code or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-card bg-text-main">
        <table className="table-universal">
          <thead>
            <tr>
              <th>Company Code</th>
              <th>Job Category</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.jobId }>
                  <td data-label="Company Code">
                    <span className="jc-cat-tag">{job.jobCompanyCode}</span>
                  </td>
                  <td data-label="Job Category">
                    <div className="jc-job">
                      <span className="jc-job__icon">
                        {ICONS[job.jobName] || <FaBolt />} 
                      </span>
                      <div className="jc-job__text">
                        <span className="jc-job__title">{job.jobName}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Actions">
                    <div className="table-btns-flex">
                      <button className="btn btn-sm btn-primary" onClick={() => openEdit(job)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => openDelete(job)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center" style={{ padding: '2rem' }}>
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Cash flow by category ─────────────────────────────────────── */}
      <div className="jc-summary-head">
        <h2 className="text-lg accent-text-white">Cash Flow by Category</h2>
        <p className="text-md accent-text-white">
          Income, expense and net position for every category this period.
        </p>
      </div>

      <div className="table-card bg-text-main jc-summary-card">
        <table className="jc-summary-table">
          <thead>
            <tr>
              <th>Category</th>
              <th className="text-right">Income</th>
              <th className="text-right">Expense</th>
              <th className="text-right">Net</th>
              <th className="text-right">Transactions</th>
            </tr>
          </thead>
          <tbody>
            {categorySummary.map((row) => {
              const net = (row.income || 0) - (row.expense || 0);
              return (
                <tr key={row.category}>
                  <td data-label="Category" className="jc-cat-name">{row.category}</td>
                  <td data-label="Income" className="text-right">{rs(row.income)}</td>
                  <td data-label="Expense" className="text-right">{rs(row.expense)}</td>
                  <td data-label="Net" className={'text-right' + (net < 0 ? ' jc-net-neg' : '')}>
                    {net === 0 ? '-' : net < 0 ? `(Rs ${Math.abs(net).toLocaleString()})` : rs(net)}
                  </td>
                  <td data-label="Transactions" className="text-right">
                    {row.transactions ? row.transactions : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="jc-total-row">
              <td>Total</td>
              <td className="text-right">{rs(summaryTotals.income)}</td>
              <td className="text-right">{rs(summaryTotals.expense)}</td>
              <td className="text-right">{rs(summaryTotals.income - summaryTotals.expense)}</td>
              <td className="text-right">{summaryTotals.transactions}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <PopupModal open={isAddOpen} onClose={closeAll} title="Add New Job">
        <JobForm 
          form={form} 
          onField={onField} 
          closeAll={closeAll} 
          onSubmit={handleAdd} 
          submitLabel="Add Job" 
        />
      </PopupModal>

      <PopupModal open={isEditOpen} onClose={closeAll} title="Edit Job">
        <JobForm 
          form={form} 
          onField={onField} 
          closeAll={closeAll} 
          onSubmit={handleEdit} 
          submitLabel="Save Changes" 
        />
      </PopupModal>

      <PopupModal open={isDeleteOpen} onClose={closeAll} title="Delete Job">
        <p>
          Are you sure you want to delete <b>{selected?.jobName}</b>? This action
          cannot be undone.
        </p>
        <div className="modal-btns">
          <button className="btn btn-dark" onClick={closeAll}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Confirm Delete</button>
        </div>
      </PopupModal>
    </div>
  );
};

export default JobsCategory;