import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vehicleApi } from '../api/vehicleApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [activeImage, setActiveImage] = useState('');

  const fallbackImage = '/images/car-placeholder.jpg';

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const list = await vehicleApi.getVehicles();
        const found = list.find((v) => String(v.id) === String(id));
        if (found) {
          setVehicle(found);
          setActiveImage(found.image || (found.images && found.images[0]) || fallbackImage);
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

  if (loading) return <LoadingSpinner message="Loading vehicle specifications..." />;
  if (!vehicle) return null;

  const isOutOfStock = Number(vehicle.quantity || 0) === 0;
  const galleryImages = Array.isArray(vehicle.images) && vehicle.images.length > 0
    ? vehicle.images
    : [vehicle.image || fallbackImage];

  return (
    <div className="details-container">
      <Link to="/browse" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        ← Back to Browse Cars
      </Link>

      <div className="details-grid">
        {/* Left Column: Gallery & Comprehensive Specs */}
        <div>
          <div className="details-gallery">
            <img
              src={activeImage || fallbackImage}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="details-main-img"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto' }}>
                {galleryImages.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setActiveImage(imgUrl)}
                    onError={(e) => { e.currentTarget.src = fallbackImage; }}
                    style={{
                      width: '80px',
                      height: '55px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: activeImage === imgUrl ? '2px solid var(--accent-red)' : '1px solid var(--border-color)'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem', backgroundColor: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
              Vehicle Overview & Specifications
            </h3>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {vehicle.description || vehicle.shortDescription || `Experience outstanding driving performance and comfort with the ${vehicle.year || ''} ${vehicle.make} ${vehicle.model}. Designed for modern drivers seeking reliability, technology, and style.`}
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
              {vehicle.year && (
                <div className="spec-box-item">
                  <span>Year of Manufacture</span>
                  <strong>{vehicle.year}</strong>
                </div>
              )}
              {vehicle.fuelType && (
                <div className="spec-box-item">
                  <span>Fuel Type</span>
                  <strong>{vehicle.fuelType}</strong>
                </div>
              )}
              {vehicle.transmission && (
                <div className="spec-box-item">
                  <span>Transmission</span>
                  <strong>{vehicle.transmission}</strong>
                </div>
              )}
              {vehicle.mileage && (
                <div className="spec-box-item">
                  <span>Certified Mileage / Range</span>
                  <strong>{vehicle.mileage}</strong>
                </div>
              )}
              {vehicle.engine && (
                <div className="spec-box-item">
                  <span>Engine Displacement</span>
                  <strong>{vehicle.engine}</strong>
                </div>
              )}
              {vehicle.seatingCapacity && (
                <div className="spec-box-item">
                  <span>Seating Capacity</span>
                  <strong>{vehicle.seatingCapacity} Seater</strong>
                </div>
              )}
              {vehicle.color && (
                <div className="spec-box-item">
                  <span>Exterior Color</span>
                  <strong>{vehicle.color}</strong>
                </div>
              )}
              {vehicle.location && (
                <div className="spec-box-item">
                  <span>Showroom Location</span>
                  <strong>📍 {vehicle.location}</strong>
                </div>
              )}
            </div>

            {/* Key Features List */}
            {Array.isArray(vehicle.features) && vehicle.features.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
                  Key Equipment & Features
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {vehicle.features.map((feature, i) => (
                    <span key={i} className="spec-pill" style={{ backgroundColor: 'var(--accent-red-light)', color: '#991b1b', fontSize: '0.85rem' }}>
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Purchase Panel */}
        <div>
          <div className="details-panel">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {vehicle.featured && <span className="badge" style={{ backgroundColor: '#f97316', color: '#fff' }}>Featured</span>}
              {vehicle.condition && <span className="badge badge-category">{vehicle.condition}</span>}
              <span className={`badge ${isOutOfStock ? 'badge-out-of-stock' : 'badge-in-stock'}`}>
                {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Available in Showroom`}
              </span>
            </div>

            <h1 className="details-title" style={{ marginTop: '0.5rem' }}>
              {vehicle.year ? `${vehicle.year} ` : ''}{vehicle.make} {vehicle.model}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {vehicle.category} • {vehicle.fuelType || 'Petrol'} • {vehicle.location || 'India'}
            </p>

            <div className="details-price">{formatPrice(vehicle.price)}</div>

            <div style={{ margin: '1.5rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ex-Showroom Price</span>
                <strong>{formatPrice(vehicle.price)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Inventory Units</span>
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
