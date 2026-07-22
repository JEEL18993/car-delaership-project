import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import React from 'react';
import App from './App';

describe('App Component Rendering', () => {
  test('should render the application header and navigation links', () => {
    render(<App />);
    const inventoryLink = screen.getByText('Inventory');
    expect(inventoryLink).toBeInTheDocument();

    const loginLink = screen.getByText('Login');
    expect(loginLink).toBeInTheDocument();
  });
});
