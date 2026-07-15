// pages/AdminDashboard/AdminDashboard.jsx
import React, { useState } from 'react';
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

const MOCK_DATA_PROFLES = {
  monthly: {
    kpis: [
      { label: "Total Income", value: "Rs. 1,450,000", delta: "+12.3%", up: true },
      { label: "Total Expense", value: "Rs. 620,000", delta: "-3.1%", up: false },
      { label: "Net Profit", value: "Rs. 830,000", delta: "+24.8%", up: true }
    ],
    chart: [
      { name: 'Week 1', income: 320000, expense: 150000 },
      { name: 'Week 2', income: 410000, expense: 180000 },
      { name: 'Week 3', income: 370000, expense: 140000 },
      { name: 'Week 4', income: 350000, expense: 150000 }
    ]
  },
  yearly: {
    kpis: [
      { label: "Total Income", value: "Rs. 18,240,000", delta: "+18.5%", up: true },
      { label: "Total Expense", value: "Rs. 7,890,000", delta: "+5.2%", up: false },
      { label: "Net Profit", value: "Rs. 10,350,000", delta: "+31.4%", up: true }
    ],
    chart: [
      { name: 'Jan', income: 1200000, expense: 550000 },
      { name: 'Feb', income: 1350000, expense: 590000 },
      { name: 'Mar', income: 1450000, expense: 620000 },
      { name: 'Apr', income: 1100000, expense: 510000 },
      { name: 'May', income: 1600000, expense: 680000 },
      { name: 'Jun', income: 1550000, expense: 640000 }
    ]
  }
};

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [activeIndex, setActiveIndex] = useState(null);

  const { data: categories_data } = fetchHook("https://localhost:7011/api/AdminDashboard/donut/industry-category");

  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentYear = new Date().getFullYear();
  const chartUrl = timeFrame === 'monthly'
    ? `https://localhost:7011/api/AdminDashboard/monthly/charts-data/${currentYear}`
    : `https://localhost:7011/api/AdminDashboard/monthly/charts-data/${currentYear}`;

  const { data: rawChartData } = fetchHook(chartUrl);

  const barChartData = timeFrame === 'monthly'
    ? monthNames.slice(1).map((monthStr, index) => {
        const currentMonthNum = index + 1;
        const foundData = (rawChartData || []).find(item =>
          item && (item.monthNumber == currentMonthNum || item.MonthNumber == currentMonthNum)
        );

        return {
          name: monthStr,
          Earnings: foundData ? (foundData.income ?? foundData.Income ?? 0) : 0,
          Expenses: foundData ? (foundData.expense ?? foundData.Expense ?? 0) : 0
        };
      })
    : (rawChartData || []).map(item => ({
        name: item.year ?? item.Year ?? "",
        Earnings: item.income ?? item.Income ?? 0,
        Expenses: item.expense ?? item.Expense ?? 0
      }));

  const activeProfile = MOCK_DATA_PROFLES[timeFrame];
  const kpis = activeProfile.kpis;

  // Brand-aligned donut palette: lime, deep green, amber, muted green, ink
  const categoryColors = ['#D1FE17', '#074C3A', '#E8A33D', '#4E9C7F', '#010A08'];
  const categoryData = categories_data?.map((item, idx) => ({
    name: item.industryName,
    value: item.totalEarnings,
    color: categoryColors[idx % categoryColors.length]
  }));

  const { data: cashFlowData } = fetchHook("https://localhost:7011/api/CashFlow/get/allCashFlowData");
  const { data: holdingData } = fetchHook("https://localhost:7011/api/HoldingSheet/get/holding-sheet-data");

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
        {/* KPI STRIP */}
        <section className="wsw-admin__kpi-strip" aria-label="Key financial metrics">
          {kpis.map((k, i) => (
            <div key={k.label} className="wsw-admin__kpi-card" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="wsw-admin__kpi-label">{k.label}</span>
              <span className="wsw-admin__kpi-value">{k.value}</span>
              <span className={"wsw-admin__kpi-delta " + (k.up ? "wsw-admin__kpi-delta--up" : "wsw-admin__kpi-delta--down")}>
                {k.up ? <MdTrendingUp size={14} /> : <MdTrendingDown size={14} />} {k.delta}
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
                <p className="wsw-admin__card-sub">Inflow vs outflow operational comparison</p>
              </div>
              <div className="wsw-admin__filter-toggle">
                <MdCalendarToday className="wsw-admin__filter-icon" />
                <select
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value)}
                  className="wsw-admin__select"
                >
                  <option value="monthly">Monthly View</option>
                  <option value="yearly">Yearly View</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E5D6" />
                <XAxis dataKey="name" stroke="#5C6B60" tickLine={false} axisLine={false} />
                <YAxis stroke="#5C6B60" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(7, 76, 58, 0.05)' }} />
                <Legend />
                <Bar dataKey="Earnings" fill="#074C3A" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Expenses" fill="#E8A33D" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="wsw-admin__chart-card">
            <div className="wsw-admin__card-head">
              <div>
                <h3 className="wsw-admin__card-title">By Category</h3>
                <p className="wsw-admin__card-sub">Share of volume revenue</p>
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
              <ul className="wsw-admin__legend-list">
                {categoryData?.map((d, i) => (
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
              <button className="wsw-admin__view-more-btn" onClick={() => navigate('/admin/HoldingSheet')}>
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