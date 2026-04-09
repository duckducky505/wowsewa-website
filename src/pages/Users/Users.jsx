import React, { useMemo, useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import styles from '../Staffs/Staffs.module.css'; 
import Loader from '../../components/Loader/Loading';
import { fetchHook } from '../../hooks/fetchHook';
import { PopupModal } from '../../components/Popup/PopupModal'; // Import your reusable modal

const Users = () => {
    const { data: users, loading } = fetchHook("https://localhost:7011/api/User/getUsersDetail");

    const [searchKeyword, setSearchKeyword] = useState("");

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        
        const lowerSearchKeyword = searchKeyword.toLowerCase();
        
        return users.filter((user) => 
            user.name?.toLowerCase().includes(lowerSearchKeyword) || 
            user.username?.toLowerCase().includes(lowerSearchKeyword) || 
            user.role?.toLowerCase().includes(lowerSearchKeyword)
        );
    }, [users, searchKeyword]);

    // --- POPUP STATES ---
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false); 
    const [selectedUser, setSelectedUser] = useState(null);

    // --- HANDLERS ---
    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditOpen(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const closeModals = () => {
        setIsDeleteOpen(false);
        setIsEditOpen(false); 
        setSelectedUser(null);
    };

    return (
        <div className='in-app-container'>
            <header className={styles['staff-header']}>
                <div className={styles['header-left']}>
                    <h1 className="text-xl accent-text-white">
                        Platform <span className="accent-text-primary">Users</span>
                    </h1>
                    <p className="text-md accent-text-white">
                        Manage registered customers and their account status.
                    </p>
                </div>
                <button className="btn btn-primary">
                    <FaUserPlus /> Add Customer
                </button>
            </header>

            <div className={`${styles['staff-controls']}`}>
                <div className={styles['search-box']}>
                    <FaSearch className={styles['search-icon']} />
                    <input 
                        type="text" 
                        placeholder="Search by name, username or role..." 
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-card bg-text-main">
                {loading ? (
                    <div style={{ padding: '2rem' }}><Loader /></div>
                ) : (
                    <table className='table-universal'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers && filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.guidId || user.id}>
                                        <td data-label="User">
                                            <div className={styles['user-details']}>
                                                <span className={styles['user-name']}>{user.name}</span>
                                                <span className={styles['user-id']}>{user.username}</span>
                                            </div>
                                        </td>
                                        <td data-label="Location">{user.username || 'N/A'}</td>
                                        <td data-label="Joined">{user.role}</td>
                                        <td data-label="Actions">
                                            <div className='table-btns-flex'>
                                                <button 
                                                    className="btn btn-primary btn-sm" 
                                                    title="Edit User"
                                                    onClick={() => openEditModal(user)}
                                                >
                                                    <FaEdit/> Edit
                                                </button>
                                                <button 
                                                    className="btn btn-warn btn-sm" 
                                                    title="Delete User"
                                                    onClick={() => openDeleteModal(user)}
                                                >
                                                    <FaTrash/> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center" style={{ padding: '2rem' }}>
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* EDIT MODAL */}
            <PopupModal 
                open={isEditOpen} 
                onClose={closeModals} 
                title="Edit User"
            >
                <div className="modal-form-content">
                    <p>Edit details for <b>{selectedUser?.name}</b></p>
                    
                    <div className="modal-btns" style={{marginTop: '20px'}}>
                        <button className="btn btn-dark" onClick={closeModals}>Cancel</button>
                        <button className="btn btn-primary">Save Changes</button>
                    </div>
                </div>
            </PopupModal>

            {/* DELETE CONFIRMATION MODAL */}
            <PopupModal 
                open={isDeleteOpen} 
                onClose={closeModals} 
                title="Delete User"
            >
                <p>Are you sure you want to remove <b>{selectedUser?.name}</b>?</p>
                <p className="text-sm" style={{ color: '#ff4d4d', marginTop: '10px' }}>
                    This action cannot be undone.
                </p>
                <div className="modal-btns">
                    <button className="btn btn-dark" onClick={closeModals}>Cancel</button>
                    <button className="btn btn-danger">Confirm Delete</button>
                </div>
            </PopupModal>
        </div>
    );
};

export default Users;