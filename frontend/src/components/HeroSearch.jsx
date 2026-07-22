import React, { useState } from 'react';

const HeroSearch = ({ onSearch }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ make, model, category, minPrice, maxPrice });
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">Find the Right Car for Your Journey</h1>
        <p className="hero-subtitle">
          Explore thousands of verified new and pre-owned vehicles with transparent pricing.
        </p>

        <div className="hero-search-panel">
          <form className="hero-search-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="hero-make">Make</label>
              <input
                id="hero-make"
                type="text"
                className="form-control"
                placeholder="e.g. Toyota, Honda"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hero-model">Model</label>
              <input
                id="hero-model"
                type="text"
                className="form-control"
                placeholder="e.g. Camry, Civic"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hero-category">Body Style</label>
              <select
                id="hero-category"
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
              <label htmlFor="hero-minPrice">Min Price ($)</label>
              <input
                id="hero-minPrice"
                type="number"
                className="form-control"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hero-maxPrice">Max Price ($)</label>
              <input
                id="hero-maxPrice"
                type="number"
                className="form-control"
                placeholder="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div>
              <button type="submit" className="btn btn-primary btn-block">
                🔍 Search Cars
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
