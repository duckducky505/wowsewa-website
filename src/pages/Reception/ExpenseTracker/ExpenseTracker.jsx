import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import {fetchHook} from "../../../hooks/fetchHook";
import "./ExpenseTracker.css";

const EXPENSE_CATEGORIES = [
  { value: "telephone", label: "Telephone Recharge" },
  { value: "shop", label: "Shop / Product Purchase" },
  { value: "utility", label: "Utility Bill" },
  { value: "transport", label: "Transport / Fuel" },
  { value: "stationery", label: "Stationery" },
  { value: "maintenance", label: "Maintenance" },
  { value: "misc", label: "Miscellaneous" },
];

const PAYMENT_METHODS = ["Cash", "eSewa", "Khalti", "Bank Transfer"];

const emptyForm = {
  category: "telephone",
  description: "",
  amount: "",
  paymentMethod: "Cash",
  date: new Date().toISOString().slice(0, 10),
  vendor: "",
  remarks: "",
};

const ExpenseTracker = () => {
  const { user } = useAuth();
  const fetchAPI = fetchHook();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/expenses", { method: "GET" });
      setExpenses(res?.data ?? []);
    } catch (err) {
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  }, [fetchAPI]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.description.trim() || !form.amount || Number(form.amount) <= 0) {
      setError("Please provide a valid description and amount.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        recordedBy: user?.guidId,
      };
      await fetchAPI("/api/expenses", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setForm(emptyForm);
      await loadExpenses();
    } catch (err) {
      setError("Failed to save expense. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this expense entry?")) return;
    try {
      await fetchAPI(`/api/expenses/${id}`, { method: "DELETE" });
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      setError("Failed to delete entry.");
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (filterCategory !== "all" && exp.category !== filterCategory) return false;
    if (filterFrom && exp.date < filterFrom) return false;
    if (filterTo && exp.date > filterTo) return false;
    return true;
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const todayTotal = expenses
    .filter((exp) => exp.date === new Date().toISOString().slice(0, 10))
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
  const categoryLabel = (val) =>
    EXPENSE_CATEGORIES.find((c) => c.value === val)?.label ?? val;

  return (
    <div className="exp-tracker">
      <header className="exp-tracker__header">
        <div className="exp-tracker__header-inner">
          <span className="exp-tracker__eyebrow">WowSewa · Front Desk Ledger</span>
          <h1 className="exp-tracker__title">Daily Expense Tracker</h1>
          <p className="exp-tracker__subtitle">
            Log telephone recharges, shop purchases, and day-to-day office spend.
          </p>
        </div>
      </header>

      <div className="exp-tracker__body">
        <section className="exp-tracker__summary">
          <div className="exp-summary-card">
            <span className="exp-summary-card__label">Today's Spend</span>
            <span className="exp-summary-card__value">Rs. {todayTotal.toLocaleString()}</span>
          </div>
          <div className="exp-summary-card">
            <span className="exp-summary-card__label">Filtered Total</span>
            <span className="exp-summary-card__value">Rs. {totalAmount.toLocaleString()}</span>
          </div>
          <div className="exp-summary-card">
            <span className="exp-summary-card__label">Entries Logged</span>
            <span className="exp-summary-card__value">{filteredExpenses.length}</span>
          </div>
        </section>

        <div className="exp-tracker__grid">
          <section className="exp-form-panel">
            <h2 className="exp-form-panel__title">New Entry</h2>
            <form className="exp-form" onSubmit={handleSubmit}>
              <div className="exp-form__row">
                <label className="exp-form__label" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="exp-form__select"
                  value={form.category}
                  onChange={handleChange}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="exp-form__row">
                <label className="exp-form__label" htmlFor="description">
                  Description
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  className="exp-form__input"
                  placeholder="e.g. Ncell recharge for office line"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="exp-form__row exp-form__row--split">
                <div>
                  <label className="exp-form__label" htmlFor="amount">
                    Amount (Rs.)
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="exp-form__input"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="exp-form__label" htmlFor="date">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="exp-form__input"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="exp-form__row exp-form__row--split">
                <div>
                  <label className="exp-form__label" htmlFor="paymentMethod">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    className="exp-form__select"
                    value={form.paymentMethod}
                    onChange={handleChange}
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="exp-form__label" htmlFor="vendor">
                    Vendor / Shop
                  </label>
                  <input
                    id="vendor"
                    name="vendor"
                    type="text"
                    className="exp-form__input"
                    placeholder="Optional"
                    value={form.vendor}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="exp-form__row">
                <label className="exp-form__label" htmlFor="remarks">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  className="exp-form__textarea"
                  placeholder="Optional notes"
                  value={form.remarks}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              {error && <p className="exp-form__error">{error}</p>}

              <button type="submit" className="exp-form__submit" disabled={submitting}>
                {submitting ? "Saving..." : "Add Expense"}
              </button>
            </form>
          </section>

          <section className="exp-ledger-panel">
            <div className="exp-ledger-panel__toolbar">
              <h2 className="exp-ledger-panel__title">Ledger Entries</h2>
              <div className="exp-filters">
                <select
                  className="exp-filters__select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className="exp-filters__date"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                />
                <span className="exp-filters__sep">to</span>
                <input
                  type="date"
                  className="exp-filters__date"
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <p className="exp-ledger-panel__state">Loading entries...</p>
            ) : filteredExpenses.length === 0 ? (
              <p className="exp-ledger-panel__state">No expense entries found.</p>
            ) : (
              <div className="exp-table-wrap">
                <table className="exp-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Vendor</th>
                      <th>Payment</th>
                      <th className="exp-table__amount-col">Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>{exp.date}</td>
                        <td>
                          <span className={`exp-badge exp-badge--${exp.category}`}>
                            {categoryLabel(exp.category)}
                          </span>
                        </td>
                        <td>{exp.description}</td>
                        <td>{exp.vendor || "—"}</td>
                        <td>{exp.paymentMethod}</td>
                        <td className="exp-table__amount-col">
                          Rs. {Number(exp.amount).toLocaleString()}
                        </td>
                        <td>
                          <button
                            className="exp-table__delete"
                            onClick={() => handleDelete(exp.id)}
                            aria-label="Delete entry"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} className="exp-table__total-label">
                        Total
                      </td>
                      <td className="exp-table__amount-col exp-table__total-value">
                        Rs. {totalAmount.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;