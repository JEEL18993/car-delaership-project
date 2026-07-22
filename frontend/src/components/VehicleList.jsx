import React from 'react';
import VehicleCard from './VehicleCard';
import EmptyState from './EmptyState';

const VehicleList = ({ vehicles, onPurchase, onEdit, onDelete, onRestock, purchasingId, onResetFilters }) => {
  if (!vehicles || vehicles.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="vehicle-grid">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestock={onRestock}
          purchasingId={purchasingId}
        />
      ))}
    </div>
  );
};

export default VehicleList;
