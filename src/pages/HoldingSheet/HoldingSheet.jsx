// pages/AdminDashboard/HoldingSheetPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdFileDownload } from 'react-icons/md';
import '../Dashboard/AdminDashboard.css';

const HoldingSheet = () => {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    fetch('/api/holdingsheet/all')
      .then(res => res.json())
      .then(data => setSheets(data))
      .catch(() => {
        setSheets([
          { id: 1, createdDate: '2026-05-16', amount: 12000, entryType: 'Collection', paymentMethod: 'eSewa', status: 'Completed', fromHolderName: 'Sita Kumari', toHolderName: 'Arjun Thapa', note: 'Testing Data' },
          { id: 2, createdDate: '2026-05-15', amount: 4500, entryType: 'ExpenseOut', paymentMethod: 'Cash', status: 'Pending', fromHolderName: 'Arjun Thapa', toHolderName: 'Hardware Store', note: 'Pipe fittings purchase' }
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
          <h1 className="adash-title">Holding Sheet <span className="adash-accent-word">Audits</span></h1>
          <p className="adash-sub">Track active hand-to-hand collections and balances</p>
        </div>
        <button className="adash-export-btn"><MdFileDownload size={18} /> Export CSV</button>
      </header>

      <div className="adash-table-card">
        <div className="adash-table-wrap">
          <table className="adash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source (From)</th>
                <th>Target (To)</th>
                <th>Type</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>System Note</th>
              </tr>
            </thead>
            <tbody>
              {sheets.map(sheet => (
                <tr key={sheet.id} className="adash-table-row">
                  <td style={{ color: 'var(--text-silver)' }}>{sheet.createdDate}</td>
                  <td><strong>{sheet.fromHolderName}</strong></td>
                  <td><strong>{sheet.toHolderName}</strong></td>
                  <td><span className="adash-status-pill adash-status-pill--active">{sheet.entryType}</span></td>
                  <td>{sheet.paymentMethod}</td>
                  <td style={{ fontWeight: 600 }}>Rs. {sheet.amount.toLocaleString()}</td>
                  <td>
                    <span className={`adash-status-pill ${sheet.status.toLowerCase() === 'completed' ? 'adash-status-pill--completed' : 'adash-status-pill--pending'}`}>
                      {sheet.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-silver)', fontSize: '0.9rem' }}>{sheet.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HoldingSheet;