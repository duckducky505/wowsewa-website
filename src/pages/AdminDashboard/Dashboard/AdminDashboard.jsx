// pages/AdminDashboard/AdminDashboard.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdNotificationsNone, MdFileDownload, MdTrendingUp,
  MdTrendingDown, MdArrowOutward, MdCalendarToday
} from 'react-icons/md';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './AdminDashboard.css';
import { fetchHook } from '../../../hooks/fetchHook';

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Custom tooltip for the cash flow bar chart — dark ledger-card style to match brand
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="wsw-admin__tooltip">
        <p className="wsw-admin__tooltip-label">{label}</p>
        <p className="wsw-admin__tooltip-row wsw-admin__tooltip-row--in">
          In: Rs. {payload[0]?.value?.toLocaleString() ?? 0}
        </p>
        <p className="wsw-admin__tooltip-row wsw-admin__tooltip-row--out">
          Out: Rs. {payload[1]?.value?.toLocaleString() ?? 0}
        </p>
      </div>
    );
  }
  return null;
};

function formatRs(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function computeDelta(current, previous) {
  if (!previous) return { delta: 'N/A', up: current >= 0 };
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  return { delta: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, up: pct >= 0 };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = today.getFullYear(); y >= today.getFullYear() - 4; y--) years.push(y);
    return years;
  }, [today]);

  const { data: rawChartData } = fetchHook(
    `https://localhost:7011/api/AdminDashboard/monthly/charts-data/${selectedYear}`
  );

  const { data: categories_data } = fetchHook(
    `https://localhost:7011/api/AdminDashboard/donut/industry-category?year=${selectedYear}&month=${selectedMonth}`
  );

  const { data: cashFlowData } = fetchHook('https://localhost:7011/api/CashFlow/get/allCashFlowData');
  const { data: holdingData } = fetchHook('https://localhost:7011/api/HoldingSheet/get/holding-sheet-data');

  // Every month of the selected year, zero-filled where the API has no
  // entry — the bar chart always shows all 12 bars, with the selected
  // month visually emphasized rather than the chart being replaced.
  const barChartData = useMemo(() => {
    return MONTH_NAMES.slice(1).map((monthStr, index) => {
      const monthNum = index + 1;
      const found = (rawChartData || []).find(
        (item) => item && (item.monthNumber == monthNum || item.MonthNumber == monthNum)
      );
      return {
        name: monthStr,
        monthNum,
        Earnings: found ? (found.income ?? found.Income ?? 0) : 0,
        Expenses: found ? (found.expense ?? found.Expense ?? 0) : 0,
      };
    });
  }, [rawChartData]);

  // KPIs are derived from the single selected month, not the whole year —
  // this is what actually changes when the admin picks a different
  // month/year, rather than a static mock profile.
  const kpis = useMemo(() => {
    const current = barChartData.find((m) => m.monthNum === selectedMonth) || { Earnings: 0, Expenses: 0 };

    const prevMonthNum = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    // Only looked up within the currently-loaded year's data — if the
    // selected month is January, the previous month lives in a year we
    // haven't fetched, so there's no delta to compare against.
    const previous =
      prevYear === selectedYear
        ? barChartData.find((m) => m.monthNum === prevMonthNum)
        : null;

    const income = current.Earnings;
    const expense = current.Expenses;
    const net = income - expense;

    const incomeDelta = computeDelta(income, previous?.Earnings);
    const expenseDelta = computeDelta(expense, previous?.Expenses);
    const netDelta = computeDelta(net, previous ? previous.Earnings - previous.Expenses : null);

    return [
      { label: 'Total Income', value: formatRs(income), ...incomeDelta },
      { label: 'Total Expense', value: formatRs(expense), ...expenseDelta },
      { label: 'Net Profit', value: formatRs(net), ...netDelta },
    ];
  }, [barChartData, selectedMonth, selectedYear]);

  // Brand-aligned donut palette: lime, deep green, amber, muted green, ink
  const categoryColors = ['#D1FE17', '#074C3A', '#E8A33D', '#4E9C7F', '#010A08'];
  const categoryData = categories_data?.map((item, idx) => ({
    name: item.industryName,
    value: item.totalEarnings,
    color: categoryColors[idx % categoryColors.length],
  }));

  const selectedMonthLabel = `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;

  return (
    <div className="wsw-admin fade-in-animation">
      {/* HEADER */}
      <header className="wsw-admin__header">
        <div className="wsw-admin__header-inner">
          <div className="wsw-admin__header-left">
            <span className="wsw-admin__eyebrow">WowSewa Admin Console</span>
            <h1 className="wsw-admin__title">System Analytics</h1>
            <p className="wsw-admin__sub">Real-time performance tracking &amp; ledger audits</p>
          </div>
          <div className="wsw-admin__header-actions">
            <button className="wsw-admin__icon-btn" title="Notifications">
              <MdNotificationsNone size={20} />
              <span className="wsw-admin__notif-dot" />
            </button>
            <button className="wsw-admin__export-btn">
              <MdFileDownload size={18} /> Export
            </button>
          </div>
        </div>
      </header>

      <div className="wsw-admin__body">
        {/* PERIOD PICKER */}
        <section className="wsw-admin__period-bar" aria-label="Reporting period">
          <div className="wsw-admin__period-label">
            <MdCalendarToday size={15} />
            <span>Showing data for <strong>{selectedMonthLabel}</strong></span>
          </div>
          <div className="wsw-admin__period-controls">
            <select
              className="wsw-admin__select wsw-admin__select--boxed"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              aria-label="Month"
            >
              {MONTH_NAMES.slice(1).map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              className="wsw-admin__select wsw-admin__select--boxed"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              aria-label="Year"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </section>

        {/* KPI STRIP */}
        <section className="wsw-admin__kpi-strip" aria-label="Key financial metrics">
          {kpis.map((k, i) => (
            <div key={k.label} className="wsw-admin__kpi-card" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="wsw-admin__kpi-label">{k.label}</span>
              <span className="wsw-admin__kpi-value">{k.value}</span>
              <span className={"wsw-admin__kpi-delta " + (k.up ? "wsw-admin__kpi-delta--up" : "wsw-admin__kpi-delta--down")}>
                {k.delta !== 'N/A' && (k.up ? <MdTrendingUp size={14} /> : <MdTrendingDown size={14} />)} {k.delta}
              </span>
            </div>
          ))}
        </section>

        {/* CHARTS ROW */}
        <div className="wsw-admin__charts-row">
          <div className="wsw-admin__chart-card wsw-admin__chart-card--wide">
            <div className="wsw-admin__card-head">
              <div>
                <h3 className="wsw-admin__card-title">Cash Flow Run-Rate</h3>
                <p className="wsw-admin__card-sub">{selectedYear} by month · {MONTH_NAMES[selectedMonth]} highlighted</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E5D6" />
                <XAxis dataKey="name" stroke="#5C6B60" tickLine={false} axisLine={false} />
                <YAxis stroke="#5C6B60" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(7, 76, 58, 0.05)' }} />
                <Legend />
                <Bar dataKey="Earnings" radius={[4, 4, 0, 0]} barSize={12}>
                  {barChartData.map((entry) => (
                    <Cell
                      key={`earn-${entry.monthNum}`}
                      fill="#074C3A"
                      opacity={entry.monthNum === selectedMonth ? 1 : 0.35}
                    />
                  ))}
                </Bar>
                <Bar dataKey="Expenses" radius={[4, 4, 0, 0]} barSize={12}>
                  {barChartData.map((entry) => (
                    <Cell
                      key={`exp-${entry.monthNum}`}
                      fill="#E8A33D"
                      opacity={entry.monthNum === selectedMonth ? 1 : 0.35}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="wsw-admin__chart-card">
            <div className="wsw-admin__card-head">
              <div>
                <h3 className="wsw-admin__card-title">By Category</h3>
                <p className="wsw-admin__card-sub">Share of volume revenue · {selectedMonthLabel}</p>
              </div>
            </div>
            <div className="wsw-admin__donut-wrap">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                    onMouseEnter={(_, i) => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {categoryData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {categoryData?.length > 0 ? (
                <ul className="wsw-admin__legend-list">
                  {categoryData.map((d, i) => (
                    <li
                      key={d.name}
                      className="wsw-admin__legend-item"
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <span className="wsw-admin__legend-dot" style={{ background: d.color }} />
                      <span className="wsw-admin__legend-name">{d.name}</span>
                      <span className="wsw-admin__legend-val">Rs {d.value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="wsw-admin__empty-note">No category data for {selectedMonthLabel}.</p>
              )}
            </div>
          </div>
        </div>

        {/* TWO COLUMN TABLES */}
        <div className="wsw-admin__split-tables">
          <div className="wsw-admin__table-card">
            <div className="wsw-admin__table-head">
              <div>
                <h3 className="wsw-admin__card-title">Cash Flow Stream</h3>
                <p className="wsw-admin__card-sub">Recent revenue transactions</p>
              </div>
              <button className="wsw-admin__view-more-btn" onClick={() => navigate('/admin/CashFlow')}>
                View More <MdArrowOutward size={14} />
              </button>
            </div>
            <div className="wsw-admin__table-wrap">
              <table className="wsw-admin__table">
                <thead>
                  <tr>
                    <th>Target</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlowData?.slice(0, 5).map((flow, index) => {
                    const isExpense = flow.cashType?.toLowerCase() === 'expense';
                    return (
                      <tr key={flow.id || index} className="wsw-admin__table-row">
                        <td className="wsw-admin__cell-strong">{flow.clientName ?? flow.ClientName ?? "N/A"}</td>
                        <td>
                          <span
                            className={
                              "wsw-admin__status-pill " +
                              (isExpense ? "wsw-admin__status-pill--expense" : "wsw-admin__status-pill--income")
                            }
                          >
                            {flow.cashType}
                          </span>
                        </td>
                        <td className={"wsw-admin__cell-amount" + (isExpense ? " wsw-admin__cell-amount--expense" : "")}>
                          Rs. {(flow.cashIn > 0 ? flow.cashIn : flow.cashOut)?.toLocaleString() ?? 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="wsw-admin__table-card">
            <div className="wsw-admin__table-head">
              <div>
                <h3 className="wsw-admin__card-title">Employee Holding Sheets</h3>
                <p className="wsw-admin__card-sub">Active hand-to-hand balances</p>
              </div>
              <button className="wsw-admin__view-more-btn" onClick={() => navigate('/admin/holding-sheet')}>
                View More <MdArrowOutward size={14} />
              </button>
            </div>
            <div className="wsw-admin__table-wrap">
              <table className="wsw-admin__table">
                <thead>
                  <tr>
                    <th>From / To</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {holdingData?.slice(0, 5).map((sheet, index) => (
                    <tr key={sheet.id || index} className="wsw-admin__table-row">
                      <td>
                        <div className="wsw-admin__holder-from">
                          F: {sheet.fromHolderId || sheet.FromHolder || sheet.senderName || sheet.givenBy || "Unknown"}
                        </div>
                        <div className="wsw-admin__holder-to">
                          T: {sheet.toHolder || sheet.ToHolder || sheet.receiverName || sheet.receivedBy || "Unknown"}
                        </div>
                      </td>
                      <td>
                        <span className="wsw-admin__status-pill wsw-admin__status-pill--transfer">
                          {sheet.entryType ?? sheet.EntryType ?? "Transfer"}
                        </span>
                      </td>
                      <td className="wsw-admin__cell-amount">
                        Rs. {(sheet.amount ?? sheet.Amount ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;