import React from 'react';
import VehicleCard from './VehicleCard';
import EmptyState from './EmptyState';
import SkeletonCard from './SkeletonCard';

const VehicleList = ({ vehicles = [], loading = false, onPurchase, onEdit, onDelete, onRestock, purchasingId, onResetFilters }) => {
  if (loading) {
    return (
      <div className="vehicles-grid">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="vehicles-grid">
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
