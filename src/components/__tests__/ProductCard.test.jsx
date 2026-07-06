import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '../../context/CartContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { NotificationProvider } from '../Notification';
import ProductCard from '../ProductCard';

jest.mock('../../images/aloe_vera_gel.png', () => 'aloe-stub', { virtual: true });
jest.mock('../../images/bamboo_toothbrush.png', () => 'bamboo-stub', { virtual: true });
jest.mock('../../images/lavender_oil.png', () => 'lavender-stub', { virtual: true });

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...rest }) => <a href={to} {...rest}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
}));

const sampleProduct = {
  id: 42,
  name: 'Test Plant Oil',
  price: 19.99,
  category: 'Skincare',
  description: 'A fine organic oil.',
  image: 'https://example.com/photo.jpg',
};

function renderCard(product = sampleProduct) {
  return render(
    <CartProvider>
      <WishlistProvider>
        <NotificationProvider>
          <ProductCard product={product} />
        </NotificationProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders product name, price and category', () => {
    renderCard();
    expect(screen.getByText('Test Plant Oil')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('Skincare')).toBeInTheDocument();
  });

  it('renders product description', () => {
    renderCard();
    expect(screen.getByText('A fine organic oil.')).toBeInTheDocument();
  });

  it('renders an image with the correct src', () => {
    renderCard();
    const img = screen.getByAltText('Test Plant Oil');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('has an add-to-cart button', () => {
    renderCard();
    expect(screen.getByLabelText('Add Test Plant Oil to cart')).toBeInTheDocument();
  });

  it('has a wishlist toggle button', () => {
    renderCard();
    expect(screen.getByLabelText(/Test Plant Oil.*wishlist/i)).toBeInTheDocument();
  });

  it('links to the product detail page', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /Test Plant Oil/i });
    expect(link).toHaveAttribute('href', '/product/42');
  });

  it('handles zero price gracefully', () => {
    renderCard({ ...sampleProduct, price: 0 });
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('handles missing price gracefully', () => {
    renderCard({ ...sampleProduct, price: undefined });
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});
