import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

const VehicleCard = ({ vehicle, onPurchase, onEdit, onDelete, onRestock, purchasingId }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  const isOutOfStock = Number(vehicle.quantity || 0) === 0;
  const fallbackImage = '/images/car-placeholder.jpg';

  return (
    <article className="vehicle-card">
      <div className="vehicle-image-wrap">
        <img
          src={vehicle.image || fallbackImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="vehicle-image"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <div className="vehicle-badge-pos" style={{ display: 'flex', gap: '0.4rem' }}>
          {vehicle.featured && <span className="badge" style={{ backgroundColor: '#f97316', color: '#fff' }}>Featured</span>}
          {vehicle.condition && <span className="badge badge-category">{vehicle.condition}</span>}
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
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem' }}>
              <span className="badge badge-category">{vehicle.category}</span>
              {vehicle.location && <span className="badge badge-category">📍 {vehicle.location}</span>}
            </div>
          </div>
          <div className="vehicle-price-tag">{formatPrice(vehicle.price)}</div>
        </div>

        {vehicle.shortDescription && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0', lineHeight: 1.4 }}>
            {vehicle.shortDescription}
          </p>
        )}

        <div className="vehicle-specs-list">
          <span className="spec-pill">⛽ {vehicle.fuelType || 'Petrol'}</span>
          <span className="spec-pill">⚙️ {vehicle.transmission || 'Manual'}</span>
          {vehicle.mileage && <span className="spec-pill">🛣️ {vehicle.mileage}</span>}
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
