import React, { useState, useEffect } from 'react';
import { vehicleApi } from '../api/vehicleApi';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatters';
import VehicleForm from '../components/VehicleForm';
import ConfirmDialog from '../components/ConfirmDialog';
import RestockModal from '../components/RestockModal';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { showToast } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [restockingVehicle, setRestockingVehicle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.getVehicles();
      const list = Array.isArray(data) ? data : (data?.data || []);
      setVehicles(list);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const vehicleListArray = Array.isArray(vehicles) ? vehicles : [];

  // Summary Metrics
  const totalVehicles = vehicleListArray.length;
  const availableVehicles = vehicleListArray.filter((v) => v.quantity > 0).length;
  const outOfStockVehicles = vehicleListArray.filter((v) => v.quantity === 0).length;
  const totalInventoryUnits = vehicleListArray.reduce((sum, v) => sum + Number(v.quantity || 0), 0);

  // Search Filter
  const filteredVehicles = vehicleListArray.filter((v) =>
    `${v.make} ${v.model} ${v.category}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form Handlers
  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingVehicle) {
        const updated = await vehicleApi.updateVehicle(editingVehicle.id, formData);
        setVehicles((prev) => (Array.isArray(prev) ? prev : []).map((v) => (v.id === editingVehicle.id ? updated : v)));
        showToast(`Vehicle ${updated.make} ${updated.model} updated successfully!`, 'success');
      } else {
        const created = await vehicleApi.createVehicle(formData);
        setVehicles((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
        showToast(`Vehicle ${created.make} ${created.model} created successfully!`, 'success');
      }
      setIsFormOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deletingVehicle) return;
    setIsSubmitting(true);
    try {
      await vehicleApi.deleteVehicle(deletingVehicle.id);
      setVehicles((prev) => (Array.isArray(prev) ? prev : []).filter((v) => v.id !== deletingVehicle.id));
      showToast(`Vehicle ${deletingVehicle.make} ${deletingVehicle.model} deleted`, 'info');
      setDeletingVehicle(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete vehicle', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Restock Handler
  const handleRestockSubmit = async (id, amount) => {
    setIsSubmitting(true);
    try {
      const updated = await vehicleApi.restockVehicle(id, amount);
      setVehicles((prev) => (Array.isArray(prev) ? prev : []).map((v) => (v.id === id ? updated : v)));
      showToast(`Restocked ${amount} units for ${updated.make} ${updated.model}!`, 'success');
      setRestockingVehicle(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Restock failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Inventory Management Dashboard..." />;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">⚡ Admin Portal</div>
        <nav>
          <a href="#inventory" className="admin-nav-item active">
            🚘 Vehicle Inventory
          </a>
          <a href="#analytics" className="admin-nav-item">
            📊 Sales & Stock Logs
          </a>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="section-title">Inventory Management</h1>
            <p className="section-subtitle">Add, update, restock, and manage dealership inventory</p>
          </div>
          <button type="button" onClick={handleOpenAdd} className="btn btn-primary">
            ➕ Add New Vehicle
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="stats-overview-grid">
          <div className="stat-card">
            <div className="stat-card-label">Total Car Models</div>
            <div className="stat-card-value">{totalVehicles}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Available Models</div>
            <div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{availableVehicles}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Out of Stock Models</div>
            <div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>{outOfStockVehicles}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Total Units in Showroom</div>
            <div className="stat-card-value">{totalInventoryUnits}</div>
          </div>
        </div>

        {/* Toolbar & Search Bar */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search inventory by make, model or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Responsive Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Category</th>
                <th>Price (INR)</th>
                <th>Quantity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No vehicles found matching search.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <strong>{vehicle.year ? `${vehicle.year} ` : ''}{vehicle.make} {vehicle.model}</strong>
                    </td>
                    <td>{vehicle.category}</td>
                    <td>{formatPrice(vehicle.price)}</td>
                    <td>{vehicle.quantity}</td>
                    <td>
                      <span className={`badge ${vehicle.quantity === 0 ? 'badge-out-of-stock' : 'badge-in-stock'}`}>
                        {vehicle.quantity === 0 ? 'Out of Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(vehicle)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setRestockingVehicle(vehicle)}
                          className="btn btn-success"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          📦 Restock
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingVehicle(vehicle)}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modals */}
      <VehicleForm
        isOpen={isFormOpen}
        initialData={editingVehicle}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={!!deletingVehicle}
        title="Delete Vehicle"
        message={`Are you sure you want to delete ${deletingVehicle?.make} ${deletingVehicle?.model}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingVehicle(null)}
        isDeleting={isSubmitting}
      />

      <RestockModal
        isOpen={!!restockingVehicle}
        vehicle={restockingVehicle}
        onClose={() => setRestockingVehicle(null)}
        onSubmit={handleRestockSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminDashboard;
