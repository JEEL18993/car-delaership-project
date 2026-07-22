import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="vehicle-card" style={{ opacity: 0.7 }}>
      <div className="vehicle-image-wrap" style={{ backgroundColor: '#e2e8f0' }} />
      <div className="vehicle-card-body" style={{ gap: '0.75rem' }}>
        <div style={{ height: '20px', width: '70%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
        <div style={{ height: '14px', width: '40%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
        <div style={{ height: '28px', width: '50%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginTop: '0.5rem' }} />
        <div style={{ height: '40px', width: '100%', backgroundColor: '#cbd5e1', borderRadius: '8px', marginTop: '1rem' }} />
      </div>
    </div>
  );
};

export default SkeletonCard;
