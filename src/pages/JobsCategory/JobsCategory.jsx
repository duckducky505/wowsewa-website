import { useMemo, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import {
  FaFaucet, FaBolt, FaNetworkWired, FaSnowflake,
  FaLaptop, FaVideo,
} from 'react-icons/fa6';
import { PopupModal } from '../../components/Popup/PopupModal';
import './JobsCategory.css';

/* ── Design-only sample data (no backend wired) ──────────────────────── */
const ICONS = {
  Plumbing: <FaFaucet />,
  Electrical: <FaBolt />,
  'IT & Networking': <FaNetworkWired />,
  Appliances: <FaSnowflake />,
  Computers: <FaLaptop />,
  Security: <FaVideo />,
};

const SAMPLE_JOBS = [
  { id: 1, title: 'Emergency Leak Repair', category: 'Plumbing', basePrice: 999, status: 'Active', description: 'Rapid response for burst pipes and hidden leaks.' },
  { id: 2, title: 'House Rewiring', category: 'Electrical', basePrice: 4999, status: 'Active', description: 'Full house rewiring and circuit-breaker upgrades.' },
  { id: 3, title: 'Office WiFi Setup', category: 'IT & Networking', basePrice: 3999, status: 'Active', description: 'Mesh WiFi, router configuration and LAN/WAN setup.' },
  { id: 4, title: 'AC Deep Cleaning', category: 'Appliances', basePrice: 1499, status: 'Active', description: 'Filter cleaning, gas check and performance tune-up.' },
  { id: 5, title: 'Laptop Servicing', category: 'Computers', basePrice: 1299, status: 'Draft', description: 'Thermal paste, deep cleaning and hardware upgrades.' },
  { id: 6, title: 'CCTV Installation', category: 'Security', basePrice: 5999, status: 'Inactive', description: 'Camera mounting, DVR/NVR config and remote viewing.' },
];

const CATEGORIES = ['Plumbing', 'Electrical', 'IT & Networking', 'Appliances', 'Computers', 'Security'];
const STATUSES = ['Active', 'Draft', 'Inactive'];

const blankForm = { title: '', category: '', basePrice: '', status: 'Active', description: '' };

const JobsCategory = () => {
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        (j.title.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)) &&
        (categoryFilter ? j.category === categoryFilter : true)
    );
  }, [jobs, search, categoryFilter]);

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(blankForm); setIsAddOpen(true); };
  const openEdit = (job) => { setSelected(job); setForm({ ...job }); setIsEditOpen(true); };
  const openDelete = (job) => { setSelected(job); setIsDeleteOpen(true); };
  const closeAll = () => {
    setIsAddOpen(false); setIsEditOpen(false); setIsDeleteOpen(false);
    setSelected(null); setForm(blankForm);
  };

  /* Local-only handlers (UI demo — no API) */
  const handleAdd = (e) => {
    e.preventDefault();
    setJobs((prev) => [
      ...prev,
      { ...form, id: Date.now(), basePrice: Number(form.basePrice) || 0 },
    ]);
    closeAll();
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setJobs((prev) =>
      prev.map((j) =>
        j.id === selected.id ? { ...j, ...form, basePrice: Number(form.basePrice) || 0 } : j
      )
    );
    closeAll();
  };

  const handleDelete = () => {
    setJobs((prev) => prev.filter((j) => j.id !== selected.id));
    closeAll();
  };

  const JobForm = ({ onSubmit, submitLabel }) => (
    <form className="modal-form" onSubmit={onSubmit}>
      <label>Job Title</label>
      <input
        type="text" name="title" placeholder="e.g. Emergency Leak Repair"
        value={form.title} onChange={onField} required
      />

      <label>Category</label>
      <select name="category" value={form.category} onChange={onField} required>
        <option value="">Select a category</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <label>Base Price (NPR)</label>
      <input
        type="number" name="basePrice" placeholder="e.g. 1499"
        value={form.basePrice} onChange={onField} min="0"
      />

      <label>Status</label>
      <select name="status" value={form.status} onChange={onField}>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Description</label>
      <textarea
        name="description" rows="3" placeholder="Short description of the job"
        value={form.description} onChange={onField}
      />

      <div className="modal-btns">
        <button type="button" className="btn btn-dark" onClick={closeAll}>Cancel</button>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  );

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
          <span className="jc-stat__num">{jobs.length}</span>
          <span className="jc-stat__lbl">Total Jobs</span>
        </div>
        <div className="jc-stat">
          <span className="jc-stat__num">{jobs.filter((j) => j.status === 'Active').length}</span>
          <span className="jc-stat__lbl">Active</span>
        </div>
        <div className="jc-stat">
          <span className="jc-stat__num">{CATEGORIES.length}</span>
          <span className="jc-stat__lbl">Categories</span>
        </div>
      </div>

      <div className="bookings-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by job, category or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="table-card bg-text-main">
        <table className="table-universal">
          <thead>
            <tr>
              <th>Job</th>
              <th>Category</th>
              <th>Base Price</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((job) => (
                <tr key={job.id}>
                  <td data-label="Job">
                    <div className="jc-job">
                      <span className="jc-job__icon">
                        {ICONS[job.category] || <FaBolt />}
                      </span>
                      <div className="jc-job__text">
                        <span className="jc-job__title">{job.title}</span>
                        <span className="jc-job__desc">{job.description}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Category">
                    <span className="jc-cat-tag">{job.category}</span>
                  </td>
                  <td data-label="Base Price">
                    <strong>Rs. {Number(job.basePrice).toLocaleString()}</strong>
                  </td>
                  <td data-label="Status">
                    <span className={`status-pill ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
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
                <td colSpan="5" className="text-center" style={{ padding: '2rem' }}>
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PopupModal open={isAddOpen} onClose={closeAll} title="Add New Job">
        <JobForm onSubmit={handleAdd} submitLabel="Add Job" />
      </PopupModal>

      <PopupModal open={isEditOpen} onClose={closeAll} title="Edit Job">
        <JobForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </PopupModal>

      <PopupModal open={isDeleteOpen} onClose={closeAll} title="Delete Job">
        <p>
          Are you sure you want to delete <b>{selected?.title}</b>? This action
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
