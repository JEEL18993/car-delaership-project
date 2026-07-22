import React from 'react';

const EmptyState = ({ message = 'No vehicles found matching your search criteria.', onReset }) => {
  return (
    <div className="empty-state">
      <h3>🚗 No Vehicles Found</h3>
      <p>{message}</p>
      {onReset && (
        <button onClick={onReset} className="btn btn-secondary">
          Reset All Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
