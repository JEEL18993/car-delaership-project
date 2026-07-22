import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import Login from '../pages/Login';
import Register from '../pages/Register';

const TestAuthConsumer = () => {
  const { user, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <span data-testid="user-email">{user?.email || 'No User'}</span>
      <span data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Logged Out'}</span>
      <button onClick={logout}>Logout Button</button>
    </div>
  );
};

describe('Frontend Authentication Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Register form validates required fields', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Register />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Full Name \*/i);
    const emailInput = screen.getByLabelText(/Email Address \*/i);
    const passwordInput = screen.getByPlaceholderText('••••••••');

    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('Login form validates required fields', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Login />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByPlaceholderText('••••••••');

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('Successful login stores authentication data in localStorage', () => {
    const fakeToken = 'mock-jwt-token-123';
    const fakeUser = { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'user' };

    const Wrapper = () => {
      const { login } = useAuth();
      return <button onClick={() => login(fakeToken, fakeUser)}>Do Login</button>;
    };

    render(
      <AuthProvider>
        <ToastProvider>
          <Wrapper />
          <TestAuthConsumer />
        </ToastProvider>
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Do Login'));

    expect(localStorage.getItem('token')).toBe(fakeToken);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(fakeUser);
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
  });

  test('Logout clears authentication data from localStorage', () => {
    localStorage.setItem('token', 'old-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Alice', role: 'user' }));

    render(
      <AuthProvider>
        <ToastProvider>
          <TestAuthConsumer />
        </ToastProvider>
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');

    fireEvent.click(screen.getByText('Logout Button'));

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
  });
});
