// pages/CustomerDashboard/CustomerSettings.jsx
// Three things only: view username, change password, delete account.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPersonOutline, MdOutlineLock, MdCheckCircle, MdOutlineDeleteForever } from 'react-icons/md';
import { PopupModal } from '../../../components/Popup/PopupModal';
import './CustomerSettings.css';


const MOCK_PROFILE = { username: 'aayush.shrestha' };

const CustomerSettings = () => {
  const navigate = useNavigate();

  const profile = MOCK_PROFILE;

  /* ── change password ── */
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const onPwField = (e) => {
    setPwForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setPwSuccess(false);
    setPwError('');
  };

  const handlePwSubmit = (e) => {
    e.preventDefault();

    if (pwForm.next.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('New password and confirmation do not match.');
      return;
    }

    // TODO: replace with your real change-password API call, e.g.
    // fetchAPI('https://localhost:7011/api/Customer/change-password', 'POST', pwForm);

    setPwError('');
    setPwSuccess(true);
    setPwForm({ current: '', next: '', confirm: '' });
  };

  /* ── delete account ── */
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const canDelete = confirmText.trim().toUpperCase() === 'DELETE';

  const handleDeleteAccount = () => {
    if (!canDelete) return;
    try {
      const response = fetchAPI('https://localhost:7011/api/Customer/delete-account', 'DELETE');
      if (response) {
        window.alert('Your account has been deleted.');
        navigate('/login');
      } else {
        window.alert('Error deleting your account. Please try again later.');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      window.alert('An error occurred while deleting your account.');
    }
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
    setConfirmText('');
  };

  return (
    <div className="in-app-container cdash-page">
      <div className="cdash-page-head">
        <div>
          <h1 className="text-xl accent-text-white">Settings</h1>
          <p className="text-md accent-text-white">Your account details and password.</p>
        </div>
      </div>

      <div className="cdash-settings-grid">
        {/* ── ACCOUNT / USERNAME ── */}
        <section className="cdash-section">
          <h3 className="cdash-section-title">Account</h3>
          <div className="cdash-pw-card">
            <div className="cdash-pw-head">
              <span className="cdash-pw-icon"><MdPersonOutline size={20} /></span>
              <h3>Username</h3>
            </div>
            <div className="cdash-username-value">{profile.username}</div>
          </div>
        </section>

        {/* ── CHANGE PASSWORD ── */}
        <section className="cdash-section">
          <h3 className="cdash-section-title">Password</h3>
          <form className="cdash-pw-card" onSubmit={handlePwSubmit}>
            <div className="cdash-pw-head">
              <span className="cdash-pw-icon"><MdOutlineLock size={20} /></span>
              <h3>Change password</h3>
            </div>

            <div className="cdash-field">
              <label htmlFor="current">Current password</label>
              <input id="current" type="password" name="current" value={pwForm.current} onChange={onPwField} required />
            </div>

            <div className="cdash-field">
              <label htmlFor="next">New password</label>
              <input id="next" type="password" name="next" value={pwForm.next} onChange={onPwField} required minLength={8} />
            </div>

            <div className="cdash-field">
              <label htmlFor="confirm">Confirm new password</label>
              <input id="confirm" type="password" name="confirm" value={pwForm.confirm} onChange={onPwField} required minLength={8} />
            </div>

            {pwError && <div className="cdash-pw-error">{pwError}</div>}
            {pwSuccess && (
              <div className="cdash-pw-success"><MdCheckCircle size={16} /> Password updated successfully.</div>
            )}

            <button type="submit" className="btn btn-primary cdash-pw-submit">Update password</button>
          </form>
        </section>

        {/* ── DELETE ACCOUNT ── */}
        <section className="cdash-section cdash-section--full">
          <h3 className="cdash-section-title">Danger zone</h3>
          <div className="cdash-danger-card">
            <div className="cdash-danger-text">
              <strong>Delete your account</strong>
              <p>This permanently removes your profile, booking history and saved details. This cannot be undone.</p>
            </div>
            <button className="btn btn-danger" onClick={() => setIsDeleteOpen(true)}>
              <MdOutlineDeleteForever size={17} /> Delete account
            </button>
          </div>
        </section>
      </div>

      <PopupModal open={isDeleteOpen} onClose={closeDelete} title="Delete account">
        <p>
          This will permanently delete your account and everything tied to it. Type{' '}
          <b>DELETE</b> below to confirm.
        </p>
        <div className="cdash-field" style={{ marginTop: 14 }}>
          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>
        <div className="modal-btns">
          <button className="btn btn-dark" onClick={closeDelete}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={!canDelete}>
            Confirm Delete
          </button>
        </div>
      </PopupModal>
    </div>
  );
};

export default CustomerSettings;