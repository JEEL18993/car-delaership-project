import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../api/authApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      login(data.token, data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      let msg = 'Login failed. Please check your credentials.';
      if (!err.response) {
        msg = 'Cannot connect to backend server! Please make sure backend is running (run `npm run dev` from root).';
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@example.com');
    setPassword('AdminPassword123!');
  };

  const handleQuickFillUser = () => {
    setEmail('omgohel51@gmail.com');
    setPassword('Password123!');
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-visual-side">
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          Drive Your Dreams Forward
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#e2e8f0', lineHeight: 1.6 }}>
          Sign in to access exclusive dealership deals, manage your saved vehicles, and purchase cars directly online.
        </p>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
            Account Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Enter your email and password to access AutoDrive
          </p>

          {error && (
            <div style={{ backgroundColor: 'var(--accent-red-light)', color: '#991b1b', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Quick Demo Logins:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
              >
                ⚡ Admin Login
              </button>
              <button
                type="button"
                onClick={handleQuickFillUser}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
              >
                👤 User Login
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
