import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './auth.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  function validate(): boolean {
    const newErrors: { email?: string; password?: string } = {};
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate('/designs');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <div className="auth-panel__logo">
          <h1 className="auth-panel__app-name">WoodworX</h1>
          <img src="/logo.png" alt="WoodworX logo" className="auth-panel__logo-img" />
        </div>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h2>Sign In</h2>

          {apiError && <div className="auth-error-banner">{apiError}</div>}

          <div className={`auth-field ${errors.email ? 'auth-field-error' : ''}`}>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && <div className="auth-error-text">{errors.email}</div>}
          </div>

          <div className={`auth-field ${errors.password ? 'auth-field-error' : ''}`}>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && <div className="auth-error-text">{errors.password}</div>}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <span style={{ margin: '0 0.5rem' }}>·</span>
            <Link to="/register">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
