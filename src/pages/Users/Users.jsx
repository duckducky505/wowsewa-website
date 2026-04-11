import React, { useMemo, useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import styles from '../Staffs/Staffs.module.css'; 
import Loader from '../../components/Loader/Loading';
import { fetchHook } from '../../hooks/fetchHook';
import { PopupModal } from '../../components/Popup/PopupModal'; 
import { fetchAPI } from '../../utils/fetchAPI';

const Users = () => {
    const { data: usersData, loading } = fetchHook("https://localhost:7011/api/User/getUsersDetail");
    const users = usersData || [];

    const { data: rolesData } = fetchHook("https://localhost:7011/api/User/getUsersRoles");
    const roles = rolesData || [];

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


    const [addName, setAddName] = useState("");
    const [addUserName, setAddUserName] = useState("");
    const [addPassword, setAddPassword] = useState("");
    const [addRole, setAddRole] = useState(null);


    const [updateName, setUpdateName] = useState("");
    const [updateUserName, setUpdateUserName] = useState("");
    const [updateRole, setUpdateRole] = useState(null);

    
    // --- POPUP STATES ---
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false); 
    const [selectedUser, setSelectedUser] = useState(null);

    // --- HANDLERS ---
    const openAddModal = () => {
        setIsAddOpen(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditOpen(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const closeModals = () => {
        setIsAddOpen(false);
        setIsDeleteOpen(false);
        setIsEditOpen(false); 
        setSelectedUser(null);
    };

    //Add Function
    const addUserFunc = async(e) => {
        e.preventDefault();

        const payload = {
            Name: addName,
            Username: addUserName,
            Password: addPassword,
            Role: addRole 
        }
        const addUserSuccessfull = await fetchAPI("https://localhost:7011/api/User/addUser","POST",payload);

        if(addUserSuccessfull) {
            alert("User added successfully.");
            window.location.reload();
        }
    }


    //updateFunction
    const updateChanges = async (e) => {
        e.preventDefault();
        if(!selectedUser) return;

        const payload = {
            Name: updateName || selectedUser.name,
            Username: updateUserName || selectedUser.username,
            Role: updateRole || selectedUser.role,
        }

        const callUpdateAPI = await fetchAPI(`https://localhost:7011/api/User/UpdateUserDetails/${selectedUser.guidId}`,"PATCH",payload);

        if(callUpdateAPI) 
        {
            alert("Details updated");
            window.location.reload();
        }
        else{
            alert("Something went wrong. Please try again.");
        }
        closeModals();
    }


    //Delete Func
    const onDeleteConfirmation = async () => {
        if (!selectedUser) return;
        
        const result = await fetchAPI(
            `https://localhost:7011/api/User/delete/User/${selectedUser.guidId}`, "DELETE"
        );

        if (result) {
            alert("User deleted successfully");
            window.location.reload(); 
        }
        else{
            alert("Something went wrong. Please try again.");
        }
        closeModals();
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
                <button className="btn btn-primary" onClick={openAddModal}>
                    <FaUserPlus /> Add User
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
                                        <td data-label="Username">{user.username || 'N/A'}</td>
                                        <td data-label="Role">{user.role}</td>
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

            {/* ADD POPUP */}
            <PopupModal open={isAddOpen} onClose={closeModals} title="Add New User">
                <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter full name" onChange={(e) => setAddName(e.target.value)}/>

                    <label>Username</label>
                    <input type="text" placeholder="Enter username" onChange={(e) => setAddUserName(e.target.value)}/>
                    
                    <label>Password</label>
                    <input type="password" placeholder="Create password" onChange={(e) => setAddPassword(e.target.value)}/>
                    

                    <label>Role</label>
                    <select onChange={(e) => setAddRole(e.target.value)}>
                        <option value="">Select a role</option>
                        {roles.length > 0 ? (
                            roles.map((role, index) => (
                                <option key={index} value={role.roleName || role}>
                                    {role.roleName || role}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading the roles...</option>
                        )}
                    </select>
                    <div className="modal-btns" style={{marginTop: '20px'}}>
                        <button type="button" className="btn btn-dark" onClick={closeModals}>Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={(e) => addUserFunc(e)}>Add User</button>
                    </div>
                </form>
            </PopupModal>

            {/* EDIT MODAL */}
            <PopupModal 
                open={isEditOpen} 
                onClose={closeModals} 
                title="Edit User"
            >
                <div className="modal-form-content">
                    <p>Edit details for <b>{selectedUser?.name}</b></p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <label>User's Name</label>
                        <input type="text" defaultValue={selectedUser?.name} onChange={(e) => setUpdateName(e.target.value)}/>

                        <label>UserName</label>
                        <input type="text" defaultValue={selectedUser?.username} onChange={(e) => setUpdateUserName(e.target.value)}/>

                        <label>Role</label>
                        <select defaultValue={selectedUser?.role} onChange={(e) => setUpdateRole(e.target.value)}>
                            {roles.length > 0 ? (
                                roles.map((role, index) => (
                                    <option key={index} value={role.roleName || role}>
                                        {role.roleName || role}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading roles...</option>
                            )}
                        </select>

                        <div className="modal-btns" style={{marginTop: '20px'}}>
                            <button type="button" className="btn btn-dark" onClick={closeModals}>Cancel</button>
                            <button type="submit" className="btn btn-primary" onClick={(e) => updateChanges(e)}>Save Changes</button>
                        </div>
                    </form>
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
                    <button className="btn btn-danger" onClick={() => onDeleteConfirmation()}>Confirm Delete</button>
                </div>
            </PopupModal>
        </div>
    );
};

export default Users;