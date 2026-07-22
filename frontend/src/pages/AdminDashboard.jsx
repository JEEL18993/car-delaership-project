import React, { useState, useEffect } from 'react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, restockVehicle } from '../api/vehicleApi';
import VehicleForm from '../components/VehicleForm';
import ConfirmDialog from '../components/ConfirmDialog';
import RestockModal from '../components/RestockModal';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [restockingVehicle, setRestockingVehicle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await getVehicles();
      setVehicles(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAddForm = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      if (editingVehicle) {
        const res = await updateVehicle(editingVehicle.id, formData);
        setSuccess('Vehicle updated successfully!');
        setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? res.data : v)));
      } else {
        const res = await createVehicle(formData);
        setSuccess('Vehicle added successfully!');
        setVehicles((prev) => [res.data, ...prev]);
      }
      setIsFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingVehicle) return;
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await deleteVehicle(deletingVehicle.id);
      setSuccess('Vehicle deleted successfully!');
      setVehicles((prev) => prev.filter((v) => v.id !== deletingVehicle.id));
      setDeletingVehicle(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestockSubmit = async (id, amount) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await restockVehicle(id, amount);
      setSuccess(`Restocked ${amount} units successfully!`);
      setVehicles((prev) => prev.map((v) => (v.id === id ? res.data : v)));
      setRestockingVehicle(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restock vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#0f172a' }}>
            Admin Inventory Dashboard
          </h1>
          <p style={{ color: '#64748b' }}>Manage dealership inventory: Add, update, delete, and restock vehicles.</p>
        </div>
        <button onClick={handleOpenAddForm} className="btn btn-primary">
          ➕ Add New Vehicle
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <LoadingSpinner message="Loading inventory..." />
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                    No vehicles found in inventory.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>
                      {v.year ? `${v.year} ` : ''}{v.make} {v.model}
                    </td>
                    <td>{v.category}</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>${Number(v.price).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${v.quantity === 0 ? 'badge-out-of-stock' : 'badge-in-stock'}`}>
                        {v.quantity} Units
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenEditForm(v)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setRestockingVehicle(v)}
                          className="btn btn-success"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          📦 Restock
                        </button>
                        <button
                          onClick={() => setDeletingVehicle(v)}
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
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
      )}

      {/* Vehicle Add/Edit Modal */}
      <VehicleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingVehicle}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingVehicle)}
        title="Delete Vehicle"
        message={`Are you sure you want to delete "${deletingVehicle?.make} ${deletingVehicle?.model}" from inventory? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingVehicle(null)}
        isDeleting={isSubmitting}
      />

      {/* Restock Modal */}
      <RestockModal
        isOpen={Boolean(restockingVehicle)}
        vehicle={restockingVehicle}
        onClose={() => setRestockingVehicle(null)}
        onSubmit={handleRestockSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminDashboard;
