import React, { useState } from 'react';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { FaCalendarPlus, FaHashtag } from 'react-icons/fa';

import { PopupModal } from '../../components/Popup/PopupModal'; 

import './Booking.css'; 
import Statsbar from "../../components/Statsbar/Statsbar"
import Loader from '../../components/Loader/Loading'; 
import { fetchHook } from '../../hooks/fetchHook';
import { fetchAPI } from '../../utils/fetchAPI'; 

const Bookings = () => {
    const { data: bookings, loading } = fetchHook("https://localhost:7011/api/Booking/getBookings");
    const { data: bookedServiceFor} = fetchHook("https://localhost:7011/api/Booking/getBookedService")
    const { data: bookingStatus} = fetchHook("https://localhost:7011/api/Booking/getBookingStatus")

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [updatebookingStatus, setUpdatedBookingStatus] = useState(null);
    const [updateBookedServiceFor, setUpdatedBookedServiceFor] = useState(null);



    const onOpenEditModal = (item) => {
        setSelectedBooking(item);
        setOpenEdit(true);
    };

    const onOpenDeleteModal = (item) => {
        setSelectedBooking(item);
        setOpenDelete(true);
    };

    const onCloseModals = () => {
        setOpenEdit(false);
        setOpenDelete(false);
        setSelectedBooking(null);
    };

    //Add Function
   

    //Update Function

    const updateBookingChanges = async () => {

        const payload = {
            bookingStatus : updatebookingStatus || selectedBooking.bookingStatus,
            bookedServiceFor : updateBookedServiceFor || selectedBooking.bookedServiceFor
        }

        const id = selectedBooking?.bookingId;

        const callFetchAPI = await fetchAPI(`https://localhost:7011/api/Booking/updateBookingDetails/${id}`, "PATCH",payload);
        if(callFetchAPI) {
            alert("Booking updated successfully");
            window.location.reload();
        }
    }


    //Delete Function

     const handleDeleteConfirm = async () => {
        const id = selectedBooking?.bookingId || selectedBooking?.id;
        const success = await fetchAPI(`https://localhost:7011/api/Booking/delete/${id}`, "DELETE");
        if (success) {
            alert("Booking deleted successfully!");
            onCloseModals();
        }
    };



    if (loading) return <div className="in-app-container"><Loader /></div>;

    const safeBookings = bookings || [];

    const bookingStats = [
        { number: safeBookings.length, label: "Total Bookings" },
        { number: "1", label: "In Process" },
        { number: "2", label: "Pending Approval" }
    ];

    return (
        <div className="in-app-container">
            <header className="in-app-header">
                <div className="header-text">
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
                    <input type="text" placeholder="Search by Code, Customer or Service..." />
                </div>
                <div className="filter-group">
                    <select className="filter-select">
                        <option value="">All Services</option>
                        <option value="wash">Car Wash</option>
                        <option value="detail">Detailing</option>
                    </select>
                </div>
            </div>

            <div className="table-card bg-text-main">
                <table className="table-universal">
                    <thead>
                        <tr>
                            <th>Booking Code</th>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Date Booked</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {safeBookings.length > 0 ? (
                            safeBookings.map((item) => (
                                <tr key={item.bookingId || item.id}>
                                    <td data-label="Code">
                                        <div className="booking-code-wrapper">
                                            <span className="code-badge">
                                                <FaHashtag size={10} /> {item.bookingCode || item.bookingId}
                                            </span>
                                        </div>
                                    </td>
                                    <td data-label="Customer">
                                        <span className="customer-name">{item.user?.name || 'Walk-in'}</span>
                                    </td>
                                    <td data-label="Service">
                                        <div className="booking-details">
                                            <span className="service-name">{item.bookedServiceFor}</span>
                                        </div>
                                    </td>
                                    <td data-label="Date">
                                        {item.createdDate || 'Pending'}
                                    </td>
                                    <td data-label="Status">
                                        <span className={`status-pill ${(item.bookingStatus || "N/A").toLowerCase()}`}>
                                            {item.bookingStatus}
                                        </span>
                                    </td>
                                    <td data-label="Actions">
                                        <div className='table-btns-flex'>
                                            <button className="btn btn-primary btn-sm" onClick={() => onOpenEditModal(item)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-warn btn-sm" onClick={() => onOpenDeleteModal(item)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <PopupModal open={openDelete} onClose={onCloseModals} title="Confirm Delete" >
                <p>Are you sure you want to delete booking <b>{selectedBooking?.bookingCode || selectedBooking?.bookingId}</b>?</p>
                <div className="modal-btns">
                    <button className="btn btn-dark" onClick={onCloseModals}>Cancel</button>
                    <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete anyway</button>
                </div>
            </PopupModal>

            <PopupModal 
                open={openEdit} 
                onClose={onCloseModals} 
                title="Edit Booking">
                <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                    <label>Customer Name</label>
                    <input type="text" defaultValue={selectedBooking?.user?.name} disabled />
                    
                    <label>Service</label>
                    <select defaultValue={selectedBooking?.bookedServiceFor} onChange={(e) => setUpdatedBookedServiceFor(e.target.value)}>
                        {bookedServiceFor.length > 0 ? (
                                bookedServiceFor.map((bookedServiceFor,index) => (
                                    <option key={index} value={bookedServiceFor.name || bookedServiceFor}>
                                        {bookedServiceFor.name || bookedServiceFor}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading services...</option>
                        )}
                    </select>
                    
                    <label>Status</label>
                    <select defaultValue={selectedBooking?.bookingStatus} onChange={(e) => setUpdatedBookingStatus(e.target.value)}>
                        {bookingStatus.length > 0 ? (
                                bookingStatus.map((bookingStatus,index) => (
                                    <option key={index} value={bookingStatus.name || bookingStatus}>
                                        {bookingStatus.name || bookingStatus}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading roles...</option>
                        )}
                    </select>

                    <div className="modal-btns">
                        <button type="button" className="btn btn-dark" onClick={onCloseModals}>Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={updateBookingChanges}>Save Changes</button>
                    </div>
                </form>
            </PopupModal>
        </div>
    );
};

export default Bookings;