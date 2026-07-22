import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vehicleApi } from '../api/vehicleApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const defaultImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const list = await vehicleApi.getVehicles();
        const found = list.find((v) => v.id === id);
        if (found) {
          setVehicle(found);
        } else {
          showToast('Vehicle not found', 'error');
          navigate('/browse');
        }
      } catch (err) {
        showToast('Failed to load vehicle details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id, navigate, showToast]);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const updated = await vehicleApi.purchaseVehicle(id);
      setVehicle(updated);
      showToast(`Congratulations! You purchased the ${updated.make} ${updated.model}!`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Purchase failed', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading car details..." />;
  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className="details-container">
      <Link to="/browse" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        ← Back to Browse Cars
      </Link>

      <div className="details-grid">
        {/* Left Side: Images & Detailed Specs */}
        <div>
          <div className="details-gallery">
            <img
              src={vehicle.image || defaultImage}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="details-main-img"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>

          <div style={{ marginTop: '2rem', backgroundColor: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
              Vehicle Overview & Specifications
            </h3>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {vehicle.description || `Experience outstanding driving performance and elegance with the ${vehicle.year || ''} ${vehicle.make} ${vehicle.model}. Designed for modern drivers seeking reliability, comfort, and advanced features.`}
            </p>

            <div className="specs-grid-box">
              <div className="spec-box-item">
                <span>Make & Manufacturer</span>
                <strong>{vehicle.make}</strong>
              </div>
              <div className="spec-box-item">
                <span>Model Name</span>
                <strong>{vehicle.model}</strong>
              </div>
              <div className="spec-box-item">
                <span>Body Style Category</span>
                <strong>{vehicle.category}</strong>
              </div>
              <div className="spec-box-item">
                <span>Year of Production</span>
                <strong>{vehicle.year || '2023'}</strong>
              </div>
              <div className="spec-box-item">
                <span>Fuel Type</span>
                <strong>{vehicle.fuelType || 'Petrol / Hybrid'}</strong>
              </div>
              <div className="spec-box-item">
                <span>Transmission</span>
                <strong>{vehicle.transmission || 'Automatic'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Purchase Panel */}
        <div>
          <div className="details-panel">
            <span className={`badge ${isOutOfStock ? 'badge-out-of-stock' : 'badge-in-stock'}`}>
              {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Available in Showroom`}
            </span>

            <h1 className="details-title" style={{ marginTop: '0.75rem' }}>
              {vehicle.year ? `${vehicle.year} ` : ''}{vehicle.make} {vehicle.model}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{vehicle.category} Class Vehicle</p>

            <div className="details-price">${Number(vehicle.price).toLocaleString()}</div>

            <div style={{ margin: '1.5rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ex-Showroom Price</span>
                <strong>${Number(vehicle.price).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Stock Status</span>
                <strong style={{ color: isOutOfStock ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                  {isOutOfStock ? 'Sold Out' : `${vehicle.quantity} Units Left`}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePurchase}
              disabled={isOutOfStock || purchasing || !isAuthenticated}
              className="btn btn-primary btn-block"
              style={{ padding: '0.85rem' }}
            >
              {!isAuthenticated
                ? 'Login to Purchase'
                : isOutOfStock
                ? 'Out of Stock'
                : purchasing
                ? 'Processing Order...'
                : '🛒 Confirm & Purchase Vehicle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
