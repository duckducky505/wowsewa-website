import React, { useState } from "react";
import "./CustomerSettings.css";

// ---- Mock data --------------------------------------------------------------

const INITIAL_PROFILE = {
  fullName: "Sagar Thapa",
  phone: "+977 98-1234-5678",
  email: "sagar.thapa@example.com",
  language: "English",
};

const INITIAL_ADDRESSES = [
  { id: "addr-1", label: "Home", address: "Baneshwor Height, Kathmandu", primary: true },
  { id: "addr-2", label: "Office", address: "Durbar Marg, Kathmandu", primary: false },
];

const INITIAL_NOTIFICATIONS = {
  bookingUpdates: { sms: true, email: true, push: true },
  technicianEnRoute: { sms: true, email: false, push: true },
  promotions: { sms: false, email: true, push: false },
  receipts: { sms: false, email: true, push: false },
};

const NOTIFICATION_LABELS = {
  bookingUpdates: { title: "Booking updates", body: "Confirmations, reschedules and cancellations" },
  technicianEnRoute: { title: "Technician en route", body: "Alerts when your technician is on the way" },
  promotions: { title: "Offers & promotions", body: "Seasonal discounts and new service launches" },
  receipts: { title: "Receipts & invoices", body: "Payment confirmations after every job" },
};

const PAYMENT_METHODS = [
  { id: "pm-1", type: "eSewa", detail: "Linked · sagar.t@esewa", primary: true },
  { id: "pm-2", type: "Cash on service", detail: "Pay the technician directly", primary: false },
];

const NAV_ITEMS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "addresses", label: "Addresses" },
  { id: "notifications", label: "Notifications" },
  { id: "payment", label: "Payment methods" },
  { id: "privacy", label: "Privacy & data" },
];

// ---- Helpers --------------------------------------------------------------

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ---- Component --------------------------------------------------------------

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="wsw-settings">
      <header className="wsw-settings__header">
        <div className="wsw-settings__header-inner">
          <span className="wsw-settings__eyebrow">Account</span>
          <h1 className="wsw-settings__title">Settings</h1>
          <p className="wsw-settings__subtitle">Manage your profile, security and preferences.</p>
        </div>
      </header>

      <div className="wsw-settings__body">
        <nav className="wsw-settings__nav" aria-label="Settings sections">
          <ul className="wsw-settings__nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={
                    "wsw-settings__nav-item" +
                    (activeTab === item.id ? " wsw-settings__nav-item--active" : "")
                  }
                  onClick={() => setActiveTab(item.id)}
                  aria-current={activeTab === item.id ? "true" : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <button type="button" className="wsw-settings__logout">
            Log out
          </button>
        </nav>

        <div className="wsw-settings__content">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "addresses" && <AddressesSection />}
          {activeTab === "notifications" && <NotificationsSection />}
          {activeTab === "payment" && <PaymentSection />}
          {activeTab === "privacy" && <PrivacySection />}
        </div>
      </div>
    </div>
  );
}

// ---- Profile --------------------------------------------------------------

function ProfileSection() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(INITIAL_PROFILE);
  const [saved, setSaved] = useState(false);

  const isDirty = JSON.stringify(profile) !== JSON.stringify(draft);

  function updateField(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave(e) {
    e.preventDefault();
    setProfile(draft);
    setSaved(true);
  }

  function handleReset() {
    setDraft(profile);
    setSaved(false);
  }

  return (
    <section className="wsw-settings__panel" aria-label="Profile">
      <div className="wsw-settings__panel-head">
        <h2 className="wsw-settings__panel-title">Profile</h2>
        <p className="wsw-settings__panel-desc">This is what technicians and support see about you.</p>
      </div>

      <div className="wsw-settings__avatar-row">
        <span className="wsw-settings__avatar">{initials(profile.fullName)}</span>
        <div>
          <button type="button" className="wsw-settings__ghost-btn">
            Change photo
          </button>
          <p className="wsw-settings__hint">JPG or PNG, up to 5MB</p>
        </div>
      </div>

      <form className="wsw-settings__form" onSubmit={handleSave}>
        <div className="wsw-settings__field-row">
          <Field id="fullName" label="Full name" value={draft.fullName} onChange={(v) => updateField("fullName", v)} />
          <div className="wsw-settings__field">
            <label className="wsw-settings__label" htmlFor="language">
              Preferred language
            </label>
            <select
              id="language"
              className="wsw-settings__select"
              value={draft.language}
              onChange={(e) => updateField("language", e.target.value)}
            >
              <option>English</option>
              <option>नेपाली</option>
            </select>
          </div>
        </div>

        <div className="wsw-settings__field-row">
          <div className="wsw-settings__field">
            <label className="wsw-settings__label" htmlFor="phone">
              Phone number
            </label>
            <div className="wsw-settings__input-with-badge">
              <input
                id="phone"
                type="tel"
                className="wsw-settings__input"
                value={draft.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
              <span className="wsw-settings__verified-badge">Verified</span>
            </div>
          </div>
          <div className="wsw-settings__field">
            <label className="wsw-settings__label" htmlFor="email">
              Email address
            </label>
            <div className="wsw-settings__input-with-badge">
              <input
                id="email"
                type="email"
                className="wsw-settings__input"
                value={draft.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              <span className="wsw-settings__verified-badge">Verified</span>
            </div>
          </div>
        </div>

        <div className="wsw-settings__form-actions">
          <button type="submit" className="wsw-settings__primary-btn" disabled={!isDirty}>
            Save changes
          </button>
          {isDirty && (
            <button type="button" className="wsw-settings__ghost-btn" onClick={handleReset}>
              Discard
            </button>
          )}
          {saved && !isDirty && <span className="wsw-settings__saved-note">Saved</span>}
        </div>
      </form>
    </section>
  );
}

// ---- Security --------------------------------------------------------------

function SecuritySection() {
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  function updatePassword(field, value) {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!passwords.current || !passwords.next) {
      setError("Fill in your current and new password");
      return;
    }
    if (passwords.next.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setError("New password and confirmation don't match");
      return;
    }
    setPasswords({ current: "", next: "", confirm: "" });
    setSuccess(true);
  }

  return (
    <section className="wsw-settings__panel" aria-label="Security">
      <div className="wsw-settings__panel-head">
        <h2 className="wsw-settings__panel-title">Security</h2>
        <p className="wsw-settings__panel-desc">Keep your account protected.</p>
      </div>

      <form className="wsw-settings__form" onSubmit={handleSubmit} noValidate>
        <h3 className="wsw-settings__subhead">Change password</h3>
        <Field
          id="current-password"
          label="Current password"
          type="password"
          value={passwords.current}
          onChange={(v) => updatePassword("current", v)}
        />
        <div className="wsw-settings__field-row">
          <Field
            id="new-password"
            label="New password"
            type="password"
            value={passwords.next}
            onChange={(v) => updatePassword("next", v)}
          />
          <Field
            id="confirm-password"
            label="Confirm new password"
            type="password"
            value={passwords.confirm}
            onChange={(v) => updatePassword("confirm", v)}
          />
        </div>

        {error && <p className="wsw-settings__error">{error}</p>}
        {success && <p className="wsw-settings__saved-note">Password updated</p>}

        <div className="wsw-settings__form-actions">
          <button type="submit" className="wsw-settings__primary-btn">
            Update password
          </button>
        </div>
      </form>

      <div className="wsw-settings__divider" />

      <div className="wsw-settings__toggle-row">
        <div>
          <h3 className="wsw-settings__subhead">Two-factor authentication</h3>
          <p className="wsw-settings__hint">Add an SMS code step when signing in from a new device.</p>
        </div>
        <Toggle checked={twoFactor} onChange={setTwoFactor} label="Two-factor authentication" />
      </div>

      <div className="wsw-settings__divider" />

      <div>
        <h3 className="wsw-settings__subhead">Active sessions</h3>
        <ul className="wsw-settings__session-list">
          <li className="wsw-settings__session-row">
            <div>
              <p className="wsw-settings__session-device">Chrome on Windows · Kathmandu</p>
              <p className="wsw-settings__hint">This device · active now</p>
            </div>
            <span className="wsw-settings__current-badge">Current</span>
          </li>
          <li className="wsw-settings__session-row">
            <div>
              <p className="wsw-settings__session-device">WowSewa app on Android · Kathmandu</p>
              <p className="wsw-settings__hint">Last active 2 days ago</p>
            </div>
            <button type="button" className="wsw-settings__ghost-btn wsw-settings__ghost-btn--danger">
              Log out
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
}

// ---- Addresses --------------------------------------------------------------

function AddressesSection() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });

  function handleSetPrimary(id) {
    setAddresses((prev) => prev.map((a) => ({ ...a, primary: a.id === id })));
  }

  function handleRemove(id) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!newAddress.label.trim() || !newAddress.address.trim()) return;
    setAddresses((prev) => [
      ...prev,
      { id: `addr-${Date.now()}`, label: newAddress.label, address: newAddress.address, primary: prev.length === 0 },
    ]);
    setNewAddress({ label: "", address: "" });
    setShowForm(false);
  }

  return (
    <section className="wsw-settings__panel" aria-label="Addresses">
      <div className="wsw-settings__panel-head">
        <h2 className="wsw-settings__panel-title">Addresses</h2>
        <p className="wsw-settings__panel-desc">Service locations technicians can be sent to.</p>
      </div>

      <ul className="wsw-settings__address-list">
        {addresses.map((a) => (
          <li className="wsw-settings__address-row" key={a.id}>
            <div>
              <p className="wsw-settings__address-label">
                {a.label}
                {a.primary && <span className="wsw-settings__primary-tag">Primary</span>}
              </p>
              <p className="wsw-settings__hint">{a.address}</p>
            </div>
            <div className="wsw-settings__address-actions">
              {!a.primary && (
                <button type="button" className="wsw-settings__ghost-btn" onClick={() => handleSetPrimary(a.id)}>
                  Make primary
                </button>
              )}
              <button
                type="button"
                className="wsw-settings__ghost-btn wsw-settings__ghost-btn--danger"
                onClick={() => handleRemove(a.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {addresses.length === 0 && (
          <p className="wsw-settings__hint">No saved addresses yet. Add one so booking is faster next time.</p>
        )}
      </ul>

      {showForm ? (
        <form className="wsw-settings__form wsw-settings__form--inline" onSubmit={handleAdd}>
          <div className="wsw-settings__field-row">
            <Field
              id="new-address-label"
              label="Label"
              value={newAddress.label}
              onChange={(v) => setNewAddress((prev) => ({ ...prev, label: v }))}
              placeholder="Home, Office, Parents' house…"
            />
            <Field
              id="new-address-text"
              label="Address"
              value={newAddress.address}
              onChange={(v) => setNewAddress((prev) => ({ ...prev, address: v }))}
              placeholder="Street, area, city"
            />
          </div>
          <div className="wsw-settings__form-actions">
            <button type="submit" className="wsw-settings__primary-btn">
              Save address
            </button>
            <button type="button" className="wsw-settings__ghost-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="wsw-settings__ghost-btn" onClick={() => setShowForm(true)}>
          + Add new address
        </button>
      )}
    </section>
  );
}

// ---- Notifications --------------------------------------------------------------

function NotificationsSection() {
  const [prefs, setPrefs] = useState(INITIAL_NOTIFICATIONS);

  function toggle(key, channel) {
    setPrefs((prev) => ({
      ...prev,
      [key]: { ...prev[key], [channel]: !prev[key][channel] },
    }));
  }

  return (
    <section className="wsw-settings__panel" aria-label="Notifications">
      <div className="wsw-settings__panel-head">
        <h2 className="wsw-settings__panel-title">Notifications</h2>
        <p className="wsw-settings__panel-desc">Choose how you'd like to hear from us.</p>
      </div>

      <div className="wsw-settings__notif-table" role="table">
        <div className="wsw-settings__notif-header" role="row">
          <span role="columnheader">Type</span>
          <span role="columnheader">SMS</span>
          <span role="columnheader">Email</span>
          <span role="columnheader">Push</span>
        </div>
        {Object.keys(prefs).map((key) => (
          <div className="wsw-settings__notif-row" role="row" key={key}>
            <div className="wsw-settings__notif-type">
              <p>{NOTIFICATION_LABELS[key].title}</p>
              <span className="wsw-settings__hint">{NOTIFICATION_LABELS[key].body}</span>
            </div>
            {["sms", "email", "push"].map((channel) => (
              <span key={channel} className="wsw-settings__notif-cell">
                <Toggle
                  checked={prefs[key][channel]}
                  onChange={() => toggle(key, channel)}
                  label={`${NOTIFICATION_LABELS[key].title} via ${channel}`}
                  compact
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Payment --------------------------------------------------------------

function PaymentSection() {
  const [methods, setMethods] = useState(PAYMENT_METHODS);

  function handleSetPrimary(id) {
    setMethods((prev) => prev.map((m) => ({ ...m, primary: m.id === id })));
  }

  function handleRemove(id) {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <section className="wsw-settings__panel" aria-label="Payment methods">
      <div className="wsw-settings__panel-head">
        <h2 className="wsw-settings__panel-title">Payment methods</h2>
        <p className="wsw-settings__panel-desc">Used to pay for completed jobs.</p>
      </div>

      <ul className="wsw-settings__payment-list">
        {methods.map((m) => (
          <li className="wsw-settings__payment-row" key={m.id}>
            <div>
              <p className="wsw-settings__address-label">
                {m.type}
                {m.primary && <span className="wsw-settings__primary-tag">Default</span>}
              </p>
              <p className="wsw-settings__hint">{m.detail}</p>
            </div>
            <div className="wsw-settings__address-actions">
              {!m.primary && (
                <button type="button" className="wsw-settings__ghost-btn" onClick={() => handleSetPrimary(m.id)}>
                  Make default
                </button>
              )}
              <button
                type="button"
                className="wsw-settings__ghost-btn wsw-settings__ghost-btn--danger"
                onClick={() => handleRemove(m.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button type="button" className="wsw-settings__ghost-btn">
        + Add payment method
      </button>
    </section>
  );
}

// ---- Privacy / danger zone --------------------------------------------------------------

function PrivacySection() {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  return (
    <section className="wsw-settings__panel" aria-label="Privacy and data">
      <div className="wsw-settings__panel-head">
        <h2 className="wsw-settings__panel-title">Privacy & data</h2>
        <p className="wsw-settings__panel-desc">Control what WowSewa keeps about you.</p>
      </div>

      <div className="wsw-settings__data-row">
        <div>
          <h3 className="wsw-settings__subhead">Download your data</h3>
          <p className="wsw-settings__hint">Get a copy of your bookings, addresses and account details.</p>
        </div>
        <button type="button" className="wsw-settings__ghost-btn">
          Request export
        </button>
      </div>

      <div className="wsw-settings__divider" />

      <div className="wsw-settings__danger-zone">
        <h3 className="wsw-settings__subhead wsw-settings__subhead--danger">Delete account</h3>
        <p className="wsw-settings__hint">
          This permanently removes your profile, booking history and saved addresses. This can't be undone.
        </p>

        {!confirmingDelete ? (
          <button
            type="button"
            className="wsw-settings__danger-btn"
            onClick={() => setConfirmingDelete(true)}
          >
            Delete my account
          </button>
        ) : (
          <div className="wsw-settings__confirm-delete">
            <label className="wsw-settings__label" htmlFor="confirm-delete-input">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              id="confirm-delete-input"
              className="wsw-settings__input"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
            />
            <div className="wsw-settings__form-actions">
              <button type="button" className="wsw-settings__danger-btn" disabled={deleteInput !== "DELETE"}>
                Confirm deletion
              </button>
              <button
                type="button"
                className="wsw-settings__ghost-btn"
                onClick={() => {
                  setConfirmingDelete(false);
                  setDeleteInput("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ---- Shared subcomponents --------------------------------------------------------------

function Field({ id, label, value, onChange, type = "text", placeholder }) {
  return (
    <div className="wsw-settings__field">
      <label className="wsw-settings__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="wsw-settings__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Toggle({ checked, onChange, label, compact }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={
        "wsw-settings__toggle" +
        (checked ? " wsw-settings__toggle--on" : "") +
        (compact ? " wsw-settings__toggle--compact" : "")
      }
      onClick={() => onChange(!checked)}
    >
      <span className="wsw-settings__toggle-knob" />
    </button>
  );
}