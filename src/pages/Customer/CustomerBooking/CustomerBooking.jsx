// pages/CustomerDashboard/CustomerBookings.jsx
// A single, straightforward booking form: title, service (dropdown), date,
// time and a description of the problem. No category-picker visuals.
import React, { useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import './CustomerBooking.css';

const SERVICES = [
  'Plumbing',
  'Electrical',
  'Appliances',
  'IT & Devices',
  'Solar Install',
  'Geyser Install',
  'Deep Cleaning',
  '24×7 Emergency',
];

const blankForm = { title: '', service: '', date: '', time: '', description: '' };

const CustomerBookings = () => {
  const [form, setForm] = useState(blankForm);
  const [confirmed, setConfirmed] = useState(null);

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const canSubmit = form.title && form.service && form.date && form.time;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: replace with your real booking-create API call, e.g.
    // await fetch('https://localhost:7011/api/Customer/bookings/create', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form),
    // });
    setConfirmed({ id: 'WS-' + Math.floor(10000 + Math.random() * 89999), ...form });
  };

  const bookAnother = () => {
    setConfirmed(null);
    setForm(blankForm);
  };

  if (confirmed) {
    return (
      <div className="in-app-container cdash-page">
        <div className="cdash-confirm">
          <span className="cdash-confirm-icon"><MdCheckCircle size={40} /></span>
          <h2>Booking confirmed</h2>
          <p>
            <strong>{confirmed.title}</strong> ({confirmed.service}) is booked for{' '}
            <strong>{confirmed.date}</strong> at <strong>{confirmed.time}</strong>.
          </p>
          <div className="cdash-confirm-id">Booking ID: {confirmed.id}</div>
          <button className="btn btn-primary" onClick={bookAnother}>Book another service</button>
        </div>
      </div>
    );
  }

  return (
    <div className="in-app-container cdash-page">
      <div className="cdash-page-head">
        <div>
          <h1 className="text-xl accent-text-white">Bookings</h1>
          <p className="text-md accent-text-white">Book a service — fill in the details below.</p>
        </div>
      </div>

      <form className="cdash-form" onSubmit={handleSubmit}>
        <div className="cdash-form-row">
          <div className="cdash-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. AC not cooling properly"
              value={form.title}
              onChange={onField}
              required
            />
          </div>

          <div className="cdash-field">
            <label htmlFor="service">Service</label>
            <select id="service" name="service" value={form.service} onChange={onField} required>
              <option value="" disabled>Select a service</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="cdash-form-row">
          <div className="cdash-field">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" name="date" value={form.date} onChange={onField} required />
          </div>
          <div className="cdash-field">
            <label htmlFor="time">Preferred time</label>
            <input id="time" type="time" name="time" value={form.time} onChange={onField} required />
          </div>
        </div>

        <div className="cdash-field">
          <label htmlFor="description">Description of the problem</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Describe what's wrong so the pro comes prepared"
            value={form.description}
            onChange={onField}
          />
        </div>

        <div className="cdash-form-btns">
          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
            Confirm booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerBookings;