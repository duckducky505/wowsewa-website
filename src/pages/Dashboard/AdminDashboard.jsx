// pages/AdminDashboard/AdminDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdNotificationsNone, MdFileDownload, MdTrendingUp, 
  MdTrendingDown, MdMoreVert, MdArrowOutward, MdCalendarToday
} from 'react-icons/md';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './AdminDashboard.css';
import { fetchHook } from '../../hooks/fetchHook';

// Clean Custom Tooltip configuration for the Cash Flow Bar Chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="adash-custom-tooltip" style={{ backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '4px', border: '1px solid #333' }}>
        <p className="label" style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{label}</p>
        <p style={{ margin: 0, color: 'var(--primary-color)' }}>In: Rs. {payload[0]?.value?.toLocaleString() ?? 0}</p>
        <p style={{ margin: 0, color: '#ff6b6b' }}>Out: Rs. {payload[1]?.value?.toLocaleString() ?? 0}</p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [activeIndex, setActiveIndex] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; 

  // Corrected Endpoints to prevent 404 Route Errors
  const metricsUrl = timeFrame === 'yearly'
    ? `https://localhost:7011/api/Transactions/YearlyData/1?year=${currentYear}`
    : `https://localhost:7011/api/Transactions/MonthlyData/1/1?year=${currentYear}&month=${currentMonth}`;

  const chartUrl = timeFrame === 'yearly'
    ? `https://localhost:7011/api/Transactions/YearlyData/1?year=${currentYear}`
    : `https://localhost:7011/api/Transactions/MonthlyData/1/1?year=${currentYear}&month=${currentMonth}`;

  const { data: KPIMetrics, loading: metricsLoading } = fetchHook(metricsUrl);
  const { data: serverChartData, loading: chartLoading } = fetchHook(chartUrl);
  const { data: fetchedCashFlows } = fetchHook("https://localhost:7011/api/CashFlow/get/allCashFlowData");
  const { data: fetchedHoldings } = fetchHook("https://localhost:7011/api/HoldingSheet/get/holding-sheet-data");
  const { data: categoryDataRaw } = fetchHook("https://localhost:7011/api/Transactions/category-breakdown");

  const incomeVal = KPIMetrics?.totalIncome ?? KPIMetrics?.TotalIncome ?? KPIMetrics?.data?.totalIncome ?? 0;
  const expenseVal = KPIMetrics?.totalExpense ?? KPIMetrics?.TotalExpense ?? KPIMetrics?.data?.totalExpense ?? 0;
  const profitVal = KPIMetrics?.netProfit ?? KPIMetrics?.NetProfit ?? KPIMetrics?.data?.netProfit ?? 0;
  
  // --- CHART DATA PARSING ---
  // Safely discover whether the backend sent an object envelope or a raw array
  let rawChartSource = [];
  if (serverChartData) {
    if (Array.isArray(serverChartData)) {
      rawChartSource = serverChartData; // Monthly raw array fallback
    } else if (serverChartData.chartData || serverChartData.ChartData) {
      rawChartSource = serverChartData.chartData ?? serverChartData.ChartData; // Yearly nested wrapper
    } else if (Array.isArray(serverChartData.data)) {
      rawChartSource = serverChartData.data;
    }
  }

  // Map fields defensively and resolve alternative timeline properties (name, month, date)
  const chartData = Array.isArray(rawChartSource) 
    ? rawChartSource.map(item => ({
        name: item.name ?? item.Name ?? item.month ?? item.Month ?? item.date ?? "Unknown",
        income: item.income ?? item.Income ?? item.cashIn ?? item.CashIn ?? 0,
        expense: item.expense ?? item.Expense ?? item.cashOut ?? item.CashOut ?? 0
      }))
    : [];

  const recentCashFlows = fetchedCashFlows ?? [];
  const recentHoldings = fetchedHoldings ?? [];
  
  const categoryColors = ['#00E5FF', '#FF007F', '#7000FF', '#FFB300', '#00FF66'];
  const categoryData = categoryDataRaw?.map((item, idx) => ({
    name: item.categoryName ?? item.CategoryName,
    value: item.value ?? item.Value ?? 0,
    color: categoryColors[idx % categoryColors.length]
  })) ?? [];

  const kpis = [
    { label: "Total Income", value: `Rs. ${incomeVal.toLocaleString()}`, delta: "+12.3%", up: true },
    { label: "Total Expense", value: `Rs. ${expenseVal.toLocaleString()}`, delta: "-3.1%", up: false },
    { label: "Net Profit", value: `Rs. ${profitVal.toLocaleString()}`, delta: "+24.8%", up: true }
  ];

  return (
    <div className="adash-wrap fade-in-animation">
      {/* HEADER */}
      <header className="adash-header">
        <div className="adash-header-left">
          <p className="adash-eyebrow">Wow Sewa - Electrical, CCTV, AC, Networking, Plumbing & Repair Service Kathmandu Admin</p>
          <h1 className="adash-title">System <span className="adash-accent-word">Analytics</span></h1>
          <p className="adash-sub">Real-time performance tracking & ledger audits</p>
        </div>
        <div className="adash-header-right">
          <button className="adash-icon-btn"><MdNotificationsNone size={22} /><span className="adash-notif-dot" /></button>
          <button className="adash-export-btn"><MdFileDownload size={18} /> Export</button>
        </div>
      </header>

      {/* KPI STRIP */}
      <div className="adash-kpi-strip">
        {kpis.map((k, i) => (
          <div key={k.label} className="adash-kpi-card" style={{ animationDelay: `${i * 80}ms` }}>
            <span className="adash-kpi-label">{k.label}</span>
            <span className="adash-kpi-value">{k.value}</span>
            <span className={`adash-kpi-delta ${k.up ? 'adash-delta-up' : 'adash-delta-down'}`}>
              {k.up ? <MdTrendingUp size={14} /> : <MdTrendingDown size={14} />} {k.delta}
            </span>
          </div>
        ))}
      </div>

      {/* CHARTS LAYER */}
      <div className="adash-charts-row">
        <div className="adash-chart-card wide">
          <div className="adash-card-head">
            <div>
              <h3 className="adash-card-title">Cash Flow Run-Rate</h3>
              <p className="adash-card-sub">Inflow vs Outflow operational comparison</p>
            </div>
            <div className="adash-filter-toggle">
              <MdCalendarToday className="filter-icon" />
              <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)} className="adash-select">
                <option value="monthly">Monthly View</option>
                <option value="yearly">Yearly View</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11 }} tickFormatter={v => `Rs.${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="income" name="Cash In" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Cash Out" fill="var(--surface-card)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="adash-chart-card">
          <div className="adash-card-head">
            <div>
              <h3 className="adash-card-title">By Category</h3>
              <p className="adash-card-sub">Share of volume revenue</p>
            </div>
          </div>
          <div className="adash-donut-wrap">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={68} paddingAngle={4} dataKey="value" onMouseEnter={(_, i) => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}>
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.4} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="adash-legend-list">
              {categoryData.map((d, i) => (
                <li key={d.name} className="adash-legend-item" onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}>
                  <span className="adash-legend-dot" style={{ background: d.color }} />
                  <span className="adash-legend-name">{d.name}</span>
                  <span className="adash-legend-val">{d.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* TWO COLUMN TABLES SPLIT GRID */}
      <div className="adash-split-tables-grid">
        {/* CASH FLOW VIEW SNIPPET */}
        <div className="adash-table-card">
          <div className="adash-table-head">
            <div>
              <h3 className="adash-card-title">Cash Flow Stream</h3>
              <p className="adash-card-sub">Recent revenue transactions</p>
            </div>
            <button className="adash-view-all-btn" onClick={() => navigate('/admin/cashflow')}>
              View More <MdArrowOutward size={14} />
            </button>
          </div>
          <div className="adash-table-wrap">
            <table className="adash-table">
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentCashFlows.slice(0, 5).map(flow => (
                  <tr key={flow.id} className="adash-table-row">
                    <td className="adash-job-service">{flow.clientName}</td>
                    <td>
                      <span className={`adash-status-pill adash-status-pill--${flow.cashType?.toLowerCase() === 'income' ? 'completed' : 'pending'}`}>
                        {flow.cashType}
                      </span>
                    </td>
                    <td className="adash-job-amount">Rs. {(flow.cashIn > 0 ? flow.cashIn : flow.cashOut).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HOLDING SHEET VIEW SNIPPET */}
        <div className="adash-table-card">
          <div className="adash-table-head">
            <div>
              <h3 className="adash-card-title">Employee Holding Sheets</h3>
              <p className="adash-card-sub">Active hand-to-hand balances</p>
            </div>
            <button className="adash-view-all-btn" onClick={() => navigate('/admin/holdingsheet')}>
              View More <MdArrowOutward size={14} />
            </button>
          </div>
          <div className="adash-table-wrap">
            <table className="adash-table">
              <thead>
                <tr>
                  <th>From / To</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentHoldings.slice(0, 5).map(sheet => (
                  <tr key={sheet.id} className="adash-table-row">
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-silver)' }}>F: {sheet.fromHolderName}</div>
                      <div style={{ fontWeight: 600 }}>T: {sheet.toHolderName}</div>
                    </td>
                    <td>
                      <span className="adash-status-pill adash-status-pill--active">
                        {sheet.entryType}
                      </span>
                    </td>
                    <td className="adash-job-amount">Rs. {sheet.amount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;