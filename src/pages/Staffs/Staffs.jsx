import React, { useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import styles from './Staffs.module.css'; 
import { fetchHook } from '../../hooks/fetchHook'; 
import { PopupModal } from '../../components/Popup/PopupModal'; // Reusable modal

const Staffs = () => {
    const { data: employees, loading } = fetchHook("https://localhost:7011/api/Employee/getEmployeesDetail");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const openAddModal = () => setIsAddModalOpen(true);
    const openDeleteModal = (staff) => {
        setSelectedStaff(staff);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsAddModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedStaff(null);
    };

    return ( 
        <div className="in-app-container"> 
            <header className={styles['staff-header']}>
                <div className={styles['header-left']}>
                    <h1 className="text-xl accent-text-white">
                        Staff <span className="accent-text-primary">Management</span>
                    </h1>
                    <p className="text-md accent-text-white">Manage your team members and roles.</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <FaUserPlus /> Add New Staff
                </button>
            </header>

            {/* NEW: Search and Filters */}
            <div className={styles['staff-controls']}>
                <div className={styles['search-box']}>
                    <FaSearch className={styles['search-icon']} />
                    <input type="text" placeholder="Search staff by name or ID..." />
                </div>
                <select className={styles['filter-select']}>
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                </select>
            </div>

            <div className="table-card bg-text-main">
                {loading ? (
                    <div className="p-4">Loading staff list...</div>
                ) : (
                    <table className="table-universal">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Role</th>
                                <th>Phone Number</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees && employees.length > 0 ? (
                                employees.map((staff) => (
                                    <tr key={staff.guidId || staff.id}>
                                        <td data-label="Employee">
                                            <div className={styles['user-info']}>
                                                <div className={styles['user-avatar']}>
                                                    {staff.name.charAt(0)}
                                                </div>
                                                <div className={styles['user-details']}>
                                                    <span className={styles['user-name']}>{staff.name}</span>
                                                    <span className={styles['user-id']}>#WS-00{staff.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Role">
                                            <span className={styles['role-tag']}>{staff.employeeRole}</span>
                                        </td>
                                        <td data-label="PhoneNumber">
                                            <span>
                                                {staff.phoneNumber}
                                            </span>
                                        </td>
                                        <td data-label="Actions">
                                            <div className="table-btns-flex">
                                                <button className="btn btn-sm btn-primary" title="Edit">
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-warn" 
                                                    onClick={() => openDeleteModal(staff)}
                                                    title="Delete"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No staff found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ADD STAFF MODAL */}
            <PopupModal open={isAddModalOpen} onClose={closeModals} title="Add New Staff">
                <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter staff name" />
                    <label>Role</label>
                    <select>
                        <option>Staff</option>
                        <option>Manager</option>
                        <option>Admin</option>
                    </select>
                    <div>
                        <button type="button" className="btn btn-dark" onClick={closeModals}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Member</button>
                    </div>
                </form>
            </PopupModal>

            {/* DELETE MODAL */}
            <PopupModal open={isDeleteModalOpen} onClose={closeModals} title="Remove Staff">
                <p>Are you sure you want to remove <b>{selectedStaff?.name}</b> from the team?</p>
                <div className="modal-btns">
                    <button className="btn btn-dark" onClick={closeModals}>Cancel</button>
                    <button className="btn btn-warn">Confirm Delete</button>
                </div>
            </PopupModal>
        </div>
    );
};

export default Staffs;