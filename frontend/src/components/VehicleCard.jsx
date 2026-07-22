import React from 'react';
import { useAuth } from '../context/AuthContext';

const VehicleCard = ({ vehicle, onPurchase, onEdit, onDelete, onRestock, purchasingId }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  const isOutOfStock = vehicle.quantity === 0;
  const defaultImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="vehicle-card">
      <div className="vehicle-image-container">
        <img
          src={vehicle.image || defaultImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="vehicle-image"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <span className={`badge ${isOutOfStock ? 'badge-out-of-stock' : 'badge-in-stock'}`}>
          {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Available`}
        </span>
      </div>

      <div className="vehicle-content">
        <h3 className="vehicle-title">
          {vehicle.year ? `${vehicle.year} ` : ''}{vehicle.make} {vehicle.model}
        </h3>
        <p className="vehicle-subtitle">{vehicle.category}</p>

        {vehicle.description && (
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            {vehicle.description}
          </p>
        )}

        <div className="vehicle-meta">
          <span className="vehicle-price">${Number(vehicle.price).toLocaleString()}</span>
          <span className="vehicle-quantity">Stock: {vehicle.quantity}</span>
        </div>

        <div className="card-actions">
          {isAdmin ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', width: '100%' }}>
              <button
                type="button"
                onClick={() => onEdit(vehicle)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                onClick={() => onRestock(vehicle)}
                className="btn btn-success"
                style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                aria-label={`Restock ${vehicle.make} ${vehicle.model}`}
              >
                📦 Restock
              </button>
              <button
                type="button"
                onClick={() => onDelete(vehicle)}
                className="btn btn-danger"
                style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
              >
                🗑️ Delete
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onPurchase(vehicle.id)}
              disabled={isOutOfStock || purchasingId === vehicle.id || !isAuthenticated}
              className="btn btn-primary"
              style={{ width: '100%' }}
              aria-label={`Purchase ${vehicle.make} ${vehicle.model}`}
            >
              {!isAuthenticated
                ? 'Login to Purchase'
                : isOutOfStock
                ? 'Out of Stock'
                : purchasingId === vehicle.id
                ? 'Processing...'
                : '🛒 Purchase Now'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;
