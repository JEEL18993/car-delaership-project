import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VehicleCard = ({ vehicle, onPurchase, onEdit, onDelete, onRestock, purchasingId }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  const isOutOfStock = vehicle.quantity === 0;
  const defaultImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="vehicle-card">
      <div className="vehicle-image-wrap">
        <img
          src={vehicle.image || defaultImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="vehicle-image"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="vehicle-badge-pos">
          <span className={`badge ${isOutOfStock ? 'badge-out-of-stock' : 'badge-in-stock'}`}>
            {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Left`}
          </span>
        </div>
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-card-header">
          <div>
            <h3 className="vehicle-card-title">
              {vehicle.year ? `${vehicle.year} ` : ''}{vehicle.make} {vehicle.model}
            </h3>
            <span className="badge badge-category" style={{ marginTop: '0.3rem' }}>
              {vehicle.category}
            </span>
          </div>
          <div className="vehicle-price-tag">${Number(vehicle.price).toLocaleString()}</div>
        </div>

        <div className="vehicle-specs-list">
          <span className="spec-pill">⛽ {vehicle.fuelType || 'Petrol/Hybrid'}</span>
          <span className="spec-pill">⚙️ {vehicle.transmission || 'Automatic'}</span>
          <span className="spec-pill">📦 Stock: {vehicle.quantity}</span>
        </div>

        <div className="vehicle-card-actions">
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
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <Link
                to={`/vehicles/${vehicle.id}`}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.55rem' }}
              >
                👁️ View Details
              </Link>
              <button
                type="button"
                onClick={() => onPurchase(vehicle.id)}
                disabled={isOutOfStock || purchasingId === vehicle.id || !isAuthenticated}
                className="btn btn-primary"
                style={{ flex: 1.2 }}
                aria-label={isOutOfStock ? `Out of stock: ${vehicle.make} ${vehicle.model}` : `Purchase ${vehicle.make} ${vehicle.model}`}
              >
                {!isAuthenticated
                  ? 'Login to Buy'
                  : isOutOfStock
                  ? 'Out of Stock'
                  : purchasingId === vehicle.id
                  ? 'Buying...'
                  : '🛒 Purchase'}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;
