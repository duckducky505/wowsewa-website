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
        <div className="in-app-container"> 
            <header className={styles['staff-header']}>
                <div className={styles['header-left']}>
                    <h1 className="text-xl accent-text-white">Staff <span className="accent-text-primary">Management</span></h1>
                    <p className="text-md accent-text-white">Manage your team members.</p>
                </div>
                {/* Trigger Modal on Click */}
                <button className="btn btn-primary" onClick={toggleModal}>
                    <FaUserPlus /> Add New Staff
                </button>
            </header>

            {/* Render the Modal if isModalOpen is true */}
            {isModalOpen && <StaffModal onClose={toggleModal} />}

            <div className="table-card bg-text-main">
                <table className="table-universal">
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
                                        <div className={styles['user-details']}>
                                            <span className={styles['user-name']}>{staff.name}</span>
                                            <span className={styles['user-id']}>ID: #WS-00{staff.id}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className='action-btns'>
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


export default Staffs;