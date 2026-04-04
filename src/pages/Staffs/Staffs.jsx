import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import styles from './Staffs.module.css'; 

const Staffs = () => {
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    useEffect(() => {
        const fetchEmployees = async() => {
            try {
                const response = await fetch("https://localhost:7011/api/Employee/getEmployeesDetail");
                if(!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setEmployees(data);
            } catch(error) {
                console.log(error.message);
            }
        };
        fetchEmployees();
    }, []);

    return (
        <div className={styles['staff-container']}> 
            <header className={styles['staff-header']}>
                <div className={styles['header-left']}>
                    <h1 className="text-xl">Staff <span className="accent-text-primary">Management</span></h1>
                    <p className="text-silver">Manage your team members.</p>
                </div>
                {/* Trigger Modal on Click */}
                <button className={`btn btn-primary ${styles['add-staff-btn']}`} onClick={toggleModal}>
                    <FaUserPlus /> Add New Staff
                </button>
            </header>

            {/* Render the Modal if isModalOpen is true */}
            {isModalOpen && <StaffModal onClose={toggleModal} />}

            <div className={styles['staff-table-wrapper']}>
                <table className={styles['staff-table']}>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((staff) => (
                            <tr key={staff.guidId}>
                                <td>
                                    <div className={styles['user-info']}>
                                        <div className={styles['user-avatar']}>{staff.name?.charAt(0)}</div>
                                        <div className={styles['user-details']}>
                                            <span className={styles['user-name']}>{staff.name}</span>
                                            <span className={styles['user-id']}>ID: #WS-00{staff.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles['action-btns']}>
                                        <button className={`${styles['action-btn']} ${styles.edit}`}><FaEdit /></button>
                                        <button className={`${styles['action-btn']} ${styles.delete}`}><FaTrash /></button>
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

// --- Sub-component for the Popup ---
const StaffModal = ({ onClose }) => {
    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['modal-content']}>
                <div className={styles['modal-header']}>
                    <h2>Add New <span className="accent-text-primary">Staff</span></h2>
                    <button className={styles['close-btn']} onClick={onClose}><FaTimes /></button>
                </div>
                <form className={styles['staff-form']}>
                    <div className={styles['form-group']}>
                        <label>Full Name</label>
                        <input type="text" placeholder="e.g. Rajesh Hamal" required />
                    </div>
                    <div className={styles['form-group']}>
                        <label>Role</label>
                        <select required>
                            <option value="">Select Role</option>
                            <option value="Plumbing">Plumber</option>
                            <option value="Electrical">Electrician</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className={styles['form-group']}>
                        <label>Phone Number</label>
                        <input type="tel" placeholder="98XXXXXXXX" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Save Staff Member</button>
                </form>
            </div>
        </div>
    );
};

export default Staffs;