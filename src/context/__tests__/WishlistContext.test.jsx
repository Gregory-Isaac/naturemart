import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WishlistProvider, useWishlist } from '../WishlistContext';

beforeEach(() => {
  localStorage.clear();
});

function WishlistConsumer() {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist } = useWishlist();
  return (
    <div>
      <span data-testid="count">{wishlist.length}</span>
      <span data-testid="has-1">{String(isInWishlist(1))}</span>
      <button onClick={() => addToWishlist({ id: 1, name: 'A' })}>Add A</button>
      <button onClick={() => addToWishlist({ id: 2, name: 'B' })}>Add B</button>
      <button onClick={() => removeFromWishlist(1)}>Remove A</button>
      <button onClick={() => toggleWishlist({ id: 1, name: 'A' })}>Toggle A</button>
    </div>
  );
}

function renderWishlist() {
  return render(
    <WishlistProvider>
      <WishlistConsumer />
    </WishlistProvider>
  );
}

describe('WishlistContext', () => {
  it('starts empty', () => {
    renderWishlist();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('has-1')).toHaveTextContent('false');
  });

  it('adds a product', async () => {
    renderWishlist();
    await userEvent.click(screen.getByText('Add A'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('has-1')).toHaveTextContent('true');
  });

  it('does not duplicate a product', async () => {
    renderWishlist();
    await userEvent.click(screen.getByText('Add A'));
    await userEvent.click(screen.getByText('Add A'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('removes a product', async () => {
    renderWishlist();
    await userEvent.click(screen.getByText('Add A'));
    await userEvent.click(screen.getByText('Remove A'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('has-1')).toHaveTextContent('false');
  });

  it('toggles a product in and out', async () => {
    renderWishlist();
    await userEvent.click(screen.getByText('Toggle A'));
    expect(screen.getByTestId('has-1')).toHaveTextContent('true');
    await userEvent.click(screen.getByText('Toggle A'));
    expect(screen.getByTestId('has-1')).toHaveTextContent('false');
  });

  it('persists to localStorage', async () => {
    renderWishlist();
    await userEvent.click(screen.getByText('Add A'));
    const stored = JSON.parse(localStorage.getItem('naturemart_wishlist'));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(1);
  });

  it('restores from localStorage on mount', () => {
    localStorage.setItem('naturemart_wishlist', JSON.stringify([{ id: 3, name: 'C' }]));
    renderWishlist();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });
});
