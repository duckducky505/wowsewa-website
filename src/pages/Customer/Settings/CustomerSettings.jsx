import React, { useMemo, useState, useEffect } from "react";
import "./CustomerSettings.css";
import { fetchHook } from "../../../hooks/fetchHook";
import { fetchAPI } from "../../../utils/fetchAPI";
import { useAuth } from "../../../context/AuthContext";

const NAV_ITEMS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "privacy", label: "Privacy & data" },
];

// ---- Helpers --------------------------------------------------------------

function initials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeProfile(raw) {
  return {
    name: raw.name ?? raw.Name ?? raw.fullName ?? raw.FullName ?? "",
    phone: raw.phone ?? raw.Phone ?? raw.phoneNumber ?? raw.PhoneNumber ?? "",
    email: raw.email ?? raw.Email ?? raw.emailAddress ?? raw.EmailAddress ?? "",
  };
}

// ---- Component --------------------------------------------------------------

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout } = useAuth();
  const guidId = user?.guidId ?? null;

  return (
    <div className="wsw-settings">
      <header className="wsw-settings__header">
        <div className="wsw-settings__header-inner">
          <span className="wsw-settings__eyebrow">Account</span>
          <h1 className="wsw-settings__title">Settings</h1>
          <p className="wsw-settings__subtitle">Manage your profile, security and privacy.</p>
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

          <button type="button" className="wsw-settings__logout" onClick={logout}>
            Log out
          </button>
        </nav>

        <div className="wsw-settings__content">
          {activeTab === "profile" && <ProfileSection guidId={guidId} />}
          {activeTab === "security" && <SecuritySection guidId={guidId} />}
          {activeTab === "privacy" && <PrivacySection guidId={guidId} logout={logout} />}
        </div>
      </div>
    </div>
  );
}

// ---- Profile --------------------------------------------------------------

function ProfileSection({ guidId }) {
  const { data: rawProfile, loading } = fetchHook(
    guidId ? `https://localhost:7011/api/User/UserSpecificAccountInfo/${guidId}` : null
  );

  const profile = useMemo(() => (rawProfile ? normalizeProfile(rawProfile) : null), [rawProfile]);
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile && !draft) setDraft(profile);
  }, [profile, draft]);

  const isDirty = profile && draft && JSON.stringify(profile) !== JSON.stringify(draft);

  function updateField(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!draft) return;
    setSubmitting(true);

    const res = await fetchAPI(`https://localhost:7011/api/User/UpdateUserDetails/${guidId}`, "PATCH", [
      { op: "replace", path: "/Name", value: draft.name },
      { op: "replace", path: "/Email", value: draft.email },
    ]);
    setSubmitting(false);

    if (res) {
      setSaved(true);
    } else {
      window.alert("Couldn't save your changes. Please try again.");
    }
  }

  function handleReset() {
    setDraft(profile);
    setSaved(false);
  }

  if (loading || !draft) {
    return (
      <section className="wsw-settings__panel" aria-label="Profile">
        <p className="wsw-settings__hint">Loading profile…</p>
      </section>
    );
  }

  return (
    <section className="wsw-settings__panel" aria-label="Profile">
      <div className="wsw-settings__panel-head">
        <h2 className="wsw-settings__panel-title">Profile</h2>
        <p className="wsw-settings__panel-desc">This is what technicians and support see about you.</p>
      </div>

      <div className="wsw-settings__avatar-row">
        <span className="wsw-settings__avatar">{initials(draft.name)}</span>
        <div>
          <button type="button" className="wsw-settings__ghost-btn">
            Change photo
          </button>
          <p className="wsw-settings__hint">JPG or PNG, up to 5MB</p>
        </div>
      </div>

      <form className="wsw-settings__form" onSubmit={handleSave}>
        <Field id="fullName" label="Full name" value={draft.name} onChange={(v) => updateField("name", v)} />

        <div className="wsw-settings__field-row">
          <div className="wsw-settings__field">
            <label className="wsw-settings__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="wsw-settings__input"
              value={draft.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
        </div>

        <div className="wsw-settings__form-actions">
          <button type="submit" className="wsw-settings__primary-btn" disabled={!isDirty || submitting}>
            {submitting ? "Saving…" : "Save changes"}
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

function SecuritySection({ guidId }) {
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updatePassword(field, value) {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess(false);
  }

  async function handleSubmit(e) {
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

    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/User/ChangePass/${guidId}`, "PATCH", {
      currentPassword: passwords.current,
      newPassword: passwords.next,
    });
    setSubmitting(false);

    if (res) {
      setPasswords({ current: "", next: "", confirm: "" });
      setSuccess(true);
    } else {
      setError("Couldn't update your password. Check your current password and try again.");
    }
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
          <button type="submit" className="wsw-settings__primary-btn" disabled={submitting}>
            {submitting ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </section>
  );
}

// ---- Privacy / danger zone --------------------------------------------------------------

function PrivacySection({ guidId, logout }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirmDelete() {
    setSubmitting(true);
    const res = await fetchAPI(`https://localhost:7011/api/Customer/deleteAccount/${guidId}`, "DELETE");
    setSubmitting(false);

    if (res) {
      window.alert("Your account has been deleted.");
      logout();
    } else {
      window.alert("Couldn't delete your account. Please try again.");
    }
  }

  return (
    <section className="wsw-settings__panel" aria-label="Privacy and data">
      <div className="wsw-settings__panel-head">
        <h2 className="wsw-settings__panel-title">Privacy & data</h2>
        <p className="wsw-settings__panel-desc">Control what WowSewa keeps about you.</p>
      </div>

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
              <button
                type="button"
                className="wsw-settings__danger-btn"
                disabled={deleteInput !== "DELETE" || submitting}
                onClick={handleConfirmDelete}
              >
                {submitting ? "Deleting…" : "Confirm deletion"}
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