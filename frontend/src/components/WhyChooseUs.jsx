import React from 'react';

const FEATURES = [
  {
    icon: '🛡️',
    title: 'Verified Vehicles',
    description: 'Every car undergoes a multi-point quality check before listing.'
  },
  {
    icon: '🔒',
    title: 'Secure Purchase',
    description: 'Instant encrypted inventory reservations and safe transactions.'
  },
  {
    icon: '🏷️',
    title: 'Transparent Pricing',
    description: 'No hidden fees or unexpected dealer surcharges.'
  },
  {
    icon: '🎧',
    title: 'Trusted Support',
    description: '24/7 dedicated automotive customer assistance team.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="section-container" style={{ backgroundColor: 'var(--bg-surface)', marginTop: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
      <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h2 className="section-title">Why Choose AutoDrive</h2>
          <p className="section-subtitle">Experience the next generation of car buying</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {FEATURES.map((feat) => (
          <div key={feat.title} style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{feat.icon}</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
              {feat.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
