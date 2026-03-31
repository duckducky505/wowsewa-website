import React from 'react';
import { FaCalendarPlus, FaCheckCircle, FaClock, FaExclamationTriangle, FaEllipsisV } from 'react-icons/fa';
import styles from './Booking.module.css';

// Pass 'admin' or 'customer' as a prop
const Booking = ({ userRole = 'admin' }) => {
    const isAdmin = userRole === 'admin';

    // Mock data - In reality, you'd filter this by UserID if !isAdmin
    const bookings = [
        { id: 'BK-7701', customer: 'Sita Rai', service: 'AC Repair', date: 'March 28, 2026', status: 'Pending', total: 'Rs. 1,500' },
        { id: 'BK-7702', customer: 'Ram Thapa', service: 'Full Plumbing', date: 'March 27, 2026', status: 'Confirmed', total: 'Rs. 4,500' },
        { id: 'BK-7703', customer: 'Gopal KC', service: 'Electric Wiring', date: 'March 27, 2026', status: 'Completed', total: 'Rs. 2,200' },
    ];

    return (
        <div className="container-after-login-large">
            <header className={styles['booking-header']}>
                <div>
                    <h1 className="text-xl">
                        {isAdmin ? 'Booking' : 'My'} <span className="accent-text-lime-dark">Overview</span>
                    </h1>
                    <p className="text-sm text-silver">
                        {isAdmin 
                            ? 'Monitor and manage real-time service requests for WowSewa.' 
                            : 'View and track your requested services and history.'}
                    </p>
                </div>
                
                {/* Only Customers see the "New Booking" button */}
                {!isAdmin && (
                    <button className='btn btn-primary'>
                        <FaCalendarPlus /> New Booking
                    </button>
                )}
            </header>

            <div className={styles['stats-grid']}>
                <StatCard icon={<FaClock />} label={isAdmin ? "Awaiting Approval" : "Pending Services"} value="12" color="pending" />
                <StatCard icon={<FaCheckCircle />} label={isAdmin ? "Active Sessions" : "In Progress"} value="08" color="confirmed" />
                {isAdmin && <StatCard icon={<FaExclamationTriangle />} label="Urgent Alerts" value="03" color="urgent" />}
            </div>

            <div className={styles['table-card']}>
                <div className={styles['table-responsive']}>
                    <table className={styles['booking-table']}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                {isAdmin && <th>Customer</th>} {/* Hide customer name from the customer themselves */}
                                <th>Service</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>{isAdmin ? 'Revenue' : 'Amount'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((book) => (
                                <tr key={book.id}>
                                    <td className={styles['id-cell']}>{book.id}</td>
                                    {isAdmin && <td className={styles['customer-name']}>{book.customer}</td>}
                                    <td><span className={styles['service-tag']}>{book.service}</span></td>
                                    <td className="text-silver">{book.date}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[book.status.toLowerCase()]}`}>
                                            {book.status}
                                        </span>
                                    </td>
                                    <td className="accent-text-lime-dark font-bold">{book.total}</td>
                                    <td>
                                        <button className={styles['action-dots']}>
                                            <FaEllipsisV />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles['table-footer']}>
                    <button className="btn btn-dark btn-block">
                        {isAdmin ? 'View All Historical Data' : 'Download My History'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={styles['stat-card']}>
        <div className={`${styles['icon-wrapper']} ${styles[color]}`}>{icon}</div>
        <div>
            <p className={styles['stat-label']}>{label}</p>
            <h3 className={styles['stat-value']}>{value}</h3>
        </div>
    </div>
);

export default Booking;