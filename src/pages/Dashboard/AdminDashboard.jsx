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
import { fetchHook } from '../../hooks/fetchHook';

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


  const { data: categories_data }= fetchHook("https://localhost:7011/api/AdminDashboard/donut/jobs-category");

  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentYear = new Date().getFullYear();
  const chartUrl = timeFrame === 'monthly' 
    ? `https://localhost:7011/api/AdminDashboard/monthly/charts-data/${currentYear}` 
    : `https://localhost:7011/api/AdminDashboard/monthly/charts-data/${currentYear}`;

  // const chartUrl = timeFrame === 'yearly' 
  //   ? `https://localhost:7011/api/AdminDashboard/yearly/charts-data/${currentYear}` 
  //   : `https://localhost:7011/api/AdminDashboard/yearly/charts-data/${currentYear}`;

  const { data: rawChartData } = fetchHook(chartUrl);
  
  const barChartData = timeFrame === 'monthly'
    ? monthNames.slice(1).map((monthStr, index) => {
        const currentMonthNum = index + 1; // 1 for Jan, 12 for Dec
        
        // Find if the API returned data for this month
        const foundData = (rawChartData || []).find(item => 
          item && (item.monthNumber == currentMonthNum || item.MonthNumber == currentMonthNum)
        );

        return {
          name: monthStr,
          // FIX: Changed from .earnings/.expenses to .income/.expense
          Earnings: foundData ? (foundData.income ?? foundData.Income ?? 0) : 0,
          Expenses: foundData ? (foundData.expense ?? foundData.Expense ?? 0) : 0
        };
      })
    : (rawChartData || []).map(item => ({
        name: item.year ?? item.Year ?? "",
        // FIX: Changed from .earnings/.expenses to .income/.expense
        Earnings: item.income ?? item.Income ?? 0,
        Expenses: item.expense ?? item.Expense ?? 0
      }));

  // Read clean state configurations based on active dropdown filter toggle
  const activeProfile = MOCK_DATA_PROFLES[timeFrame];
  const chartData = activeProfile.chart;
  const kpis = activeProfile.kpis;

  const categoryColors = ['#00E5FF', '#FF007F', '#7000FF', '#FFB300', '#00FF66'];
  const categoryData = categories_data?.map((item, idx) => ({
    name: item.jobName,
    value: item.totalEarnings,
    color: categoryColors[idx % categoryColors.length]
  }));

  const {data : cashFlowData} = fetchHook("https://localhost:7011/api/CashFlow/get/allCashFlowData");
  const {data : holdingData} = fetchHook("https://localhost:7011/api/HoldingSheet/get/holding-sheet-data");

  return (
    <div className="adash-wrap fade-in-animation">
      {/* HEADER */}
      <header className="adash-header">
        <div className="adash-header-left">
          <p className="adash-eyebrow">Wow Sewa Admin Console</p>
          <h1 className="adash-title">System <span className="adash-accent-word">Analytics</span></h1>
          <p className="adash-sub">Real-time performance tracking &amp; ledger audits</p>
        </div>
        <div className="adash-header-right">
          <button className="btn btn-dark btn-sm" title="Notifications">
            <MdNotificationsNone size={20} />
          </button>
          <button className="btn btn-primary">
            <MdFileDownload size={18} /> Export
          </button>
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
              data={barChartData} 
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
              <YAxis stroke="#888" tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} />
              <Legend />
              
              {/* Side-by-side bars. barSize ensures they don't get too thick. */}
              <Bar dataKey="Earnings" fill="#D1FE17" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="Expenses" fill="#FF007F" radius={[4, 4, 0, 0]} barSize={12} />
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
                  {categoryData?.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.4} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="adash-legend-list">
              {categoryData?.map((d, i) => (
                <li key={d.name} className="adash-legend-item" onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}>
                  <span className="adash-legend-dot" style={{ background: d.color }} />
                  <span className="adash-legend-name">{d.name}</span>
                  <span className="adash-legend-val">Rs {d.value}</span>
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
            <button className="btn btn-sm btn-dark" onClick={() => navigate('/admin/CashFlow')}>
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
                {/* .slice(0, 5) ensures only the top 5 rows are displayed */}
                {cashFlowData?.slice(0, 5).map((flow, index) => {
                  const isExpense = flow.cashType?.toLowerCase() === 'expense';
                  return (
                    <tr key={flow.id || index} className="adash-table-row">
                      <td className="adash-job-service">{flow.clientName ?? flow.ClientName ?? "N/A"}</td>
                      <td>
                        <span 
                          className={`adash-status-pill ${isExpense ? 'adash-status-pill--pending' : 'adash-status-pill--completed'}`}
                          style={isExpense ? { backgroundColor: 'rgba(255, 0, 127, 0.1)', color: '#FF007F' } : {}}
                        >
                          {flow.cashType}
                        </span>
                      </td>
                      <td className="adash-job-amount" style={{ color: isExpense ? '#FF007F' : 'inherit' }}>
                        Rs. {(flow.cashIn > 0 ? flow.cashIn : flow.cashOut)?.toLocaleString() ?? 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* HOLDING SHEET SNIPPET */}
        <div className="adash-table-card">
          <div className="adash-table-head">
            <div>
              <h3 className="adash-card-title">Employee Holding Sheets</h3>
              <p className="adash-card-sub">Active hand-to-hand balances</p>
            </div>
            <button className="btn btn-sm btn-dark" onClick={() => navigate('/admin/HoldingSheet')}>
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
                {/* .slice(0, 5) limits the display to 5 rows */}
                {holdingData?.slice(0, 5).map((sheet, index) => (
                  <tr key={sheet.id || index} className="adash-table-row">
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-silver)' }}>
                        {/* Fallbacks included for different C# naming conventions */}
                        F: {sheet.fromHolderId || sheet.FromHolder || sheet.senderName || sheet.givenBy || "Unknown"}
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        T: {sheet.toHolder || sheet.ToHolder || sheet.receiverName || sheet.receivedBy || "Unknown"}
                      </div>
                    </td>
                    <td>
                      <span className="adash-status-pill adash-status-pill--active">
                        {sheet.entryType ?? sheet.EntryType ?? "Transfer"}
                      </span>
                    </td>
                    <td className="adash-job-amount">
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
  );
};

export default AdminDashboard;