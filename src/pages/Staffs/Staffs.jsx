import React, { useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import styles from './Staffs.module.css'; 
import { fetchHook } from '../../hooks/fetchHook'; 
import { PopupModal } from '../../components/Popup/PopupModal'; 
import { fetchAPI } from '../../utils/fetchAPI';

const Staffs = () => {
    const { data: employees, loading } = fetchHook("https://localhost:7011/api/Employee/getEmployeesDetail");
    const {data : employeeRolesFetch} = fetchHook("https://localhost:7011/api/Employee/getEmployeeRoles");;

    // --- MODAL STATES ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // --- DATA STATE ---
    const [selectedStaff, setSelectedStaff] = useState(null);


    //add state
    const [addName, setAddName] = useState(null);
    const [addPhoneNumber, setAddPhoneNumber] = useState(null);
    const [addEmployeeRole, setAddEmployeeRole] = useState(null);


    //update State
    const [updatedName, setUpdatedName] = useState(null);
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState(null)
    const [updatedRole, setUpdatedRole] = useState(null);

    const employeeRoles = employeeRolesFetch || [];


    //Add Function

    const addNewEmployee = async() => {

        const payload = {
            name : addName,
            phoneNumber : addPhoneNumber,
            employeeRole : addEmployeeRole
        }

        const sendToAPI = await fetchAPI("https://localhost:7011/api/Employee/AddEmployee","POST",payload);
        if(sendToAPI){
            alert("New Employee added successfully");
            window.location.reload();
        }
        else{
            alert("Something went wrong.");
        }
    }


    //Update Function 

    const onSaveChanges = async(e) => {

        e.preventDefault();

        const payload = {
            name: updatedName,
            phoneNumber : updatedPhoneNumber,
            employeeRole : updatedRole || selectedStaff.employeeRole,
        }

        const id = selectedStaff.guidId;

        const isItGood = await fetchAPI(`https://localhost:7011/api/Employee/UpdateEmployee/${id}`,"PATCH",payload);

        if(isItGood){
            alert("Employee details updated successfully");
            window.location.reload()
        }
    }

    //Delete Function

    const deleteFunction = async() => {
        const id = selectedStaff.guidId;

        const deleteEmployee = await fetchAPI(`https://localhost:7011/api/Employee/deleteEmployee/${id}`,"DELETE");
        if(deleteEmployee){
            alert("Employee removed.");
            window.location.reload();
        }
        else{
            alert("Something went wrong.");
        }
    }


    // --- MODAL CONTROL HANDLERS ---
    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const openEditModal = (staff) => {
        setSelectedStaff(staff);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (staff) => {
        setSelectedStaff(staff);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
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
                    <FaUserPlus /> Add New Employee
                </button>
            </header>

            <div className={styles['staff-controls']}>
                <div className={styles['search-box']}>
                    <FaSearch className={styles['search-icon']} />
                    <input type="text" placeholder="Search employee by name or ID..." />
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
                                                <div className={styles['user-details']}>
                                                    <span className={styles['user-name']}>{staff.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Role">
                                            <span className={styles['role-tag']}>{staff.employeeRole}</span>
                                        </td>
                                        <td data-label="PhoneNumber">
                                            <span>{staff.phoneNumber}</span>
                                        </td>
                                        <td data-label="Actions">
                                            <div className="table-btns-flex">
                                                <button 
                                                    className="btn btn-sm btn-primary" 
                                                    onClick={() => openEditModal(staff)}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-warn" 
                                                    onClick={() => openDeleteModal(staff)}
                                                >
                                                    <FaTrash /> Delete
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
                    <input type="text" placeholder="Enter Employee name" onChange={(e) => setAddName(e.target.value)}/>

                    <label>Phone Number</label>
                    <input type="text" placeholder="Enter Phone number" onChange={(e) => setAddPhoneNumber(e.target.value)}/>

                    <label>Role</label>
                    <select  onChange={(e) => setAddEmployeeRole(e.target.value)}>
                        <option value="">Select a role</option>
                        {employeeRoles.length > 0 ? (
                                employeeRoles.map((employeeRoles,index) => (
                                    <option key={index} value={employeeRoles.name || employeeRoles}>
                                        {employeeRoles.name || employeeRoles}
                                    </option>
                                ))
                            ) : (
                            <option disabled>Loading the roles...</option>
                        )}
                    </select>
                    <div className="modal-btns">
                        <button type="button" className="btn btn-dark" onClick={closeModals}>Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={() => addNewEmployee()}>Add Member</button>
                    </div>
                </form>
            </PopupModal>

            {/* EDIT STAFF MODAL */}
            <PopupModal open={isEditModalOpen} onClose={closeModals} title="Edit Staff Member">
                <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                    <label>Full Name</label>
                    <input type="text" defaultValue={selectedStaff?.name} onChange={(e) => setUpdatedName(e.target.value)}/>

                    <label>Phone Number</label>
                    <input type="text" defaultValue={selectedStaff?.phoneNumber} onChange={(e) => setUpdatedPhoneNumber(e.target.value)}/>

                    <label>Role</label>
                    <select defaultValue={selectedStaff?.employeeRole} onChange={(e) => setUpdatedRole(e.target.value)}>
                        {employeeRoles.length > 0 ? (
                                employeeRoles.map((employeeRoles,index) => (
                                    <option key={index} value={employeeRoles.name || employeeRoles}>
                                        {employeeRoles.name || employeeRoles}
                                    </option>
                                ))
                            ) : (
                            <option disabled>Loading the roles...</option>
                        )}
                    </select>
                    <div className="modal-btns">
                        <button type="button" className="btn btn-dark" onClick={closeModals}>Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={(e) => onSaveChanges(e)}>Save Changes</button>
                    </div>
                </form>
            </PopupModal>

            {/* DELETE MODAL */}
            <PopupModal open={isDeleteModalOpen} onClose={closeModals} title="Remove Staff">
                <p>Are you sure you want to remove <b>{selectedStaff?.name}</b> from the team?</p>
                <div className="modal-btns">
                    <button className="btn btn-dark" onClick={closeModals}>Cancel</button>
                    <button className="btn btn-warn" onClick={deleteFunction}>Confirm Delete</button>
                </div>
            </PopupModal>
        </div>
    );
};

export default Staffs;