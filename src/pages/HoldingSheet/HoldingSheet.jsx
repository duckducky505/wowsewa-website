// pages/AdminDashboard/HoldingSheetPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdFileDownload, MdAdd } from 'react-icons/md';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PopupModal } from '../../components/Popup/PopupModal';
import { fetchHook } from '../../hooks/fetchHook';
import { fetchAPI } from '../../utils/fetchAPI';


const blankForm = {
  createdDate: '',
  fromHolderName: '',
  toHolderName: '',
  entryType: '',
  paymentMethod: '',
  amount: '',
  status: '',
  note: '',
};

const HoldingSheet = () => {
  const navigate = useNavigate();


  /* Modal state (design-only) */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blankForm);

  const {data : holdingData} = fetchHook("https://localhost:7011/api/HoldingSheet/get/holding-sheet-data");
  const {data : statusValues} = fetchHook("https://localhost:7011/api/Categories/get/Status");
  const {data : paymentType} = fetchHook("https://localhost:7011/api/Categories/get/Payment-Method-Values");
  const {data : entryType} = fetchHook("https://localhost:7011/api/Categories/get/Entry-Types");

  

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => { 
    setForm(blankForm); setIsAddOpen(true);
   };
  const openEdit = (entry) => {
    setSelected(entry);
    setForm({
      createdDate: entry.createdDate || '',
      fromHolderName: entry.fromHolderName || '',
      toHolderName: entry.toHolderName || '',
      entryType: entry.entryType || 'Collection',
      paymentMethod: entry.paymentMethod || 'Cash',
      amount: entry.amount ?? '',
      status: entry.status || 'Pending',
      note: entry.note || '',
    });
    setIsEditOpen(true);
  };
  const openDelete = (entry) => { setSelected(entry); setIsDeleteOpen(true); };
  const closeAll = () => {
    setIsAddOpen(false); setIsEditOpen(false); setIsDeleteOpen(false);
    setSelected(null); setForm(blankForm);
  };

  /* Local-only handlers */
  const handleAdd = (e) => {
    e.preventDefault();

    const payload = new{

    }

    const addRes = fetchAPI("https://localhost:7011/api/HoldingSheet/add/holding-Sheet-Data", "POST", payload);
    if(addRes) {
      window.alert("New holding Data added successfully.");
    }
    else 
      window.alert("Error adding the data. Please try  again later.");

  };

  const handleEdit = (e) => {
    e.preventDefault();
    setSheets((prev) =>
      prev.map((s) =>
        s.id === selected.id ? { ...s, ...form, amount: Number(form.amount) || 0 } : s
      )
    );
    closeAll();
  };

  const handleDelete = () => {
    if(!selected) return;
    const delRes = fetchAPI(`https://localhost:7011/api/HoldingSheet/delete/${selected.id}`);

    if(delRes){
      window.alert("Data deleted successfully.");
      window.location.reload();
    }
  };

  const HoldingForm = ({ onSubmit, submitLabel }) => (
    <form className="modal-form" onSubmit={onSubmit}>
      <label>Date</label>
      <input type="date" name="createdDate" value={form.createdDate} onChange={onField} required />

      <label>From (Source)</label>
      <input type="text" name="fromHolderName" placeholder="e.g. Sita Kumari" value={form.fromHolderName} onChange={onField} />

      <label>To (Target)</label>
      <input type="text" name="toHolderName" placeholder="e.g. Arjun Thapa" value={form.toHolderName} onChange={onField} />

      <label>Entry Type</label>
      <select name="entryType" value={form.entryType} onChange={onField}>
        {entryType?.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <label>Payment Method</label>
      <select name="paymentMethod" value={form.paymentMethod} onChange={onField}>
        {paymentType?.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      <label>Amount (Rs.)</label>
      <input type="number" name="amount" placeholder="0" value={form.amount} onChange={onField} min="0" required />

      <label>Status</label>
      <select name="status" value={form.status} onChange={onField}>
        {statusValues?.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>System Note</label>
      <textarea name="note" rows="3" placeholder="Optional note" value={form.note} onChange={onField} />

      <div className="modal-btns">
        <button type="button" className="btn btn-dark" onClick={closeAll}>Cancel</button>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  );

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
            Holding Sheet <span className="accent-text-lime-dark">Audits</span>
          </h1>
          <p className="text-md accent-text-white">
            Track active hand-to-hand collections and balances
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
        <table className="table-universal">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source (From)</th>
              <th>Target (To)</th>
              <th>Type</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>System Note</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdingData?.length > 0 ? holdingData?.map(sheet => (
              <tr key={sheet.id}>
                <td data-label="Date">{sheet.createdDate}</td>
                <td data-label="From"><strong>{sheet.fromHolderName}</strong></td>
                <td data-label="To"><strong>{sheet.toHolderName}</strong></td>
                <td data-label="Type">
                  <span className="status-pill active">{sheet.entryType}</span>
                </td>
                <td data-label="Method">{sheet.paymentMethod}</td>
                <td data-label="Amount">
                  <strong className="accent-text-lime-dark">
                    Rs. {Number(sheet.amount).toLocaleString()}
                  </strong>
                </td>
                <td data-label="Status">
                  <span className={`status-pill ${sheet.status?.toLowerCase()}`}>
                    {sheet.status}
                  </span>
                </td>
                <td data-label="Note">{sheet.note}</td>
                <td data-label="Actions">
                  <div className="table-btns-flex">
                    <button className="btn btn-sm btn-primary" onClick={() => openEdit(sheet)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => openDelete(sheet)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="9" className="text-center" style={{ padding: '2rem' }}>
                  No entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PopupModal open={isAddOpen} onClose={closeAll} title="Add Holding Sheet Entry">
        <HoldingForm onSubmit={handleAdd} submitLabel="Add Entry" />
      </PopupModal>

      <PopupModal open={isEditOpen} onClose={closeAll} title="Edit Holding Sheet Entry">
        <HoldingForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </PopupModal>

      <PopupModal open={isDeleteOpen} onClose={closeAll} title="Delete Entry">
        <p>
          Are you sure you want to delete the entry from{' '}
          <b>{selected?.fromHolderName}</b> to <b>{selected?.toHolderName}</b>?
        </p>
        <div className="modal-btns">
          <button className="btn btn-dark" onClick={closeAll}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Confirm Delete</button>
        </div>
      </PopupModal>
    </div>
  );
};

export default HoldingSheet;
