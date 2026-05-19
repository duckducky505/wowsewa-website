// pages/AdminDashboard/CashFlowPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdFileDownload } from 'react-icons/md';
import '../Dashboard/AdminDashboard.css';

const CashFlowPage = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/cashflow/all')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(() => {
        setLogs([
          { id: 101, createdDate: '2026-05-16', clientName: 'Ramesh Sharma', cashType: 'Income', description: 'Leaking pipe repair service', cashIn: 12000, cashOut: 0, paymentMethod: 'eSewa', employeeName: 'Sita Kumari' },
          { id: 102, createdDate: '2026-05-15', clientName: 'N/A', cashType: 'Expense', description: 'Bought spare materials', cashIn: 0, cashOut: 4500, paymentMethod: 'Cash', employeeName: 'Arjun Thapa' }
        ]);
      });
  }, []);

  return (
    <div className="adash-wrap fade-in-animation">
      <header className="adash-header">
        <div className="adash-header-left">
          <button className="adash-view-all-btn" style={{ marginBottom: '12px' }} onClick={() => navigate(-1)}>
            <MdArrowBack /> Back to Dashboard
          </button>
          <h1 className="adash-title">Cash Flow <span className="adash-accent-word">Ledger</span></h1>
          <p className="adash-sub">Historic balance sheets for platform workflow parameters</p>
        </div>
        <button className="adash-export-btn"><MdFileDownload size={18} /> Export CSV</button>
      </header>

      <div className="adash-table-card">
        <div className="adash-table-wrap">
          <table className="adash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client Target</th>
                <th>Employee Assignee</th>
                <th>Type</th>
                <th>Method</th>
                <th>Cash In</th>
                <th>Cash Out</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(flow => (
                <tr key={flow.id} className="adash-table-row">
                  <td style={{ color: 'var(--text-silver)' }}>{flow.createdDate}</td>
                  <td>{flow.clientName}</td>
                  <td><strong>{flow.employeeName}</strong></td>
                  <td>
                    <span className={`adash-status-pill ${flow.cashType.toLowerCase() === 'income' ? 'adash-status-pill--completed' : 'adash-status-pill--active'}`}>
                      {flow.cashType}
                    </span>
                  </td>
                  <td>{flow.paymentMethod}</td>
                  <td style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{flow.cashIn > 0 ? `Rs. ${flow.cashIn.toLocaleString()}` : '-'}</td>
                  <td style={{ color: '#ef4444', fontWeight: 600 }}>{flow.cashOut > 0 ? `Rs. ${flow.cashOut.toLocaleString()}` : '-'}</td>
                  <td style={{ color: 'var(--text-silver)', fontSize: '0.9rem' }}>{flow.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashFlowPage;