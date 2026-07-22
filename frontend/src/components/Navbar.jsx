import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <header className="navbar" role="banner">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="AutoDrive Dealership Marketplace">
          🚘 Auto<span>Drive</span>
        </Link>

        {/* Desktop Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/browse" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Browse Cars
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Admin Dashboard
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="nav-user-menu">
              <button
                type="button"
                className="user-badge-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-label="User Profile Options"
              >
                👤 {user?.name} {user?.role === 'admin' ? '(Admin)' : ''} ▾
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-info">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-secondary btn-block"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/browse" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Browse Cars
            </Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <button type="button" onClick={handleLogout} className="btn btn-secondary btn-block">
                Logout ({user?.name})
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-block" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-block" onClick={() => setIsMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
