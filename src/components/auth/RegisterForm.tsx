import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './auth.css';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  function validate(): boolean {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register(email, password);
      navigate('/designs');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h2>Create Account</h2>

        {apiError && <div className="auth-error-banner">{apiError}</div>}

        <div className={`auth-field ${errors.email ? 'auth-field-error' : ''}`}>
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <div className="auth-error-text">{errors.email}</div>}
        </div>

        <div className={`auth-field ${errors.password ? 'auth-field-error' : ''}`}>
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {errors.password && <div className="auth-error-text">{errors.password}</div>}
        </div>

        <div className={`auth-field ${errors.confirmPassword ? 'auth-field-error' : ''}`}>
          <label htmlFor="register-confirm">Confirm Password</label>
          <input
            id="register-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <div className="auth-error-text">{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="auth-links">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
