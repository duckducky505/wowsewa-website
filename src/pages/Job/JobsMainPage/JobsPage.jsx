// pages/JobsManagement/JobsPage.jsx
import React, { useMemo, useState } from "react";
import { fetchHook } from '../../../hooks/fetchHook';
import "./JobsPage.css";


const CATEGORIES = ["Plumbing", "Electrical", "Home Appliances", "IT Devices"];

const CATEGORY_CODE = {
  Plumbing: "PLB",
  Electrical: "ELC",
  "Home Appliances": "APL",
  "IT Devices": "ITD",
};

const INITIAL_JOBS = [
  { id: "job-1", category: "Plumbing", name: "Leak repair", duration: "45–60 min", price: 800, active: true },
  { id: "job-2", category: "Plumbing", name: "Pipe installation", duration: "1–2 hrs", price: 1200, active: true },
  { id: "job-3", category: "Plumbing", name: "Drain cleaning", duration: "30–45 min", price: 600, active: true },
  { id: "job-4", category: "Plumbing", name: "Bathroom fitting", duration: "2–3 hrs", price: 2500, active: true },
  { id: "job-5", category: "Electrical", name: "Wiring repair", duration: "1 hr", price: 900, active: true },
  { id: "job-6", category: "Electrical", name: "Switchboard installation", duration: "1–2 hrs", price: 1000, active: true },
  { id: "job-7", category: "Electrical", name: "Fan / light installation", duration: "30–45 min", price: 500, active: true },
  { id: "job-8", category: "Electrical", name: "Short circuit fix", duration: "45–90 min", price: 1100, active: false },
  { id: "job-9", category: "Home Appliances", name: "AC installation", duration: "2–3 hrs", price: 2800, active: true },
  { id: "job-10", category: "Home Appliances", name: "Washing machine repair", duration: "1 hr", price: 900, active: true },
  { id: "job-11", category: "Home Appliances", name: "Refrigerator repair", duration: "1–1.5 hrs", price: 1000, active: true },
  { id: "job-12", category: "IT Devices", name: "Laptop repair", duration: "1–2 hrs", price: 1000, active: true },
  { id: "job-13", category: "IT Devices", name: "Wi-Fi / network setup", duration: "45–60 min", price: 800, active: true },
];

// ---- Helpers --------------------------------------------------------------

function formatRs(value) {
  return `Rs ${Number(value).toLocaleString()}`;
}

function emptyDraft(category) {
  return { name: "", category: category || CATEGORIES[0], duration: "", price: "" };
}

// ---- Component --------------------------------------------------------------

export default function JobsPage() {

  const { data: industryData } = fetchHook("https://localhost:7011/api/industry/getIndustryData");
  const { data: dutyData } = fetchHook("https://localhost:7011/getAllDutyData")

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [errors, setErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);




  

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCategory = activeCategory === "All" || job.category === activeCategory;
      const matchesSearch =
        !search.trim() || job.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [jobs, activeCategory, search]);

  const categoryCounts = useMemo(() => {
    const counts = { All: jobs.length };
    industryData.forEach((c) => {
      counts[c] = jobs.filter((j) => j.category === c).length;
    });
    return counts;
  }, [jobs]);

  function openAddForm() {
    setEditingId(null);
    setDraft(emptyDraft(activeCategory !== "All" ? activeCategory : CATEGORIES[0]));
    setErrors({});
    setShowForm(true);
  }

  function openEditForm(job) {
    setEditingId(job.id);
    setDraft({ name: job.name, category: job.category, duration: job.duration, price: String(job.price) });
    setErrors({});
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setErrors({});
  }

  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateDraft() {
    const next = {};
    if (!draft.name.trim()) next.name = "Enter a job name";
    if (!draft.duration.trim()) next.duration = "Enter an estimated duration";
    const priceNum = Number(draft.price);
    if (!draft.price || Number.isNaN(priceNum) || priceNum <= 0) {
      next.price = "Enter a valid price greater than 0";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateDraft()) return;

    const payload = {
      name: draft.name.trim(),
      category: draft.category,
      duration: draft.duration.trim(),
      price: Number(draft.price),
    };

    if (editingId) {
      setJobs((prev) => prev.map((j) => (j.id === editingId ? { ...j, ...payload } : j)));
    } else {
      setJobs((prev) => [
        ...prev,
        { id: `job-${Date.now()}`, active: true, ...payload },
      ]);
    }
    closeForm();
  }

  function handleToggleActive(id) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, active: !j.active } : j)));
  }

  function handleDelete(id) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setConfirmDeleteId(null);
  }

  return (
    <div className="wsw-jobs">
      <header className="wsw-jobs__header">
        <div className="wsw-jobs__header-inner">
          <div>
            <span className="wsw-jobs__eyebrow">Service catalog</span>
            <h1 className="wsw-jobs__title">Jobs & pricing</h1>
            <p className="wsw-jobs__sub">Manage the services customers can book, by category.</p>
          </div>
          <button type="button" className="wsw-jobs__add-btn" onClick={openAddForm}>
            + Add job
          </button>
        </div>
      </header>

      <div className="wsw-jobs__body">
        <div className="wsw-jobs__toolbar">
          <div className="wsw-jobs__category-tabs" role="tablist" aria-label="Filter by category">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "All"}
              className={
                "wsw-jobs__category-tab" + (activeCategory === "All" ? " wsw-jobs__category-tab--active" : "")
              }
              onClick={() => setActiveCategory("All")}
            >
              All <span className="wsw-jobs__tab-count">{categoryCounts.All}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button
                type="button"
                role="tab"
                key={c}
                aria-selected={activeCategory === c}
                className={
                  "wsw-jobs__category-tab" + (activeCategory === c ? " wsw-jobs__category-tab--active" : "")
                }
                onClick={() => setActiveCategory(c)}
              >
                {c} <span className="wsw-jobs__tab-count">{categoryCounts[c]}</span>
              </button>
            ))}
          </div>

          <input
            type="search"
            className="wsw-jobs__search"
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search jobs"
          />
        </div>

        <section className="wsw-jobs__panel" aria-label="Job list">
          {filteredJobs.length > 0 ? (
            <div className="wsw-jobs__table-wrap">
              <table className="wsw-jobs__table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr className="wsw-jobs__row" key={job.id}>
                      <td className="wsw-jobs__cell-name">{job.name}</td>
                      <td>
                        <span className="wsw-jobs__category-tag">
                          {CATEGORY_CODE[job.category]} · {job.category}
                        </span>
                      </td>
                      <td className="wsw-jobs__cell-muted">{job.duration}</td>
                      <td className="wsw-jobs__cell-price">{formatRs(job.price)}</td>
                      <td>
                        <button
                          type="button"
                          className={
                            "wsw-jobs__status-toggle" +
                            (job.active ? " wsw-jobs__status-toggle--active" : "")
                          }
                          onClick={() => handleToggleActive(job.id)}
                        >
                          {job.active ? "Active" : "Hidden"}
                        </button>
                      </td>
                      <td>
                        <div className="wsw-jobs__row-actions">
                          <button
                            type="button"
                            className="wsw-jobs__icon-action"
                            onClick={() => openEditForm(job)}
                          >
                            Edit
                          </button>
                          {confirmDeleteId === job.id ? (
                            <span className="wsw-jobs__confirm-inline">
                              <button
                                type="button"
                                className="wsw-jobs__icon-action wsw-jobs__icon-action--danger"
                                onClick={() => handleDelete(job.id)}
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                className="wsw-jobs__icon-action"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="wsw-jobs__icon-action wsw-jobs__icon-action--danger"
                              onClick={() => setConfirmDeleteId(job.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="wsw-jobs__empty">
              <p className="wsw-jobs__empty-title">No jobs found</p>
              <p className="wsw-jobs__empty-body">
                Try a different category or search term, or add a new job.
              </p>
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <div className="wsw-jobs__modal-backdrop" role="dialog" aria-modal="true" aria-label={editingId ? "Edit job" : "Add job"}>
          <div className="wsw-jobs__modal">
            <div className="wsw-jobs__modal-head">
              <h2 className="wsw-jobs__modal-title">{editingId ? "Edit job" : "Add a new job"}</h2>
              <button type="button" className="wsw-jobs__modal-close" onClick={closeForm} aria-label="Close">
                ×
              </button>
            </div>

            <form className="wsw-jobs__form" onSubmit={handleSubmit} noValidate>
              <div className="wsw-jobs__field">
                <label className="wsw-jobs__label" htmlFor="job-category">
                  Category
                </label>
                <select
                  id="job-category"
                  className="wsw-jobs__select"
                  value={draft.category}
                  onChange={(e) => updateDraft("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="wsw-jobs__field">
                <label className="wsw-jobs__label" htmlFor="job-name">
                  Job name
                </label>
                <input
                  id="job-name"
                  className={"wsw-jobs__input" + (errors.name ? " wsw-jobs__input--error" : "")}
                  value={draft.name}
                  onChange={(e) => updateDraft("name", e.target.value)}
                  placeholder="e.g. Leak repair"
                />
                {errors.name && <span className="wsw-jobs__error">{errors.name}</span>}
              </div>

              <div className="wsw-jobs__field-row">
                <div className="wsw-jobs__field">
                  <label className="wsw-jobs__label" htmlFor="job-duration">
                    Estimated duration
                  </label>
                  <input
                    id="job-duration"
                    className={"wsw-jobs__input" + (errors.duration ? " wsw-jobs__input--error" : "")}
                    value={draft.duration}
                    onChange={(e) => updateDraft("duration", e.target.value)}
                    placeholder="e.g. 45–60 min"
                  />
                  {errors.duration && <span className="wsw-jobs__error">{errors.duration}</span>}
                </div>

                <div className="wsw-jobs__field">
                  <label className="wsw-jobs__label" htmlFor="job-price">
                    Price (Rs)
                  </label>
                  <input
                    id="job-price"
                    type="number"
                    min="0"
                    step="1"
                    className={"wsw-jobs__input" + (errors.price ? " wsw-jobs__input--error" : "")}
                    value={draft.price}
                    onChange={(e) => updateDraft("price", e.target.value)}
                    placeholder="e.g. 800"
                  />
                  {errors.price && <span className="wsw-jobs__error">{errors.price}</span>}
                </div>
              </div>

              <div className="wsw-jobs__modal-actions">
                <button type="submit" className="wsw-jobs__primary-btn">
                  {editingId ? "Save changes" : "Add job"}
                </button>
                <button type="button" className="wsw-jobs__ghost-btn" onClick={closeForm}>
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