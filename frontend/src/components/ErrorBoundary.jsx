import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ef4444' }}>Something went wrong</h1>
          <p style={{ color: '#64748b', margin: '1rem 0' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            style={{
              padding: '0.65rem 1.4rem',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear Cache & Restart App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
