import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import HeroSearch from '../components/HeroSearch';
import PopularBrands from '../components/PopularBrands';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

describe('Frontend Marketplace Vehicle Workflows', () => {
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

  test('Vehicle card displays vehicle title, INR price, category badge, and details button', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <VehicleCard vehicle={sampleVehicle} />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Toyota Corolla/i)).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('₹22,000')).toBeInTheDocument();
    expect(screen.getByText('3 Left')).toBeInTheDocument();
    expect(screen.getByText(/View Details/i)).toBeInTheDocument();
  });

  test('Purchase button is disabled when vehicle quantity is zero', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Bob', role: 'user' }));

    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <VehicleCard vehicle={outOfStockVehicle} />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /Out of stock/i });
    expect(button).toBeDisabled();
  });

  test('Clicking Purchase calls the purchase handler function', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Bob', role: 'user' }));

    const handlePurchase = vi.fn();

    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <VehicleCard vehicle={sampleVehicle} onPurchase={handlePurchase} />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /Purchase/i });
    fireEvent.click(button);

    expect(handlePurchase).toHaveBeenCalledWith('v100');
  });

  test('HeroSearch form submits search filters correctly', () => {
    const handleSearch = vi.fn();

    render(<HeroSearch onSearch={handleSearch} />);

    fireEvent.change(screen.getByLabelText(/Make/i), { target: { value: 'Honda' } });
    fireEvent.change(screen.getByLabelText(/Min Price/i), { target: { value: '15000' } });

    fireEvent.click(screen.getByRole('button', { name: /Search Cars/i }));

    expect(handleSearch).toHaveBeenCalledWith({
      make: 'Honda',
      model: '',
      category: '',
      minPrice: '15000',
      maxPrice: ''
    });
  });

  test('PopularBrands card click triggers brand filter handler', () => {
    const handleSelectBrand = vi.fn();

    render(<PopularBrands onSelectBrand={handleSelectBrand} />);

    fireEvent.click(screen.getByText('Toyota'));

    expect(handleSelectBrand).toHaveBeenCalledWith('Toyota');
  });
});
