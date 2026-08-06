import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AuthStyles.css';

// Mirrors SignupDTO exactly, so a mismatch is caught before the request
// ever goes out instead of round-tripping to the server first.
const NAME_PATTERN = /^[a-zA-Z]+$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_HINT = "Letters only — no spaces, numbers, or punctuation.";
const PASSWORD_HINT = "At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character (@$!%*#?&).";

function validateField(field, value) {
    if (field === 'name') {
        if (!value.trim()) return "Name is required.";
        if (!NAME_PATTERN.test(value.trim())) return `Name can only contain letters. ${NAME_HINT}`;
        if (value.trim().length > 100) return "Name cannot exceed 100 characters.";
    }
    if (field === 'email') {
        if (!value.trim()) return "Email is required.";
        if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address.";
        if (value.trim().length > 100) return "Email cannot exceed 100 characters.";
    }
    if (field === 'password') {
        if (!value) return "Password is required.";
        if (!PASSWORD_PATTERN.test(value)) return `Password doesn't meet the requirements. ${PASSWORD_HINT}`;
    }
    return "";
}

// Backend can return a few different shapes depending on which check
// failed: a ModelState dictionary of {Field: ["msg", ...]} for DTO
// validation failures, or a plain JSON string for the duplicate-email
// check ("Email already in use."). Handle both rather than assuming one.
function parseServerError(body) {
    if (!body) return { general: "Something went wrong. Please try again." };
    if (typeof body === 'string') return { general: body };

    const fieldErrors = {};
    const source = body.errors ?? body;
    if (source && typeof source === 'object') {
        Object.entries(source).forEach(([key, messages]) => {
            const fieldKey = key.toLowerCase();
            const text = Array.isArray(messages) ? messages.join(' ') : String(messages);
            if (fieldKey.includes('name')) fieldErrors.name = text;
            else if (fieldKey.includes('email')) fieldErrors.email = text;
            else if (fieldKey.includes('password')) fieldErrors.password = text;
            else fieldErrors.general = fieldErrors.general ? `${fieldErrors.general} ${text}` : text;
        });
    }
    if (Object.keys(fieldErrors).length === 0) {
        fieldErrors.general = "Something went wrong. Please try again.";
    }
    return fieldErrors;
}

const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validateAll() {
        const next = {
            name: validateField('name', form.name),
            email: validateField('email', form.email),
            password: validateField('password', form.password),
        };
        setErrors(next);
        return !next.name && !next.email && !next.password;
    }

    const signupRequest = async (e) => {
        e.preventDefault();
        if (!validateAll()) return;

        setSubmitting(true);

        try {
            const response = await fetch("https://localhost:7011/api/Signup/signup-new-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                }),
            });

            if (!response.ok) {
                let body = null;
                try {
                    body = await response.json();
                } catch {
                    // Body wasn't JSON — fall through to the generic message.
                }
                setErrors(parseServerError(body));
                setSubmitting(false);
                return;
            }

            // Success — send them to log in with the account they just made.
            navigate('/login', { replace: true, state: { justRegistered: true } });
        } catch (err) {
            setErrors({ general: "Couldn't reach the server. Please try again." });
            console.error(err);
            setSubmitting(false);
        }
    };

    return (
        <div className="wsw-auth">
            <header className="wsw-auth__header">
                <div className="wsw-auth__header-inner">
                    <Link to="/" className="wsw-auth__back-link">
                        <FaArrowLeft /> Back to home
                    </Link>
                </div>
            </header>

            <div className="wsw-auth__body">
                <div className="wsw-auth__card">
                    <span className="wsw-auth__eyebrow">Create account</span>
                    <h1 className="wsw-auth__title">Join WowSewa</h1>
                    <p className="wsw-auth__subtitle">Book trusted home and office services in minutes.</p>

                    <form className="wsw-auth__form" onSubmit={signupRequest} noValidate>
                        <div className="wsw-auth__field">
                            <label className="wsw-auth__label" htmlFor="signup-name">Full name</label>
                            <input
                                id="signup-name"
                                type="text"
                                className={"wsw-auth__input" + (errors.name ? " wsw-auth__input--error" : "")}
                                placeholder="e.g. Sagar"
                                value={form.name}
                                onChange={(e) => updateField('name', e.target.value)}
                            />
                            {errors.name ? (
                                <span className="wsw-auth__field-error">{errors.name}</span>
                            ) : (
                                <span className="wsw-auth__field-hint">{NAME_HINT}</span>
                            )}
                        </div>

                        <div className="wsw-auth__field">
                            <label className="wsw-auth__label" htmlFor="signup-email">Email address</label>
                            <input
                                id="signup-email"
                                type="email"
                                className={"wsw-auth__input" + (errors.email ? " wsw-auth__input--error" : "")}
                                placeholder="you@example.com"
                                autoComplete="email"
                                value={form.email}
                                onChange={(e) => updateField('email', e.target.value)}
                            />
                            {errors.email && <span className="wsw-auth__field-error">{errors.email}</span>}
                        </div>

                        <div className="wsw-auth__field">
                            <label className="wsw-auth__label" htmlFor="signup-password">Password</label>
                            <input
                                id="signup-password"
                                type="password"
                                className={"wsw-auth__input" + (errors.password ? " wsw-auth__input--error" : "")}
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={(e) => updateField('password', e.target.value)}
                            />
                            {errors.password ? (
                                <span className="wsw-auth__field-error">{errors.password}</span>
                            ) : (
                                <span className="wsw-auth__field-hint">{PASSWORD_HINT}</span>
                            )}
                        </div>

                        {errors.general && <p className="wsw-auth__error">{errors.general}</p>}

                        <button type="submit" className="wsw-auth__submit" disabled={submitting}>
                            {submitting ? "Creating account…" : "Register now"}
                        </button>
                    </form>

                    <div className="wsw-auth__footer">
                        <p>Already a member? <Link to="/login" className="wsw-auth__link">Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;