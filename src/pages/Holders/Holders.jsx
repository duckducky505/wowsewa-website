// pages/Holders/HoldersPage.jsx
import React, { useMemo, useState } from "react";
import { MdSearch, MdSync, MdAdd, MdClose } from "react-icons/md";
import { fetchHook } from "../../hooks/fetchHook";
import { fetchAPI } from "../../utils/fetchAPI";
import "./Holders.css";

// ---- Constants --------------------------------------------------------------

// Mirrors HolderType enum in Models/Holder.cs
const HOLDER_TYPES = {
  1: "OfficeCash",
  2: "Staff",
  3: "Bank",
  4: "Personal",
  5: "Client",
  6: "Expense",
};

const HOLDER_TYPE_VALUE = {
  OfficeCash: 1,
  Staff: 2,
  Bank: 3,
  Personal: 4,
  Client: 5,
  Expense: 6,
};

const HOLDER_TYPE_LABEL = {
  OfficeCash: "Office Cash",
  Staff: "Staff",
  Bank: "Bank",
  Personal: "Personal",
  Client: "Client",
  Expense: "Expense",
};

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

function normalizeHolder(raw) {
  const rawType = raw.type ?? raw.Type;
  const typeName = typeof rawType === "number" ? HOLDER_TYPES[rawType] : rawType;

  return {
    id: raw.id ?? raw.Id,
    name: raw.name ?? raw.Name ?? "",
    type: typeName ?? "Unknown",
    isSystem: raw.isSystem ?? raw.IsSystem ?? false,
    balance: Number(raw.currentBalance ?? raw.CurrentBalance ?? 0),
    employeeId: raw.employeeId ?? raw.EmployeeId ?? null,
    employeeName:
      raw.employee?.fullName ?? raw.Employee?.FullName ?? raw.employee?.Name ?? null,
  };
}

function normalizeEmployee(raw) {
  return {
    id: raw.guidId ?? raw.GuidId,
    fullName: raw.fullName ?? raw.FullName ?? raw.name ?? raw.Name ?? "",
    isActive: raw.isActive ?? raw.IsActive ?? true,
  };
}

function formatCurrency(value) {
  const abs = Math.abs(value);
  const formatted = "Rs. " + abs.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return value < 0 ? `-${formatted}` : formatted;
}

function emptyDraft() {
  return {
    name: "",
    type: "OfficeCash",
    isSystem: false,
    currentBalance: "",
    employeeId: "",
  };
}

// ---- Component --------------------------------------------------------------

export default function HoldersPage() {
  const { data: rawHolders, loading, refetch } = fetchHook(
    "https://localhost:7011/api/Holder/get/holders-data"
  );
  const { data: rawEmployees, loading: employeesLoading } = fetchHook(
    "https://localhost:7011/api/Employee/getEmployeesDetail"
  );

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [sortBy, setSortBy] = useState("balance-desc");

  const [syncing, setSyncing] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const holders = useMemo(() => (rawHolders || []).map(normalizeHolder), [rawHolders]);
  const employees = useMemo(
    () => (rawEmployees || []).map(normalizeEmployee).filter((e) => e.isActive),
    [rawEmployees]
  );

  const typeCounts = useMemo(() => {
    const counts = { All: holders.length };
    Object.values(HOLDER_TYPES).forEach((typeName) => {
      counts[typeName] = holders.filter((h) => h.type === typeName).length;
    });
    return counts;
  }, [holders]);

  const filteredHolders = useMemo(() => {
    let list = holders.filter((h) => {
      const matchesType = activeType === "All" || h.type === activeType;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || h.name.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "balance-asc":
          return a.balance - b.balance;
        case "balance-desc":
          return b.balance - a.balance;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return list;
  }, [holders, activeType, search, sortBy]);

  const stats = useMemo(() => {
    const totalBalance = holders.reduce((sum, h) => sum + h.balance, 0);
    const positiveCount = holders.filter((h) => h.balance > 0).length;
    const negativeCount = holders.filter((h) => h.balance < 0).length;
    return [
      { label: "Total Holders", value: holders.length },
      { label: "Net Balance", value: formatCurrency(totalBalance), isCurrency: true },
      { label: "In Credit", value: positiveCount },
      { label: "In Deficit", value: negativeCount },
    ];
  }, [holders]);

  // ---- Refresh helper (falls back to full reload if fetchHook has no refetch) ----
  function refreshHolders() {
    if (typeof refetch === "function") {
      refetch();
    } else {
      window.location.reload();
    }
  }

  // ---- Sync employees into Holders table ----
  async function handleSyncEmployees() {
    setSyncing(true);
    const res = await fetchAPI("https://localhost:7011/api/Employee/sync-missing-holders", "POST");
    setSyncing(false);

    if (res) {
      window.alert("Employee holders synced successfully.");
      refreshHolders();
    } else {
      window.alert("Couldn't sync employees. Please try again.");
    }
  }

  // ---- Add holder form ----
  function openAddForm() {
    setDraft(emptyDraft());
    setErrors({});
    setShowAddForm(true);
  }

  function closeAddForm() {
    setShowAddForm(false);
    setErrors({});
  }

  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateDraft() {
    const next = {};
    if (!draft.name.trim()) next.name = "Enter a holder name";
    if (!draft.type) next.type = "Choose a type";
    if (draft.currentBalance === "" || isNaN(Number(draft.currentBalance))) {
      next.currentBalance = "Enter a valid opening balance";
    }
    if (draft.type === "Staff" && !draft.employeeId) {
      next.employeeId = "Select the linked employee";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleAddHolder(e) {
    e.preventDefault();
    if (!validateDraft()) return;

    setSubmitting(true);

    const payload = {
      name: draft.name.trim(),
      type: HOLDER_TYPE_VALUE[draft.type],
      isSystem: draft.isSystem,
      currentBalance: Number(draft.currentBalance),
      employeeId: draft.type === "Staff" && draft.employeeId ? draft.employeeId : null,
    };

    const res = await fetchAPI("https://localhost:7011/api/Holder/add/holder-data", "POST", payload);

    setSubmitting(false);

    if (res) {
      window.alert("Holder added successfully.");
      setShowAddForm(false);
      refreshHolders();
    } else {
      window.alert("Couldn't add this holder. Please try again.");
    }
  }

  return (
    <div className="wsw-holders">
      <header className="wsw-holders__header">
        <div className="wsw-holders__header-inner">
          <div>
            <span className="wsw-holders__eyebrow">Ledger</span>
            <h1 className="wsw-holders__title">Holders</h1>
            <p className="wsw-holders__sub">
              View balances held across cash, bank, staff, and client accounts.
            </p>
          </div>
          <div className="wsw-holders__header-actions">
            <button
              type="button"
              className="wsw-holders__sync-btn"
              onClick={handleSyncEmployees}
              disabled={syncing}
            >
              <MdSync size={17} className={syncing ? "wsw-holders__spin" : ""} />
              {syncing ? "Syncing…" : "Sync Employees"}
            </button>
            <button type="button" className="wsw-holders__add-btn" onClick={openAddForm}>
              <MdAdd size={18} /> Add Holder
            </button>
          </div>
        </div>
      </header>

      <div className="wsw-holders__body">
        <section className="wsw-holders__stats" aria-label="Holder overview">
          {stats.map((s) => (
            <div className="wsw-holders__stat-card" key={s.label}>
              <span
                className={
                  "wsw-holders__stat-value" +
                  (s.isCurrency ? " wsw-holders__stat-value--currency" : "")
                }
              >
                {s.value}
              </span>
              <span className="wsw-holders__stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        <div className="wsw-holders__toolbar">
          <div className="wsw-holders__type-tabs" role="tablist" aria-label="Filter by holder type">
            <button
              type="button"
              role="tab"
              aria-selected={activeType === "All"}
              className={
                "wsw-holders__type-tab" + (activeType === "All" ? " wsw-holders__type-tab--active" : "")
              }
              onClick={() => setActiveType("All")}
            >
              All <span className="wsw-holders__tab-count">{typeCounts.All ?? 0}</span>
            </button>
            {Object.values(HOLDER_TYPES).map((typeName) => (
              <button
                type="button"
                role="tab"
                key={typeName}
                aria-selected={activeType === typeName}
                className={
                  "wsw-holders__type-tab" +
                  (activeType === typeName ? " wsw-holders__type-tab--active" : "")
                }
                onClick={() => setActiveType(typeName)}
              >
                {HOLDER_TYPE_LABEL[typeName]}{" "}
                <span className="wsw-holders__tab-count">{typeCounts[typeName] ?? 0}</span>
              </button>
            ))}
          </div>

          <div className="wsw-holders__toolbar-right">
            <select
              className="wsw-holders__sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort holders"
            >
              <option value="balance-desc">Balance: High to Low</option>
              <option value="balance-asc">Balance: Low to High</option>
              <option value="name-asc">Name: A to Z</option>
            </select>

            <div className="wsw-holders__search-wrap">
              <MdSearch size={17} className="wsw-holders__search-icon" />
              <input
                type="search"
                className="wsw-holders__search"
                placeholder="Search holder name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search holders"
              />
            </div>
          </div>
        </div>

        <section className="wsw-holders__panel" aria-label="Holders list">
          {loading ? (
            <div className="wsw-holders__empty">
              <p className="wsw-holders__empty-title">Loading holders…</p>
              <p className="wsw-holders__empty-body">Fetching balances from the ledger.</p>
            </div>
          ) : filteredHolders.length > 0 ? (
            <div className="wsw-holders__table-wrap">
              <table className="wsw-holders__table">
                <thead>
                  <tr>
                    <th>Holder</th>
                    <th>Type</th>
                    <th>Linked Employee</th>
                    <th className="wsw-holders__num-col">Current Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHolders.map((holder) => (
                    <tr className="wsw-holders__row" key={holder.id}>
                      <td>
                        <div className="wsw-holders__holder-cell">
                          <span className="wsw-holders__avatar">{initials(holder.name)}</span>
                          <div>
                            <p className="wsw-holders__holder-name">{holder.name}</p>
                            {holder.isSystem && (
                              <p className="wsw-holders__holder-meta">System account</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            "wsw-holders__type-tag wsw-holders__type-tag--" + holder.type.toLowerCase()
                          }
                        >
                          {HOLDER_TYPE_LABEL[holder.type] ?? holder.type}
                        </span>
                      </td>
                      <td className="wsw-holders__cell-muted">
                        {holder.employeeName || "—"}
                      </td>
                      <td className="wsw-holders__num-col">
                        <span
                          className={
                            "wsw-holders__balance" +
                            (holder.balance < 0
                              ? " wsw-holders__balance--negative"
                              : holder.balance > 0
                              ? " wsw-holders__balance--positive"
                              : "")
                          }
                        >
                          {formatCurrency(holder.balance)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="wsw-holders__total-label">
                      Total ({filteredHolders.length} holders)
                    </td>
                    <td className="wsw-holders__num-col wsw-holders__total-value">
                      {formatCurrency(filteredHolders.reduce((sum, h) => sum + h.balance, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="wsw-holders__empty">
              <p className="wsw-holders__empty-title">No holders found</p>
              <p className="wsw-holders__empty-body">
                Try a different type filter or search term.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ===== ADD HOLDER MODAL ===== */}
      {showAddForm && (
        <div
          className="wsw-holders__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Add holder"
        >
          <div className="wsw-holders__modal">
            <div className="wsw-holders__modal-head">
              <h2 className="wsw-holders__modal-title">Add a new holder</h2>
              <button
                type="button"
                className="wsw-holders__modal-close"
                onClick={closeAddForm}
                aria-label="Close"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form className="wsw-holders__form" onSubmit={handleAddHolder} noValidate>
              <div className="wsw-holders__field">
                <label className="wsw-holders__label" htmlFor="holder-name">
                  Holder name
                </label>
                <input
                  id="holder-name"
                  className={"wsw-holders__input" + (errors.name ? " wsw-holders__input--error" : "")}
                  value={draft.name}
                  onChange={(e) => updateDraft("name", e.target.value)}
                  placeholder="e.g. Nabil Bank - Main"
                />
                {errors.name && <span className="wsw-holders__error">{errors.name}</span>}
              </div>

              <div className="wsw-holders__field-row">
                <div className="wsw-holders__field">
                  <label className="wsw-holders__label" htmlFor="holder-type">
                    Type
                  </label>
                  <select
                    id="holder-type"
                    className={"wsw-holders__select" + (errors.type ? " wsw-holders__input--error" : "")}
                    value={draft.type}
                    onChange={(e) => updateDraft("type", e.target.value)}
                  >
                    {Object.values(HOLDER_TYPES).map((typeName) => (
                      <option key={typeName} value={typeName}>
                        {HOLDER_TYPE_LABEL[typeName]}
                      </option>
                    ))}
                  </select>
                  {errors.type && <span className="wsw-holders__error">{errors.type}</span>}
                </div>

                <div className="wsw-holders__field">
                  <label className="wsw-holders__label" htmlFor="holder-balance">
                    Opening Balance (Rs.)
                  </label>
                  <input
                    id="holder-balance"
                    type="number"
                    step="0.01"
                    className={
                      "wsw-holders__input" + (errors.currentBalance ? " wsw-holders__input--error" : "")
                    }
                    value={draft.currentBalance}
                    onChange={(e) => updateDraft("currentBalance", e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.currentBalance && (
                    <span className="wsw-holders__error">{errors.currentBalance}</span>
                  )}
                </div>
              </div>

              {draft.type === "Staff" && (
                <div className="wsw-holders__field">
                  <label className="wsw-holders__label" htmlFor="holder-employee">
                    Linked employee
                  </label>
                  <select
                    id="holder-employee"
                    className={
                      "wsw-holders__select" + (errors.employeeId ? " wsw-holders__input--error" : "")
                    }
                    value={draft.employeeId}
                    onChange={(e) => updateDraft("employeeId", e.target.value)}
                    disabled={employeesLoading}
                  >
                    <option value="">
                      {employeesLoading ? "Loading employees…" : "-- Select employee --"}
                    </option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName}
                      </option>
                    ))}
                  </select>
                  {errors.employeeId && (
                    <span className="wsw-holders__error">{errors.employeeId}</span>
                  )}
                </div>
              )}

              <div className="wsw-holders__field wsw-holders__field--checkbox">
                <label className="wsw-holders__checkbox-label" htmlFor="holder-system">
                  <input
                    id="holder-system"
                    type="checkbox"
                    checked={draft.isSystem}
                    onChange={(e) => updateDraft("isSystem", e.target.checked)}
                  />
                  Mark as a system account
                </label>
              </div>

              <div className="wsw-holders__modal-actions">
                <button type="submit" className="wsw-holders__primary-btn" disabled={submitting}>
                  {submitting ? "Adding…" : "Add Holder"}
                </button>
                <button type="button" className="wsw-holders__ghost-btn" onClick={closeAddForm}>
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