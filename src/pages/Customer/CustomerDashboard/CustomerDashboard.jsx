// pages/CustomerDashboard/CustomerDashboard.jsx
// Shows exactly two things: any booking currently active/upcoming, and the
// customer's past booking history. Nothing else.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLocationOn, MdAccessTime, MdOutlineCalendarMonth, MdAdd } from 'react-icons/md';
import './CustomerDashboard.css';


const MOCK_CURRENT = [
  {
    id: 'WS-10532',
    service: 'AC Installation & Repair',
    date: '2026-07-03',
    time: '10:00 AM – 12:00 PM',
    address: 'Baluwatar, Kathmandu',
    status: 'On the way',
    pro: 'Rohan Shrestha',
  },
];

const MOCK_HISTORY = [
  { id: 'WS-10421', date: '2026-06-20', service: 'Geyser Installation', amount: 2200, status: 'Completed' },
  { id: 'WS-10388', date: '2026-06-12', service: 'Leak Detection & Fixing', amount: 450, status: 'Completed' },
  { id: 'WS-10299', date: '2026-05-27', service: 'Wi-Fi Mesh Setup', amount: 900, status: 'Completed' },
  { id: 'WS-10201', date: '2026-05-09', service: 'Solar Panel Cleaning', amount: 600, status: 'Cancelled' },
];

const statusPillClass = (status) => {
  const s = status.toLowerCase();
  if (s === 'completed') return 'completed';
  if (s === 'cancelled') return 'cancelled';
  if (s === 'in progress' || s === 'on the way') return 'pending';
  return 'confirmed';
};

const CustomerDashboard = () => {
  const navigate = useNavigate();



  const current =  MOCK_CURRENT;
  const history =  MOCK_HISTORY;

  return (
    <div className="cdash-page">
      <div className="cdash-page-head">
        <div>
          <h1 className="text-xl accent-text-white">Dashboard</h1>
          <p className="text-md accent-text-white">Your current and past bookings.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/account/bookings')}>
          <MdAdd size={18} /> Book a service
        </button>
      </div>

      {/* CURRENT / PRESENT BOOKING(S) */}
      <section className="cdash-section">
        <h3 className="cdash-section-title">Current booking</h3>

        {current.length === 0 ? (
          <div className="cdash-empty">
            <p>You don't have any booking in progress right now.</p>
            <button className="btn btn-primary" onClick={() => navigate('/account/bookings')}>
              <MdAdd size={16} /> Book a service
            </button>
          </div>
        ) : (
          <div className="cdash-current-list">
            {current.map((b) => (
              <div key={b.id} className="cdash-current-card">
                <div className="cdash-current-top">
                  <h4>{b.service}</h4>
                  <span className={`status-pill ${statusPillClass(b.status)}`}>{b.status}</span>
                </div>
                <div className="cdash-current-meta">
                  <span><MdOutlineCalendarMonth size={15} /> {b.date}</span>
                  <span><MdAccessTime size={15} /> {b.time}</span>
                  <span><MdLocationOn size={15} /> {b.address}</span>
                </div>
                <div className="cdash-current-foot">
                  Pro assigned: <strong>{b.pro}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PAST BOOKINGS */}
      <section className="cdash-section">
        <h3 className="cdash-section-title">Past bookings</h3>

        <div className="table-card bg-text-main">
          <div className="table-responsive">
            <table className="table-universal">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td data-label="Date">{h.date}</td>
                    <td data-label="Service"><span className="customer-name">{h.service}</span></td>
                    <td data-label="Amount">Rs. {h.amount.toLocaleString()}</td>
                    <td data-label="Status">
                      <span className={`status-pill ${statusPillClass(h.status)}`}>{h.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;