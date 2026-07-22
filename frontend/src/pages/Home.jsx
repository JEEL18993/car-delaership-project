import React, { useState, useEffect } from 'react';
import { getVehicles, searchVehicles, purchaseVehicle } from '../api/vehicleApi';
import SearchFilters from '../components/SearchFilters';
import VehicleList from '../components/VehicleList';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [purchasingId, setPurchasingId] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getVehicles();
      setVehicles(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearch = async (filters) => {
    setLoading(true);
    setError('');
    try {
      const response = await searchVehicles(filters);
      setVehicles(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (vehicleId) => {
    setPurchasingId(vehicleId);
    setError('');
    setSuccess('');
    try {
      const res = await purchaseVehicle(vehicleId);
      setSuccess('Vehicle purchased successfully!');

      // Immediately update local state
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? res.data : v))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#0f172a' }}>
          Explore Vehicle Inventory
        </h1>
        <p style={{ color: '#64748b' }}>
          Browse premium vehicles, filter by make or price, and purchase directly.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <SearchFilters onSearch={handleSearch} onReset={fetchVehicles} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <VehicleList
          vehicles={vehicles}
          onPurchase={handlePurchase}
          purchasingId={purchasingId}
          onResetFilters={fetchVehicles}
        />
      )}
    </div>
  );
};

export default Home;
