import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import VehicleCard from '../components/VehicleCard';
import VehicleList from '../components/VehicleList';
import SearchFilters from '../components/SearchFilters';
import EmptyState from '../components/EmptyState';
import { AuthProvider } from '../context/AuthContext';

describe('Frontend Vehicle Workflows', () => {
  const sampleVehicle = {
    id: 'v100',
    make: 'Toyota',
    model: 'Corolla',
    year: 2023,
    category: 'Sedan',
    price: 22000,
    quantity: 3
  };

  const outOfStockVehicle = {
    ...sampleVehicle,
    id: 'v200',
    quantity: 0
  };

  test('Vehicle card displays vehicle information correctly', () => {
    render(
      <AuthProvider>
        <VehicleCard vehicle={sampleVehicle} />
      </AuthProvider>
    );

    expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('$22,000')).toBeInTheDocument();
    expect(screen.getByText('3 Available')).toBeInTheDocument();
  });

  test('Purchase button is disabled when vehicle quantity is zero', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Bob', role: 'user' }));

    render(
      <AuthProvider>
        <VehicleCard vehicle={outOfStockVehicle} />
      </AuthProvider>
    );

    const button = screen.getByRole('button', { name: /Out of Stock/i });
    expect(button).toBeDisabled();
  });

  test('Clicking Purchase calls the purchase handler function', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Bob', role: 'user' }));

    const handlePurchase = vi.fn();

    render(
      <AuthProvider>
        <VehicleCard vehicle={sampleVehicle} onPurchase={handlePurchase} />
      </AuthProvider>
    );

    const button = screen.getByRole('button', { name: /Purchase Now/i });
    fireEvent.click(button);

    expect(handlePurchase).toHaveBeenCalledWith('v100');
  });

  test('Search filters send correct query parameters on submit', () => {
    const handleSearch = vi.fn();

    render(<SearchFilters onSearch={handleSearch} onReset={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Make/i), { target: { value: 'Honda' } });
    fireEvent.change(screen.getByLabelText(/Min Price/i), { target: { value: '15000' } });

    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    expect(handleSearch).toHaveBeenCalledWith({
      make: 'Honda',
      model: '',
      category: '',
      minPrice: '15000',
      maxPrice: ''
    });
  });

  test('Empty state appears when no vehicles are available in list', () => {
    render(<VehicleList vehicles={[]} onResetFilters={() => {}} />);

    expect(screen.getByRole('heading', { name: /No Vehicles Found/i })).toBeInTheDocument();
  });
});

