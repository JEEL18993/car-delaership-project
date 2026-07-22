import React from 'react';

const STATS = [
  { value: '500+', label: 'Cars Listed' },
  { value: '1000+', label: 'Happy Customers' },
  { value: '20+', label: 'Trusted Brands' },
  { value: '24/7', label: 'Support Available' }
];

const StatsSection = () => {
  return (
    <section style={{ backgroundColor: 'var(--accent-navy)', color: '#ffffff', padding: '3rem 1.5rem', margin: '3rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-red)' }}>{stat.value}</div>
            <div style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 600, marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
