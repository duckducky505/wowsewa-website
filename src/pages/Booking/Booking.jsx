// pages/Bookings/Bookings.jsx
import React, { useState } from 'react';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { FaCalendarPlus, FaClipboardList, FaCheckCircle, FaHourglassHalf, FaSpinner } from 'react-icons/fa';
import './Booking.css'; 
import Statsbar from "../../components/Statsbar/Statsbar"


const Bookings = () => {
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

  const bookingStats = [
    { 
      number: bookings.length, 
      label: "Total Bookings" 
    },
    { 
      number: "1", 
      label: "In Process" 
    },
    { 
      number: "2", 
      label: "Pending Approval" 
    }
  ];

  return (
    <div className="in-app-container">
      <header className="in-app-header">
        <div>
          <h1 className="text-xl accent-text-white">Service <span className="accent-text-primary">Bookings</span></h1>
          <p className="text-md accent-text-white">Manage and track customer service requests.</p>
        </div>
        <button className="btn btn-primary">
          <FaCalendarPlus /> New Booking
        </button>
      </header>

      <Statsbar stats={bookingStats} bgColor={"bg-light"} numberColor={"accent-text-lime-dark"} />

      <div className="bookings-controls">
        <div className="search-box">
          <MdSearch className="search-icon" size={20} />
          <input type="text" placeholder="Search by ID or Service..." />
        </div>
        <select className="filter-select">
          <option value="">All Services</option>
          <option value="wash">Car Wash</option>
          <option value="detail">Detailing</option>
        </select>
      </div>

      <div className="table-card bg-text-main">
        <table className="table-universal">
          <thead>
            <tr>
              <th>Booking Detail</th>
              <th>Date Booked</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                    <div className="booking-details">
                      <span className="service-name">{booking.service}</span>
                      <span className="booking-id-sub">ID: #{booking.id}</span>
                  </div>
                </td>
                <td>{booking.date}</td>
                <td>
                  <span className={`status-pill ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
                <td className='action-btns'>
                    <button className="btn btn-primary" title="Edit"><MdEdit /></button>
                    <button className="btn btn-dark" onClick={() => handleDelete(booking.id)} title="Delete">
                        <MdDelete />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;