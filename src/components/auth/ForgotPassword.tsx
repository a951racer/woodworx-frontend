import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './auth.css';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);

  function validate(): boolean {
    const newErrors: { email?: string } = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError('');
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Something went wrong. Please try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h2>Reset Password</h2>

        {apiError && <div className="auth-error-banner">{apiError}</div>}
        {success && (
          <div className="auth-success-banner">
            If an account exists with that email, a reset link has been sent.
          </div>
        )}

        <div className={`auth-field ${errors.email ? 'auth-field-error' : ''}`}>
          <label htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <div className="auth-error-text">{errors.email}</div>}
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="auth-links">
          <Link to="/login">Back to sign in</Link>
        </div>
      </form>
    </div>
  );
}
