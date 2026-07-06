import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./images/aloe_vera_gel.png', () => 'aloe-stub', { virtual: true });
jest.mock('./images/bamboo_toothbrush.png', () => 'bamboo-stub', { virtual: true });
jest.mock('./images/lavender_oil.png', () => 'lavender-stub', { virtual: true });

jest.mock('./api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  },
}));

jest.mock('react-router-dom', () => ({
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
  Link: ({ children, to, ...rest }) => <a href={to} {...rest}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

jest.mock('./pages/Home', () => () => <div>Home Page</div>);
jest.mock('./pages/Shop', () => () => <div>Shop Page</div>);
jest.mock('./pages/Product', () => () => <div>Product Page</div>);
jest.mock('./pages/Login', () => () => <div>Login Page</div>);
jest.mock('./pages/Signup', () => () => <div>Signup Page</div>);
jest.mock('./pages/Tracking', () => () => <div>Tracking Page</div>);
jest.mock('./pages/Checkout', () => () => <div>Checkout Page</div>);
jest.mock('./pages/Cart', () => () => <div>Cart Page</div>);
jest.mock('./pages/About', () => () => <div>About Page</div>);
jest.mock('./pages/Contact', () => () => <div>Contact Page</div>);
jest.mock('./pages/Privacy', () => () => <div>Privacy Page</div>);
jest.mock('./pages/Messages', () => () => <div>Messages Page</div>);
jest.mock('./pages/Wishlist', () => () => <div>Wishlist Page</div>);
jest.mock('./pages/Profile', () => () => <div>Profile Page</div>);
jest.mock('./pages/FAQ', () => () => <div>FAQ Page</div>);
jest.mock('./pages/AddProduct', () => () => <div>AddProduct Page</div>);
jest.mock('./components/Chatbot', () => () => <div data-testid="chatbot">Chatbot</div>);
jest.mock('./components/ScrollToTop', () => () => <div>ScrollToTop</div>);
jest.mock('./components/Footer', () => () => <footer>Footer</footer>);
jest.mock('./components/Navbar', () => () => <nav><span>Home</span><span>Shop</span></nav>);
jest.mock('./components/PageTransitions', () => ({ children }) => <div>{children}</div>);
jest.mock('framer-motion', () => {
  const mockReact = require('react');
  return {
    AnimatePresence: ({ children }) => mockReact.createElement('div', null, children),
    motion: new Proxy({}, {
      get: (_, tag) => ({ children, ...rest }) => mockReact.createElement(tag, rest, children),
    }),
  };
});

test('renders app with Navbar and Chatbot', () => {
  render(<App />);
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Shop')).toBeInTheDocument();
  expect(screen.getByTestId('chatbot')).toBeInTheDocument();
});

test('renders footer', () => {
  render(<App />);
  expect(screen.getByText('Footer')).toBeInTheDocument();
});
