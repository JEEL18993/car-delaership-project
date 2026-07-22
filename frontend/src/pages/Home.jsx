import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import PopularBrands from '../components/PopularBrands';
import VehicleList from '../components/VehicleList';
import WhyChooseUs from '../components/WhyChooseUs';
import StatsSection from '../components/StatsSection';
import { vehicleApi } from '../api/vehicleApi';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.getVehicles();
      setVehicles(data);
    } catch (err) {
      showToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

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
      setVehicles((prev) => prev.map((v) => (v.id === id ? updatedVehicle : v)));
      showToast(`Successfully purchased ${updatedVehicle.make} ${updatedVehicle.model}!`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Purchase failed', 'error');
    } finally {
      setPurchasingId(null);
    }
  };

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

        <VehicleList
          vehicles={vehicles.slice(0, 6)}
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
