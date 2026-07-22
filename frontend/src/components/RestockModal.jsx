import React, { useState } from 'react';

const RestockModal = ({ isOpen, vehicle, onClose, onSubmit, isSubmitting }) => {
  const [amount, setAmount] = useState(5);
  const [error, setError] = useState('');

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !Number.isInteger(numAmount)) {
      setError('Restock amount must be a positive integer.');
      return;
    }
    onSubmit(vehicle.id, numAmount);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Restock Inventory</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Add units to <strong>{vehicle.make} {vehicle.model}</strong> (Current Stock: {vehicle.quantity})
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="restock-amount">Quantity to Add</label>
            <input
              id="restock-amount"
              type="number"
              min="1"
              step="1"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-success">
              {isSubmitting ? 'Updating...' : 'Restock Units'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;
