import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { vehicleApi } from '../api/vehicleApi';
import VehicleList from '../components/VehicleList';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const BrowseCars = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);
  const [sortBy, setSortBy] = useState('price-asc');

  // Filters state
  const [make, setMake] = useState(searchParams.get('make') || '');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [location, setLocation] = useState('');
  const [featured, setFeatured] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchVehicles = async (filters = {}) => {
    setLoading(true);
    try {
      let data;
      const hasFilters = Object.values(filters).some((val) => val !== '' && val !== null && val !== undefined);
      if (hasFilters) {
        data = await vehicleApi.searchVehicles(filters);
      } else {
        data = await vehicleApi.getVehicles();
      }
      const list = Array.isArray(data) ? data : (data?.data || []);
      setVehicles(list);
    } catch (err) {
      if (err.response?.status === 401) {
        setVehicles([]);
      } else {
        showToast(err.response?.data?.message || 'Failed to load vehicle catalog', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialMake = searchParams.get('make') || '';
    setMake(initialMake);
    if (isAuthenticated) {
      fetchVehicles(initialMake ? { make: initialMake } : {});
    } else {
      setLoading(false);
    }
  }, [searchParams, isAuthenticated]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      fetchVehicles({ make, model, category, fuelType, transmission, location, featured, minPrice, maxPrice });
    }
  };

  const handleResetFilters = () => {
    setMake('');
    setModel('');
    setCategory('');
    setFuelType('');
    setTransmission('');
    setLocation('');
    setFeatured('');
    setMinPrice('');
    setMaxPrice('');
    if (isAuthenticated) fetchVehicles({});
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

  // Sort logic
  const sortedVehicles = [...vehicleListArray].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name-asc') return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
    if (sortBy === 'stock-desc') return b.quantity - a.quantity;
    return 0;
  });

  return (
    <div className="section-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Browse Vehicle Catalog</h1>
        <p className="section-subtitle">Explore and filter verified cars from top manufacturers</p>
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

      <div className="browse-layout">
        {/* Desktop Filter Sidebar */}
        <aside className="filter-sidebar">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '1.25rem' }}>
            Filter Options
          </h3>

          <form onSubmit={handleFilterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="browse-make">Make / Brand</label>
              <input
                id="browse-make"
                type="text"
                className="form-control"
                placeholder="e.g. Maruti, Hyundai, Tata"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="browse-model">Model Name</label>
              <input
                id="browse-model"
                type="text"
                className="form-control"
                placeholder="e.g. Creta, Swift, Nexon"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="browse-category">Category</label>
              <select
                id="browse-category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Compact SUV">Compact SUV</option>
                <option value="MUV">MUV</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="browse-fuelType">Fuel Type</label>
              <select
                id="browse-fuelType"
                className="form-control"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="browse-transmission">Transmission</label>
              <select
                id="browse-transmission"
                className="form-control"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              >
                <option value="">All Transmissions</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="browse-location">City / Location</label>
              <input
                id="browse-location"
                type="text"
                className="form-control"
                placeholder="e.g. Ahmedabad, Mumbai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="browse-minPrice">Min Price (₹)</label>
              <input
                id="browse-minPrice"
                type="number"
                className="form-control"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="browse-maxPrice">Max Price (₹)</label>
              <input
                id="browse-maxPrice"
                type="number"
                className="form-control"
                placeholder="3000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              🔍 Apply Filters
            </button>
            <button type="button" onClick={handleResetFilters} className="btn btn-secondary btn-block">
              Reset Filters
            </button>
          </form>
        </aside>

        {/* Main Content & Toolbar */}
        <main>
          <div className="browse-toolbar">
            <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
              Showing {sortedVehicles.length} Vehicles
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label htmlFor="sort-dropdown" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Sort By:
              </label>
              <select
                id="sort-dropdown"
                className="form-control"
                style={{ width: 'auto' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="stock-desc">Stock: High to Low</option>
              </select>
            </div>
          </div>

          <VehicleList
            vehicles={sortedVehicles}
            loading={loading}
            onPurchase={handlePurchase}
            purchasingId={purchasingId}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>
    </div>
  );
};

export default BrowseCars;
