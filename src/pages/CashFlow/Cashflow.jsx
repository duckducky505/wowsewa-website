  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { MdArrowBack, MdFileDownload, MdAdd } from 'react-icons/md';
  import { FaEdit, FaTrash } from 'react-icons/fa';
  import { PopupModal } from '../../components/Popup/PopupModal';
  import { fetchHook } from '../../hooks/fetchHook';
  import { fetchAPI } from '../../utils/fetchAPI';

  const blankForm = {
    createdDate: '',
    jobCategory: '',
    clientName: '',
    employeeName: '',
    cashType: 'Income',
    paymentMethod: 'Cash',
    cashIn: '',
    cashOut: '',
    description: '',
  };

  const CashFlowForm = ({ onSubmit, submitLabel, form, onField, closeAll, jobsData, cashTypes, paymentMethods, employeesData }) => (
    <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
      <label>Date</label>
      <input type="date" name="createdDate" value={form.createdDate} onChange={onField} required />

      <label>Job Category</label>
      <select name="jobCategory" value={form.jobCategory} onChange={onField}>
        <option value="">-- Select Category --</option>
        {jobsData?.map((job) => (
          <option key={job.jobId} value={job.jobId}>{job.jobName}</option>
        ))}
      </select>

      <label>Client Name</label>
      <input type="text" name="clientName" placeholder="e.g. Ramesh Sharma" value={form.clientName} onChange={onField} />

      <label>Employee Assignee</label>
      <select name="employeeName" value={form.employeeName} onChange={onField}>
        <option value="">-- Select Employee --</option>
        {employeesData?.map((emp, index) => (
          <option key={emp.guidId} value={emp.guidId}>
            {emp.name}
          </option>
        ))}
      </select>

      <label>Cash Type</label>
      <select name="cashType" value={form.cashType} onChange={onField}>
        {cashTypes?.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <label>Payment Method</label>
      <select name="paymentMethod" value={form.paymentMethod} onChange={onField}>
        {paymentMethods?.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      <label>Cash In (Rs.)</label>
      <input type="number" name="cashIn" placeholder="0" value={form.cashIn} onChange={onField} min="0" />

      <label>Cash Out (Rs.)</label>
      <input type="number" name="cashOut" placeholder="0" value={form.cashOut} onChange={onField} min="0" />

      <label>Description</label>
      <textarea name="description" rows="3" placeholder="Short note about the transaction" value={form.description} onChange={onField} />

      <div className="modal-btns">
        <button type="button" className="btn btn-dark" onClick={closeAll}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={onSubmit}>{submitLabel}</button>
      </div>
    </form>
  );

  const CashFlow = () => {
    const navigate = useNavigate();

    const {data : cashFlowData} = fetchHook("https://localhost:7011/api/CashFlow/get/allCashFlowData");
    const {data : jobsData} = fetchHook("https://localhost:7011/api/Jobs/getAllJobs");
    const {data : employeesData} = fetchHook("https://localhost:7011/api/Employee/getEmployeesDetail");
    const {data : cashType} = fetchHook("https://localhost:7011/api/Categories/get/Cash-Type-Values");
    const {data : paymentMethod} = fetchHook("https://localhost:7011/api/Categories/get/Payment-Method-Values");



    /* Modal Design Trigger States */
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(blankForm);

    const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const openAdd = () => { 
      setForm(blankForm); 
      setIsAddOpen(true); 
    };
    
    const openEdit = (entry) => {
      setSelected(entry);
      setForm({
        createdDate: entry.createdDate || '',
        jobCategory: entry.jobCategory?.jobId || entry.jobCategory || '',
        clientName: entry.clientName || '',
        employeeName: entry.employee?.name || '',
        cashType: entry.cashType ,
        paymentMethod: entry.paymentMethod ,
        cashIn: entry.cashIn ?? '',
        cashOut: entry.cashOut ?? '',
        description: entry.description || '',
      });
      setIsEditOpen(true);
    };
    
    const openDelete = (entry) => { 
      setSelected(entry); 
      setIsDeleteOpen(true); 
    };
    
    const closeAll = () => {
      setIsAddOpen(false); 
      setIsEditOpen(false); 
      setIsDeleteOpen(false);
      setSelected(null); 
      setForm(blankForm);
    };

    //Functions
    const addFunc = async () => {

      const payload = {
          createdDate: form.createdDate, 
          jobId: parseInt(form.jobCategory), 
          clientName: form.clientName,
          cashType: form.cashType,
          description: form.description || "",
          cashIn: parseFloat(form.cashIn) || 0,
          cashOut: parseFloat(form.cashOut) || 0,
          paymentMethod: form.paymentMethod,
          employeeId: form.employeeName 
      };

      const res = await fetchAPI("https://localhost:7011/api/CashFlow/add/CashFlowData", "POST", payload);
      if(res){
        window.alert("New CashFlow Data has been added successfully.")
        window.location.reload();
      }
      else 
        window.alert("Some error occured. Please try again later.");
    }


    const deleteFunc = async () => {

      if (!selected) return;

      const res = await fetchAPI(`https://localhost:7011/api/CashFlow/delete/${selected.id}`, "DELETE");
      if(res) {
        window.alert("Data deleted successfully.");
        window.location.reload();
      }
      else window.alert("Data deleted successfully.");
    }


    const editFunc = async () => {

      if (!selected) return;

      const patchPayload = [];
      
      const fields = [
      { key: 'createdDate', path: '/createdDate', type: 'string' },
      { key: 'jobCategory', path: '/jobId', type: 'int' },
      { key: 'clientName', path: '/clientName', type: 'string' },
      { key: 'cashType', path: '/cashType', type: 'string' },
      { key: 'description', path: '/description', type: 'string' },
      { key: 'cashIn', path: '/cashIn', type: 'float' },
      { key: 'cashOut', path: '/cashOut', type: 'float' },
      { key: 'paymentMethod', path: '/paymentMethod', type: 'string' },
      { key: 'employeeName', path: '/employeeId', type: 'nullableString' },
    ];

    fields.forEach(({key, path, type}) => {
      let currentValue = form[key];
      let originalValue = selected[key];

      if(key === 'jobCategory'){
        originalValue = selected.jobCategory?.jobId;
      } 
      else if(key === 'employeeName'){
        originalValue = selected.employee?.guidId;
      }

      if (type === 'int') {
        currentValue = parseInt(currentValue) || 0;
        originalValue = parseInt(originalValue) || 0;
      } else if (type === 'float') {
        currentValue = parseFloat(currentValue) || 0;
        originalValue = parseFloat(originalValue) || 0;
      } else if (type === 'nullableString') {
        currentValue = currentValue || null;
        originalValue = originalValue || null;
      } else {
        currentValue = currentValue || '';
        originalValue = originalValue || '';
      }
      if (currentValue !== originalValue) {
        patchPayload.push({
          op: "replace",
          path: path,
          value: currentValue
        });
      }
    });

    if (patchPayload.length === 0) {
      window.alert("No changes detected.");
      closeAll();
      return;
    }

      const res = await fetchAPI(`https://localhost:7011/api/CashFlow/update/${selected.id}`,"PATCH", patchPayload);
      if(res){
        window.alert("Data updated successfully.");
        window.location.reload();
      }
      else{
        window.alert("Some error occured. Please try again.");
      }
    }

  //table
    return (
      <div className="in-app-container">
        <header className="in-app-header">
          <div className="header-text">
            <button
              className="btn btn-sm btn-dark"
              style={{ marginBottom: '14px' }}
              onClick={() => navigate(-1)}
            >
              <MdArrowBack /> Back to Dashboard
            </button>
            <h1 className="text-xl accent-text-white">
              Cash Flow <span className="accent-text-lime-dark">Ledger</span>
            </h1>
            <p className="text-md accent-text-white">
              Historic balance sheets for platform workflow parameters
            </p>
          </div>
          <div className="table-btns-flex">
            <button className="btn btn-primary" onClick={openAdd}>
              <MdAdd size={18} /> Add Entry
            </button>
            <button className="btn btn-dark">
              <MdFileDownload size={18} /> Export
            </button>
          </div>
        </header>

        <div className="table-card bg-text-main">
          <div className="table-responsive">
            <table className="table-universal">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Client Target</th>
                  <th>Employee Assignee</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Cash In</th>
                  <th>Cash Out</th>
                  <th>Description</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cashFlowData?.map(flow => (
                  <tr key={flow.id}>
                    <td data-label="Date">{flow.createdDate}</td>
                    <td data-label="Category">{flow.jobCategory?.jobName || flow.jobCategory || '-'}</td>
                    <td data-label="Client">{flow.clientName}</td>
                    <td data-label="Employee"><strong>{flow.employee?.name}</strong></td>
                    <td data-label="Type">
                      <span className={`status-pill ${flow.cashType?.toLowerCase() === 'income' ? 'completed' : 'cancelled'}`}>
                        {flow.cashType}
                      </span>
                    </td>
                    <td data-label="Method">{flow.paymentMethod}</td>
                    <td data-label="Cash In">
                      {flow.cashIn > 0
                        ? <strong className="accent-text-lime-dark">Rs. {flow.cashIn.toLocaleString()}</strong>
                        : '-'}
                    </td>
                    <td data-label="Cash Out">
                      {flow.cashOut > 0
                        ? <strong style={{ color: '#ef4444' }}>Rs. {flow.cashOut.toLocaleString()}</strong>
                        : '-'}
                    </td>
                    <td data-label="Description">{flow.description}</td>
                    <td data-label="Actions">
                      <div className="table-btns-flex">
                        <button className="btn btn-sm btn-primary" onClick={() => openEdit(flow)}>
                          <FaEdit /> Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => openDelete(flow)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* STATIC FORM MODALS FOR VISUAL DESIGN CHECKING */}
        <PopupModal open={isAddOpen} onClose={closeAll} title="Add Cash Flow Entry">
          <CashFlowForm 
            submitLabel="Add Entry" 
            form={form} 
            onField={onField} 
            closeAll={closeAll} 
            jobsData={jobsData}
            cashTypes={cashType}
            paymentMethods={paymentMethod}
            employeesData={employeesData}
            onSubmit={addFunc}
          />
        </PopupModal>

        <PopupModal open={isEditOpen} onClose={closeAll} title="Edit Cash Flow Entry">
          <CashFlowForm 
            submitLabel="Save Changes" 
            form={form} 
            onField={onField} 
            closeAll={closeAll} 
            jobsData={jobsData}
            cashTypes={cashType}
            paymentMethods={paymentMethod}
            employeesData={employeesData}
            onSubmit={editFunc}
          />
        </PopupModal>

        <PopupModal open={isDeleteOpen} onClose={closeAll} title="Delete Entry">
          <p>Are you sure you want to delete the entry for <b>{selected?.clientName || 'this row'}</b>?</p>
          <div className="modal-btns">
            <button className="btn btn-dark" onClick={closeAll}>Cancel</button>
            <button className="btn btn-danger" onClick={deleteFunc}>Confirm Delete</button>
          </div>
        </PopupModal>
      </div>
    );
  };

  export default CashFlow;