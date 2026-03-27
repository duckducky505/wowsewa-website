import React, { useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaEnvelope, FaPhone } from 'react-icons/fa';
import './Staffs.css';

const Staffs = () => {
    // Dummy Data
    const [employees, setEmployees] = useState([
        { id: 1, name: 'Jiwan Joshi', role: 'Head Technician', email: 'jiwan@wowsewa.com', phone: '9841XXXXXX', status: 'Active' },
        { id: 2, name: 'Anish Sharma', role: 'Full-Stack Developer', email: 'anish@wowsewa.com', phone: '9810XXXXXX', status: 'On Leave' },
        { id: 3, name: 'Sita Thapa', role: 'Manager', email: 'sita@wowsewa.com', phone: '9801XXXXXX', status: 'Active' },
        { id: 4, name: 'Kiran KC', role: 'Technician', email: 'kiran@wowsewa.com', phone: '9860XXXXXX', status: 'Active' },
    ]);

    return (
        <>
            <div className="staff-container">
                <header className="staff-header">
                    <div className="header-left">
                        <h1 className="text-xl">Staff <span className="accent-text-primary">Management</span></h1>
                        <p className="text-silver">Manage your team members and their access levels.</p>
                    </div>
                    <button className="btn btn-primary add-staff-btn">
                        <FaUserPlus /> Add New Staff
                    </button>
                </header>

                {/* Stats Overview */}
                <div className="staff-stats">
                    <div className="stat-item card">
                        <span className="stat-label">Total Employees</span>
                        <h3 className="stat-value">{employees.length}</h3>
                    </div>
                    <div className="stat-item card">
                        <span className="stat-label">Active Now</span>
                        <h3 className="stat-value accent-text-primary">3</h3>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="staff-controls card">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search by name, role or email..." />
                    </div>
                    <select className="filter-select">
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="technician">Technician</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>

                {/* Staff Table */}
                <div className="staff-table-wrapper card">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Role</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((staff) => (
                                <tr key={staff.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">{staff.name.charAt(0)}</div>
                                            <div className="user-details">
                                                <span className="user-name">{staff.name}</span>
                                                <span className="user-id">ID: #WS-00{staff.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="role-tag">{staff.role}</span></td>
                                    <td>
                                        <div className="contact-info">
                                            <span><FaEnvelope /> {staff.email}</span>
                                            <span><FaPhone /> {staff.phone}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${staff.status.toLowerCase().replace(' ', '-')}`}>
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn edit" title="Update"><FaEdit /></button>
                                            <button className="action-btn delete" title="Delete"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Staffs;