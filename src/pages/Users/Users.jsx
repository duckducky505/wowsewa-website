import React from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaUserCircle } from 'react-icons/fa';
import '../Staffs/Staffs.css'; 

const Users = () => {
    const customers = [
        { id: 1, name: 'Arun Verma', email: 'arun@gmail.com', location: 'Kathmandu', joined: 'Jan 2026' },
        { id: 2, name: 'Maya Tamang', email: 'maya.t@outlook.com', location: 'Lalitpur', joined: 'Feb 2026' },
    ];

    return (
        <div className="staff-container">
            <header className="staff-header">
                <div className="header-left">
                    <h1 className="text-xl">Platform <span className="accent-text-primary">Users</span></h1>
                    <p className="text-silver">Manage registered customers and their account status.</p>
                </div>
                <button className="btn btn-primary add-staff-btn">
                    <FaUserPlus /> Add Customer
                </button>
            </header>

            <div className="staff-controls card">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Search by name, email or location..." />
                </div>
            </div>

            <div className="staff-table-wrapper card">
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Location</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar"><FaUserCircle /></div>
                                        <div className="user-details">
                                            <span className="user-name">{user.name}</span>
                                            <span className="user-id">{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{user.location}</td>
                                <td>{user.joined}</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn edit" title="Edit User"><FaEdit /></button>
                                        <button className="action-btn delete" title="Delete User"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;