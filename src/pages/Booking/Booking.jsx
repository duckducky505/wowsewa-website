import React from 'react';
import { FaCalendarPlus, FaCheckCircle, FaClock, FaExclamationTriangle, FaEllipsisV } from 'react-icons/fa';
import styles from './Booking.module.css';

const Booking = () => {
    const bookings = [
        { id: 'BK-7701', customer: 'Sita Rai', service: 'AC Repair', date: 'March 28, 2026', status: 'Pending', total: 'Rs. 1,500' },
        { id: 'BK-7702', customer: 'Ram Thapa', service: 'Full Plumbing', date: 'March 27, 2026', status: 'Confirmed', total: 'Rs. 4,500' },
        { id: 'BK-7703', customer: 'Gopal KC', service: 'Electric Wiring', date: 'March 27, 2026', status: 'Completed', total: 'Rs. 2,200' },
    ];

    return (
        /* The container class from your App.css ensures it stays centered/padded correctly next to the sidebar */
        <div className={`container-dashboard ${styles['booking-page-wrapper']}`}>
            {/* Header Section */}
            <header className={styles['booking-header']}>
                <div>
                    <h1 className="text-xl">Booking <span className="accent-text-lime-dark">Overview</span></h1>
                    <p className="text-sm text-silver">Monitor and manage real-time service requests for WowSewa.</p>
                </div>
                <button className='btn btn-primary'>
                    <FaCalendarPlus /> New Booking
                </button>
            </header>

            {/* Stats Grid */}
            <div className={styles['stats-grid']}>
                <StatCard icon={<FaClock />} label="Awaiting Approval" value="12" color="pending" />
                <StatCard icon={<FaCheckCircle />} label="Active Sessions" value="08" color="confirmed" />
                <StatCard icon={<FaExclamationTriangle />} label="Urgent Alerts" value="03" color="urgent" />
            </div>

            {/* Data Table Section */}
            <div className={styles['table-card']}>
                <div className={styles['table-responsive']}>
                    <table className={styles['booking-table']}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Revenue</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((book) => (
                                <tr key={book.id}>
                                    <td className={styles['id-cell']}>{book.id}</td>
                                    <td className={styles['customer-name']}>{book.customer}</td>
                                    <td>
                                        <span className={styles['service-tag']}>{book.service}</span>
                                    </td>
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
                    <button className="btn btn-dark btn-block">View All Historical Data</button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={styles['stat-card']}>
        <div className={`${styles['icon-wrapper']} ${styles[color]}`}>
            {icon}
        </div>
        <div>
            <p className={styles['stat-label']}>{label}</p>
            <h3 className={styles['stat-value']}>{value}</h3>
        </div>
    </div>
);

export default Booking;