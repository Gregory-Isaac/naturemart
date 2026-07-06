import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';
import API from '../../api/client';

jest.mock('../../api/client', () => ({
  post: jest.fn(),
  get: jest.fn(),
  interceptors: { request: { use: jest.fn() } },
}));

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

function AuthConsumer() {
  const { user, token, login, signup, logout, devLogin } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.name : 'none'}</span>
      <span data-testid="token">{token || 'none'}</span>
      <button onClick={() => login('a@b.com', 'pw')}>Login</button>
      <button onClick={() => signup('Test', 'a@b.com', 'pw')}>Signup</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => devLogin()}>DevLogin</button>
    </div>
  );
}

function renderAuth() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  it('starts with no user or token', () => {
    renderAuth();
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('token')).toHaveTextContent('none');
  });

  it('login sets user and token on success', async () => {
    API.post.mockResolvedValueOnce({
      data: { success: true, token: 'jwt-123', user: { id: 1, name: 'Alice' } },
    });
    renderAuth();
    await userEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Alice');
      expect(screen.getByTestId('token')).toHaveTextContent('jwt-123');
    });
    expect(localStorage.getItem('token')).toBe('jwt-123');
  });

  it('login returns error message on failure', async () => {
    API.post.mockResolvedValueOnce({
      data: { success: false, message: 'Bad creds' },
    });
    renderAuth();
    await userEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('none');
    });
  });

  it('login handles network errors', async () => {
    API.post.mockRejectedValueOnce({ response: { data: { message: 'Server down' } } });
    renderAuth();
    await userEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('none');
    });
  });

  it('signup calls API correctly', async () => {
    API.post.mockResolvedValueOnce({ data: { success: true, message: 'Registered' } });
    renderAuth();
    await userEvent.click(screen.getByText('Signup'));
    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/signup', {
        name: 'Test',
        email: 'a@b.com',
        password: 'pw',
      });
    });
  });

  it('logout clears state and localStorage', async () => {
    API.post.mockResolvedValueOnce({
      data: { success: true, token: 'tk', user: { id: 1, name: 'Bob' } },
    });
    renderAuth();
    await userEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('Bob'));
    await userEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('token')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('devLogin sets a mock user without API call', async () => {
    renderAuth();
    await userEvent.click(screen.getByText('DevLogin'));
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Premium Member');
      expect(screen.getByTestId('token')).toHaveTextContent('demo-token-123');
    });
  });

  it('restores user from localStorage on mount', () => {
    localStorage.setItem('token', 'saved-tok');
    localStorage.setItem('user', JSON.stringify({ id: 9, name: 'Restored' }));
    renderAuth();
    expect(screen.getByTestId('user')).toHaveTextContent('Restored');
    expect(screen.getByTestId('token')).toHaveTextContent('saved-tok');
  });
});
