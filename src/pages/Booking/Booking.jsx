import React from 'react';
import { FaCalendarPlus, FaFilter, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import './Booking.css';

const Booking = () => {
    const bookings = [
        { id: 'BK-7701', customer: 'Sita Rai', service: 'AC Repair', date: '2026-03-28', status: 'Pending', total: 'Rs. 1500' },
        { id: 'BK-7702', customer: 'Ram Thapa', service: 'Full Plumbing', date: '2026-03-27', status: 'Confirmed', total: 'Rs. 4500' },
        { id: 'BK-7703', customer: 'Gopal KC', service: 'Electric Wiring', date: '2026-03-27', status: 'Completed', total: 'Rs. 2200' },
    ];

    return (
        <div className="staff-container">
            <header className="staff-header">
                <div className="header-left">
                    <h1 className="text-xl">Service <span className="accent-text-primary">Bookings</span></h1>
                    <p className="text-silver">Track and manage incoming service requests.</p>
                </div>
                <button className="btn btn-primary add-staff-btn">
                    <FaCalendarPlus /> New Booking
                </button>
            </header>

            <div className="staff-stats">
                <div className="stat-item card">
                    <div className="stat-icon pending"><FaClock /></div>
                    <div>
                        <span className="stat-label">Pending</span>
                        <h3 className="stat-value">12</h3>
                    </div>
                </div>
                <div className="stat-item card">
                    <div className="stat-icon confirmed"><FaCheckCircle /></div>
                    <div>
                        <span className="stat-label">Confirmed</span>
                        <h3 className="stat-value">8</h3>
                    </div>
                </div>
                <div className="stat-item card">
                    <div className="stat-icon urgent"><FaExclamationTriangle /></div>
                    <div>
                        <span className="stat-label">Urgent</span>
                        <h3 className="stat-value">3</h3>
                    </div>
                </div>
            </div>

            <div className="staff-table-wrapper card">
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Customer</th>
                            <th>Service Type</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(book => (
                            <tr key={book.id}>
                                <td className="font-bold">{book.id}</td>
                                <td>{book.customer}</td>
                                <td><span className="role-tag">{book.service}</span></td>
                                <td>{book.date}</td>
                                <td>
                                    <span className={`status-pill ${book.status.toLowerCase()}`}>
                                        {book.status}
                                    </span>
                                </td>
                                <td className="accent-text-primary font-bold">{book.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Booking;