import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaUserCircle } from 'react-icons/fa';
import styles from '../Staffs/Staffs.module.css'; 
import Loader from '../../components/Loader/Loading';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch("https://localhost:7011/api/User/getUsersDetail", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    return (
        <div className={styles['staff-container']}>
            <header className={styles['staff-header']}>
                <div className={styles['header-left']}>
                    <h1 className="text-xl">Platform <span className="accent-text-primary">Users</span></h1>
                    <p className="text-silver">Manage registered customers and their account status.</p>
                </div>
                <button className={`btn btn-primary ${styles['add-staff-btn']}`}>
                    <FaUserPlus /> Add Customer
                </button>
            </header>

            <div className={`${styles['staff-controls']} ${styles.card}`}>
                <div className={styles['search-box']}>
                    <FaSearch className={styles['search-icon']} />
                    <input type="text" placeholder="Search by name, email or location..." />
                </div>
            </div>

            <div className={`${styles['staff-table-wrapper']} ${styles.card}`}>
                {loading ? <Loader /> : (
                    <table className={styles['staff-table']}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Location</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.guidId}>
                                    <td>
                                        <div className={styles['user-info']}>
                                            <div className={styles['user-avatar']}><FaUserCircle /></div>
                                            <div className={styles['user-details']}>
                                                <span className={styles['user-name']}>{user.name}</span>
                                                <span className={styles['user-id']}>{user.username}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.location || 'N/A'}</td>
                                    <td>{user.joinedDate || '2026-03'}</td>
                                    <td>
                                        <div className={styles['action-btns']}>
                                            <button className={`${styles['action-btn']} ${styles.edit}`} title="Edit User"><FaEdit /></button>
                                            <button className={`${styles['action-btn']} ${styles.delete}`} title="Delete User"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Users;