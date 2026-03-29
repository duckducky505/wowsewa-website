import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaEnvelope, FaPhone } from 'react-icons/fa';
import styles from './Staffs.module.css'; 

const Staffs = () => {
    
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        try{
            const fetchEmployees = async() => {

                const response = await fetch("https://localhost:7011/api/Employee/getEmployeesDetail",{
                    method:"GET",
                    headers: {
                        "Content-type":"application/json"
                    }
                });
                if(!response) throw new Error("Failed to fetch from the api.");
                const data = await response.json();
                setEmployees(data);
            }
        fetchEmployees();
        }
        catch(error){console.log(error.message)}
    },[]);
    

    return (
        <div className={styles['staff-container']}> 
            <header className={styles['staff-header']}>
                <div className={styles['header-left']}>
                    <h1 className="text-xl">Staff <span className="accent-text-primary">Management</span></h1>
                    <p className="text-silver">Manage your team members.</p>
                </div>
                <button className={`btn btn-primary ${styles['add-staff-btn']}`}>
                    <FaUserPlus /> Add New Staff
                </button>
            </header>

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
                                        <div className={styles['user-avatar']}>{staff.name.charAt(0)}</div>
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

export default Staffs;