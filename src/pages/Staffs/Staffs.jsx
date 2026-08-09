// pages/StaffManagement/StaffPage.jsx
import React, { useMemo, useState } from "react";
import { MdClose, MdAdd, MdFileDownload } from "react-icons/md";
import { fetchHook } from "../../hooks/fetchHook";
import { fetchAPI } from "../../utils/fetchAPI";
import "./Staffs.css";

// ---- Helpers --------------------------------------------------------------

function initials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeEmployee(raw) {
  return {
    id: raw.guidId ?? raw.GuidId,
    fullName: raw.fullName ?? raw.FullName ?? raw.name ?? raw.Name ?? "",
    phone: raw.phoneNumber ?? raw.PhoneNumber ?? "",
    industryId: raw.industryId ?? raw.IndustryId,
    industryName:
      raw.industry?.industryName ?? raw.Industry?.IndustryName ?? raw.IndustryName ?? "Unassigned",
    joinedDate: raw.joinedDate ?? raw.JoinedDate,
    isActive: raw.isActive ?? raw.IsActive ?? true,
  };
}

function normalizeIndustry(raw) {
  return {
    id: raw.industryId ?? raw.IndustryId ?? raw.id ?? raw.Id,
    name: raw.industryName ?? raw.IndustryName ?? raw.name ?? raw.Name ?? "",
  };
}

function statusLabel(isActive) {
  return isActive ? "Active" : "Inactive";
}

function emptyDraft() {
  return { name: "", phone: "", industryId: "", joinedDate: "", isActive: true };
}

// ---- Component --------------------------------------------------------------

export default function Staffs() {
  const { data: rawEmployeeData, loading: staffLoading } = fetchHook(
    "https://localhost:7011/api/Employee/getEmployeesDetail"
  );
  const { data: rawIndustryData, loading: industriesLoading } = fetchHook(
    "https://localhost:7011/api/industry/getIndustryData"
  );

  const [activeIndustryId, setActiveIndustryId] = useState("All");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [errors, setErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const industries = useMemo(
    () => (rawIndustryData || []).map(normalizeIndustry),
    [rawIndustryData]
  );

  const staff = useMemo(
    () => (rawEmployeeData || []).map(normalizeEmployee),
    [rawEmployeeData]
  );

  const isLoading = staffLoading || industriesLoading;

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesActive = showAll || s.isActive;
      const matchesCategory = activeIndustryId === "All" || s.industryId === activeIndustryId;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q);
      return matchesActive && matchesCategory && matchesSearch;
    });
  }, [staff, activeIndustryId, search, showAll]);

  const categoryCounts = useMemo(() => {
    const visibleStaff = showAll ? staff : staff.filter((s) => s.isActive);
    const counts = { All: visibleStaff.length };
    industries.forEach((ind) => {
      counts[ind.id] = visibleStaff.filter((s) => s.industryId === ind.id).length;
    });
    return counts;
  }, [staff, industries, showAll]);

  const stats = useMemo(() => {
    const visibleStaff = showAll ? staff : staff.filter((s) => s.isActive);
    return [
      { label: "Total staff", value: visibleStaff.length },
      {
        label: "Categories covered",
        value: new Set(visibleStaff.map((s) => s.industryId).filter(Boolean)).size,
      },
    ];
  }, [staff, showAll]);

  function openAddForm() {
    setEditingId(null);
    setDraft(emptyDraft());
    setErrors({});
    setShowForm(true);
  }

  function openEditForm(person) {
    setEditingId(person.id);
    setDraft({
      name: person.fullName,
      phone: person.phone,
      industryId: person.industryId ?? "",
      joinedDate: person.joinedDate,
      isActive: person.isActive,
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
    if (!draft.name.trim()) next.name = "Enter the staff member's name";
    if (!/^[0-9+\s-]{7,15}$/.test(draft.phone.trim())) next.phone = "Enter a valid phone number";
    if (!draft.industryId) next.industryId = "Choose a category";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateDraft()) return;

    setSubmitting(true);

    const payload = {
      name: draft.name.trim(),
      phoneNumber: draft.phone.trim(),
      industryId: parseInt(draft.industryId, 10),
      joinedDate: draft.joinedDate || new Date().toISOString().split("T")[0],
      isActive: draft.isActive,
    };

    const editPayload = [
      { op: "replace", path: "/fullName", value: payload.name },
      { op: "replace", path: "/phoneNumber", value: payload.phoneNumber },
      { op: "replace", path: "/industryId", value: payload.industryId },
      { op: "replace", path: "/joinedDate", value: payload.joinedDate },
      { op: "replace", path: "/isActive", value: payload.isActive },
    ];

    const res = editingId
      ? await fetchAPI(`https://localhost:7011/api/Employee/UpdateEmployee/${editingId}`, "PATCH", editPayload)
      : await fetchAPI("https://localhost:7011/api/Employee/AddEmployee", "POST", payload);

    setSubmitting(false);

    if (res) {
      window.alert(editingId ? "Staff member updated successfully." : "Staff member added successfully.");
      window.location.reload();
    } else {
      window.alert("Some error occurred. Please try again.");
    }
  }

  async function handleDelete(id) {
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Employee/deleteEmployee/${id}`, "DELETE");
    setSubmitting(false);
    setConfirmDeleteId(null);

    if (res) {
      window.location.reload();
    } else {
      window.alert("Couldn't remove this staff member. Please try again.");
    }
  }

  return (
    <div className="wsw-staff">
      <header className="wsw-staff__header">
        <div className="wsw-staff__header-inner">
          <div>
            <span className="wsw-staff__eyebrow">Team</span>
            <h1 className="wsw-staff__title">Staff</h1>
            <p className="wsw-staff__sub">Manage technicians and staff, by category.</p>
          </div>
          <div className="wsw-staff__header-actions">
            <button
              type="button"
              className="wsw-staff__icon-btn"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show active only" : "Show all staff"}
            </button>
            <button type="button" className="wsw-staff__icon-btn">
              <MdFileDownload size={18} /> Export
            </button>
            <button type="button" className="wsw-staff__add-btn" onClick={openAddForm} disabled={isLoading}>
              <MdAdd size={18} /> Add staff
            </button>
          </div>
        </div>
      </header>

      <div className="wsw-staff__body">
        <section className="wsw-staff__stats" aria-label="Staff overview">
          {stats.map((s) => (
            <div className="wsw-staff__stat-card" key={s.label}>
              <span className="wsw-staff__stat-value">{s.value}</span>
              <span className="wsw-staff__stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        <div className="wsw-staff__toolbar">
          <div className="wsw-staff__category-tabs" role="tablist" aria-label="Filter by category">
            <button
              type="button"
              role="tab"
              aria-selected={activeIndustryId === "All"}
              className={
                "wsw-staff__category-tab" + (activeIndustryId === "All" ? " wsw-staff__category-tab--active" : "")
              }
              onClick={() => setActiveIndustryId("All")}
            >
              All <span className="wsw-staff__tab-count">{categoryCounts.All ?? 0}</span>
            </button>
            {industries.map((ind) => (
              <button
                type="button"
                role="tab"
                key={ind.id}
                aria-selected={activeIndustryId === ind.id}
                className={
                  "wsw-staff__category-tab" + (activeIndustryId === ind.id ? " wsw-staff__category-tab--active" : "")
                }
                onClick={() => setActiveIndustryId(ind.id)}
              >
                {ind.name} <span className="wsw-staff__tab-count">{categoryCounts[ind.id] ?? 0}</span>
              </button>
            ))}
          </div>

          <input
            type="search"
            className="wsw-staff__search"
            placeholder="Search name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search staff"
          />
        </div>

        <section className="wsw-staff__panel" aria-label="Staff list">
          {isLoading ? (
            <div className="wsw-staff__empty">
              <p className="wsw-staff__empty-title">Loading staff…</p>
              <p className="wsw-staff__empty-body">Fetching the latest team roster.</p>
            </div>
          ) : filteredStaff.length > 0 ? (
            <div className="wsw-staff__table-wrap">
              <table className="wsw-staff__table">
                <thead>
                  <tr>
                    <th>Staff</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Phone</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((person) => (
                    <tr className="wsw-staff__row" key={person.id}>
                      <td>
                        <div className="wsw-staff__person">
                          <span className="wsw-staff__avatar">{initials(person.fullName)}</span>
                          <div>
                            <p className="wsw-staff__person-name">{person.fullName}</p>
                            {person.joinedDate && (
                              <p className="wsw-staff__person-meta">Joined {person.joinedDate}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="wsw-staff__category-tag">{person.industryName}</span>
                      </td>
                      <td>
                        <span
                          className={
                            "wsw-staff__status-pill " +
                            (person.isActive
                              ? "wsw-staff__status-pill--active"
                              : "wsw-staff__status-pill--off-duty")
                          }
                        >
                          {statusLabel(person.isActive)}
                        </span>
                      </td>
                      <td className="wsw-staff__cell-muted">{person.phone || "—"}</td>
                      <td>
                        <div className="wsw-staff__row-actions">
                          <button
                            type="button"
                            className="wsw-staff__icon-action"
                            onClick={() => openEditForm(person)}
                          >
                            Edit
                          </button>
                          {confirmDeleteId === person.id ? (
                            <span className="wsw-staff__confirm-inline">
                              <button
                                type="button"
                                className="wsw-staff__icon-action wsw-staff__icon-action--danger"
                                onClick={() => handleDelete(person.id)}
                                disabled={submitting}
                              >
                                {submitting ? "…" : "Confirm"}
                              </button>
                              <button
                                type="button"
                                className="wsw-staff__icon-action"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="wsw-staff__icon-action wsw-staff__icon-action--danger"
                              onClick={() => setConfirmDeleteId(person.id)}
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
            <div className="wsw-staff__empty">
              <p className="wsw-staff__empty-title">No staff found</p>
              <p className="wsw-staff__empty-body">
                Try a different category or search term, or add a new staff member.
              </p>
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <div className="wsw-staff__modal-backdrop" role="dialog" aria-modal="true" aria-label={editingId ? "Edit staff" : "Add staff"}>
          <div className="wsw-staff__modal">
            <div className="wsw-staff__modal-head">
              <h2 className="wsw-staff__modal-title">{editingId ? "Edit staff member" : "Add a new staff member"}</h2>
              <button type="button" className="wsw-staff__modal-close" onClick={closeForm} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>

            <form className="wsw-staff__form" onSubmit={handleSubmit} noValidate>
              <div className="wsw-staff__field">
                <label className="wsw-staff__label" htmlFor="staff-name">
                  Full name
                </label>
                <input
                  id="staff-name"
                  className={"wsw-staff__input" + (errors.name ? " wsw-staff__input--error" : "")}
                  value={draft.name}
                  onChange={(e) => updateDraft("name", e.target.value)}
                  placeholder="e.g. Bikash Rai"
                />
                {errors.name && <span className="wsw-staff__error">{errors.name}</span>}
              </div>

              <div className="wsw-staff__field">
                <label className="wsw-staff__label" htmlFor="staff-phone">
                  Phone number
                </label>
                <input
                  id="staff-phone"
                  type="tel"
                  className={"wsw-staff__input" + (errors.phone ? " wsw-staff__input--error" : "")}
                  value={draft.phone}
                  onChange={(e) => updateDraft("phone", e.target.value)}
                  placeholder="+977 98-XXXX-XXXX"
                />
                {errors.phone && <span className="wsw-staff__error">{errors.phone}</span>}
              </div>

              <div className="wsw-staff__field">
                <label className="wsw-staff__label" htmlFor="staff-category">
                  Category
                </label>
                <select
                  id="staff-category"
                  className={"wsw-staff__select" + (errors.industryId ? " wsw-staff__input--error" : "")}
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
                {errors.industryId && <span className="wsw-staff__error">{errors.industryId}</span>}
              </div>

              <div className="wsw-staff__field">
                <label className="wsw-staff__label" htmlFor="staff-joined">
                  Joined date <span className="wsw-staff__label-optional"></span>
                </label>
                <input
                  id="staff-joined"
                  type="date"
                  className="wsw-staff__input"
                  value={draft.joinedDate}
                  onChange={(e) => updateDraft("joinedDate", e.target.value)}
                />
              </div>

              {editingId && (
                <div className="wsw-staff__field">
                  <label className="wsw-staff__label" htmlFor="staff-status">
                    Status
                  </label>
                  <select
                    id="staff-status"
                    className="wsw-staff__select"
                    value={draft.isActive ? "active" : "inactive"}
                    onChange={(e) => updateDraft("isActive", e.target.value === "active")}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}

              <div className="wsw-staff__modal-actions">
                <button type="submit" className="wsw-staff__primary-btn" disabled={submitting}>
                  {submitting ? "Saving…" : editingId ? "Save changes" : "Add staff"}
                </button>
                <button type="button" className="wsw-staff__ghost-btn" onClick={closeForm}>
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