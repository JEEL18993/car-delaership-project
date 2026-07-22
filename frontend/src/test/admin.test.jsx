import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import AdminRoute from '../components/AdminRoute';
import VehicleForm from '../components/VehicleForm';
import ConfirmDialog from '../components/ConfirmDialog';
import RestockModal from '../components/RestockModal';

describe('Frontend Admin Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Normal users cannot access the admin route and are redirected to home', () => {
    localStorage.setItem('token', 'user-token');
    localStorage.setItem('user', JSON.stringify({ name: 'User', role: 'user' }));

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<div>Home Page</div>} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <div>Admin Panel</div>
                  </AdminRoute>
                }
              />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).toBeNull();
  });

  test('Admin can open and submit the vehicle form with valid data', () => {
    const handleSubmit = vi.fn();

    render(
      <VehicleForm
        isOpen={true}
        onClose={() => {}}
        onSubmit={handleSubmit}
      />
    );

    expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Make \*/i), { target: { value: 'BMW' } });
    fireEvent.change(screen.getByLabelText(/Model \*/i), { target: { value: 'M3' } });
    fireEvent.change(screen.getByLabelText(/Price \(\$\) \*/i), { target: { value: '75000' } });
    fireEvent.change(screen.getByLabelText(/Initial Stock Quantity \*/i), { target: { value: '2' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Vehicle/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        make: 'BMW',
        model: 'M3',
        price: 75000,
        quantity: 2
      })
    );
  });

  test('Delete requires confirmation before actioning', () => {
    const handleConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle?"
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Delete Vehicle')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Yes, Delete/i }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  test('Restock modal requires a valid positive integer amount', () => {
    const handleSubmit = vi.fn();
    const sampleVehicle = { id: 'v1', make: 'Ford', model: 'Focus', quantity: 2 };

    render(
      <RestockModal
        isOpen={true}
        vehicle={sampleVehicle}
        onClose={() => {}}
        onSubmit={handleSubmit}
        isSubmitting={false}
      />
    );

    expect(screen.getByText(/Restock Inventory/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Quantity to Add/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /Restock Units/i }));

    expect(handleSubmit).toHaveBeenCalledWith('v1', 10);
  });
});
