import React, { useState } from 'react';

const SearchFilters = ({ onSearch, onReset }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ make, model, category, minPrice, maxPrice });
  };

  const handleReset = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onReset();
  };

  return (
    <div className="filter-card">
      <form onSubmit={handleSubmit} className="filter-grid">
        <div className="form-group">
          <label htmlFor="make">Make</label>
          <input
            id="make"
            type="text"
            className="form-control"
            placeholder="e.g. Toyota, Honda"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            id="model"
            type="text"
            className="form-control"
            placeholder="e.g. Camry, Civic"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Electric">Electric</option>
            <option value="Coupe">Coupe</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="minPrice">Min Price ($)</label>
          <input
            id="minPrice"
            type="number"
            className="form-control"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxPrice">Max Price ($)</label>
          <input
            id="maxPrice"
            type="number"
            className="form-control"
            placeholder="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            🔍 Search
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
