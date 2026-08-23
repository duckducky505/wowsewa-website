// pages/JobsManagement/JobsPage.jsx
import React, { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import { fetchHook } from "../../../hooks/fetchHook";
import { fetchAPI } from "../../../utils/fetchAPI";
import "./JobsPage.css";

// ---- Helpers --------------------------------------------------------------

function formatRs(value) {
  return `Rs ${Number(value || 0).toLocaleString()}`;
}

function normalizeDuty(raw) {
  return {
    id: raw.dutyId ?? raw.DutyId ?? raw.id ?? raw.Id,
    name: raw.dutyName ?? raw.DutyName ?? raw.name ?? raw.Name ?? "",
    industryId: raw.industryId ?? raw.IndustryId ?? raw.industry?.industryId ?? null,
    industryName: raw.industryName ?? raw.IndustryName ?? raw.industry?.industryName ?? "Uncategorized",
    duration: raw.duration ?? raw.Duration ?? raw.estimatedDuration ?? "",
    price: raw.price ?? raw.Price ?? raw.rate ?? raw.Rate ?? 0,
    description: raw.description ?? raw.Description ?? "",
  };
}

function normalizeIndustry(raw) {
  return {
    id: raw.industryId ?? raw.IndustryId ?? raw.id ?? raw.Id,
    name: raw.industryName ?? raw.IndustryName ?? raw.name ?? raw.Name ?? "",
  };
}

// Matches the shape returned by GET /detailed-duties-summary: per-duty
// booking counts and income, already sorted by income server-side.
function normalizeDutySummary(raw) {
  return {
    dutyId: raw.dutyId ?? raw.DutyId,
    dutyName: raw.dutyName ?? raw.DutyName ?? "",
    description: raw.description ?? raw.Description ?? "",
    duration: raw.duration ?? raw.Duration ?? "",
    price: raw.price ?? raw.Price ?? 0,
    industryId: raw.industryId ?? raw.IndustryId ?? null,
    industryName: raw.industryName ?? raw.IndustryName ?? "",
    totalBookings: raw.totalBookings ?? raw.TotalBookings ?? 0,
    completedBookingsCount: raw.completedBookingsCount ?? raw.CompletedBookingsCount ?? 0,
    pendingBookingsCount: raw.pendingBookingsCount ?? raw.PendingBookingsCount ?? 0,
    totalIncomeGenerated: raw.totalIncomeGenerated ?? raw.TotalIncomeGenerated ?? 0,
  };
}

function emptyDraft(industryId) {
  return { name: "", industryId: industryId || "", duration: "", price: "", description: "" };
}

// ---- Component --------------------------------------------------------------

export default function JobsPage() {
  const { data: rawIndustryData, loading: industriesLoading } = fetchHook(
    "https://localhost:7011/api/industry/getIndustryData"
  );
  const { data: rawDutyData, loading: dutiesLoading } = fetchHook(
    "https://localhost:7011/api/Duty/getAllDutyData"
  );
  const { data: rawSummaryData, loading: summaryLoading } = fetchHook(
    "https://localhost:7011/api/Duty/detailed-duties-summary"
  );

  const [activeIndustryId, setActiveIndustryId] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [errors, setErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Category creation
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  // Derived, normalized data — computed once per fetch, not re-shaped on every render pass.
  const industries = useMemo(
    () => (rawIndustryData || []).map(normalizeIndustry),
    [rawIndustryData]
  );

  const jobs = useMemo(
    () => (rawDutyData || []).map(normalizeDuty),
    [rawDutyData]
  );

  const dutySummary = useMemo(
    () => (rawSummaryData || []).map(normalizeDutySummary),
    [rawSummaryData]
  );

  const isLoading = industriesLoading || dutiesLoading;

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCategory = activeIndustryId === "All" || job.industryId === activeIndustryId;
      const matchesSearch =
        !search.trim() ||
        job.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        job.description.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [jobs, activeIndustryId, search]);

  const categoryCounts = useMemo(() => {
    const counts = { All: jobs.length };
    industries.forEach((ind) => {
      counts[ind.id] = jobs.filter((j) => j.industryId === ind.id).length;
    });
    return counts;
  }, [jobs, industries]);

  const summaryTotals = useMemo(
    () =>
      dutySummary.reduce(
        (acc, row) => ({
          totalBookings: acc.totalBookings + (row.totalBookings || 0),
          completed: acc.completed + (row.completedBookingsCount || 0),
          pending: acc.pending + (row.pendingBookingsCount || 0),
          income: acc.income + (row.totalIncomeGenerated || 0),
        }),
        { totalBookings: 0, completed: 0, pending: 0, income: 0 }
      ),
    [dutySummary]
  );

  // ---- Job form --------------------------------------------------------------

  function openAddForm() {
    setEditingId(null);
    setDraft(emptyDraft(activeIndustryId !== "All" ? activeIndustryId : industries[0]?.id));
    setErrors({});
    setShowForm(true);
  }

  function openEditForm(job) {
    setEditingId(job.id);
    setDraft({
      name: job.name,
      industryId: job.industryId,
      duration: job.duration,
      price: String(job.price),
      description: job.description,
    });
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
    if (!draft.industryId) next.industryId = "Choose a category";
    if (!draft.duration.trim()) next.duration = "Enter an estimated duration";
    const priceNum = Number(draft.price);
    if (!draft.price || Number.isNaN(priceNum) || priceNum <= 0) {
      next.price = "Enter a valid price greater than 0";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateDraft()) return;

    setSubmitting(true);

    const payload = {
      dutyName: draft.name.trim(),
      industryId: draft.industryId,
      duration: draft.duration.trim(),
      price: Number(draft.price),
      description: draft.description.trim(),
    };

    const editPayload = [
      { op: "replace", path: "/dutyName", value: draft.name.trim() },
      { op: "replace", path: "/industryId", value: draft.industryId },
      { op: "replace", path: "/duration", value: draft.duration.trim() },
      { op: "replace", path: "/price", value: Number(draft.price) },
      { op: "replace", path: "/description", value: draft.description.trim() },
    ];

    const res = editingId
      ? await fetchAPI(`https://localhost:7011/api/Duty/patch/update-a-duty-data/${editingId}`, "PATCH", editPayload)
      : await fetchAPI("https://localhost:7011/api/Duty/addNewDuty", "POST", payload);

    setSubmitting(false);

    if (res) {
      window.alert(editingId ? "Job updated successfully." : "Job added successfully.");
      window.location.reload();
    } else {
      window.alert("Some error occurred. Please try again.");
    }
  }

  async function handleDelete(id) {
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Duty/delete/remove-duty-data/${id}`, "DELETE");
    setSubmitting(false);
    setConfirmDeleteId(null);

    if (res) {
      window.location.reload();
    } else {
      window.alert("Couldn't delete this job. Please try again.");
    }
  }

  // ---- Category form --------------------------------------------------------------

  function openCategoryForm() {
    setCategoryDraft("");
    setCategoryError("");
    setShowCategoryForm(true);
  }

  function closeCategoryForm() {
    setShowCategoryForm(false);
    setCategoryDraft("");
    setCategoryError("");
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    const name = categoryDraft.trim();

    if (!name) {
      setCategoryError("Enter a category name");
      return;
    }
    if (industries.some((ind) => ind.name.toLowerCase() === name.toLowerCase())) {
      setCategoryError("This category already exists");
      return;
    }

    const payload = {
      industryName: name,
    };

    setCategorySubmitting(true);
    const res = await fetchAPI("https://localhost:7011/api/Industry/addIndustryData", "POST", payload);
    setCategorySubmitting(false);

    if (res) {
      window.alert("New category added successfully.");
      window.location.reload();
    } else {
      window.alert("Some error occurred while adding the category. Please try again.");
    }
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
          <div className="wsw-jobs__header-actions">
            <button type="button" className="wsw-jobs__ghost-btn wsw-jobs__ghost-btn--on-dark" onClick={openCategoryForm}>
              + Add category
            </button>
            <button type="button" className="wsw-jobs__add-btn" onClick={openAddForm} disabled={isLoading}>
              + Add job
            </button>
          </div>
        </div>
      </header>

      <div className="wsw-jobs__body">
        <div className="wsw-jobs__toolbar">
          <div className="wsw-jobs__category-tabs" role="tablist" aria-label="Filter by category">
            <button
              type="button"
              role="tab"
              aria-selected={activeIndustryId === "All"}
              className={
                "wsw-jobs__category-tab" + (activeIndustryId === "All" ? " wsw-jobs__category-tab--active" : "")
              }
              onClick={() => setActiveIndustryId("All")}
            >
              All <span className="wsw-jobs__tab-count">{categoryCounts.All ?? 0}</span>
            </button>
            {industries.map((ind) => (
              <button
                type="button"
                role="tab"
                key={ind.id}
                aria-selected={activeIndustryId === ind.id}
                className={
                  "wsw-jobs__category-tab" + (activeIndustryId === ind.id ? " wsw-jobs__category-tab--active" : "")
                }
                onClick={() => setActiveIndustryId(ind.id)}
              >
                {ind.name} <span className="wsw-jobs__tab-count">{categoryCounts[ind.id] ?? 0}</span>
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
          {isLoading ? (
            <div className="wsw-jobs__empty">
              <p className="wsw-jobs__empty-title">Loading jobs…</p>
              <p className="wsw-jobs__empty-body">Fetching the latest catalog and pricing.</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="wsw-jobs__table-wrap">
              <table className="wsw-jobs__table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr className="wsw-jobs__row" key={job.id}>
                      <td className="wsw-jobs__cell-name">{job.name}</td>
                      <td>
                        <span className="wsw-jobs__category-tag">{job.industryName}</span>
                      </td>
                      <td className="wsw-jobs__cell-description" title={job.description || undefined}>
                        {job.description ? job.description : <span className="wsw-jobs__cell-empty">—</span>}
                      </td>
                      <td className="wsw-jobs__cell-muted">{job.duration ? `${job.duration} mins` : "—"}</td>
                      <td className="wsw-jobs__cell-price">{formatRs(job.price)}</td>
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
                                disabled={submitting}
                              >
                                {submitting ? "…" : "Confirm"}
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

        {/* ---------- Duty performance summary ---------- */}
        <div className="wsw-jobs__section-head">
          <h2 className="wsw-jobs__section-title">Duty performance summary</h2>
          <p className="wsw-jobs__section-sub">Bookings and income generated per job, highest earners first.</p>
        </div>

        <section className="wsw-jobs__panel" aria-label="Duty performance summary">
          <div className="wsw-jobs__table-wrap">
            <table className="wsw-jobs__summary-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Category</th>
                  <th className="wsw-jobs__num-col">Price</th>
                  <th className="wsw-jobs__num-col">Total bookings</th>
                  <th className="wsw-jobs__num-col">Completed</th>
                  <th className="wsw-jobs__num-col">Pending</th>
                  <th className="wsw-jobs__num-col">Income generated</th>
                </tr>
              </thead>
              <tbody>
                {summaryLoading ? (
                  <tr>
                    <td colSpan={7}>
                      <p className="wsw-jobs__loading-note">Loading performance summary…</p>
                    </td>
                  </tr>
                ) : dutySummary.length > 0 ? (
                  dutySummary.map((row) => (
                    <tr className="wsw-jobs__row" key={row.dutyId}>
                      <td className="wsw-jobs__cell-name">{row.dutyName}</td>
                      <td>
                        <span className="wsw-jobs__category-tag">{row.industryName}</span>
                      </td>
                      <td className="wsw-jobs__num-col">{formatRs(row.price)}</td>
                      <td className="wsw-jobs__num-col">{row.totalBookings}</td>
                      <td className="wsw-jobs__num-col wsw-jobs__num-completed">{row.completedBookingsCount}</td>
                      <td className="wsw-jobs__num-col wsw-jobs__num-pending">{row.pendingBookingsCount}</td>
                      <td className="wsw-jobs__num-col wsw-jobs__cell-price">{formatRs(row.totalIncomeGenerated)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="wsw-jobs__empty">
                        <p className="wsw-jobs__empty-title">No bookings recorded yet</p>
                        <p className="wsw-jobs__empty-body">Performance data will show up here once jobs get booked.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {dutySummary.length > 0 && (
                <tfoot>
                  <tr className="wsw-jobs__total-row">
                    <td colSpan={3}>Total</td>
                    <td className="wsw-jobs__num-col">{summaryTotals.totalBookings}</td>
                    <td className="wsw-jobs__num-col wsw-jobs__num-completed">{summaryTotals.completed}</td>
                    <td className="wsw-jobs__num-col wsw-jobs__num-pending">{summaryTotals.pending}</td>
                    <td className="wsw-jobs__num-col wsw-jobs__cell-price">{formatRs(summaryTotals.income)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>
      </div>

      {showForm && (
        <div className="wsw-jobs__modal-backdrop" role="dialog" aria-modal="true" aria-label={editingId ? "Edit job" : "Add job"}>
          <div className="wsw-jobs__modal">
            <div className="wsw-jobs__modal-head">
              <h2 className="wsw-jobs__modal-title">{editingId ? "Edit job" : "Add a new job"}</h2>
              <button type="button" className="wsw-jobs__modal-close" onClick={closeForm} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>

            <form className="wsw-jobs__form" onSubmit={handleSubmit} noValidate>
              <div className="wsw-jobs__field">
                <label className="wsw-jobs__label" htmlFor="job-category">
                  Category
                </label>
                <select
                  id="job-category"
                  className={"wsw-jobs__select" + (errors.industryId ? " wsw-jobs__input--error" : "")}
                  value={draft.industryId}
                  onChange={(e) => updateDraft("industryId", e.target.value)}
                >
                  <option value="">-- Select category --</option>
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </select>
                {errors.industryId && <span className="wsw-jobs__error">{errors.industryId}</span>}
                <button type="button" className="wsw-jobs__inline-link" onClick={openCategoryForm}>
                  + Add a new category
                </button>
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

              <div className="wsw-jobs__field">
                <label className="wsw-jobs__label" htmlFor="job-description">
                  Description <span className="wsw-jobs__label-optional">(optional)</span>
                </label>
                <textarea
                  id="job-description"
                  className="wsw-jobs__textarea"
                  rows="3"
                  value={draft.description}
                  onChange={(e) => updateDraft("description", e.target.value)}
                  placeholder="What's included in this job, any prerequisites, etc."
                />
              </div>

              <div className="wsw-jobs__field-row">
                <div className="wsw-jobs__field">
                  <label className="wsw-jobs__label" htmlFor="job-duration">
                    Estimated duration (mins)
                  </label>
                  <input
                    id="job-duration"
                    className={"wsw-jobs__input" + (errors.duration ? " wsw-jobs__input--error" : "")}
                    value={draft.duration}
                    onChange={(e) => updateDraft("duration", e.target.value)}
                    placeholder="e.g. 60"
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
                <button type="submit" className="wsw-jobs__primary-btn" disabled={submitting}>
                  {submitting ? "Saving…" : editingId ? "Save changes" : "Add job"}
                </button>
                <button type="button" className="wsw-jobs__ghost-btn" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryForm && (
        <div className="wsw-jobs__modal-backdrop" role="dialog" aria-modal="true" aria-label="Add category">
          <div className="wsw-jobs__modal wsw-jobs__modal--narrow">
            <div className="wsw-jobs__modal-head">
              <h2 className="wsw-jobs__modal-title">Add a new category</h2>
              <button type="button" className="wsw-jobs__modal-close" onClick={closeCategoryForm} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>

            <form className="wsw-jobs__form" onSubmit={handleAddCategory} noValidate>
              <div className="wsw-jobs__field">
                <label className="wsw-jobs__label" htmlFor="category-name">
                  Category name
                </label>
                <input
                  id="category-name"
                  className={"wsw-jobs__input" + (categoryError ? " wsw-jobs__input--error" : "")}
                  value={categoryDraft}
                  onChange={(e) => {
                    setCategoryDraft(e.target.value);
                    if (categoryError) setCategoryError("");
                  }}
                  placeholder="e.g. Landscaping"
                  autoFocus
                />
                {categoryError && <span className="wsw-jobs__error">{categoryError}</span>}
              </div>

              <div className="wsw-jobs__modal-actions">
                <button type="submit" className="wsw-jobs__primary-btn" disabled={categorySubmitting}>
                  {categorySubmitting ? "Adding…" : "Add category"}
                </button>
                <button type="button" className="wsw-jobs__ghost-btn" onClick={closeCategoryForm}>
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