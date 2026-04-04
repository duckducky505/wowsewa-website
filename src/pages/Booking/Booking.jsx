// pages/Bookings/Bookings.jsx
import React, { useState } from 'react';
import { MdEdit, MdDelete, MdAdd, MdSearch } from 'react-icons/md';
import styles from './Booking.module.css';

const Bookings = () => {
  // Mock data for bookings
  const [bookings, setBookings] = useState([
    { id: "BK-101", service: "Full Car Wash", date: "2024-03-20", status: "Completed" },
    { id: "BK-102", service: "Engine Detailing", date: "2024-03-21", status: "Pending" },
    { id: "BK-103", service: "Interior Cleaning", date: "2024-03-22", status: "Process" },
    { id: "BK-104", service: "Ceramic Coating", date: "2024-03-23", status: "Pending" },
  ]);

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete ${id}?`)) {
      setBookings(bookings.filter(booking => booking.id !== id));
    }
  };

  return (
    <main className={styles.bookingsMain}>
      <div className={styles.headTitle}>
        <div className={styles.left}>
          <h1>Bookings</h1>
          <ul className={styles.breadcrumb}>
            <li><a href="#">Dashboard</a></li>
            <li><span className={styles.divider}>›</span></li>
            <li><a className={styles.activeLink} href="#">Bookings</a></li>
          </ul>
        </div>
        <button className="btn btn-primary">
          <span><MdAdd size={10}/>New Booking</span>
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Booking List</h3>
          <div className={styles.searchBox}>
            <MdSearch size={20} />
            <input type="text" placeholder="Search ID..." />
          </div>
        </div>

        <table className={styles.bookingTable}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Service</th>
              <th>Date Booked</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className={styles.bookingId}>{booking.id}</td>
                <td>{booking.service}</td>
                <td>{booking.date}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} title="Edit">
                      <MdEdit size={18} />
                    </button>
                    <button 
                      className={styles.deleteBtn} 
                      title="Delete"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Bookings;