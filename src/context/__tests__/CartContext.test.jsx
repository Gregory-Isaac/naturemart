import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../CartContext';

function CartConsumer() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  return (
    <div>
      <span data-testid="count">{cart.length}</span>
      <span data-testid="total">{cartTotal.toFixed(2)}</span>
      <ul>
        {cart.map((item) => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            {item.name} x{item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={() => addToCart({ id: 1, name: 'A', price: 10 })}>Add A</button>
      <button onClick={() => addToCart({ id: 2, name: 'B', price: 20 }, 3)}>Add B x3</button>
      <button onClick={() => removeFromCart(1)}>Remove A</button>
      <button onClick={() => updateQuantity(1, 5)}>Set A qty 5</button>
      <button onClick={() => clearCart()}>Clear</button>
    </div>
  );
}

function renderCart() {
  return render(
    <CartProvider>
      <CartConsumer />
    </CartProvider>
  );
}

describe('CartContext', () => {
  it('starts with an empty cart', () => {
    renderCart();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0.00');
  });

  it('adds a product with default quantity 1', async () => {
    renderCart();
    await userEvent.click(screen.getByText('Add A'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('item-1')).toHaveTextContent('A x1');
    expect(screen.getByTestId('total')).toHaveTextContent('10.00');
  });

  it('adds a product with explicit quantity', async () => {
    renderCart();
    await userEvent.click(screen.getByText('Add B x3'));
    expect(screen.getByTestId('item-2')).toHaveTextContent('B x3');
    expect(screen.getByTestId('total')).toHaveTextContent('60.00');
  });

  it('increments quantity for existing items', async () => {
    renderCart();
    await userEvent.click(screen.getByText('Add A'));
    await userEvent.click(screen.getByText('Add A'));
    expect(screen.getByTestId('item-1')).toHaveTextContent('A x2');
    expect(screen.getByTestId('total')).toHaveTextContent('20.00');
  });

  it('removes a product', async () => {
    renderCart();
    await userEvent.click(screen.getByText('Add A'));
    await userEvent.click(screen.getByText('Remove A'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('updates quantity of an existing item', async () => {
    renderCart();
    await userEvent.click(screen.getByText('Add A'));
    await userEvent.click(screen.getByText('Set A qty 5'));
    expect(screen.getByTestId('item-1')).toHaveTextContent('A x5');
    expect(screen.getByTestId('total')).toHaveTextContent('50.00');
  });

  it('clears the entire cart', async () => {
    renderCart();
    await userEvent.click(screen.getByText('Add A'));
    await userEvent.click(screen.getByText('Add B x3'));
    await userEvent.click(screen.getByText('Clear'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0.00');
  });
});
