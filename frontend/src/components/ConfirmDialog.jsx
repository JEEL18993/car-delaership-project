import React from 'react';

const ConfirmDialog = ({ isOpen, title = 'Confirm Action', message, onConfirm, onCancel, isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '400px' }}>
        <h3 className="modal-title" style={{ marginBottom: '0.75rem' }}>
          {title}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{message}</p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="btn btn-danger">
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
