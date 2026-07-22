import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="empty-state" style={{ maxWidth: '500px', margin: '4rem auto' }}>
      <h1 style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '0.5rem' }}>404</h1>
      <h3>Page Not Found</h3>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
        🏠 Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
