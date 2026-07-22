import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import PopularBrands from '../components/PopularBrands';
import VehicleList from '../components/VehicleList';
import WhyChooseUs from '../components/WhyChooseUs';
import StatsSection from '../components/StatsSection';
import { vehicleApi } from '../api/vehicleApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.getVehicles();
      const list = Array.isArray(data) ? data : (data?.data || []);
      setVehicles(list);
    } catch (err) {
      if (err.response?.status === 401) {
        setVehicles([]);
      } else {
        showToast('Failed to load inventory', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchVehicles();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleHeroSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters.make) params.set('make', filters.make);
    if (filters.model) params.set('model', filters.model);
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    navigate(`/browse?${params.toString()}`);
  };

  const handleSelectBrand = (brandName) => {
    navigate(`/browse?make=${encodeURIComponent(brandName)}`);
  };

  const handlePurchase = async (id) => {
    setPurchasingId(id);
    try {
      const updatedVehicle = await vehicleApi.purchaseVehicle(id);
      setVehicles((prev) => (Array.isArray(prev) ? prev : []).map((v) => (v.id === id ? updatedVehicle : v)));
      showToast(`Successfully purchased ${updatedVehicle.make} ${updatedVehicle.model}!`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Purchase failed', 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  const vehicleListArray = Array.isArray(vehicles) ? vehicles : [];

  return (
    <div>
      <HeroSearch onSearch={handleHeroSearch} />

      <PopularBrands onSelectBrand={handleSelectBrand} />

      {/* Featured Vehicles Grid */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Vehicles</h2>
            <p className="section-subtitle">Handpicked top deals available for immediate purchase</p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/browse')}
          >
            View All Cars →
          </button>
        </div>

        {!isAuthenticated && (
          <div style={{ backgroundColor: 'var(--accent-red-light)', color: '#991b1b', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <strong style={{ fontSize: '1.05rem', display: 'block' }}>🔒 Guest Visitor Notice</strong>
              <span style={{ fontSize: '0.9rem' }}>Please log in to your AutoDrive account to view protected vehicle pricing and purchase cars online.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}>
                Sign In Now
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}>
                Register Free
              </Link>
            </div>
          </div>
        )}

        <VehicleList
          vehicles={vehicleListArray.slice(0, 6)}
          loading={loading}
          onPurchase={handlePurchase}
          purchasingId={purchasingId}
          onResetFilters={() => navigate('/browse')}
        />
      </section>

      <WhyChooseUs />

      <StatsSection />
    </div>
  );
};

export default Home;
