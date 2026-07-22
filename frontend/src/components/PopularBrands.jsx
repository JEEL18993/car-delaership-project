import React from 'react';

const BRANDS = [
  { name: 'Toyota', icon: '🚘' },
  { name: 'Honda', icon: '🏎️' },
  { name: 'Hyundai', icon: '🚙' },
  { name: 'Tata', icon: '🚗' },
  { name: 'Mahindra', icon: '🛻' },
  { name: 'BMW', icon: '⚡' },
  { name: 'Audi', icon: '✨' },
  { name: 'Ford', icon: '🚙' }
];

const PopularBrands = ({ onSelectBrand }) => {
  return (
    <section className="section-container" style={{ paddingTop: '2.5rem', paddingBottom: '1rem' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Popular Brands</h2>
          <p className="section-subtitle">Explore vehicles by top trusted manufacturers</p>
        </div>
      </div>

      <div className="brands-grid">
        {BRANDS.map((brand) => (
          <div
            key={brand.name}
            className="brand-card"
            onClick={() => onSelectBrand(brand.name)}
            role="button"
            tabIndex={0}
            aria-label={`Filter cars by ${brand.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectBrand(brand.name);
            }}
          >
            <div className="brand-icon">{brand.icon}</div>
            <div className="brand-name">{brand.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularBrands;
