import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import React from 'react';
import App from './App';

describe('App Component Rendering', () => {
  test('should render the application header and navigation links', () => {
    render(<App />);
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();

    const browseLinks = screen.getAllByText('Browse Cars');
    expect(browseLinks[0]).toBeInTheDocument();
  });
});
